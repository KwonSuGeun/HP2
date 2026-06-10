import { redirect } from "next/navigation";

/** 구 경로 호환 — `/admin/account-management`로 리다이렉트 */
export default function AccountsRedirectPage() {
  redirect("/admin/account-management");
}
