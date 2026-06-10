"use client"

import { useCallback, useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Alert, Button, CircularProgress, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EmployeeSearchFilter from "@/components/accounts/EmployeeSearchFilter";
import EmployeeListTable from "@/components/accounts/EmployeeListTable";
import EmployeeRegisterModal from "@/components/accounts/EmployeeRegisterModal";
import EmployeeDetailModal from "@/components/accounts/EmployeeDetailModal";
import type { Employee, EmployeeRegisterForm, EmployeeSearchCriteria } from "@/features/accounts/AccountTypes";
import {
  clearSelectedEmployee,
  fetchStaffDetailRequest,
  fetchStaffListRequest,
  registerStaffRequest,
  resetStatus,
} from "@/features/accounts/AccountSlice";
import type { StaffSearchParams } from "@/features/accounts/staffSearchUtils";
import type { AppDispatch, RootState } from "@/store/Store";
import { pageTitleSx, registerButtonSx } from "@/components/accounts/AccountPageStyles";
import styles from "@/components/accounts/AccountPageStyles.module.css";

const PAGE_SIZE = 10;

const defaultSearchParams: StaffSearchParams = {
  criteria: "name",
  keyword: "",
  jobRole: "",
  department: "",
};

const AccountManagementPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { employees, selectedEmployee, listStatus, detailStatus, createStatus } = useSelector(
    (state: RootState) => ({
      employees: state.account.employees,
      selectedEmployee: state.account.selectedEmployee,
      listStatus: state.account.listStatus,
      detailStatus: state.account.detailStatus,
      createStatus: state.account.createStatus,
    }),
    shallowEqual,
  );

  const [page, setPage] = useState(1);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [criteria, setCriteria] = useState<EmployeeSearchCriteria>("name");
  const [keyword, setKeyword] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [department, setDepartment] = useState("");
  const [showDetailFilter, setShowDetailFilter] = useState(false);

  const error = listStatus.error || detailStatus.error || createStatus.error;

  const buildSearchParams = useCallback(
    (): StaffSearchParams => ({
      criteria,
      keyword,
      jobRole,
      department,
    }),
    [criteria, keyword, jobRole, department],
  );

  useEffect(() => {
    dispatch(fetchStaffListRequest(defaultSearchParams));
  }, [dispatch]);

  useEffect(() => {
    if (createStatus.success) {
      setRegisterModalOpen(false);
      dispatch(resetStatus("createStatus"));
    }
  }, [createStatus.success, dispatch]);

  const handleSearch = () => {
    setPage(1);
    dispatch(fetchStaffListRequest(buildSearchParams()));
  };

  const handleReset = () => {
    setCriteria("name");
    setKeyword("");
    setJobRole("");
    setDepartment("");
    setShowDetailFilter(false);
    setPage(1);
    dispatch(fetchStaffListRequest(defaultSearchParams));
  };

  const handleRegister = (form: EmployeeRegisterForm) => {
    dispatch(registerStaffRequest({ form, searchParams: buildSearchParams() }));
  };

  const handleNameClick = (employee: Employee) => {
    setDetailOpen(true);
    dispatch(fetchStaffDetailRequest(employee.employeeId));
  };

  const handleDetailClose = () => {
    setDetailOpen(false);
    dispatch(clearSelectedEmployee());
  };

  const handleClearError = () => {
    dispatch(resetStatus("listStatus"));
    dispatch(resetStatus("detailStatus"));
    dispatch(resetStatus("createStatus"));
  };

  const totalPages = Math.max(1, Math.ceil(employees.length / PAGE_SIZE));
  const pagedEmployees = employees.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <Typography sx={pageTitleSx}>계정관리</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={registerButtonSx}
          onClick={() => setRegisterModalOpen(true)}
        >
          직원 등록
        </Button>
      </div>

      {error ? (
        <Alert severity="error" sx={{ mb: 2 }} onClose={handleClearError}>
          {error}
        </Alert>
      ) : null}

      <EmployeeSearchFilter
        criteria={criteria}
        keyword={keyword}
        jobRole={jobRole}
        department={department}
        showDetailFilter={showDetailFilter}
        onCriteriaChange={setCriteria}
        onKeywordChange={setKeyword}
        onJobRoleChange={setJobRole}
        onDepartmentChange={setDepartment}
        onShowDetailFilterChange={setShowDetailFilter}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      {listStatus.loading ? (
        <div className={styles.loadingCenter}>
          <CircularProgress />
        </div>
      ) : (
        <EmployeeListTable
          employees={pagedEmployees}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          onNameClick={handleNameClick}
        />
      )}

      <EmployeeRegisterModal
        open={registerModalOpen}
        loading={createStatus.loading}
        onClose={() => setRegisterModalOpen(false)}
        onSubmit={handleRegister}
      />

      <EmployeeDetailModal
        open={detailOpen}
        employee={selectedEmployee}
        loading={detailStatus.loading}
        onClose={handleDetailClose}
      />
    </div>
  );
};

export default AccountManagementPage;
