import { ActivityStatus } from './ActivityStatus';

describe('ActivityStatus', () => {
  it('將 camelCase 活動狀態轉成中文', () => {
    expect(ActivityStatus.fromApiStatus('pendingReview')).toBe(ActivityStatus.pendingReview);
  });

  it('將後端大寫 snake_case 活動狀態轉成中文', () => {
    expect(ActivityStatus.fromApiStatus('PENDING_REVIEW')).toBe(ActivityStatus.pendingReview);
    expect(ActivityStatus.fromApiStatus('READY_TO_PUBLISH')).toBe(ActivityStatus.readyToPublish);
    expect(ActivityStatus.fromApiStatus('REGISTRATION_OPEN')).toBe(ActivityStatus.registrationOpen);
  });

  it('將大寫 WorkflowStatus 轉成中文', () => {
    expect(ActivityStatus.fromWorkflowApiStatus('FINAL_REVIEW')).toBe(
      ActivityStatus.workflowFinalReview,
    );
  });

  it('保留已經是中文或未知的狀態', () => {
    expect(ActivityStatus.fromApiStatus('已發布')).toBe('已發布');
    expect(ActivityStatus.fromApiStatus('UNKNOWN_STATUS')).toBe('UNKNOWN_STATUS');
  });
});
