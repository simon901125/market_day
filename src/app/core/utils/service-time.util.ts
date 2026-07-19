const WEEKDAYS = [
  { code: 'MON', label: '週一' },
  { code: 'TUE', label: '週二' },
  { code: 'WED', label: '週三' },
  { code: 'THU', label: '週四' },
  { code: 'FRI', label: '週五' },
  { code: 'SAT', label: '週六' },
  { code: 'SUN', label: '週日' },
] as const;

/** 將服務星期轉成中文，連續的星期會合併為範圍。 */
export function formatServiceDays(serviceDays: string | null | undefined): string {
  if (!serviceDays?.trim()) return '';

  const weekdayIndex = new Map<string, number>();
  WEEKDAYS.forEach((weekday, index) => {
    weekdayIndex.set(weekday.code, index);
    weekdayIndex.set(weekday.label, index);
  });

  const selectedIndexes = Array.from(
    new Set(
      serviceDays
        .split(',')
        .map((day) => {
          const value = day.trim();
          return weekdayIndex.get(value.toUpperCase()) ?? weekdayIndex.get(value);
        })
        .filter((index): index is number => index !== undefined),
    ),
  ).sort((left, right) => left - right);

  if (selectedIndexes.length === 0) return serviceDays.trim();

  const ranges: number[][] = [];
  for (const index of selectedIndexes) {
    const currentRange = ranges.at(-1);
    if (currentRange && index === currentRange.at(-1)! + 1) {
      currentRange.push(index);
    } else {
      ranges.push([index]);
    }
  }

  return ranges
    .map((range) => {
      const first = WEEKDAYS[range[0]].label;
      const last = WEEKDAYS[range.at(-1)!].label;
      return range.length === 1 ? first : `${first}～${last}`;
    })
    .join('、');
}

/** 組合星期與時間，並將 HH:mm:ss 簡化為 HH:mm。 */
export function formatServiceTime(
  serviceDays: string | null | undefined,
  startTime: string | null | undefined,
  endTime: string | null | undefined,
): string {
  const time = [startTime, endTime]
    .map((value) => value?.trim().slice(0, 5))
    .filter(Boolean)
    .join(' - ');

  return [formatServiceDays(serviceDays), time].filter(Boolean).join(' ') || '-';
}

/** 格式化後端已合併的服務時間，例如 MON,TUE 08:00-17:00。 */
export function formatCombinedServiceHours(serviceHours: string | null | undefined): string {
  if (!serviceHours?.trim()) return '-';

  const value = serviceHours.trim();
  const match = value.match(/^([A-Za-z,\s週一二三四五六日]+?)\s+(\d{2}:\d{2}(?::\d{2})?)\s*-\s*(\d{2}:\d{2}(?::\d{2})?)$/);
  if (!match) return value;

  return formatServiceTime(match[1], match[2], match[3]);
}
