export interface StatusLog {
  dateTime: string;
  status: string;
  description: string;
  operator: {
    role: string;
    operatorName: string;
  };
}

export interface AdminMarketDetail {
  activityId: number;
  activityStatus: string;
  activityInfo: {
    name: string;
    type: string;
    time: string;
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
