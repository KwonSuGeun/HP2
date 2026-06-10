"use client";

import { useCallback, useEffect, useRef, useState, ChangeEvent } from "react";
import type { EmployeeRegisterForm } from "@/features/accounts/AccountTypes";
import { DEFAULT_REGISTER_FORM, DEPARTMENT_OPTIONS } from "@/features/accounts/formConstants";
import {
  isMedicalStaff,
  isValidKoreanMobilePhone,
  KOREAN_MOBILE_PHONE_INVALID_MESSAGE,
} from "@/features/accounts/employeeUtils";
import { formatDaumBaseAddress } from "@/lib/daumPostcode";
import AddressSearchDialog from "@/components/accounts/AddressSearchDialog";
import type { DaumPostcodeData } from "@/types/daumPostcode";
import styles from "./AccountPageStyles.module.css";

type EmployeeRegisterModalProps = {
  open: boolean;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (form: EmployeeRegisterForm) => void;
};

type FormErrors = Partial<Record<keyof EmployeeRegisterForm, string>>;

const MAX_PROFILE_SIZE_MB = 5;

const FieldLabel = ({ label, required, htmlFor }: { label: string; required?: boolean; htmlFor?: string }) => (
  <label className={styles.formLabel} htmlFor={htmlFor}>
    {label}
    {required ? <span className={styles.formRequiredMark}> *</span> : null}
  </label>
);

