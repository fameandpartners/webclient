import React from 'react';
import { RouteComponentProps } from 'react-router';
import { UserRootState } from '@common/rematch/models/user';
import { Order, OrderCustomizedProduct } from 'typings';
import { FormattedMessage } from 'react-intl';
import LineItem from '@components/layout/Cart/LineItem';
import { FabricationState, ReturnsState, ShipmentState, OrderState } from '@common/enums/OrderEnums';
import OrdersLayout from './OrdersLayout';
import { RETURN_INSURANCE_SKUS } from '@common/utils/product';
import { BASEURL_RETURNS } from '@common/utils/url-helper';
import CurrencyAmount from '@components/base/CurrencyAmount/CurrencyAmount';

const ShipmentIcon = require('@svg/i-shipment.svg').default;
const DeliveryIcon = require('@svg/i-delivery-truck.svg').default;
const CouponCutIcon = require('@svg/i-coupon-cut.svg').default;
const BasketRemoveIcon = require('@svg/i-shopping-basket-remove.svg').default;
const ChatIcon = require('@svg/i-chat.svg').default;
const DollarIcon = require('@svg/i-dollar.svg').default;
const BasketReloadIcon = require('@svg/i-basket-reload.svg').default;

interface Props extends RouteComponentProps<{ }> {
    user: UserRootState;
    orders: Order[] | null;
}

interface State {
    forceShow: boolean;
}

// TODO: Switch WWYDBox to a button
class Orders extends React.PureComponent<Props, State> {

    public state: State = {
        forceShow: false,
    };

    public componentDidMount() {
        if (!this.props.user && !this.props.orders) {
            window.location.href = '/account/login';
        }
    }

    // #region State Helpers

    private isProcessing(ocp: OrderCustomizedProduct, forceShow?: boolean) {
        return forceShow
                    || (ocp.fabrication.state === FabricationState.POAssigned
                    || ocp.fabrication.state === FabricationState.POPlaced
                    || ocp.fabrication.state === FabricationState.Processing
                    || ocp.fabrication.state === FabricationState.New
                    && !ocp.return);
    }

    private isMaking(ocp: OrderCustomizedProduct, forceShow?: boolean) {
        return forceShow
                    || (ocp.fabrication.state === FabricationState.Making
                    || ocp.fabrication.state === FabricationState.FabricAssigned
                    || ocp.fabrication.state === FabricationState.StyleCutting
                    || ocp.fabrication.state === FabricationState.QC
                    && !ocp.return)
                    && !(this.isShipped(ocp) || this.isPartiallyShipped(ocp));
    }

    private isShipped(ocp: OrderCustomizedProduct, forceShow?: boolean) {
        return forceShow
                    || (ocp.fabrication.state === FabricationState.Shipped
                    || ocp.shipment.state === ShipmentState.Shipped
                    && !ocp.return);
    }

    private isPartiallyShipped(ocp: OrderCustomizedProduct, forceShow?: boolean) {
        return forceShow
                    || (ocp.fabrication.state === FabricationState.Shipped
                    && ocp.shipment.state === ShipmentState.Partial
                    && !ocp.return);
    }

    private isCancelled(ocp: OrderCustomizedProduct, order: Order, forceShow?: boolean) {
        return forceShow
                    || (ocp.shipment.state === ShipmentState.Cancelled
                    || order.state === OrderState.Cancelled);
    }

    private isReturning(ocp: OrderCustomizedProduct, forceShow?: boolean) {
        return forceShow
                    || (ocp.return && ocp.return.status === ReturnsState.Requested);
    }

    private isReturnProcessing(ocp: OrderCustomizedProduct, forceShow?: boolean) {
        return forceShow
                    || (ocp.return && (
                        ocp.return.status === ReturnsState.Received
                        || ocp.return.status === ReturnsState.InNegotiation
                        || ocp.return.status === ReturnsState.InDispute
                        || ocp.return.status === ReturnsState.Approved
                    ));
    }

    private isReturnRejected(ocp: OrderCustomizedProduct, forceShow?: boolean) {
        return forceShow
                || (ocp.return && ocp.return.status === ReturnsState.Rejected);
    }

    private isReturnRefunded(ocp: OrderCustomizedProduct, forceShow?: boolean) {
        return forceShow
                || (ocp.return && ocp.return.status === ReturnsState.Refunded);
    }

    // #endregion State Helpers

