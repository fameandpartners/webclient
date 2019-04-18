import React from 'react';
import CurrencyAmount from '@components/base/CurrencyAmount/CurrencyAmount';
import CustomizationOverview from '@components/customization-overview/CustomizationOverview';
import { CustomizedProduct, OrderCustomizedProduct } from '@typings';

interface Props {
    id: number | string;
    itemUrl: string;
    image: string|null;

    title: string;
    price: number;

    customizedProduct: CustomizedProduct | OrderCustomizedProduct;
}

class LineItem extends React.PureComponent<Props> {
    public render() {
        const { id, itemUrl, image, title, price, customizedProduct } = this.props;

        return (
            <li key={id} className="Cart__LineItem">
                <style jsx>{`
                    @import 'vars';

                    .Cart__LineItem {
                        display: flex;
                        padding: $space-base * 3 0;
                        border-bottom: 1px solid $color-grey79;

                        &:last-child {
                            border-bottom: none;
                        }

                        .LineItem__ImageContainer {
                            width: 33%;
                            margin-right: $space-base * 4;
                            text-align: center;
                            flex-shrink: 0;

                            img {
                                max-width: 100%;
                                height: auto;
                                display: block;
                            }
                        }

                        .LineItem__Product-Title {
                            margin: $space-base 0 2*$space-base;

                            display: flex;
                            justify-content: space-between;
                        }

                        .LineItem__Content {
                            flex: 1;
                        }
                    }
                `}</style>
                {image && image.startsWith('http') && <div className="LineItem__ImageContainer">
                    <a href={itemUrl}>
                        <img className="LineItem__ImageContainer__Image" alt="" src={image} />
                    </a>

                    {this.props.children}
                </div>}

                <div className="LineItem__Content">
                    <p className="LineItem__Product-Title">
                        <strong>{title}</strong> <span><CurrencyAmount hideSign value={price} /></span>
                    </p>

                    <CustomizationOverview
                        canCustomize={false}
                        includeSeparators={false}
                        customizedProduct={customizedProduct}
                        startCustomize={null}
                        condensed
                    />
                </div>
            </li>
        );
    }
}

export default LineItem;
