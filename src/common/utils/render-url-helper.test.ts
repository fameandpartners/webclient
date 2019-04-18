import { getComponentImageUrlsForRender, formatRenderName, formatProductId } from '@common/utils/render-url-helper';
import { ImageSizeType } from '@common/utils/image-size-type';
import { ZoomType } from '@common/utils/zoom-type';
import { URL_COMPONENT_SEPARATOR } from '@common/utils/url-helper';
import { DeepPartial, CustomizedProduct, Component } from 'typings';
import { RenderPositionId } from '@common/utils/render-position-id';

describe('Naming Conventions', () => {
    test('correctly formats product id from customisations', () => {
        const prod: DeepPartial<CustomizedProduct> = {
            product: {
                productId: 'gp2'
            },
            components: [
                { code: 'st1'},
                { code: 'sd9' },
                { code: 'l3' },
                { code: 't0' },
                { code: 't22' },
                { code: 'b1' },
                { code: 'b13' },
                { code: 'w20' },
                { code: 't60' },
            ]
        };

        const productName = formatProductId(prod as CustomizedProduct);
        const custSep = URL_COMPONENT_SEPARATOR;
        expect(productName).toBe(`gp2${custSep}b1${custSep}b13${custSep}l3${custSep}sd9${custSep}st1${custSep}t0${custSep}t22${custSep}t60${custSep}w20`);
    });

    test('correctly formats render name from customisations', () => {
        const productId = 'gp2';
        const customizations = ['b1', 'b13', 'l3', 'sd9', 'st1', 't0', 't22', 't60', 'w20'];
        const renderPositionName = RenderPositionId.FrontNone;
        const size = ImageSizeType.Option4048;

        const custSep = URL_COMPONENT_SEPARATOR;
        const fileExt = '.png';
        const expected = `${productId}/${renderPositionName}/${size}/b1${custSep}b13${custSep}l3${custSep}sd9${custSep}st1${custSep}t0${custSep}t22${custSep}t60${custSep}w20${fileExt}`;
        const outcome = formatRenderName(productId, customizations, renderPositionName, size);

        expect(outcome).toBe(expected);
    });

    test('correctly returns the component image url for render: 1625/FrontTop/thumb/T60.jpg', () => {
        const zoom = ZoomType.None;

        const component: Partial<Component> = {
            code: 'T60',
            renderPositionId: RenderPositionId.FrontTop,
            optionRenderComponents: ['front', 'color', 'extras'],
            incompatibleWith: {}
        };

        const customizedProduct: DeepPartial<CustomizedProduct> = {
            components: [{
                code: 'black',
                renderPositionId: RenderPositionId.FrontTop,
                optionRenderComponents: ['front', 'color', 'extras'],
                incompatibleWith: {}
            }, {
                code: 'B11',
                renderPositionId: RenderPositionId.FrontTop,
                optionRenderComponents: ['front', 'color', 'extras'],
                incompatibleWith: {}
            }, {
                code: 'F11',
                renderPositionId: RenderPositionId.FrontTop,
                optionRenderComponents: ['back', 'color', 'extras'],
                incompatibleWith: {}
            }, {
                code: 'strappy',
                incompatibleWith: {}
            }],
            product: {
                productId: '1625',
                groups: [{
                    sectionGroups: [{
                        sections: [{
                            componentTypeId: 'color',
                            options: [{ code: 'black' }]
                        }]
                    }, {
                        sections: [{
                            componentTypeId: 'top',
                            options: [{ code: 'strappy' }],
                        }]
                    }, {
                        sections: [{
                            componentTypeId: 'extras',
                            options: [{ code: 'T58' }, { code: 'T60' }],
                        }]
                    }, {
                        sections: [{
                            componentTypeId: 'front',
                            options: [{ code: 'T1', parentOptionId: 'strappy' }]
                        }, {
                            componentTypeId: 'back',
                            options: [{ code: 'F11', parentOptionId: 'strappy' }]
                        }]
                    }],
                }],
                renderPositions: [{
                    id: RenderPositionId.FrontTop,
                    zoom,
                }],
            }
        };

        const expected = {
            options: [],
            sortOrder: 0,
            src: [
                {
                    fallbackUrl: 'https://9v2re8nkt4.execute-api.us-east-1.amazonaws.com/dev/ImagePreview/1625/FrontTop/352x352/T60.png',
                    height: 352,
                    url: 'https://s3.amazonaws.com/fame-product-renders-dev/1625/FrontTop/352x352/T60.png',
                    width: 352
                },
                {
                    fallbackUrl: 'https://9v2re8nkt4.execute-api.us-east-1.amazonaws.com/dev/ImagePreview/1625/FrontTop/528x528/T60.png',
                    height: 528,
                    url: 'https://s3.amazonaws.com/fame-product-renders-dev/1625/FrontTop/528x528/T60.png',
                    width: 528
                },
                {
                    fallbackUrl: 'https://9v2re8nkt4.execute-api.us-east-1.amazonaws.com/dev/ImagePreview/1625/FrontTop/704x704/T60.png',
                    height: 704,
                    url: 'https://s3.amazonaws.com/fame-product-renders-dev/1625/FrontTop/704x704/T60.png',
                    width: 704
                }
            ],
            type: 'photo'
        };

        const outcome = getComponentImageUrlsForRender(component as Component, customizedProduct as CustomizedProduct, [ImageSizeType.Option352, ImageSizeType.Option528, ImageSizeType.Option704]);

        expect(outcome).toMatchObject(expected);
    });
});
