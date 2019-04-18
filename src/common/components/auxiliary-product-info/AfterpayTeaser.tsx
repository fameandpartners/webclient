import React from 'react';
import CurrencyAmount from '@components/base/CurrencyAmount/CurrencyAmount';
const AfterPayIcon = require('@svg/i-afterpay.svg').default;

interface AfterpayTeasterProps {
    total: number;
}

const NUMBER_OF_INSTALMENTS = 4;
const AfterpayTeaser: React.SFC<AfterpayTeasterProps> = ({total}) => {
    const instalment = total / NUMBER_OF_INSTALMENTS;

    return <span>
        {NUMBER_OF_INSTALMENTS} easy payments of <CurrencyAmount value={instalment} hideSign /> with
        {' '}
        <AfterPayIcon alt="afterpay" style={{ marginBottom: 2, verticalAlign: 'bottom', display: 'inline', width: 77, height: 16 }}/>
        {' '}
        <a href="/faqs#collapse-afterpay" target="_blank">Learn more</a>
    </span>;
};

export default AfterpayTeaser;