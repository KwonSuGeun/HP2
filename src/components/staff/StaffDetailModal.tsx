"use client";

import type { ReactNode } from "react";
import type { Staff } from "@/features/staff/StaffTypes";
import {
  POSITION_LABEL,
  RANK_LABEL,
  ROLE_LABEL,
  STAFF_TYPE_LABEL,
  STATUS_LABEL,
} from "@/features/staff/formConstants";
import { formatAddress } from "@/features/staff/staffFormUtils";
import styles from "./StaffPageStyles.module.css";

type StaffDetailModalProps = {
  open: boolean;
  staff: Staff | null;
  loading?: boolean;
  deleting?: boolean;
  onClose: () => void;
  onDelete?: (staff: Staff) => void;
};

const LIST_STATUS_LABEL: Record<Staff["status"], string> = {
  ACTIVE: "재직 중",
  LEAVE: "휴직",
  RETIRED: "퇴직",
};

const displayValue = (value?: string | null) => (value?.trim() ? value.trim() : "-");

type IconProps = { className?: string };

const IconUser = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M20 21a8 8 0 0 0-16 0M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const IconCalendar = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" />
    <path d="M8 3v4M16 3v4M3 10h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const IconMail = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
    <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const IconBuilding = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M4 21V7l8-4 8 4v14M9 21v-4h6v4M10 10h.01M14 10h.01M10 14h.01M14 14h.01"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const IconMobile = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="7" y="2" width="10" height="20" rx="2" stroke="currentColor" strokeWidth="1.8" />
    <path d="M11 18h2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const IconBadge = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M12 3 14.5 8.5 20 9l-4 4 1 5.5L12 16.5 7 18.5 8 13 4 9l5.5-.5L12 3Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
  </svg>
);

const IconMapPin = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10Z"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <circle cx="12" cy="11" r="2.5" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

const IconSettings = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
    <path
      d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const IconTrash = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M4 7h16M9 7V5h6v2M10 11v6M14 11v6M6 7l1 12h10l1-12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

type BasicInfoCardProps = {
  icon: ReactNode;
  label: string;
  value: string;
  underEmailDept?: boolean;
};

const BasicInfoCard = ({ icon, label, value, underEmailDept }: BasicInfoCardProps) => (
  <div
    className={`${styles.detailBasicCard} ${underEmailDept ? styles.detailBasicCardUnderDept : ""}`}
  >
    <div className={styles.detailBasicCardHeader}>
      <span className={styles.detailBasicCardIcon}>{icon}</span>
      <p className={styles.detailBasicCardLabel}>{label}</p>
    </div>
    <p className={styles.detailBasicCardValue}>{value}</p>
  </div>
);

type SystemInfoCellProps = {
  label: string;
  field: string;
  value: string;
};

const SystemInfoCell = ({ label, field, value }: SystemInfoCellProps) => (
  <div className={styles.detailSystemCell}>
    <p className={styles.detailSystemCellLabel}>
      {label} <span className={styles.detailSystemCellField}>({field})</span>
    </p>
    <p className={styles.detailSystemCellValue}>{value}</p>
  </div>
);

