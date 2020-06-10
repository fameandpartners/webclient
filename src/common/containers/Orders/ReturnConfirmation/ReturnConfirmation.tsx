import React, { Fragment } from 'react';
import BaseLayout from '@containers/BaseLayout';
import Modal from '@components/modal/Modal';
import { SiteVersion } from '@common/constants';
import { Order } from '@typings';
import LineItem from '@components/layout/Cart/LineItem';
import { RouteComponentProps } from 'react-router';
import { isBrowser } from '@common/utils/server-client-helpers';
import { FormattedMessage } from 'react-intl';
import OrdersLayout from '../OrdersLayout';
import { RETURN_INSURANCE_SKUS } from '@common/utils/product';
import { UserRootState } from '@common/rematch/models/user';

interface Props extends RouteComponentProps<{ orderNumber: string, returnRequestId?: string }> {
    siteVersion: SiteVersion;
    orders: Order[] | null;
    user: UserRootState;
}

interface State {
    order?: Order;
    // return?: OrderReturn;
}

// TODO: Refactor this when we are allowed to // when we do the PDF.
// Currently this is just a carbon copy of the existing version. Copy etc should be updated.
class ReturnConfirmation extends React.PureComponent<Props, State> {
    public state: State = {
        order: Array.isArray(this.props.orders) ? this.props.orders.filter((x) => x.number === this.props.match.params.orderNumber).first() : undefined,
    };

    public static getDerivedStateFromProps(nextProps: Props, prevState: State): Partial<State> {
        return {
            order: Array.isArray(nextProps.orders) ? nextProps.orders.filter((x) => x.number === nextProps.match.params.orderNumber).first() : undefined,
        };
    }

    private print() {
        if (isBrowser()) {
            window.print();
        }
    }

