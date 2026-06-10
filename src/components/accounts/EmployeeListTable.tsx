"use client"

import type { Employee } from "@/features/accounts/AccountTypes";
import { getStatusBadgeClass } from "./accountUiUtils";
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
      <div className={styles.tableWrap}>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th className={`${styles.tableHeadCell} ${styles.tableHeadCellPhoto}`}>사진</th>
              <th className={styles.tableHeadCell}>사번</th>
              <th className={styles.tableHeadCell}>이름</th>
              <th className={styles.tableHeadCell}>부서</th>
              <th className={styles.tableHeadCell}>직급</th>
              <th className={styles.tableHeadCell}>연락처</th>
              <th className={`${styles.tableHeadCell} ${styles.tableHeadCellStatus}`}>상태</th>
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 ? (
              <tr>
                <td className={styles.tableEmptyCell} colSpan={7}>
                  검색 결과가 없습니다.
                </td>
              </tr>
            ) : (
              employees.map((employee, index) => (
                <tr key={employee.id} className={index % 2 === 1 ? styles.tableRowEven : undefined}>
                  <td className={styles.tableBodyCell}>
                    <div className={styles.tableAvatar}>
                      {employee.profileImage ? (
                        <img src={employee.profileImage} alt={`${employee.name} 프로필`} />
                      ) : (
                        <span className={styles.userIcon} aria-hidden="true">
                          👤
                        </span>
                      )}
                    </div>
                  </td>
                  <td className={styles.tableBodyCell}>{employee.employeeId}</td>
                  <td className={styles.tableBodyCell}>
                    <button type="button" className={styles.nameLink} onClick={() => onNameClick(employee)}>
                      {employee.name}
                    </button>
                  </td>
                  <td className={styles.tableBodyCell}>{employee.department}</td>
                  <td className={styles.tableBodyCell}>{employee.position}</td>
                  <td className={styles.tableBodyCell}>{employee.phoneNumber}</td>
                  <td className={styles.tableBodyCell}>
                    <span className={getStatusBadgeClass(employee.status)}>
                      {TABLE_STATUS_LABEL[employee.status]}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 ? (
        <div className={styles.paginationWrap}>
          <button
            type="button"
            className={styles.paginationBtn}
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            aria-label="이전 페이지"
          >
            {"<"}
          </button>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
            <button
              key={pageNumber}
              type="button"
              className={`${styles.paginationBtn} ${pageNumber === page ? styles.paginationBtnActive : ""}`}
              onClick={() => onPageChange(pageNumber)}
            >
              {pageNumber}
            </button>
          ))}
          <button
            type="button"
            className={styles.paginationBtn}
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            aria-label="다음 페이지"
          >
            {">"}
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default EmployeeListTable;
