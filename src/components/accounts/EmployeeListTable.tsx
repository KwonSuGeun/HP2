"use client"

import {
  Avatar,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import type { Employee } from "@/features/accounts/AccountTypes";
import {
  statusBadgeSx,
  nameLinkSx,
  tableBodyCellSx,
  tableHeadCellSx,
  tableRowEvenSx,
} from "./AccountPageStyles";
import styles from "./AccountPageStyles.module.css";

const TABLE_STATUS_LABEL: Record<Employee["status"], string> = {
  ACTIVE: "재직 중",
  LEAVE: "휴직",
  RETIRED: "퇴직",
};

type EmployeeListTableProps = {
  employees: Employee[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onNameClick: (employee: Employee) => void;
};

const EmployeeListTable = ({
  employees,
  page,
  totalPages,
  onPageChange,
  onNameClick,
}: EmployeeListTableProps) => {
  return (
    <div className={styles.tableCard}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={tableHeadCellSx} width={72}>
                사진
              </TableCell>
              <TableCell sx={tableHeadCellSx}>사번</TableCell>
              <TableCell sx={tableHeadCellSx}>이름</TableCell>
              <TableCell sx={tableHeadCellSx}>부서</TableCell>
              <TableCell sx={tableHeadCellSx}>직급</TableCell>
              <TableCell sx={tableHeadCellSx}>연락처</TableCell>
              <TableCell sx={tableHeadCellSx} width={100}>
                상태
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 6, color: "var(--muted)" }}>
                  검색 결과가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              employees.map((employee, index) => (
                <TableRow
                  key={employee.id}
                  sx={index % 2 === 1 ? tableRowEvenSx : undefined}
                  hover
                >
                  <TableCell sx={tableBodyCellSx}>
                    <Avatar
                      src={employee.profileImage ?? undefined}
                      sx={{ width: 40, height: 40, bgcolor: "var(--brand-soft)" }}
                    >
                      {employee.profileImage ? null : (
                        <PersonOutlinedIcon sx={{ color: "var(--brand)", fontSize: 22 }} />
                      )}
                    </Avatar>
                  </TableCell>
                  <TableCell sx={tableBodyCellSx}>{employee.employeeId}</TableCell>
                  <TableCell sx={tableBodyCellSx}>
                    <Typography
                      component="span"
                      sx={nameLinkSx}
                      onClick={() => onNameClick(employee)}
                    >
                      {employee.name}
                    </Typography>
                  </TableCell>
                  <TableCell sx={tableBodyCellSx}>{employee.department}</TableCell>
                  <TableCell sx={tableBodyCellSx}>{employee.position}</TableCell>
                  <TableCell sx={tableBodyCellSx}>{employee.phoneNumber}</TableCell>
                  <TableCell sx={tableBodyCellSx}>
                    <Typography component="span" sx={statusBadgeSx(employee.status)}>
                      {TABLE_STATUS_LABEL[employee.status]}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {totalPages > 1 ? (
        <div className={styles.paginationWrap}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => onPageChange(value)}
            color="primary"
            shape="rounded"
          />
        </div>
      ) : null}
    </div>
  );
};

export default EmployeeListTable;
