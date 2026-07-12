/** 主辦方後台活動管理列表資料。 */
export interface OrganizerEventRow {
  /** 活動流水號。 */
  id: number;
  /** 活動名稱。 */
  name: string;
  /** 活動縮圖。 */
  nameImage: string;
  /** 活動日期區間。 */
  date: string;
  /** 活動地點。 */
  location: string;
  /** 活動流程狀態。 */
  status: string;
  /** 報名人數 / 攤位上限。 */
  signupProgress: string;
  /** 已付款攤主數。 */
  paidCount: string;
  /** 草稿資料是否已完整，可送出審核。 */
  canSubmitReview?: boolean;
  /** 主辦方提出下架申請時填寫的原因。 */
  unpublishReason?: string;
  /** 主要操作按鈕文字。 */
  actionLabel: string;
  actions?: {
    key: string;
    label: string;
    variant?: 'primary' | 'outline' | 'danger' | 'success' | 'muted';
    disabled?: boolean;
    hint?: string;
  }[];
}
