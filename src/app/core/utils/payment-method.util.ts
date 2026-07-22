const PAYMENT_METHOD_LABELS: Readonly<Record<string, string>> = {
  NEWEBPAY: '藍新金流',
  NEWEBPAY_CREDIT: '藍新金流／信用卡',
  CREDIT: '信用卡',
  CREDIT_CARD: '信用卡',
  WEBATM: 'WebATM',
  VACC: 'ATM 轉帳',
  CVS: '超商代碼繳費',
  BARCODE: '超商條碼繳費',
  APPLEPAY: 'Apple Pay',
  GOOGLEPAY: 'Google Pay',
};

/** 將後端金流代碼轉成適合顯示給使用者的付款方式名稱。 */
export function paymentMethodLabel(
  value: string | null | undefined,
  fallback = '-',
): string {
  const normalized = value?.trim();
  if (!normalized) return fallback;
  return PAYMENT_METHOD_LABELS[normalized.toUpperCase()] ?? normalized;
}
