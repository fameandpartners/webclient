import { ComponentType } from '@common/utils/component-type';
import { getVisibleComponents } from '@common/utils/product-visibility';
import { SelectionType } from '@common/utils/selection-type';
import { Component, DeepPartial, Group, Product, Section } from '@typings';

import { getSelectedComponents, sortByCode, getRelevantComponents, auditSelectionType, mapToCode, getDefaultSelectedComponents } from './product';

describe('Bridesmaids Selected Components', () => {
    const product: DeepPartial<Product> = {
        groups: [
            {
                sectionGroups: [
                    {
                        sections: [
                            {
                                sectionId: 'size',
                                options: [
                                    'US0/AU4',
                                    'US2/AU6',
                                    'US4/AU8',
                                    'US6/AU10',
                                    'US8/AU12',
                                    'US10/AU14',
                                    'US12/AU16',
                                    'US14/AU18',
                                    'US16/AU20',
                                    'US18/AU22',
                                    'US20/AU24',
                                    'US22/AU26',
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                sectionGroups: [
                    {
                        sections: [
                            {
                                sectionId: 'color',
                                options: [
                                    { code: 'marigold', },
                                    { code: 'red', },
                                    { code: 'black', },
                                    { code: 'summer-sand', },
                                    { code: 'navy', },
                                    { code: 'magenta' },
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                sectionGroups: [
                    {
                        sections: [
                            {
                                sectionId: 'cad',
                                options: [
                                    { code: 'add-ruffle-arm-bands', },
                                    { code: 'raise-back', },
                                    { code: 'make-petti-length', },
                                    { code: 'add-ruffle-to-front-neckline' },
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                sectionGroups: [
                    {
                        sections: [
                            {
                                sectionId: 'style',
                                options: [
                                    { code: 'BC1', },
                                    { code: 'BC2', },
                                    { code: 'BC3', },
                                    { code: 'BC4', },
                                    { code: 'BC5', },
                                    { code: 'BC6', },
                                    { code: 'BC7', },
                                ]
                            }
                        ]
                    },
                    {
                        sections: [
                            {
                                sectionId: 'length',
                                options: [
                                    { code: 'extra-mini', },
                                    { code: 'mini', },
                                    { code: 'midi', },
                                    { code: 'maxi', },
                                    { code: 'knee' },
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                sectionGroups: [
                    {
                        sections: [
                            {
                                sectionId: 'front',
                                options: [
                                    { code: 'T76', },
                                    { code: 'T2', },
                                    { code: 'T3', },
                                    { code: 'T4' },
                                ]
                            },
                            {
                                sectionId: 'back',
                                options: [
                                    { code: 'T1', },
                                    { code: 'T11', },
                                    { code: 'T15' },
                                ]
                            },
                            {
                                sectionId: 'waistband',
                                options: [
                                    { code: 'WB1', },
                                    { code: 'WB2' },
                                ]
                            }
                        ]
                    },
                    {
                        sections: [
                            {
                                sectionId: 'strapsAndSleeves',
                                options: [
                                    { code: 'T22', },
                                    { code: 'T26', },
                                    { code: 'T71', },
                                    { code: 'T30', },
                                    { code: 'T33', },
                                    { code: 'T34', },
                                    { code: 'T68', },
                                    { code: 'T51', },
                                    { code: 'T31', },
                                    { code: 'T52', },
                                    { code: 'T25', },
                                    { code: 'T85' },
                                ]
                            },
                        ]
                    },
                    {
                        sections: [
                            {
                                sectionId: 'extras',
                                options: [
                                    { code: 'T60', },
                                    { code: 'T58', },
                                    { code: 'A5', },
                                    { code: 'T52' },
                                ]
                            },
                        ]
                    }
                ]
            }
        ]
    };

    test('correctly identifies selected components for groupIndex: 4, sectionGroupIndex: 0. (No Straps + Sleeves, Extras)', () => {
        // Disclude straps + sleeves + extras
        const sectionGroupIndex = 0;
        const currentSelectedGroupIndex = 4;
        const currentSelectedGroup = product.groups![currentSelectedGroupIndex];
        const currentSelectedSectionGroup = currentSelectedGroup.sectionGroups[sectionGroupIndex];

        const currentSelectedComponents: Array<Partial<Component>> = [
            { code : 'AS' },
            { code : 'BC1' },
            { code : 'T11' },
            { code : 'T30' },
            { code : 'T4' },
            { code : 'add-ruffle-arm-bands' },
            { code : 'add-ruffle-to-front-neckline' },
            { code : 'T11' },
            { code : 'magenta' },
            { code : 'make-petti-length' },
            { code : 'mini' },
            { code : 'raise-back' },
            { code : 'WB2' },
        ];

        const outcome = getSelectedComponents({
            groups: product.groups! as Group[],
            currentSelectedGroup,
            currentSelectedSectionGroup,
            currentSelectedComponents: currentSelectedComponents as Component[],
        });

        const expected: Array<Partial<Component>> = [
            { code: 'BC1' },
            { code: 'T11' },
            { code: 'T4' },
            { code: 'add-ruffle-arm-bands' },
            { code: 'add-ruffle-to-front-neckline' },
            { code: 'magenta' },
            { code: 'make-petti-length' },
            { code: 'mini' },
            { code: 'raise-back' },
            { code: 'WB2' },
        ];

        expect(outcome.sort(sortByCode)).toMatchObject((expected as Component[]).sort(sortByCode));
    });

    test('correctly identifies selected components for groupIndex: 3, sectionGroupIndex: 0. (No Length, Front, Back, Waistband, Straps + Sleeves, Extras)', () => {
        // Disclude straps + sleeves + extras
        const sectionGroupIndex = 0;
        const currentSelectedGroupIndex = 3;
        const currentSelectedGroup = product.groups![currentSelectedGroupIndex];
        const currentSelectedSectionGroup = currentSelectedGroup.sectionGroups[sectionGroupIndex];

        const currentSelectedComponents: Array<Partial<Component>> = [
            { code : 'AS' },
            { code : 'BC1' },
            { code : 'T11' },
            { code : 'T30' },
            { code : 'T4' },
            { code : 'add-ruffle-arm-bands' },
            { code : 'add-ruffle-to-front-neckline' },
            { code : 'magenta' },
            { code : 'make-petti-length' },
            { code : 'mini' },
            { code : 'raise-back' },
            { code : 'WB2' },
        ];

        const outcome = getSelectedComponents({
            groups: product.groups! as Group[],
            currentSelectedGroup,
            currentSelectedSectionGroup,
            currentSelectedComponents: currentSelectedComponents as Component[],
        });

        const expected: Array<Partial<Component>> = [
            { code: 'BC1' },
            { code: 'add-ruffle-arm-bands' },
            { code: 'add-ruffle-to-front-neckline' },
            { code: 'magenta' },
            { code: 'make-petti-length' },
            { code: 'raise-back' },
        ];

        expect(outcome.sort(sortByCode)).toMatchObject((expected as Component[]).sort(sortByCode));
    });
});

describe('Bridesmaids Default Components', () => {
    const componentsList: Array<DeepPartial<Component>> = [
        // Base Top
        {
            code: 'strappy',
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
            componentTypeId: 'length',
        },
        {
            code: 'L2',
            title: 'Mini',
            incompatibleWith: {},
            componentTypeId: 'length',
        },

        // Fronts
        { code: 'front1', incompatibleWith: {}, componentTypeId: 'front', },
        { code: 'front2', incompatibleWith: {}, componentTypeId: 'front', },
        { code: 'front3', incompatibleWith: {}, componentTypeId: 'front', },
        { code: 'front4', incompatibleWith: { strappy: [ ['back1'] ] }, componentTypeId: 'front', },

        // Backs
        { code: 'back1', incompatibleWith: {}, componentTypeId: 'back', },
        { code: 'back2', incompatibleWith: {}, componentTypeId: 'back', },
        { code: 'back3', incompatibleWith: {}, componentTypeId: 'back', },
        { code: 'back4', incompatibleWith: {}, componentTypeId: 'back', },

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
        { code: 'strap1', incompatibleWith: {}, componentTypeId: 'straps and sleeves', },
        { code: 'strap2', incompatibleWith: {}, componentTypeId: 'straps and sleeves', },
        { code: 'strap3', incompatibleWith: {}, componentTypeId: 'straps and sleeves', },

        // Extras
        { code: 'extra1', incompatibleWith: {}, componentTypeId: 'extras', },
        { code: 'extra2', incompatibleWith: {}, componentTypeId: 'extras', },
    ];

    const groups: Array<DeepPartial<Group>> = [
        {
            title: 'Customisations',
            sectionGroups: [
                {
                    sections: [
                        {
                            componentTypeId: 'front',
                            componentTypeCategory: ComponentType.Customization,
                            selectionType: SelectionType.RequiredOne,
                            options: [
                                {
                                    code: 'front1',
                                    isDefault: true,
                                    parentOptionId: 'strappy',
                                },
                                {
                                    code: 'front2',
                                    isDefault: true,
                                    parentOptionId: 'triCup',
                                },
                                {
                                    code: 'front3',
                                    isDefault: true,
                                    parentOptionId: 'draped',
                                },
                                {
                                    code: 'front4',
                                    isDefault: false,
                                    parentOptionId: 'strappy',
                                },
                            ],
                        },
                        {
                            componentTypeId: 'back',
                            componentTypeCategory: ComponentType.Customization,
                            selectionType: SelectionType.RequiredOne,
                            options: [
                                {
                                    code: 'back1',
                                    isDefault: true,
                                    parentOptionId: 'strappy',
                                },
                                {
                                    code: 'back2',
                                    isDefault: true,
                                    parentOptionId: 'triCup',
                                },
                                {
                                    code: 'back3',
                                    isDefault: true,
                                    parentOptionId: 'draped',
                                },
                                {
                                    code: 'back4',
                                    isDefault: false,
                                    parentOptionId: 'strappy',
                                }
                            ],
                        },
                        {
                            componentTypeId: 'waistband',
                            componentTypeCategory: ComponentType.Customization,
                            selectionType: SelectionType.RequiredOne,
                            options: [
                                {
                                    code: 'WB1',
                                    isDefault: true,
                                    parentOptionId: 'strappy',
                                },
                                {
                                    code: 'WB2',
                                    parentOptionId: 'strappy',
                                },
                                {
                                    code: 'WB1',
                                    parentOptionId: 'triCup',
                                },
                                {
                                    code: 'WB2',
                                    isDefault: true,
                                    parentOptionId: 'triCup',
                                },
                                {
                                    code: 'WB1',
                                    isDefault: true,
                                    parentOptionId: 'draped',
                                },
                                {
                                    code: 'WB2',
                                    parentOptionId: 'draped',
                                },
                            ],
                        },
                    ]
                },
                {
                    sections: [
                        {
                            componentTypeId: 'straps and sleeves',
                            selectionType: SelectionType.RequiredOne,
                            options: [
                                {
                                    code: 'strap1',
                                    isDefault: true,
                                    parentOptionId: 'strappy',
                                },
                                {
                                    code: 'strap2',
                                    parentOptionId: 'triCup',
                                },
                                {
                                    code: 'strap3',
                                    parentOptionId: 'draped',
                                }
                            ]
                        },
                    ]
                },
                {
                    sections: {
                        componentTypeId: 'extras',
                        options: [
                            {
                                code: 'extra1',
                                parentOptionId: 'strappy',
                            },
                            {
                                code: 'extra2',
                                parentOptionId: 'draped',
                            },
                        ]
                    }
                }
            ]
        },
        {
            title: 'Silhouette',
            sectionGroups: [
                {
                    sections: [
                        {
                            componentTypeId: 'top',
                            selectionType: SelectionType.RequiredOne,
                            options: [
                                {
                                    code: 'strapless',
                                    parentOptionId: null,
                                },
                                {
                                    code: 'strappy',
                                    parentOptionId: null,
                                },
                                {
                                    code: 'classic',
                                    parentOptionId: null,
                                },
                                {
                                    code: 'relaxed',
                                    parentOptionId: null,
                                },
                                {
                                    code: 'oneShoulder',
                                    parentOptionId: null,
                                },
                                {
                                    code: 'triCup',
                                    parentOptionId: null,
                                },
                                {
                                    code: 'draped',
                                    parentOptionId: null,
                                },
                            ],
                        },
                    ],
                },
                {
                    sections: [
                        {
                            componentTypeId: 'base bottom',
                            selectionType: SelectionType.RequiredOne,
                            options: [
                                {
                                    code: 'B3',
                                    parentOptionId: null,
                                },
                                {
                                    code: 'B4',
                                    parentOptionId: null,
                                },
                                {
                                    code: 'B5',
                                    parentOptionId: null,
                                },
                            ]
                        }
                    ]
                },
                {
                    sections: [
                        {
                            componentTypeId: 'length',
                            selectionType: SelectionType.RequiredOne,
                            options: [
                                {
                                    code: 'L1',
                                    parentOptionId: null,
                                },
                                {
                                    code: 'L2',
                                    parentOptionId: null,
                                }
                            ]
                        }
                    ]
                }
            ],
        },
    ];

    const product: DeepPartial<Product> = {
        groups,
        components: componentsList,
    };

    test('Select: [strappy]. Auto Select defaults: [front1, back1, WB1, strap1, B3, L2]', () => {
        const outcome = getDefaultSelectedComponents(
            product as Product,
            [componentsList.find((x) => x.code === 'strappy')! as Component],
            componentsList.find((x) => x.code === 'strappy')! as Component
        );

        const expected = [
            componentsList.find((x) => x.code === 'strappy')!,
            componentsList.find((x) => x.code === 'front1'),
            componentsList.find((x) => x.code === 'back1'),
            componentsList.find((x) => x.code === 'WB1'),
            componentsList.find((x) => x.code === 'strap1'),
            componentsList.find((x) => x.code === 'B3'),
            componentsList.find((x) => x.code === 'L2'), // L1 incompatible with B3
        ] as Component[];

        expect(outcome.sort(sortByCode)).toMatchObject(expected.sort(sortByCode));
    });

    test('Select: [triCup]. Auto Select defaults: [front2, back2, WB2, strap2, B3, L2]', () => {
        const outcome = getDefaultSelectedComponents(
            product as Product,
            [componentsList.find((x) => x.code === 'triCup')! as Component],
            componentsList.find((x) => x.code === 'triCup')! as Component
        );

        const expected = [
            componentsList.find((x) => x.code === 'triCup')! as Component,
            componentsList.find((x) => x.code === 'front2'),
            componentsList.find((x) => x.code === 'back2'),
            componentsList.find((x) => x.code === 'WB2'),
            componentsList.find((x) => x.code === 'strap2'),
            componentsList.find((x) => x.code === 'B3'),
            componentsList.find((x) => x.code === 'L2'), // L1 incompatible with B3
        ] as Component[];

        expect(outcome.sort(sortByCode)).toMatchObject(expected.sort(sortByCode));
    });

    test('Select: [draped]. Auto Select defaults: [front3, back3, WB1, strap3, B3, L2]', () => {
        const outcome = getDefaultSelectedComponents(
            product as Product,
            [componentsList.find((x) => x.code === 'draped')! as Component],
            componentsList.find((x) => x.code === 'draped')! as Component
        );

        const expected = [
            componentsList.find((x) => x.code === 'draped')! as Component,
            componentsList.find((x) => x.code === 'front3'),
            componentsList.find((x) => x.code === 'back3'),
            componentsList.find((x) => x.code === 'WB1'),
            componentsList.find((x) => x.code === 'strap3'),
            componentsList.find((x) => x.code === 'B3'),
            componentsList.find((x) => x.code === 'L2'), // L1 incompatible with B3
        ] as Component[];

        expect(outcome.sort(sortByCode)).toMatchObject(expected.sort(sortByCode));
    });

    test('Select: [strappy, front4]. Auto Select defaults: [back4, WB1, strap1, B3, L2]', () => {
        const outcome = getDefaultSelectedComponents(
            product as Product,
            [
                componentsList.find((x) => x.code === 'strappy')! as Component,
                componentsList.find((x) => x.code === 'front4')! as Component,
            ],
            componentsList.find((x) => x.code === 'strappy')! as Component
        );
        const expected = [
            componentsList.find((x) => x.code === 'strappy')! as Component,
            componentsList.find((x) => x.code === 'front4')! as Component,
            componentsList.find((x) => x.code === 'back4'),
            componentsList.find((x) => x.code === 'WB1'),
            componentsList.find((x) => x.code === 'strap1'),
            componentsList.find((x) => x.code === 'B3'),
            componentsList.find((x) => x.code === 'L2'), // L1 incompatible with B3
        ] as Component[];

        expect(outcome.sort(sortByCode)).toMatchObject(expected.sort(sortByCode));
    });

    test('Select: [], auto select: [strappy, front1, back1, WB1, strap1, B3, L2]', () => {
        const outcome = getDefaultSelectedComponents(
            product as Product,
            [],
            componentsList.find((x) => x.code === 'strappy')! as Component
        );
        const expected = [
            componentsList.find((x) => x.code === 'strappy')!,
            componentsList.find((x) => x.code === 'front1'),
            componentsList.find((x) => x.code === 'back1'),
            componentsList.find((x) => x.code === 'WB1'),
            componentsList.find((x) => x.code === 'strap1'),
            componentsList.find((x) => x.code === 'B3'),
            componentsList.find((x) => x.code === 'L2'), // L1 incompatible with B3
        ] as Component[];

        expect(outcome.sort(sortByCode)).toMatchObject(expected.sort(sortByCode));
    });
});

describe('Bridesmaids Incompatibilities', () => {
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
            componentTypeId: 'length',
            title: 'Micro Mini',
            incompatibleWith: { allOptions: [['B3'], ['B4']] },
        },
        {
            code: 'L2',
            componentTypeId: 'length',
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
        {
            code: 'dual1',
            componentTypeId: 'front',
            incompatibleWith: {},
        },
        {
            code: 'T86',
            componentTypeId: 'front',
            incompatibleWith: {},
        },
        {
            code: 'T96',
            componentTypeId: 'front',
            incompatibleWith: {},
        },
        {
            code: 'classicFront',
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
        {
            code: 'dual2',
            title: 'Dual 2',
            componentTypeId: 'back',
            incompatibleWith: { strappy: [ ['L2', 'dual1'] ] }
        },
        {
            code: 'classicBack',
            title: 'Zero Selected Back',
            componentTypeId: 'back',
            incompatibleWith: { classic: [ ['T22C'] ] },
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
        {
            code: 'WB1C',
            title: 'Standard Waistband',
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
        {
            code: 'T0',
            title: 'No sleeves',
            componentTypeId: 'strapsAndSleeves',
            incompatibleWith: {
                strappy: [ ['T15', 'T96'] ],
            },
        },
        {
            code: 'T22C',
            title: 'Rouleu Straps',
            componentTypeId: 'strapsAndSleeves',
            incompatibleWith: {},
        },
        {
            code: 'T71C',
            title: 'Narrow Adjustable Straps',
            componentTypeId: 'strapsAndSleeves',
            incompatibleWith: {},
        },

        // Extras
        {
            code: 'A4',
            title: 'Add side pocket',
            componentTypeId: 'extra',
            incompatibleWith: { allOptions: [['B5']] },
        },
        {
            code: 'B16',
            title: 'Split at Front Princess Seam',
            componentTypeId: 'extra',
            incompatibleWith: { allOptions: [['L1'], ['L2']] },
        },
        {
            code: 'classicExtra',
            componentTypeId: 'extra',
            incompatibleWith: {},
        },
    ];

    const groups: Array<DeepPartial<Group>> = [
        {
            title: 'Customisations',
            sectionGroups: [
                {
                    sections: [
                        {
                            selectionType: SelectionType.RequiredOne,
                            componentTypeId: 'front',
                            componentTypeCategory: ComponentType.Customization,
                            options: [
                                {
                                    code: 'T2',
                                    parentOptionId: 'strappy',
                                },
                                {
                                    code: 'classicFront',
                                    parentOptionId: 'classic',
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
                                    code: 'dual1',
                                    parentOptionId: 'strappy',
                                },
                                {
                                    code: 'T86',
                                    parentOptionId: 'strappy',
                                },
                                {
                                    code: 'T96',
                                    parentOptionId: 'strappy',
                                },
                                {
                                    code: 'T44',
                                    parentOptionId: 'relaxed',
                                },
                            ],
                        },
                        {
                            selectionType: SelectionType.RequiredOne,
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
                                {
                                    code: 'dual2',
                                    parentOptionId: 'strappy',
                                },
                                {
                                    code: 'classicBack',
                                    parentOptionId: 'classic',
                                },
                            ],
                        },
                        {
                            selectionType: SelectionType.RequiredOne,
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
                                {
                                    code: 'WB1C',
                                    parentOptionId: 'classic',
                                },
                            ],
                        },
                    ]
                },
                {
                    sections: [
                        {
                            selectionType: SelectionType.RequiredOne,
                            componentTypeId: 'strapsAndSleeves',
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
                                {
                                    code: 'T0',
                                    isDefault: false,
                                    parentOptionId: 'strappy',
                                },
                                {
                                    code: 'T22C',
                                    isDefault: false,
                                    parentOptionId: 'classic'
                                },
                                {
                                    code: 'T71C',
                                    isDefault: false,
                                    parentOptionId: 'classic'
                                },
                            ]
                        },
                    ]
                },
                {
                    sections: {
                        componentTypeId: 'extra',
                        options: [
                            {
                                code: 'A4',
                                isDefault: false,
                                parentOptionId: null,
                            },
                            {
                                code: 'B16',
                                isDefault: false,
                                parentOptionId: null,
                            },
                            {
                                code: 'classicExtra',
                                isDefault: false,
                                parentOptionId: 'classic'
                            }
                        ]
                    }
                }
            ]
        },
        {
            title: 'Silhouette',
            sectionGroups: [
                {
                    sections: [
                        {
                            selectionType: SelectionType.RequiredOne,
                            componentTypeId: 'top',
                            options: [
                                {
                                    code: 'strapless',
                                    parentOptionId: null,
                                },
                                {
                                    code: 'strappy',
                                    parentOptionId: null,
                                },
                                {
                                    code: 'classic',
                                    parentOptionId: null,
                                },
                                {
                                    code: 'relaxed',
                                    parentOptionId: null,
                                },
                                {
                                    code: 'oneShoulder',
                                    parentOptionId: null,
                                },
                                {
                                    code: 'triCup',
                                    parentOptionId: null,
                                },
                                {
                                    code: 'draped',
                                    parentOptionId: null,
                                },
                            ],
                        },
                    ],
                },
                {
                    sections: [
                        {
                            selectionType: SelectionType.RequiredOne,
                            componentTypeId: 'base bottom',
                            options: [
                                {
                                    code: 'B3',
                                    parentOptionId: null,
                                },
                                {
                                    code: 'B4',
                                    parentOptionId: null,
                                },
                                {
                                    code: 'B5',
                                    parentOptionId: null,
                                },
                            ]
                        }
                    ]
                },
                {
                    sections: [
                        {
                            selectionType: SelectionType.RequiredOne,
                            componentTypeId: 'length',
                            options: [
                                {
                                    code: 'L1',
                                    parentOptionId: null,
                                },
                                {
                                    code: 'L2',
                                    parentOptionId: null,
                                }
                            ]
                        }
                    ]
                }
            ],
        },
    ];

    const product: DeepPartial<Product> = {
        groups,
        components: componentsList,
    };

    const strappyComponentCodes = ['T2', 'T3', 'T4', 'T6', 'T76', 'T60', 'T15', 'T90', 'T91', 'T92', 'WB1', 'WB2', 'T22', 'T25', 'T26', 'T30', 'T33', 'T34', 'T52', 'T68', 'T71', 'T85', 'dual1', 'dual2', 'T86', 'T96', 'T0'];
    const relaxedComponentCodes = ['T44'];
    const classicComponentCodes = ['classicExtra', 'classicFront', 'classicBack', 'T22C', 'T71C', 'WB1C'];

    test('correctly removes: [T26, T34, T68, T91, T15] based on selection: [strappy, T2, T92, WB1, T52]', () => {
        const selectedComponents: Array<DeepPartial<Component>> = [
            componentsList.find((x) => x.code === 'strappy')!,
            componentsList.find((x) => x.code === 'T2')!,
            componentsList.find((x) => x.code === 'T92')!,
            componentsList.find((x) => x.code === 'WB1')!,
            componentsList.find((x) => x.code === 'T52')!,
        ];

        const outcome = getVisibleComponents(product as Product, selectedComponents as Component[]);

        // T26: incompatible T92,
        // T34: incompatible T2 & T92,
        // T68: T2 & T92,
        // T52: T91, T15
        const exclude = [...relaxedComponentCodes, ...classicComponentCodes, 'T26', 'T34', 'T68', 'T91', 'T15'];

        const expected: Component[] = componentsList.filter((x) => {
            return !exclude.includes(x.code! as string);
        }) as Component[];

        expect(outcome.sort(sortByCode)).toMatchObject(expected.sort(sortByCode));
    });

    test('correctly removes: [T34, T52, T68] based on selection: [strappy, T2, T15, WB1, T91]', () => {
        const selectedComponents: Array<DeepPartial<Component>> = [
            componentsList.find((x) => x.code === 'strappy')!,
            componentsList.find((x) => x.code === 'T2')!,
            componentsList.find((x) => x.code === 'T15')!,
            componentsList.find((x) => x.code === 'WB1')!,
            componentsList.find((x) => x.code === 'T91')!,
        ];

        const outcome = getVisibleComponents(product as Product, selectedComponents as Component[]);

        // T34: incompatible T91, T52: incompatible T91 & T68: incompatible: T91, T44: strappy
        const exclude = [...relaxedComponentCodes, ...classicComponentCodes, 'T34', 'T52', 'T68', 'T44'];

        const expected: Component[] = componentsList.filter((x) => {
            return !exclude.includes(x.code! as string);
        }) as Component[];

        expect(outcome.sort(sortByCode)).toMatchObject(expected.sort(sortByCode));
    });

    test('correctly removes: [A4, B16, B3, B44] based on selection: [strappy, B5, L1]', () => {
        const selectedComponents: Array<DeepPartial<Component>> = [
            componentsList.find((x) => x.code === 'strappy')!,
            componentsList.find((x) => x.code === 'B5')!,
            componentsList.find((x) => x.code === 'L1')!,
        ];

        const outcome = getVisibleComponents(product as Product, selectedComponents as Component[]);

        // A4 - B5,
        // B16 - L1,
        // B3 - L1,
        // B4 - L1 are ignored because they occur prior to the L1 selection and we want to be able to choose them again to switch
        const exclude = [...relaxedComponentCodes, ...classicComponentCodes, 'A4', 'B16', 'B3', 'B4'];

        const expected: Component[] = componentsList.filter((x) => {
            return !exclude.includes(x.code! as string);
        }) as Component[];

        expect(outcome.sort(sortByCode)).toMatchObject(expected.sort(sortByCode));
    });

    test('correctly removes: [B16, L1] based on selection: [strappy, B3, L2]', () => {
        const selectedComponents: Array<DeepPartial<Component>> = [
            componentsList.find((x) => x.code === 'strappy')!,
            componentsList.find((x) => x.code === 'B3')!,
            componentsList.find((x) => x.code === 'L2')!,
        ];

        const outcome = getVisibleComponents(product as Product, selectedComponents as Component[]);

        // B16 - L2, L1 - B3, T44 - strappy
        const exclude = [...relaxedComponentCodes, ...classicComponentCodes, 'B16', 'L1', 'T44'];

        const expected: Component[] = componentsList.filter((x) => {
            return !exclude.includes(x.code! as string);
        }) as Component[];

        expect(outcome.sort(sortByCode)).toMatchObject(expected.sort(sortByCode));
    });

    test('correctly removes: [L1, T44] based on selection: [strappy, B3]', () => {
        const selectedComponents: Array<DeepPartial<Component>> = [
            componentsList.find((x) => x.code === 'strappy')!,
            componentsList.find((x) => x.code === 'B3')!,
        ];

        const outcome = getVisibleComponents(product as Product, selectedComponents as Component[]);

        // L1 - B3
        const exclude = [...relaxedComponentCodes, ...classicComponentCodes, 'L1', 'T44'];

        const expected: Component[] = componentsList.filter((x) => {
            return !exclude.includes(x.code! as string);
        }) as Component[];

        expect(outcome.sort(sortByCode)).toMatchObject(expected.sort(sortByCode));
    });

    test('correctly removes: [B16, L1, T44] based on selection: [strappy, B3, L2]', () => {
        const selectedComponents: Array<DeepPartial<Component>> = [
            componentsList.find((x) => x.code === 'strappy')!,
            componentsList.find((x) => x.code === 'B3')!,
            componentsList.find((x) => x.code === 'L2')!,
        ];

        const outcome = getVisibleComponents(product as Product, selectedComponents as Component[]);

        // B16 - L2, L1 - B3
        const exclude = [...relaxedComponentCodes, ...classicComponentCodes, 'L1', 'B16', 'T44'];

        const expected: Component[] = componentsList.filter((x) => {
            return !exclude.includes(x.code! as string);
        }) as Component[];

        expect(outcome.sort(sortByCode)).toMatchObject(expected.sort(sortByCode));
    });

    test('correctly selects: [strappy, L2, B5, T15, T2, T22, WB1] based on selection: [strappy, B3, L2, B5]', () => {
        const selectedComponents: Array<DeepPartial<Component>> = [
            componentsList.find((x) => x.code === 'strappy')!,
            componentsList.find((x) => x.code === 'B3')!,
            componentsList.find((x) => x.code === 'L2')!,
        ];

        const outcome = getRelevantComponents({
            product: product as Product,
            selectedComponents: selectedComponents as Component[],
            additionalComponent: componentsList.find((x) => x.code === 'B5')! as Component,
            defaultParent: componentsList.find((x) => x.code === 'strappy')! as Component,
        });

        const expected: Component[] = [
            componentsList.find((x) => x.code === 'strappy')!,
            // componentsList.find((x) => x.code === 'B5')!, // B5 not part of relevant as it was not a 'selected' component.
            componentsList.find((x) => x.code === 'L2')!,
            componentsList.find((x) => x.code === 'T15')!,
            componentsList.find((x) => x.code === 'T2')!,
            componentsList.find((x) => x.code === 'T22')!,
            componentsList.find((x) => x.code === 'WB1')!,
        ] as Component[];

        expect(outcome.sort(sortByCode)).toMatchObject(expected.sort(sortByCode));
    });

    describe('multiple incompatibilities', () => {
        test('correctly removes: [B3, B4, A4, B16] based on selection: [strappy, B5, L1, dual1]', () => {
            const selectedComponents: Array<DeepPartial<Component>> = [
                componentsList.find((x) => x.code === 'strappy')!,
                componentsList.find((x) => x.code === 'B5')!,
                componentsList.find((x) => x.code === 'L1')!,
                componentsList.find((x) => x.code === 'dual1')!,
            ];

            const outcome = getVisibleComponents(product as Product, selectedComponents as Component[]);

            // L1: B3~B4~B16, dual2: L2~dual1, B5: A4
            const exclude = [...relaxedComponentCodes, ...classicComponentCodes, 'B3', 'B4', 'A4', 'B16'];

            const expected: Component[] = componentsList.filter((x) => {
                return !exclude.includes(x.code! as string);
            }) as Component[];

            expect(outcome.sort(sortByCode)).toMatchObject(expected.sort(sortByCode));
        });

        test('correctly removes: [B16, A4, dual2] based on selection: [strappy, B5, L2, dual1]', () => {
            const selectedComponents: Array<DeepPartial<Component>> = [
                componentsList.find((x) => x.code === 'strappy')!,
                componentsList.find((x) => x.code === 'B5')!,
                componentsList.find((x) => x.code === 'L2')!,
                componentsList.find((x) => x.code === 'dual1')!,
            ];

            const outcome = getVisibleComponents(product as Product, selectedComponents as Component[]);

            // dual2: [[dual1, L2]], L2: [B16], B3: [L1], B5: A4
            const exclude = [...relaxedComponentCodes, ...classicComponentCodes, 'B16', 'A4', 'dual2'];

            const expected: Component[] = componentsList.filter((x) => {
                return !exclude.includes(x.code! as string);
            }) as Component[];

            expect(outcome.sort(sortByCode)).toMatchObject(expected.sort(sortByCode));
        });

        test('correctly applies default selections: [B3, L2, T2, T15, WB1, T22] for selection [strappy]. Missing: [front, back, waistband, strapsAndSleeves, bottom, length]', () => {
            const selectedComponents: Array<DeepPartial<Component>> = [
                componentsList.find((x) => x.code === 'strappy')!,
            ];

            const outcome = getDefaultSelectedComponents(
                product as Product,
                selectedComponents as Component[],
                componentsList.find((x) => x.code === 'strappy')! as Component,
            );

            // Since we don't have defaults, all the firsts ones will be selected
            const expected: Component[] = [
                componentsList.find((x) => x.code === 'strappy')! as Component,
                componentsList.find((x) => x.code === 'B3')!,
                componentsList.find((x) => x.code === 'L2')!,
                componentsList.find((x) => x.code === 'T2')!,
                componentsList.find((x) => x.code === 'T15')!,
                componentsList.find((x) => x.code === 'T22')!,
                componentsList.find((x) => x.code === 'WB1')!,
            ] as Component[];

            expect(outcome.sort(sortByCode)).toMatchObject(expected.sort(sortByCode));
        });

        test('correctly applies default selections: [B3, L2, T2, WB1, T22] for selection [strappy, dual2]. Missing: [front, waistband, strapsAndSleeves, bottom, length]', () => {
            const selectedComponents: Array<DeepPartial<Component>> = [
                componentsList.find((x) => x.code === 'strappy')!,
                componentsList.find((x) => x.code === 'dual2')!,
            ];

            const outcome = getDefaultSelectedComponents(
                product as Product,
                selectedComponents as Component[],
                componentsList.find((x) => x.code === 'strappy')! as Component,
            );

            // Since we don't have defaults, all the firsts ones will be selected
            const expected: Component[] = [
                componentsList.find((x) => x.code === 'strappy')!,
                componentsList.find((x) => x.code === 'dual2')!,
                componentsList.find((x) => x.code === 'B3')!,
                componentsList.find((x) => x.code === 'L2')!,
                componentsList.find((x) => x.code === 'T2')!,
                componentsList.find((x) => x.code === 'T22')!,
                componentsList.find((x) => x.code === 'WB1')!,
            ] as Component[];

            expect(outcome.sort(sortByCode)).toMatchObject(expected.sort(sortByCode));
        });

        test ('correctly removes [T0, T86] from selection and replaces it with [T22, T96]. Default selection: [strappy, T86, T15, T0] -> Select T96', () => {
            const selectedComponents: Array<DeepPartial<Component>> = [
                componentsList.find((x) => x.code === 'strappy')!,
                componentsList.find((x) => x.code === 'T86')!,
                componentsList.find((x) => x.code === 'T15')!,
                componentsList.find((x) => x.code === 'T0')!,
            ];

            const outcomeAudited = auditSelectionType(
                (product as Product).groups[0].sectionGroups[0].sections[0] as Section,
                componentsList.find((x) => x.code === 'T96')! as Component,
                selectedComponents as Component[],
                null!!,
                false
            ) as Component[];

            const expectedAudited: Array<DeepPartial<Component>> = [
                componentsList.find((x) => x.code === 'strappy')!,
                componentsList.find((x) => x.code === 'T96')!,
                componentsList.find((x) => x.code === 'T15')!,
                componentsList.find((x) => x.code === 'T0')!,
            ] as Component[];

            expect(outcomeAudited.sort(sortByCode)).toMatchObject((expectedAudited as Component[]).sort(sortByCode));

            const outcome = getRelevantComponents({
                product: product as Product,
                selectedComponents: outcomeAudited as Component[],
                additionalComponent: componentsList.find((x) => x.code === 'T96')! as Component,
                defaultParent: componentsList.find((x) => x.code === 'strappy')! as Component
            });

            const expected: Component[] = [
                componentsList.find((x) => x.code === 'strappy')!,
                componentsList.find((x) => x.code === 'B3')!,
                componentsList.find((x) => x.code === 'L2')!,
                componentsList.find((x) => x.code === 'T96')!,
                componentsList.find((x) => x.code === 'T15')!,
                componentsList.find((x) => x.code === 'T22')!,
                componentsList.find((x) => x.code === 'WB1')!,
            ] as Component[];

            expect(outcome.sort(sortByCode)).toMatchObject(expected.sort(sortByCode));
        });

        test('correctly removes [T22] from selection and replaces it with [T71]. Default selection: [classic, T22C, classicBack, classicFront]. (Remove a selected component when a required section has 0 choices)', () => {
            const selectedComponents: Array<DeepPartial<Component>> = [
                componentsList.find((x) => x.code === 'classic')!,
                componentsList.find((x) => x.code === 'classicFront')!,
                componentsList.find((x) => x.code === 'T22C')!,
            ];

            const outcome = getDefaultSelectedComponents(
                product as Product,
                selectedComponents as Component[],
                componentsList.find((x) => x.code === 'classic')! as Component,
            );

            // Since we don't have defaults, all the firsts ones will be selected
            const expected: Component[] = [
                componentsList.find((x) => x.code === 'classic')!,
                componentsList.find((x) => x.code === 'B3')!,
                componentsList.find((x) => x.code === 'L2')!,
                componentsList.find((x) => x.code === 'classicFront')!,
                componentsList.find((x) => x.code === 'classicBack')!,
                componentsList.find((x) => x.code === 'T71C')!,
                componentsList.find((x) => x.code === 'WB1C')!,
            ] as Component[];

            expect(outcome.sort(sortByCode)).toMatchObject(expected.sort(sortByCode));
        });
    });

    describe('correctly shows the same component: [T60] for different options: [classic, relaxed, strappy, strapless]', () => {
        test('selected: [classic]', () => {
            const selectedComponents: Array<DeepPartial<Component>> = [
                componentsList.find((x) => x.code === 'classic')!,
            ];

            const outcome = getVisibleComponents(product as Product, selectedComponents as Component[]);
            const exclude = [...strappyComponentCodes, ...relaxedComponentCodes];

            const expected: Component[] = componentsList.filter((x) => {
                return !exclude.includes(x.code! as string);
            }) as Component[];

            expect(outcome.sort(sortByCode)).toMatchObject(expected.sort(sortByCode));
        });

        test('selected: [classic, T15]', () => {
            const selectedComponents: Array<DeepPartial<Component>> = [
                componentsList.find((x) => x.code === 'classic')!,
                componentsList.find((x) => x.code === 'T15')!,
            ];

            const outcome = getVisibleComponents(product as Product, selectedComponents as Component[]);

            const exclude = [...strappyComponentCodes, ...relaxedComponentCodes];

            const expected: Component[] = componentsList.filter((x) => {
                return !exclude.includes(x.code! as string);
            }) as Component[];

            expect(outcome.sort(sortByCode)).toMatchObject(expected.sort(sortByCode));
        });

        test('selected: [relaxed]', () => {
            const selectedComponents: Array<DeepPartial<Component>> = [
                componentsList.find((x) => x.code === 'relaxed')!,
            ];

            const outcome = getVisibleComponents(product as Product, selectedComponents as Component[]);

            const exclude = [...strappyComponentCodes, ...classicComponentCodes];

            const expected: Component[] = componentsList.filter((x) => {
                return !exclude.includes(x.code! as string);
            }) as Component[];

            expect(outcome.sort(sortByCode)).toMatchObject(expected.sort(sortByCode));
        });

        test('selected: [relaxed, T44]', () => {
            const selectedComponents: Array<DeepPartial<Component>> = [
                componentsList.find((x) => x.code === 'relaxed')!,
                componentsList.find((x) => x.code === 'T44')!,
            ];

            const outcome = getVisibleComponents(product as Product, selectedComponents as Component[]);

            const exclude = [...strappyComponentCodes, ...classicComponentCodes];

            const expected: Component[] = componentsList.filter((x) => {
                return !exclude.includes(x.code! as string);
            }) as Component[];

            expect(outcome.sort(sortByCode)).toMatchObject(expected.sort(sortByCode));
        });

        test('selected: [strappy]', () => {
            const selectedComponents: Array<DeepPartial<Component>> = [
                componentsList.find((x) => x.code === 'strappy')!,
            ];

            const outcome = getVisibleComponents(product as Product, selectedComponents as Component[]);

            const exclude = [...relaxedComponentCodes, ...classicComponentCodes, 'T44'];

            const expected: Component[] = componentsList.filter((x) => {
                return !exclude.includes(x.code! as string);
            }) as Component[];

            expect(outcome.sort(sortByCode)).toMatchObject(expected.sort(sortByCode));
        });

        test('selected: [strappy, T15]', () => {
            const selectedComponents: Array<DeepPartial<Component>> = [
                componentsList.find((x) => x.code === 'strappy')!,
                componentsList.find((x) => x.code === 'T15')!,
            ];

            const outcome = getVisibleComponents(product as Product, selectedComponents as Component[]);

            const exclude = [...relaxedComponentCodes, ...classicComponentCodes, 'T34', 'T52', 'T68', 'T44', 'T60'];

            const expected: Component[] = componentsList.filter((x) => {
                return !exclude.includes(x.code! as string);
            }) as Component[];

            expect(outcome.sort(sortByCode)).toMatchObject(expected.sort(sortByCode));
        });
    });
});
