"use client"

import { useCallback, useEffect, useRef, useState, ChangeEvent } from "react";
import type { EmployeeRegisterForm } from "@/features/accounts/AccountTypes";
import { DEFAULT_REGISTER_FORM, DEPARTMENT_OPTIONS } from "@/features/accounts/formConstants";
import { isMedicalStaff, isValidKoreanMobilePhone, KOREAN_MOBILE_PHONE_INVALID_MESSAGE } from "@/features/accounts/employeeUtils";
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

const FieldLabel = ({ label, required, htmlFor }: { label: string; required?: boolean; htmlFor?: string }) => (
  <label className={styles.formLabel} htmlFor={htmlFor}>
    {label}
    {required ? " *" : ""}
  </label>
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
          className={styles.modalPanel}
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

          <div className={styles.modalBody}>
            <div className={styles.formLayout}>
              <div>
                <div className={styles.profileUploadArea}>
                  <div className={styles.profileAvatar}>
                    {form.profileImage ? (
                      <img src={form.profileImage} alt="프로필 미리보기" />
                    ) : (
                      <span className={styles.userIconLg} aria-hidden="true">
                        👤
                      </span>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className={styles.hiddenInput}
                    onChange={handlePhotoUpload}
                  />
                  <button
                    type="button"
                    className={styles.outlineButton}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    사진 업로드
                  </button>
                  <p className={styles.formFieldHint}>선택사항</p>
                </div>
              </div>

              <div>
                <div className={styles.formGrid}>
                  <div>
                    <FieldLabel label="사번" required htmlFor="employeeId" />
                    <input
                      id="employeeId"
                      type="text"
                      className={`${styles.input} ${errors.employeeId ? styles.inputError : ""}`}
                      placeholder="doctor01"
                      value={form.employeeId}
                      onChange={(event) => updateField("employeeId", event.target.value)}
                    />
                    {errors.employeeId ? <p className={styles.fieldError}>{errors.employeeId}</p> : null}
                  </div>

                  <div>
                    <FieldLabel label="비밀번호" required htmlFor="password" />
                    <input
                      id="password"
                      type="password"
                      className={`${styles.input} ${errors.password ? styles.inputError : ""}`}
                      value={form.password}
                      onChange={(event) => updateField("password", event.target.value)}
                    />
                    {errors.password ? <p className={styles.fieldError}>{errors.password}</p> : null}
                  </div>

                  <div>
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

                  <div>
                    <FieldLabel label="이름" required htmlFor="name" />
                    <input
                      id="name"
                      type="text"
                      className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
                      placeholder="홍길동"
                      value={form.name}
                      onChange={(event) => updateField("name", event.target.value)}
                    />
                    {errors.name ? <p className={styles.fieldError}>{errors.name}</p> : null}
                  </div>

                  <div>
                    <FieldLabel label="생년월일" required htmlFor="birthDate" />
                    <input
                      id="birthDate"
                      type="date"
                      className={`${styles.input} ${errors.birthDate ? styles.inputError : ""}`}
                      value={form.birthDate}
                      onChange={(event) => updateField("birthDate", event.target.value)}
                    />
                    {errors.birthDate ? <p className={styles.fieldError}>{errors.birthDate}</p> : null}
                  </div>

                  <div>
                    <FieldLabel label="이메일" htmlFor="email" />
                    <input
                      id="email"
                      type="email"
                      className={styles.input}
                      placeholder="doctor@hospital.com"
                      value={form.email}
                      onChange={(event) => updateField("email", event.target.value)}
                    />
                    <p className={styles.formFieldHint}>선택</p>
                  </div>

                  <div>
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

                  <div>
                    <FieldLabel label="면허번호" htmlFor="licenseNumber" />
                    <input
                      id="licenseNumber"
                      type="text"
                      className={`${styles.input} ${errors.licenseNumber ? styles.inputError : ""}`}
                      placeholder="Dr/Nur License No"
                      value={form.licenseNumber}
                      onChange={(event) => updateField("licenseNumber", event.target.value)}
                    />
                    {errors.licenseNumber ? (
                      <p className={styles.fieldError}>{errors.licenseNumber}</p>
                    ) : (
                      <p className={styles.formFieldHint}>의사/간호사만 필수</p>
                    )}
                  </div>

                  <div className={styles.formGridColFull}>
                    <FieldLabel label="주소" required />
                    <div className={styles.addressSection}>
                      <div className={styles.addressGrid}>
                        <div>
                          <label className={`${styles.formLabel} ${styles.formLabelSmall}`} htmlFor="zipCode">
                            우편번호
                          </label>
                          <input
                            id="zipCode"
                            type="text"
                            readOnly
                            className={`${styles.input} ${styles.inputReadonly}`}
                            value={form.zipCode}
                            placeholder="우편번호 찾기로 입력"
                          />
                        </div>
                        <div className={styles.addressButtonCol}>
                          <button
                            type="button"
                            className={styles.outlineButton}
                            onClick={() => setAddressSearchOpen(true)}
                          >
                            우편번호 찾기
                          </button>
                        </div>
                        <div className={styles.addressGridColFull}>
                          <label className={`${styles.formLabel} ${styles.formLabelSmall}`} htmlFor="baseAddress">
                            기본주소
                          </label>
                          <input
                            id="baseAddress"
                            type="text"
                            readOnly
                            className={`${styles.input} ${styles.inputReadonly} ${errors.baseAddress ? styles.inputError : ""}`}
                            value={form.baseAddress}
                            placeholder="우편번호 찾기로 입력"
                          />
                        </div>
                        <div className={styles.addressGridColFull}>
                          <label className={`${styles.formLabel} ${styles.formLabelSmall}`} htmlFor="detailAddress">
                            상세주소 (Option)
                          </label>
                          <input
                            id="detailAddress"
                            ref={detailAddressRef}
                            type="text"
                            className={styles.input}
                            placeholder="4층 401호"
                            value={form.detailAddress}
                            onChange={(event) => updateField("detailAddress", event.target.value)}
                          />
                        </div>
                        {errors.baseAddress ? (
                          <div className={styles.addressGridColFull}>
                            <p className={styles.fieldError}>{errors.baseAddress}</p>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
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