    private renderItems(order: Order, forceShow?: boolean) {
        const returnInsurance = order.items.find((x) => RETURN_INSURANCE_SKUS.includes(x.product.title));

        return (
            <React.Fragment>
                <style jsx>{`
                    @import 'vars';

                    .OrdersLayout--left {
                        .Prices {
                            .unit {
                                display: flex;
                                justify-content: space-between;
                                margin: space(2) 0;

                                p {
                                    margin: 0;
                                }
                            }

                            .total {
                                display: flex;
                                justify-content: space-between;
                                padding: space(3) 0;
                                font-size: 16px;
                            }
                        }

                        h4 {
                            margin: 0;
                        }

                        h5 {
                            color: $color-grey60;
                        }

                        .LineItemBox {
                            margin: space(4) 0 0;

                            p {
                                display: flex;
                                align-items: center;
                                justify-content: flex-start;

                                :global(span) {
                                    margin-left: space(2);
                                }

                                margin: 0;
                                :global(span) {
                                    color: initial;
                                }
                            }
                        }

                        :global(.Cart__LineItem) {
                            border-bottom: none;
                        }
                    }
                `}</style>
                <section className={'OrdersLayout--left'}>
                    <h4>Order #{order.number}</h4>
                    {order.orderDate && <h5>Placed on {order.orderDate.toLocaleDateString()}</h5>}

                    {order.items.filter((x) => !RETURN_INSURANCE_SKUS.includes(x.product.title)).map((ocp) => (
                        <React.Fragment>

                            {this.isMaking(ocp, forceShow) && (
                                <div className={'LineItemBox'}>
                                    <p className={'positive'}>
                                        <CouponCutIcon />
                                        <FormattedMessage
                                            id={'OrderHistory.Status.ShipmentState.Ready'}
                                            defaultMessage={'{dressName} is currently being made {date}'}
                                            values={{
                                                dressName: ocp.product.title,
                                                date: ocp.projectedDeliveryDate ? `and is expected to be shipped on ${ocp.projectedDeliveryDate.toLocaleDateString()}` : '',
                                            }}
                                        />
                                    </p>
                                </div>
                            )}

                            {this.isShipped(ocp, forceShow) && (
                                <div className={'LineItemBox'}>
                                    <p className={'positive'}>
                                        <DeliveryIcon />
                                        <FormattedMessage
                                            id={'OrderHistory.Status.ShipmentState.Shipped'}
                                            defaultMessage={'{dressName} has shipped {date} {tracking}'}
                                            values={{
                                                dressName: ocp.product.title,
                                                date: ocp.fabrication.date ? `on ${ocp.fabrication.date.toLocaleDateString()}` : '',
                                                tracking: ocp.shipment.trackingNumber ? (
                                                    <React.Fragment>
                                                        with tracking number: <a href={ocp.shipment.trackingUrl || undefined} rel="nofollow noopener noreferrer noindex" target="_blank">{ocp.shipment.trackingNumber}</a>
                                                    </React.Fragment>
                                                ) : ''
                                            }}
                                        />
                                    </p>
                                </div>
                            )}

                            {this.isCancelled(ocp, order, forceShow) && (
                                <div className={'LineItemBox'}>
                                    <p className={'negative'}>
                                        <BasketRemoveIcon />
                                        <FormattedMessage
                                            id={'OrderHistory.Status.ShipmentState.Cancelled'}
                                            defaultMessage={'{dressName} has been cancelled {date}'}
                                            values={{
                                                dressName: ocp.product.title,
                                                date: order.lastUpdatedDate ? `on ${order.lastUpdatedDate.toLocaleDateString()}.` : '',
                                            }}
                                        />
                                    </p>
                                </div>
                            )}

                            {this.isReturning(ocp, forceShow) && (
                                    <div className={'LineItemBox'}>
                                        <p className={'neutral'}>
                                            <BasketReloadIcon />
                                            <FormattedMessage
                                                id={'OrderHistory.Status.ReturnState.Requested'}
                                                defaultMessage={'You created a return for {dressName} {date}'}
                                                values={{
                                                    dressName: ocp.product.title,
                                                    date: ocp.return && ocp.return.createdDate ? `on ${ocp.return.createdDate.toLocaleDateString()}` : '',
                                                }}
                                            />
                                        </p>
                                    </div>
                                )}

                            {this.isReturnProcessing(ocp, forceShow) && (
                                    <div className={'LineItemBox'}>
                                        <p className={'neutral'}>
                                            <BasketReloadIcon />
                                            <FormattedMessage
                                                id={'OrderHistory.Status.ReturnState.Received'}
                                                defaultMessage={'We have received your item and are processing your refund'}
                                            />
                                        </p>
                                    </div>
                                )}

                            {this.isReturnRejected(ocp, forceShow) && (
                                    <div className={'LineItemBox'}>
                                        <p className={'negative'}>
                                            <BasketRemoveIcon />
                                            <FormattedMessage
                                                id={'OrderHistory.Status.ReturnState.Rejected'}
                                                defaultMessage={'Your return was rejected for the following reason: {reason}'}
                                                values={{
                                                    reason: <React.Fragment>{'"'}<em>{ocp.return && ocp.return.reason}</em>{'"'}</React.Fragment>
                                                }}
                                            />
                                        </p>
                                    </div>
                                )}

                            {this.isReturnRefunded(ocp, forceShow) && (
                                    <div className={'LineItemBox'}>
                                        <p className={'positive'}>
                                            <DollarIcon />
                                            <FormattedMessage
                                                id={'OrderHistory.Status.ShipmentState.Refunded'}
                                                defaultMessage={'You have been refunded {amount} on {date}'}
                                                values={{
                                                    amount: ocp.return && ocp.return.refundedAmount ? `$${(ocp.return.refundedAmount / 100).toFixed(2)}` : 0,
                                                    date: ocp.return && ocp.return.refundedDate ? `on ${ocp.return.refundedDate.toLocaleDateString()}` : '',
                                                }}
                                            />
                                        </p>
                                    </div>
                                )}

                            <LineItem
                                id={ocp.product.productId}
                                itemUrl={ocp.url}
                                image={ocp.image}
                                title={ocp.product.title}
                                price={ocp.price}
                                customizedProduct={ocp}
                            />
                        </React.Fragment>
                    ))}

                    <hr />

                    <div className={'Prices'}>
                        <div className={'unit'}>
                            <p>Subtotal</p>
                            <p><CurrencyAmount hideSign value={order.itemsTotal - (returnInsurance ? returnInsurance.price : 0)} /></p>
                        </div>

                        { returnInsurance && returnInsurance.price > 0 &&
                            <div className={'unit'}>
                                <p>Return Insurance</p>
                                <p>
                                    <CurrencyAmount value={returnInsurance.price} hideSign />
                                </p>
                            </div>
                        }

                        { order.promoTotal < 0 &&
                            <div className={'unit'}>
                                <p>Additional Savings</p>
                                <p>
                                    <CurrencyAmount value={order.promoTotal} hideSign />
                                </p>
                            </div>
                        }

                        <div className={'unit'}>
                            <p>Shipping</p>
                            <p>{order.shippingTotal > 0 ?
                                <CurrencyAmount hideSign value={order.shippingTotal} /> :
                                <FormattedMessage
                                    id={'OrderHistory.Total.Shipping'}
                                    defaultMessage={'Free shipping'}
                                />
                            }</p>
                        </div>

                        { order.taxes.map((t, i) =>
                            <div className={'unit'} key={i}>
                                <p>{t.label}</p>
                                <p>
                                    <CurrencyAmount value={t.price} hideSign />
                                </p>
                            </div>
                        )}

                        <hr />

                        <div className={'total'}>
                            <strong><p>Total</p></strong>
                            <strong><p><CurrencyAmount hideSign value={order.total} /></p></strong>
                        </div>
                    </div>
                </section>
            </React.Fragment>
        );
    }

