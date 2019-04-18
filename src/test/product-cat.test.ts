import FameAPI from '@common/services/fameApi';
import { DEFAULT_SITE_VERSION } from '@common/constants';
import { Component, DeepPartial, Product } from '@typings';
import { mapToCode } from '@common/utils/product';
import { getVisibleComponents } from '@common/utils/product-visibility';

describe('FPG1002', () => {
    const parent = 'C1';
    const productId = 'FPG1002';
    const api = new FameAPI(DEFAULT_SITE_VERSION);
    let product: Partial<Product> = {};

    beforeAll(async () => {
        product = (await api.getProduct(productId))!!;
    });

    test('[MM] is incompatbile with [B16]', async () => {
        const selectedComponents: Array<DeepPartial<Component>> = [(product as Product).components.find((x) => x.code === parent)!, (product as Product).components.find((x) => x.code === 'MM')!];

        const visible = getVisibleComponents(product as Product, selectedComponents as Component[]).map(mapToCode);
        const excluded = ['B16'];

        expect(excluded.intersection(visible).length).toBe(0);
    });

    test('[MN, B4] is incompatbile with [B16]', async () => {
        const selectedComponents: Array<DeepPartial<Component>> = [(product as Product).components.find((x) => x.code === parent)!, (product as Product).components.find((x) => x.code === 'MN')!, (product as Product).components.find((x) => x.code === 'B4')!];

        const visible = getVisibleComponents(product as Product, selectedComponents as Component[]).map(mapToCode);
        const excluded = ['B16'];

        expect(excluded.intersection(visible).length).toBe(0);
    });

    // test('[MN, B4] is incompatbile with [B16] but only MN is selected', async () => {
    //     const selectedComponents: Array<DeepPartial<Component>> = [(product as Product).components.find((x) => x.code === parent)!, (product as Product).components.find((x) => x.code === 'MN')!];

    //     const visible = getVisibleComponents(product as Product, selectedComponents as Component[]).map(mapToCode);
    //     const excluded = ['B16'];

    //     expect(excluded.intersection(visible).length).toBe(1);
    // });
});

describe('FPG1003', () => {
    const parent = 'C1';
    const productId = 'FPG1003';
    const api = new FameAPI(DEFAULT_SITE_VERSION);
    let product: Partial<Product> = {};

    beforeAll(async () => {
        product = (await api.getProduct(productId))!!;
    });

    test('[T52] is incompatbile with [T93, T11, T96]', () => {
        const selectedComponents: Array<DeepPartial<Component>> = [(product as Product).components.find((x) => x.code === parent)!, (product as Product).components.find((x) => x.code === 'T52')!];

        const visible = getVisibleComponents(product as Product, selectedComponents as Component[]).map(mapToCode);
        const excluded = ['T93', 'T11', 'T96'];

        expect(excluded.intersection(visible).length).toBe(0);
    });

    test('[T0, T45, T46, T48, T49, T98, T99, T100, T101] is incompatbile with [T96, T15]', () => {
        const selectedComponents: Array<DeepPartial<Component>> = [(product as Product).components.find((x) => x.code === parent)!, (product as Product).components.find((x) => x.code === 'T96')!, (product as Product).components.find((x) => x.code === 'T15')!];

        const visible = getVisibleComponents(product as Product, selectedComponents as Component[]).map(mapToCode);
        const excluded = ['T0', 'T45', 'T46', 'T48', 'T49', 'T98', 'T99', 'T100', 'T101'];

        expect(excluded.intersection(visible).length).toBe(0);
    });

    test('[T0, T45, T46, T48, T49, T98, T99, T100, T101] is incompatbile with [T96, T17]', () => {
        const selectedComponents: Array<DeepPartial<Component>> = [(product as Product).components.find((x) => x.code === parent)!, (product as Product).components.find((x) => x.code === 'T96')!, (product as Product).components.find((x) => x.code === 'T17')!];

        const visible = getVisibleComponents(product as Product, selectedComponents as Component[]).map(mapToCode);
        const excluded = ['T0', 'T45', 'T46', 'T48', 'T49', 'T98', 'T99', 'T100', 'T101'];

        expect(excluded.intersection(visible).length).toBe(0);
    });

    test('[T0, T45, T46, T48, T49, T98, T99, T100, T101] is incompatbile with [T96, T18]', () => {
        const selectedComponents: Array<DeepPartial<Component>> = [(product as Product).components.find((x) => x.code === parent)!, (product as Product).components.find((x) => x.code === 'T96')!, (product as Product).components.find((x) => x.code === 'T18')!];

        const visible = getVisibleComponents(product as Product, selectedComponents as Component[]).map(mapToCode);
        const excluded = ['T0', 'T45', 'T46', 'T48', 'T49', 'T98', 'T99', 'T100', 'T101'];

        expect(excluded.intersection(visible).length).toBe(0);
    });
});

describe('FPG1005', () => {
    const parent = 'C2';
    const productId = 'FPG1005';
    const api = new FameAPI(DEFAULT_SITE_VERSION);
    let product: Partial<Product> = {};

    beforeAll(async () => {
        product = (await api.getProduct(productId))!!;
    });

    test('[MN] is incompatbile with [B14]', () => {
        const selectedComponents: Array<DeepPartial<Component>> = [(product as Product).components.find((x) => x.code === parent)!, (product as Product).components.find((x) => x.code === 'MN')!];

        const visible = getVisibleComponents(product as Product, selectedComponents as Component[]).map(mapToCode);
        const excluded = ['B14'];

        expect(excluded.intersection(visible).length).toBe(0);
    });

    test('[B2] is incompatbile with [B14]', () => {
        const selectedComponents: Array<DeepPartial<Component>> = [(product as Product).components.find((x) => x.code === parent)!, (product as Product).components.find((x) => x.code === 'B2')!];

        const visible = getVisibleComponents(product as Product, selectedComponents as Component[]).map(mapToCode);
        const excluded = ['B14'];

        expect(excluded.intersection(visible).length).toBe(0);
    });

    test('[KN, B10] is incompatbile with [B14]', () => {
        const selectedComponents: Array<DeepPartial<Component>> = [(product as Product).components.find((x) => x.code === parent)!, (product as Product).components.find((x) => x.code === 'KN')!, (product as Product).components.find((x) => x.code === 'B10')!];

        const visible = getVisibleComponents(product as Product, selectedComponents as Component[]).map(mapToCode);
        const excluded = ['B14'];

        expect(excluded.intersection(visible).length).toBe(0);
    });

    test('[A8] is incompatbile with [A5]', () => {
        const selectedComponents: Array<DeepPartial<Component>> = [(product as Product).components.find((x) => x.code === parent)!, (product as Product).components.find((x) => x.code === 'A8')!];

        const visible = getVisibleComponents(product as Product, selectedComponents as Component[]).map(mapToCode);
        const excluded = ['A5'];

        expect(excluded.intersection(visible).length).toBe(0);
    });
});
