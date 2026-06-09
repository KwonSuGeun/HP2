"use client"

import { useEffect, useRef, useState } from "react";
import {
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import type { DaumPostcodeData } from "@/types/daumPostcode";
import { embedDaumPostcode, loadDaumPostcodeScript } from "@/lib/daumPostcode";
import { modalTitleSx } from "./AccountPageStyles";
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

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: 3 } } }}
    >
      <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pb: 1 }}>
        <Typography sx={modalTitleSx}>주소 검색</Typography>
        <IconButton size="small" onClick={onClose} aria-label="닫기">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 0, height: 480, position: "relative" }}>
        {loading ? (
          <div className={styles.addressLoadingOverlay}>
            <CircularProgress size={28} />
          </div>
        ) : null}

        {error ? (
          <div className={styles.addressError}>{error}</div>
        ) : (
          <div ref={containerRef} className={styles.addressEmbedContainer} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddressSearchDialog;
