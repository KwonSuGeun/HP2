"use client";

import ModulePlaceholderPage from "@/components/modules/ModulePlaceholderPage";

export default function ClinicalListPage() {
  return (
    <ModulePlaceholderPage
      moduleCode="CLINICAL_LIST"
      titleKo="진료 목록"
      titleEn="Clinical Worklist"
      descriptionKo="접수 완료 환자의 진료 대기·진행 목록을 조회합니다."
      descriptionEn="Worklist for outpatient visits ready for clinical care."
    />
  );
}
