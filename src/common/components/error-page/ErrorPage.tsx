import React from 'react';
import BaseLayout from '@containers/BaseLayout';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import { Status } from '@components/base/Http';
import { trackError } from '@common/analytics/analytics';
import { Link } from 'react-router-dom';

interface Props {
    type: 401 | 404 | 500 | 200;
}

class ErrorPage extends React.PureComponent<Props> {
    public componentDidMount() {
        const { type } = this.props;

        let status = 'Client error';

        if (type === 401) {
            status = 'Unauthorized';
        } else if (type === 404) {
            status = 'Not found';
        }

        trackError(`${type}`, status);
    }

    public render() {
        const { type } = this.props;

        return (
            <React.Fragment>
                <style jsx>{`
                    @import 'vars';
                    .ErrorPage__Container {
                        @include grid;

                        padding: 8*$space-base 0 16*$space-base;

                        @include media('<tablet') {
                            padding: 5 * $space-base 0;
                        }

                        text-align: center;
                    }

                    .ErrorPage__MainColumn {
                        @include grid-column(12);
                    }

                    h1 {
                        font-size: 40px;
                        margin-bottom: 4*$space-base;
                    }

                    p {
                        @include text-style-h4;
                        font-weight: 300;
                        max-width: 600px;
                        margin: 0 auto;
                    }
                `}</style>
                <Status code={type} />
                <BaseLayout>
                    <div className="ErrorPage__Container">
                        <div className="ErrorPage__MainColumn">
                            <h1>
                                {401 === type && <FormattedMessage id="ErrorPage.401.Title" defaultMessage="Sorry, you're not allowed to visit the page" />}
                                {404 === type && <FormattedMessage id="ErrorPage.404.Title" defaultMessage="Looking for something?" />}
                                {500 === type && <FormattedMessage id="ErrorPage.500.Title" defaultMessage="Oh no," />}
                                {200 === type && <FormattedMessage id="ErrorPage.MaintenanceMode.Title" defaultMessage="Sorry, Fame and Partners is down for maintenance." />}
                            </h1>
                            <p>
                                {401 === type && <FormattedMessage
                                    id="ErrorPage.401.Subtitle"
                                    defaultMessage="Login to your account and try again or head to our {homepage}"
                                    values={{ homepage: <Link to="/">homepage.</Link> }}
                                />}

                                {404 === type && <FormattedHTMLMessage
                                    id="ErrorPage.404.Subtitle"
                                    defaultMessage="Try our <a href='/'>homepage</a> to see what's new and start customizing. <br />
                                    Still can't find what you're looking for? E-mail us at team@fameandpartners.com."
                                />}

                                {500 === type && <FormattedHTMLMessage
                                    id="ErrorPage.500.Subtitle"
                                    defaultMessage="That didn't work, why don't you try that again or head back to our <a href='/'>homepage</a>."
                                />}

                                {200 === type && <FormattedHTMLMessage
                                    id="ErrorPage.MaintenanceMode.Subtitle"
                                    defaultMessage="We expect to be back up in a couple of hours. Thanks for your patience"
                                />}
                            </p>
                        </div>
                    </div>
                </BaseLayout>
            </React.Fragment>
        );
    }
}

export default ErrorPage;
