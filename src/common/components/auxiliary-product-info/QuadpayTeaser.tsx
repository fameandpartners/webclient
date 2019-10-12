import React from 'react';
import CurrencyAmount from '@components/base/CurrencyAmount/CurrencyAmount';
const QuadPayIcon = require('@svg/i-quadpay.svg').default;

interface QuadpayTeasterProps {
  total: number;
}

const NUMBER_OF_INSTALMENTS = 4;
const QuadpayTeaser: React.SFC<QuadpayTeasterProps> = ({ total }) => {
  const instalment = total / NUMBER_OF_INSTALMENTS;

  return <span>
        {NUMBER_OF_INSTALMENTS} easy payments of <CurrencyAmount value={instalment} hideSign /> with
        {' '}
        <QuadPayIcon alt="quadpay" style={{ marginBottom: 2, verticalAlign: 'bottom', display: 'inline', width: 77, height: 16 }} />
        {' '}
        <a href="/faqs#collapse-afterpay" target="_blank">Learn more</a>
  </span>;
};

export default QuadpayTeaser;
