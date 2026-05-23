import React, { useState, useEffect, useContext, useRef } from "react";
import { SettingsContext } from "../App";
import {
  Box,
  Button,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  Container,
  TableHead,
  TableRow,
  Snackbar,
  Alert,
  useMediaQuery,
  useTheme,
  Chip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import axios from "axios";
import ErrorIcon from "@mui/icons-material/Error";
import API_BASE_URL from "../apiConfig";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

const StudentOnlineRequirements = () => {
  const settings = useContext(SettingsContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [titleColor, setTitleColor] = useState("#000000");
  const [subtitleColor, setSubtitleColor] = useState("#555555");
  const [borderColor, setBorderColor] = useState("#000000");
  const [mainButtonColor, setMainButtonColor] = useState("#1976d2");

  const [fetchedLogo, setFetchedLogo] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [shortTerm, setShortTerm] = useState("");
  const [campusAddress, setCampusAddress] = useState("");

  useEffect(() => {
    if (!settings) return;

    if (settings.title_color) setTitleColor(settings.title_color);
    if (settings.subtitle_color) setSubtitleColor(settings.subtitle_color);
    if (settings.border_color) setBorderColor(settings.border_color);
    if (settings.main_button_color)
      setMainButtonColor(settings.main_button_color);

    if (settings.logo_url) {
      setFetchedLogo(`${API_BASE_URL}${settings.logo_url}`);
    }

    if (settings.company_name) setCompanyName(settings.company_name);
    if (settings.short_term) setShortTerm(settings.short_term);
    if (settings.campus_address) setCampusAddress(settings.campus_address);
  }, [settings]);

  const [requirements, setRequirements] = useState([]);
  const [uploads, setUploads] = useState([]);
  const [userID, setUserID] = useState("");
  const [selectedFiles, setSelectedFiles] = useState({});
  const [allRequirementsCompleted, setAllRequirementsCompleted] = useState(
    localStorage.getItem("requirementsCompleted") === "1",
  );
  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const StudentPersonId = localStorage.getItem("person_id");
    if (!StudentPersonId) return;
    fetchStudentDocuments(StudentPersonId);
  }, []);

  const fetchStudentDocuments = async (StudentPersonId) => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/student-documents/${StudentPersonId}`,
      );
      const data = res.data.data;
      const normalized = data.map((doc) => ({
        id: doc.requirements_id,
        description: doc.description,
        category: doc.category,
        is_required: doc.is_required,
        is_optional: doc.is_optional,
        upload_id: doc.upload_id,
        original_name: doc.original_name,
        file_path: doc.file_path,
        status: doc.status,
        remarks: doc.remarks,
      }));

      setRequirements(normalized);
      setUploads(normalized);

      const rebuiltSelectedFiles = {};
      normalized.forEach((doc) => {
        if (doc.original_name) {
          rebuiltSelectedFiles[doc.id] = doc.original_name;
        }
      });
      setSelectedFiles(rebuiltSelectedFiles);
    } catch (err) {
      console.error("Error fetching student documents:", err);
    }
  };

  const [openModal, setOpenModal] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);

  useEffect(() => {
    const completed = localStorage.getItem("requirementsCompleted");
    if (completed === "1") setOpenModal(true);
  }, []);

  useEffect(() => {
    const personId = localStorage.getItem("person_id");
    if (personId) setUserID(personId);
  }, []);

  const handleUpload = async (key, file) => {
    if (!file) return;

    const maxSize = 4 * 1024 * 1024;
    if (file.size > maxSize) {
      setSnack({ open: true, severity: "error", message: "File must not exceed 4MB" });
      return;
    }

    setSelectedFiles((prev) => ({ ...prev, [key]: file.name }));

    const formData = new FormData();
    formData.append("file", file);
    formData.append("requirements_id", key);
    formData.append("person_id", userID);

    try {
      await axios.post(`${API_BASE_URL}/api/upload/enrollment`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSnack({ open: true, severity: "success", message: "File uploaded successfully" });
      fetchStudentDocuments(localStorage.getItem("person_id"));
    } catch (err) {
      setSnack({ open: true, severity: "error", message: err.response?.data?.error || "Upload failed" });
    }
  };

  const handleDelete = async (uploadId) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/student-upload/${uploadId}`);
      setSnack({ open: true, severity: "success", message: "File deleted successfully" });
      fetchStudentDocuments(localStorage.getItem("person_id"));
    } catch (err) {
      setSnack({ open: true, severity: "error", message: "Failed to delete file" });
    }
  };

  const isFormValid = () => {
    const requiredMain = requirements.filter(
      (r) => r.category === "Main" && Number(r.is_required) === 1,
    );
    const uploadedIds = new Set(uploads.map((u) => Number(u.requirements_id)));
    const missing = requiredMain.filter(
      (req) => !uploadedIds.has(Number(req.id)),
    );

    if (missing.length > 0) {
      const names = missing.map((m) => m.description).join(", ");
      setSnack({
        open: true,
        severity: "warning",
        message: `Please upload all required MAIN requirements: ${names}`,
      });
      return false;
    }
    return true;
  };

  const handleClose = (_, reason) => {
    if (reason === "clickaway") return;
    setSnack((prev) => ({ ...prev, open: false }));
  };

  const getStatusChip = (status) => {
    if (status == 1)
      return <Chip icon={<CheckCircleIcon />} label="Verified" color="success" size="small" sx={{ fontWeight: "bold" }} />;
    if (status == 2)
      return <Chip icon={<CancelIcon />} label="Rejected" color="error" size="small" sx={{ fontWeight: "bold" }} />;
    return <Chip icon={<HourglassEmptyIcon />} label="Pending" color="default" size="small" />;
  };

  // Mobile card layout for each document row
  const renderMobileCard = (doc) => {
    const uploaded = doc.upload_id ? doc : null;

    return (
      <Box
        key={doc.id}
        sx={{
          border: `1px solid ${borderColor}`,
          borderRadius: "8px",
          p: 2,
          mb: 2,
          backgroundColor: "#fff",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        }}
      >
        {/* Document Name */}
        <Box sx={{ mb: 1.5 }}>
          <Typography sx={{ fontWeight: "bold", fontSize: "15px", lineHeight: 1.4 }}>
            {doc.description}
            {doc.is_required === 1 && (
              <span style={{ color: "red", marginLeft: 4 }}>*</span>
            )}
            {doc.is_optional === 1 && (
              <span style={{ color: "#888", marginLeft: 4, fontSize: "12px" }}>(Optional)</span>
            )}
          </Typography>
        </Box>

        {/* Uploaded File Name */}
        {selectedFiles[doc.id] && (
          <Box
            sx={{
              backgroundColor: "#e0e0e0",
              px: 1.5,
              py: 0.75,
              borderRadius: "4px",
              fontSize: "13px",
              fontWeight: "bold",
              mb: 1.5,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
            title={selectedFiles[doc.id]}
          >
            📎 {selectedFiles[doc.id]}
          </Box>
        )}

        {/* Remarks & Status */}
        {(uploaded?.remarks?.trim() || uploaded?.status == 1 || uploaded?.status == 2) && (
          <Box sx={{ mb: 1.5 }}>
            {typeof uploaded?.remarks === "string" && uploaded.remarks.trim() !== "" && (
              <Typography sx={{ fontSize: "13px", color: "#444", mb: 0.5 }}>
                {uploaded.remarks}
              </Typography>
            )}
            {(uploaded?.status == 1 || uploaded?.status == 2) && getStatusChip(uploaded.status)}
          </Box>
        )}

        {/* Action Buttons */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
          <Button
            variant="contained"
            component="label"
            startIcon={<CloudUploadIcon />}
            size="small"
            sx={{
              backgroundColor: "#F0C03F",
              color: "white",
              fontWeight: "bold",
              textTransform: "none",
              flex: "1 1 auto",
              minWidth: "120px",
            }}
          >
            Browse File
            <input
              key={selectedFiles[doc.id] || doc.id}
              hidden
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={(e) => handleUpload(doc.id, e.target.files[0])}
            />
          </Button>

          {uploaded && (
            <Button
              variant="contained"
              color="primary"
              href={`${API_BASE_URL}/StudentOnlineDocuments/${uploaded.file_path}`}
              target="_blank"
              startIcon={<VisibilityIcon />}
              size="small"
              sx={{
                fontWeight: "bold",
                textTransform: "none",
                flex: "1 1 auto",
                minWidth: "100px",
              }}
            >
              Preview
            </Button>
          )}

          {uploaded && (
            <Button
              onClick={() => handleDelete(uploaded.upload_id)}
              startIcon={<DeleteIcon />}
              size="small"
              sx={{
                backgroundColor: "#9E0000",
                color: "white",
                fontWeight: "bold",
                textTransform: "none",
                flex: "1 1 auto",
                minWidth: "100px",
              }}
            >
              Delete
            </Button>
          )}
        </Box>
      </Box>
    );
  };

  // Desktop table row (original layout)
  const renderRow = (doc) => {
    const uploaded = doc.upload_id ? doc : null;

    return (
      <TableRow key={doc.id}>
        <TableCell
          sx={{
            fontWeight: "bold",
            width: "25%",
            border: `1px solid ${borderColor}`,
          }}
        >
          {doc.description}
          {doc.is_optional === 1 && (
            <span style={{ marginLeft: 2 }}>(Optional)</span>
          )}
          {doc.is_required === 1 && (
            <span style={{ color: "red", marginLeft: 5 }}>*</span>
          )}
        </TableCell>

        <TableCell
          sx={{
            width: "25%",
            border: `1px solid ${borderColor}`,
            textAlign: "center",
            verticalAlign: "middle",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, width: "100%" }}>
            <Box sx={{ width: "220px", flexShrink: 0, textAlign: "center" }}>
              {selectedFiles[doc.id] ? (
                <Box
                  sx={{
                    backgroundColor: "#e0e0e0",
                    padding: "6px 12px",
                    borderRadius: "4px",
                    fontSize: "14px",
                    fontWeight: "bold",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                  title={selectedFiles[doc.id]}
                >
                  {selectedFiles[doc.id]}
                </Box>
              ) : (
                <Box sx={{ height: "40px" }} />
              )}
            </Box>
            <Box sx={{ flexShrink: 0 }}>
              <Button
                variant="contained"
                component="label"
                startIcon={<CloudUploadIcon />}
                sx={{
                  backgroundColor: "#F0C03F",
                  color: "white",
                  fontWeight: "bold",
                  height: "40px",
                  textTransform: "none",
                  minWidth: "140px",
                }}
              >
                Browse File
                <input
                  key={selectedFiles[doc.id] || doc.id}
                  hidden
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={(e) => handleUpload(doc.id, e.target.files[0])}
                />
              </Button>
            </Box>
          </Box>
        </TableCell>

        <TableCell sx={{ width: "25%", border: `1px solid ${borderColor}` }}>
          {typeof uploaded?.remarks === "string" && uploaded.remarks.trim() !== "" && (
            <Typography sx={{ fontStyle: "normal", color: "inherit" }}>
              {uploaded.remarks}
            </Typography>
          )}
          {uploaded?.status == 1 || uploaded?.status == 2 ? (
            <Typography
              sx={{
                mt: 0.5,
                fontSize: "14px",
                color: uploaded?.status == 1 ? "green" : "red",
                fontWeight: "bold",
              }}
            >
              {uploaded?.status == 1 ? "Verified" : "Rejected"}
            </Typography>
          ) : null}
        </TableCell>

        <TableCell sx={{ width: "10%", border: `1px solid ${borderColor}` }}>
          {uploaded && (
            <Button
              variant="contained"
              color="primary"
              href={`${API_BASE_URL}/StudentOnlineDocuments/${uploaded.file_path}`}
              target="_blank"
              startIcon={<VisibilityIcon />}
              sx={{ color: "white", fontWeight: "bold", height: "40px", textTransform: "none", minWidth: "140px" }}
            >
              Preview
            </Button>
          )}
        </TableCell>

        <TableCell sx={{ width: "10%", border: `1px solid ${borderColor}` }}>
          {uploaded && (
            <Button
              onClick={() => handleDelete(uploaded.upload_id)}
              startIcon={<DeleteIcon />}
              sx={{ backgroundColor: "#9E0000", color: "white", fontWeight: "bold", height: "40px", textTransform: "none", minWidth: "140px" }}
            >
              Delete
            </Button>
          )}
        </TableCell>
      </TableRow>
    );
  };

  return (
    <Box
      sx={{
        height: "calc(100vh - 150px)",
        overflowY: "auto",
        paddingRight: 1,
        backgroundColor: "transparent",
        mt: 1,
        padding: { xs: 1, sm: 2 },
      }}
    >
      <Snackbar
        open={snack.open}
        autoHideDuration={5000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snack.severity} onClose={handleClose} sx={{ width: "100%" }}>
          {snack.message}
        </Alert>
      </Snackbar>

      {/* Confirm Modal */}
      <Dialog
        open={openConfirmModal}
        onClose={() => setOpenConfirmModal(false)}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle sx={{ fontWeight: "bold", textAlign: "center", fontSize: { xs: "16px", sm: "20px" } }}>
          📄 Review Your Uploaded Requirements
        </DialogTitle>

        <DialogContent>
          <Typography sx={{ mb: 2, textAlign: "center", fontSize: { xs: "13px", sm: "15px" } }}>
            Please review your uploaded documents before final submission.
          </Typography>

          {requirements
            .filter((r) => r.category === "Main")
            .map((doc) => {
              const uploaded = uploads.find(
                (u) => Number(u.requirements_id) === Number(doc.id),
              );
              return (
                <Box
                  key={doc.id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: { xs: "flex-start", sm: "center" },
                    flexDirection: { xs: "column", sm: "row" },
                    gap: { xs: 1, sm: 0 },
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    p: 1.5,
                    mb: 1,
                  }}
                >
                  <Box>
                    <Typography sx={{ fontWeight: "bold", fontSize: { xs: "13px", sm: "15px" } }}>
                      {doc.description}
                    </Typography>
                    <Typography sx={{ fontSize: "12px", color: "#555" }}>
                      {uploaded?.original_name || "No file uploaded"}
                    </Typography>
                  </Box>

                  {uploaded && (
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<VisibilityIcon />}
                      href={`${API_BASE_URL}/StudentOnlineDocuments/${uploaded.file_path}`}
                      target="_blank"
                      size="small"
                      fullWidth={isMobile}
                    >
                      Preview
                    </Button>
                  )}
                </Box>
              );
            })}

          <Box sx={{ mt: 3, p: 2, backgroundColor: "#fff3cd", border: "1px solid #ffeeba", borderRadius: "8px" }}>
            <Typography sx={{ fontSize: { xs: "12px", sm: "14px" } }}>
              ⚠ <strong>Notice:</strong> Please ensure that all uploaded documents are correct and clear.
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "space-between", px: 3, pb: 2, flexDirection: { xs: "column-reverse", sm: "row" }, gap: { xs: 1, sm: 0 } }}>
          <Button variant="contained" color="error" onClick={() => setOpenConfirmModal(false)} fullWidth={isMobile}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="success"
            fullWidth={isMobile}
            onClick={() => {
              if (!isFormValid()) return;
              setOpenConfirmModal(false);
              localStorage.setItem("requirementsCompleted", "1");
              setSnack({ open: true, severity: "success", message: "Requirements submitted successfully." });
              window.location.href = "/student_dashboard";
            }}
          >
            Submit Requirements
          </Button>
        </DialogActions>
      </Dialog>

      {/* Page Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", mb: 2 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            color: titleColor,
            fontSize: { xs: "22px", sm: "28px", md: "36px" },
          }}
        >
          STUDENT'S REQUIREMENTS
        </Typography>
      </Box>
      <hr style={{ border: "1px solid #ccc", width: "100%" }} />
      <br />

      {/* Notice Box */}
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          width: "100%",
          mt: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            gap: { xs: 1.5, sm: 2 },
            width: "100%",
            p: { xs: 1.5, sm: 2 },
            borderRadius: "10px",
            backgroundColor: "#fffaf5",
            border: "1px solid #6D2323",
            boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#800000",
              borderRadius: "8px",
              width: { xs: 44, sm: 60 },
              height: { xs: 44, sm: 60 },
              flexShrink: 0,
            }}
          >
            <ErrorIcon sx={{ color: "white", fontSize: { xs: 28, sm: 40 } }} />
          </Box>
          <Typography
            sx={{
              fontSize: { xs: "13px", sm: "15px", md: "18px" },
              fontFamily: "Poppins, sans-serif",
              color: "#3e3e3e",
              lineHeight: 1.6,
            }}
          >
            <strong style={{ color: "#600000" }}>Notice:</strong> Students are required to submit all{" "}
            <strong>Main Requirements (required documents)</strong> to complete their enrollment records.
            <strong> Optional documents</strong> are not required but may be uploaded if available. Only files in{" "}
            <strong>JPG, JPEG, PNG, or PDF</strong> format are allowed. Maximum file size:{" "}
            <strong>4 MB</strong>.
          </Typography>
        </Box>
      </Box>

      {/* Requirements by Category */}
      <Box sx={{ px: { xs: 0, sm: 2 }, marginLeft: { xs: 0, sm: "-10px" } }}>
        {Object.entries(
          requirements.reduce((acc, r) => {
            const cat = r.category || "Main";
            if (!acc[cat]) acc[cat] = [];
            acc[cat].push(r);
            return acc;
          }, {}),
        ).map(([category, docs]) => (
          <Box key={category} sx={{ mt: 4 }}>
            <Container>
              <h1
                style={{
                  fontSize: isMobile ? "24px" : "45px",
                  fontWeight: "bold",
                  textAlign: "center",
                  color: subtitleColor,
                  marginTop: "25px",
                }}
              >
                {category === "Medical"
                  ? "MEDICAL REQUIREMENTS"
                  : category === "Others"
                    ? "OTHER REQUIREMENTS"
                    : "MAIN REQUIREMENTS"}
              </h1>

              {category !== "Medical" && category !== "Others" && (
                <div
                  style={{
                    textAlign: "center",
                    fontSize: isMobile ? "14px" : "18px",
                    marginTop: "10px",
                    marginBottom: "30px",
                    color: "#333",
                  }}
                >
                  Complete the student form to secure your place for the upcoming academic year at{" "}
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
              )}
            </Container>

            {/* Mobile: Card layout */}
            {isMobile ? (
              <Box sx={{ px: 1 }}>
                {docs.map((doc) =>
                  renderMobileCard({
                    id: doc.id,
                    description: doc.description,
                    is_required: doc.is_required,
                    is_optional: doc.is_optional,
                    upload_id: doc.upload_id,
                    original_name: doc.original_name,
                    file_path: doc.file_path,
                    status: doc.status,
                    remarks: doc.remarks,
                  }),
                )}
              </Box>
            ) : (
              /* Desktop: Table layout */
              <TableContainer
                component={Paper}
                sx={{ width: "95%", mt: 2, border: `1px solid ${borderColor}` }}
              >
                <Table>
                  <TableHead
                    sx={{
                      backgroundColor: settings?.header_color || "#1976d2",
                      border: `1px solid ${borderColor}`,
                    }}
                  >
                    <TableRow>
                      {["Document", "Upload", "Remarks", "Preview", "Delete"].map((h) => (
                        <TableCell key={h} sx={{ color: "white", border: `1px solid ${borderColor}` }}>
                          {h}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {docs.map((doc) =>
                      renderRow({
                        id: doc.id,
                        description: doc.description,
                        is_required: doc.is_required,
                        is_optional: doc.is_optional,
                        upload_id: doc.upload_id,
                        original_name: doc.original_name,
                        file_path: doc.file_path,
                        status: doc.status,
                        remarks: doc.remarks,
                      }),
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default StudentOnlineRequirements;
