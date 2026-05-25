import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { SettingsContext } from "../App";
import API_BASE_URL from "../apiConfig";
import DateField from "../components/DateField";
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
  textarea: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #ccc",
    borderRadius: 8,
    fontSize: 14,
    backgroundColor: "#fff",
    boxSizing: "border-box",
    outline: "none",
    color: "#222",
    resize: "vertical",
    minHeight: 80,
    fontFamily: "'Segoe UI', sans-serif",
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
  checkRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  checkLabel: { fontSize: 14, color: "#333" },
  yesNoRow: {
    display: "flex",
    gap: 16,
    alignItems: "center",
  },
  yesNoItem: {
    display: "flex",
    alignItems: "center",
    gap: 4,
  },
  conditionRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
    borderBottom: "1px solid #f0f0f0",
    marginBottom: 8,
    paddingBottom: 8,
  },
  conditionLabel: { fontSize: 13, color: "#333", flex: 1 },
  tableHeader: {
    backgroundColor: "#f5f5f5",
    padding: "8px 10px",
    fontSize: 11,
    fontWeight: 700,
    color: "#555",
    textTransform: "uppercase",
    letterSpacing: 0.3,
    borderBottom: "1px solid #e0e0e0",
  },
  vaccineGrid: {
    display: "grid",
    gridTemplateColumns: "80px 1fr 1fr",
    gap: 6,
    marginBottom: 8,
  },
  vaccineCell: {
    fontSize: 12,
    color: "#444",
    display: "flex",
    alignItems: "center",
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

// ─── Reusable field wrapper ───────────────────────────────────────────────────
const Field = ({ label, children }) => (
  <div style={S.fieldWrap}>
    {label && <label style={S.label}>{label}</label>}
    {children}
  </div>
);

// ─── YES / NO toggle ──────────────────────────────────────────────────────────
const YesNo = ({ fieldKey, person, onChange, disabled = true }) => (
  <div style={S.yesNoRow}>
    <div style={S.yesNoItem}>
      <input
        type="checkbox"
        disabled={disabled}
        checked={person[fieldKey] === 1}
        onChange={() => {
          if (!disabled) {
            onChange(fieldKey, person[fieldKey] === 1 ? null : 1);
          }
        }}
        style={{ width: 16, height: 16, accentColor: "#6D2323" }}
      />
      <span style={{ fontSize: 13, color: "#333" }}>Yes</span>
    </div>
    <div style={S.yesNoItem}>
      <input
        type="checkbox"
        disabled={disabled}
        checked={person[fieldKey] === 0}
        onChange={() => {
          if (!disabled) {
            onChange(fieldKey, person[fieldKey] === 0 ? null : 0);
          }
        }}
        style={{ width: 16, height: 16, accentColor: "#6D2323" }}
      />
      <span style={{ fontSize: 13, color: "#333" }}>No</span>
    </div>
  </div>
);

// ─── Condition row ────────────────────────────────────────────────────────────
const ConditionRow = ({ label, fieldKey, person, onChange }) => (
  <div style={S.conditionRow}>
    <span style={S.conditionLabel}>{label}</span>
    <YesNo fieldKey={fieldKey} person={person} onChange={onChange} />
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const StudentDashboard4Mobile = () => {
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
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "warning",
  });

  const [person, setPerson] = useState({
    cough: "", colds: "", fever: "",
    asthma: "", faintingSpells: "", heartDisease: "", tuberculosis: "",
    frequentHeadaches: "", hernia: "", chronicCough: "", headNeckInjury: "",
    hiv: "", highBloodPressure: "", diabetesMellitus: "", allergies: "",
    cancer: "", smokingCigarette: "", alcoholDrinking: "",
    hospitalized: "", hospitalizationDetails: "",
    medications: "",
    hadCovid: "", covidDate: "",
    vaccine1Brand: "", vaccine1Date: "",
    vaccine2Brand: "", vaccine2Date: "",
    booster1Brand: "", booster1Date: "",
    booster2Brand: "", booster2Date: "",
    chestXray: "", cbc: "", urinalysis: "", otherworkups: "",
    symptomsToday: "",
    remarks: "",
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

  // Toggle helper for yes/no fields
  const handleToggle = (fieldKey, newValue) => {
    const updated = { ...person, [fieldKey]: newValue };
    setPerson(updated);
    handleUpdate(updated);
  };

  const handleTextChange = (name, value) => {
    const updated = { ...person, [name]: value };
    setPerson(updated);
    handleUpdate(updated);
  };

  const medicalConditions = [
    { label: "Asthma", key: "asthma" },
    { label: "Fainting Spells and Seizures", key: "faintingSpells" },
    { label: "Heart Disease", key: "heartDisease" },
    { label: "Tuberculosis", key: "tuberculosis" },
    { label: "Frequent Headaches", key: "frequentHeadaches" },
    { label: "Hernia", key: "hernia" },
    { label: "Chronic Cough", key: "chronicCough" },
    { label: "Head or Neck Injury", key: "headNeckInjury" },
    { label: "H.I.V", key: "hiv" },
    { label: "High Blood Pressure", key: "highBloodPressure" },
    { label: "Diabetes Mellitus", key: "diabetesMellitus" },
    { label: "Allergies", key: "allergies" },
    { label: "Cancer", key: "cancer" },
    { label: "Smoking of Cigarette/Day", key: "smokingCigarette" },
    { label: "Alcohol Drinking", key: "alcoholDrinking" },
  ];

  const vaccineColumns = [
    { label: "1st Dose", brandKey: "vaccine1Brand", dateKey: "vaccine1Date" },
    { label: "2nd Dose", brandKey: "vaccine2Brand", dateKey: "vaccine2Date" },
    { label: "Booster 1", brandKey: "booster1Brand", dateKey: "booster1Date" },
    { label: "Booster 2", brandKey: "booster2Brand", dateKey: "booster2Date" },
  ];

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
          <div style={S.headerTitle}>HEALTH MEDICAL RECORDS</div>
          <div style={S.headerSub}>{companyName || "Student Enrollment"}</div>
        </div>
      </div>

      {/* Stepper */}
      <div style={S.stepperWrap}>
        {STEP_LABELS.map((label, i) => (
          <React.Fragment key={i}>
            <div style={S.stepItem} onClick={() => navigate(STEP_PATHS[i])}>
              <div style={S.stepCircle(i === 3)}>{STEP_ICONS[i]}</div>
              <div style={S.stepLabel(i === 3)}>{label}</div>
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

      {/* ── I. Symptoms Today ─────────────────────────────────────────── */}
      <div style={S.card}>
        <div style={{
          ...S.cardHeader,
          backgroundColor: settings?.header_color || "#1976d2",
        }}>🤒 I. Symptoms Today</div>
        <div style={S.cardBody}>
          <div style={{ fontSize: 12, color: "#555", marginBottom: 12 }}>
            Do you have any of the following symptoms today?
          </div>
          {["cough", "colds", "fever"].map((symptom) => (
            <div key={symptom} style={S.checkRow}>
              <input
                type="checkbox"
                disabled
                checked={person[symptom] === 1}
                style={{ width: 18, height: 18, accentColor: "#6D2323" }}
              />
              <span style={S.checkLabel}>
                {symptom.charAt(0).toUpperCase() + symptom.slice(1)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── II. Medical History ───────────────────────────────────────── */}
      <div style={S.card}>
        <div style={{
          ...S.cardHeader,
          backgroundColor: settings?.header_color || "#1976d2",
        }}>🏥 II. Medical History</div>
        <div style={S.cardBody}>
          <div style={{ fontSize: 12, color: "#555", marginBottom: 12 }}>
            Have you suffered from, or been told you had, any of the following
            conditions?
          </div>
          {medicalConditions.map(({ label, key }) => (
            <ConditionRow
              key={key}
              label={label}
              fieldKey={key}
              person={person}
              onChange={handleToggle}
            />
          ))}

          <hr style={S.divider} />

          {/* Hospitalization */}
          <div style={S.sectionLabel}>Hospitalization History</div>
          <div
            style={{
              ...S.conditionRow,
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 10,
            }}
          >
            <span style={{ fontSize: 13, color: "#333" }}>
              Do you have any previous history of hospitalization or operation?
            </span>
            <YesNo
              fieldKey="hospitalized"
              person={person}
              onChange={handleToggle}
              disabled={true}
            />
          </div>

          <Field label="If Yes, Please Specify:">
            <input
              type="text"
              name="hospitalizationDetails"
              readOnly
              value={person.hospitalizationDetails || ""}
              onChange={(e) =>
                handleTextChange("hospitalizationDetails", e.target.value)
              }
              style={S.input(false)}
              placeholder="Enter details..."
            />
          </Field>
        </div>
      </div>

      {/* ── III. Medication ───────────────────────────────────────────── */}
      <div style={S.card}>
        <div style={{
          ...S.cardHeader,
          backgroundColor: settings?.header_color || "#1976d2",
        }}>💊 III. Medication</div>
        <div style={S.cardBody}>
          <Field label="List all current medications:">
            <textarea
              name="medications"
              readOnly
              value={person.medications || ""}
              onChange={(e) => handleTextChange("medications", e.target.value)}
              style={S.textarea}
              placeholder="Enter medications or type NA"
            />
          </Field>
        </div>
      </div>

      {/* ── IV. COVID Profile ─────────────────────────────────────────── */}
      <div style={S.card}>
        <div style={{
          ...S.cardHeader,
          backgroundColor: settings?.header_color || "#1976d2",
        }}>🦠 IV. COVID Profile</div>
        <div style={S.cardBody}>
          {/* A. COVID History */}
          <div style={S.sectionLabel}>A. COVID-19 History</div>
          <div
            style={{
              ...S.conditionRow,
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 10,
            }}
          >
            <span style={{ fontSize: 13, color: "#333" }}>
              Do you have history of COVID-19?
            </span>
            <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
              <YesNo
                fieldKey="hadCovid"
                person={person}
                onChange={handleToggle}
                disabled={true}
              />
            </div>
          </div>

          <Field label="If Yes, When:">
            <DateField
              size="small"
              name="covidDate"
              readOnly
              value={person.covidDate || ""}
              onChange={(e) => handleTextChange("covidDate", e.target.value)}
              style={S.input(false)}
            />
          </Field>

          <hr style={S.divider} />

          {/* B. Vaccinations */}
          <div style={S.sectionLabel}>B. COVID Vaccinations</div>
          {vaccineColumns.map(({ label, brandKey, dateKey }) => (
            <div
              key={brandKey}
              style={{
                backgroundColor: "#fafafa",
                border: "1px solid #e8e8e8",
                borderRadius: 8,
                padding: "10px 12px",
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#6D2323",
                  marginBottom: 8,
                }}
              >
                {label}
              </div>
              <div style={{ ...S.row, gap: 8 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ ...S.label, marginBottom: 4 }}>Brand</label>
                  <input
                    type="text"
                    name={brandKey}
                    disabled
                    value={person[brandKey] || ""}
                    onChange={(e) =>
                      handleTextChange(brandKey, e.target.value)
                    }
                    style={{ ...S.input(false), height: 38 }}
                    placeholder="Brand name"
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ ...S.label, marginBottom: 4 }}>Date</label>
                  <DateField
                    size="small"
                    name={dateKey}
                    readOnly
                    value={person[dateKey] || ""}
                    onChange={(e) =>
                      handleTextChange(dateKey, e.target.value)
                    }
                    style={{ ...S.input(false), height: 38 }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── V. Lab Results ────────────────────────────────────────────── */}
      <div style={S.card}>
        <div style={{
          ...S.cardHeader,
          backgroundColor: settings?.header_color || "#1976d2",
        }}>🔬 V. Laboratory Results</div>
        <div style={S.cardBody}>
          <div style={{ fontSize: 12, color: "#555", marginBottom: 12 }}>
            Please indicate the result of the following:
          </div>
          {[
            { label: "Chest X-ray", key: "chestXray" },
            { label: "CBC", key: "cbc" },
            { label: "Urinalysis", key: "urinalysis" },
            { label: "Other Workups", key: "otherworkups" },
          ].map(({ label, key }) => (
            <Field key={key} label={label}>
              <input
                type="text"
                name={key}
                readOnly
                value={person[key] || ""}
                onChange={(e) => handleTextChange(key, e.target.value)}
                style={S.input(false)}
                placeholder="Enter result or NA"
              />
            </Field>
          ))}
        </div>
      </div>

      {/* ── VI. Diagnosis ─────────────────────────────────────────────── */}
      <div style={S.card}>
        <div style={{
          ...S.cardHeader,
          backgroundColor: settings?.header_color || "#1976d2",
        }}>📋 VI. Diagnosis</div>
        <div style={S.cardBody}>
          <div style={{ fontSize: 13, color: "#333", marginBottom: 12 }}>
            Do you have any of the following symptoms today?
          </div>
          <div style={{ display: "flex", gap: 20 }}>
            <div style={S.yesNoItem}>
              <input
                type="checkbox"
                disabled
                checked={person.symptomsToday === 0}
                style={{ width: 16, height: 16, accentColor: "#6D2323" }}
              />
              <span style={{ fontSize: 13, marginLeft: 4 }}>
                Physically Fit
              </span>
            </div>
            <div style={S.yesNoItem}>
              <input
                type="checkbox"
                disabled
                checked={person.symptomsToday === 1}
                style={{ width: 16, height: 16, accentColor: "#6D2323" }}
              />
              <span style={{ fontSize: 13, marginLeft: 4 }}>
                For Compliance
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── VII. Remarks ──────────────────────────────────────────────── */}
      <div style={{ ...S.card, marginBottom: 16 }}>
        <div style={{
          ...S.cardHeader,
          backgroundColor: settings?.header_color || "#1976d2",
        }}>📝 VII. Remarks</div>
        <div style={S.cardBody}>
          <textarea
            name="remarks"
            disabled
            value={person.remarks || ""}
            onChange={(e) => handleTextChange("remarks", e.target.value)}
            style={S.textarea}
            placeholder="Remarks from physician..."
          />
        </div>
      </div>

      {/* Bottom Nav */}
      <div style={S.bottomBar}>
        <button
          style={S.btnSecondary}
          onClick={() => {
            handleUpdate(person);
            navigate("/student_dashboard3");
          }}
        >
          ← Previous
        </button>
        <button
          style={S.btnPrimary}
          onClick={() => {
            handleUpdate(person);
            navigate("/student_dashboard5");
          }}
        >
          Next Step →
        </button>
      </div>
    </div>
  );
};

export default StudentDashboard4Mobile;
