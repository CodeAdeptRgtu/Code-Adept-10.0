import { useEffect, useRef, useState } from "react";
import {
  collection,
  doc,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "./firebase";
import "./Registration.css";

const REGISTRATION_OPENS = "2026-11-13";
const EMPTY_FORM = {
  fullName: "",
  collegeRollNumber: "",
  enrollmentNumber: "",
  emailAddress: "",
  mobileNumber: "",
  branchDepartment: "",
  currentSemester: "",
};

const todayInIndia = () =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

const hashEnrollmentNumber = async (enrollmentNumber) => {
  if (!window.crypto?.subtle) {
    throw new Error("A secure browser connection is required to register.");
  }

  const bytes = new TextEncoder().encode(enrollmentNumber);
  const digest = await window.crypto.subtle.digest("SHA-256", bytes);
  const hexDigest = Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0")
  ).join("");

  return `ca10_${hexDigest}`;
};

function Registration() {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationOpen, setRegistrationOpen] = useState(
    () => todayInIndia() >= REGISTRATION_OPENS
  );
  const submissionLock = useRef(false);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setRegistrationOpen(todayInIndia() >= REGISTRATION_OPENS);
    }, 60_000);

    return () => window.clearInterval(timer);
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submissionLock.current) return;

    if (!registrationOpen && todayInIndia() < REGISTRATION_OPENS) {
      setError("Registration opens on 13 November 2026.");
      return;
    }

    if (!isFirebaseConfigured) {
      setError(
        "Registration is unavailable because Firebase is not configured for this deployment."
      );
      return;
    }

    const cleaned = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [key, value.trim()])
    );

    const missingField = Object.entries(cleaned).find(([, value]) => !value);
    if (missingField) {
      setError("Please complete all required fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleaned.emailAddress)) {
      setError("Enter a valid email address.");
      return;
    }

    if (!/^\d+$/.test(cleaned.currentSemester)) {
      setError("Enter your current semester as a whole number.");
      return;
    }

    submissionLock.current = true;
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const normalizedEnrollment = cleaned.enrollmentNumber.toUpperCase();
      const registrationId = await hashEnrollmentNumber(normalizedEnrollment);
      const registrationKeyRef = doc(db, "registrationKeys", registrationId);
      const registrationRef = doc(collection(db, "registrations"));

      await runTransaction(db, async (transaction) => {
        const existingRegistration = await transaction.get(registrationKeyRef);

        if (existingRegistration.exists()) {
          const duplicateError = new Error("This enrollment number is registered already.");
          duplicateError.code = "registration/already-exists";
          throw duplicateError;
        }

        transaction.set(registrationKeyRef, {
          event: "CodeAdept 10.0",
          registeredAt: serverTimestamp(),
        });
        transaction.set(registrationRef, {
          ...cleaned,
          enrollmentNumber: normalizedEnrollment,
          emailAddress: cleaned.emailAddress.toLowerCase(),
          currentSemester: Number(cleaned.currentSemester),
          event: "CodeAdept 10.0",
          registrationFee: "FREE",
          participation: "Individual",
          registeredAt: serverTimestamp(),
        });
      });

      setFormData(EMPTY_FORM);
      setSuccess("Registration confirmed. Your details were saved successfully.");
    } catch (submissionError) {
      if (submissionError.code === "registration/already-exists") {
        setError("This enrollment number is already registered.");
      } else if (submissionError.code === "permission-denied") {
        setError(
          "Firebase denied this registration. Please contact the event organisers."
        );
      } else if (submissionError.code === "unavailable") {
        setError("Registration could not reach Firebase. Check your connection and try again.");
      } else {
        setError(
          "We could not confirm your registration. Please try again or contact the event organisers."
        );
      }
    } finally {
      submissionLock.current = false;
      setIsSubmitting(false);
    }
  };

  const fields = [
    { name: "fullName", label: "Full Name", autoComplete: "name" },
    { name: "collegeRollNumber", label: "College Roll Number" },
    { name: "enrollmentNumber", label: "Enrollment Number" },
    {
      name: "emailAddress",
      label: "Email Address",
      type: "email",
      autoComplete: "email",
    },
    {
      name: "mobileNumber",
      label: "Mobile Number",
      type: "tel",
      autoComplete: "tel",
    },
    { name: "branchDepartment", label: "Branch / Department" },
    {
      name: "currentSemester",
      label: "Current Semester",
      type: "number",
      min: "1",
      step: "1",
    },
  ];

  return (
    <main className="registration-page">
      <section className="registration-panel" aria-labelledby="registration-title">
        <p className="registration-kicker">CODEADEPT 10.0</p>
        <h1 id="registration-title">Register for the competition</h1>
        <p className="registration-intro">
          Individual participation · Free entry · Open to UIT RGPV students
        </p>

        <div className="registration-opening">
          <strong>
            {registrationOpen
              ? "Registration is open"
              : "Registration opens 13 November 2026"}
          </strong>
          <span>Organised by the Department of Information Technology, UIT RGPV</span>
        </div>

        {!isFirebaseConfigured && (
          <p className="registration-alert" role="alert">
            Firebase is not configured for this deployment. Registration cannot
            be submitted until the existing Firebase environment is provided.
          </p>
        )}

        <form className="registration-fields" onSubmit={handleSubmit}>
          {fields.map((field) => (
            <div className="registration-field" key={field.name}>
              <label htmlFor={field.name}>{field.label}</label>
              <input
                id={field.name}
                name={field.name}
                type={field.type || "text"}
                autoComplete={field.autoComplete || "off"}
                min={field.min}
                step={field.step}
                value={formData[field.name]}
                onChange={handleChange}
                required
              />
            </div>
          ))}

          {error && (
            <p className="registration-message registration-error" role="alert">
              {error}
            </p>
          )}
          {success && (
            <p className="registration-message registration-success" role="status">
              {success}
            </p>
          )}

          {!registrationOpen && (
            <p className="registration-note" role="status">
              The form will be available from 13 November 2026.
            </p>
          )}

          <button
            className="registration-submit"
            type="submit"
            disabled={!registrationOpen || !isFirebaseConfigured || isSubmitting}
          >
            {isSubmitting
              ? "Submitting registration…"
              : !isFirebaseConfigured
                ? "Registration unavailable"
                : registrationOpen
                  ? "Submit registration"
                  : "Opens 13 November 2026"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default Registration;
