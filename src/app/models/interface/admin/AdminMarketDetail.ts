/**管理員-活動詳細的歷史紀錄 */
export interface StatusLog {
  dateTime: string;
  status: string;
  description: string;
  operator: {
    role: string;
    operatorName: string;
  };
}

/**管理員-活動詳細資料傳入 */
export interface AdminMarketDetail {
  activityId: number;
  activityStatus: string;
  activityInfo: {
    name: string;
    type: string;
    time: string;
    locationName: string;
    location: string;
    description: string;
  };
  timeline: {
    registrationStartTime: string;
    registrationEndTime: string;
    finalListConfirmation: string;
    activityTime: string;
  };
  organizerInfo: {
    organizerName: string;
    contactPerson: string;
    contactPhone: string;
    email: string;
    address: string;
    taxId: string;
    serviceHours: string;
  };
  transportation: {
    mrt: string;
    bus: string;
    drivingDirections: string;
  };
  boothInfo: {
    boothSpec: string;
    boothCount: number;
    boothPrice: number;
    boothZones: string[];
  };
  boothLayoutImage: string;
  statusLogs: StatusLog[];
}
