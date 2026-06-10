"use client"

import type { Employee } from "@/features/accounts/AccountTypes";
import { POSITION_LABEL, RANK_LABEL, ROLE_LABEL, STAFF_TYPE_LABEL, STATUS_LABEL } from "@/features/accounts/formConstants";
import { formatAddress } from "@/features/accounts/employeeUtils";
import { getStatusBadgeClass } from "./accountUiUtils";
import styles from "./AccountPageStyles.module.css";

type EmployeeDetailModalProps = {
  open: boolean;
  employee: Employee | null;
  loading?: boolean;
  onClose: () => void;
};

const DetailField = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className={styles.detailFieldLabel}>{label}</p>
    <p className={styles.detailFieldValue}>{value || "-"}</p>
  </div>
);

const LIST_STATUS_LABEL: Record<Employee["status"], string> = {
  ACTIVE: "재직 중",
  LEAVE: "휴직",
  RETIRED: "퇴직",
};

/** 직원 상세보기 — 등록 입력 + 시스템 자동 생성 필드 전체 표시 */
const EmployeeDetailModal = ({
  open,
  employee,
  loading = false,
  onClose,
}: EmployeeDetailModalProps) => {
  if (!open) return null;

  return (
    <div className={styles.modalOverlay} role="presentation" onClick={onClose}>
      <div
        className={styles.modalPanel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="employee-detail-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <h2 id="employee-detail-title" className={styles.modalTitle}>
            직원 상세정보
          </h2>
          <button type="button" className={styles.modalCloseBtn} onClick={onClose} aria-label="닫기">
            ×
          </button>
        </div>

        <div className={styles.modalBody}>
          {loading ? (
            <div className={styles.detailLoadingCenter}>
              <div className={`${styles.spinner} ${styles.spinnerLg}`} aria-label="로딩 중" />
            </div>
          ) : !employee ? (
            <div className={styles.detailEmpty}>직원 정보를 불러오지 못했습니다.</div>
          ) : (
            <>
              <div className={styles.detailProfile}>
                <div className={`${styles.profileAvatar} ${styles.profileAvatarSm}`}>
                  {employee.profileImage ? (
                    <img src={employee.profileImage} alt={`${employee.name} 프로필`} />
                  ) : (
                    <span className={styles.userIconSm} aria-hidden="true">
                      👤
                    </span>
                  )}
                </div>
                <div className={styles.detailProfileInfo}>
                  <h3 className={styles.detailName}>{employee.name}</h3>
                  <p className={styles.detailSubText}>
                    {employee.employeeId} · {employee.department}
                  </p>
                  <span className={getStatusBadgeClass(employee.status)}>
                    {LIST_STATUS_LABEL[employee.status]}
                  </span>
                </div>
              </div>

              <h4 className={styles.detailSectionTitle}>등록 정보</h4>
              <div className={`${styles.detailGrid} ${styles.detailGridSection}`}>
                <DetailField label="이름" value={employee.name} />
                <DetailField label="생년월일" value={employee.birthDate} />
                <DetailField label="소속 부서" value={employee.department} />
                <DetailField label="이메일" value={employee.email} />
                <DetailField label="휴대폰번호" value={employee.phoneNumber} />
                <DetailField label="면허번호" value={employee.licenseNumber} />
                <div className={styles.detailGridColFull}>
                  <p className={styles.detailFieldLabel}>주소</p>
                  <p className={styles.detailFieldValue}>{formatAddress(employee)}</p>
                </div>
              </div>

              <hr className={styles.detailDivider} />

              <h4 className={styles.detailSectionTitle}>시스템 자동 생성 정보</h4>
              <div className={styles.detailGrid}>
                <DetailField label="사번 [STAFF_ID]" value={employee.employeeId} />
                <DetailField
                  label="직군 [STAFF_TYPE]"
                  value={STAFF_TYPE_LABEL[employee.staffType] ?? employee.staffType}
                />
                <DetailField
                  label="직급 [STAFF_RANK_CODE]"
                  value={RANK_LABEL[employee.staffRankCode] ?? employee.staffRankCode}
                />
                <DetailField
                  label="직책 [STAFF_POSITION_CODE]"
                  value={POSITION_LABEL[employee.staffPositionCode] ?? employee.staffPositionCode}
                />
                <DetailField
                  label="권한 [STAFF_ROLE_CODE]"
                  value={ROLE_LABEL[employee.staffRoleCode] ?? employee.staffRoleCode}
                />
                <DetailField label="내선번호 [STAFF_EXTENSION_NO]" value={employee.staffExtensionNo} />
                <DetailField
                  label="재직 상태 [STAFF_STATUS]"
                  value={STATUS_LABEL[employee.status] ?? employee.status}
                />
                <DetailField label="입사일 [STAFF_HIRE_DATE]" value={employee.staffHireDate} />
              </div>
            </>
          )}
        </div>

        <div className={styles.modalFooter}>
          <button type="button" className={styles.modalCancelButton} onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailModal;
