"use client"

import { useCallback, useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import StaffSearchFilter from "@/components/staff/StaffSearchFilter";
import StaffListTable from "@/components/staff/StaffListTable";
import StaffRegisterModal from "@/components/staff/StaffRegisterModal";
import StaffDetailModal from "@/components/staff/StaffDetailModal";
import type { Staff, StaffRegisterForm, StaffSearchCriteria } from "@/features/staff/StaffTypes";
import {
  clearSelectedStaff,
  deleteStaffRequest,
  fetchStaffDetailRequest,
  fetchStaffListRequest,
  registerStaffRequest,
  resetStatus,
} from "@/features/staff/StaffSlice";
import type { StaffSearchParams } from "@/features/staff/staffSearchUtils";
import type { AppDispatch, RootState } from "@/store/Store";
import styles from "@/components/staff/StaffPageStyles.module.css";

const PAGE_SIZE = 10;

const defaultSearchParams: StaffSearchParams = {
  criteria: "name",
  keyword: "",
  jobRole: "",
  department: "",
};

const StaffManagementPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { staffList, selectedStaff, listStatus, detailStatus, createStatus, deleteStatus } = useSelector(
    (state: RootState) => ({
      staffList: state.staff.staffList,
      selectedStaff: state.staff.selectedStaff,
      listStatus: state.staff.listStatus,
      detailStatus: state.staff.detailStatus,
      createStatus: state.staff.createStatus,
      deleteStatus: state.staff.deleteStatus,
    }),
    shallowEqual,
  );

  const [page, setPage] = useState(1);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [criteria, setCriteria] = useState<StaffSearchCriteria>("name");
  const [keyword, setKeyword] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [department, setDepartment] = useState("");
  const [showDetailFilter, setShowDetailFilter] = useState(false);

  const error = listStatus.error || detailStatus.error || createStatus.error || deleteStatus.error;

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
      dispatch(resetStatus("createStatus"));
    }
  }, [createStatus.success, dispatch]);

  useEffect(() => {
    if (deleteStatus.success) {
      dispatch(resetStatus("deleteStatus"));
    }
  }, [deleteStatus.success, dispatch]);

  const totalPages = Math.max(1, Math.ceil(staffList.length / PAGE_SIZE));
  if (page > totalPages) {
    setPage(totalPages);
  }
  if (createStatus.success && registerModalOpen) {
    setRegisterModalOpen(false);
  }
  if (deleteStatus.success && detailOpen) {
    setDetailOpen(false);
  }

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

  const handleRegister = (form: StaffRegisterForm) => {
    dispatch(registerStaffRequest({ form, searchParams: buildSearchParams() }));
  };

  const handleNameClick = (staff: Staff) => {
    setDetailOpen(true);
    dispatch(fetchStaffDetailRequest(staff.staffId));
  };

  const handleDetailClose = () => {
    setDetailOpen(false);
    dispatch(clearSelectedStaff());
  };

  const handleDeleteStaff = (staff: Staff) => {
    dispatch(deleteStaffRequest({ staffId: staff.staffId, searchParams: buildSearchParams() }));
  };

  const handleClearError = () => {
    dispatch(resetStatus("listStatus"));
    dispatch(resetStatus("detailStatus"));
    dispatch(resetStatus("createStatus"));
    dispatch(resetStatus("deleteStatus"));
  };

  const currentPage = Math.min(page, totalPages);
  const pagedStaffList = staffList.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>계정관리</h1>
        <button type="button" className={styles.registerButton} onClick={() => setRegisterModalOpen(true)}>
          <span aria-hidden="true">+</span>
          직원 등록
        </button>
      </div>

      {error ? (
        <div className={styles.errorAlert} role="alert">
          <span>{error}</span>
          <button type="button" className={styles.errorAlertClose} onClick={handleClearError} aria-label="닫기">
            ×
          </button>
        </div>
      ) : null}

      <StaffSearchFilter
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
          <div className={`${styles.spinner} ${styles.spinnerLg}`} aria-label="로딩 중" />
        </div>
      ) : (
        <StaffListTable
          staffList={pagedStaffList}
          page={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
          onNameClick={handleNameClick}
        />
      )}

      <StaffRegisterModal
        open={registerModalOpen}
        loading={createStatus.loading}
        onClose={() => setRegisterModalOpen(false)}
        onSubmit={handleRegister}
      />

      <StaffDetailModal
        open={detailOpen}
        staff={selectedStaff}
        loading={detailStatus.loading}
        deleting={deleteStatus.loading}
        onClose={handleDetailClose}
        onDelete={handleDeleteStaff}
      />
    </div>
  );
};

export default StaffManagementPage;
