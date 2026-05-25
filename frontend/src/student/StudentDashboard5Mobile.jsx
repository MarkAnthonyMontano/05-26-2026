import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { SettingsContext } from "../App";
import API_BASE_URL from "../apiConfig";
import {
  Button,
  Box,
  TextField,
  Container,
  Typography,
  Card,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  FormHelperText,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Modal,
  FormControlLabel,
  Checkbox,
  IconButton,
} from "@mui/material";
// ─── Style tokens (same system as Dashboard3 Mobile) ─────────────────────────
const S = {
  screen: {
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
    fontFamily: "'Segoe UI', sans-serif",
    paddingBottom: 80,
  },
  header: {
    position: "sticky",
    top: 0,
    zIndex: 100,
    backgroundColor: "#6D2323",
    color: "#fff",
    padding: "12px 16px",
    display: "flex",
    alignItems: "center",
    gap: 10,
    boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
  },
  headerTitle: { fontSize: 16, fontWeight: 700, flex: 1, letterSpacing: 0.5 },
  headerSub: { fontSize: 11, opacity: 0.8 },
  stepperWrap: {
    backgroundColor: "#fff",
    padding: "12px 8px",
    borderBottom: "1px solid #e0e0e0",
    display: "flex",
    alignItems: "center",
    overflowX: "auto",
    gap: 0,
  },
  stepItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minWidth: 56,
    cursor: "pointer",
  },
  stepCircle: (active) => ({
    width: 34,
    height: 34,
    borderRadius: "50%",
    backgroundColor: active ? "#6D2323" : "#E8C999",
    color: active ? "#fff" : "#333",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 16,
    border: active ? "2px solid #6D2323" : "2px solid #ccc",
    transition: "all 0.2s",
  }),
  stepLabel: (active) => ({
    fontSize: 9,
    marginTop: 4,
    textAlign: "center",
    color: active ? "#6D2323" : "#666",
    fontWeight: active ? 700 : 400,
    lineHeight: 1.2,
    maxWidth: 52,
  }),
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: "#6D2323",
    alignSelf: "center",
    minWidth: 8,
    marginBottom: 18,
  },
  notice: {
    backgroundColor: "#fffaf5",
    border: "1px solid #6D2323",
    borderRadius: 8,
    margin: "12px 12px 0",
    padding: "10px 12px",
    display: "flex",
    gap: 10,
    alignItems: "flex-start",
  },
  noticeIcon: {
    backgroundColor: "#800000",
    borderRadius: 6,
    width: 32,
    height: 32,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    fontSize: 18,
  },
  noticeText: { fontSize: 12, color: "#3e3e3e", lineHeight: 1.5 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    margin: "12px 12px 0",
    overflow: "hidden",
    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
  },
  cardHeader: {

    color: "#fff",
    padding: "10px 14px",
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: 0.3,
  },
  cardBody: { padding: "14px 14px" },
  fieldWrap: { marginBottom: 14 },
  label: {
    display: "block",
    fontSize: 12,
    fontWeight: 600,
    color: "#444",
    marginBottom: 5,
  },
  divider: {
    border: "none",
    borderTop: "1px solid #e0e0e0",
    margin: "14px 0 10px",
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: 700,
    color: "#6D2323",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  bottomBar: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTop: "1px solid #e0e0e0",
    padding: "10px 14px",
    display: "flex",
    gap: 10,
    zIndex: 200,
  },
  btnPrimary: {
    flex: 1,
    height: 46,
    backgroundColor: "#6D2323",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
  },
  btnSecondary: {
    flex: 1,
    height: 46,
    backgroundColor: "#fff",
    color: "#6D2323",
    border: "2px solid #6D2323",
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
  },
  toast: (severity) => ({
    position: "fixed",
    top: 16,
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 9999,
    backgroundColor:
      severity === "success"
        ? "#2e7d32"
        : severity === "error"
          ? "#c62828"
          : "#e65100",
    color: "#fff",
    padding: "10px 20px",
    borderRadius: 24,
    fontSize: 13,
    boxShadow: "0 3px 10px rgba(0,0,0,0.25)",
    maxWidth: "90vw",
    textAlign: "center",
  }),
  consentBox: {
    backgroundColor: "#fafafa",
    border: "1px solid #e0e0e0",
    borderRadius: 8,
    padding: "14px",
    maxHeight: 320,
    overflowY: "auto",
  },
  consentText: {
    fontSize: 12,
    color: "#444",
    lineHeight: 1.7,
    marginBottom: 10,
  },
  agreeRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#fff3f3",
    border: "1px solid #6D2323",
    borderRadius: 8,
    padding: "12px 14px",
    marginTop: 16,
  },
  agreeLabel: {
    fontSize: 14,
    fontWeight: 600,
    color: "#6D2323",
    flex: 1,
  },
  errorText: {
    color: "#d32f2f",
    fontSize: 11,
    marginTop: 6,
    paddingLeft: 4,
  },
};

