import { ComponentType } from '@common/utils/component-type';
import { DeepPartial, LayerCAD, Component } from '@typings';
import { getRenderableBaseCads, getRenderableLayerCads, getRenderableCads } from '@common/utils/cad-helper';
import { LayerCadType } from '@common/utils/layer-cad-types';

import 'array-ext';

describe('Legacy CAD Customisations', () => {
    const layerCads: LayerCAD[] = [
        {
            // 0
            url: 'https://d1msb7dh8kb0o9.cloudfront.net/spree/products/1625/cads/1631/web/layer-23.png?1509656311',
            width: 944,
            height: 800,
            sortOrder: 1,
            type: 'layer',
            components: ['make-midi-length', 'remove-upper-leg-lace-panel']
        },
        {
            // 1
            url: 'https://d1msb7dh8kb0o9.cloudfront.net/spree/products/1625/cads/1632/web/layer-1.png?1509656312',
            width: 944,
            height: 800,
            sortOrder: 2,
            type: 'layer',
            components: ['raise-neckline']
        },
        {
            // 2
            url: 'https://d1msb7dh8kb0o9.cloudfront.net/spree/products/1625/cads/1633/web/layer-0.png?1509656313',
            width: 944,
            height: 800,
            sortOrder: 3,
            type: 'layer',
            components: ['remove-sleeves']
        },
        {
            // 3
            url: 'https://d1msb7dh8kb0o9.cloudfront.net/spree/products/1625/cads/1634/web/base-2.png?1509656314',
            width: 944,
            height: 800,
            sortOrder: 4,
            type: 'base',
            components: ['make-midi-length']
        },
        {
            // 4
            url: 'https://d1msb7dh8kb0o9.cloudfront.net/spree/products/1625/cads/1635/web/layer-3.png?1509656316',
            width: 944,
            height: 800,
            sortOrder: 5,
            type: 'layer',
            components: ['remove-upper-leg-lace-panel']
        },
        {
            // 5
            url: 'https://d1msb7dh8kb0o9.cloudfront.net/spree/products/1625/cads/1636/web/base-.png?1509656317',
            width: 944,
            height: 800,
            sortOrder: 6,
            type: 'base',
            components: []
        }
    ];

    const components: Array<DeepPartial<Component>> = [
        {
            code: 'black-and-navy',
            componentTypeCategory: ComponentType.Color
        },
        {
            code: 'black',
            componentTypeCategory: ComponentType.Color
        },
        {
            code: 'US0/AU4',
            componentTypeCategory: ComponentType.Size
        },
        {
            code: 'US2/AU6',
            componentTypeCategory: ComponentType.Size
        },
        {
            code: 'US4/AU8',
            componentTypeCategory: ComponentType.Size
        },
        {
            code: 'US6/AU10',
            componentTypeCategory: ComponentType.Size
        },
        {
            code: 'US8/AU12',
            componentTypeCategory: ComponentType.Size
        },
        {
            code: 'US10/AU14',
            componentTypeCategory: ComponentType.Size
        },
        {
            code: 'US12/AU16',
            componentTypeCategory: ComponentType.Size
        },
        {
            code: 'US14/AU18',
            componentTypeCategory: ComponentType.Size
        },
        {
            code: 'US16/AU20',
            componentTypeCategory: ComponentType.Size
        },
        {
            code: 'US18/AU22',
            componentTypeCategory: ComponentType.Size
        },
        {
            code: 'US20/AU24',
            componentTypeCategory: ComponentType.Size
        },
        {
            code: 'US22/AU26',
            componentTypeCategory: ComponentType.Size
        },
        {
            code: 'remove-sleeves',
            componentTypeCategory: ComponentType.Customization
        },
        {
            code: 'raise-neckline',
            componentTypeCategory: ComponentType.Customization
        },
        {
            code: 'make-midi-length',
            componentTypeCategory: ComponentType.Customization
        },
        {
            code: 'remove-upper-leg-lace-panel',
            componentTypeCategory: ComponentType.Customization
        },
        {
            code: 'express_making',
            componentTypeCategory: ComponentType.Making
        },
        {
            code: 'free_returns',
            componentTypeCategory: ComponentType.Return
        }
    ];

    test('correctly sets isActive flag for: [base] make-midi-length', () => {
        const selectedComponents: Array<DeepPartial<Component>> = [
            {
                code: 'make-midi-length',
                componentTypeCategory: ComponentType.Customization
            }
        ];

        const expected = [{ ...layerCads[3], isActive: true }, { ...layerCads[5], isActive: false }];

        const outcome = getRenderableBaseCads(layerCads.filter((x) => x.type === LayerCadType.Base), selectedComponents as Component[]);

        expect(outcome).toMatchObject(expected);
        expect(outcome[0].isActive).toBe(expected[0].isActive);
        expect(outcome[1].isActive).toBe(expected[1].isActive);
    });

    test('correctly sets isActive flag for: [base] none', () => {
        const selectedComponents: Component[] = [];

        const expected = [{ ...layerCads[3], isActive: false }, { ...layerCads[5], isActive: true }];

        const outcome = getRenderableBaseCads(layerCads.filter((x) => x.type === LayerCadType.Base), selectedComponents);

        expect(outcome).toMatchObject(expected);
        expect(outcome[0].isActive).toBe(expected[0].isActive);
        expect(outcome[1].isActive).toBe(expected[1].isActive);
    });

    test('correctly sets isActive flag for: [layer] remove-upper-leg-lace-panel', () => {
        const selectedComponents: Array<DeepPartial<Component>> = [
            {
                code: 'remove-upper-leg-lace-panel',
                componentTypeCategory: ComponentType.Customization
            }
        ];

        const expected = [{ ...layerCads[4], isActive: true }, { ...layerCads[2], isActive: false }, { ...layerCads[1], isActive: false }, { ...layerCads[0], isActive: false }];

        const outcome = getRenderableLayerCads(layerCads.filter((x) => x.type === LayerCadType.Layer), selectedComponents as Component[]);

        expect(outcome).toMatchObject(expected);
        expect(outcome[0].isActive).toBe(expected[0].isActive);
        expect(outcome[1].isActive).toBe(expected[1].isActive);
        expect(outcome[2].isActive).toBe(expected[2].isActive);
        expect(outcome[3].isActive).toBe(expected[3].isActive);
    });

    test('correctly sets isActive flag for: [layer] make-midi-length + remove-upper-leg-lace-panel', () => {
        const selectedComponents: Array<DeepPartial<Component>> = [
            {
                code: 'make-midi-length',
                componentTypeCategory: ComponentType.Customization
            },
            {
                code: 'remove-upper-leg-lace-panel',
                componentTypeCategory: ComponentType.Customization
            }
        ];

        const expected = [{ ...layerCads[4], isActive: false }, { ...layerCads[2], isActive: false }, { ...layerCads[1], isActive: false }, { ...layerCads[0], isActive: true }];

        const outcome = getRenderableLayerCads(layerCads.filter((x) => x.type === LayerCadType.Layer), selectedComponents as Component[]);

        expect(outcome).toMatchObject(expected);
        expect(outcome[0].isActive).toBe(expected[0].isActive);
        expect(outcome[1].isActive).toBe(expected[1].isActive);
        expect(outcome[2].isActive).toBe(expected[2].isActive);
        expect(outcome[3].isActive).toBe(expected[3].isActive);
    });

    test('correctly sets isActive flag for: [layer] make-midi-length + remove-upper-leg-lace-panel + raise-neckline', () => {
        const selectedComponents: Array<DeepPartial<Component>> = [
            {
                code: 'make-midi-length',
                componentTypeCategory: ComponentType.Customization
            },
            {
                code: 'remove-upper-leg-lace-panel',
                componentTypeCategory: ComponentType.Customization
            },
            {
                code: 'raise-neckline',
                componentTypeCategory: ComponentType.Customization
            }
        ];

        const expected = [{ ...layerCads[4], isActive: false }, { ...layerCads[2], isActive: false }, { ...layerCads[1], isActive: true }, { ...layerCads[0], isActive: true }];

        const outcome = getRenderableLayerCads(layerCads.filter((x) => x.type === LayerCadType.Layer), selectedComponents as Component[]);

        expect(outcome).toMatchObject(expected);
        expect(outcome[0].isActive).toBe(expected[0].isActive);
        expect(outcome[1].isActive).toBe(expected[1].isActive);
        expect(outcome[2].isActive).toBe(expected[2].isActive);
        expect(outcome[3].isActive).toBe(expected[3].isActive);
    });

    test('correctly sets isActive flag for: [layer] make-midi-length + remove-upper-leg-lace-panel + raise-neckline + remove-sleeves', () => {
        const selectedComponents: Array<DeepPartial<Component>> = [
            {
                code: 'make-midi-length',
                componentTypeCategory: ComponentType.Customization
            },
            {
                code: 'remove-upper-leg-lace-panel',
                componentTypeCategory: ComponentType.Customization
            },
            {
                code: 'raise-neckline',
                componentTypeCategory: ComponentType.Customization
            },
            {
                code: 'remove-sleeves',
                componentTypeCategory: ComponentType.Customization
            }
        ];

        const expected = [{ ...layerCads[4], isActive: false }, { ...layerCads[2], isActive: true }, { ...layerCads[1], isActive: true }, { ...layerCads[0], isActive: true }];

        const outcome = getRenderableLayerCads(layerCads.filter((x) => x.type === LayerCadType.Layer), selectedComponents as Component[]);

        expect(outcome).toMatchObject(expected);
        expect(outcome[0].isActive).toBe(expected[0].isActive);
        expect(outcome[1].isActive).toBe(expected[1].isActive);
        expect(outcome[2].isActive).toBe(expected[2].isActive);
        expect(outcome[3].isActive).toBe(expected[3].isActive);
    });

    test('correctly sets isActive flag for: [layer] none', () => {
        const selectedComponents: Component[] = [];

        const expected = [{ ...layerCads[4], isActive: false }, { ...layerCads[2], isActive: false }, { ...layerCads[1], isActive: false }, { ...layerCads[0], isActive: false }];

        const outcome = getRenderableLayerCads(layerCads.filter((x) => x.type === LayerCadType.Layer), selectedComponents as Component[]);

        expect(outcome).toMatchObject(expected);
        expect(outcome[0].isActive).toBe(expected[0].isActive);
        expect(outcome[1].isActive).toBe(expected[1].isActive);
        expect(outcome[2].isActive).toBe(expected[2].isActive);
        expect(outcome[3].isActive).toBe(expected[3].isActive);
    });

    test('correctly sets isActive flag for: [base + layer] make-midi-length + remove-upper-leg-lace-panel', () => {
        const selectedComponents: Array<DeepPartial<Component>> = [
            {
                code: 'make-midi-length',
                componentTypeCategory: ComponentType.Customization
            },
            {
                code: 'remove-upper-leg-lace-panel',
                componentTypeCategory: ComponentType.Customization
            }
        ];

        const expected = [{ ...layerCads[5], isActive: false }, { ...layerCads[4], isActive: false }, { ...layerCads[3], isActive: true }, { ...layerCads[2], isActive: false }, { ...layerCads[1], isActive: false }, { ...layerCads[0], isActive: true }];

        const outcome = getRenderableCads(layerCads, selectedComponents as Component[]);

        expect(outcome).toMatchObject(expected);
        expect(outcome[0].isActive).toBe(expected[0].isActive);
        expect(outcome[1].isActive).toBe(expected[1].isActive);
        expect(outcome[2].isActive).toBe(expected[2].isActive);
        expect(outcome[3].isActive).toBe(expected[3].isActive);
        expect(outcome[4].isActive).toBe(expected[4].isActive);
    });
});
