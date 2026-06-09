"use client"

import { useCallback, useEffect, useRef, useState, ChangeEvent } from "react";
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import type { EmployeeRegisterForm } from "@/features/accounts/AccountTypes";
import { DEFAULT_REGISTER_FORM, DEPARTMENT_OPTIONS } from "@/features/accounts/formConstants";
import { isMedicalStaff } from "@/features/accounts/employeeUtils";
import { formatDaumBaseAddress } from "@/lib/daumPostcode";
import AddressSearchDialog from "@/components/accounts/AddressSearchDialog";
import type { DaumPostcodeData } from "@/types/daumPostcode";
import {
  formFieldHintSx,
  formLabelSx,
  modalCancelButtonSx,
  modalSubmitButtonSx,
  modalTitleSx,
  profileAvatarSx,
  uploadButtonSx,
  zipFindButtonSx,
} from "./AccountPageStyles";
import styles from "./AccountPageStyles.module.css";

type EmployeeRegisterModalProps = {
  open: boolean;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (form: EmployeeRegisterForm) => void;
};

type FormErrors = Partial<Record<keyof EmployeeRegisterForm, string>>;

const FieldLabel = ({ label, required }: { label: string; required?: boolean }) => (
    <Typography sx={formLabelSx}>
      {label}
      {required ? " *" : ""}
  </Typography>
);

