"use client";

import * as React from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import {
  fetchDepartmentListApi,
  registerStaffApi,
  type DepartmentItem,
  type StaffRegisterRequest,
} from "@/lib/api/StaffApi";

const STAFF_TYPE_OPTIONS = [
  { value: "DOC", label: "의사" },
  { value: "NUR", label: "간호" },
  { value: "ADM", label: "행정" },
] as const;

const RANK_OPTIONS = ["원장", "과장", "차장", "대리", "주임", "사원", "수간호사"];

type StaffRegisterModalProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

type FormState = {
  staffId: string;
  staffPassword: string;
  staffDepartmentId: string;
  staffName: string;
  staffType: string;
  staffRankCode: string;
  staffBirthDate: string;
  staffHireDate: string;
  staffEmail: string;
  staffPhone: string;
  staffLicenseNo: string;
  addressZipCode: string;
  addressBase: string;
  addressDetail: string;
};

const initialForm: FormState = {
  staffId: "",
  staffPassword: "",
  staffDepartmentId: "",
  staffName: "",
  staffType: "",
  staffRankCode: "",
  staffBirthDate: "",
  staffHireDate: "",
  staffEmail: "",
  staffPhone: "",
  staffLicenseNo: "",
  addressZipCode: "",
  addressBase: "",
  addressDetail: "",
};

