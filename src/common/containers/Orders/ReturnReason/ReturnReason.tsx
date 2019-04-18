import React from 'react';
import { RouteComponentProps } from 'react-router';
import { UserRootState } from '@common/rematch/models/user';
import { SiteVersion } from '@common/constants';
import OrdersLayout from '../OrdersLayout';
import LineItem from '@components/layout/Cart/LineItem';
import { RETURN_INSURANCE_SKUS } from '@common/utils/product';
import { FormattedMessage } from 'react-intl';
import Dropdown from '@components/base/Input/Dropdown';
import { Order, OrderCustomizedProduct } from 'typings/orders';
import Textarea from '@components/base/Input/Textarea';
import Button from '@components/base/Button/Button';
import { BASEURL_RETURNS } from '@common/utils/url-helper';

const BasketRemoveIcon = require('@svg/i-shopping-basket-remove.svg').default;
const BasketReloadIcon = require('@svg/i-basket-reload.svg').default;

interface Props extends RouteComponentProps<{ orderNumber: string, email: string }> {
    siteVersion: SiteVersion;
    orders: Order[] | null;
    orderReturn: number | null;
    user: UserRootState;

    submitReturnRequest: (payload: { orderNumber: string, lineItems: Array<{ id: number, category: string, reason: string }>, email: string, cookies?: string }) => void;
}

interface State {
    order?: Order;

    selectedReasons: { [key: string]: string };
    returnReasons: { [key: string]: string };

    submitting: boolean;
    error: boolean;
}

const RETURN_REASONS = [
    { name: 'Keep this item', value: 'KEEP_THIS_ITEM' },
    { name: 'Delivery issues', value: 'DELIVERY_ISSUES' },
    { name: 'Looks different to image on site', value: 'LOOKS_DIFFERENT' },
    { name: 'Ordered multiple styles or sizes', value: 'ORDERED_MULTIPLE' },
    { name: 'Poor quality or faulty', value: 'POOR_QUALITY' },
    { name: 'Size and fit', value: 'SIZE_AND_FIT' },
];

class ReturnReason extends React.PureComponent<Props, State> {

    public state: State = {
        order: this.props.orders && this.props.orders.filter((o) => o.number === this.props.match.params.orderNumber).first() || undefined,
        selectedReasons: {},
        returnReasons: {},
        submitting: false,
        error: false,
    };

    public static getDerivedStateFromProps(nextProps: Props, prevState: State): Partial<State> {

        if (prevState.submitting && nextProps.orderReturn) {
            nextProps.history.push(`${BASEURL_RETURNS}/${prevState.order!.number}/${nextProps.orderReturn}`);
        }

        return {};
    }

    private submit() {
        if (!this.state.order) {
            return;
        }

        const lineItems = this.state.order.items.filter((x) => !RETURN_INSURANCE_SKUS.includes(x.product.title)).map((ocp) => {
            if (!(ocp.lineItemId in this.state.selectedReasons)) {
                return null;
            }

            const category = this.state.selectedReasons[ocp.lineItemId];
            const reason = this.state.returnReasons[ocp.lineItemId];

            return {
                id: ocp.lineItemId,
                category,
                reason
            };

        }).notNullOrUndefined();

        if (lineItems.length > 0) {
            this.props.submitReturnRequest({
                orderNumber: this.state.order.number,
                lineItems,
                email: this.props.match.params.email ? this.props.match.params.email : this.props.user ? this.props.user.email : '',
                cookies: document.cookie,
            });

            this.setState({ submitting: true, error: false });
        } else {
            this.setState({ error: true });
        }
    }

    public renderOrder() {
        const { order } = this.state;

        if (!order) {
            return null;
        }

        return (
            <React.Fragment>
                {order.items.filter((x) => !RETURN_INSURANCE_SKUS.includes(x.product.title)).map((ocp) => (
                    <div className={'OrdersLayout--container'}>
                        <section className={'OrdersLayout--left'}>
                            <LineItem
                                id={ocp.lineItemId}
                                itemUrl={ocp.url}
                                image={ocp.image}
                                title={ocp.product.title}
                                price={ocp.price}
                                customizedProduct={ocp}
                            />
                        </section>
                        <section className={'OrdersLayout--right'}>
                            {this.renderReasons(ocp)}
                        </section>
                    </div>
                ))}
            </React.Fragment>
        );
    }

