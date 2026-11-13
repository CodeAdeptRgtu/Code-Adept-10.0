const { createHash } = require("crypto");
const admin = require("firebase-admin");

const REGISTRATION_OPENS = "2026-11-13";
const EVENT_NAME = "CodeAdept 10.0";

function getFirestore() {
  if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
    throw new Error("Firebase Admin is not configured.");
  }

  if (admin.apps.length === 0) {
    let serviceAccount;
    try {
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    } catch {
      throw new Error("Firebase Admin configuration is invalid.");
    }

    if (
      !serviceAccount ||
      typeof serviceAccount.project_id !== "string" ||
      typeof serviceAccount.client_email !== "string" ||
      typeof serviceAccount.private_key !== "string"
    ) {
      throw new Error("Firebase Admin configuration is invalid.");
    }

    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
  }

  return admin.firestore();
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

  try {
    const db = getFirestore();
    const { values } = validated;
    const digest = createHash("sha256").update(values.enrollmentNumber, "utf8").digest("hex");
    const registrationId = `ca10_${digest}`;
    const registrationKeyRef = db.collection("registrationKeys").doc(registrationId);
    const registrationRef = db.collection("registrations").doc();

    await db.runTransaction(async (transaction) => {
      const existingRegistration = await transaction.get(registrationKeyRef);
      if (existingRegistration.exists) {
        const duplicateError = new Error("This enrollment number is already registered.");
        duplicateError.code = "registration/already-exists";
        throw duplicateError;
      }

      transaction.create(registrationKeyRef, {
        event: EVENT_NAME,
        registeredAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      transaction.create(registrationRef, {
        ...values,
        event: EVENT_NAME,
        registrationFee: "FREE",
        participation: "Individual",
        registeredAt: admin.firestore.FieldValue.serverTimestamp(),
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

    if (error.message === "Firebase Admin is not configured.") {
      return res.status(503).json({
        code: "firebase/not-configured",
        message: "Registration is unavailable. Please contact the event organisers.",
      });
    }

    // Avoid logging request data or credential-related errors.
    console.error("Registration submission failed.");
    return res.status(500).json({
      code: "registration/failed",
      message: "We could not confirm your registration. Please try again or contact the event organisers.",
    });
  }
};