export default function StaffRegisterModal({
  open,
  onClose,
  onSuccess,
}: StaffRegisterModalProps) {
  const [form, setForm] = React.useState<FormState>(initialForm);
  const [departments, setDepartments] = React.useState<DepartmentItem[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!open) return;
    setForm(initialForm);
    setError(null);
    fetchDepartmentListApi()
      .then(setDepartments)
      .catch(() => setError("부서 목록을 불러오지 못했습니다."));
  }, [open]);

  const updateField = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const licenseRequired = form.staffType === "DOC" || form.staffType === "NUR";

  const validate = (): string | null => {
    if (!form.staffId.trim()) return "사번을 입력하세요.";
    if (!form.staffPassword.trim()) return "비밀번호를 입력하세요.";
    if (!form.staffDepartmentId) return "소속 부서를 선택하세요.";
    if (!form.staffName.trim()) return "이름을 입력하세요.";
    if (!form.staffType) return "직군을 선택하세요.";
    if (!form.staffRankCode) return "직급을 선택하세요.";
    if (!form.staffBirthDate) return "생년월일을 입력하세요.";
    if (!form.staffHireDate) return "입사일을 입력하세요.";
    if (!form.staffPhone.trim()) return "휴대폰번호를 입력하세요.";
    if (!form.addressZipCode.trim() || !form.addressBase.trim()) {
      return "주소(우편번호, 기본주소)를 입력하세요.";
    }
    if (licenseRequired && !form.staffLicenseNo.trim()) {
      return "의사/간호 직군은 면허번호가 필요합니다.";
    }
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    const payload: StaffRegisterRequest = {
      staffId: form.staffId.trim(),
      staffPassword: form.staffPassword,
      staffName: form.staffName.trim(),
      staffType: form.staffType,
      staffDepartmentId: form.staffDepartmentId,
      staffRankCode: form.staffRankCode,
      staffPhone: form.staffPhone.trim(),
      staffBirthDate: form.staffBirthDate,
      staffHireDate: form.staffHireDate,
      addressZipCode: form.addressZipCode.trim(),
      addressBase: form.addressBase.trim(),
      addressDetail: form.addressDetail.trim() || undefined,
      staffEmail: form.staffEmail.trim() || undefined,
      staffLicenseNo: form.staffLicenseNo.trim() || undefined,
    };

    setLoading(true);
    setError(null);
    try {
      await registerStaffApi(payload);
      onSuccess();
      onClose();
    } catch {
      setError("직원 등록에 실패했습니다. 입력값과 서버 로그를 확인하세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontWeight: 800, color: "var(--brand-strong)" }}>
        신규 직원 등록
      </DialogTitle>
      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: "flex", gap: 3, flexDirection: { xs: "column", md: "row" } }}>
          <Box
            sx={{
              width: { xs: "100%", md: 180 },
              flexShrink: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Box
              sx={{
                width: 140,
                height: 140,
                border: "1px dashed var(--line)",
                borderRadius: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--muted)",
                bgcolor: "var(--panel-soft)",
              }}
            >
              <CloudUploadOutlinedIcon />
              <Typography variant="caption">사진 업로드</Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">
              선택사항 (준비 중)
            </Typography>
          </Box>

          <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ display: "grid", gridTemplateColumns: { md: "1fr 1fr" }, gap: 2 }}>
              <TextField
                required
                label="사번"
                placeholder="doctor01"
                value={form.staffId}
                onChange={(e) => updateField("staffId", e.target.value)}
                size="small"
              />
              <TextField
                required
                label="비밀번호"
                type="password"
                value={form.staffPassword}
                onChange={(e) => updateField("staffPassword", e.target.value)}
                size="small"
              />
              <FormControl required size="small">
                <InputLabel id="dept-label">소속 부서</InputLabel>
                <Select
                  labelId="dept-label"
                  label="소속 부서"
                  value={form.staffDepartmentId}
                  onChange={(e) => updateField("staffDepartmentId", e.target.value)}
                >
                  <MenuItem value="">
                    <em>부서 선택</em>
                  </MenuItem>
                  {departments.map((dept) => (
                    <MenuItem key={dept.departmentId} value={dept.departmentId}>
                      {dept.departmentName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                required
                label="이름"
                placeholder="홍길동"
                value={form.staffName}
                onChange={(e) => updateField("staffName", e.target.value)}
                size="small"
              />
              <FormControl required size="small">
                <InputLabel id="type-label">직군</InputLabel>
                <Select
                  labelId="type-label"
                  label="직군"
                  value={form.staffType}
                  onChange={(e) => updateField("staffType", e.target.value)}
                >
                  <MenuItem value="">
                    <em>직군 선택</em>
                  </MenuItem>
                  {STAFF_TYPE_OPTIONS.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl required size="small">
                <InputLabel id="rank-label">직급</InputLabel>
                <Select
                  labelId="rank-label"
                  label="직급"
                  value={form.staffRankCode}
                  onChange={(e) => updateField("staffRankCode", e.target.value)}
                >
                  <MenuItem value="">
                    <em>직급 선택</em>
                  </MenuItem>
                  {RANK_OPTIONS.map((rank) => (
                    <MenuItem key={rank} value={rank}>
                      {rank}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                required
                label="생년월일"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={form.staffBirthDate}
                onChange={(e) => updateField("staffBirthDate", e.target.value)}
                size="small"
              />
              <TextField
                required
                label="입사일"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={form.staffHireDate}
                onChange={(e) => updateField("staffHireDate", e.target.value)}
                size="small"
              />
              <TextField
                label="이메일"
                placeholder="doctor@hospital.com"
                value={form.staffEmail}
                onChange={(e) => updateField("staffEmail", e.target.value)}
                size="small"
              />
              <TextField
                required
                label="휴대폰번호"
                placeholder="010-1234-5678"
                value={form.staffPhone}
                onChange={(e) => updateField("staffPhone", e.target.value)}
                size="small"
              />
              <TextField
                required={licenseRequired}
                label="면허번호"
                placeholder="Dr/Nur License No"
                helperText={licenseRequired ? "의사/간호 직군 필수" : "선택"}
                value={form.staffLicenseNo}
                onChange={(e) => updateField("staffLicenseNo", e.target.value)}
                size="small"
                sx={{ gridColumn: { md: "1 / -1" } }}
              />
            </Box>

            <Box>
              <Typography sx={{ fontWeight: 700, mb: 1 }}>
                주소 <Typography component="span" color="error">*</Typography>
              </Typography>
              <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                <TextField
                  required
                  label="우편번호"
                  size="small"
                  sx={{ width: 140 }}
                  value={form.addressZipCode}
                  onChange={(e) => updateField("addressZipCode", e.target.value)}
                />
                <Button variant="outlined" disabled sx={{ whiteSpace: "nowrap" }}>
                  우편번호 찾기
                </Button>
              </Box>
              <TextField
                required
                fullWidth
                label="기본주소"
                size="small"
                sx={{ mb: 1 }}
                value={form.addressBase}
                onChange={(e) => updateField("addressBase", e.target.value)}
              />
              <TextField
                fullWidth
                label="상세주소 (Option)"
                placeholder="4층 401호"
                size="small"
                value={form.addressDetail}
                onChange={(e) => updateField("addressDetail", e.target.value)}
              />
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} disabled={loading}>
          취소
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={loading}>
          {loading ? "등록 중..." : "등록 완료"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
