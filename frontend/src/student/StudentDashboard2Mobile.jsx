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
// ─── Shared mobile style tokens ──────────────────────────────────────────────
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
    color: "#fff",
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
  subHeader: {
    fontSize: 13,
    fontWeight: 700,
    color: "#6D2323",
    marginBottom: 8,
    marginTop: 14,
    paddingBottom: 4,
    borderBottom: "1px solid #e0e0e0",
  },
  fieldWrap: { marginBottom: 14 },
  label: {
    display: "block",
    fontSize: 12,
    fontWeight: 600,
    color: "#444",
    marginBottom: 5,
  },
  required: { color: "#d32f2f" },
  input: (hasError) => ({
    width: "100%",
    height: 42,
    padding: "0 12px",
    border: `1px solid ${hasError ? "#d32f2f" : "#ccc"}`,
    borderRadius: 8,
    fontSize: 14,
    backgroundColor: "#fff",
    boxSizing: "border-box",
    outline: "none",
    color: "#222",
  }),
  select: (hasError) => ({
    width: "100%",
    height: 42,
    padding: "0 12px",
    border: `1px solid ${hasError ? "#d32f2f" : "#ccc"}`,
    borderRadius: 8,
    fontSize: 14,
    backgroundColor: "#fff",
    boxSizing: "border-box",
    outline: "none",
    color: "#222",
    appearance: "none",
    WebkitAppearance: "none",
    backgroundImage:
      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23666' stroke-width='1.5' fill='none'/%3E%3C/svg%3E\")",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 12px center",
    paddingRight: 32,
  }),
  helperError: { color: "#d32f2f", fontSize: 11, marginTop: 3 },
  row: { display: "flex", gap: 10 },
  flex1: { flex: 1 },
  checkRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
    fontSize: 13,
    color: "#333",
    cursor: "pointer",
  },
  checkbox: { width: 18, height: 18, accentColor: "#6D2323", cursor: "pointer" },
  deceasedBanner: {
    backgroundColor: "#FFF3E0",
    border: "1px solid #FFA726",
    borderRadius: 8,
    padding: "10px 12px",
    fontSize: 12,
    color: "#E65100",
    marginBottom: 10,
    display: "flex",
    alignItems: "center",
    gap: 8,
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
      severity === "success" ? "#2e7d32" : severity === "error" ? "#c62828" : "#e65100",
    color: "#fff",
    padding: "10px 20px",
    borderRadius: 24,
    fontSize: 13,
    boxShadow: "0 3px 10px rgba(0,0,0,0.25)",
    maxWidth: "90vw",
    textAlign: "center",
  }),
};

const STEP_ICONS = ["👤", "👨‍👩‍👧", "🎓", "🏥", "ℹ️"];
const STEP_LABELS = ["Personal\nInfo", "Family\nBG", "Education", "Health", "Other"];
const STEP_PATHS = [
  "/student_dashboard1", "/student_dashboard2", "/student_dashboard3",
  "/student_dashboard4", "/student_dashboard5",
];

const handleNext = () => {
  handleUpdate(person);
  if (isFormValid()) {
    navigate("/student_dashboard3");
  } else {
    showSnackbar("Please fill all required fields before proceeding.", "error");
  }
};


// ─── Reusable field components ────────────────────────────────────────────────
const Field = ({ label, required, error, helperText, children }) => (
  <div style={S.fieldWrap}>
    {label && (
      <label style={S.label}>
        {label}{required && <span style={S.required}> *</span>}
      </label>
    )}
    {children}
    {error && helperText && <div style={S.helperError}>{helperText}</div>}
  </div>
);

const MInput = ({ error, style, ...props }) => (
  <input style={{ ...S.input(error), ...style }} {...props} />
);

const MSelect = ({ error, style, children, ...props }) => (
  <select style={{ ...S.select(error), ...style }} {...props}>
    {children}
  </select>
);

// ─── Extension options ────────────────────────────────────────────────────────
const EXT_OPTIONS = ["Jr.", "Sr.", "I", "II", "III", "IV", "V"];

