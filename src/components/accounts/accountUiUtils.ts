import type { Employee } from "@/features/accounts/AccountTypes";
import styles from "./AccountPageStyles.module.css";

export const getStatusBadgeClass = (status: Employee["status"]) => {
  if (status === "ACTIVE") return `${styles.statusBadge} ${styles.statusActive}`;
  if (status === "LEAVE") return `${styles.statusBadge} ${styles.statusLeave}`;
  return `${styles.statusBadge} ${styles.statusRetired}`;
};