const IconUser = ({ className }: { className?: string }) => (
  <svg className={className ?? styles.registerProfileIcon} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M20 21a8 8 0 0 0-16 0M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const IconUpload = () => (
  <svg className={styles.registerUploadIcon} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M12 16V4m0 0 4 4m-4-4-4 4M5 20h14"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconMapPin = () => (
  <svg className={styles.registerSectionIcon} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10Z"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <circle cx="12" cy="11" r="2.5" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

/** 신규 직원 등록 모달 */
const EmployeeRegisterModal = ({
  open,
  loading = false,
  onClose,
  onSubmit,
}: EmployeeRegisterModalProps) => {
  const [form, setForm] = useState<EmployeeRegisterForm>(DEFAULT_REGISTER_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [addressSearchOpen, setAddressSearchOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const detailAddressRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setForm(DEFAULT_REGISTER_FORM);
      setErrors({});
      setPhotoError(null);
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

    if (file.size > MAX_PROFILE_SIZE_MB * 1024 * 1024) {
      setPhotoError(`JPG, PNG 파일은 최대 ${MAX_PROFILE_SIZE_MB}MB까지 업로드할 수 있습니다.`);
      event.target.value = "";
      return;
    }

    setPhotoError(null);
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
    if (!form.phoneNumber.trim()) {
      nextErrors.phoneNumber = "휴대폰번호는 필수입니다.";
    } else if (!isValidKoreanMobilePhone(form.phoneNumber)) {
      nextErrors.phoneNumber = KOREAN_MOBILE_PHONE_INVALID_MESSAGE;
    }
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

  if (!open) return null;

  return (
    <>
      <div className={styles.modalOverlay} role="presentation" onClick={loading ? undefined : onClose}>
        <div
          className={`${styles.modalPanel} ${styles.modalPanelRegister}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="employee-register-title"
          onClick={(event) => event.stopPropagation()}
        >
          <div className={styles.modalHeader}>
            <h2 id="employee-register-title" className={styles.modalTitle}>
              신규 직원 등록
            </h2>
            <button type="button" className={styles.modalCloseBtn} onClick={onClose} aria-label="닫기">
              ×
            </button>
          </div>

          <div className={`${styles.modalBody} ${styles.registerModalBody}`}>
            <div className={styles.registerFormLayout}>
              <aside className={styles.registerProfileSidebar}>
                <div className={styles.registerProfileAvatar}>
                  {form.profileImage ? (
                    <img src={form.profileImage} alt="프로필 미리보기" />
                  ) : (
                    <IconUser />
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  className={styles.hiddenInput}
                  onChange={handlePhotoUpload}
                />
                <button
                  type="button"
                  className={styles.registerUploadButton}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <IconUpload />
                  사진 업로드
                </button>
                <p className={styles.registerUploadHint}>
                  권장 크기 300x300px / JPG, PNG 파일 (최대 5MB)
                </p>
                {photoError ? <p className={styles.fieldError}>{photoError}</p> : null}
              </aside>

              <div className={styles.registerFormMain}>
                <section className={styles.registerFormSection}>
                  <h3 className={styles.registerSectionHeading}>
                    <IconUser className={styles.registerSectionIcon} />
                    기본 정보
                  </h3>
                  <div className={styles.registerFieldGrid}>
                    <div className={styles.registerField}>
                      <FieldLabel label="사번" required htmlFor="employeeId" />
                      <input
                        id="employeeId"
                        type="text"
                        className={`${styles.input} ${errors.employeeId ? styles.inputError : ""}`}
                        placeholder="사번을 입력하세요"
                        value={form.employeeId}
                        onChange={(event) => updateField("employeeId", event.target.value)}
                      />
                      {errors.employeeId ? <p className={styles.fieldError}>{errors.employeeId}</p> : null}
                    </div>

                    <div className={styles.registerField}>
                      <FieldLabel label="비밀번호" required htmlFor="password" />
                      <input
                        id="password"
                        type="password"
                        className={`${styles.input} ${errors.password ? styles.inputError : ""}`}
                        placeholder="비밀번호를 입력하세요"
                        value={form.password}
                        onChange={(event) => updateField("password", event.target.value)}
                      />
                      {errors.password ? <p className={styles.fieldError}>{errors.password}</p> : null}
                    </div>

                    <div className={styles.registerField}>
                      <FieldLabel label="소속 부서" required htmlFor="departmentId" />
                      <select
                        id="departmentId"
                        className={`${styles.select} ${errors.departmentId ? styles.inputError : ""}`}
                        value={form.departmentId}
                        onChange={(event) => updateField("departmentId", event.target.value)}
                      >
                        <option value="" disabled>
                          부서 선택
                        </option>
                        {DEPARTMENT_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {errors.departmentId ? <p className={styles.fieldError}>{errors.departmentId}</p> : null}
                    </div>

                    <div className={styles.registerField}>
                      <FieldLabel label="이름" required htmlFor="name" />
                      <input
                        id="name"
                        type="text"
                        className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
                        placeholder="이름을 입력하세요"
                        value={form.name}
                        onChange={(event) => updateField("name", event.target.value)}
                      />
                      {errors.name ? <p className={styles.fieldError}>{errors.name}</p> : null}
                    </div>

                    <div className={styles.registerField}>
                      <FieldLabel label="생년월일" required htmlFor="birthDate" />
                      <input
                        id="birthDate"
                        type="date"
                        className={`${styles.input} ${styles.inputDate} ${errors.birthDate ? styles.inputError : ""}`}
                        value={form.birthDate}
                        onChange={(event) => updateField("birthDate", event.target.value)}
                      />
                      {errors.birthDate ? <p className={styles.fieldError}>{errors.birthDate}</p> : null}
                    </div>

                    <div className={styles.registerField}>
                      <FieldLabel label="이메일" htmlFor="email" />
                      <input
                        id="email"
                        type="email"
                        className={styles.input}
                        placeholder="이메일을 입력하세요"
                        value={form.email}
                        onChange={(event) => updateField("email", event.target.value)}
                      />
                    </div>

                    <div className={styles.registerField}>
                      <FieldLabel label="휴대폰번호" required htmlFor="phoneNumber" />
                      <input
                        id="phoneNumber"
                        type="tel"
                        className={`${styles.input} ${errors.phoneNumber ? styles.inputError : ""}`}
                        placeholder="010-1234-5678"
                        value={form.phoneNumber}
                        onChange={(event) => updateField("phoneNumber", event.target.value)}
                      />
                      {errors.phoneNumber ? <p className={styles.fieldError}>{errors.phoneNumber}</p> : null}
                    </div>

                    <div className={styles.registerField}>
                      <FieldLabel label="면허번호" htmlFor="licenseNumber" />
                      <input
                        id="licenseNumber"
                        type="text"
                        className={`${styles.input} ${errors.licenseNumber ? styles.inputError : ""}`}
                        placeholder="면허번호를 입력하세요"
                        value={form.licenseNumber}
                        onChange={(event) => updateField("licenseNumber", event.target.value)}
                      />
                      {errors.licenseNumber ? (
                        <p className={styles.fieldError}>{errors.licenseNumber}</p>
                      ) : (
                        <p className={styles.formFieldHint}>의사/간호사만 필수</p>
                      )}
                    </div>
                  </div>
                </section>

                <section className={styles.registerFormSection}>
                  <h3 className={styles.registerSectionHeading}>
                    <IconMapPin />
                    주소 정보
                  </h3>
                  <div className={styles.registerAddressBox}>
                    <div className={styles.registerAddressZipRow}>
                      <div className={styles.registerAddressZipField}>
                        <FieldLabel label="우편번호" required htmlFor="zipCode" />
                        <input
                          id="zipCode"
                          type="text"
                          readOnly
                          className={`${styles.input} ${styles.inputReadonly}`}
                          value={form.zipCode}
                          placeholder="우편번호를 입력하세요"
                        />
                      </div>
                      <button
                        type="button"
                        className={styles.registerZipButton}
                        onClick={() => setAddressSearchOpen(true)}
                      >
                        우편번호 찾기
                      </button>
                    </div>

                    <div className={styles.registerAddressField}>
                      <FieldLabel label="기본주소" required htmlFor="baseAddress" />
                      <input
                        id="baseAddress"
                        type="text"
                        readOnly
                        className={`${styles.input} ${styles.inputReadonly} ${errors.baseAddress ? styles.inputError : ""}`}
                        value={form.baseAddress}
                        placeholder="기본주소를 입력하세요"
                      />
                    </div>

                    <div className={styles.registerAddressField}>
                      <label className={`${styles.formLabel} ${styles.formLabelSmall}`} htmlFor="detailAddress">
                        상세주소 (선택)
                      </label>
                      <input
                        id="detailAddress"
                        ref={detailAddressRef}
                        type="text"
                        className={styles.input}
                        placeholder="상세주소를 입력하세요"
                        value={form.detailAddress}
                        onChange={(event) => updateField("detailAddress", event.target.value)}
                      />
                    </div>

                    {errors.baseAddress ? <p className={styles.fieldError}>{errors.baseAddress}</p> : null}
                  </div>
                </section>
              </div>
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button type="button" className={styles.modalCancelButton} onClick={onClose} disabled={loading}>
              취소
            </button>
            <button type="button" className={styles.modalSubmitButton} onClick={handleSubmit} disabled={loading}>
              {loading ? "등록 중..." : "등록 완료"}
            </button>
          </div>
        </div>
      </div>

      <AddressSearchDialog
        open={addressSearchOpen}
        onClose={() => setAddressSearchOpen(false)}
        onSelect={handleAddressSelect}
      />
    </>
  );
};

export default EmployeeRegisterModal;