/** 신규 직원 등록 모달 — 사용자 입력 필드 9개만 */
const EmployeeRegisterModal = ({
  open,
  loading = false,
  onClose,
  onSubmit,
}: EmployeeRegisterModalProps) => {
  const [form, setForm] = useState<EmployeeRegisterForm>(DEFAULT_REGISTER_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [addressSearchOpen, setAddressSearchOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const detailAddressRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setForm(DEFAULT_REGISTER_FORM);
      setErrors({});
      setAddressSearchOpen(false);
    }
  }, [open]);

  const updateField = <K extends keyof EmployeeRegisterForm>(
    key: K,
    value: EmployeeRegisterForm[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handlePhotoUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updateField("profileImage", reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleAddressSelect = useCallback((data: DaumPostcodeData) => {
    setForm((prev) => ({
      ...prev,
      zipCode: data.zonecode,
      baseAddress: formatDaumBaseAddress(data),
      detailAddress: "",
    }));
    setErrors((prev) => ({ ...prev, baseAddress: undefined }));
    setTimeout(() => detailAddressRef.current?.focus(), 100);
  }, []);

  const validate = (): boolean => {
    const nextErrors: FormErrors = {};

    if (!form.employeeId.trim()) nextErrors.employeeId = "사번은 필수입니다.";
    if (!form.password.trim()) nextErrors.password = "비밀번호는 필수입니다.";
    if (!form.name.trim()) nextErrors.name = "이름은 필수입니다.";
    if (!form.birthDate) nextErrors.birthDate = "생년월일은 필수입니다.";
    if (!form.departmentId) nextErrors.departmentId = "소속 부서는 필수입니다.";
    if (!form.phoneNumber.trim()) nextErrors.phoneNumber = "휴대폰번호는 필수입니다.";
    if (!form.zipCode.trim() || !form.baseAddress.trim()) {
      nextErrors.baseAddress = "주소(우편번호, 기본주소)는 필수입니다.";
    }
    if (isMedicalStaff(form.departmentId) && !form.licenseNumber.trim()) {
      nextErrors.licenseNumber = "의사/간호사는 면허번호가 필수입니다.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit(form);
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="md"
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: 3 } } }}
    >
      <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pb: 1 }}>
        <Typography sx={modalTitleSx}>신규 직원 등록</Typography>
        <IconButton size="small" onClick={onClose} aria-label="닫기">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ pt: 2 }}>
        <div className={styles.formLayout}>
          {/* 좌측: 프로필 사진 */}
          <div>
            <div className={styles.profileUploadArea}>
              <Avatar src={form.profileImage ?? undefined} sx={profileAvatarSx}>
                {!form.profileImage ? <PersonOutlinedIcon sx={{ fontSize: 48 }} /> : null}
              </Avatar>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handlePhotoUpload}
              />
              <Button
                variant="outlined"
                size="small"
                startIcon={<ImageOutlinedIcon />}
                sx={uploadButtonSx}
                onClick={() => fileInputRef.current?.click()}
              >
                사진 업로드
              </Button>
              <Typography sx={formFieldHintSx}>선택사항</Typography>
            </div>
          </div>

          {/* 우측: 입력 필드 */}
          <div>
            <div className={styles.formGrid}>
              <div>
                <FieldLabel label="사번" required />
                <TextField
                  fullWidth
                  size="small"
                  placeholder="doctor01"
                  value={form.employeeId}
                  error={!!errors.employeeId}
                  helperText={errors.employeeId}
                  onChange={(event) => updateField("employeeId", event.target.value)}
                />
              </div>

              <div>
                <FieldLabel label="비밀번호" required />
                <TextField
                  fullWidth
                  size="small"
                  type="password"
                  value={form.password}
                  error={!!errors.password}
                  helperText={errors.password}
                  onChange={(event) => updateField("password", event.target.value)}
                />
              </div>

              <div>
                <FieldLabel label="소속 부서" required />
                <FormControl fullWidth size="small" error={!!errors.departmentId}>
                  <Select
                    displayEmpty
                    value={form.departmentId}
                    onChange={(event) => updateField("departmentId", event.target.value)}
                  >
                    <MenuItem value="" disabled>
                      부서 선택
                    </MenuItem>
                    {DEPARTMENT_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.departmentId ? (
                    <Typography sx={{ ...formFieldHintSx, color: "error.main", mt: 0.5 }}>
                      {errors.departmentId}
                    </Typography>
                  ) : null}
                </FormControl>
              </div>

              <div>
                <FieldLabel label="이름" required />
                <TextField
                  fullWidth
                  size="small"
                  placeholder="홍길동"
                  value={form.name}
                  error={!!errors.name}
                  helperText={errors.name}
                  onChange={(event) => updateField("name", event.target.value)}
                />
              </div>

              <div>
                <FieldLabel label="생년월일" required />
                <TextField
                  fullWidth
                  size="small"
                  type="date"
                  value={form.birthDate}
                  error={!!errors.birthDate}
                  helperText={errors.birthDate}
                  onChange={(event) => updateField("birthDate", event.target.value)}
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </div>

              <div>
                <FieldLabel label="이메일" />
                <TextField
                  fullWidth
                  size="small"
                  placeholder="doctor@hospital.com"
                  value={form.email}
                  onChange={(event) => updateField("email", event.target.value)}
                />
                <Typography sx={formFieldHintSx}>선택</Typography>
              </div>

              <div>
                <FieldLabel label="휴대폰번호" required />
                <TextField
                  fullWidth
                  size="small"
                  placeholder="010-1234-5678"
                  value={form.phoneNumber}
                  error={!!errors.phoneNumber}
                  helperText={errors.phoneNumber}
                  onChange={(event) => updateField("phoneNumber", event.target.value)}
                />
              </div>

              <div>
                <FieldLabel label="면허번호" />
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Dr/Nur License No"
                  value={form.licenseNumber}
                  error={!!errors.licenseNumber}
                  helperText={errors.licenseNumber ?? "의사/간호사만 필수"}
                  onChange={(event) => updateField("licenseNumber", event.target.value)}
                />
              </div>

              <div className={styles.formGridColFull}>
                <FieldLabel label="주소" required />
                <div className={styles.addressSection}>
                  <div className={styles.addressGrid}>
                    <div>
                      <Typography sx={{ ...formLabelSx, fontSize: 11 }}>우편번호</Typography>
                      <TextField
                        fullWidth
                        size="small"
                        value={form.zipCode}
                        placeholder="우편번호 찾기로 입력"
                        slotProps={{ input: { readOnly: true } }}
                        sx={{ "& .MuiInputBase-input": { bgcolor: "rgba(0,0,0,0.02)" } }}
                      />
                    </div>
                    <div className={styles.addressButtonCol}>
                      <Button
                        variant="outlined"
                        sx={zipFindButtonSx}
                        onClick={() => setAddressSearchOpen(true)}
                      >
                        우편번호 찾기
                      </Button>
                    </div>
                    <div className={styles.addressGridColFull}>
                      <Typography sx={{ ...formLabelSx, fontSize: 11 }}>기본주소</Typography>
                      <TextField
                        fullWidth
                        size="small"
                        value={form.baseAddress}
                        placeholder="우편번호 찾기로 입력"
                        error={!!errors.baseAddress}
                        slotProps={{ input: { readOnly: true } }}
                        sx={{ "& .MuiInputBase-input": { bgcolor: "rgba(0,0,0,0.02)" } }}
                      />
                    </div>
                    <div className={styles.addressGridColFull}>
                      <Typography sx={{ ...formLabelSx, fontSize: 11 }}>상세주소 (Option)</Typography>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="4층 401호"
                        value={form.detailAddress}
                        inputRef={detailAddressRef}
                        onChange={(event) => updateField("detailAddress", event.target.value)}
                      />
                    </div>
                    {errors.baseAddress ? (
                      <div className={styles.addressGridColFull}>
                        <Typography sx={{ fontSize: 11, color: "error.main" }}>
                          {errors.baseAddress}
                        </Typography>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button variant="outlined" sx={modalCancelButtonSx} onClick={onClose} disabled={loading}>
          취소
        </Button>
        <Button
          variant="contained"
          startIcon={<SaveOutlinedIcon />}
          sx={modalSubmitButtonSx}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "등록 중..." : "등록 완료"}
        </Button>
      </DialogActions>

      <AddressSearchDialog
        open={addressSearchOpen}
        onClose={() => setAddressSearchOpen(false)}
        onSelect={handleAddressSelect}
      />
    </Dialog>
  );
};

export default EmployeeRegisterModal;
