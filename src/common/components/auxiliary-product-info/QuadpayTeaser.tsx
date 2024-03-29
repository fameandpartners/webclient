import React from 'react';
import CurrencyAmount from '@components/base/CurrencyAmount/CurrencyAmount';
const QuadPayIcon = require('@svg/i-quadpay.svg').default;
const ExclamatoryMark = require('@svg/i-exclamatory-mark.svg').default;

interface QuadpayTeasterProps {
  total: number;
}

const NUMBER_OF_INSTALMENTS = 4;
const MIN_QUADPAY_PRICE = 3500;
const MAX_QUADPAY_PRICE = 150000;
const QuadpayTeaser: React.SFC<QuadpayTeasterProps> = ({ total }) => {
  const instalment = total / NUMBER_OF_INSTALMENTS;

  if (total < MIN_QUADPAY_PRICE) {
    return <span>
      or {NUMBER_OF_INSTALMENTS} interest-free payments on over <CurrencyAmount value={MIN_QUADPAY_PRICE} hideSign /> by
      {' '}
      <QuadPayIcon alt="quadpay" style={{ marginBottom: 2, verticalAlign: 'bottom', display: 'inline', width: 77, height: 14 }} />
      {' '}
      <a href="https://www.quadpay.com/how-it-works/" target="new"><ExclamatoryMark alt="quadpay" style={{ marginBottom: 2, verticalAlign: 'bottom', display: 'inline', width: 16, height: 16 }} /></a>
    </span>;
  }

  if (total > MAX_QUADPAY_PRICE) {
    return <span>
      or {NUMBER_OF_INSTALMENTS} interest-free payments on up to <CurrencyAmount value={MAX_QUADPAY_PRICE} hideSign /> by
      {' '}
      <QuadPayIcon alt="quadpay" style={{ marginBottom: 2, verticalAlign: 'bottom', display: 'inline', width: 77, height: 14 }} />
      {' '}
      <a href="https://www.quadpay.com/how-it-works/" target="new"><ExclamatoryMark alt="quadpay" style={{ marginBottom: 2, verticalAlign: 'bottom', display: 'inline', width: 16, height: 16 }} /></a>
    </span>;
  }

  return <span>
    or {NUMBER_OF_INSTALMENTS} interest-free payments of <CurrencyAmount value={instalment} hideSign /> by
    {' '}
    <QuadPayIcon alt="quadpay" style={{ marginBottom: 2, verticalAlign: 'bottom', display: 'inline', width: 77, height: 14 }} />
    {' '}
    <a href="https://www.quadpay.com/how-it-works/" target="new"><ExclamatoryMark alt="quadpay" style={{ marginBottom: 2, verticalAlign: 'bottom', display: 'inline', width: 16, height: 16 }} /></a>
  </span>;
};

export default QuadpayTeaser;
