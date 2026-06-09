"use client";

import * as React from "react";
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import StaffRegisterModal from "@/components/staff/StaffRegisterModal";
import { fetchStaffListApi, type StaffItem } from "@/lib/api/StaffApi";

export default function StaffPage() {
  const [staffList, setStaffList] = React.useState<StaffItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [modalOpen, setModalOpen] = React.useState(false);

  const loadStaffList = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchStaffListApi();
      setStaffList(data);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadStaffList();
  }, [loadStaffList]);

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography sx={{ fontWeight: 800, fontSize: 22, color: "var(--brand-strong)" }}>
          직원 관리
        </Typography>
        <Button
          variant="contained"
          startIcon={<PersonAddOutlinedIcon />}
          onClick={() => setModalOpen(true)}
        >
          신규 직원 등록
        </Button>
      </Box>

      <Paper sx={{ overflow: "hidden" }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress size={28} />
          </Box>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>사번</TableCell>
                <TableCell>이름</TableCell>
                <TableCell>부서</TableCell>
                <TableCell>직급</TableCell>
                <TableCell>연락처</TableCell>
                <TableCell>상태</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {staffList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    등록된 직원이 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                staffList.map((staff) => (
                  <TableRow key={staff.staffId} hover>
                    <TableCell>{staff.staffId}</TableCell>
                    <TableCell>{staff.staffName}</TableCell>
                    <TableCell>{staff.staffDepartmentName ?? staff.staffDepartmentId}</TableCell>
                    <TableCell>{staff.staffRankCode}</TableCell>
                    <TableCell>{staff.staffPhone}</TableCell>
                    <TableCell>{staff.staffStatus}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </Paper>

      <StaffRegisterModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={loadStaffList}
      />
    </>
  );
}
