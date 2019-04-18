import { trackClickSimilarDress } from '@common/analytics/analytics';
import { RENDER_IMAGE_SIZES } from '@common/constants';
import { OrientationType } from '@common/utils/orientation-type';
import { PreviewType } from '@common/utils/preview-type';
import { auditSelectionType, getRelevantComponents, totalPrice, getDressLengthClass } from '@common/utils/product';
import {
    getComponentFromComponentCode,
    getParentComponentCodes,
    getParentFromSelection,
    getSectionForComponentCode,
} from '@common/utils/product-component';
import { getMainImageUrlForRender } from '@common/utils/render-url-helper';
import { generateProductDetailUrl } from '@common/utils/url-helper';
import { ZoomType } from '@common/utils/zoom-type';
import CurrencyAmount from '@components/base/CurrencyAmount/CurrencyAmount';
import FallbackImage from '@components/base/FallbackImage';
import Observer from '@researchgate/react-intersection-observer';
import classnames from 'classnames';
import React from 'react';
import { Link } from 'react-router-dom';
import { CustomizedProduct, ProductMedia } from 'typings/product';
import { FormattedMessage } from 'react-intl';

interface RenderProduct {
    image: ProductMedia;
    parent: string;
    price: number;
    cp: CustomizedProduct;
}

interface Props {
    customizedProduct: CustomizedProduct;
}

interface State {
    dresses: RenderProduct[];
    loaded: boolean;
}

class SimilarDresses extends React.Component<Props, State> {
    public state: State = {
        dresses:  [],
        loaded: false,
    };

    public static getDerivedStateFromProps(nextProps: Props, prevState: State): Partial<State> {
        return {
            dresses: SimilarDresses.generate(nextProps.customizedProduct)
        };
    }

    private static generate(customizedProduct: CustomizedProduct): RenderProduct[] {
        const { product } = customizedProduct;

        // To get similar dresses, we'd need to change the category e.g. top
        // So, 1. Get all categories for top, then disclude the currently selected
        const currentParent = getParentFromSelection(product, customizedProduct.components);
        const parents = getParentComponentCodes(product).filter((x) => x !== currentParent.code);

        return parents.map((parent) => {
            // Fake select this new parent
            const section = getSectionForComponentCode(product, parent);
            const component = getComponentFromComponentCode(product, parent);
            let selectedComponents = auditSelectionType(section, component, customizedProduct.components, customizedProduct, false);

            // Do incompatibilities logic for render type dresses
            if (product.previewType === PreviewType.Render) {
                // Update with default selections in order to keep the rendering happy (only for bridesmaids)
                selectedComponents = getRelevantComponents({ product, selectedComponents, additionalComponent: component });
            }

            // Now we have the component, generate the structure to render it
            const cp = { ...customizedProduct, components: selectedComponents };
            const image = getMainImageUrlForRender(cp, OrientationType.Front, ZoomType.None, RENDER_IMAGE_SIZES);

            return {
                image,
                parent,
                price: totalPrice(cp),
                cp,
            };
        });

    }

    public shouldComponentUpdate(nextProps: Props, nextState: State) {
        // Only when it's loaded should we check if everything has changed
        if (!this.state.loaded && nextState.loaded) {
            return true;
        }

        if (this.state.loaded) {
            if (nextProps.customizedProduct.components.difference(this.props.customizedProduct.components).length > 0) {
                return true;
            }

            if (nextState.dresses.difference(this.state.dresses).length > 0) {
                return true;
            }
        }

        return false;
    }

    private loadImages(entry: IntersectionObserverEntry) {
        if (entry.isIntersecting && !this.state.loaded) {
            this.setState({ loaded: true });
        }
    }

    public render() {
        const { dresses } = this.state;

        return (
            <React.Fragment>
                <style jsx>{`
                    @import 'vars';

                    h3 {
                        margin-bottom: space(7);
                        @include desktop {
                            margin-bottom: space(12);
                        }
                    }

                    .SimilarDresses {

                        @include mobile {
                            display: flex;
                            flex-wrap: nowrap;
                            overflow-x: auto;
                            scroll-behavior: smooth;
                            width: 100%;
                        }

                        @include desktop {
                            @include grid;
                            justify-content: center;
                        }

                        :global(.SimilarDress--wrapper) {
                            text-decoration: none;
                            overflow:hidden;

                            @include desktop {
                                @include grid-column-narrow-padding(2);
                            }

                            @include mobile {
                                min-width: 60vw;
                                max-width: 80vw;
                            }
                        }

                        :global(.dress-length--KN) {
                            :global(.AspectRatio){
                                margin-bottom:-30%;
                            }
                        }

                        :global(.dress-length--MN) {

                            :global(.AspectRatio){
                                margin-bottom:-30%;
                            }
                        }
                        :global(.dress-length--MM) {
                            :global(.AspectRatio){
                                margin-bottom:-30%;
                            }
                        }

                        :global(.dress-length--MD) {
                            :global(.AspectRatio){
                                margin-bottom:-15%;
                            }
                        }

                        :global(.dress-length--AK) {
                            :global(.AspectRatio){
                                margin-bottom:-5%;
                            }
                        }
                        :global(.dress-length--FM) {
                            :global(.AspectRatio){
                                margin-bottom:0%;
                            }
                        }
                        :global(.dress-length--CM) {
                            :global(.AspectRatio){
                                margin-bottom:0%;
                            }
                        }

                        :global(.price) {
                            text-align: center;
                            color:$color-black;
                        }

                        :global(.AspectRatio) {
                            width: 100%;
                            margin-bottom: $space-base;
                            @include desktop {
                                width:130%;
                                margin-left:-15%;
                            }
                        }
                    }
                `}</style>

                <h3><FormattedMessage id={'PDP.SimilarDresses.Title'} defaultMessage={'Similar dresses'} /></h3>

                <Observer onChange={(entry) => this.loadImages(entry)}>
                    <div className={'SimilarDresses'}>
                        {this.state.loaded
                            && dresses.map((sd, idx) => (
                                <Link
                                    key={idx}
                                    className={classnames('SimilarDress--wrapper', getDressLengthClass(dresses.first()!.cp.components))}
                                    onClick={() => trackClickSimilarDress(this.props.customizedProduct, sd.cp)}
                                    to={generateProductDetailUrl(sd.cp, '')}
                                >
                                    <FallbackImage
                                        key={sd.parent}
                                        image={sd.image}
                                        sizes={'(max-width: 1024px) 50vw, 20vw'}
                                    />
                                    <div className={'price'}>
                                        <CurrencyAmount value={sd.price} hideSign />
                                    </div>
                                </Link>
                            ))
                        }
                    </div>
                </Observer>
            </React.Fragment>
        );
    }
}

export default SimilarDresses;