/** 직원 상세보기 — 2단 레이아웃 (프로필 사이드바 + 기본/시스템 정보) */
const StaffDetailModal = ({
  open,
  staff,
  loading = false,
  deleting = false,
  onClose,
  onDelete,
}: StaffDetailModalProps) => {
  if (!open) return null;

  const handleDelete = () => {
    if (!staff || !onDelete) return;
    const confirmed = window.confirm(`"${staff.name}" 직원을 목록에서 삭제하시겠습니까?`);
    if (!confirmed) return;
    onDelete(staff);
  };

  const staffTypeLabel = staff
    ? STAFF_TYPE_LABEL[staff.staffType] ?? staff.staffType
    : "-";
  const rankLabel = staff ? RANK_LABEL[staff.staffRankCode] ?? staff.staffRankCode : "-";
  const positionLabel = staff
    ? POSITION_LABEL[staff.staffPositionCode] ?? staff.staffPositionCode
    : "-";
  const roleLabel = staff ? ROLE_LABEL[staff.staffRoleCode] ?? staff.staffRoleCode : "-";
  const statusLabel = staff
    ? STATUS_LABEL[staff.rawStaffStatus ?? ""] ??
      STATUS_LABEL[staff.status] ??
      staff.rawStaffStatus ??
      staff.status
    : "-";

  return (
    <div className={styles.modalOverlay} role="presentation" onClick={onClose}>
      <div
        className={`${styles.modalPanel} ${styles.modalPanelDetail}`}
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

        <div className={`${styles.modalBody} ${styles.detailModalBody}`}>
          {loading ? (
            <div className={styles.detailLoadingCenter}>
              <div className={`${styles.spinner} ${styles.spinnerLg}`} aria-label="로딩 중" />
            </div>
          ) : !staff ? (
            <div className={styles.detailEmpty}>직원 정보를 불러오지 못했습니다.</div>
          ) : (
            <div className={styles.detailLayout}>
              <aside className={styles.detailSidebar}>
                <div className={styles.detailSidebarProfile}>
                  <div className={styles.detailSidebarAvatar}>
                    {staff.profileImage ? (
                      <img src={staff.profileImage} alt={`${staff.name} 프로필`} />
                    ) : (
                      <IconUser className={styles.detailSidebarAvatarFallback} />
                    )}
                  </div>
                  <h3 className={styles.detailSidebarName}>{staff.name}</h3>
                  <p className={styles.detailSidebarSubText}>
                    {staff.staffId} · {staff.department}
                  </p>
                  <span className={styles.detailStatusPill}>
                    <span className={styles.detailStatusDot} aria-hidden="true" />
                    {LIST_STATUS_LABEL[staff.status]}
                  </span>
                </div>
              </aside>

              <div className={styles.detailMain}>
                <section className={styles.detailSection}>
                  <h4 className={styles.detailSectionHeading}>
                    <IconUser className={styles.detailSectionIcon} />
                    기본 정보
                  </h4>
                  <div className={styles.detailBasicGrid}>
                    <BasicInfoCard
                      icon={<IconUser className={styles.detailIcon} />}
                      label="이름"
                      value={displayValue(staff.name)}
                    />
                    <BasicInfoCard
                      icon={<IconCalendar className={styles.detailIcon} />}
                      label="생년월일"
                      value={displayValue(staff.birthDate)}
                    />
                    <BasicInfoCard
                      icon={<IconMail className={styles.detailIcon} />}
                      label="이메일"
                      value={displayValue(staff.email)}
                    />
                    <BasicInfoCard
                      icon={<IconBuilding className={styles.detailIcon} />}
                      label="소속 부서"
                      value={displayValue(staff.department)}
                    />
                    <BasicInfoCard
                      icon={<IconMobile className={styles.detailIcon} />}
                      label="휴대폰번호"
                      value={displayValue(staff.phoneNumber)}
                    />
                    <BasicInfoCard
                      icon={<IconBadge className={styles.detailIcon} />}
                      label="면허번호"
                      value={displayValue(staff.licenseNumber)}
                    />
                    <BasicInfoCard
                      icon={<IconMapPin className={styles.detailIcon} />}
                      label="주소"
                      value={formatAddress(staff)}
                      underEmailDept
                    />
                  </div>
                </section>

                <section className={styles.detailSection}>
                  <h4 className={styles.detailSectionHeading}>
                    <IconSettings className={styles.detailSectionIcon} />
                    시스템 정보
                  </h4>
                  <div className={styles.detailSystemPanel}>
                    <SystemInfoCell label="사번" field="STAFF_ID" value={displayValue(staff.staffId)} />
                    <SystemInfoCell
                      label="직급"
                      field="STAFF_RANK_CODE"
                      value={displayValue(rankLabel)}
                    />
                    <SystemInfoCell
                      label="직급"
                      field="STAFF_TYPE"
                      value={displayValue(staffTypeLabel)}
                    />
                    <SystemInfoCell
                      label="내선번호"
                      field="STAFF_EXTENSION_NO"
                      value={displayValue(staff.staffExtensionNo)}
                    />
                    <SystemInfoCell
                      label="직책"
                      field="STAFF_POSITION_CODE"
                      value={displayValue(positionLabel)}
                    />
                    <SystemInfoCell
                      label="입사일"
                      field="STAFF_HIRE_DATE"
                      value={displayValue(staff.staffHireDate)}
                    />
                    <SystemInfoCell label="권한" field="STAFF_ROLE_CODE" value={displayValue(roleLabel)} />
                    <SystemInfoCell label="재직 상태" field="STAFF_STATUS" value={displayValue(statusLabel)} />
                  </div>
                </section>
              </div>
            </div>
          )}
        </div>

        {staff && !loading && onDelete ? (
          <div className={styles.modalFooter}>
            <button
              type="button"
              className={styles.modalDeleteButton}
              onClick={handleDelete}
              disabled={deleting}
            >
              <IconTrash className={styles.modalDeleteIcon} />
              {deleting ? "삭제 중..." : "삭제하기"}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default StaffDetailModal;
