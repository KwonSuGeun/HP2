/** Daum(카카오) 우편번호 서비스 타입 */
export type DaumPostcodeData = {
  zonecode: string;
  roadAddress: string;
  jibunAddress: string;
  buildingName: string;
  bname: string;
  apartment: string;
  userSelectedType: "R" | "J";
};

declare global {
  interface Window {
    daum?: {
      Postcode: new (options: {
        oncomplete: (data: DaumPostcodeData) => void;
        onresize?: (size: { width: number; height: number }) => void;
        width?: string | number;
        height?: string | number;
      }) => {
        embed: (element: HTMLElement) => void;
        open: () => void;
      };
    };
  }
}

export {};
