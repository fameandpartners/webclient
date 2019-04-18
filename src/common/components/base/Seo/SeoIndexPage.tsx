import React from 'react';
import { Helmet } from 'react-helmet';
import { CustomizedProduct, ProductMedia, ProductListSummary, CmsAssetImage } from 'typings';
import { totalPrice, filterByComponentType } from '@common/utils/product';
import { SiteVersion, CURRENCIES } from '@common/constants';
import { ComponentType } from '@common/utils/component-type';
import { formatProductId } from '@common/utils/render-url-helper';

interface PropsIndexed {
    title: string;
    description: string;
    keywords: string;
    canonicalUrl: string;
    image: ProductMedia | CmsAssetImage | null;
    customizedProduct: CustomizedProduct | null;
    productListSummary: ProductListSummary | null;
    shouldIndex: true;
    siteVersion: SiteVersion;
}

interface PropsUnindexed {
    title: string;
    description?: string;
    keywords?: string;
    canonicalUrl?: string;
    image?: ProductMedia | CmsAssetImage;
    customizedProduct?: CustomizedProduct | null;
    productListSummary?: ProductListSummary | null;
    shouldIndex: false;
    siteVersion: SiteVersion;
}

class SEOIndexPage extends React.PureComponent<PropsIndexed | PropsUnindexed> {
    protected renderProduct(image: string | null | undefined, customizedProduct: CustomizedProduct, productListSummary: ProductListSummary|undefined|null) {
        const brand = 'Fame & Partners';
        const price = totalPrice(customizedProduct) / 100.0;
        const currency = CURRENCIES[this.props.siteVersion];

        let color: string|undefined;
        let material: string|undefined;

        const colorComponent = customizedProduct.components.find(filterByComponentType(ComponentType.Color));
        const fabricComponent = customizedProduct.components.find(filterByComponentType(ComponentType.ColorAndFabric));

        if (fabricComponent) {
            color = fabricComponent.meta.colorTitle;
            material = fabricComponent.meta.materialTitle;
        }
        if (!color && colorComponent) {
            color = colorComponent.title;
        }
        const productName = (productListSummary && productListSummary.name) || customizedProduct.product.curationMeta.name;
        const productDescription = (productListSummary && productListSummary.description) || customizedProduct.product.curationMeta.description;

        return (
            [
                <script key="product-ld" type="application/ld+json">
                    {JSON.stringify({
                        '@context': 'http://schema.org',
                        '@type': 'Product',
                        'description': productDescription,
                        'name': productName,
                        'image': image,
                        'color': color,
                        'material': material,
                        'manufacturer': brand,
                        'brand': brand,
                        'sku': formatProductId(customizedProduct),
                        'offers': {
                            '@type': 'Offer',
                            'availability': customizedProduct.product.isAvailable ? 'http://schema.org/InStock' : 'http://schema.org/Discontinued',
                            'price': price,
                            'priceCurrency': currency
                        }
                    })}
                </script>,

                <meta key="og:type" property="og:type" content="product" />,
                <meta key="product:retailer_item_id" property="product:retailer_item_id" content={customizedProduct.product.productId} />,

                <meta key="product:price:amount" property="product:price:amount" content={price.toFixed(2)} /> ,
                <meta key="product:price:currency" property="product:price:currency" content={currency} />,
                <meta key="product:color" property="product:color" content={color} />,
                <meta key="product:material" property="product:material" content={material} />,

                <meta
                    key="product:availability"
                    property="product:availability"
                    content={customizedProduct.product.isAvailable ? 'available for order' : 'out of stock'}
                />,
                <meta key="product:condition" property="product:condition" content="new" />,
                <meta key="product:target_gender" property="product:target_gender" content="female" />,
                <meta key="product:brand" property="product:brand" content={brand} />
        ]);
    }

    public render() {
        const { title, description, keywords, image, customizedProduct, siteVersion, productListSummary } = this.props;
        const canonicalUrl = this.props.canonicalUrl && `${global.__FAME_CONFIG__.URLS[siteVersion].frontend}${this.props.canonicalUrl}`;
        const usUrl = this.props.canonicalUrl && `${global.__FAME_CONFIG__.URLS[SiteVersion.US].frontend}${this.props.canonicalUrl}`;
        const auUrl = this.props.canonicalUrl && `${global.__FAME_CONFIG__.URLS[SiteVersion.AU].frontend}${this.props.canonicalUrl}`;
        const shouldIndex = global.__FAME_CONFIG__.ROBOTS_INDEX && this.props.shouldIndex;

        let imageUrl: string|null = null;
        if (productListSummary && productListSummary.media && productListSummary.media.length > 0) {
            const media = productListSummary.media[0];
            const src = media.src.sort((a, b) => b.width - a.width).find((x) => x.width <= 1200) || media.src[0];
            imageUrl = src.url;
        } else if (image && 'src' in image) {
            const src = image.src.sort((a, b) => b.width - a.width).find((x) => x.width <= 1200) || image.src[0];
            imageUrl = src.url;
        } else if (image && 'url' in image) {
            imageUrl = image.url;
        } 

        return (
            <React.Fragment>
                <Helmet>
                    <title>{title}</title>
                    <meta property="og:title" content={title} />

                    {description && <meta name="description" content={description} />}
                    {description && <meta property="og:description" content={description} />}

                    {keywords && <meta name="keywords" content={keywords}/>}

                    {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
                    <link rel="alternate" hrefLang="en-US" href={usUrl} />
                    <link rel="alternate" hrefLang="en-AU" href={auUrl} />
                    {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}

                    {shouldIndex ? (
                        <meta name="robots" content="index, follow" />
                    ) : (
                        <meta name="robots" content="noindex, nofollow" />
                    )}

                    {imageUrl && <meta property="og:image" content={imageUrl} />}

                    {customizedProduct && this.renderProduct(imageUrl, customizedProduct, productListSummary)}
                </Helmet>
            </React.Fragment>
        );
    }
}

export default SEOIndexPage;
