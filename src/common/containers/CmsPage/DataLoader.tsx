import { connect } from 'react-redux';
import { RootState } from '@common/rematch';
import { CustomizedProduct, ProductListSummary } from 'typings/product';
import { HeightUnitType, SizeUnitType } from '@common/constants';
import { generateProductDetailUrl, URL_COMPONENT_SEPARATOR } from '@common/utils/url-helper';
import { logHandledError } from '@common/utils/error-reporting';
import { ProductsModelRootState } from '@common/rematch/models/products';
import { totalPrice } from '@common/utils/product';
import { findImages } from '@common/utils/render-url-helper';

class CmsDataLoadingContext {
    public productSummaries: string[] = [];
    public products: string[] = [];

    public loadProductSummary(pid: string | null): void {
        if (!pid) {
            return;
        }
        this.productSummaries.push(pid);
    }

    public loadProductSummaries(pids: string[] | null): void {
        if (!pids) {
            return;
        }

        this.productSummaries = this.productSummaries.concat(pids);
    }

    public loadProduct(pid: string | null): void {
        if (!pid) {
            return;
        }
        this.products.push(pid);
    }

    public loadProducts(pids: string[] | null): void {
        if (!pids) {
            return;
        }

        this.products = this.products.concat(pids);
    }

    public async resolve(loadProduct: (id: string) => Promise<any>, loadProductSummaries: (id: string[]) => Promise<any>): Promise<void> {
        await Promise.all(
            [
                loadProductSummaries(this.productSummaries),
                ...this.products
                    .map((pid) => pid.split(/[~-]/).first())
                    .notNullOrUndefined()
                    .uniqueMap()
                    .map((pid) => loadProduct(pid))
            ]
            .notNullOrUndefined()
        );
    }
}

function mapPidToCuztomizedProduct(pid: string, products: ProductsModelRootState): CustomizedProduct | null {
    const split = pid.split(URL_COMPONENT_SEPARATOR);
    const id = split.shift()!!;
    const selectedOptions = split;

    const product = products.products[id];

    if (!product) {
        return null;
    }

    const components = selectedOptions
        .map((code) => {
            return product.components.find((c) => c.code === code)
                || product.components.find((c) => c.meta.colorCode === code);
        })
        .notNullOrUndefined();
    
    if (components.length !== selectedOptions.length) {
        console.warn(`Contentful pid mismatch for pid ${pid}`, selectedOptions.filter((so) => !components.some((c) => c.code === so)));
        logHandledError(`Contentful pid mismatch for pid ${pid}`);
    }

    return  {
        product,
        components,
        height: null,
        heightUnit: HeightUnitType.INCH,
        sizeUnit: SizeUnitType.US
    };
}

function mapPidToProductSummary(pid: string, products: ProductsModelRootState): ProductListSummary | null {
    if (products.productListSummmaries[pid]) {
        return products.productListSummmaries[pid];
    }

    const customizedProduct = mapPidToCuztomizedProduct(pid, products);
    if (!customizedProduct) {
        return null;
    }

    return {
        media: findImages(customizedProduct),
        name: customizedProduct.product.curationMeta.name,
        pid,
        url: generateProductDetailUrl(customizedProduct, ''),
        price: totalPrice(customizedProduct),
        description: customizedProduct.product.curationMeta.description,
        primarySilhouetteId: '', // TODO: Map silhouette data from CMS
        overlayText: '',
    };
}

export const resolveProductSummaries = (propertyName = 'pids') => (props: any, context: CmsDataLoadingContext) => {
    context.loadProductSummaries(props[propertyName]);
};

export const resolveProductSummary = (propertyName = 'pid') => (props: any, context: CmsDataLoadingContext) => {
    context.loadProductSummary(props[propertyName]);
};

export const resolveProducts = (propertyName = 'pids') => (props: any, context: CmsDataLoadingContext) => {
    context.loadProducts(props[propertyName]);
};

export const reloaveProduct = (propertyName = 'pid') => (props: any, context: CmsDataLoadingContext) => {
    context.loadProduct(props[propertyName]);
};

export const connectProductSummaries = (propertyName = 'pids', outputPropery = 'products') => connect(
    (state: RootState, props: any) => ({
        [outputPropery]: props[propertyName] ? props[propertyName].map((pid: string) => mapPidToProductSummary(pid, state.ProductsModel)).notNullOrUndefined() : []
    })
);

export const connectProductSummary = (propertyName = 'pid', outputPropery = 'product') => connect(
    (state: RootState, props: any) => ({
        [outputPropery]: props[propertyName] ? mapPidToProductSummary(props[propertyName], state.ProductsModel) : null
    })
);

export const connectProducts = (propertyName = 'pids', outputPropery = 'products') => connect(
    (state: RootState, props: any) => ({
        [outputPropery]: props[propertyName] ? props[propertyName].map((pid: string) => mapPidToCuztomizedProduct(pid, state.ProductsModel)).notNullOrUndefined() : []
    })
);

export const connectProduct = (propertyName = 'pid', outputPropery = 'product') => connect(
    (state: RootState, props: any) => ({
        [outputPropery]: props[propertyName] ? mapPidToCuztomizedProduct(props[propertyName], state.ProductsModel) : null
    })
);

export default CmsDataLoadingContext;