    public renderReasons(ocp: OrderCustomizedProduct) {

        const { selectedReasons, returnReasons, order } = this.state;

        if (ocp.product.title.toLocaleLowerCase().trim() === 'swatch') {
            // This is a swatch
            return (
                <React.Fragment>
                    <style jsx>{`
                        @import 'vars';

                        h4 {
                            display: flex;
                            align-items: center;
                            justify-content: flex-start;

                            :global(span) {
                                margin-left: space(2);
                            }

                            margin-top: space(4);
                            margin-bottom:space(1);
                        }
                    `}</style>
                    <h4 className={'neutral'}>
                        <BasketReloadIcon />
                        <FormattedMessage
                            id={'ReturnReason.Status.Swatch'}
                            defaultMessage={'Cannot return a swatch'}
                        />
                    </h4>
                </React.Fragment>
            );
        }

        if (ocp.return) {
            // This item has already started a return process
            return (
                <React.Fragment>
                    <style jsx>{`
                        @import 'vars';

                        h4 {
                            display: flex;
                            align-items: center;
                            justify-content: flex-start;

                            :global(span) {
                                margin-left: space(2);
                            }

                            margin-top: space(4);
                            margin-bottom:space(1);
                        }
                    `}</style>
                    <h4 className={'neutral'}>
                        <BasketReloadIcon />
                        <FormattedMessage
                            id={'ReturnReason.Status.ReturnedItem'}
                            defaultMessage={'A return request was already made for this item'}
                        />
                    </h4>
                    <p>
                        <FormattedMessage
                            id={'Returns.Status.Shipment'}
                            defaultMessage={'{dressName} was shipped {date} {tracking}'}
                            values={{
                                dressName: ocp.product.title,
                                date: ocp.fabrication.date ? `on ${ocp.fabrication.date.toLocaleDateString()}` : '',
                                tracking: ocp.shipment && ocp.shipment.trackingNumber ? (
                                    <React.Fragment>
                                        with tracking number: <a href={ocp.shipment.trackingUrl || undefined} rel="nofollow noopener noreferrer noindex" target="_blank">{ocp.shipment.trackingNumber}</a>
                                    </React.Fragment>
                                ) : ''
                            }}
                        />
                    </p>
                    <p>
                        <FormattedMessage
                            id={'Returns.Status.ReturnedItemInstructions'}
                            defaultMessage={'You created a return for {dressName} {date}. {here}'}
                            values={{
                                dressName: ocp.product.title,
                                date: ocp.return && ocp.return.createdDate ? `on ${ocp.return.createdDate.toLocaleDateString()}` : '',
                                here: order ? <span>Your return instructions are available <a href={`${BASEURL_RETURNS}/${order.number}/${ocp.return.requestId}`} rel="nofollow noopener noreferrer noindex" target="_blank">here</a></span> : ''
                            }}
                        />
                    </p>
                </React.Fragment>
            );
        }

        const selectedReason = ocp.lineItemId in selectedReasons ? selectedReasons[ocp.lineItemId] : RETURN_REASONS[0].value;

        const showReasonsTextArea = selectedReason !== RETURN_REASONS[0].value;
        const reasonText = ocp.lineItemId in returnReasons ? returnReasons[ocp.lineItemId] : '';

        return (
            <div className={'ReturnReasons--meta'}>
                <style jsx>{`

                    @import 'vars';

                    .ReturnReasons--meta {
                        :global(.input-wrapper) {
                            margin-top: space(3);
                        }
                    }
                `}</style>

                <p><FormattedMessage id={'ReturnReaons.Meta.Why'} defaultMessage={'Why are you returning this?'} /></p>
                <Dropdown
                    optionGroups={
                        [
                            {
                                title: 'Return Reason',
                                value: 'return_reason',
                                options: RETURN_REASONS
                            }
                        ]
                    }
                    onSelect={(value) => this.setState({ selectedReasons: { ...this.state.selectedReasons, [ocp.lineItemId]: value } })}
                    placeholder="Select reason"
                    selected={selectedReason}
                />
                {showReasonsTextArea && <Textarea
                    onChange={(e) => this.setState({ returnReasons: { ...this.state.returnReasons, [ocp.lineItemId]: e.target.value } })}
                    maxLength={255}
                    value={reasonText}
                    label={'Let\'s get specific. What didn\'t you like?'}
                />}
            </div>
        );
    }

    // Use order history row but on the right use a dropdown
    public render() {
        const canReturn = this.props.orders
                                ? this.props.orders
                                    .flatMap((x) => x.items)
                                    .some((x) => !x.return && x.returnEligable) : false;

        return (
            <OrdersLayout
                heading={<h1><FormattedMessage id={'ReturnReason.Title'} defaultMessage={'Your Return'} /></h1>}
            >
                <style jsx>{`
                    @import 'vars';

                    :global(.OrdersLayout) {
                        :global(.ReturnReason--button) {
                            margin: 0 auto !important;
                        }
                    }
                `}</style>

                {this.renderOrder()}

                <Button
                    className={'ReturnReason--button'}
                    onClick={() => this.submit()}
                    spinner={this.state.submitting}
                    error={this.state.error}
                    errorText={'Ensure you have selected an item to return'}
                    disabled={!canReturn}
                >
                    Start Return
                </Button>
            </OrdersLayout>
        );
    }
}

export default ReturnReason;
