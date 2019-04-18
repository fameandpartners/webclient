import React from 'react';
import classnames from 'classnames';
import { Component } from 'typings';
import { FormattedMessage } from 'react-intl';

interface ExpressMakingProps {
    makingOption: Component;
    isAvailable: boolean;
    changeColor?: () => void;
}

const ExpressMaking: React.SFC<ExpressMakingProps> = ({ makingOption, isAvailable, changeColor }) => {
    const classNames = classnames('making-container');
    return (
        <div className={classNames}>
            <style jsx>{`
                @import 'vars';
                .making-container {
                    background: $color-grey96;
                    padding: 2 * $space-base;
                }

                .title {
                    display: block;
                    margin-bottom: $space-base;
                }

                .subtitle {
                    margin: 0;
                    @include text-style-form-option;
                }
            `}</style>

            <p className="title">
                {isAvailable ? (
                    <FormattedMessage id="Making.FastMakingAvailable.Title" defaultMessage="Want your dress sooner?" />
                ) : (
                    <FormattedMessage
                        id="Making.FastMakingUnavailable.Title"
                        defaultMessage="We need a bit longer to get this dress to you"
                    />
                )}
            </p>

            {isAvailable ? (
                <p className="subtitle">
                    <FormattedMessage
                        id="Making.FastMakingAvailable.Text"
                        defaultMessage="Select express delivery in the cart to have it delivered to your door within {deliveryTimeRange}."
                        values={{ deliveryTimeRange: makingOption.meta.deliveryTimeRange }}
                    />{' '}
                    <a target="_blank" href="/faqs#collapse-what-express-making">
                        <FormattedMessage id="Making.FastMakingAvailable.Link" defaultMessage="Learn more" />
                    </a>
                </p>
            ) : (
                <p className="subtitle">
                    <FormattedMessage
                        id="Making.FastMakingUnvailable.Text"
                        defaultMessage="You have selected a color that takes a bit longer to deliver, if you do want it sooner select a"
                    />{' '}
                    <a onClick={changeColor}>
                        <FormattedMessage id="Making.FastMakingUnavailable.Link" defaultMessage="Recommended color" />
                    </a>
                </p>
            )}
        </div>
    );
};

export default ExpressMaking;
