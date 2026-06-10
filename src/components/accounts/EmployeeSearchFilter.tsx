"use client"

import { KeyboardEvent } from "react";
import type { EmployeeSearchCriteria } from "@/features/accounts/AccountTypes";
import {
  DEPARTMENT_OPTIONS,
  SEARCH_CRITERIA_OPTIONS,
  STAFF_TYPE_OPTIONS,
} from "@/features/accounts/formConstants";
import styles from "./AccountPageStyles.module.css";

type EmployeeSearchFilterProps = {
  criteria: EmployeeSearchCriteria;
  keyword: string;
  jobRole: string;
  department: string;
  showDetailFilter: boolean;
  onCriteriaChange: (value: EmployeeSearchCriteria) => void;
  onKeywordChange: (value: string) => void;
  onJobRoleChange: (value: string) => void;
  onDepartmentChange: (value: string) => void;
  onShowDetailFilterChange: (value: boolean) => void;
  onSearch: () => void;
  onReset: () => void;
};

/** HMS Workspace 스타일 검색/필터 영역 */
const EmployeeSearchFilter = ({
  criteria,
  keyword,
  jobRole,
  department,
  showDetailFilter,
  onCriteriaChange,
  onKeywordChange,
  onJobRoleChange,
  onDepartmentChange,
  onShowDetailFilterChange,
  onSearch,
  onReset,
}: EmployeeSearchFilterProps) => {
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") onSearch();
  };

  return (
    <div className={styles.searchCard}>
      <div className={styles.searchRow}>
        <select
          className={styles.criteriaSelect}
          value={criteria}
          onChange={(event) => onCriteriaChange(event.target.value as EmployeeSearchCriteria)}
        >
          {SEARCH_CRITERIA_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <input
          type="text"
          className={styles.searchInput}
          placeholder="검색어를 입력하세요"
          value={keyword}
          onChange={(event) => onKeywordChange(event.target.value)}
          onKeyDown={handleKeyDown}
        />

        <button type="button" className={styles.searchButton} onClick={onSearch}>
          검색
        </button>

        <button type="button" className={styles.resetLink} onClick={onReset}>
          초기화
        </button>

        <button
          type="button"
          className={styles.detailFilterToggle}
          onClick={() => onShowDetailFilterChange(!showDetailFilter)}
        >
          {showDetailFilter ? "상세검색 닫기" : "상세검색 필터"}
        </button>
      </div>

      {showDetailFilter ? (
        <div className={styles.detailFilterArea}>
          <div className={styles.filterSelectGroup}>
            <label className={styles.filterLabel} htmlFor="jobRoleFilter">
              직무
            </label>
            <select
              id="jobRoleFilter"
              className={styles.select}
              value={jobRole}
              onChange={(event) => onJobRoleChange(event.target.value)}
            >
              <option value="">전체</option>
              {STAFF_TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.filterSelectGroup}>
            <label className={styles.filterLabel} htmlFor="departmentFilter">
              부서
            </label>
            <select
              id="departmentFilter"
              className={styles.select}
              value={department}
              onChange={(event) => onDepartmentChange(event.target.value)}
            >
              <option value="">전체</option>
              {DEPARTMENT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default EmployeeSearchFilter;
