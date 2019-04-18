import React from 'react';
import BaseLayout from '@containers/BaseLayout';
import { Desktop } from '@components/base/MediaQuerySSR';

interface Props {
    messageContent: React.ReactNode;
    imageContent: React.ReactNode;
    formContent: React.ReactNode;
}

class AccountLayout extends React.PureComponent<Props> {
    public render() {
        const { messageContent, imageContent, formContent } = this.props;

        return (
            <BaseLayout>
                <style jsx>{`
                    @import 'vars';

                    .AccountLayout {

                        @include mobile {
                            margin: 4*$space-base 0;
                        }

                        .grid {
                            @include grid;
                        }

                        .col {
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                        }

                        .col-message {
                            @include grid-column(4);

                            @include mobile {
                                @include grid-column(12);

                                text-align: center;
                            }
                        }

                        .col-image {
                            @include desktop {
                                justify-content: flex-start;
                                @include grid-column(4);
                            }
                            

                            @include mobile {
                                @include grid-column(12);
                            }

                            :global(img) {
                                height: 100vh;
                                object-position: top;

                                @include desktop {
                                    object-fit: cover;
                                }

                                @include mobile {
                                    object-fit: contain;
                                }
                            }
                        }

                        .col-form {
                            @include grid-column(4);

                            @include desktop {
                                max-width: 400px;
                                margin: 0 auto;
                            }

                            @include mobile {
                                @include grid-column(12);

                                margin-bottom: space(4);
                                order: -1;
                            }

                            :global(input) {
                                margin-bottom: 2*$space-base;
                            }

                            :global(.Checkbox) {
                                margin-bottom: 2*$space-base;
                            }

                            :global(.form-header) {
                                text-align: center;
                            }

                            :global(.error) {
                                color: $color-red;
                                border: 1px solid $color-red;
                                padding: $space-base;
                            }
                        }

                        :global(.seperator) {
                            margin: 2*$space-base 0;
                            text-align: center;
                            font-weight: bold;
                        }
                    }
                `}</style>

                <div className={'AccountLayout'}>
                    <div className={'grid'}>

                        <div className={'col col-message'}>
                            {messageContent}
                        </div>

                        <Desktop>
                            <div className={'col col-image'}>
                                {imageContent}
                            </div>
                        </Desktop>

                        <div className={'col col-form'}>
                            {formContent}
                        </div>
                    </div>
                </div>
            </BaseLayout>
        );
    }
}

export default AccountLayout;
