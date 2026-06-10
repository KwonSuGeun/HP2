"use client"

import { useEffect, useRef, useState } from "react";
import type { DaumPostcodeData } from "@/types/daumPostcode";
import { embedDaumPostcode, loadDaumPostcodeScript } from "@/lib/daumPostcode";
import styles from "./AccountPageStyles.module.css";

type AddressSearchDialogProps = {
  open: boolean;
  onClose: () => void;
  onSelect: (data: DaumPostcodeData) => void;
};

/** Daum 우편번호 API — 사용자 직접 검색 */
const AddressSearchDialog = ({
  open,
  onClose,
  onSelect,
}: AddressSearchDialogProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const onSelectRef = useRef(onSelect);
  const onCloseRef = useRef(onClose);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    onSelectRef.current = onSelect;
    onCloseRef.current = onClose;
  }, [onSelect, onClose]);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    loadDaumPostcodeScript()
      .then(() => {
        if (cancelled || !containerRef.current) return;
        embedDaumPostcode(containerRef.current, (data) => {
          onSelectRef.current(data);
          onCloseRef.current();
        });
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) {
          setError("주소 검색 서비스를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.");
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className={styles.modalOverlay} role="presentation" onClick={onClose}>
      <div
        className={`${styles.modalPanel} ${styles.modalPanelSm}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="address-search-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <h2 id="address-search-title" className={styles.modalTitle}>
            주소 검색
          </h2>
          <button type="button" className={styles.modalCloseBtn} onClick={onClose} aria-label="닫기">
            ×
          </button>
        </div>

        <div className={`${styles.modalBody} ${styles.modalBodyAddress}`}>
          {loading ? (
            <div className={styles.addressLoadingOverlay}>
              <div className={styles.spinner} aria-label="로딩 중" />
            </div>
          ) : null}

          {error ? (
            <div className={styles.addressError}>{error}</div>
          ) : (
            <div ref={containerRef} className={styles.addressEmbedContainer} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AddressSearchDialog;