// ─── Main Component ──────────────────────────────────────────────────────────
const StudentDashboard2Mobile = () => {
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
  const [userRole, setUserRole] = useState("");

  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "warning" });
  const [errors, setErrors] = useState({});
  const [soloParentChoice, setSoloParentChoice] = useState("");

  const [person, setPerson] = useState({
    solo_parent: 0, father_deceased: 0, mother_deceased: 0,
    father_family_name: "", father_given_name: "", father_middle_name: "",
    father_ext: "", father_nickname: "", father_education: 0,
    father_education_level: "", father_last_school: "", father_course: "",
    father_year_graduated: "", father_school_address: "", father_contact: "",
    father_occupation: "", father_employer: "", father_income: "", father_email: "",
    mother_family_name: "", mother_given_name: "", mother_middle_name: "",
    mother_ext: "", mother_nickname: "", mother_education: 0,
    mother_education_level: "", mother_last_school: "", mother_course: "",
    mother_year_graduated: "", mother_school_address: "", mother_contact: "",
    mother_occupation: "", mother_employer: "", mother_income: "", mother_email: "",
    guardian: "", guardian_family_name: "", guardian_given_name: "",
    guardian_middle_name: "", guardian_ext: "", guardian_nickname: "",
    guardian_address: "", guardian_contact: "", guardian_email: "",
    annual_income: "",
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

  // Auth
  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    const loggedInPersonId = localStorage.getItem("person_id");
    if (!loggedInPersonId) { window.location.href = "/login"; return; }
    setUserRole(storedRole);
    const queryParams = new URLSearchParams(location.search);
    const queryPersonId = queryParams.get("person_id");
    setUserID(queryPersonId || loggedInPersonId);
  }, [location.search]);

  // Load person data
  useEffect(() => {
    if (!userID) return;
    axios.get(`${API_BASE_URL}/api/student_data_as_applicant/${userID}`)
      .then((res) => { if (res.data) setPerson(res.data); })
      .catch(console.error);
  }, [userID]);

  // Helpers
  const handleUpdate = async (updated) => {
    try {
      const { person_id, created_at, current_step, ...clean } = updated;
      await axios.put(`${API_BASE_URL}/api/enrollment/person/${userID}`, clean);
    } catch (err) { console.error("Auto-save failed:", err); }
  };

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    const updated = { ...person, [name]: type === "checkbox" ? (checked ? 1 : 0) : value };

    // Auto-calculate annual income from both incomes
    if (name === "mother_income" || name === "father_income") {
      const m = parseFloat(name === "mother_income" ? value : updated.mother_income) || 0;
      const f = parseFloat(name === "father_income" ? value : updated.father_income) || 0;
      const total = m + f;
      if (total <= 80000) updated.annual_income = "80,000 and below";
      else if (total <= 135000) updated.annual_income = "80,000 to 135,000";
      else if (total <= 250000) updated.annual_income = "135,000 to 250,000";
      else if (total <= 500000) updated.annual_income = "250,000 to 500,000";
      else if (total <= 1000000) updated.annual_income = "500,000 to 1,000,000";
      else updated.annual_income = "1,000,000 and above";
    }

    setPerson(updated);
    handleUpdate(updated);
  };

  const handleGuardianChange = (e) => {
    const { value } = e.target;
    let updated = { ...person, guardian: value };
    if (value === "Father") {
      updated = { ...updated, guardian_family_name: person.father_family_name || "", guardian_given_name: person.father_given_name || "", guardian_middle_name: person.father_middle_name || "", guardian_ext: person.father_ext || "", guardian_nickname: person.father_nickname || "", guardian_contact: person.father_contact || "", guardian_email: person.father_email || "" };
    }
    if (value === "Mother") {
      updated = { ...updated, guardian_family_name: person.mother_family_name || "", guardian_given_name: person.mother_given_name || "", guardian_middle_name: person.mother_middle_name || "", guardian_ext: person.mother_ext || "", guardian_nickname: person.mother_nickname || "", guardian_contact: person.mother_contact || "", guardian_email: person.mother_email || "" };
    }
    setPerson(updated);
    handleUpdate(updated);
  };

  const isFormValid = () => {
    const required = [];
    if (person.father_deceased !== 1) {
      required.push("father_family_name", "father_given_name", "father_contact", "father_occupation", "father_employer", "father_income");
      if (person.father_education !== 1) required.push("father_education_level", "father_last_school", "father_course", "father_year_graduated", "father_school_address");
    }
    if (person.mother_deceased !== 1) {
      required.push("mother_family_name", "mother_given_name", "mother_contact", "mother_occupation", "mother_employer", "mother_income");
      if (person.mother_education !== 1) required.push("mother_education_level", "mother_last_school", "mother_course", "mother_year_graduated", "mother_school_address");
    }
    required.push("guardian", "guardian_family_name", "guardian_given_name", "guardian_address", "guardian_contact", "annual_income");
    const newErrors = {};
    required.forEach((f) => { if (!person[f]?.toString().trim()) newErrors[f] = true; });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFatherDeceased = person.father_deceased === 1;
  const isMotherDeceased = person.mother_deceased === 1;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={S.screen}>
      {snackbar.open && <div style={S.toast(snackbar.severity)}>{snackbar.message}</div>}

      {/* Header */}
      <div style={{
        ...S.header,
        backgroundColor: settings?.header_color || "#1976d2",
      }}>
        <div>
          <div style={S.headerTitle}>FAMILY BACKGROUND</div>
          <div style={S.headerSub}>{companyName || "Student Enrollment"}</div>
        </div>
      </div>

      {/* Stepper */}
      <div style={S.stepperWrap}>
        {STEP_LABELS.map((label, i) => (
          <React.Fragment key={i}>
            <div style={S.stepItem} onClick={() => navigate(STEP_PATHS[i])}>
              <div style={S.stepCircle(i === 1)}>{STEP_ICONS[i]}</div>
              <div style={S.stepLabel(i === 1)}>{label}</div>
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

      {/* ── Solo Parent ───────────────────────────────────────────────── */}
      <div style={S.card}>
        <div style={{
          ...S.cardHeader,
          backgroundColor: settings?.header_color || "#1976d2",
        }}>👨‍👩‍👧 Family Information</div>
        <div style={S.cardBody}>
          <label style={S.checkRow}>
            <input
              type="checkbox"
              style={S.checkbox}
              checked={person.solo_parent === 1}
              onChange={(e) => {
                const checked = e.target.checked;
                const updated = { ...person, solo_parent: checked ? 1 : 0 };
                if (!checked) { updated.father_deceased = 0; updated.mother_deceased = 0; }
                setPerson(updated);
                handleUpdate(updated);
              }}
            />
            Solo Parent
          </label>

          {person.solo_parent === 1 && (
            <Field label="Solo Parent Type">
              <MSelect
                value={soloParentChoice}
                onChange={(e) => {
                  const choice = e.target.value;
                  setSoloParentChoice(choice);
                  const updated = { ...person, father_deceased: choice === "Mother" ? 1 : 0, mother_deceased: choice === "Father" ? 1 : 0 };
                  setPerson(updated);
                  handleUpdate(updated);
                }}
              >
                <option value="">Select...</option>
                <option value="Father">Father (Mother is solo parent)</option>
                <option value="Mother">Mother (Father is solo parent)</option>
              </MSelect>
            </Field>
          )}
        </div>
      </div>

      {/* ── Father's Details ──────────────────────────────────────────── */}
      <div style={S.card}>
        <div style={{
          ...S.cardHeader,
          backgroundColor: settings?.header_color || "#1976d2",
        }}>👨 Father's Details</div>
        <div style={S.cardBody}>
          <label style={S.checkRow}>
            <input
              type="checkbox"
              style={S.checkbox}
              checked={person.father_deceased === 1}
              onChange={(e) => {
                const checked = e.target.checked;
                const updated = { ...person, father_deceased: checked ? 1 : 0 };
                setPerson(updated);
                handleUpdate(updated);
              }}
            />
            Father Separated / Deceased
          </label>

          {isFatherDeceased ? (
            <div style={S.deceasedBanner}>
              ⚠️ Father marked as separated/deceased. Fields hidden.
            </div>
          ) : (
            <>
              <div style={S.row}>
                <div style={S.flex1}>
                  <Field label="Last Name" required error={errors.father_family_name} helperText="Required">
                    <MInput name="father_family_name" value={(person.father_family_name || "").toUpperCase()} onChange={(e) => handleChange({ target: { name: "father_family_name", value: e.target.value.toUpperCase() } })} error={errors.father_family_name} placeholder="Last Name" />
                  </Field>
                </div>
                <div style={S.flex1}>
                  <Field label="First Name" required error={errors.father_given_name} helperText="Required">
                    <MInput name="father_given_name" value={(person.father_given_name || "").toUpperCase()} onChange={(e) => handleChange({ target: { name: "father_given_name", value: e.target.value.toUpperCase() } })} error={errors.father_given_name} placeholder="First Name" />
                  </Field>
                </div>
              </div>

              <div style={S.row}>
                <div style={S.flex1}>
                  <Field label="Middle Name">
                    <MInput name="father_middle_name" value={(person.father_middle_name || "").toUpperCase()} onChange={(e) => handleChange({ target: { name: "father_middle_name", value: e.target.value.toUpperCase() } })} placeholder="Middle Name" />
                  </Field>
                </div>
                <div style={{ width: 110 }}>
                  <Field label="Extension">
                    <MSelect name="father_ext" value={person.father_ext || ""} onChange={handleChange}>
                      <option value="">None</option>
                      {EXT_OPTIONS.map((v) => <option key={v} value={v}>{v}</option>)}
                    </MSelect>
                  </Field>
                </div>
              </div>

              <Field label="Nickname">
                <MInput name="father_nickname" value={person.father_nickname || ""} onChange={handleChange} placeholder="Nickname" />
              </Field>

              {/* Father Education */}
              <div style={S.subHeader}>📚 Father's Educational Background</div>
              <label style={S.checkRow}>
                <input
                  type="checkbox"
                  style={S.checkbox}
                  checked={person.father_education === 1}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    const updated = { ...person, father_education: checked ? 1 : 0, ...(checked ? { father_education_level: "", father_last_school: "", father_course: "", father_year_graduated: "", father_school_address: "" } : {}) };
                    setPerson(updated);
                    handleUpdate(updated);
                  }}
                />
                Father's education not applicable
              </label>

              {person.father_education !== 1 && (
                <>
                  <Field label="Education Level" required error={errors.father_education_level} helperText="Required">
                    <MInput name="father_education_level" value={person.father_education_level || ""} onChange={handleChange} error={errors.father_education_level} placeholder="e.g. College Graduate" />
                  </Field>
                  <div style={S.row}>
                    <div style={S.flex1}>
                      <Field label="Last School Attended" required error={errors.father_last_school} helperText="Required">
                        <MInput name="father_last_school" value={person.father_last_school || ""} onChange={handleChange} error={errors.father_last_school} placeholder="School name" />
                      </Field>
                    </div>
                    <div style={S.flex1}>
                      <Field label="Course" required error={errors.father_course} helperText="Required">
                        <MInput name="father_course" value={person.father_course || ""} onChange={handleChange} error={errors.father_course} placeholder="Course" />
                      </Field>
                    </div>
                  </div>
                  <div style={S.row}>
                    <div style={S.flex1}>
                      <Field label="Year Graduated" required error={errors.father_year_graduated} helperText="Required">
                        <MInput type="number" name="father_year_graduated" value={person.father_year_graduated || ""} onChange={handleChange} error={errors.father_year_graduated} placeholder="Year" />
                      </Field>
                    </div>
                    <div style={S.flex1}>
                      <Field label="School Address" required error={errors.father_school_address} helperText="Required">
                        <MInput name="father_school_address" value={person.father_school_address || ""} onChange={handleChange} error={errors.father_school_address} placeholder="Address" />
                      </Field>
                    </div>
                  </div>
                </>
              )}

              {/* Father Contact */}
              <div style={S.subHeader}>📞 Father's Contact Information</div>
              <div style={S.row}>
                <div style={S.flex1}>
                  <Field label="Contact Number" required error={errors.father_contact} helperText="Required">
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontWeight: 700, fontSize: 13, flexShrink: 0 }}>+63</span>
                      <MInput name="father_contact" value={person.father_contact || ""} onChange={(e) => handleChange({ target: { name: "father_contact", value: e.target.value.replace(/\D/g, "") } })} error={errors.father_contact} placeholder="9XXXXXXXXX" maxLength={10} style={{ flex: 1 }} />
                    </div>
                  </Field>
                </div>
                <div style={S.flex1}>
                  <Field label="Occupation" required error={errors.father_occupation} helperText="Required">
                    <MInput name="father_occupation" value={person.father_occupation || ""} onChange={handleChange} error={errors.father_occupation} placeholder="Occupation" />
                  </Field>
                </div>
              </div>
              <div style={S.row}>
                <div style={S.flex1}>
                  <Field label="Employer" required error={errors.father_employer} helperText="Required">
                    <MInput name="father_employer" value={person.father_employer || ""} onChange={handleChange} error={errors.father_employer} placeholder="Employer / Company" />
                  </Field>
                </div>
                <div style={S.flex1}>
                  <Field label="Monthly Income" required error={errors.father_income} helperText="Required">
                    <MInput type="number" name="father_income" value={person.father_income || ""} onChange={(e) => handleChange({ target: { name: "father_income", value: e.target.value.replace(/\D/g, "") } })} error={errors.father_income} placeholder="Amount" />
                  </Field>
                </div>
              </div>
              <Field label="Email Address">
                <MInput name="father_email" value={person.father_email || ""} onChange={handleChange} placeholder="father@email.com" type="email" />
              </Field>
            </>
          )}
        </div>
      </div>

      {/* ── Mother's Details ──────────────────────────────────────────── */}
      <div style={S.card}>
        <div style={{
          ...S.cardHeader,
          backgroundColor: settings?.header_color || "#1976d2",
        }}>👩 Mother's Details</div>
        <div style={S.cardBody}>
          <label style={S.checkRow}>
            <input
              type="checkbox"
              style={S.checkbox}
              checked={person.mother_deceased === 1}
              onChange={(e) => {
                const checked = e.target.checked;
                const updated = { ...person, mother_deceased: checked ? 1 : 0 };
                setPerson(updated);
                handleUpdate(updated);
              }}
            />
            Mother Separated / Deceased
          </label>

          {isMotherDeceased ? (
            <div style={S.deceasedBanner}>
              ⚠️ Mother marked as separated/deceased. Fields hidden.
            </div>
          ) : (
            <>
              <div style={S.row}>
                <div style={S.flex1}>
                  <Field label="Last Name" required error={errors.mother_family_name} helperText="Required">
                    <MInput name="mother_family_name" value={(person.mother_family_name || "").toUpperCase()} onChange={(e) => handleChange({ target: { name: "mother_family_name", value: e.target.value.toUpperCase() } })} error={errors.mother_family_name} placeholder="Last Name" />
                  </Field>
                </div>
                <div style={S.flex1}>
                  <Field label="First Name" required error={errors.mother_given_name} helperText="Required">
                    <MInput name="mother_given_name" value={(person.mother_given_name || "").toUpperCase()} onChange={(e) => handleChange({ target: { name: "mother_given_name", value: e.target.value.toUpperCase() } })} error={errors.mother_given_name} placeholder="First Name" />
                  </Field>
                </div>
              </div>

              <div style={S.row}>
                <div style={S.flex1}>
                  <Field label="Middle Name">
                    <MInput name="mother_middle_name" value={(person.mother_middle_name || "").toUpperCase()} onChange={(e) => handleChange({ target: { name: "mother_middle_name", value: e.target.value.toUpperCase() } })} placeholder="Middle Name" />
                  </Field>
                </div>
                <div style={{ width: 110 }}>
                  <Field label="Extension">
                    <MSelect name="mother_ext" value={person.mother_ext || ""} onChange={handleChange}>
                      <option value="">None</option>
                      {EXT_OPTIONS.map((v) => <option key={v} value={v}>{v}</option>)}
                    </MSelect>
                  </Field>
                </div>
              </div>

              <Field label="Nickname">
                <MInput name="mother_nickname" value={person.mother_nickname || ""} onChange={handleChange} placeholder="Nickname" />
              </Field>

              {/* Mother Education */}
              <div style={S.subHeader}>📚 Mother's Educational Background</div>
              <label style={S.checkRow}>
                <input
                  type="checkbox"
                  style={S.checkbox}
                  checked={person.mother_education === 1}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    const updated = { ...person, mother_education: checked ? 1 : 0, ...(checked ? { mother_education_level: "", mother_last_school: "", mother_course: "", mother_year_graduated: "", mother_school_address: "" } : {}) };
                    setPerson(updated);
                    handleUpdate(updated);
                  }}
                />
                Mother's education not applicable
              </label>

              {person.mother_education !== 1 && (
                <>
                  <Field label="Education Level" required error={errors.mother_education_level} helperText="Required">
                    <MInput name="mother_education_level" value={person.mother_education_level || ""} onChange={handleChange} error={errors.mother_education_level} placeholder="e.g. College Graduate" />
                  </Field>
                  <div style={S.row}>
                    <div style={S.flex1}>
                      <Field label="Last School Attended" required error={errors.mother_last_school} helperText="Required">
                        <MInput name="mother_last_school" value={person.mother_last_school || ""} onChange={handleChange} error={errors.mother_last_school} placeholder="School name" />
                      </Field>
                    </div>
                    <div style={S.flex1}>
                      <Field label="Course" required error={errors.mother_course} helperText="Required">
                        <MInput name="mother_course" value={person.mother_course || ""} onChange={handleChange} error={errors.mother_course} placeholder="Course" />
                      </Field>
                    </div>
                  </div>
                  <div style={S.row}>
                    <div style={S.flex1}>
                      <Field label="Year Graduated" required error={errors.mother_year_graduated} helperText="Required">
                        <MInput type="number" name="mother_year_graduated" value={person.mother_year_graduated || ""} onChange={handleChange} error={errors.mother_year_graduated} placeholder="Year" />
                      </Field>
                    </div>
                    <div style={S.flex1}>
                      <Field label="School Address" required error={errors.mother_school_address} helperText="Required">
                        <MInput name="mother_school_address" value={person.mother_school_address || ""} onChange={handleChange} error={errors.mother_school_address} placeholder="Address" />
                      </Field>
                    </div>
                  </div>
                </>
              )}

              {/* Mother Contact */}
              <div style={S.subHeader}>📞 Mother's Contact Information</div>
              <div style={S.row}>
                <div style={S.flex1}>
                  <Field label="Contact Number" required error={errors.mother_contact} helperText="Required">
                    <MInput name="mother_contact" value={person.mother_contact || ""} onChange={(e) => handleChange({ target: { name: "mother_contact", value: e.target.value.replace(/\D/g, "") } })} error={errors.mother_contact} placeholder="9XXXXXXXXX" />
                  </Field>
                </div>
                <div style={S.flex1}>
                  <Field label="Occupation" required error={errors.mother_occupation} helperText="Required">
                    <MInput name="mother_occupation" value={person.mother_occupation || ""} onChange={handleChange} error={errors.mother_occupation} placeholder="Occupation" />
                  </Field>
                </div>
              </div>
              <div style={S.row}>
                <div style={S.flex1}>
                  <Field label="Employer" required error={errors.mother_employer} helperText="Required">
                    <MInput name="mother_employer" value={person.mother_employer || ""} onChange={handleChange} error={errors.mother_employer} placeholder="Employer / Company" />
                  </Field>
                </div>
                <div style={S.flex1}>
                  <Field label="Monthly Income" required error={errors.mother_income} helperText="Required">
                    <MInput type="number" name="mother_income" value={person.mother_income || ""} onChange={(e) => handleChange({ target: { name: "mother_income", value: e.target.value.replace(/\D/g, "") } })} error={errors.mother_income} placeholder="Amount" />
                  </Field>
                </div>
              </div>
              <Field label="Email Address">
                <MInput name="mother_email" value={person.mother_email || ""} onChange={handleChange} placeholder="mother@email.com" type="email" />
              </Field>
            </>
          )}
        </div>
      </div>

      {/* ── Guardian / Emergency Contact ─────────────────────────────── */}
      <div style={S.card}>
        <div style={{
          ...S.cardHeader,
          backgroundColor: settings?.header_color || "#1976d2",
        }}>🚨 In Case of Emergency — Guardian</div>
        <div style={S.cardBody}>
          <Field label="Guardian Relationship" required error={errors.guardian} helperText="This field is required.">
            <MSelect name="guardian" value={person.guardian || ""} onChange={handleGuardianChange} error={errors.guardian}>
              <option value="">Select Guardian</option>
              {["Father", "Mother", "Brother/Sister", "Uncle", "Aunt", "StepFather", "StepMother", "Cousin", "Father in Law", "Mother in Law", "Sister in Law", "GrandMother", "GrandFather", "Spouse", "Others"].map((v) => <option key={v} value={v}>{v}</option>)}
            </MSelect>
          </Field>

          <div style={S.row}>
            <div style={S.flex1}>
              <Field label="Last Name" required error={errors.guardian_family_name} helperText="Required">
                <MInput name="guardian_family_name" value={(person.guardian_family_name || "").toUpperCase()} onChange={(e) => handleChange({ target: { name: "guardian_family_name", value: e.target.value.toUpperCase() } })} error={errors.guardian_family_name} placeholder="Last Name" />
              </Field>
            </div>
            <div style={S.flex1}>
              <Field label="First Name" required error={errors.guardian_given_name} helperText="Required">
                <MInput name="guardian_given_name" value={(person.guardian_given_name || "").toUpperCase()} onChange={(e) => handleChange({ target: { name: "guardian_given_name", value: e.target.value.toUpperCase() } })} error={errors.guardian_given_name} placeholder="First Name" />
              </Field>
            </div>
          </div>

          <div style={S.row}>
            <div style={S.flex1}>
              <Field label="Middle Name">
                <MInput name="guardian_middle_name" value={(person.guardian_middle_name || "").toUpperCase()} onChange={(e) => handleChange({ target: { name: "guardian_middle_name", value: e.target.value.toUpperCase() } })} placeholder="Middle Name" />
              </Field>
            </div>
            <div style={{ width: 110 }}>
              <Field label="Extension">
                <MSelect name="guardian_ext" value={person.guardian_ext || ""} onChange={handleChange}>
                  <option value="">None</option>
                  {EXT_OPTIONS.map((v) => <option key={v} value={v}>{v}</option>)}
                </MSelect>
              </Field>
            </div>
          </div>

          <Field label="Nickname">
            <MInput name="guardian_nickname" value={person.guardian_nickname || ""} onChange={handleChange} placeholder="Nickname" />
          </Field>

          <Field label="Complete Address" required error={errors.guardian_address} helperText="This field is required.">
            <MInput name="guardian_address" value={person.guardian_address || ""} onChange={handleChange} error={errors.guardian_address} placeholder="Street, Barangay, City" />
          </Field>

          <div style={S.row}>
            <div style={S.flex1}>
              <Field label="Contact Number" required error={errors.guardian_contact} helperText="Required">
                <MInput name="guardian_contact" value={person.guardian_contact || ""} onChange={(e) => handleChange({ target: { name: "guardian_contact", value: e.target.value.replace(/\D/g, "") } })} error={errors.guardian_contact} placeholder="9XXXXXXXXX" />
              </Field>
            </div>
            <div style={S.flex1}>
              <Field label="Email Address">
                <MInput name="guardian_email" value={person.guardian_email || ""} onChange={handleChange} placeholder="guardian@email.com" type="email" />
              </Field>
            </div>
          </div>
        </div>
      </div>

      {/* ── Annual Income ─────────────────────────────────────────────── */}
      <div style={S.card}>
        <div style={{
          ...S.cardHeader,
          backgroundColor: settings?.header_color || "#1976d2",
        }}>💰 Family Annual Income</div>
        <div style={S.cardBody}>
          <div style={{ fontSize: 11, color: "#888", marginBottom: 10 }}>
            Auto-calculated from father + mother income, or select manually.
          </div>
          <Field label="Annual Income Bracket" required error={errors.annual_income} helperText="This field is required.">
            <MSelect name="annual_income" value={person.annual_income || ""} onChange={handleChange} error={errors.annual_income}>
              <option value="">Select Annual Income</option>
              {["80,000 and below", "80,000 to 135,000", "135,000 to 250,000", "250,000 to 500,000", "500,000 to 1,000,000", "1,000,000 and above"].map((v) => <option key={v} value={v}>{v}</option>)}
            </MSelect>
          </Field>
        </div>
      </div>

      {/* Bottom Nav */}
      <div style={S.bottomBar}>
        <button style={S.btnSecondary} onClick={() => { handleUpdate(person); navigate("/student_dashboard1"); }}>
          ← Previous
        </button>
        <button
          style={S.btnPrimary}
          onClick={() => {
            handleUpdate(person);
            if (isFormValid()) navigate("/student_dashboard3");
            else showSnackbar("Please fill all required fields.", "error");
          }}
        >
          Next Step →
        </button>
      </div>
    </div>
  );
};

export default StudentDashboard2Mobile;
