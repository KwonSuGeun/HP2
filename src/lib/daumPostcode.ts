import type { DaumPostcodeData } from "@/types/daumPostcode";

const DAUM_POSTCODE_SCRIPT =
  "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";

let scriptLoading: Promise<void> | null = null;

/** Daum 우편번호 검색 스크립트 로드 */
export function loadDaumPostcodeScript(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("브라우저 환경에서만 사용할 수 있습니다."));
  }
  if (window.daum?.Postcode) return Promise.resolve();
  if (scriptLoading) return scriptLoading;

  scriptLoading = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${DAUM_POSTCODE_SCRIPT}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("우편번호 스크립트 로드 실패")));
      return;
    }

    const script = document.createElement("script");
    script.src = DAUM_POSTCODE_SCRIPT;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("우편번호 스크립트 로드 실패"));
    document.head.appendChild(script);
  });

  return scriptLoading;
}

/** 선택된 주소 → 기본주소 문자열 */
export function formatDaumBaseAddress(data: DaumPostcodeData): string {
  let address = data.userSelectedType === "R" ? data.roadAddress : data.jibunAddress;

  if (data.userSelectedType === "R") {
    let extra = "";
    if (data.bname && /[동|로|가]$/g.test(data.bname)) {
      extra += data.bname;
    }
    if (data.buildingName && data.apartment === "Y") {
      extra += extra ? `, ${data.buildingName}` : data.buildingName;
    }
    if (extra) address += ` (${extra})`;
  }

  return address;
}

/** 검색 UI를 컨테이너에 임베드 */
export function embedDaumPostcode(
  container: HTMLElement,
  onComplete: (data: DaumPostcodeData) => void,
): void {
  if (!window.daum?.Postcode) {
    throw new Error("Daum Postcode가 로드되지 않았습니다.");
  }

  container.replaceChildren();

  new window.daum.Postcode({
    oncomplete: onComplete,
    width: "100%",
    height: "100%",
  }).embed(container);
}
