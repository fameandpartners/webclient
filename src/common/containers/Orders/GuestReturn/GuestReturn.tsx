import React from 'react';
import { SiteVersion } from '@common/constants';
import { RouteComponentProps } from 'react-router';
import OrdersLayout from '../OrdersLayout';
import { FormattedMessage } from 'react-intl';
import Input from '@components/base/Input/Input';
import Button from '@components/base/Button/Button';
import { isEmailValid } from '@components/layout/Footer/EmailCapture';
import { Link } from 'react-router-dom';
import { Order } from '@typings';

interface Props extends RouteComponentProps<{ email?: string, orderNumber?: string }> {
    siteVersion: SiteVersion;
    orders: Order[] | null;
    error: boolean;

    getGuestOrder: (query: { orderNumber: string, email: string, cookies?: string }) => void;
}

interface State {
    orderNumber: string;
    email: string;
    submitting: boolean;
    error: boolean;
    redirect: boolean;
}

class GuestReturn extends React.PureComponent<Props, State> {
    public state: State = {
        orderNumber: this.props.match.params.orderNumber || '',
        email: this.props.match.params.email || '',
        submitting: false,
        error: false,
        redirect: false,
    };

    public static getDerivedStateFromProps(nextProps: Props, prevState: State): Partial<State> {

        if (nextProps.orders && nextProps.orders.filter((x) => x.number === prevState.orderNumber).length > 0 && prevState.submitting) {
            return { error: false, submitting: false, redirect: true };
        }

        if (nextProps.error && prevState.submitting) {
            return { error: true, submitting: false, redirect: false };
        }

        return {};
    }

    public componentDidUpdate(prevProps: Props) {
        if (this.state.redirect) {
            this.props.history.push(`/return/reason/${this.state.orderNumber}/${this.state.email}`);
        }
    }

    private isValid() {
        if (!this.state.orderNumber) {
            return false;
        }

        if (!isEmailValid(this.state.email)) {
            return false;
        }

        return true;
    }

    private submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (this.isValid()) {
            this.props.getGuestOrder({ orderNumber: this.state.orderNumber, email: this.state.email, cookies: document.cookie });
            this.setState({ error: false, submitting: true });
        } else {
            this.setState({ error: true, submitting: false });
        }
    }

    public render() {
        return (
            <OrdersLayout
                heading={<div className={'GuestReturn--header'}>
                    <h1><FormattedMessage id={'Orders.GuestReturn.Title'} defaultMessage={'Create a return'} /></h1>
                    <p>
                        <FormattedMessage
                            id={'Orders.GuestReturn.Subtitle'}
                            defaultMessage={'Want to return? No problem. Orders may be returned within 30 days of the delivery date for a refund'}
                        />
                    </p>
                    <p>
                        <FormattedMessage
                            id={'Orders.GuestReturn.ExistingAccount'}
                            defaultMessage={'Already have an account? {createLink}'}
                            values={{
                                createLink: <Link to="/account/login">Sign in here</Link>
                            }}
                        />
                    </p>
                </div>}
                noBorder
            >
                <style jsx>{`
                    @import 'vars';

                    :global(.OrdersLayout--full) {

                        form {
                            margin: 0 auto;
                            max-width: 400px;

                            :global(input) {
                                margin-bottom: space(2);
                            }

                            :global(.Checkbox) {
                                margin-bottom: space(2);
                            }

                            :global(.error) {
                                color: $color-red;
                                border: 1px solid $color-red;
                                padding: $space-base;
                            }
                        }
                    }

                    :global(.GuestReturn--header) {
                        text-align: center;
                    }
                `}</style>

                <div className={'OrdersLayout--container'}>

                    <div className={'OrdersLayout--full'}>
                        <form
                            onSubmit={(e) => this.submit(e)}
                        >
                            {this.state.error &&  <p className={'error'}><FormattedMessage id={'Orders.GuestReturn.ErrorMessage'} defaultMessage={'Check that your order number and email is correct'} /></p>}
                            <Input
                                name={'orderNumber'}
                                type={'text'}
                                value={this.state.orderNumber}
                                onChange={(e) => this.setState({ orderNumber: e.target.value.trim() })}
                                placeholder={'Order Number e.g. R123456789'}
                            />
                            <Input
                                name={'email'}
                                type={'email'}
                                value={this.state.email}
                                onChange={(e) => this.setState({ email: e.target.value.trim() })}
                                placeholder={'Email'}
                            />

                            <Button spinner={this.state.submitting} fullwidth><FormattedMessage id={'Orders.GuestReturn.Button'} defaultMessage={'Submit'} /></Button>
                        </form>
                    </div>

                </div>
            </OrdersLayout>
        );
    }
}

export default GuestReturn;
