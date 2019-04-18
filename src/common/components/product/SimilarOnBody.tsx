import React from 'react';
import classnames from 'classnames';
import Observer from '@researchgate/react-intersection-observer';
import { ProductMedia } from 'typings/product';
import FallbackImage from '@components/base/FallbackImage';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { generateProductUrlForPid } from '@common/utils/url-helper';

interface Props {
    images: ProductMedia[];
}

interface State {
    visible: boolean;
}

class SimilarOnBody extends React.PureComponent<Props, State> {
    public state: State = {
        visible: false,
    };

    public render() {
        return (
            <React.Fragment>
                <style jsx>{`
                    @import 'vars';

                    .SimilarOnBody {
                        @include mobile {
                            display: flex;
                            flex-wrap: nowrap;
                            overflow-x: auto;
                            width: 100%;
                        }

                        @include desktop {
                            @include grid;
                            justify-content: center;
                        }

                        :global(.SimilarOnBody--wrapper) {
                            overflow:hidden;

                            @include desktop {
                                @include grid-column-narrow-padding(2);
                            }

                            @include mobile {
                                min-width: 60vw;
                                max-width: 80vw;
                            }

                            p {
                                text-align: center;
                            }
                        }

                        :global(.AspectRatio) {
                            margin-bottom: space();
                        }
                    }

                    p {
                        margin-bottom: space(7);

                        @include desktop {
                            margin-bottom: space(12);
                        }
                    }
                `}</style>
                <h3><FormattedMessage id={'PDP.SimilarOnBody.Title'} defaultMessage={'Similar style'} /></h3>
                <p><FormattedMessage id={'PDP.SimilarOnBody.Subtitle'} defaultMessage={'Showing photos for a matching silhouette.'} /></p>
                
                <Observer onChange={(entry) => entry && entry.isIntersecting && !this.state.visible && this.setState({ visible: true })}>
                    <div className={'SimilarOnBody'}>
                        {this.state.visible && this.props.images.map((x) => (
                            <Link 
                                to={x.pid ? generateProductUrlForPid(x.pid) : '#'} 
                                key={x.sortOrder}
                                className={classnames('SimilarOnBody--wrapper', 'no-underline')}
                            >
                                <FallbackImage
                                    image={x}
                                />

                                <p><FormattedMessage id={'SimilarOnBody.Title'} defaultMessage={'Shop this style'} /></p>
                            </Link>
                        ))}
                    </div>
                </Observer>
            </React.Fragment>
        );
    }
}

export default SimilarOnBody;
