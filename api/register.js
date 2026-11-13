const { createHash } = require("crypto");
const { cert, getApps, initializeApp } = require("firebase-admin/app");
const { FieldValue, getFirestore: getAdminFirestore } = require("firebase-admin/firestore");

const REGISTRATION_OPENS = "2026-11-13";
const EVENT_NAME = "CodeAdept 10.0";

function getFirestore() {
  if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
    const error = new Error("Required Firebase Admin environment variable is missing.");
    error.code = "registration/firebase-config-missing";
    throw error;
  }

  if (getApps().length === 0) {
    let serviceAccount;
    try {
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    } catch {
      const error = new Error("Firebase Admin service account JSON is invalid.");
      error.code = "registration/firebase-config-invalid";
      throw error;
    }

    if (
      !serviceAccount ||
      typeof serviceAccount.project_id !== "string" ||
      typeof serviceAccount.client_email !== "string" ||
      typeof serviceAccount.private_key !== "string"
    ) {
      const error = new Error("Firebase Admin service account fields are invalid.");
      error.code = "registration/firebase-config-invalid";
      throw error;
    }

    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");
    initializeApp({ credential: cert(serviceAccount) });
  }

  return getAdminFirestore();
}

function safeErrorDetails(error) {
  const rawCode = typeof error?.code === "string" || typeof error?.code === "number"
    ? String(error.code).slice(0, 80)
    : "unknown";
  const diagnostic = `${rawCode} ${error?.message || ""}`.toLowerCase();
  let category = "Firebase operation failed; inspect error name and code.";

  if (/permission[-_ ]denied|(^|\D)7(\D|$)/.test(diagnostic)) {
    category = "Firestore rejected the service account permissions.";
  } else if (/not[-_ ]found|(^|\D)5(\D|$)/.test(diagnostic)) {
    category = "Firestore database or requested resource was not found.";
  } else if (/invalid[-_ ]credential|unauthenticated|(^|\D)16(\D|$)/.test(diagnostic)) {
    category = "Firebase Admin credentials were rejected.";
  } else if (/deadline[-_ ]exceeded|timed? ?out|econnreset|etimedout|(^|\D)4(\D|$)/.test(diagnostic)) {
    category = "Firebase request timed out or the connection was interrupted.";
  } else if (/unavailable|(^|\D)14(\D|$)/.test(diagnostic)) {
    category = "Firestore is temporarily unavailable.";
  } else if (/firebase-config-missing/.test(diagnostic)) {
    category = "FIREBASE_SERVICE_ACCOUNT is not configured.";
  } else if (/firebase-config-invalid/.test(diagnostic)) {
    category = "FIREBASE_SERVICE_ACCOUNT is not valid service account JSON.";
  }

  return {
    name: typeof error?.name === "string" ? error.name.slice(0, 80) : "Error",
    code: rawCode.replace(/[^a-zA-Z0-9_./-]/g, ""),
    category,
  };
}

function todayInIndia() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function validateRegistration(body) {
  const fields = [
    "fullName",
    "collegeRollNumber",
    "enrollmentNumber",
    "emailAddress",
    "mobileNumber",
    "branchDepartment",
    "currentSemester",
  ];

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { error: "Please complete all required fields." };
  }

  const values = {};
  for (const field of fields) {
    if (typeof body[field] !== "string") {
      return { error: "Please complete all required fields." };
    }
    values[field] = body[field].trim();
    if (!values[field]) {
      return { error: "Please complete all required fields." };
    }
  }

  if (Object.values(values).some((value) => value.length > 256)) {
    return { error: "Registration details are too long." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.emailAddress)) {
    return { error: "Enter a valid email address." };
  }
  if (!/^\d+$/.test(values.currentSemester)) {
    return { error: "Enter your current semester as a whole number." };
  }

  const currentSemester = Number(values.currentSemester);
  if (!Number.isSafeInteger(currentSemester) || currentSemester < 1) {
    return { error: "Enter your current semester as a whole number." };
  }

  return {
    values: {
      ...values,
      enrollmentNumber: values.enrollmentNumber.toUpperCase(),
      emailAddress: values.emailAddress.toLowerCase(),
      currentSemester,
    },
  };
}

module.exports = async function register(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ code: "method/not-allowed", message: "Method not allowed." });
  }

  if (todayInIndia() < REGISTRATION_OPENS) {
    return res.status(403).json({
      code: "registration/not-open",
      message: "Registration opens on 13 November 2026.",
    });
  }

  const validated = validateRegistration(req.body);
  if (validated.error) {
    return res.status(400).json({
      code: "registration/invalid-input",
      message: validated.error,
    });
  }

  let operation = "firebase_initialization";
  try {
    const db = getFirestore();
    const { values } = validated;
    const digest = createHash("sha256").update(values.enrollmentNumber, "utf8").digest("hex");
    const registrationId = `ca10_${digest}`;
    const registrationKeyRef = db.collection("registrationKeys").doc(registrationId);
    const registrationRef = db.collection("registrations").doc();

    operation = "firestore_registration_transaction";
    await db.runTransaction(async (transaction) => {
      const existingRegistration = await transaction.get(registrationKeyRef);
      if (existingRegistration.exists) {
        const duplicateError = new Error("This enrollment number is already registered.");
        duplicateError.code = "registration/already-exists";
        throw duplicateError;
      }

      transaction.create(registrationKeyRef, {
        event: EVENT_NAME,
        registeredAt: FieldValue.serverTimestamp(),
      });
      transaction.create(registrationRef, {
        ...values,
        event: EVENT_NAME,
        registrationFee: "FREE",
        participation: "Individual",
        registeredAt: FieldValue.serverTimestamp(),
      });
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    if (error.code === "registration/already-exists") {
      return res.status(409).json({
        code: error.code,
        message: "This enrollment number is already registered.",
      });
    }

    console.error("[registration] backend operation failed", {
      operation,
      error: safeErrorDetails(error),
    });

    if (
      error.code === "registration/firebase-config-missing" ||
      error.code === "registration/firebase-config-invalid"
    ) {
      return res.status(503).json({
        code: "firebase/not-configured",
        message: "Registration is unavailable. Please contact the event organisers.",
      });
    }

    return res.status(500).json({
      code: "registration/failed",
      message: "We could not confirm your registration. Please try again or contact the event organisers.",
    });
  }
};
