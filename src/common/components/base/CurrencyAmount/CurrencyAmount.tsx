import React from 'react';
import classnames from 'classnames';

interface CurrencyAmountProps {
    value: number;
    hideDecimalIfDollarAmount?: boolean;
    hideSign?: boolean;

    strikeThroughValue?: number;
}

const CurrencyAmount: React.SFC<CurrencyAmountProps> = ({ value, hideDecimalIfDollarAmount, hideSign, strikeThroughValue }) => {
    const preDisplayValue = value / 100;
    const hasDecimal = preDisplayValue % 1 !== 0;

    const output = hideDecimalIfDollarAmount || !hasDecimal ? preDisplayValue.toFixed(0) : preDisplayValue.toFixed(2);

    let outputStrikeValue = null;

    if (strikeThroughValue) {
        const preDisplaystrikeThroughValue = strikeThroughValue / 100;
        const hasDecimalstrikeThroughValue = preDisplaystrikeThroughValue % 1 !== 0;

        outputStrikeValue = hideDecimalIfDollarAmount || !hasDecimalstrikeThroughValue ? preDisplaystrikeThroughValue.toFixed(0) : preDisplaystrikeThroughValue.toFixed(2);
    }

    return (
        <span className={classnames('CurrencyAmount', { 'CurrencyAmount--StrikeThrough': strikeThroughValue })}>
            <style jsx>{`
                @import 'vars';

                .CurrencyAmount {
                    &--StrikeThrough {
                        .CurrencyAmount--StrikeThroughPrice {
                            position: relative;
                            opacity: 0.7;
                            margin-right: space(1.5);

                            @include strikethrough;
                        }
                    }
                }
            `}</style>

            {outputStrikeValue && <span className={'CurrencyAmount--StrikeThroughPrice'}>${outputStrikeValue}</span>}
            <span className={'CurrencyAmount--TotalPrice'}>{hideSign ? '' : '+'}${output}</span>

        </span>
    );
};

export default CurrencyAmount;
