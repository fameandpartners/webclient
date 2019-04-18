import { DeepPartial, Component, Group, Product, Section } from '@typings';
import { ComponentType } from '@common/utils/component-type';
import { getVisibleComponentsForSection } from '@common/utils/product-visibility';

describe('Bridesmaids Visible Options/Components', () => {
    const componentsList: Array<DeepPartial<Component>> = [
        // Base Top
        {
            code: 'strappy',
            componentTypeId: 'top',
            incompatibleWith: {},
        },
        {
            code: 'classic',
            componentTypeId: 'top',
            incompatibleWith: {},
        },
        {
            code: 'relaxed',
            componentTypeId: 'top',
            incompatibleWith: {},
        },
        {
            code: 'oneShoulder',
            componentTypeId: 'top',
            incompatibleWith: {},
        },
        {
            code: 'triCup',
            componentTypeId: 'top',
            incompatibleWith: {},
        },
        {
            code: 'draped',
            componentTypeId: 'top',
            incompatibleWith: {},
        },
        {
            code: 'strapless',
            componentTypeId: 'top',
            incompatibleWith: {},
        },

        // Base Bottom
        {
            code: 'B3',
            componentTypeId: 'base bottom',
            incompatibleWith: {},
        },
        {
            code: 'B5',
            componentTypeId: 'base bottom',
            incompatibleWith: {},
        },

        // Length
        {
            code: 'L1',
            title: 'Micro Mini',
            incompatibleWith: { allOptions: [['B3'], ['B4']] },
        },
        {
            code: 'L2',
            title: 'Mini',
            incompatibleWith: {},
        },

        // Fronts
        {
            code: 'T2',
            title: 'Curved Neckline',
            componentTypeId: 'front',
            incompatibleWith: {},
        },
        {
            code: 'T3',
            title: 'Sweetheart Neckline',
            componentTypeId: 'front',
            incompatibleWith: {},
        },
        {
            code: 'T4',
            title: 'Straight Neckline',
            componentTypeId: 'front',
            incompatibleWith: {},
        },
        {
            code: 'T6',
            title: 'Ballerina Neckline',
            componentTypeId: 'front',
            incompatibleWith: {},
        },
        {
            code: 'T76',
            title: 'Subtle sweetheart neckline',
            componentTypeId: 'front',
            incompatibleWith: {},
        },
        {
            code: 'T44',
            componentTypeId: 'front',
            incompatibleWith: {},
        },

        // Backs
        {
            code: 'T15',
            title: 'Plunging V-Back',
            componentTypeId: 'back',
            incompatibleWith: {},
        },
        {
            code: 'T90',
            title: 'Straight back neckline',
            componentTypeId: 'back',
            incompatibleWith: {},
        },
        {
            code: 'T91',
            title: 'V-Back neckline',
            componentTypeId: 'back',
            incompatibleWith: {},
        },
        {
            code: 'T92',
            title: 'Curved back neckline',
            componentTypeId: 'back',
            incompatibleWith: {},
        },

        // Waistbands
        {
            code: 'WB1',
            title: 'Standard Waistband',
            componentTypeId: 'waistband',
            incompatibleWith: {},
        },
        {
            code: 'WB2',
            title: 'Wide Waistband',
            componentTypeId: 'waistband',
            incompatibleWith: {},
        },

        // Straps and Sleeves
        {
            code: 'T22',
            title: 'Rouleu Straps',
            componentTypeId: 'strapsAndSleeves',
            incompatibleWith: {},
        },
        {
            code: 'T25',
            title: 'Wide Cross Back Straps',
            componentTypeId: 'strapsAndSleeves',
            incompatibleWith: {},
        },
        {
            code: 'T26',
            title: 'Cross Back Rouleu Straps',
            componentTypeId: 'strapsAndSleeves',
            incompatibleWith: {
                strappy: [['T92']]
            },
        },
        {
            code: 'T30',
            title: 'Wide Straps',
            componentTypeId: 'strapsAndSleeves',
            incompatibleWith: {},
        },
        {
            code: 'T33',
            title: 'Tie Straps',
            componentTypeId: 'strapsAndSleeves',
            incompatibleWith: {},
        },
        {
            code: 'T34',
            title: 'Halter Band',
            componentTypeId: 'strapsAndSleeves',
            incompatibleWith: {
                strappy: [['T2'], ['T6'], ['T91'], ['T15'], ['T92']],
            },
        },
        {
            code: 'T52',
            title: 'Wide Arm Ties',
            componentTypeId: 'strapsAndSleeves',
            incompatibleWith: {
                strappy: [['T91'], ['T15']]
            },
        },
        {
            code: 'T68',
            title: 'Wide Strap Panels',
            componentTypeId: 'strapsAndSleeves',
            incompatibleWith: {
                strappy: [['T2'], ['T6'], ['T91'], ['T15'], ['T92']],
            },
        },
        {
            code: 'T71',
            title: 'Narrow Adjustable Straps',
            componentTypeId: 'strapsAndSleeves',
            incompatibleWith: {},
        },
        {
            code: 'T85',
            title: 'Narrow Adjustable Cross Back Straps',
            componentTypeId: 'strapsAndSleeves',
            incompatibleWith: {},
        },
    ];

    const groups: Array<DeepPartial<Group>> = [
        {
            sectionGroups: [
                {
                    sections: [
                        {
                            componentTypeId: 'front',
                            componentTypeCategory: ComponentType.Customization,
                            options: [
                                {
                                    code: 'T2',
                                    parentOptionId: 'strappy',
                                },
                                {
                                    code: 'T3',
                                    parentOptionId: 'strappy',
                                },
                                {
                                    code: 'T4',
                                    parentOptionId: 'strappy',
                                },
                                {
                                    code: 'T6',
                                    parentOptionId: 'strappy',
                                },
                                {
                                    code: 'T76',
                                    parentOptionId: 'strappy',
                                },
                                {
                                    code: 'T44',
                                    parentOptionId: 'relaxed',
                                }
                            ],
                        },
                        {
                            componentTypeId: 'back',
                            componentTypeCategory: ComponentType.Customization,
                            options: [
                                {
                                    code: 'T15',
                                    parentOptionId: 'strappy',
                                },
                                {
                                    code: 'T90',
                                    parentOptionId: 'strappy',
                                },
                                {
                                    code: 'T91',
                                    parentOptionId: 'strappy',
                                },
                                {
                                    code: 'T92',
                                    parentOptionId: 'strappy',
                                },
                            ],
                        },
                        {
                            componentTypeId: 'waistband',
                            componentTypeCategory: ComponentType.Customization,
                            options: [
                                {
                                    code: 'WB1',
                                    parentOptionId: 'strappy',
                                },
                                {
                                    code: 'WB2',
                                    parentOptionId: 'strappy',
                                },
                            ],
                        },
                        {
                            options: [
                                {
                                    code: 'T22',
                                    isDefault: false,
                                    parentOptionId: 'strappy'
                                },
                                {
                                    code: 'T25',
                                    isDefault: false,
                                    parentOptionId: 'strappy'
                                },
                                {
                                    code: 'T26',
                                    isDefault: false,
                                    parentOptionId: 'strappy'
                                },
                                {
                                    code: 'T30',
                                    isDefault: false,
                                    parentOptionId: 'strappy'
                                },
                                {
                                    code: 'T33',
                                    isDefault: false,
                                    parentOptionId: 'strappy'
                                },
                                {
                                    code: 'T34',
                                    isDefault: false,
                                    parentOptionId: 'strappy'
                                },
                                {
                                    code: 'T52',
                                    isDefault: false,
                                    parentOptionId: 'strappy'
                                },
                                {
                                    code: 'T68',
                                    isDefault: false,
                                    parentOptionId: 'strappy'
                                },
                                {
                                    code: 'T71',
                                    isDefault: false,
                                    parentOptionId: 'strappy'
                                },
                                {
                                    code: 'T85',
                                    isDefault: false,
                                    parentOptionId: 'strappy'
                                },
                            ]
                        },
                    ]
                }
            ]
        }
    ];

    const product: DeepPartial<Product> = {
        groups,
        components: componentsList,
    };

    test('correctly identifies visible components for section: Front: [strappy, T2]', () => {
        const section: DeepPartial<Section> = groups[0].sectionGroups![0].sections[0];

        const selectedComponents: Array<DeepPartial<Component>> = [
            componentsList.find((x) => x.code === 'strappy'),
            componentsList.find((x) => x.code === 'T2'),
        ] as Component[];

        const outcome = getVisibleComponentsForSection(product as Product, section as Section, selectedComponents as Component[]);

        const expected: Component[] = [
            componentsList.find((x) => x.code === 'T2'),
            componentsList.find((x) => x.code === 'T3'),
            componentsList.find((x) => x.code === 'T4'),
            componentsList.find((x) => x.code === 'T6'),
            componentsList.find((x) => x.code === 'T76'),
        ] as Component[];

        expect(outcome).toMatchObject(expected);
    });

    test('correctly identifies visible components for section: Back: [strappy, T2, T15]', () => {
        const section: DeepPartial<Section> = groups[0].sectionGroups![0].sections[1];

        const selectedComponents: Array<DeepPartial<Component>> = [
            componentsList.find((x) => x.code === 'strappy'),
            componentsList.find((x) => x.code === 'T2'),
            componentsList.find((x) => x.code === 'T15'),
        ] as Component[];

        const outcome = getVisibleComponentsForSection(product as Product, section as Section, selectedComponents as Component[]);

        const expected: Component[] = [
            componentsList.find((x) => x.code === 'T15'),
            componentsList.find((x) => x.code === 'T90'),
            componentsList.find((x) => x.code === 'T91'),
            componentsList.find((x) => x.code === 'T92'),
        ] as Component[];

        expect(outcome).toMatchObject(expected);
    });

    test('correctly identifies visible components for section: Waistband: [strappy, T2, T15, WB1]', () => {
        const section: DeepPartial<Section> = groups[0].sectionGroups![0].sections[2];

        const selectedComponents: Array<DeepPartial<Component>> = [
            componentsList.find((x) => x.code === 'strappy'),
            componentsList.find((x) => x.code === 'T2'),
            componentsList.find((x) => x.code === 'T15'),
            componentsList.find((x) => x.code === 'WB1'),
        ] as Component[];

        const outcome = getVisibleComponentsForSection(product as Product, section as Section, selectedComponents as Component[]);

        const expected: Component[] = [
            componentsList.find((x) => x.code === 'WB1'),
            componentsList.find((x) => x.code === 'WB2'),
        ] as Component[];

        expect(outcome).toMatchObject(expected);
    });

    test('correctly identifies visible components for section: Straps and Sleeves: [strappy, T2, T15, WB1, T26]', () => {
        const section: DeepPartial<Section> = groups[0].sectionGroups![0].sections[3];

        const selectedComponents: Array<DeepPartial<Component>> = [
            componentsList.find((x) => x.code === 'strappy'),
            componentsList.find((x) => x.code === 'T2'),
            componentsList.find((x) => x.code === 'T15'),
            componentsList.find((x) => x.code === 'WB1'),
            componentsList.find((x) => x.code === 'T26'),
        ] as Component[];

        const outcome = getVisibleComponentsForSection(product as Product, section as Section, selectedComponents as Component[]);

        // 16: T34, 17: T52, 18: T68 are incompatible with T2, T15, T2 respectively
        const expected: Component[] = [
            componentsList.find((x) => x.code === 'T22'),
            componentsList.find((x) => x.code === 'T25'),
            componentsList.find((x) => x.code === 'T26'),
            componentsList.find((x) => x.code === 'T30'),
            componentsList.find((x) => x.code === 'T33'),
            componentsList.find((x) => x.code === 'T71'),
            componentsList.find((x) => x.code === 'T85'),
        ] as Component[];

        expect(outcome).toMatchObject(expected);
    });
});
