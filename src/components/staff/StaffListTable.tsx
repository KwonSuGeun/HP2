"use client"

import type { Staff } from "@/features/staff/StaffTypes";
import { getStatusBadgeClass } from "./staffUiUtils";
import styles from "./StaffPageStyles.module.css";

const TABLE_STATUS_LABEL: Record<Staff["status"], string> = {
  ACTIVE: "재직 중",
  LEAVE: "휴직",
  RETIRED: "퇴직",
};

type StaffListTableProps = {
  staffList: Staff[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onNameClick: (staff: Staff) => void;
};

const StaffListTable = ({
  staffList,
  page,
  totalPages,
  onPageChange,
  onNameClick,
}: StaffListTableProps) => {
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
              <th className={styles.tableHeadCell}>내선번호</th>
              <th className={`${styles.tableHeadCell} ${styles.tableHeadCellStatus}`}>상태</th>
            </tr>
          </thead>
          <tbody>
            {staffList.length === 0 ? (
              <tr>
                <td className={styles.tableEmptyCell} colSpan={8}>
                  검색 결과가 없습니다.
                </td>
              </tr>
            ) : (
              staffList.map((staff, index) => (
                <tr key={staff.id} className={index % 2 === 1 ? styles.tableRowEven : undefined}>
                  <td className={styles.tableBodyCell}>
                    <div className={styles.tableAvatar}>
                      {staff.profileImage ? (
                        <img src={staff.profileImage} alt={`${staff.name} 프로필`} />
                      ) : (
                        <span className={styles.userIcon} aria-hidden="true">
                          👤
                        </span>
                      )}
                    </div>
                  </td>
                  <td className={styles.tableBodyCell}>{staff.staffId}</td>
                  <td className={styles.tableBodyCell}>
                    <button type="button" className={styles.nameLink} onClick={() => onNameClick(staff)}>
                      {staff.name}
                    </button>
                  </td>
                  <td className={styles.tableBodyCell}>{staff.department}</td>
                  <td className={styles.tableBodyCell}>{staff.position}</td>
                  <td className={styles.tableBodyCell}>{staff.phoneNumber}</td>
                  <td className={styles.tableBodyCell}>{staff.staffExtensionNo || "-"}</td>
                  <td className={styles.tableBodyCell}>
                    <span className={getStatusBadgeClass(staff.status)}>
                      {TABLE_STATUS_LABEL[staff.status]}
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

export default StaffListTable;