    public render() {
        const { order } = this.state;

        if (!order) {
            return null;
        }

        const returningProducts = order.items
                                    .filter((x) => !RETURN_INSURANCE_SKUS.includes(x.product.title))
                                    .filter((x) => x.return != null)
                                    .filterIf(Boolean(this.props.match.params.returnRequestId), (x) => String(x.return!.requestId) === this.props.match.params.returnRequestId);

        const firstLineItem = returningProducts.first();

        return (
            <OrdersLayout
                heading={<React.Fragment>
                    <h1><FormattedMessage id={'ReturnInstructions.Title'} defaultMessage={'Your Return'} /></h1>
                    {order.finalReturnByDate && <h2>
                        <FormattedMessage
                            id={'ReturnInstructions.Subtitle'}
                            defaultMessage={'Send your return by {date}'}
                            values={{
                                date: order.finalReturnByDate.toLocaleDateString()
                            }}
                        />
                    </h2>}
                </React.Fragment>}
            >
                <style jsx>{`
                    @import 'vars';
                    .packing-slip {
                        margin-top: space(6);
                        display: block !important;
                    }

                    hr {
                        margin: space(4) 0;
                    }

                    :global(header),
                    :global(footer),
                    :global(.OrdersLayout--right),
                    :global(.SitewideBanner),
                    :global(.OrdersLayout > h2),
                    :global(h1) {
                        @media print {
                            display: none !important;
                        }
                    }

                    .OrdersLayout--right {
                        ol {
                            list-style: decimal;
                            list-style-position: inside;
                        }
                    }

                    :global(.OrdersLayout > h1) {
                        padding-bottom: 0 !important;
                    }

                    :global(.LineItem__ImageContainer) {
                        @media print {
                            width: 15% !important;
                        }
                    }

                    :global(.OrdersLayout--container) {
                        @media print {
                            border: none;
                        }
                    }

                    .show-on-print {
                        display: none;

                        @media print {
                            display: block;
                        }
                    }
                    .label-header-pad {
                        display: none;
                        @media print {
                            margin-top: 40px;
                            display: block ;
                            text-align: center;
                            page-break-after: always;
                            -moz-width: 75%;
                            -moz-height: 75%;
                        }
                    }
                    .hide-on-print {
                        @media print {
                            display: none;
                        }
                    }

                    @page {
                        size: auto;   /* auto is the initial value */
                        margin: 0mm;  /* this affects the margin in the printer settings */
                    }
                `}</style>
               {firstLineItem && firstLineItem.return && firstLineItem.return.labelImageUrl && (
                 <div className={'label-header-pad'}>
                   <img src={firstLineItem.return.labelImageUrl} alt={'Shipping Label'} />
                 </div>
                )}
                <div className={'OrdersLayout--container'}>
                    <div className={'OrdersLayout--left'}>
                        {firstLineItem && firstLineItem.return && (
                            <div className={'hide-on-print'}>
                                {firstLineItem.return.requestId ? <h4>Return Request #{firstLineItem.return.requestId}</h4> : <h4>Return #{firstLineItem.return.id}</h4>}
                                <h5>Placed on {firstLineItem.return.createdDate.toLocaleDateString()}</h5>
                            </div>
                        )}
                        {firstLineItem && firstLineItem.return && !firstLineItem.return.labelImageUrl && (
                            <React.Fragment>
                                <h2>Please mail your package to</h2>
                                {order.isAustralianOrder && (
                                    <p>
                                        Reply Paid: 86373 <br />
                                        Fame and Partners - Returns <br />
                                        C/O - Next Logistics  <br />
                                        Warehouse 1A, 35-47 Stennett Road <br />
                                        Ingleburn, NSW 2565 <br />
                                        Australia <br />
                                    </p>
                                )}
                                {!order.isAustralianOrder && (
                                    <p>
                                        Fame and Partners - Returns <br />
                                        C/O - Newgistics <br />
                                        1200 Worldwide Boulevard <br />
                                        Hebron, KY 41048 <br />
                                    </p>
                                )}
                            </React.Fragment>
                        )}
                        <h2 className={'packing-slip'}>Packing Slip</h2>
                        <hr />
                        <p>Order #{order.number}</p>
                        {firstLineItem && firstLineItem.return && (
                            <div className={'show-on-print '}>
                                {firstLineItem.return.requestId ? <p>Return Request #{firstLineItem.return.requestId}</p> : <p>Return #{firstLineItem.return.id}</p>}
                                <p>Placed on {firstLineItem.return.createdDate.toLocaleDateString()}</p>
                            </div>
                        )}
                        {returningProducts.map((item) => (
                            <LineItem
                                id={item.product.productId}
                                itemUrl={item.url}
                                image={item.image}
                                title={item.product.title}
                                price={item.price}
                                customizedProduct={item}
                            />
                        ))}
                    </div>
                    <div className={'OrdersLayout--right'}>
                        <h2>Instructions for mailing your package</h2>

                        <ol>
                            <li><a onClick={() => this.print()} rel="nofollow noindex noopener" aria-label="print" type="button">Print</a> and cut out your packing slip.</li>
                            <li>Include the packing slip inside your return package.</li>

                            {order.isInternationalOrder && order.isAustralianOrder && (
                                <React.Fragment>

                                    <li>Print this document.</li>
                                    <li>Use the first page and place the label on your return package (this will serve as your prepaid return label)</li>
                                    {/*<li>Fold document in half as indicated on the form and place on your return package (this will serve as your prepaid return label)</li>*/}
                                    <li>Drop off at your nearest post office and ship!</li>

                                </React.Fragment>
                            )}

                            {order.isInternationalOrder && !order.isAustralianOrder && (
                                <React.Fragment>
                                    <li>Package your dress</li>
                                    <li>Follow your postal service's labelling instructions</li>
                                </React.Fragment>
                            )}

                            {order.isUSOrder && (
                                <React.Fragment>
                                    <li>Print/Cutout the SmartLabel&reg; below.</li>
                                    <li>Package the item(s) along with the packing slip, seal securely with tape and affix the SmartLabel&reg; to the package.</li>
                                    <li>
                                        Drop your return anywhere in the U.S. Mail location-in your mailbox, at work, or at a Post Office without waiting in line.&nbsp;

                                        <a
                                            href="https://tools.usps.com/go/POLocatorAction!input.action"
                                            target="_blank"
                                            rel="noopener noreferrer noindex nofollow"
                                        >Locate Post Office.
                                        </a>

                                    </li>
                                </React.Fragment>
                            )}

                        </ol>

                        {firstLineItem && firstLineItem.return && firstLineItem.return.labelUrl && <a href={firstLineItem.return.labelUrl} target="_blank" rel="noreferrer noopener">Print Label</a>}
                    </div>

                </div>
            </OrdersLayout>
        );
    }
}

export default ReturnConfirmation;