    private renderMeta(order: Order, forceShow?: boolean) {
        const orderStatuses = order.items.filter((x) => !RETURN_INSURANCE_SKUS.includes(x.product.title)).map((ocp) => {

            if (this.isCancelled(ocp, order)) {
                return (
                    <React.Fragment>
                        <h4 className={'negative'}>
                            <BasketRemoveIcon />
                            <FormattedMessage
                                id={'OrderHistory.Status.Title.Cancelled'}
                                defaultMessage={'Order cancelled'}
                            />
                        </h4>
                        <p>
                            <FormattedMessage
                                id={'OrderHistory.Status.Subtitle.Cancelled'}
                                defaultMessage={'The order was cancelled on {date}'}
                                values={{
                                    date: order.lastUpdatedDate.toLocaleDateString()
                                }}
                            />
                        </p>
                    </React.Fragment>
                );
            }

            if (this.isReturning(ocp)) {
                return (
                    <React.Fragment>
                        <h4 className={'neutral'}>
                            <BasketReloadIcon />
                            <FormattedMessage
                                id={'OrderHistory.Status.Title.Returning'}
                                defaultMessage={'Return started'}
                            />
                        </h4>
                        <p>
                            <FormattedMessage
                                id={'OrderHistory.Status.Subtitle.Returning'}
                                defaultMessage={'You created a return for {dressName} {date}. {here}'}
                                values={{
                                    dressName: ocp.product.title,
                                    date: ocp.return && ocp.return.createdDate ? `on ${ocp.return.createdDate.toLocaleDateString()}` : '',
                                    here: ocp.return && <span>Your return instructions are available <a href={`${BASEURL_RETURNS}/${order.number}/${ocp.return.requestId}`} rel="nofollow noopener noreferrer noindex" target="_blank">here</a></span>
                                }}
                            />
                        </p>
                    </React.Fragment>
                );
            }

            if (this.isReturnProcessing(ocp)) {
                return (
                    <React.Fragment>
                        <h4 className={'neutral'}>
                            <BasketReloadIcon />
                            <FormattedMessage
                                id={'OrderHistory.Status.Title.ReturnProcessing'}
                                defaultMessage={'Return processing'}
                            />
                        </h4>
                        <p>
                            <FormattedMessage
                                id={'OrderHistory.Status.Subtitle.ReturnProcessing'}
                                defaultMessage={'We have received your item and are processing your refund'}
                            />
                        </p>
                    </React.Fragment>
                );
            }

            if (this.isReturnRejected(ocp)) {
                return (
                    <React.Fragment>
                        <h4 className={'negative'}>
                            <BasketRemoveIcon />
                            <FormattedMessage
                                id={'OrderHistory.Status.Title.ReturnRejected'}
                                defaultMessage={'Return rejected'}
                            />
                        </h4>
                        <p>
                            <FormattedMessage
                                id={'OrderHistory.Status.Subtitle.ReturnRejected'}
                                defaultMessage={'Your return was rejected for the following reason: {reason}'}
                                values={{
                                    reason: <React.Fragment><br /><br />{'"'}<em>{ocp.return && ocp.return.reason}</em>{'"'}</React.Fragment>
                                }}
                            />
                        </p>
                    </React.Fragment>
                );
            }

            if (this.isReturnRefunded(ocp)) {
                return (
                    <React.Fragment>
                        <h4 className={'positive'}>
                            <DollarIcon />
                            <FormattedMessage
                                id={'OrderHistory.Status.Title.ReturnRefunded'}
                                defaultMessage={'Return refunded'}
                            />
                        </h4>
                        <p>
                            <FormattedMessage
                                id={'OrderHistory.Status.Subtitle.ReturnRefunded'}
                                defaultMessage={'You have been refunded {amount} on {date}'}
                                values={{
                                    amount: ocp.return && ocp.return.refundedAmount ? `$${(ocp.return.refundedAmount / 100.0).toFixed(2)}` : 0,
                                    date: ocp.return && ocp.return.refundedDate ? `on ${ocp.return.refundedDate.toLocaleDateString()}` : '',
                                }}
                            />
                        </p>
                    </React.Fragment>
                );
            }

            if (this.isPartiallyShipped(ocp)) {
                return (
                    <React.Fragment>
                        <h4 className={'positive'}>
                            <DeliveryIcon />
                            <FormattedMessage
                                id={'OrderHistory.Status.Title.PartiallyShipped'}
                                defaultMessage={'Partially shipped'}
                            />
                        </h4>
                        <p>
                            <FormattedMessage
                                id={'OrderHistory.Status.Subtitle.PartiallyShipped'}
                                defaultMessage={'{dressName} has shipped{date}{tracking}. Your other items will ship seperately'}
                                values={{
                                    dressName: ocp.product.title,
                                    date: ocp.fabrication.date ? ` on ${ocp.fabrication.date.toLocaleDateString()}` : '',
                                    tracking: ocp.shipment.trackingNumber ? (
                                        <React.Fragment>
                                           &nbsp;with tracking number: <a href={ocp.shipment.trackingUrl || undefined} rel="nofollow noopener noreferrer noindex" target="_blank">{ocp.shipment.trackingNumber}</a>
                                        </React.Fragment>
                                    ) : ''
                                }}
                            />
                        </p>
                    </React.Fragment>
                );
            }

            if (this.isShipped(ocp)) {
                return (
                    <React.Fragment>
                        <h4 className={'positive'}>
                            <DeliveryIcon />
                            <FormattedMessage
                                id={'OrderHistory.Status.Title.Shipped'}
                                defaultMessage={'Shipped'}
                            />
                        </h4>
                        <p>
                            <FormattedMessage
                                id={'OrderHistory.Status.Subtitle.Shipped'}
                                defaultMessage={'{dressName} has shipped {date} {tracking}'}
                                values={{
                                    dressName: ocp.product.title,
                                    date: ocp.shipment.shipmentDate ? `on ${ocp.shipment.shipmentDate.toLocaleDateString()}` : '',
                                    tracking: ocp.shipment.trackingNumber ? (
                                        <React.Fragment>
                                            with tracking number: <a href={ocp.shipment.trackingUrl || undefined} rel="nofollow noopener noreferrer noindex" target="_blank">{ocp.shipment.trackingNumber}</a>
                                        </React.Fragment>
                                    ) : ''
                                }}
                            />
                        </p>
                    </React.Fragment>
                );
            }

            if (this.isMaking(ocp)) {
                return (
                    <React.Fragment>
                        <h4 className={'positive'}>
                            <CouponCutIcon />
                            <FormattedMessage
                                id={'OrderHistory.Status.Title.Making'}
                                defaultMessage={'Being made'}
                            />
                        </h4>
                        <p>
                            <FormattedMessage
                                id={'OrderHistory.Status.Subtitle.Making'}
                                defaultMessage={'{dressName} is currently being made'}
                                values={{
                                    dressName: ocp.product.title,
                                    date: ocp.projectedDeliveryDate ? `and is expected to be shipped on ${ocp.projectedDeliveryDate.toLocaleDateString()}` : '',
                                    here: <a href="#" rel="nofollow" target="_blank">here</a>
                                }}
                            />
                        </p>
                    </React.Fragment>
                );
            }

            return null;
        }).notNullOrUndefined();

        const canReturn = forceShow
                            || (order.state !== OrderState.Cancelled && order.items
                                    .filter((x) => !RETURN_INSURANCE_SKUS.includes(x.product.title))
                                    .filter((x) => x.product.title.toLocaleLowerCase().trim() !== 'swatch')
                                    .some((x) => x.returnEligable));

        return (
            <React.Fragment>
                <style jsx>{`
                    @import 'vars';

                    .OrdersLayout--right {
                        p {
                            margin: 0;
                        }

                        > section {
                            margin: space(6) 0 space(3) 0;

                            &:first-child {
                                margin-top: 0;
                            }
                        }

                        :global(h4) {
                            display: flex;
                            align-items: center;
                            justify-content: flex-start;

                            :global(span) {
                                margin-left: space(2);
                            }

                            margin-top: space(4);
                            margin-bottom:space(1);
                        }

                        .AddressColumn {
                            width: 50%;
                            display: inline-block;

                            @include mobile {
                                width: 100%;

                                &:nth-child(n+2) {
                                    margin-top: space(5);
                                }
                            }
                        }

                        .WWYLTD {

                            &--container {
                                // display: flex;
                            }

                            .WWYLTDBox {
                                margin: space(2) 0;
                                width: calc(50% - #{space(2)});
                                display: inline-flex;
                                border: 1px solid $color-black;
                                padding: space(2);
                                flex-grow: 1;
                                align-items: center;

                                &:nth-child(even) {
                                    margin-left: space(2);
                                }
                                &:nth-child(odd) {
                                    margin-right: space(2);
                                }

                                h4 {
                                    margin: 0;
                                }

                                cursor: pointer;
                                &:hover {
                                    text-decoration: underline;
                                }

                                @include mobile {
                                    width: 100%;

                                    &:nth-child(even) {
                                        margin-left: 0;
                                    }
                                    &:nth-child(odd) {
                                        margin-right: 0;
                                    }
                                }

                                &:hover {
                                    background-color: $color-black;
                                    color: $color-white;

                                    * {
                                        color: $color-white;
                                    }
                                }
                            }
                        }
                    }
                `}</style>
                <section className={'OrdersLayout--right'}>
                    {orderStatuses.length > 0 && <section className={'Statuses'}>
                        <h3><FormattedMessage id={'OrderHistory.Meta.StatusTitle'} defaultMessage={'Order status'}/></h3>

                        {orderStatuses}
                    </section>}

                    <section className={'Addresses'}>
                        { order.deliveryAddress &&
                            <div className={'AddressColumn'}>
                                <h3><FormattedMessage id={'OrderHistory.Meta.DeliveryTitle'} defaultMessage={'Delivery address'}/></h3>
                                {
                                    order.items.first() && (
                                        <React.Fragment>
                                            <p>{order.deliveryAddress.firstName} {order.deliveryAddress.lastName}</p>
                                            <p>{order.deliveryAddress.address1}</p>
                                            <p>{order.deliveryAddress.address2}</p>
                                            <p>{order.deliveryAddress.city}</p>
                                            <p>{order.deliveryAddress.state}</p>
                                            <p>{order.deliveryAddress.country}</p>
                                        </React.Fragment>
                                    )
                                }
                            </div>
                        }

                        { order.billingAddress &&
                            <div className={'AddressColumn'}>
                                <h3><FormattedMessage id={'OrderHistory.Meta.BillingTitle'} defaultMessage={'Billing address'}/></h3>
                                {
                                    order.items.first() && (
                                        <React.Fragment>
                                            <p>{order.billingAddress.firstName} {order.billingAddress.lastName}</p>
                                            <p>{order.billingAddress.address1}</p>
                                            <p>{order.billingAddress.address2}</p>
                                            <p>{order.billingAddress.city}</p>
                                            <p>{order.billingAddress.state}</p>
                                            <p>{order.billingAddress.country}</p>
                                        </React.Fragment>
                                    )
                                }
                            </div>
                        }
                    </section>

                    <section className={'WWYLTD'}>
                        <h3><FormattedMessage id={'OrderHistory.Meta.WWYLTD'} defaultMessage={'What would you like to do'}/></h3>

                        <div className={'WWYLTD--container'}>
                            {(canReturn) &&
                                <div
                                    className={'WWYLTDBox'}
                                    onClick={() => {
                                        this.props.history.push(`${BASEURL_RETURNS}/reason/${order.number}`);
                                    }}
                                >
                                    <h4>
                                        <ShipmentIcon />
                                        <FormattedMessage
                                            id={'OrderHistory.WWYLTD.Return'}
                                            defaultMessage={'Return an item'}
                                        />
                                    </h4>
                                </div>}

                            <div
                                className={'WWYLTDBox'}
                                onClick={() => {
                                    if ('$zopim' in global) {
                                        (global as any).$zopim.livechat.window.show();
                                    }
                                }}
                            >
                                <h4>
                                    <ChatIcon />
                                    <FormattedMessage
                                        id={'OrderHistory.WWYLTD.Speak'}
                                        defaultMessage={'Speak to an assistant'}
                                    />
                                </h4>
                            </div>
                        </div>
                    </section>

                </section>
            </React.Fragment>
        );
    }

