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
      if (window.daum?.Postcode) {
        resolve();
        return;
      }
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error("우편번호 스크립트 로드 실패")),
        { once: true },
      );
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

type EmbedDaumPostcodeOptions = {
  onResize?: (height: number) => void;
};

function syncEmbedHeight(container: HTMLElement, height: number) {
  const nextHeight = `${height}px`;
  container.style.height = nextHeight;

  const iframe = container.querySelector("iframe");
  if (iframe instanceof HTMLIFrameElement) {
    iframe.style.width = "100%";
    iframe.style.height = nextHeight;
    iframe.style.border = "0";
  }
}

/** 검색 UI를 컨테이너에 임베드 — 높이는 onresize로만 조절 (Daum 가이드 권장) */
export function embedDaumPostcode(
  container: HTMLElement,
  onComplete: (data: DaumPostcodeData) => void,
  options?: EmbedDaumPostcodeOptions,
): void {
  if (!window.daum?.Postcode) {
    throw new Error("Daum Postcode가 로드되지 않았습니다.");
  }

  container.replaceChildren();
  container.style.width = "100%";
  container.style.height = "0";

  new window.daum.Postcode({
    oncomplete: onComplete,
    onresize: (size) => {
      syncEmbedHeight(container, size.height);
      options?.onResize?.(size.height);
    },
    hideMapBtn: true,
    width: "100%",
    height: "100%",
  }).embed(container);
}
