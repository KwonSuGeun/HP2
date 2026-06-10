/** public/images/staff — 프론트 전용 직원 프로필 이미지 (백엔드 미사용) */
const STAFF_PROFILE_IMAGES: Record<string, string> = {
  최인경: "/images/staff/choi-inkyoung.png",
  서호령: "/images/staff/seo-horyeong.png",
  권수근: "/images/staff/kwon-sugeun.png",
  박상민: "/images/staff/park-sangmin.png",
  이우성: "/images/staff/lee-woosung.png",
};

export function resolveStaffProfileImage(staffName: string): string | null {
  const trimmed = staffName.trim();
  if (!trimmed) return null;
  return STAFF_PROFILE_IMAGES[trimmed] ?? null;
}
