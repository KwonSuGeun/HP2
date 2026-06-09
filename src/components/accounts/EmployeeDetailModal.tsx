"use client"

import {
  Avatar,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import type { Employee } from "@/features/accounts/AccountTypes";
import { POSITION_LABEL, RANK_LABEL, ROLE_LABEL, STAFF_TYPE_LABEL, STATUS_LABEL } from "@/features/accounts/formConstants";
import { formatAddress } from "@/features/accounts/employeeUtils";
import {
  detailFieldLabelSx,
  detailFieldValueSx,
  detailSectionTitleSx,
  modalCancelButtonSx,
  modalTitleSx,
  profileAvatarSx,
  statusBadgeSx,
} from "./AccountPageStyles";
import styles from "./AccountPageStyles.module.css";

type EmployeeDetailModalProps = {
  open: boolean;
  employee: Employee | null;
  loading?: boolean;
  onClose: () => void;
};

const DetailField = ({ label, value }: { label: string; value: string }) => (
  <Grid size={{ xs: 12, sm: 6 }}>
    <Typography sx={detailFieldLabelSx}>{label}</Typography>
    <Typography sx={detailFieldValueSx}>{value || "-"}</Typography>
  </Grid>
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
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: 3 } } }}
    >
      <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pb: 1 }}>
        <Typography sx={modalTitleSx}>직원 상세정보</Typography>
        <IconButton size="small" onClick={onClose} aria-label="닫기">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ pt: 2, minHeight: 280 }}>
        {loading ? (
          <div className={styles.detailLoadingCenter}>
            <CircularProgress />
          </div>
        ) : !employee ? (
          <div className={styles.detailEmpty}>
            직원 정보를 불러오지 못했습니다.
          </div>
        ) : (
          <>
        <div className={styles.detailProfile}>
          <Avatar src={employee.profileImage ?? undefined} sx={{ ...profileAvatarSx, width: 72, height: 72 }}>
            {!employee.profileImage ? <PersonOutlinedIcon sx={{ fontSize: 36 }} /> : null}
          </Avatar>
          <div className={styles.detailProfileInfo}>
            <Typography sx={{ fontWeight: 800, fontSize: 20 }}>{employee.name}</Typography>
            <Typography sx={{ color: "var(--muted)", fontSize: 13, mt: 0.5 }}>
              {employee.employeeId} · {employee.department}
            </Typography>
            <Typography component="span" sx={{ ...statusBadgeSx(employee.status), mt: 1, display: "inline-block" }}>
              {LIST_STATUS_LABEL[employee.status]}
            </Typography>
          </div>
        </div>

        <Typography sx={detailSectionTitleSx}>등록 정보</Typography>
        <Grid container spacing={2} sx={{ mb: 2.5 }}>
          <DetailField label="이름" value={employee.name} />
          <DetailField label="생년월일" value={employee.birthDate} />
          <DetailField label="소속 부서" value={employee.department} />
          <DetailField label="이메일" value={employee.email} />
          <DetailField label="휴대폰번호" value={employee.phoneNumber} />
          <DetailField label="면허번호" value={employee.licenseNumber} />
          <Grid size={12}>
            <Typography sx={detailFieldLabelSx}>주소</Typography>
            <Typography sx={detailFieldValueSx}>{formatAddress(employee)}</Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Typography sx={detailSectionTitleSx}>시스템 자동 생성 정보</Typography>
        <Grid container spacing={2}>
          <DetailField label="사번 [STAFF_ID]" value={employee.employeeId} />
          <DetailField label="직군 [STAFF_TYPE]" value={STAFF_TYPE_LABEL[employee.staffType] ?? employee.staffType} />
          <DetailField label="직급 [STAFF_RANK_CODE]" value={RANK_LABEL[employee.staffRankCode] ?? employee.staffRankCode} />
          <DetailField label="직책 [STAFF_POSITION_CODE]" value={POSITION_LABEL[employee.staffPositionCode] ?? employee.staffPositionCode} />
          <DetailField label="권한 [STAFF_ROLE_CODE]" value={ROLE_LABEL[employee.staffRoleCode] ?? employee.staffRoleCode} />
          <DetailField label="내선번호 [STAFF_EXTENSION_NO]" value={employee.staffExtensionNo} />
          <DetailField label="재직 상태 [STAFF_STATUS]" value={STATUS_LABEL[employee.status] ?? employee.status} />
          <DetailField label="입사일 [STAFF_HIRE_DATE]" value={employee.staffHireDate} />
        </Grid>
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button variant="outlined" sx={modalCancelButtonSx} onClick={onClose}>
          닫기
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmployeeDetailModal;
