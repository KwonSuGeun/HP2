"use client"

import { KeyboardEvent } from "react";
import {
  Button,
  Collapse,
  FormControl,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import type { EmployeeSearchCriteria } from "@/features/accounts/AccountTypes";
import {
  DEPARTMENT_OPTIONS,
  SEARCH_CRITERIA_OPTIONS,
  STAFF_TYPE_OPTIONS,
} from "@/features/accounts/formConstants";
import {
  detailFilterToggleSx,
  resetLinkSx,
  searchButtonSx,
} from "./AccountPageStyles";
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
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter") onSearch();
  };

  return (
    <div className={styles.searchCard}>
      <div className={styles.searchRow}>
        <FormControl size="small" sx={{ minWidth: 100 }}>
          <Select
            value={criteria}
            onChange={(event) =>
              onCriteriaChange(event.target.value as EmployeeSearchCriteria)
            }
          >
            {SEARCH_CRITERIA_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          size="small"
          placeholder="검색어를 입력하세요"
          value={keyword}
          onChange={(event) => onKeywordChange(event.target.value)}
          onKeyDown={handleKeyDown}
          sx={{ flex: 1, minWidth: 180 }}
        />

        <Button variant="contained" sx={searchButtonSx} onClick={onSearch}>
          검색
        </Button>

        <Typography sx={resetLinkSx} onClick={onReset}>
          초기화
        </Typography>

        <Typography
          sx={detailFilterToggleSx}
          onClick={() => onShowDetailFilterChange(!showDetailFilter)}
        >
          {showDetailFilter ? "상세검색 닫기" : "상세검색 필터"}
        </Typography>
      </div>

      <Collapse in={showDetailFilter}>
        <div className={styles.detailFilterArea}>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <Typography sx={{ fontSize: 12, fontWeight: 600, mb: 0.5, color: "var(--muted)" }}>
              직무
            </Typography>
            <Select
              value={jobRole}
              displayEmpty
              onChange={(event) => onJobRoleChange(event.target.value)}
            >
              <MenuItem value="">전체</MenuItem>
              {STAFF_TYPE_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 160 }}>
            <Typography sx={{ fontSize: 12, fontWeight: 600, mb: 0.5, color: "var(--muted)" }}>
              부서
            </Typography>
            <Select
              value={department}
              displayEmpty
              onChange={(event) => onDepartmentChange(event.target.value)}
            >
              <MenuItem value="">전체</MenuItem>
              {DEPARTMENT_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </Collapse>
    </div>
  );
};

export default EmployeeSearchFilter;
