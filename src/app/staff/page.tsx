import { redirect } from "next/navigation";

/** 구 MUI 직원 페이지 경로 — `/admin/staff`로 리다이렉트 */
export default function StaffLegacyRedirectPage() {
  redirect("/admin/staff");
}
