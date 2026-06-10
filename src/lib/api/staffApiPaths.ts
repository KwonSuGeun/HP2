/** Next 프록시(/api/staff) vs 백엔드 직접 호출(/admin/staff) 경로 분기 */
export function getStaffApiBase(): string {
  const apiBase = process.env.NEXT_PUBLIC_API_URL?.trim();
  return apiBase ? "/admin/staff" : "/api/staff";
}