const STEP_ICONS = ["👤", "👨‍👩‍👧", "🎓", "🏥", "ℹ️"];
const STEP_LABELS = ["Personal\nInfo", "Family\nBG", "Education", "Health", "Other"];
const STEP_PATHS = [
  "/student_dashboard1",
  "/student_dashboard2",
  "/student_dashboard3",
  "/student_dashboard4",
  "/student_dashboard5",
];

// ─── Main Component ───────────────────────────────────────────────────────────
const StudentDashboard5Mobile = () => {
  const settings = useContext(SettingsContext);

  const [titleColor, setTitleColor] = useState("#000000");
  const [subtitleColor, setSubtitleColor] = useState("#555555");
  const [borderColor, setBorderColor] = useState("#000000");
  const [mainButtonColor, setMainButtonColor] = useState("#1976d2");
  const [subButtonColor, setSubButtonColor] = useState("#ffffff");   // ✅ NEW
  const [stepperColor, setStepperColor] = useState("#000000");       // ✅ NEW

  const [fetchedLogo, setFetchedLogo] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [shortTerm, setShortTerm] = useState("");
  const [campusAddress, setCampusAddress] = useState("");
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    if (!settings) return;

    // 🎨 Colors
    if (settings.title_color) setTitleColor(settings.title_color);
    if (settings.subtitle_color) setSubtitleColor(settings.subtitle_color);
    if (settings.border_color) setBorderColor(settings.border_color);
    if (settings.main_button_color) setMainButtonColor(settings.main_button_color);
    if (settings.sub_button_color) setSubButtonColor(settings.sub_button_color);
    if (settings.stepper_color) setStepperColor(settings.stepper_color);

    // 🏫 Logo
    if (settings.logo_url) {
      setFetchedLogo(`${API_BASE_URL}${settings.logo_url}`);
    } else {
      setFetchedLogo(EaristLogo);
    }

    // 🏷️ School Info
    if (settings.company_name) setCompanyName(settings.company_name);
    if (settings.short_term) setShortTerm(settings.short_term);
    if (settings.campus_address) setCampusAddress(settings.campus_address);

    // ✅ Branches (JSON stored in DB)
    if (settings.branches) {
      setBranches(
        typeof settings.branches === "string"
          ? JSON.parse(settings.branches)
          : settings.branches
      );
    }

  }, [settings]);

  const navigate = useNavigate();
  const location = useLocation();

  const [userID, setUserID] = useState("");

  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "warning",
  });

  const [person, setPerson] = useState({
    termsOfAgreement: "",
  });

  const showSnackbar = (message, severity = "warning") => {
    setSnackbar({ open: true, message, severity });
    setTimeout(() => setSnackbar((p) => ({ ...p, open: false })), 3000);
  };

  // Settings
  useEffect(() => {
    if (!settings) return;
    if (settings.short_term) setShortTerm(settings.short_term);
    if (settings.company_name) setCompanyName(settings.company_name);
  }, [settings]);

  // Auth + load person
  useEffect(() => {
    const loggedInPersonId = localStorage.getItem("person_id");
    if (!loggedInPersonId) {
      window.location.href = "/login";
      return;
    }
    const queryParams = new URLSearchParams(location.search);
    const queryPersonId = queryParams.get("person_id");
    setUserID(queryPersonId || loggedInPersonId);
  }, [location.search]);

  useEffect(() => {
    if (!userID) return;
    axios
      .get(`${API_BASE_URL}/api/student_data_as_applicant/${userID}`)
      .then((res) => {
        if (res.data) setPerson(res.data);
      })
      .catch(console.error);
  }, [userID]);

  const handleUpdate = async (updated) => {
    try {
      const { person_id, created_at, current_step, ...clean } = updated;
      await axios.put(
        `${API_BASE_URL}/api/enrollment/person/${userID}`,
        clean
      );
    } catch (err) {
      console.error("Auto-save failed:", err);
    }
  };

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    const updated = {
      ...person,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    };
    setPerson(updated);
    handleUpdate(updated);
  };

  const isFormValid = () => {
    const newErrors = {};
    if (person.termsOfAgreement !== 1) {
      newErrors.termsOfAgreement = true;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const institutionName = shortTerm
    ? `${companyName || ""} (${shortTerm.toUpperCase()})`
    : companyName || "the institution";

  const shortName = shortTerm
    ? shortTerm.toUpperCase()
    : companyName || "the University";

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={S.screen}>
      {snackbar.open && (
        <div style={S.toast(snackbar.severity)}>{snackbar.message}</div>
      )}

      {/* Header */}
      <div style={{
        ...S.header,
        backgroundColor: settings?.header_color || "#1976d2",
      }}>
        <div>
          <div style={S.headerTitle}>OTHER INFORMATION</div>
          <div style={S.headerSub}>{companyName || "Student Enrollment"}</div>
        </div>
      </div>

      {/* Stepper */}
      <div style={S.stepperWrap}>
        {STEP_LABELS.map((label, i) => (
          <React.Fragment key={i}>
            <div style={S.stepItem} onClick={() => navigate(STEP_PATHS[i])}>
              <div style={S.stepCircle(i === 4)}>{STEP_ICONS[i]}</div>
              <div style={S.stepLabel(i === 4)}>{label}</div>
            </div>
            {i < STEP_LABELS.length - 1 && <div style={S.stepLine} />}
          </React.Fragment>
        ))}
      </div>

      {/* Notice */}
      <div style={S.notice}>
        <div style={S.noticeIcon}>⚠️</div>
        <div style={S.noticeText}>
          <strong style={{ color: "maroon" }}>Notice:</strong> &nbsp;
          <strong></strong>
          <span style={{ fontSize: '1.2em', margin: '0 15px' }}>➔</span>
          Please indicate “NA” or “N/A” in fields where the requested information is not applicable or no response can be provided.
          &nbsp;&nbsp;<br />

          <strong></strong>
          <span
            style={{
              fontSize: '1.2em',
              margin: '0 15px',
              marginLeft: '100px',
            }}
          >
            ➔
          </span>
          To enter the letter “Ñ”, press and hold the ALT key while typing “165”. For “ñ”, press and hold the ALT key while typing “164”.
        </div>
      </div>

      {/* Step indicator */}
      <div style={{ padding: "16px 14px 0", textAlign: "center" }}>
        <Container>
          <h1
            style={{
              fontSize: "32px",
              fontWeight: "bold",
              textAlign: "center",
              color: subtitleColor,
              marginTop: "25px",
            }}
          >
            APPLICANT FORM
          </h1>
          <div style={{ textAlign: "center" }}>
            Complete the applicant form to secure your place for the upcoming
            academic year at{" "}
            {shortTerm ? (
              <>
                <strong>{shortTerm.toUpperCase()}</strong> <br />
                {companyName || ""}
              </>
            ) : (
              companyName || ""
            )}
            .
          </div>
        </Container>
      </div>
      {/* ── Data Subject Consent Form ─────────────────────────────────── */}
      <div style={S.card}>
        <div style={{
          ...S.cardHeader,
          backgroundColor: settings?.header_color || "#1976d2",
        }}>📄 Data Subject Consent Form</div>
        <div style={S.cardBody}>
          <div style={{ fontSize: 12, color: "#555", marginBottom: 12, lineHeight: 1.6 }}>
            In accordance with RA 10173 or Data Privacy Act of 2012, I give my
            consent to the following terms and conditions on the collection,
            use, processing, and disclosure of my personal data:
          </div>

          <div style={S.consentBox}>
            <p style={S.consentText}>
              <strong>1.</strong> I am aware that the {institutionName} has
              collected and stored my personal data during my
              admission/enrollment. This data includes my demographic profile,
              contact details like home address, email address, landline
              numbers, and mobile numbers.
            </p>

            <p style={S.consentText}>
              <strong>2.</strong> I agree to personally update these data
              through personal request from the Office of the Registrar.
            </p>

            <p style={S.consentText}>
              <strong>3.</strong> In consonance with the above stated Act, I am
              aware that the University will protect my school records related
              to my being a student/graduate of {shortName}. However, I have
              the right to authorize a representative to claim the same subject
              to the policy of the University.
            </p>

            <p style={S.consentText}>
              <strong>4.</strong> In order to promote efficient management of
              the organization's records, I authorize the University to manage
              my data for data sharing with industry partners, government
              agencies/embassies, other educational institutions, and other
              offices for the university for employment, statistics,
              immigration, transfer credentials, and other legal purposes that
              may serve me best.
            </p>

            <p style={{ ...S.consentText, marginBottom: 0 }}>
              By clicking the submit button, I warrant that I have read,
              understood all of the above provisions, and agreed to its full
              implementation.
            </p>
          </div>

          <hr style={S.divider} />

          <p style={{ ...S.consentText, fontStyle: "italic", color: "#555" }}>
            I certify that the information given above are true, complete, and
            accurate to the best of my knowledge and belief. I promise to abide
            by the rules and regulations of {institutionName} regarding the ECAT
            and my possible admission. I am aware that any false or misleading
            information and/or statement may result in the refusal or
            disqualification of my admission to the institution.
          </p>

          {/* Agreement Checkbox */}
          <div
            style={{
              ...S.agreeRow,
              border: errors.termsOfAgreement
                ? "1px solid #d32f2f"
                : "1px solid #6D2323",
              backgroundColor: errors.termsOfAgreement ? "#fff5f5" : "#fff3f3",
            }}
          >
            <input
              type="checkbox"
              name="termsOfAgreement"
              checked={person.termsOfAgreement === 1}
              onChange={handleChange}
              style={{
                width: 22,
                height: 22,
                accentColor: "#6D2323",
                flexShrink: 0,
                cursor: "pointer",
              }}
            />
            <span style={S.agreeLabel}>I agree to the Terms of Agreement</span>
          </div>

          {errors.termsOfAgreement && (
            <div style={S.errorText}>
              ⚠️ You must agree to the Terms of Agreement to proceed.
            </div>
          )}
        </div>
      </div>

      {/* ── Summary reminder ──────────────────────────────────────────── */}
      <div style={{ ...S.card, marginBottom: 16 }}>
        <div
          style={{
            ...S.cardHeader,
            backgroundColor: "#4a4a4a",
          }}
        >
          ✅ Final Step
        </div>
        <div style={S.cardBody}>
          <div style={{ fontSize: 13, color: "#333", lineHeight: 1.6 }}>
            You are on the last step of the application form. Once you submit,
            your information will be saved and you will be directed to the
            online requirements page. Make sure all previous steps are
            completed before submitting.
          </div>
        </div>
      </div>

      {/* Bottom Nav */}
      <div style={S.bottomBar}>
        <button
          style={S.btnSecondary}
          onClick={() => {
            handleUpdate(person);
            navigate("/student_dashboard4");
          }}
        >
          ← Previous
        </button>
        <button
          style={S.btnPrimary}
          onClick={() => {
            handleUpdate(person);
            if (isFormValid()) {
              navigate("/student_online_requirements");
            } else {
              showSnackbar(
                "Please agree to the Terms of Agreement before submitting.",
                "error"
              );
            }
          }}
        >
          Submit →
        </button>
      </div>
    </div>
  );
};

export default StudentDashboard5Mobile;
