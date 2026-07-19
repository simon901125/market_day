export interface EventStatusChangeDto {
  eventName: string;
  newEventStatus: string;
}

export interface EventRevisionRequest {
  /** true 時 id 為下架申請單 id（退回下架申請、要求補件），false/null 時 id 為活動 id（一般要求補件） */
  isUnpublish?: boolean | null;
  note: string;
}