    public render() {
        const { forceShow } = this.state;

        return (
            <OrdersLayout
                heading={<h1><FormattedMessage id={'OrderHistory.Title'} defaultMessage={'Your Orders'} /></h1>}
            >
                <style jsx>{`
                    @import 'vars';

                    .OrderHistory--no-orders {
                        h2, p {
                            text-align: center;
                        }
                    }
                `}</style>
                {this.props.orders && this.props.orders.map((order: Order) => (
                    <div className={'OrdersLayout--container'}>
                        {this.renderItems(order, forceShow)}
                        {this.renderMeta(order, forceShow)}
                    </div>
                ))}
                {(!this.props.orders || this.props.orders.length === 0) && (
                    <div className={'OrderHistory--no-orders'}>
                        <h2><FormattedMessage
                            id={'Orders.NoOrders.Title'}
                            defaultMessage={'You have no orders'}
                            values={{ viewOurRange: <a href="/dresses">view our range</a> }}
                        /></h2>
                        <p><FormattedMessage
                            id={'Orders.NoOrders.Subtitle'}
                            defaultMessage={'{startShopping}'}
                            values={{ startShopping: <a href="/dresses">Start shopping</a> }}
                        /></p>
                    </div>
                )}
            </OrdersLayout>
        );
    }
}

export default Orders;
