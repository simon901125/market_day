import { paymentMethodLabel } from './payment-method.util';

describe('paymentMethodLabel', () => {
  it('將藍新及信用卡代碼轉成中文名稱', () => {
    expect(paymentMethodLabel('NEWEBPAY')).toBe('藍新金流');
    expect(paymentMethodLabel('CREDIT')).toBe('信用卡');
  });

  it('空值使用指定的替代文字', () => {
    expect(paymentMethodLabel(null)).toBe('-');
    expect(paymentMethodLabel('', '原付款方式退回')).toBe('原付款方式退回');
  });
});
