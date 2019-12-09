import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import CustomizeInline from '@components/customization/CustomizeInline';
import { SiteVersion } from '@common/constants';
import { CustomizedProduct, Product } from 'typings/product';
import { PreviewType } from '@common/utils/preview-type';
import transform from '@common/transforms/productApiToProductModel';
import { createFameConfig } from '@common/../server/config';
import UserProvider from '@common/context/UserContext';
import configureStore from '@common/rematch';
import { Provider } from 'react-redux';

const fpgProductJSON = {
    id: 'FPG1001',
    productId: 'FPG1001',
    // productType: 'dress',
    // productVersionId: 313,
    cartId: 'FPG1001',
    previewType: PreviewType.Render,
    isAvailable: true,
    returnDescription: '',
    deliveryTimeDescription: '',
    // curations: null,
    price: 14900,
    paymentMethods: {
        afterPay: false
    },
    size: {
        minHeightCm: 147,
        maxHeightCm: 193,
        minHeightInch: 58,
        maxHeightInch: 76,
        sizeChart: ''
    },
    media: [],
    productRenderComponents: [
        'back',
        'base bottom',
        'color',
        'extra',
        'fabric',
        'front',
        'length',
        'straps and sleeves',
        'top',
        'waistband'
    ],
    renderPositions: [
        {
            renderPositionId: 'BackBottom',
            zoom: 'bottom',
            orientation: 'back'
        },
        {
            renderPositionId: 'BackMiddle',
            zoom: 'middle',
            orientation: 'back'
        },
        {
            renderPositionId: 'BackNone',
            zoom: 'none',
            orientation: 'back'
        },
        {
            renderPositionId: 'BackTop',
            zoom: 'top',
            orientation: 'back'
        },
        {
            renderPositionId: 'FrontBottom',
            zoom: 'bottom',
            orientation: 'front'
        },
        {
            renderPositionId: 'FrontMiddle',
            zoom: 'middle',
            orientation: 'front'
        },
        {
            renderPositionId: 'FrontNone',
            zoom: 'none',
            orientation: 'front'
        },
        {
            renderPositionId: 'FrontTop',
            zoom: 'top',
            orientation: 'front'
        }
    ],
    components: [
            {
                cartId: 'M3D',
                code: 'M3D',
                title: 'VIP Delivery',
                description: '3 - 5 days',
                componentTypeId: 'making',
                display_price: '$15.00',
                componentTypeCategory: 'Making',
                sortOrder: 900
            },
            {
              cartId: 'M2W',
              code: 'M2W',
              title: 'Standard Delivery',
              description: '2 - 3 weeks',
              componentTypeId: 'making',
              display_price: '$0.00',
              componentTypeCategory: 'Making',
              sortOrder: 910
          },
          {
            cartId: 'M5W',
            code: 'M5W',
            title: 'Not In A Rush',
            description: '5 - 6 weeks',
            componentTypeId: 'making',
            display_price: '10% OFF',
            componentTypeCategory: 'Making',
            sortOrder: 950
        },
        {
            cartId: 'C6',
            code: 'C6',
            title: 'Strapless',
            componentTypeId: 'top',
            price: 0,
            isProductCode: true,
            isRecommended: false,
            componentTypeCategory: 'Customization',
            incompatibleWith: {},
            optionRenderComponents: ['back', 'color', 'fabric', 'front', 'straps and sleeves', 'waistband'],
            renderPositionId: 'FrontTop',
            meta: {},
            sortOrder: 1115
        },
        {
            cartId: 'T00',
            code: 'T00',
            title: 'Standard sleeves',
            componentTypeId: 'straps and sleeves',
            price: 0,
            isProductCode: true,
            isRecommended: false,
            componentTypeCategory: 'Customization',
            incompatibleWith: {},
            optionRenderComponents: ['back', 'color', 'fabric', 'front', 'top', 'waistband'],
            renderPositionId: 'FrontTop',
            meta: {},
            sortOrder: 1430
        },
        {
            cartId: 'T72',
            code: 'T72',
            title: 'Short sleeves',
            componentTypeId: 'straps and sleeves',
            price: 0,
            isProductCode: true,
            isRecommended: false,
            componentTypeCategory: 'Customization',
            incompatibleWith: {},
            optionRenderComponents: ['back', 'color', 'fabric', 'front', 'top', 'waistband'],
            renderPositionId: 'FrontTop',
            meta: {},
            sortOrder: 1450
        },
        {
            cartId: 'T94',
            code: 'T94',
            title: 'Plunging v-neckline - no tie or cut-out',
            componentTypeId: 'front',
            price: 0,
            isProductCode: true,
            isRecommended: false,
            componentTypeCategory: 'Customization',
            incompatibleWith: {},
            optionRenderComponents: ['back', 'color', 'fabric', 'straps and sleeves', 'top', 'waistband'],
            renderPositionId: 'FrontTop',
            meta: {},
            sortOrder: 2040
        },
        {
            cartId: 'T44',
            code: 'T44',
            title: 'Relaxed tie-front neckline',
            componentTypeId: 'front',
            price: 2000,
            isProductCode: true,
            isRecommended: false,
            componentTypeCategory: 'Customization',
            incompatibleWith: {},
            optionRenderComponents: ['back', 'color', 'fabric', 'straps and sleeves', 'top', 'waistband'],
            renderPositionId: 'FrontTop',
            meta: {},
            sortOrder: 1850
        },
        {
            cartId: 'T99',
            code: 'T99',
            title: 'Long fitted sleeves',
            componentTypeId: 'straps and sleeves',
            price: 2000,
            isProductCode: true,
            isRecommended: false,
            componentTypeCategory: 'Customization',
            incompatibleWith: {},
            optionRenderComponents: ['back', 'color', 'fabric', 'front', 'top', 'waistband'],
            renderPositionId: 'FrontTop',
            meta: {},
            sortOrder: 1670
        },
        {
            cartId: 'T98',
            code: 'T98',
            title: 'Three-quarter fitted sleeves',
            componentTypeId: 'straps and sleeves',
            price: 2000,
            isProductCode: true,
            isRecommended: false,
            componentTypeCategory: 'Customization',
            incompatibleWith: {},
            optionRenderComponents: ['back', 'color', 'fabric', 'front', 'top', 'waistband'],
            renderPositionId: 'FrontTop',
            meta: {},
            sortOrder: 1660
        },
        {
            cartId: 'T101',
            code: 'T101',
            title: 'Voluminous panelled long sleeves',
            componentTypeId: 'straps and sleeves',
            price: 3000,
            isProductCode: true,
            isRecommended: false,
            componentTypeCategory: 'Customization',
            incompatibleWith: {},
            optionRenderComponents: ['back', 'color', 'fabric', 'front', 'top', 'waistband'],
            renderPositionId: 'FrontTop',
            meta: {},
            sortOrder: 1650
        },
        {
            cartId: 'T100',
            code: 'T100',
            title: 'High-volume long sleeves with cuffs',
            componentTypeId: 'straps and sleeves',
            price: 3000,
            isProductCode: true,
            isRecommended: false,
            componentTypeCategory: 'Customization',
            incompatibleWith: {},
            optionRenderComponents: ['back', 'color', 'fabric', 'front', 'top', 'waistband'],
            renderPositionId: 'FrontTop',
            meta: {},
            sortOrder: 1640
        },
        {
            cartId: 'T48',
            code: 'T48',
            title: 'Short voluminous sleeves',
            componentTypeId: 'straps and sleeves',
            price: 2000,
            isProductCode: true,
            isRecommended: false,
            componentTypeCategory: 'Customization',
            incompatibleWith: {},
            optionRenderComponents: ['back', 'color', 'fabric', 'front', 'top', 'waistband'],
            renderPositionId: 'FrontTop',
            meta: {},
            sortOrder: 1600
        },
        {
            cartId: 'T49',
            code: 'T49',
            title: 'Short ruffle sleeves',
            componentTypeId: 'straps and sleeves',
            price: 2000,
            isProductCode: true,
            isRecommended: false,
            componentTypeCategory: 'Customization',
            incompatibleWith: {},
            optionRenderComponents: ['back', 'color', 'fabric', 'front', 'top', 'waistband'],
            renderPositionId: 'FrontTop',
            meta: {},
            sortOrder: 1480
        },
        {
            cartId: 'T50',
            code: 'T50',
            title: 'Off-shoulder ruffle sleeves',
            componentTypeId: 'straps and sleeves',
            price: 2000,
            isProductCode: true,
            isRecommended: false,
            componentTypeCategory: 'Customization',
            incompatibleWith: {},
            optionRenderComponents: ['back', 'color', 'fabric', 'front', 'top', 'waistband'],
            renderPositionId: 'FrontTop',
            meta: {},
            sortOrder: 1470
        },
        {
            cartId: 'T38',
            code: 'T38',
            title: 'Cold shoulder long sleeves',
            componentTypeId: 'straps and sleeves',
            price: 2000,
            isProductCode: true,
            isRecommended: false,
            componentTypeCategory: 'Customization',
            incompatibleWith: {},
            optionRenderComponents: ['back', 'color', 'fabric', 'front', 'top', 'waistband'],
            renderPositionId: 'FrontTop',
            meta: {},
            sortOrder: 1570
        },
        {
            cartId: 'T46',
            code: 'T46',
            title: 'Long voluminous sleeves with cuffs',
            componentTypeId: 'straps and sleeves',
            price: 3000,
            isProductCode: true,
            isRecommended: false,
            componentTypeCategory: 'Customization',
            incompatibleWith: {},
            optionRenderComponents: ['back', 'color', 'fabric', 'front', 'top', 'waistband'],
            renderPositionId: 'FrontTop',
            meta: {},
            sortOrder: 1590
        },
        {
            cartId: 'T45',
            code: 'T45',
            title: 'Long flared sleeves',
            componentTypeId: 'straps and sleeves',
            price: 3000,
            isProductCode: true,
            isRecommended: false,
            componentTypeCategory: 'Customization',
            incompatibleWith: {},
            optionRenderComponents: ['back', 'color', 'fabric', 'front', 'top', 'waistband'],
            renderPositionId: 'FrontTop',
            meta: {},
            sortOrder: 1580
        },
        {
            cartId: 'T5',
            code: 'T5',
            title: 'One-shoulder neckline',
            componentTypeId: 'front',
            price: 0,
            isProductCode: true,
            isRecommended: false,
            componentTypeCategory: 'Customization',
            incompatibleWith: {},
            optionRenderComponents: ['back', 'color', 'fabric', 'straps and sleeves', 'top', 'waistband'],
            renderPositionId: 'FrontTop',
            meta: {},
            sortOrder: 1840
        },
        {
            cartId: 'T67',
            code: 'T67',
            title: 'Covered back',
            componentTypeId: 'back',
            price: 0,
            isProductCode: true,
            isRecommended: false,
            componentTypeCategory: 'Customization',
            incompatibleWith: {},
            optionRenderComponents: ['color', 'fabric', 'front', 'straps and sleeves', 'top', 'waistband'],
            renderPositionId: 'BackTop',
            meta: {},
            sortOrder: 110
        },
        {
            cartId: 'T11',
            code: 'T11',
            title: 'V-neckline',
            componentTypeId: 'front',
            price: 1000,
            isProductCode: true,
            isRecommended: false,
            componentTypeCategory: 'Customization',
            incompatibleWith: {},
            optionRenderComponents: ['back', 'color', 'fabric', 'straps and sleeves', 'top', 'waistband'],
            renderPositionId: 'FrontTop',
            meta: {},
            sortOrder: 1860
        },
        {
            cartId: 'T93',
            code: 'T93',
            title: 'Scoop neckline',
            componentTypeId: 'front',
            price: 1000,
            isProductCode: true,
            isRecommended: false,
            componentTypeCategory: 'Customization',
            incompatibleWith: {},
            optionRenderComponents: ['back', 'color', 'fabric', 'straps and sleeves', 'top', 'waistband'],
            renderPositionId: 'FrontTop',
            meta: {},
            sortOrder: 2030
        },
        {
            cartId: 'T86',
            code: 'T86',
            title: 'Classic round neckline',
            componentTypeId: 'front',
            price: 0,
            isProductCode: true,
            isRecommended: false,
            componentTypeCategory: 'Customization',
            incompatibleWith: {},
            optionRenderComponents: ['back', 'color', 'fabric', 'straps and sleeves', 'top', 'waistband'],
            renderPositionId: 'FrontTop',
            meta: {},
            sortOrder: 1800
        },
        {
            cartId: 'T58',
            code: 'T58',
            title: 'Back tie bow',
            componentTypeId: 'extra',
            price: 1000,
            isProductCode: true,
            isRecommended: false,
            componentTypeCategory: 'Customization',
            incompatibleWith: {
                C7: [['T91'], ['T15']]
            },
            optionRenderComponents: ['back', 'color', 'fabric', 'front', 'straps and sleeves', 'top', 'waistband'],
            renderPositionId: 'BackTop',
            meta: {},
            sortOrder: 610
        },
        {
            cartId: 'T25',
            code: 'T25',
            title: 'Wide cross-back straps',
            componentTypeId: 'straps and sleeves',
            price: 1000,
            isProductCode: true,
            isRecommended: false,
            componentTypeCategory: 'Customization',
            incompatibleWith: {
                C7: [['T90'], ['T92']]
            },
            optionRenderComponents: ['back', 'color', 'fabric', 'front', 'top', 'waistband'],
            renderPositionId: 'FrontTop',
            meta: {},
            sortOrder: 1440
        },
        {
            cartId: 'T85',
            code: 'T85',
            title: 'Narrow adjustable cross-back straps',
            componentTypeId: 'straps and sleeves',
            price: 1000,
            isProductCode: true,
            isRecommended: false,
            componentTypeCategory: 'Customization',
            incompatibleWith: {
                C7: [['T90'], ['T92']]
            },
            optionRenderComponents: ['back', 'color', 'fabric', 'front', 'top', 'waistband'],
            renderPositionId: 'FrontTop',
            meta: {},
            sortOrder: 1120
        },
        {
            cartId: 'T68',
            code: 'T68',
            title: 'Wide strap panels',
            componentTypeId: 'straps and sleeves',
            price: 1000,
            isProductCode: true,
            isRecommended: false,
            componentTypeCategory: 'Customization',
            incompatibleWith: {
                C7: [['T2'], ['T6'], ['T91'], ['T15'], ['T92']]
            },
            optionRenderComponents: ['back', 'color', 'fabric', 'front', 'top', 'waistband'],
            renderPositionId: 'FrontTop',
            meta: {},
            sortOrder: 1410
        },
        {
            cartId: 'T34',
            code: 'T34',
            title: 'Halter neckband',
            componentTypeId: 'straps and sleeves',
            price: 1000,
            isProductCode: true,
            isRecommended: false,
            componentTypeCategory: 'Customization',
            incompatibleWith: {
                C7: [['T2'], ['T6'], ['T91'], ['T15'], ['T92']]
            },
            optionRenderComponents: ['back', 'color', 'fabric', 'front', 'top', 'waistband'],
            renderPositionId: 'FrontTop',
            meta: {},
            sortOrder: 1560
        },
        {
            cartId: 'T33',
            code: 'T33',
            title: 'Wide tie straps',
            componentTypeId: 'straps and sleeves',
            price: 1000,
            isProductCode: true,
            isRecommended: false,
            componentTypeCategory: 'Customization',
            incompatibleWith: {},
            optionRenderComponents: ['back', 'color', 'fabric', 'front', 'top', 'waistband'],
            renderPositionId: 'FrontTop',
            meta: {},
            sortOrder: 1500
        },
        {
            cartId: 'T30',
            code: 'T30',
            title: 'Wide straps',
            componentTypeId: 'straps and sleeves',
            price: 1000,
            isProductCode: true,
            isRecommended: false,
            componentTypeCategory: 'Customization',
            incompatibleWith: {},
            optionRenderComponents: ['back', 'color', 'fabric', 'front', 'top', 'waistband'],
            renderPositionId: 'FrontTop',
            meta: {},
            sortOrder: 1540
        },
        {
            cartId: 'T71',
            code: 'T71',
            title: 'Narrow adjustable straps',
            componentTypeId: 'straps and sleeves',
            price: 0,
            isProductCode: true,
            isRecommended: false,
            componentTypeCategory: 'Customization',
            incompatibleWith: {},
            optionRenderComponents: ['back', 'color', 'fabric', 'front', 'top', 'waistband'],
            renderPositionId: 'FrontTop',
            meta: {},
            sortOrder: 1420
        },
        {
            cartId: 'T26',
            code: 'T26',
            title: 'Cross-back spaghetti straps',
            componentTypeId: 'straps and sleeves',
            price: 0,
            isProductCode: true,
            isRecommended: false,
            componentTypeCategory: 'Customization',
            incompatibleWith: {
                C7: [['T92']]
            },
            optionRenderComponents: ['back', 'color', 'fabric', 'front', 'top', 'waistband'],
            renderPositionId: 'FrontTop',
            meta: {},
            sortOrder: 1530
        },
        {
            cartId: 'T22',
            code: 'T22',
            title: 'Spaghetti straps',
            componentTypeId: 'straps and sleeves',
            price: 0,
            isProductCode: true,
            isRecommended: false,
            componentTypeCategory: 'Customization',
            incompatibleWith: {},
            optionRenderComponents: ['back', 'color', 'fabric', 'front', 'top', 'waistband'],
            renderPositionId: 'FrontTop',
            meta: {},
            sortOrder: 1510
        },
        {
            cartId: 'T92',
            code: 'T92',
            title: 'Curved back',
            componentTypeId: 'back',
            price: 0,
            isProductCode: true,
            isRecommended: false,
            componentTypeCategory: 'Customization',
            incompatibleWith: {},
            optionRenderComponents: ['color', 'fabric', 'front', 'straps and sleeves', 'top', 'waistband'],
            renderPositionId: 'BackTop',
            meta: {},
            sortOrder: 40
        },
        {
            cartId: 'T12',
            code: 'T12',
            title: 'Plunging v-neckline',
            componentTypeId: 'front',
            price: 1000,
            isProductCode: true,
            isRecommended: false,
            componentTypeCategory: 'Customization',
            incompatibleWith: {},
            optionRenderComponents: ['back', 'color', 'fabric', 'straps and sleeves', 'top', 'waistband'],
            renderPositionId: 'FrontTop',
            meta: {},
            sortOrder: 1870
        },
        {
            cartId: 'T15',
            code: 'T15',
            title: 'Plunging v-back',
            componentTypeId: 'back',
            price: 1000,
            isProductCode: true,
            isRecommended: false,
            componentTypeCategory: 'Customization',
            incompatibleWith: {
                C1: [['T12']]
            },
            optionRenderComponents: ['color', 'fabric', 'front', 'straps and sleeves', 'top', 'waistband'],
            renderPositionId: 'BackTop',
            meta: {},
            sortOrder: 30
        },
        {
            cartId: 'T95',
            code: 'T95',
            title: 'One-shoulder back',
            componentTypeId: 'back',
            price: 0,
            isProductCode: true,
            isRecommended: false,
            componentTypeCategory: 'Customization',
            incompatibleWith: {},
            optionRenderComponents: ['color', 'fabric', 'front', 'straps and sleeves', 'top', 'waistband'],
            renderPositionId: 'BackTop',
            meta: {},
            sortOrder: 130
        },
        {
            cartId: 'T14',
            code: 'T14',
            title: 'Overlapping bust cups neckline',
            componentTypeId: 'front',
            price: 0,
            isProductCode: true,
            isRecommended: false,
            componentTypeCategory: 'Customization',
            incompatibleWith: {},
            optionRenderComponents: ['back', 'color', 'fabric', 'straps and sleeves', 'top', 'waistband'],
            renderPositionId: 'FrontTop',
            meta: {},
            sortOrder: 1890
        },
        {
            cartId: 'T64',
            code: 'T64',
            title: 'Tri-cup neckline',
            componentTypeId: 'front',
            price: 0,
            isProductCode: true,
            isRecommended: false,
            componentTypeCategory: 'Customization',
            incompatibleWith: {},
            optionRenderComponents: ['back', 'color', 'fabric', 'straps and sleeves', 'top', 'waistband'],
            renderPositionId: 'FrontTop',
            meta: {},
            sortOrder: 1830
        },
        {
            cartId: 'WB0',
            code: 'WB0',
            title: 'No waistband',
            componentTypeId: 'waistband',
            price: 0,
            isProductCode: true,
            isRecommended: false,
            componentTypeCategory: 'Customization',
            incompatibleWith: {},
            optionRenderComponents: ['back', 'base bottom', 'color', 'fabric', 'front', 'length', 'straps and sleeves', 'top'],
            renderPositionId: 'FrontMiddle',
            meta: {},
            sortOrder: 1220
        },
        {
            cartId: 'T91',
            code: 'T91',
            title: 'V-back',
            componentTypeId: 'back',
            price: 0,
            isProductCode: true,
            isRecommended: false,
            componentTypeCategory: 'Customization',
            incompatibleWith: {},
            optionRenderComponents: ['color', 'fabric', 'front', 'straps and sleeves', 'top', 'waistband'],
            renderPositionId: 'BackTop',
            meta: {},
            sortOrder: 20
        },
        {
            cartId: 'T6',
            code: 'T6',
            title: 'Ballerina neckline',
            componentTypeId: 'front',
            price: 0,
            isProductCode: true,
            isRecommended: false,
            componentTypeCategory: 'Customization',
            incompatibleWith: {},
            optionRenderComponents: ['back', 'color', 'fabric', 'straps and sleeves', 'top', 'waistband'],
            renderPositionId: 'FrontTop',
            meta: {},
            sortOrder: 1940
        },
        {
            cartId: 'WB2',
            code: 'WB2',
            title: 'Wide waistband',
            componentTypeId: 'waistband',
            price: 0,
            isProductCode: true,
            isRecommended: false,
            componentTypeCategory: 'Customization',
            incompatibleWith: {},
            optionRenderComponents: ['back', 'base bottom', 'color', 'fabric', 'front', 'length', 'straps and sleeves', 'top'],
            renderPositionId: 'FrontMiddle',
            meta: {},
            sortOrder: 1400
        },
        {
            cartId: 'US14/AU18',
            code: 'US14-AU18',
            title: 'US 14 / AU 18',
            componentTypeId: 'size',
            price: 0,
            isProductCode: false,
            isRecommended: false,
            componentTypeCategory: 'Size',
            incompatibleWith: {},
            optionRenderComponents: [],
            renderPositionId: 'FrontNone',
            meta: {
                sizeAu: '18',
                sizeUs: '14'
            },
            sortOrder: 970
        },
        {
            cartId: 'US12/AU16',
            code: 'US12-AU16',
            title: 'US 12 / AU 16',
            componentTypeId: 'size',
            price: 0,
            isProductCode: false,
            isRecommended: false,
            componentTypeCategory: 'Size',
            incompatibleWith: {},
            optionRenderComponents: [],
            renderPositionId: 'FrontNone',
            meta: {
                sizeAu: '16',
                sizeUs: '12'
            },
            sortOrder: 960
        },
        {
            cartId: 'US10/AU14',
            code: 'US10-AU14',
            title: 'US 10 / AU 14',
            componentTypeId: 'size',
            price: 0,
            isProductCode: false,
            isRecommended: false,
            componentTypeCategory: 'Size',
            incompatibleWith: {},
            optionRenderComponents: [],
            renderPositionId: 'FrontNone',
            meta: {
                sizeAu: '14',
                sizeUs: '10'
            },
            sortOrder: 950
        },
        {
            cartId: 'US8/AU12',
            code: 'US8-AU12',
            title: 'US 8 / AU 12',
            componentTypeId: 'size',
            price: 0,
            isProductCode: false,
            isRecommended: false,
            componentTypeCategory: 'Size',
            incompatibleWith: {},
            optionRenderComponents: [],
            renderPositionId: 'FrontNone',
            meta: {
                sizeAu: '12',
                sizeUs: '8'
            },
            sortOrder: 940
        },
        {
            cartId: 'US6/AU10',
            code: 'US6-AU10',
            title: 'US 6 / AU 10',
            componentTypeId: 'size',
            price: 0,
            isProductCode: false,
            isRecommended: false,
            componentTypeCategory: 'Size',
            incompatibleWith: {},
            optionRenderComponents: [],
            renderPositionId: 'FrontNone',
            meta: {
                sizeAu: '10',
                sizeUs: '6'
            },
            sortOrder: 930
        },
        {
            cartId: 'US4/AU8',
            code: 'US4-AU8',
            title: 'US 4 / AU 8',
            componentTypeId: 'size',
            price: 0,
            isProductCode: false,
            isRecommended: false,
            componentTypeCategory: 'Size',
            incompatibleWith: {},
            optionRenderComponents: [],
            renderPositionId: 'FrontNone',
            meta: {
                sizeAu: '8',
                sizeUs: '4'
            },
            sortOrder: 920
        },
        {
            cartId: 'US2/AU6',
            code: 'US2-AU6',
            title: 'US 2 / AU 6',
            componentTypeId: 'size',
            price: 0,
            isProductCode: false,
            isRecommended: false,
            componentTypeCategory: 'Size',
            incompatibleWith: {},
            optionRenderComponents: [],
            renderPositionId: 'FrontNone',
            meta: {
                sizeAu: '6',
                sizeUs: '2'
            },
            sortOrder: 910
        },
        {
            cartId: 'US0/AU4',
            code: 'US0-AU4',
            title: 'US 0 / AU 4',
            componentTypeId: 'size',
            price: 0,
            isProductCode: false,
            isRecommended: false,
            componentTypeCategory: 'Size',
            incompatibleWith: {},
            optionRenderComponents: [],
            renderPositionId: 'FrontNone',
            meta: {
                sizeAu: '4',
                sizeUs: '0'
            },
            sortOrder: 900
        },
        {
            cartId: 'B22',
            code: 'B22',
            title: 'Hi-low skirt',
            componentTypeId: 'base bottom',
            price: 1000,
            isProductCode: true,
            isRecommended: false,
            componentTypeCategory: 'Customization',
            incompatibleWith: {},
            optionRenderComponents: ['color', 'fabric', 'length'],
            renderPositionId: 'FrontBottom',
            meta: {},
            sortOrder: 240
        },
        {
            cartId: 'B20',
            code: 'B20',
            title: 'Waist peplum',
            componentTypeId: 'extra',
            price: 1000,
            isProductCode: true,
            isRecommended: false,
            componentTypeCategory: 'Customization',
            incompatibleWith: {
                allOptions: [['B4'], ['B1'], ['B3'], ['B22'], ['MM']]
            },
            optionRenderComponents: ['base bottom', 'color', 'fabric', 'length'],
            renderPositionId: 'FrontBottom',
            meta: {},
            sortOrder: 540
        },
        {
            cartId: 'B14',
            code: 'B14',
            title: 'Single hem ruffle',
            componentTypeId: 'extra',
            price: 2000,
            isProductCode: true,
            isRecommended: false,
            componentTypeCategory: 'Customization',
            incompatibleWith: {
                allOptions: [['B3'], ['MN'], ['B1'], ['MM']]
            },
            optionRenderComponents: ['base bottom', 'color', 'fabric', 'length'],
            renderPositionId: 'FrontBottom',
            meta: {},
            sortOrder: 520
        },
        {
            cartId: 'B16',
            code: 'B16',
            title: 'Front side split',
            componentTypeId: 'extra',
            price: 1000,
            isProductCode: true,
            isRecommended: false,
            componentTypeCategory: 'Customization',
            incompatibleWith: {
                allOptions: [['MM'], ['MN']]
            },
            optionRenderComponents: ['base bottom', 'color', 'fabric', 'length'],
            renderPositionId: 'FrontBottom',
            meta: {},
            sortOrder: 530
        },
        {
            cartId: 'A4',
            code: 'A4',
            title: 'Side pockets',
            componentTypeId: 'extra',
            price: 1000,
            isProductCode: true,
            isRecommended: false,
            componentTypeCategory: 'Customization',
            incompatibleWith: {
                allOptions: [['B5'], ['B1']]
            },
            optionRenderComponents: ['base bottom', 'color', 'fabric', 'length'],
            renderPositionId: 'FrontBottom',
            meta: {},
            sortOrder: 500
        },
        {
            cartId: 'A2',
            code: 'A2',
            title: 'Separate wide tie belt',
            componentTypeId: 'extra',
            price: 1000,
            isProductCode: true,
            isRecommended: false,
            componentTypeCategory: 'Customization',
            incompatibleWith: {},
            optionRenderComponents: ['back', 'color', 'fabric', 'front', 'straps and sleeves', 'top', 'waistband'],
            renderPositionId: 'FrontTop',
            meta: {},
            sortOrder: 600
        },
        {
            cartId: 'US16/AU20',
            code: 'US16-AU20',
            title: 'US 16 / AU 20',
            componentTypeId: 'size',
            price: 0,
            isProductCode: false,
            isRecommended: false,
            componentTypeCategory: 'Size',
            incompatibleWith: {},
            optionRenderComponents: [],
            renderPositionId: 'FrontNone',
            meta: {
                sizeAu: '20',
                sizeUs: '16'
            },
            sortOrder: 980
        },
        {
            cartId: 'FM',
            code: 'FM',
            title: 'Formal Maxi Length',
            componentTypeId: 'length',
            price: 3000,
            isProductCode: true,
            isRecommended: false,
            componentTypeCategory: 'Length',
            incompatibleWith: {
                allOptions: [['B5']]
            },
            optionRenderComponents: ['base bottom', 'color', 'fabric'],
            renderPositionId: 'FrontBottom',
            meta: {},
            sortOrder: 1710
        },
        {
            cartId: 'AK',
            code: 'AK',
            title: 'Ankle Length',
            componentTypeId: 'length',
            price: 2000,
            isProductCode: true,
            isRecommended: false,
            componentTypeCategory: 'Length',
            incompatibleWith: {},
            optionRenderComponents: ['base bottom', 'color', 'fabric'],
            renderPositionId: 'FrontBottom',
            meta: {},
            sortOrder: 1730
        },
        {
            cartId: 'MD',
            code: 'MD',
            title: 'Midi Length',
            componentTypeId: 'length',
            price: 2000,
            isProductCode: true,
            isRecommended: false,
            componentTypeCategory: 'Length',
            incompatibleWith: {},
            optionRenderComponents: ['base bottom', 'color', 'fabric'],
            renderPositionId: 'FrontBottom',
            meta: {},
            sortOrder: 1740
        },
        {
            cartId: 'KN',
            code: 'KN',
            title: 'Knee Length',
            componentTypeId: 'length',
            price: 1000,
            isProductCode: true,
            isRecommended: false,
            componentTypeCategory: 'Length',
            incompatibleWith: {},
            optionRenderComponents: ['base bottom', 'color', 'fabric'],
            renderPositionId: 'FrontBottom',
            meta: {},
            sortOrder: 1750
        },
        {
            cartId: 'MN',
            code: 'MN',
            title: 'Mini Length',
            componentTypeId: 'length',
            price: 0,
            isProductCode: true,
            isRecommended: false,
            componentTypeCategory: 'Length',
            incompatibleWith: {
                allOptions: [['B22']]
            },
            optionRenderComponents: ['base bottom', 'color', 'fabric'],
            renderPositionId: 'FrontBottom',
            meta: {},
            sortOrder: 1760
        },
        {
            cartId: 'MM',
            code: 'MM',
            title: 'Micro Mini Length',
            componentTypeId: 'length',
            price: 0,
            isProductCode: true,
            isRecommended: false,
            componentTypeCategory: 'Length',
            incompatibleWith: {
                allOptions: [['B4'], ['B3'], ['B1'], ['B22']]
            },
            optionRenderComponents: ['base bottom', 'color', 'fabric'],
            renderPositionId: 'FrontBottom',
            meta: {},
            sortOrder: 1770
        },
        {
            cartId: 'B1',
            code: 'B1',
            title: 'Very full skirt with yoke',
            componentTypeId: 'base bottom',
            price: 3000,
            isProductCode: true,
            isRecommended: false,
            componentTypeCategory: 'Customization',
            incompatibleWith: {},
            optionRenderComponents: ['color', 'fabric', 'length'],
            renderPositionId: 'FrontBottom',
            meta: {},
            sortOrder: 230
        },
        {
            cartId: 'B3',
            code: 'B3',
            title: 'Full skirt',
            componentTypeId: 'base bottom',
            price: 2000,
            isProductCode: true,
            isRecommended: false,
            componentTypeCategory: 'Customization',
            incompatibleWith: {},
            optionRenderComponents: ['color', 'fabric', 'length'],
            renderPositionId: 'FrontBottom',
            meta: {},
            sortOrder: 210
        },
        {
            cartId: 'B4',
            code: 'B4',
            title: 'A-line skirt',
            componentTypeId: 'base bottom',
            price: 1000,
            isProductCode: true,
            isRecommended: false,
            componentTypeCategory: 'Customization',
            incompatibleWith: {},
            optionRenderComponents: ['color', 'fabric', 'length'],
            renderPositionId: 'FrontBottom',
            meta: {},
            sortOrder: 200
        },
        {
            cartId: 'B5',
            code: 'B5',
            title: 'Column skirt',
            componentTypeId: 'base bottom',
            price: 0,
            isProductCode: true,
            isRecommended: false,
            componentTypeCategory: 'Customization',
            incompatibleWith: {},
            optionRenderComponents: ['color', 'fabric', 'length'],
            renderPositionId: 'FrontBottom',
            meta: {},
            sortOrder: 250
        },
        {
            cartId: 'C9',
            code: 'C9',
            title: 'Tri Cup',
            componentTypeId: 'top',
            price: 1000,
            isProductCode: true,
            isRecommended: false,
            componentTypeCategory: 'Customization',
            incompatibleWith: {},
            optionRenderComponents: ['back', 'color', 'fabric', 'front', 'straps and sleeves', 'waistband'],
            renderPositionId: 'FrontTop',
            meta: {},
            sortOrder: 1320
        },
        {
            cartId: 'C4',
            code: 'C4',
            title: 'One Shoulder',
            componentTypeId: 'top',
            price: 1000,
            isProductCode: true,
            isRecommended: false,
            componentTypeCategory: 'Customization',
            incompatibleWith: {},
            optionRenderComponents: ['back', 'color', 'fabric', 'front', 'straps and sleeves', 'waistband'],
            renderPositionId: 'FrontTop',
            meta: {},
            sortOrder: 1100
        },
        {
            cartId: 'C5',
            code: 'C5',
            title: 'Relaxed',
            componentTypeId: 'top',
            price: 3000,
            isProductCode: true,
            isRecommended: false,
            componentTypeCategory: 'Customization',
            incompatibleWith: {},
            optionRenderComponents: ['back', 'color', 'fabric', 'front', 'straps and sleeves', 'waistband'],
            renderPositionId: 'FrontTop',
            meta: {},
            sortOrder: 1110
        },
        {
            cartId: 'C1',
            code: 'C1',
            title: 'Classic',
            componentTypeId: 'top',
            price: 1000,
            isProductCode: true,
            isRecommended: false,
            componentTypeCategory: 'Customization',
            incompatibleWith: {},
            optionRenderComponents: ['back', 'color', 'fabric', 'front', 'straps and sleeves', 'waistband'],
            renderPositionId: 'FrontTop',
            meta: {},
            sortOrder: 1125
        },
        {
            cartId: 'C7',
            code: 'C7',
            title: 'Strappy',
            componentTypeId: 'top',
            price: 0,
            isProductCode: true,
            isRecommended: false,
            componentTypeCategory: 'Customization',
            incompatibleWith: {},
            optionRenderComponents: ['back', 'color', 'fabric', 'front', 'straps and sleeves', 'waistband'],
            renderPositionId: 'FrontTop',
            meta: {},
            sortOrder: 1150
        },
        {
            cartId: 'CM',
            code: 'CM',
            title: 'Casual Maxi Length',
            componentTypeId: 'length',
            price: 3000,
            isProductCode: true,
            isRecommended: false,
            componentTypeCategory: 'Length',
            incompatibleWith: {
                allOptions: [['B5']]
            },
            optionRenderComponents: ['base bottom', 'color', 'fabric'],
            renderPositionId: 'FrontBottom',
            meta: {},
            sortOrder: 1720
        },
        {
            cartId: 'US18/AU22',
            code: 'US18-AU22',
            title: 'US 18 / AU 22',
            componentTypeId: 'size',
            price: 0,
            isProductCode: false,
            isRecommended: false,
            componentTypeCategory: 'Size',
            incompatibleWith: {},
            optionRenderComponents: [],
            renderPositionId: 'FrontNone',
            meta: {
                sizeAu: '22',
                sizeUs: '18'
            },
            sortOrder: 990
        },
        {
            cartId: 'US20/AU24',
            code: 'US20-AU24',
            title: 'US 20 / AU 24',
            componentTypeId: 'size',
            price: 0,
            isProductCode: false,
            isRecommended: false,
            componentTypeCategory: 'Size',
            incompatibleWith: {},
            optionRenderComponents: [],
            renderPositionId: 'FrontNone',
            meta: {
                sizeAu: '24',
                sizeUs: '20'
            },
            sortOrder: 1000
        },
        {
            cartId: 'US22/AU26',
            code: 'US22-AU26',
            title: 'US 22 / AU 26',
            componentTypeId: 'size',
            price: 0,
            isProductCode: false,
            isRecommended: false,
            componentTypeCategory: 'Size',
            incompatibleWith: {},
            optionRenderComponents: [],
            renderPositionId: 'FrontNone',
            meta: {
                sizeAu: '26',
                sizeUs: '22'
            },
            sortOrder: 1010
        },
        {
            cartId: 'WB1',
            code: 'WB1',
            title: 'Classic waistband',
            componentTypeId: 'waistband',
            price: 0,
            isProductCode: true,
            isRecommended: false,
            componentTypeCategory: 'Customization',
            incompatibleWith: {},
            optionRenderComponents: ['back', 'base bottom', 'color', 'fabric', 'front', 'length', 'straps and sleeves', 'top'],
            renderPositionId: 'FrontMiddle',
            meta: {},
            sortOrder: 1200
        },
        {
            cartId: 'T0',
            code: 'T0',
            title: 'No sleeves',
            componentTypeId: 'straps and sleeves',
            price: 0,
            isProductCode: true,
            isRecommended: false,
            componentTypeCategory: 'Customization',
            incompatibleWith: {},
            optionRenderComponents: ['back', 'color', 'fabric', 'front', 'top', 'waistband'],
            renderPositionId: 'FrontTop',
            meta: {},
            sortOrder: 1430
        },
        {
            cartId: 'A5',
            code: 'A5',
            title: 'Separate capelet',
            componentTypeId: 'extra',
            price: 2000,
            isProductCode: true,
            isRecommended: false,
            componentTypeCategory: 'Customization',
            incompatibleWith: {},
            optionRenderComponents: ['back', 'color', 'fabric', 'front', 'straps and sleeves', 'top', 'waistband'],
            renderPositionId: 'FrontTop',
            meta: {},
            sortOrder: 440
        },
        {
            cartId: 'T60',
            code: 'T60',
            title: 'Side cut-outs',
            componentTypeId: 'extra',
            price: 1000,
            isProductCode: true,
            isRecommended: false,
            componentTypeCategory: 'Customization',
            incompatibleWith: {
                C1: [['T12'], ['T15']],
                C5: [['T44']],
                C7: [['T15']]
            },
            optionRenderComponents: ['back', 'color', 'fabric', 'front', 'straps and sleeves', 'top', 'waistband'],
            renderPositionId: 'FrontTop',
            meta: {},
            sortOrder: 400
        },
        {
            cartId: 'T52',
            code: 'T52',
            title: 'Wide arm ties',
            componentTypeId: 'extra',
            price: 1000,
            isProductCode: true,
            isRecommended: false,
            componentTypeCategory: 'Customization',
            incompatibleWith: {
                C7: [['T91']]
            },
            optionRenderComponents: ['back', 'color', 'fabric', 'front', 'straps and sleeves', 'top', 'waistband'],
            renderPositionId: 'FrontTop',
            meta: {},
            sortOrder: 1620
        },
        {
            cartId: 'T31',
            code: 'T31',
            title: 'Wide off-shoulder panel',
            componentTypeId: 'straps and sleeves',
            price: 1000,
            isProductCode: true,
            isRecommended: false,
            componentTypeCategory: 'Customization',
            incompatibleWith: {
                C6: [['T2'], ['T3']]
            },
            optionRenderComponents: ['back', 'color', 'fabric', 'front', 'top', 'waistband'],
            renderPositionId: 'FrontTop',
            meta: {},
            sortOrder: 1510
        },
        {
            cartId: 'T51',
            code: 'T51',
            title: 'Flared ruffle arm bands',
            componentTypeId: 'straps and sleeves',
            price: 2000,
            isProductCode: true,
            isRecommended: false,
            componentTypeCategory: 'Customization',
            incompatibleWith: {},
            optionRenderComponents: ['back', 'color', 'fabric', 'front', 'top', 'waistband'],
            renderPositionId: 'FrontTop',
            meta: {},
            sortOrder: 1610
        },
        {
            cartId: 'T90',
            code: 'T90',
            title: 'Straight back',
            componentTypeId: 'back',
            price: 0,
            isProductCode: true,
            isRecommended: false,
            componentTypeCategory: 'Customization',
            incompatibleWith: {},
            optionRenderComponents: ['color', 'fabric', 'front', 'straps and sleeves', 'top', 'waistband'],
            renderPositionId: 'BackTop',
            meta: {},
            sortOrder: 10
        },
        {
            cartId: 'T4',
            code: 'T4',
            title: 'Straight neckline',
            componentTypeId: 'front',
            price: 0,
            isProductCode: true,
            isRecommended: false,
            componentTypeCategory: 'Customization',
            incompatibleWith: {},
            optionRenderComponents: ['back', 'color', 'fabric', 'straps and sleeves', 'top', 'waistband'],
            renderPositionId: 'FrontTop',
            meta: {},
            sortOrder: 1920
        },
        {
            cartId: 'T3',
            code: 'T3',
            title: 'Sweetheart neckline',
            componentTypeId: 'front',
            price: 0,
            isProductCode: true,
            isRecommended: false,
            componentTypeCategory: 'Customization',
            incompatibleWith: {},
            optionRenderComponents: ['back', 'color', 'fabric', 'straps and sleeves', 'top', 'waistband'],
            renderPositionId: 'FrontTop',
            meta: {},
            sortOrder: 1910
        },
        {
            cartId: 'T2',
            code: 'T2',
            title: 'Curved neckline',
            componentTypeId: 'front',
            price: 0,
            isProductCode: true,
            isRecommended: false,
            componentTypeCategory: 'Customization',
            incompatibleWith: {},
            optionRenderComponents: ['back', 'color', 'fabric', 'straps and sleeves', 'top', 'waistband'],
            renderPositionId: 'FrontTop',
            meta: {},
            sortOrder: 1900
        },
        {
            cartId: 'T76',
            code: 'T76',
            title: 'Subtle sweetheart neckline',
            componentTypeId: 'front',
            price: 0,
            isProductCode: true,
            isRecommended: false,
            componentTypeCategory: 'Customization',
            incompatibleWith: {},
            optionRenderComponents: ['back', 'color', 'fabric', 'straps and sleeves', 'top', 'waistband'],
            renderPositionId: 'FrontTop',
            meta: {},
            sortOrder: 1820
        },
        {
            cartId: '1018',
            code: '1018',
            title: 'Sage Green ',
            componentTypeId: 'color',
            price: 0,
            isProductCode: true,
            isRecommended: false,
            componentTypeCategory: 'Color',
            incompatibleWith: {},
            optionRenderComponents: ['fabric'],
            renderPositionId: 'FrontNone',
            meta: {
                hex: '#89A5A5'
            },
            sortOrder: 840
        },
        {
            cartId: '1014',
            code: '1014',
            title: 'Royal Blue ',
            componentTypeId: 'color',
            price: 0,
            isProductCode: true,
            isRecommended: false,
            componentTypeCategory: 'Color',
            incompatibleWith: {},
            optionRenderComponents: ['fabric'],
            renderPositionId: 'FrontNone',
            meta: {
                hex: '#2E2E8E'
            },
            sortOrder: 790
        },
        {
            cartId: '1009',
            code: '1009',
            title: 'Red ',
            componentTypeId: 'color',
            price: 0,
            isProductCode: true,
            isRecommended: false,
            componentTypeCategory: 'Color',
            incompatibleWith: {},
            optionRenderComponents: ['fabric'],
            renderPositionId: 'FrontNone',
            meta: {
                hex: '#E01B1B'
            },
            sortOrder: 770
        },
        {
            cartId: '1007',
            code: '1007',
            title: 'Peach ',
            componentTypeId: 'color',
            price: 0,
            isProductCode: true,
            isRecommended: false,
            componentTypeCategory: 'Color',
            incompatibleWith: {},
            optionRenderComponents: ['fabric'],
            renderPositionId: 'FrontNone',
            meta: {
                hex: '#F7C6B0'
            },
            sortOrder: 740
        },
        {
            cartId: '1005',
            code: '1005',
            title: 'Pale Pink ',
            componentTypeId: 'color',
            price: 0,
            isProductCode: true,
            isRecommended: false,
            componentTypeCategory: 'Color',
            incompatibleWith: {},
            optionRenderComponents: ['fabric'],
            renderPositionId: 'FrontNone',
            meta: {
                hex: '#F5E5EC'
            },
            sortOrder: 720
        },
        {
            cartId: '102',
            code: '102',
            title: 'Heavy Georgette',
            componentTypeId: 'fabric',
            price: 0,
            isProductCode: true,
            isRecommended: false,
            componentTypeCategory: 'Fabric',
            incompatibleWith: {},
            optionRenderComponents: ['color'],
            renderPositionId: 'FrontNone',
            meta: {
                careDescription: 'Professional dry-clean only.\nSee label for further details.',
                fabricDescription:
                    'Main: 100% polyester heavy georgette\nLining: 97% polyester, 3% spandex matte stretch satin\nTrim: Nylon invisible zip with hook & eye closure\nDue to dyeing process, product hue may\nlook slightly different from image.'
            },
            sortOrder: 2100
        },
        {
            cartId: '1011',
            code: '1011',
            title: 'Berry ',
            componentTypeId: 'color',
            price: 0,
            isProductCode: true,
            isRecommended: false,
            componentTypeCategory: 'Color',
            incompatibleWith: {},
            optionRenderComponents: ['fabric'],
            renderPositionId: 'FrontNone',
            meta: {
                hex: '#84216D'
            },
            sortOrder: 770
        },
        {
            cartId: '1003',
            code: '1003',
            title: 'Black ',
            componentTypeId: 'color',
            price: 0,
            isProductCode: true,
            isRecommended: false,
            componentTypeCategory: 'Color',
            incompatibleWith: {},
            optionRenderComponents: ['fabric'],
            renderPositionId: 'FrontNone',
            meta: {
                hex: '#000000'
            },
            sortOrder: 705
        },
        {
            cartId: '1006',
            code: '1006',
            title: 'Blush ',
            componentTypeId: 'color',
            price: 0,
            isProductCode: true,
            isRecommended: false,
            componentTypeCategory: 'Color',
            incompatibleWith: {},
            optionRenderComponents: ['fabric'],
            renderPositionId: 'FrontNone',
            meta: {
                hex: '#EAC3C7'
            },
            sortOrder: 730
        },
        {
            cartId: '1017',
            code: '1017',
            title: 'Bright Turquoise ',
            componentTypeId: 'color',
            price: 0,
            isProductCode: true,
            isRecommended: false,
            componentTypeCategory: 'Color',
            incompatibleWith: {},
            optionRenderComponents: ['fabric'],
            renderPositionId: 'FrontNone',
            meta: {
                hex: '#0FBAA9'
            },
            sortOrder: 830
        },
        {
            cartId: '1010',
            code: '1010',
            title: 'Burgundy ',
            componentTypeId: 'color',
            price: 0,
            isProductCode: true,
            isRecommended: false,
            componentTypeCategory: 'Color',
            incompatibleWith: {},
            optionRenderComponents: ['fabric'],
            renderPositionId: 'FrontNone',
            meta: {
                hex: '#77202F'
            },
            sortOrder: 760
        },
        {
            cartId: '1004',
            code: '1004',
            title: 'Champagne ',
            componentTypeId: 'color',
            price: 0,
            isProductCode: true,
            isRecommended: false,
            componentTypeCategory: 'Color',
            incompatibleWith: {},
            optionRenderComponents: ['fabric'],
            renderPositionId: 'FrontNone',
            meta: {
                hex: '#EFE4DC'
            },
            sortOrder: 715
        },
        {
            cartId: '1001',
            code: '1001',
            title: 'Ivory ',
            componentTypeId: 'color',
            price: 0,
            isProductCode: true,
            isRecommended: false,
            componentTypeCategory: 'Color',
            incompatibleWith: {},
            optionRenderComponents: ['fabric'],
            renderPositionId: 'FrontNone',
            meta: {
                hex: '#FFFFF0'
            },
            sortOrder: 700
        },
        {
            cartId: '1012',
            code: '1012',
            title: 'Lilac ',
            componentTypeId: 'color',
            price: 0,
            isProductCode: true,
            isRecommended: false,
            componentTypeCategory: 'Color',
            incompatibleWith: {},
            optionRenderComponents: ['fabric'],
            renderPositionId: 'FrontNone',
            meta: {
                hex: '#CCC3E2'
            },
            sortOrder: 810
        },
        {
            cartId: '1016',
            code: '1016',
            title: 'Mint ',
            componentTypeId: 'color',
            price: 0,
            isProductCode: true,
            isRecommended: false,
            componentTypeCategory: 'Color',
            incompatibleWith: {},
            optionRenderComponents: ['fabric'],
            renderPositionId: 'FrontNone',
            meta: {
                hex: '#ADE0D6'
            },
            sortOrder: 820
        },
        {
            cartId: '1013',
            code: '1013',
            title: 'Navy ',
            componentTypeId: 'color',
            price: 0,
            isProductCode: true,
            isRecommended: false,
            componentTypeCategory: 'Color',
            incompatibleWith: {},
            optionRenderComponents: ['fabric'],
            renderPositionId: 'FrontNone',
            meta: {
                hex: '#0E0E47'
            },
            sortOrder: 780
        },
        {
            cartId: '1015',
            code: '1015',
            title: 'Pale Blue ',
            componentTypeId: 'color',
            price: 0,
            isProductCode: true,
            isRecommended: false,
            componentTypeCategory: 'Color',
            incompatibleWith: {},
            optionRenderComponents: ['fabric'],
            renderPositionId: 'FrontNone',
            meta: {
                hex: '#BBD0ED'
            },
            sortOrder: 800
        },
        {
            cartId: '1002',
            code: '1002',
            title: 'Pale Grey ',
            componentTypeId: 'color',
            price: 0,
            isProductCode: true,
            isRecommended: false,
            componentTypeCategory: 'Color',
            incompatibleWith: {},
            optionRenderComponents: ['fabric'],
            renderPositionId: 'FrontNone',
            meta: {
                hex: '#D8D6DD'
            },
            sortOrder: 710
        },
        {
            cartId: '1008',
            code: '1008',
            title: 'Guava ',
            componentTypeId: 'color',
            price: 0,
            isProductCode: true,
            isRecommended: false,
            componentTypeCategory: 'Color',
            incompatibleWith: {},
            optionRenderComponents: ['fabric'],
            renderPositionId: 'FrontNone',
            meta: {
                hex: '#F9AAB2'
            },
            sortOrder: 750
        }
    ],
    groups: [
        {
            id: 1027,
            title: 'Fabric & Color',
            slug: 'fabricandcolor',
            sectionGroups: [
                {
                    title: 'Fabric & Color',
                    slug: 'color',
                    aggregateTitle: '',
                    previewType: 'render',
                    renderPositionId: 'FrontNone',
                    sections: [
                        {
                            componentTypeId: 'fabric',
                            componentTypeCategory: 'Fabric',
                            title: 'Select your fabric',
                            selectionType: 'RequiredOne',
                            options: [
                                {
                                    code: '102',
                                    isDefault: false,
                                    parentOptionId: null
                                }
                            ]
                        },
                        {
                            componentTypeId: 'color',
                            componentTypeCategory: 'Color',
                            title: 'Select your color',
                            selectionType: 'RequiredOne',
                            options: [
                                {
                                    code: '1001',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: '1012',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: '1016',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: '1013',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: '1015',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: '1002',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: '1005',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: '1007',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: '1009',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: '1018',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: '1010',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: '1004',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: '1008',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: '1017',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: '1014',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: '1011',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: '1003',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: '1006',
                                    isDefault: false,
                                    parentOptionId: null
                                }
                            ]
                        }
                    ]
                }
            ],
            selectionTitle: 'Select your fabric & color'
        },
        {
            id: 1028,
            title: 'Silhouette',
            slug: 'silhouette',
            sectionGroups: [
                {
                    title: 'Top',
                    slug: 'top',
                    aggregateTitle: '',
                    previewType: 'render',
                    renderPositionId: 'FrontTop',
                    sections: [
                        {
                            componentTypeId: 'top',
                            componentTypeCategory: 'Customization',
                            title: 'Select your top',
                            selectionType: 'RequiredOne',
                            options: [
                                {
                                    code: 'C7',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: 'C1',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: 'C5',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: 'C4',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: 'C9',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: 'C6',
                                    isDefault: false,
                                    parentOptionId: null
                                }
                            ]
                        }
                    ]
                },
                {
                    title: 'Bottom',
                    slug: 'bottom',
                    aggregateTitle: '',
                    previewType: 'render',
                    renderPositionId: 'FrontBottom',
                    sections: [
                        {
                            componentTypeId: 'base bottom',
                            componentTypeCategory: 'Customization',
                            title: 'Select your base bottom',
                            selectionType: 'RequiredOne',
                            options: [
                                {
                                    code: 'B5',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: 'B4',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: 'B3',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: 'B1',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: 'B22',
                                    isDefault: false,
                                    parentOptionId: null
                                }
                            ]
                        }
                    ]
                },
                {
                    title: 'Length',
                    slug: 'length',
                    aggregateTitle: '',
                    previewType: 'render',
                    renderPositionId: 'FrontBottom',
                    sections: [
                        {
                            componentTypeId: 'length',
                            componentTypeCategory: 'Length',
                            title: 'Select your length',
                            selectionType: 'RequiredOne',
                            options: [
                                {
                                    code: 'MM',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: 'MN',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: 'KN',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: 'MD',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: 'AK',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: 'CM',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: 'FM',
                                    isDefault: false,
                                    parentOptionId: null
                                }
                            ]
                        }
                    ]
                }
            ],
            selectionTitle: 'Change your silhouette'
        },
        {
            id: 1029,
            title: 'Customizations',
            slug: 'customisations',
            sectionGroups: [
                {
                    title: 'Front',
                    slug: 'front',
                    aggregateTitle: '',
                    previewType: 'render',
                    renderPositionId: 'FrontTop',
                    sections: [
                        {
                            componentTypeId: 'front',
                            componentTypeCategory: 'Customization',
                            title: 'Select your front',
                            selectionType: 'RequiredOne',
                            options: [
                                {
                                    code: 'T76',
                                    isDefault: true,
                                    parentOptionId: 'C7'
                                },
                                {
                                    code: 'T6',
                                    isDefault: false,
                                    parentOptionId: 'C7'
                                },
                                {
                                    code: 'T4',
                                    isDefault: false,
                                    parentOptionId: 'C7'
                                },
                                {
                                    code: 'T2',
                                    isDefault: false,
                                    parentOptionId: 'C7'
                                },
                                {
                                    code: 'T3',
                                    isDefault: false,
                                    parentOptionId: 'C7'
                                },
                                {
                                    code: 'T64',
                                    isDefault: true,
                                    parentOptionId: 'C9'
                                },
                                {
                                    code: 'T14',
                                    isDefault: false,
                                    parentOptionId: 'C9'
                                },
                                {
                                    code: 'T44',
                                    isDefault: true,
                                    parentOptionId: 'C5'
                                },
                                {
                                    code: 'T94',
                                    isDefault: false,
                                    parentOptionId: 'C5'
                                },
                                {
                                    code: 'T5',
                                    isDefault: true,
                                    parentOptionId: 'C4'
                                },
                                {
                                    code: 'T86',
                                    isDefault: true,
                                    parentOptionId: 'C1'
                                },
                                {
                                    code: 'T93',
                                    isDefault: false,
                                    parentOptionId: 'C1'
                                },
                                {
                                    code: 'T11',
                                    isDefault: false,
                                    parentOptionId: 'C1'
                                },
                                {
                                    code: 'T12',
                                    isDefault: false,
                                    parentOptionId: 'C1'
                                },
                                {
                                    code: 'T76',
                                    isDefault: true,
                                    parentOptionId: 'C6'
                                },
                                {
                                    code: 'T2',
                                    isDefault: false,
                                    parentOptionId: 'C6'
                                },
                                {
                                    code: 'T3',
                                    isDefault: false,
                                    parentOptionId: 'C6'
                                },
                                {
                                    code: 'T4',
                                    isDefault: false,
                                    parentOptionId: 'C6'
                                }
                            ]
                        }
                    ]
                },
                {
                    title: 'Back',
                    slug: 'back',
                    aggregateTitle: '',
                    previewType: 'render',
                    renderPositionId: 'BackTop',
                    sections: [
                        {
                            componentTypeId: 'back',
                            componentTypeCategory: 'Customization',
                            title: 'Select your back',
                            selectionType: 'RequiredOne',
                            options: [
                                {
                                    code: 'T90',
                                    isDefault: true,
                                    parentOptionId: 'C6'
                                },
                                {
                                    code: 'T67',
                                    isDefault: true,
                                    parentOptionId: 'C1'
                                },
                                {
                                    code: 'T15',
                                    isDefault: false,
                                    parentOptionId: 'C1'
                                },
                                {
                                    code: 'T95',
                                    isDefault: true,
                                    parentOptionId: 'C4'
                                },
                                {
                                    code: 'T91',
                                    isDefault: true,
                                    parentOptionId: 'C5'
                                },
                                {
                                    code: 'T67',
                                    isDefault: false,
                                    parentOptionId: 'C5'
                                },
                                {
                                    code: 'T90',
                                    isDefault: true,
                                    parentOptionId: 'C9'
                                },
                                {
                                    code: 'T90',
                                    isDefault: true,
                                    parentOptionId: 'C7'
                                },
                                {
                                    code: 'T91',
                                    isDefault: false,
                                    parentOptionId: 'C7'
                                },
                                {
                                    code: 'T15',
                                    isDefault: false,
                                    parentOptionId: 'C7'
                                },
                                {
                                    code: 'T92',
                                    isDefault: false,
                                    parentOptionId: 'C7'
                                }
                            ]
                        }
                    ]
                },
                {
                    title: 'Waist',
                    slug: 'waist',
                    aggregateTitle: '',
                    previewType: 'render',
                    renderPositionId: 'FrontTop',
                    sections: [
                        {
                            componentTypeId: 'waistband',
                            componentTypeCategory: 'Customization',
                            title: 'Select your waistband',
                            selectionType: 'RequiredOne',
                            options: [
                                {
                                    code: 'WB1',
                                    isDefault: true,
                                    parentOptionId: 'C4'
                                },
                                {
                                    code: 'WB2',
                                    isDefault: false,
                                    parentOptionId: 'C4'
                                },
                                {
                                    code: 'WB0',
                                    isDefault: true,
                                    parentOptionId: 'C9'
                                },
                                {
                                    code: 'WB1',
                                    isDefault: true,
                                    parentOptionId: 'C1'
                                },
                                {
                                    code: 'WB2',
                                    isDefault: false,
                                    parentOptionId: 'C1'
                                },
                                {
                                    code: 'WB1',
                                    isDefault: true,
                                    parentOptionId: 'C5'
                                },
                                {
                                    code: 'WB2',
                                    isDefault: false,
                                    parentOptionId: 'C5'
                                },
                                {
                                    code: 'WB1',
                                    isDefault: true,
                                    parentOptionId: 'C7'
                                },
                                {
                                    code: 'WB2',
                                    isDefault: false,
                                    parentOptionId: 'C7'
                                },
                                {
                                    code: 'WB1',
                                    isDefault: true,
                                    parentOptionId: 'C6'
                                },
                                {
                                    code: 'WB2',
                                    isDefault: false,
                                    parentOptionId: 'C6'
                                }
                            ]
                        }
                    ]
                },
                {
                    title: 'Straps & Sleeves',
                    slug: 'strapsandsleeves',
                    aggregateTitle: '',
                    previewType: 'render',
                    renderPositionId: 'FrontTop',
                    sections: [
                        {
                            componentTypeId: 'straps and sleeves',
                            componentTypeCategory: 'Customization',
                            title: 'Select your straps and sleeves',
                            selectionType: 'RequiredOne',
                            options: [
                                {
                                    code: 'T51',
                                    isDefault: false,
                                    parentOptionId: 'C6'
                                },
                                {
                                    code: 'T31',
                                    isDefault: false,
                                    parentOptionId: 'C6'
                                },
                                {
                                    code: 'T00',
                                    isDefault: true,
                                    parentOptionId: 'C5'
                                },
                                {
                                    code: 'T45',
                                    isDefault: false,
                                    parentOptionId: 'C1'
                                },
                                {
                                    code: 'T46',
                                    isDefault: false,
                                    parentOptionId: 'C1'
                                },
                                {
                                    code: 'T38',
                                    isDefault: false,
                                    parentOptionId: 'C1'
                                },
                                {
                                    code: 'T50',
                                    isDefault: false,
                                    parentOptionId: 'C1'
                                },
                                {
                                    code: 'T49',
                                    isDefault: false,
                                    parentOptionId: 'C1'
                                },
                                {
                                    code: 'T48',
                                    isDefault: false,
                                    parentOptionId: 'C1'
                                },
                                {
                                    code: 'T49',
                                    isDefault: false,
                                    parentOptionId: 'C4'
                                },
                                {
                                    code: 'T72',
                                    isDefault: false,
                                    parentOptionId: 'C5'
                                },
                                {
                                    code: 'T101',
                                    isDefault: false,
                                    parentOptionId: 'C1'
                                },
                                {
                                    code: 'T98',
                                    isDefault: false,
                                    parentOptionId: 'C1'
                                },
                                {
                                    code: 'T99',
                                    isDefault: false,
                                    parentOptionId: 'C1'
                                },
                                {
                                    code: 'T100',
                                    isDefault: false,
                                    parentOptionId: 'C1'
                                },
                                {
                                    code: 'T38',
                                    isDefault: false,
                                    parentOptionId: 'C4'
                                },
                                {
                                    code: 'T0',
                                    isDefault: true,
                                    parentOptionId: 'C1'
                                },
                                {
                                    code: 'T71',
                                    isDefault: true,
                                    parentOptionId: 'C9'
                                },
                                {
                                    code: 'T25',
                                    isDefault: false,
                                    parentOptionId: 'C7'
                                },
                                {
                                    code: 'T85',
                                    isDefault: false,
                                    parentOptionId: 'C7'
                                },
                                {
                                    code: 'T68',
                                    isDefault: false,
                                    parentOptionId: 'C7'
                                },
                                {
                                    code: 'T48',
                                    isDefault: false,
                                    parentOptionId: 'C4'
                                },
                                {
                                    code: 'T0',
                                    isDefault: true,
                                    parentOptionId: 'C4'
                                },
                                {
                                    code: 'T100',
                                    isDefault: false,
                                    parentOptionId: 'C4'
                                },
                                {
                                    code: 'T101',
                                    isDefault: false,
                                    parentOptionId: 'C4'
                                },
                                {
                                    code: 'T98',
                                    isDefault: false,
                                    parentOptionId: 'C4'
                                },
                                {
                                    code: 'T99',
                                    isDefault: false,
                                    parentOptionId: 'C4'
                                },
                                {
                                    code: 'T85',
                                    isDefault: false,
                                    parentOptionId: 'C9'
                                },
                                {
                                    code: 'T22',
                                    isDefault: false,
                                    parentOptionId: 'C9'
                                },
                                {
                                    code: 'T26',
                                    isDefault: false,
                                    parentOptionId: 'C9'
                                },
                                {
                                    code: 'T33',
                                    isDefault: false,
                                    parentOptionId: 'C9'
                                },
                                {
                                    code: 'T22',
                                    isDefault: true,
                                    parentOptionId: 'C7'
                                },
                                {
                                    code: 'T26',
                                    isDefault: false,
                                    parentOptionId: 'C7'
                                },
                                {
                                    code: 'T71',
                                    isDefault: false,
                                    parentOptionId: 'C7'
                                },
                                {
                                    code: 'T30',
                                    isDefault: false,
                                    parentOptionId: 'C7'
                                },
                                {
                                    code: 'T33',
                                    isDefault: false,
                                    parentOptionId: 'C7'
                                },
                                {
                                    code: 'T34',
                                    isDefault: false,
                                    parentOptionId: 'C7'
                                },
                                {
                                    code: 'T0',
                                    isDefault: true,
                                    parentOptionId: 'C6'
                                }
                            ]
                        }
                    ]
                },
                {
                    title: 'Extras',
                    slug: 'extras',
                    aggregateTitle: 'extras',
                    previewType: 'render',
                    renderPositionId: 'FrontNone',
                    sections: [
                        {
                            componentTypeId: 'extra',
                            componentTypeCategory: 'Customization',
                            title: 'Select your extras',
                            selectionType: 'OptionalMultiple',
                            options: [
                                {
                                    code: 'A5',
                                    isDefault: false,
                                    parentOptionId: 'C6'
                                },
                                {
                                    code: 'T60',
                                    isDefault: false,
                                    parentOptionId: 'C6'
                                },
                                {
                                    code: 'T52',
                                    isDefault: false,
                                    parentOptionId: 'C6'
                                },
                                {
                                    code: 'A2',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: 'B16',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: 'A5',
                                    isDefault: false,
                                    parentOptionId: 'C9'
                                },
                                {
                                    code: 'B20',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: 'T60',
                                    isDefault: false,
                                    parentOptionId: 'C1'
                                },
                                {
                                    code: 'T58',
                                    isDefault: false,
                                    parentOptionId: 'C7'
                                },
                                {
                                    code: 'A5',
                                    isDefault: false,
                                    parentOptionId: 'C7'
                                },
                                {
                                    code: 'T52',
                                    isDefault: false,
                                    parentOptionId: 'C7'
                                },
                                {
                                    code: 'A5',
                                    isDefault: false,
                                    parentOptionId: 'C5'
                                },
                                {
                                    code: 'T60',
                                    isDefault: false,
                                    parentOptionId: 'C5'
                                },
                                {
                                    code: 'A5',
                                    isDefault: false,
                                    parentOptionId: 'C4'
                                },
                                {
                                    code: 'A5',
                                    isDefault: false,
                                    parentOptionId: 'C1'
                                },
                                {
                                    code: 'T60',
                                    isDefault: false,
                                    parentOptionId: 'C7'
                                },
                                {
                                    code: 'B14',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: 'A4',
                                    isDefault: false,
                                    parentOptionId: null
                                }
                            ]
                        }
                    ]
                }
            ],
            selectionTitle: 'Customize your dress'
        },
        {
            id: 1030,
            title: 'Size',
            slug: 'size',
            sectionGroups: [
                {
                    title: 'Size',
                    slug: 'size',
                    aggregateTitle: '',
                    previewType: 'render',
                    renderPositionId: 'FrontNone',
                    sections: [
                        {
                            componentTypeId: 'size',
                            componentTypeCategory: 'Size',
                            title: 'Select your size',
                            selectionType: 'RequiredOne',
                            options: [
                                {
                                    code: 'US0-AU4',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: 'US2-AU6',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: 'US4-AU8',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: 'US6-AU10',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: 'US8-AU12',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: 'US10-AU14',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: 'US12-AU16',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: 'US14-AU18',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: 'US16-AU20',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: 'US18-AU22',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: 'US20-AU24',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: 'US22-AU26',
                                    isDefault: false,
                                    parentOptionId: null
                                }
                            ]
                        }
                    ]
                }
            ],
            selectionTitle: 'Tell us your height and size'
        },
        {
          id: 1050,
          title: 'Making',
          slug: 'making',
          sectionGroups: [
              {
                  title: 'Making',
                  slug: 'making',
                  sections: [
                      {
                          componentTypeId: 'making',
                          componentTypeCategory: 'Making',
                          title: 'Select your deliver time',
                          selectionType: 'RequiredOne',
                          options: [
                              {
                                  code: 'M3D',
                                  isDefault: false
                              },
                              {
                                  code: 'M2W',
                                  isDefault: true
                              },
                              {
                                  code: 'M5W',
                                  isDefault: false
                              }
                          ]
                      }
                  ]
              }
          ],
          selectionTitle: 'Deliver time'
      }
    ],
    curationMeta: {
        name: 'Fitted with Waistband',
        description: '',
        styleDescription: '',
        keywords: '',
        permaLink: 'FPG1001'
    },
    layerCads: []
};

const legacyProductJSON = {
    id: 1677,
    productId: 1677,
    cartId: 66862,
    returnDescription:
        'Shipping is free on your customized item. <a href="/faqs#collapse-returns-policy" target="_blank">Learn more</a>',
    deliveryTimeDescription: 'Estimated Delivery in 8 weeks',
    curationMeta: {
        name: 'The Carson Dress',
        description:
            '<p>Pretty in pleats. The Carson Dress is a maxi dress featuring a plunging neckline and backline, a defined waist, and a flowing skirt. It has a n invisible zip closure.</p>',
        keywords: null,
        styleDescription: null,
        permaLink: 'the-carson-dress'
    },
    isAvailable: true,
    price: 27900,
    paymentMethods: {
        afterPay: false
    },
    size: {
        minHeightCm: 147,
        maxHeightCm: 193,
        minHeightInch: 58,
        maxHeightInch: 76,
        sizeChart: '2016_v2'
    },
    components: [
        {
            cartId: 204,
            code: 'lemon-light-georgette',
            isDefault: false,
            title: 'Lemon Light Georgette',
            componentTypeId: 'ColorAndFabric',
            componentTypeCategory: 'ColorAndFabric',
            price: 0,
            isProductCode: true,
            isRecommended: true,
            type: 'Fabric',
            sortOrder: 1007,
            meta: {
                image: {
                    url: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG16-LEMON-LIGHT-GEORGETTE.jpg',
                    width: 0,
                    height: 0
                },
                colorId: 45,
                colorCode: 'lemon',
                colorTitle: 'Lemon',
                careDescription: '<p>Professional dry-clean only. <br />See label for further details.</p>',
                fabricDescription:
                    'Main: 100% polyester light georgette\nMain: 100% polyester heavy georgette\nTrim: Nylon invisible zip with hook & eye closure'
            },
            img: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG16-LEMON-LIGHT-GEORGETTE.jpg',
            incompatibleWith: {}
        },
        {
            cartId: 190,
            code: 'black-light-georgette',
            isDefault: false,
            title: 'Black Light Georgette',
            componentTypeId: 'ColorAndFabric',
            componentTypeCategory: 'ColorAndFabric',
            price: 1600,
            isProductCode: true,
            isRecommended: false,
            type: 'Fabric',
            sortOrder: 992,
            meta: {
                image: {
                    url: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG1-BLACK-LIGHT-GEORGETTE.jpg',
                    width: 0,
                    height: 0
                },
                colorId: 25,
                colorCode: 'black',
                colorTitle: 'Black',
                careDescription: '<p>Professional dry-clean only. <br />See label for further details.</p>',
                fabricDescription:
                    'Main: 100% polyester light georgette\nMain: 100% polyester heavy georgette\nTrim: Nylon invisible zip with hook & eye closure'
            },
            img: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG1-BLACK-LIGHT-GEORGETTE.jpg',
            incompatibleWith: {
                allOptions: [['fast_making']]
            }
        },
        {
            cartId: 191,
            code: 'burnt-orange-light-georgette',
            isDefault: false,
            title: 'Burnt Orange Light Georgette',
            componentTypeId: 'ColorAndFabric',
            componentTypeCategory: 'ColorAndFabric',
            price: 1600,
            isProductCode: true,
            isRecommended: false,
            type: 'Fabric',
            sortOrder: 993,
            meta: {
                image: {
                    url: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG2-BURNT-ORANGE-LIGHT-GEORGETTE.jpg',
                    width: 0,
                    height: 0
                },
                colorId: 167,
                colorCode: 'burnt-orange',
                colorTitle: 'Burnt Orange',
                careDescription: '<p>Professional dry-clean only. <br />See label for further details.</p>',
                fabricDescription:
                    'Main: 100% polyester light georgette\nMain: 100% polyester heavy georgette\nTrim: Nylon invisible zip with hook & eye closure'
            },
            img: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG2-BURNT-ORANGE-LIGHT-GEORGETTE.jpg',
            incompatibleWith: {
                allOptions: [['fast_making']]
            }
        },
        {
            cartId: 192,
            code: 'cherry-red-light-georgette',
            isDefault: false,
            title: 'Cherry Red Light Georgette',
            componentTypeId: 'ColorAndFabric',
            componentTypeCategory: 'ColorAndFabric',
            price: 1600,
            isProductCode: true,
            isRecommended: false,
            type: 'Fabric',
            sortOrder: 994,
            meta: {
                image: {
                    url: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG49-CHERRY-RED-LIGHT-GEORGETTE.jpg',
                    width: 0,
                    height: 0
                },
                colorId: 42,
                colorCode: 'cherry-red',
                colorTitle: 'Cherry Red',
                careDescription: '<p>Professional dry-clean only. <br />See label for further details.</p>',
                fabricDescription:
                    'Main: 100% polyester light georgette\nMain: 100% polyester heavy georgette\nTrim: Nylon invisible zip with hook & eye closure'
            },
            img: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG49-CHERRY-RED-LIGHT-GEORGETTE.jpg',
            incompatibleWith: {
                allOptions: [['fast_making']]
            }
        },
        {
            cartId: 193,
            code: 'rose-light-georgette',
            isDefault: false,
            title: 'Rose Light Georgette',
            componentTypeId: 'ColorAndFabric',
            componentTypeCategory: 'ColorAndFabric',
            price: 1600,
            isProductCode: true,
            isRecommended: false,
            type: 'Fabric',
            sortOrder: 995,
            meta: {
                image: {
                    url: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG4-ROSE-LIGHT-GEORGETTE.jpg',
                    width: 0,
                    height: 0
                },
                colorId: 126,
                colorCode: 'rose',
                colorTitle: 'Rose',
                careDescription: '<p>Professional dry-clean only. <br />See label for further details.</p>',
                fabricDescription:
                    'Main: 100% polyester light georgette\nMain: 100% polyester heavy georgette\nTrim: Nylon invisible zip with hook & eye closure'
            },
            img: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG4-ROSE-LIGHT-GEORGETTE.jpg',
            incompatibleWith: {
                allOptions: [['fast_making']]
            }
        },
        {
            cartId: 194,
            code: 'burgundy-light-georgette',
            isDefault: false,
            title: 'Burgundy Light Georgette',
            componentTypeId: 'ColorAndFabric',
            componentTypeCategory: 'ColorAndFabric',
            price: 1600,
            isProductCode: true,
            isRecommended: false,
            type: 'Fabric',
            sortOrder: 996,
            meta: {
                image: {
                    url: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG5-BURGUNDY-LIGHT-GEORGETTE.jpg',
                    width: 0,
                    height: 0
                },
                colorId: 89,
                colorCode: 'burgundy',
                colorTitle: 'Burgundy',
                careDescription: '<p>Professional dry-clean only. <br />See label for further details.</p>',
                fabricDescription:
                    'Main: 100% polyester light georgette\nMain: 100% polyester heavy georgette\nTrim: Nylon invisible zip with hook & eye closure'
            },
            img: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG5-BURGUNDY-LIGHT-GEORGETTE.jpg',
            incompatibleWith: {
                allOptions: [['fast_making']]
            }
        },
        {
            cartId: 195,
            code: 'champagne-light-georgette',
            isDefault: false,
            title: 'Champagne Light Georgette',
            componentTypeId: 'ColorAndFabric',
            componentTypeCategory: 'ColorAndFabric',
            price: 1600,
            isProductCode: true,
            isRecommended: false,
            type: 'Fabric',
            sortOrder: 997,
            meta: {
                image: {
                    url: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG6-CHAMPAGNE-LIGHT-GEORGETTE.jpg',
                    width: 0,
                    height: 0
                },
                colorId: 82,
                colorCode: 'champagne',
                colorTitle: 'Champagne',
                careDescription: '<p>Professional dry-clean only. <br />See label for further details.</p>',
                fabricDescription:
                    'Main: 100% polyester light georgette\nMain: 100% polyester heavy georgette\nTrim: Nylon invisible zip with hook & eye closure'
            },
            img: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG6-CHAMPAGNE-LIGHT-GEORGETTE.jpg',
            incompatibleWith: {
                allOptions: [['fast_making']]
            }
        },
        {
            cartId: 196,
            code: 'bright-turquoise-light-georgette',
            isDefault: false,
            title: 'Bright Turquoise Light Georgette',
            componentTypeId: 'ColorAndFabric',
            componentTypeCategory: 'ColorAndFabric',
            price: 1600,
            isProductCode: true,
            isRecommended: false,
            type: 'Fabric',
            sortOrder: 998,
            meta: {
                image: {
                    url: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG7-BRIGHT-TURQUOISE-LIGHT-GEORGETTE.jpg',
                    width: 0,
                    height: 0
                },
                colorId: 390,
                colorCode: 'bright-turquoise',
                colorTitle: 'Bright Turquoise',
                careDescription: '<p>Professional dry-clean only. <br />See label for further details.</p>',
                fabricDescription:
                    'Main: 100% polyester light georgette\nMain: 100% polyester heavy georgette\nTrim: Nylon invisible zip with hook & eye closure'
            },
            img: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG7-BRIGHT-TURQUOISE-LIGHT-GEORGETTE.jpg',
            incompatibleWith: {
                allOptions: [['fast_making']]
            }
        },
        {
            cartId: 197,
            code: 'cobalt-light-georgette',
            isDefault: false,
            title: 'Cobalt Light Georgette',
            componentTypeId: 'ColorAndFabric',
            componentTypeCategory: 'ColorAndFabric',
            price: 1600,
            isProductCode: true,
            isRecommended: false,
            type: 'Fabric',
            sortOrder: 999,
            meta: {
                image: {
                    url: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG8-COBALT-LIGHT-GEORGETTE.jpg',
                    width: 0,
                    height: 0
                },
                colorId: 479,
                colorCode: 'cobalt',
                colorTitle: 'Cobalt',
                careDescription: '<p>Professional dry-clean only. <br />See label for further details.</p>',
                fabricDescription:
                    'Main: 100% polyester light georgette\nMain: 100% polyester heavy georgette\nTrim: Nylon invisible zip with hook & eye closure'
            },
            img: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG8-COBALT-LIGHT-GEORGETTE.jpg',
            incompatibleWith: {
                allOptions: [['fast_making']]
            }
        },
        {
            cartId: 198,
            code: 'coral-light-georgette',
            isDefault: false,
            title: 'Coral Light Georgette',
            componentTypeId: 'ColorAndFabric',
            componentTypeCategory: 'ColorAndFabric',
            price: 1600,
            isProductCode: true,
            isRecommended: false,
            type: 'Fabric',
            sortOrder: 1000,
            meta: {
                image: {
                    url: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG9-CORAL-LIGHT-GEORGETTE.jpg',
                    width: 0,
                    height: 0
                },
                colorId: 49,
                colorCode: 'coral',
                colorTitle: 'Coral',
                careDescription: '<p>Professional dry-clean only. <br />See label for further details.</p>',
                fabricDescription:
                    'Main: 100% polyester light georgette\nMain: 100% polyester heavy georgette\nTrim: Nylon invisible zip with hook & eye closure'
            },
            img: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG9-CORAL-LIGHT-GEORGETTE.jpg',
            incompatibleWith: {
                allOptions: [['fast_making']]
            }
        },
        {
            cartId: 111,
            code: 'emerald-green-light-georgette',
            isDefault: false,
            title: 'Emerald Green Light Georgette',
            componentTypeId: 'ColorAndFabric',
            componentTypeCategory: 'ColorAndFabric',
            price: 1600,
            isProductCode: true,
            isRecommended: false,
            type: 'Fabric',
            sortOrder: 275,
            meta: {
                image: {
                    url: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG10-EMERALD-GREEN-LIGHT-GEORGETTE.jpg',
                    width: 0,
                    height: 0
                },
                colorId: 77,
                colorCode: 'emerald-green',
                colorTitle: 'Emerald Green',
                careDescription: '<p>Professional dry-clean only. <br />See label for further details.</p>',
                fabricDescription:
                    'Main: 100% polyester light georgette\nMain: 100% polyester heavy georgette\nTrim: Nylon invisible zip with hook & eye closure'
            },
            img: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG10-EMERALD-GREEN-LIGHT-GEORGETTE.jpg',
            incompatibleWith: {
                allOptions: [['fast_making']]
            }
        },
        {
            cartId: 199,
            code: 'forest-green-light-georgette',
            isDefault: false,
            title: 'Forest Green Light Georgette',
            componentTypeId: 'ColorAndFabric',
            componentTypeCategory: 'ColorAndFabric',
            price: 1600,
            isProductCode: true,
            isRecommended: false,
            type: 'Fabric',
            sortOrder: 1002,
            meta: {
                image: {
                    url: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG11-FOREST-GREEN-LIGHT-GEORGETTE.jpg',
                    width: 0,
                    height: 0
                },
                colorId: 266,
                colorCode: 'forest-green',
                colorTitle: 'Forest Green',
                careDescription: '<p>Professional dry-clean only. <br />See label for further details.</p>',
                fabricDescription:
                    'Main: 100% polyester light georgette\nMain: 100% polyester heavy georgette\nTrim: Nylon invisible zip with hook & eye closure'
            },
            img: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG11-FOREST-GREEN-LIGHT-GEORGETTE.jpg',
            incompatibleWith: {
                allOptions: [['fast_making']]
            }
        },
        {
            cartId: 200,
            code: 'hot-pink-light-georgette',
            isDefault: false,
            title: 'Hot Pink Light Georgette',
            componentTypeId: 'ColorAndFabric',
            componentTypeCategory: 'ColorAndFabric',
            price: 1600,
            isProductCode: true,
            isRecommended: false,
            type: 'Fabric',
            sortOrder: 1003,
            meta: {
                image: {
                    url: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG12-HOT-PINK-LIGHT-GEORGETTE.jpg',
                    width: 0,
                    height: 0
                },
                colorId: 58,
                colorCode: 'hot-pink',
                colorTitle: 'Hot Pink',
                careDescription: '<p>Professional dry-clean only. <br />See label for further details.</p>',
                fabricDescription:
                    'Main: 100% polyester light georgette\nMain: 100% polyester heavy georgette\nTrim: Nylon invisible zip with hook & eye closure'
            },
            img: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG12-HOT-PINK-LIGHT-GEORGETTE.jpg',
            incompatibleWith: {
                allOptions: [['fast_making']]
            }
        },
        {
            cartId: 201,
            code: 'cream-light-georgette',
            isDefault: false,
            title: 'Cream Light Georgette',
            componentTypeId: 'ColorAndFabric',
            componentTypeCategory: 'ColorAndFabric',
            price: 1600,
            isProductCode: true,
            isRecommended: false,
            type: 'Fabric',
            sortOrder: 1004,
            meta: {
                image: {
                    url: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG13-CREAM-LIGHT-GEORGETTE.jpg',
                    width: 0,
                    height: 0
                },
                colorId: 85,
                colorCode: 'cream',
                colorTitle: 'Cream',
                careDescription: '<p>Professional dry-clean only. <br />See label for further details.</p>',
                fabricDescription:
                    'Main: 100% polyester light georgette\nMain: 100% polyester heavy georgette\nTrim: Nylon invisible zip with hook & eye closure'
            },
            img: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG13-CREAM-LIGHT-GEORGETTE.jpg',
            incompatibleWith: {
                allOptions: [['fast_making']]
            }
        },
        {
            cartId: 202,
            code: 'ivory-light-georgette',
            isDefault: false,
            title: 'Ivory Light Georgette',
            componentTypeId: 'ColorAndFabric',
            componentTypeCategory: 'ColorAndFabric',
            price: 1600,
            isProductCode: true,
            isRecommended: false,
            type: 'Fabric',
            sortOrder: 1005,
            meta: {
                image: {
                    url: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG14-IVORY-LIGHT-GEORGETTE.jpg',
                    width: 0,
                    height: 0
                },
                colorId: 65,
                colorCode: 'ivory',
                colorTitle: 'Ivory',
                careDescription: '<p>Professional dry-clean only. <br />See label for further details.</p>',
                fabricDescription:
                    'Main: 100% polyester light georgette\nMain: 100% polyester heavy georgette\nTrim: Nylon invisible zip with hook & eye closure'
            },
            img: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG14-IVORY-LIGHT-GEORGETTE.jpg',
            incompatibleWith: {
                allOptions: [['fast_making']]
            }
        },
        {
            cartId: 203,
            code: 'dark-chocolate-light-georgette',
            isDefault: false,
            title: 'Dark Chocolate Light Georgette',
            componentTypeId: 'ColorAndFabric',
            componentTypeCategory: 'ColorAndFabric',
            price: 1600,
            isProductCode: true,
            isRecommended: false,
            type: 'Fabric',
            sortOrder: 1006,
            meta: {
                image: {
                    url: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG15-DARK-CHOCOLATE-LIGHT-GEORGETTE.jpg',
                    width: 0,
                    height: 0
                },
                colorId: 297,
                colorCode: 'dark-chocolate',
                colorTitle: 'Dark Chocolate',
                careDescription: '<p>Professional dry-clean only. <br />See label for further details.</p>',
                fabricDescription:
                    'Main: 100% polyester light georgette\nMain: 100% polyester heavy georgette\nTrim: Nylon invisible zip with hook & eye closure'
            },
            img: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG15-DARK-CHOCOLATE-LIGHT-GEORGETTE.jpg',
            incompatibleWith: {
                allOptions: [['fast_making']]
            }
        },
        {
            cartId: 205,
            code: 'plum-light-georgette',
            isDefault: false,
            title: 'Plum Light Georgette',
            componentTypeId: 'ColorAndFabric',
            componentTypeCategory: 'ColorAndFabric',
            price: 1600,
            isProductCode: true,
            isRecommended: false,
            type: 'Fabric',
            sortOrder: 1008,
            meta: {
                image: {
                    url: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG17-PLUM-LIGHT-GEORGETTE.jpg',
                    width: 0,
                    height: 0
                },
                colorId: 158,
                colorCode: 'plum',
                colorTitle: 'Plum',
                careDescription: '<p>Professional dry-clean only. <br />See label for further details.</p>',
                fabricDescription:
                    'Main: 100% polyester light georgette\nMain: 100% polyester heavy georgette\nTrim: Nylon invisible zip with hook & eye closure'
            },
            img: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG17-PLUM-LIGHT-GEORGETTE.jpg',
            incompatibleWith: {
                allOptions: [['fast_making']]
            }
        },
        {
            cartId: 206,
            code: 'lilac-light-georgette',
            isDefault: false,
            title: 'Lilac Light Georgette',
            componentTypeId: 'ColorAndFabric',
            componentTypeCategory: 'ColorAndFabric',
            price: 1600,
            isProductCode: true,
            isRecommended: false,
            type: 'Fabric',
            sortOrder: 1009,
            meta: {
                image: {
                    url: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG18-LILAC-LIGHT-GEORGETTE.jpg',
                    width: 0,
                    height: 0
                },
                colorId: 61,
                colorCode: 'lilac',
                colorTitle: 'Lilac',
                careDescription: '<p>Professional dry-clean only. <br />See label for further details.</p>',
                fabricDescription:
                    'Main: 100% polyester light georgette\nMain: 100% polyester heavy georgette\nTrim: Nylon invisible zip with hook & eye closure'
            },
            img: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG18-LILAC-LIGHT-GEORGETTE.jpg',
            incompatibleWith: {
                allOptions: [['fast_making']]
            }
        },
        {
            cartId: 207,
            code: 'lavender-light-georgette',
            isDefault: false,
            title: 'Lavender Light Georgette',
            componentTypeId: 'ColorAndFabric',
            componentTypeCategory: 'ColorAndFabric',
            price: 1600,
            isProductCode: true,
            isRecommended: false,
            type: 'Fabric',
            sortOrder: 1010,
            meta: {
                image: {
                    url: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG19-LAVENDER-LIGHT-GEORGETTE.jpg',
                    width: 0,
                    height: 0
                },
                colorId: 87,
                colorCode: 'lavender',
                colorTitle: 'Lavender',
                careDescription: '<p>Professional dry-clean only. <br />See label for further details.</p>',
                fabricDescription:
                    'Main: 100% polyester light georgette\nMain: 100% polyester heavy georgette\nTrim: Nylon invisible zip with hook & eye closure'
            },
            img: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG19-LAVENDER-LIGHT-GEORGETTE.jpg',
            incompatibleWith: {
                allOptions: [['fast_making']]
            }
        },
        {
            cartId: 208,
            code: 'dark-lavender-light-georgette',
            isDefault: false,
            title: 'Dark Lavender Light Georgette',
            componentTypeId: 'ColorAndFabric',
            componentTypeCategory: 'ColorAndFabric',
            price: 1600,
            isProductCode: true,
            isRecommended: false,
            type: 'Fabric',
            sortOrder: 1011,
            meta: {
                image: {
                    url: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG20-DARK-LAVeNDER-LIGHT-GEORGETTE.jpg',
                    width: 0,
                    height: 0
                },
                colorId: 282,
                colorCode: 'dark-lavender',
                colorTitle: 'Dark Lavender',
                careDescription: '<p>Professional dry-clean only. <br />See label for further details.</p>',
                fabricDescription:
                    'Main: 100% polyester light georgette\nMain: 100% polyester heavy georgette\nTrim: Nylon invisible zip with hook & eye closure'
            },
            img: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG20-DARK-LAVeNDER-LIGHT-GEORGETTE.jpg',
            incompatibleWith: {
                allOptions: [['fast_making']]
            }
        },
        {
            cartId: 209,
            code: 'mint-light-georgette',
            isDefault: false,
            title: 'Mint Light Georgette',
            componentTypeId: 'ColorAndFabric',
            componentTypeCategory: 'ColorAndFabric',
            price: 1600,
            isProductCode: true,
            isRecommended: false,
            type: 'Fabric',
            sortOrder: 1012,
            meta: {
                image: {
                    url: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG21-MINT-LIGHT-GEORGETTE.jpg',
                    width: 0,
                    height: 0
                },
                colorId: 55,
                colorCode: 'mint',
                colorTitle: 'Mint',
                careDescription: '<p>Professional dry-clean only. <br />See label for further details.</p>',
                fabricDescription:
                    'Main: 100% polyester light georgette\nMain: 100% polyester heavy georgette\nTrim: Nylon invisible zip with hook & eye closure'
            },
            img: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG21-MINT-LIGHT-GEORGETTE.jpg',
            incompatibleWith: {
                allOptions: [['fast_making']]
            }
        },
        {
            cartId: 188,
            code: 'navy-light-georgette',
            isDefault: false,
            title: 'Navy Light Georgette',
            componentTypeId: 'ColorAndFabric',
            componentTypeCategory: 'ColorAndFabric',
            price: 1600,
            isProductCode: true,
            isRecommended: false,
            type: 'Fabric',
            sortOrder: 990,
            meta: {
                image: {
                    url: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG22-NAVY-LIGHT-GEORGETTE.jpg',
                    width: 0,
                    height: 0
                },
                colorId: 70,
                colorCode: 'navy',
                colorTitle: 'Navy',
                careDescription: '<p>Professional dry-clean only. <br />See label for further details.</p>',
                fabricDescription:
                    'Main: 100% polyester light georgette\nMain: 100% polyester heavy georgette\nTrim: Nylon invisible zip with hook & eye closure'
            },
            img: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG22-NAVY-LIGHT-GEORGETTE.jpg',
            incompatibleWith: {
                allOptions: [['fast_making']]
            }
        },
        {
            cartId: 211,
            code: 'pale-blue-light-georgette',
            isDefault: false,
            title: 'Pale Blue Light Georgette',
            componentTypeId: 'ColorAndFabric',
            componentTypeCategory: 'ColorAndFabric',
            price: 1600,
            isProductCode: true,
            isRecommended: false,
            type: 'Fabric',
            sortOrder: 1014,
            meta: {
                image: {
                    url: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG24-PALE-BLUE-LIGHT-GEORGETTE.jpg',
                    width: 0,
                    height: 0
                },
                colorId: 79,
                colorCode: 'pale-blue',
                colorTitle: 'Pale Blue',
                careDescription: '<p>Professional dry-clean only. <br />See label for further details.</p>',
                fabricDescription:
                    'Main: 100% polyester light georgette\nMain: 100% polyester heavy georgette\nTrim: Nylon invisible zip with hook & eye closure'
            },
            img: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG24-PALE-BLUE-LIGHT-GEORGETTE.jpg',
            incompatibleWith: {
                allOptions: [['fast_making']]
            }
        },
        {
            cartId: 212,
            code: 'pale-grey-light-georgette',
            isDefault: false,
            title: 'Pale Grey Light Georgette',
            componentTypeId: 'ColorAndFabric',
            componentTypeCategory: 'ColorAndFabric',
            price: 1600,
            isProductCode: true,
            isRecommended: false,
            type: 'Fabric',
            sortOrder: 1015,
            meta: {
                image: {
                    url: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG25-PALE-GREY-LIGHT-GEORGETTE.jpg',
                    width: 0,
                    height: 0
                },
                colorId: 179,
                colorCode: 'pale-grey',
                colorTitle: 'Pale Grey',
                careDescription: '<p>Professional dry-clean only. <br />See label for further details.</p>',
                fabricDescription:
                    'Main: 100% polyester light georgette\nMain: 100% polyester heavy georgette\nTrim: Nylon invisible zip with hook & eye closure'
            },
            img: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG25-PALE-GREY-LIGHT-GEORGETTE.jpg',
            incompatibleWith: {
                allOptions: [['fast_making']]
            }
        },
        {
            cartId: 213,
            code: 'pale-pink-light-georgette',
            isDefault: false,
            title: 'Pale Pink Light Georgette',
            componentTypeId: 'ColorAndFabric',
            componentTypeCategory: 'ColorAndFabric',
            price: 1600,
            isProductCode: true,
            isRecommended: false,
            type: 'Fabric',
            sortOrder: 1016,
            meta: {
                image: {
                    url: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG26-PALE-PINK-LIGHT-GEORGETTE.jpg',
                    width: 0,
                    height: 0
                },
                colorId: 57,
                colorCode: 'pale-pink',
                colorTitle: 'Pale Pink',
                careDescription: '<p>Professional dry-clean only. <br />See label for further details.</p>',
                fabricDescription:
                    'Main: 100% polyester light georgette\nMain: 100% polyester heavy georgette\nTrim: Nylon invisible zip with hook & eye closure'
            },
            img: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG26-PALE-PINK-LIGHT-GEORGETTE.jpg',
            incompatibleWith: {
                allOptions: [['fast_making']]
            }
        },
        {
            cartId: 214,
            code: 'peach-light-georgette',
            isDefault: false,
            title: 'Peach Light Georgette',
            componentTypeId: 'ColorAndFabric',
            componentTypeCategory: 'ColorAndFabric',
            price: 1600,
            isProductCode: true,
            isRecommended: false,
            type: 'Fabric',
            sortOrder: 1017,
            meta: {
                image: {
                    url: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG27-Peach-LIGHT-GEORGETTE.jpg',
                    width: 0,
                    height: 0
                },
                colorId: 39,
                colorCode: 'peach',
                colorTitle: 'Peach',
                careDescription: '<p>Professional dry-clean only. <br />See label for further details.</p>',
                fabricDescription:
                    'Main: 100% polyester light georgette\nMain: 100% polyester heavy georgette\nTrim: Nylon invisible zip with hook & eye closure'
            },
            img: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG27-Peach-LIGHT-GEORGETTE.jpg',
            incompatibleWith: {
                allOptions: [['fast_making']]
            }
        },
        {
            cartId: 215,
            code: 'magenta-light-georgette',
            isDefault: false,
            title: 'Magenta Light Georgette',
            componentTypeId: 'ColorAndFabric',
            componentTypeCategory: 'ColorAndFabric',
            price: 1600,
            isProductCode: true,
            isRecommended: false,
            type: 'Fabric',
            sortOrder: 1018,
            meta: {
                image: {
                    url: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG28-MAGENTA-LIGHT-GEORGETTE.jpg',
                    width: 0,
                    height: 0
                },
                colorId: 142,
                colorCode: 'magenta',
                colorTitle: 'Magenta',
                careDescription: '<p>Professional dry-clean only. <br />See label for further details.</p>',
                fabricDescription:
                    'Main: 100% polyester light georgette\nMain: 100% polyester heavy georgette\nTrim: Nylon invisible zip with hook & eye closure'
            },
            img: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG28-MAGENTA-LIGHT-GEORGETTE.jpg',
            incompatibleWith: {
                allOptions: [['fast_making']]
            }
        },
        {
            cartId: 189,
            code: 'red-light-georgette',
            isDefault: false,
            title: 'Red Light Georgette',
            componentTypeId: 'ColorAndFabric',
            componentTypeCategory: 'ColorAndFabric',
            price: 1600,
            isProductCode: true,
            isRecommended: false,
            type: 'Fabric',
            sortOrder: 991,
            meta: {
                image: {
                    url: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG29-RED-LIGHT-GEORGETTE.jpg',
                    width: 0,
                    height: 0
                },
                colorId: 26,
                colorCode: 'red',
                colorTitle: 'Red',
                careDescription: '<p>Professional dry-clean only. <br />See label for further details.</p>',
                fabricDescription:
                    'Main: 100% polyester light georgette\nMain: 100% polyester heavy georgette\nTrim: Nylon invisible zip with hook & eye closure'
            },
            img: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG29-RED-LIGHT-GEORGETTE.jpg',
            incompatibleWith: {
                allOptions: [['fast_making']]
            }
        },
        {
            cartId: 216,
            code: 'orange-light-georgette',
            isDefault: false,
            title: 'Orange Light Georgette',
            componentTypeId: 'ColorAndFabric',
            componentTypeCategory: 'ColorAndFabric',
            price: 1600,
            isProductCode: true,
            isRecommended: false,
            type: 'Fabric',
            sortOrder: 1019,
            meta: {
                image: {
                    url: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG30-ORANGE-LIGHT-GEORGETTE.jpg',
                    width: 0,
                    height: 0
                },
                colorId: 35,
                colorCode: 'orange',
                colorTitle: 'Orange',
                careDescription: '<p>Professional dry-clean only. <br />See label for further details.</p>',
                fabricDescription:
                    'Main: 100% polyester light georgette\nMain: 100% polyester heavy georgette\nTrim: Nylon invisible zip with hook & eye closure'
            },
            img: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG30-ORANGE-LIGHT-GEORGETTE.jpg',
            incompatibleWith: {
                allOptions: [['fast_making']]
            }
        },
        {
            cartId: 217,
            code: 'teal-light-georgette',
            isDefault: false,
            title: 'Teal Light Georgette',
            componentTypeId: 'ColorAndFabric',
            componentTypeCategory: 'ColorAndFabric',
            price: 1600,
            isProductCode: true,
            isRecommended: false,
            type: 'Fabric',
            sortOrder: 1020,
            meta: {
                image: {
                    url: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG31-TEAL-LIGHT-GEORGETTE.jpg',
                    width: 0,
                    height: 0
                },
                colorId: 222,
                colorCode: 'teal',
                colorTitle: 'Teal',
                careDescription: '<p>Professional dry-clean only. <br />See label for further details.</p>',
                fabricDescription:
                    'Main: 100% polyester light georgette\nMain: 100% polyester heavy georgette\nTrim: Nylon invisible zip with hook & eye closure'
            },
            img: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG31-TEAL-LIGHT-GEORGETTE.jpg',
            incompatibleWith: {
                allOptions: [['fast_making']]
            }
        },
        {
            cartId: 218,
            code: 'indigo-light-georgette',
            isDefault: false,
            title: 'Indigo Light Georgette',
            componentTypeId: 'ColorAndFabric',
            componentTypeCategory: 'ColorAndFabric',
            price: 1600,
            isProductCode: true,
            isRecommended: false,
            type: 'Fabric',
            sortOrder: 1021,
            meta: {
                image: {
                    url: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG32-INDIGO-LIGHT-GEORGETTE.jpg',
                    width: 0,
                    height: 0
                },
                colorId: 203,
                colorCode: 'indigo',
                colorTitle: 'Indigo',
                careDescription: '<p>Professional dry-clean only. <br />See label for further details.</p>',
                fabricDescription:
                    'Main: 100% polyester light georgette\nMain: 100% polyester heavy georgette\nTrim: Nylon invisible zip with hook & eye closure'
            },
            img: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG32-INDIGO-LIGHT-GEORGETTE.jpg',
            incompatibleWith: {
                allOptions: [['fast_making']]
            }
        },
        {
            cartId: 219,
            code: 'spring-posey-light-georgette',
            isDefault: false,
            title: 'Spring Posey Light Georgette',
            componentTypeId: 'ColorAndFabric',
            componentTypeCategory: 'ColorAndFabric',
            price: 1600,
            isProductCode: true,
            isRecommended: false,
            type: 'Fabric',
            sortOrder: 1022,
            meta: {
                image: {
                    url: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG34-SPRING-POSEY-LIGHT-GEORGETTE.jpg',
                    width: 0,
                    height: 0
                },
                colorId: 498,
                colorCode: 'spring-posey',
                colorTitle: 'Spring Posey',
                careDescription: '<p>Professional dry-clean only. <br />See label for further details.</p>',
                fabricDescription:
                    'Main: 100% polyester light georgette\nMain: 100% polyester heavy georgette\nTrim: Nylon invisible zip with hook & eye closure'
            },
            img: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG34-SPRING-POSEY-LIGHT-GEORGETTE.jpg',
            incompatibleWith: {
                allOptions: [['fast_making']]
            }
        },
        {
            cartId: 220,
            code: 'sand-light-georgette',
            isDefault: false,
            title: 'Sand Light Georgette',
            componentTypeId: 'ColorAndFabric',
            componentTypeCategory: 'ColorAndFabric',
            price: 1600,
            isProductCode: true,
            isRecommended: false,
            type: 'Fabric',
            sortOrder: 1023,
            meta: {
                image: {
                    url: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG35-SAND-LIGHT-GEORGETTE.jpg',
                    width: 0,
                    height: 0
                },
                colorId: 214,
                colorCode: 'sand',
                colorTitle: 'Sand',
                careDescription: '<p>Professional dry-clean only. <br />See label for further details.</p>',
                fabricDescription:
                    'Main: 100% polyester light georgette\nMain: 100% polyester heavy georgette\nTrim: Nylon invisible zip with hook & eye closure'
            },
            img: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG35-SAND-LIGHT-GEORGETTE.jpg',
            incompatibleWith: {
                allOptions: [['fast_making']]
            }
        },
        {
            cartId: 221,
            code: 'tan-light-georgette',
            isDefault: false,
            title: 'Tan Light Georgette',
            componentTypeId: 'ColorAndFabric',
            componentTypeCategory: 'ColorAndFabric',
            price: 1600,
            isProductCode: true,
            isRecommended: false,
            type: 'Fabric',
            sortOrder: 1024,
            meta: {
                image: {
                    url: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG36-TAN-LIGHT-GEORGETTE.jpg',
                    width: 0,
                    height: 0
                },
                colorId: 241,
                colorCode: 'tan',
                colorTitle: 'Tan',
                careDescription: '<p>Professional dry-clean only. <br />See label for further details.</p>',
                fabricDescription:
                    'Main: 100% polyester light georgette\nMain: 100% polyester heavy georgette\nTrim: Nylon invisible zip with hook & eye closure'
            },
            img: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG36-TAN-LIGHT-GEORGETTE.jpg',
            incompatibleWith: {
                allOptions: [['fast_making']]
            }
        },
        {
            cartId: 222,
            code: 'taupe-light-georgette',
            isDefault: false,
            title: 'Taupe Light Georgette',
            componentTypeId: 'ColorAndFabric',
            componentTypeCategory: 'ColorAndFabric',
            price: 1600,
            isProductCode: true,
            isRecommended: false,
            type: 'Fabric',
            sortOrder: 1025,
            meta: {
                image: {
                    url: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG37-TAUPE-LIGHT-GEORGETTE.jpg',
                    width: 0,
                    height: 0
                },
                colorId: 59,
                colorCode: 'taupe',
                colorTitle: 'Taupe',
                careDescription: '<p>Professional dry-clean only. <br />See label for further details.</p>',
                fabricDescription:
                    'Main: 100% polyester light georgette\nMain: 100% polyester heavy georgette\nTrim: Nylon invisible zip with hook & eye closure'
            },
            img: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG37-TAUPE-LIGHT-GEORGETTE.jpg',
            incompatibleWith: {
                allOptions: [['fast_making']]
            }
        },
        {
            cartId: 223,
            code: 'turqoise-light-georgette',
            isDefault: false,
            title: 'Turqoise Light Georgette',
            componentTypeId: 'ColorAndFabric',
            componentTypeCategory: 'ColorAndFabric',
            price: 1600,
            isProductCode: true,
            isRecommended: false,
            type: 'Fabric',
            sortOrder: 1026,
            meta: {
                image: {
                    url: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG38-TURQOISE-LIGHT-GEORGETTE.jpg',
                    width: 0,
                    height: 0
                },
                colorId: 1497,
                colorCode: 'turqoise',
                colorTitle: 'Turqoise',
                careDescription: '<p>Professional dry-clean only. <br />See label for further details.</p>',
                fabricDescription:
                    'Main: 100% polyester light georgette\nMain: 100% polyester heavy georgette\nTrim: Nylon invisible zip with hook & eye closure'
            },
            img: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG38-TURQOISE-LIGHT-GEORGETTE.jpg',
            incompatibleWith: {
                allOptions: [['fast_making']]
            }
        },
        {
            cartId: 224,
            code: 'watermelon-light-georgette',
            isDefault: false,
            title: 'Watermelon Light Georgette',
            componentTypeId: 'ColorAndFabric',
            componentTypeCategory: 'ColorAndFabric',
            price: 1600,
            isProductCode: true,
            isRecommended: false,
            type: 'Fabric',
            sortOrder: 1027,
            meta: {
                image: {
                    url: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG39-WATERMELON-LIGHT-GEORGETTE.jpg',
                    width: 0,
                    height: 0
                },
                colorId: 76,
                colorCode: 'watermelon',
                colorTitle: 'Watermelon',
                careDescription: '<p>Professional dry-clean only. <br />See label for further details.</p>',
                fabricDescription:
                    'Main: 100% polyester light georgette\nMain: 100% polyester heavy georgette\nTrim: Nylon invisible zip with hook & eye closure'
            },
            img: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG39-WATERMELON-LIGHT-GEORGETTE.jpg',
            incompatibleWith: {
                allOptions: [['fast_making']]
            }
        },
        {
            cartId: 225,
            code: 'white-light-georgette',
            isDefault: false,
            title: 'White Light Georgette',
            componentTypeId: 'ColorAndFabric',
            componentTypeCategory: 'ColorAndFabric',
            price: 1600,
            isProductCode: true,
            isRecommended: false,
            type: 'Fabric',
            sortOrder: 1028,
            meta: {
                image: {
                    url: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG40-WHITE-LIGHT-GEORGETTE.jpg',
                    width: 0,
                    height: 0
                },
                colorId: 38,
                colorCode: 'white',
                colorTitle: 'White',
                careDescription: '<p>Professional dry-clean only. <br />See label for further details.</p>',
                fabricDescription:
                    'Main: 100% polyester light georgette\nMain: 100% polyester heavy georgette\nTrim: Nylon invisible zip with hook & eye closure'
            },
            img: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG40-WHITE-LIGHT-GEORGETTE.jpg',
            incompatibleWith: {
                allOptions: [['fast_making']]
            }
        },
        {
            cartId: 226,
            code: 'mid-grey-light-georgette',
            isDefault: false,
            title: 'Mid Grey Light Georgette',
            componentTypeId: 'ColorAndFabric',
            componentTypeCategory: 'ColorAndFabric',
            price: 1600,
            isProductCode: true,
            isRecommended: false,
            type: 'Fabric',
            sortOrder: 1029,
            meta: {
                image: {
                    url: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG41-MID-GREY-LIGHT-GEORGETTE.jpg',
                    width: 0,
                    height: 0
                },
                colorId: 294,
                colorCode: 'mid-grey',
                colorTitle: 'Mid Grey',
                careDescription: '<p>Professional dry-clean only. <br />See label for further details.</p>',
                fabricDescription:
                    'Main: 100% polyester light georgette\nMain: 100% polyester heavy georgette\nTrim: Nylon invisible zip with hook & eye closure'
            },
            img: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG41-MID-GREY-LIGHT-GEORGETTE.jpg',
            incompatibleWith: {
                allOptions: [['fast_making']]
            }
        },
        {
            cartId: 227,
            code: 'charcoal-light-georgette',
            isDefault: false,
            title: 'Charcoal Light Georgette',
            componentTypeId: 'ColorAndFabric',
            componentTypeCategory: 'ColorAndFabric',
            price: 1600,
            isProductCode: true,
            isRecommended: false,
            type: 'Fabric',
            sortOrder: 1030,
            meta: {
                image: {
                    url: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG42-CHARCOAL-LIGHT-GEORGETTE.jpg',
                    width: 0,
                    height: 0
                },
                colorId: 66,
                colorCode: 'charcoal',
                colorTitle: 'Charcoal',
                careDescription: '<p>Professional dry-clean only. <br />See label for further details.</p>',
                fabricDescription:
                    'Main: 100% polyester light georgette\nMain: 100% polyester heavy georgette\nTrim: Nylon invisible zip with hook & eye closure'
            },
            img: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG42-CHARCOAL-LIGHT-GEORGETTE.jpg',
            incompatibleWith: {
                allOptions: [['fast_making']]
            }
        },
        {
            cartId: 228,
            code: 'coffee-light-georgette',
            isDefault: false,
            title: 'Coffee Light Georgette',
            componentTypeId: 'ColorAndFabric',
            componentTypeCategory: 'ColorAndFabric',
            price: 1600,
            isProductCode: true,
            isRecommended: false,
            type: 'Fabric',
            sortOrder: 1031,
            meta: {
                image: {
                    url: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG43-COFFEE-LIGHT-GEORGETTE.jpg',
                    width: 0,
                    height: 0
                },
                colorId: 301,
                colorCode: 'coffee',
                colorTitle: 'Coffee',
                careDescription: '<p>Professional dry-clean only. <br />See label for further details.</p>',
                fabricDescription:
                    'Main: 100% polyester light georgette\nMain: 100% polyester heavy georgette\nTrim: Nylon invisible zip with hook & eye closure'
            },
            img: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG43-COFFEE-LIGHT-GEORGETTE.jpg',
            incompatibleWith: {
                allOptions: [['fast_making']]
            }
        },
        {
            cartId: 229,
            code: 'sunset-orange-light-georgette',
            isDefault: false,
            title: 'Sunset Orange Light Georgette',
            componentTypeId: 'ColorAndFabric',
            componentTypeCategory: 'ColorAndFabric',
            price: 1600,
            isProductCode: true,
            isRecommended: false,
            type: 'Fabric',
            sortOrder: 1032,
            meta: {
                image: {
                    url: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG44-SUNSET-ORANGE-LIGHT-GEORGETTE.jpg',
                    width: 0,
                    height: 0
                },
                colorId: 295,
                colorCode: 'sunset-orange',
                colorTitle: 'Sunset Orange',
                careDescription: '<p>Professional dry-clean only. <br />See label for further details.</p>',
                fabricDescription:
                    'Main: 100% polyester light georgette\nMain: 100% polyester heavy georgette\nTrim: Nylon invisible zip with hook & eye closure'
            },
            img: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG44-SUNSET-ORANGE-LIGHT-GEORGETTE.jpg',
            incompatibleWith: {
                allOptions: [['fast_making']]
            }
        },
        {
            cartId: 230,
            code: 'aqua-light-georgette',
            isDefault: false,
            title: 'Aqua Light Georgette',
            componentTypeId: 'ColorAndFabric',
            componentTypeCategory: 'ColorAndFabric',
            price: 1600,
            isProductCode: true,
            isRecommended: false,
            type: 'Fabric',
            sortOrder: 1033,
            meta: {
                image: {
                    url: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG45-AQUA-LIGHT-GEORGETTE.jpg',
                    width: 0,
                    height: 0
                },
                colorId: 244,
                colorCode: 'aqua',
                colorTitle: 'Aqua',
                careDescription: '<p>Professional dry-clean only. <br />See label for further details.</p>',
                fabricDescription:
                    'Main: 100% polyester light georgette\nMain: 100% polyester heavy georgette\nTrim: Nylon invisible zip with hook & eye closure'
            },
            img: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG45-AQUA-LIGHT-GEORGETTE.jpg',
            incompatibleWith: {
                allOptions: [['fast_making']]
            }
        },
        {
            cartId: 231,
            code: 'army-green-light-georgette',
            isDefault: false,
            title: 'Army green Light Georgette',
            componentTypeId: 'ColorAndFabric',
            componentTypeCategory: 'ColorAndFabric',
            price: 1600,
            isProductCode: true,
            isRecommended: false,
            type: 'Fabric',
            sortOrder: 1034,
            meta: {
                image: {
                    url: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG46-ARMY-GREEN-LIGHT-GEORGETTE.jpg',
                    width: 0,
                    height: 0
                },
                colorId: 299,
                colorCode: 'army-green',
                colorTitle: 'Army green',
                careDescription: '<p>Professional dry-clean only. <br />See label for further details.</p>',
                fabricDescription:
                    'Main: 100% polyester light georgette\nMain: 100% polyester heavy georgette\nTrim: Nylon invisible zip with hook & eye closure'
            },
            img: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG46-ARMY-GREEN-LIGHT-GEORGETTE.jpg',
            incompatibleWith: {
                allOptions: [['fast_making']]
            }
        },
        {
            cartId: 232,
            code: 'blush-light-georgette',
            isDefault: false,
            title: 'Blush Light Georgette',
            componentTypeId: 'ColorAndFabric',
            componentTypeCategory: 'ColorAndFabric',
            price: 1600,
            isProductCode: true,
            isRecommended: false,
            type: 'Fabric',
            sortOrder: 1035,
            meta: {
                image: {
                    url: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG47-BLUSH-LIGHT-GEORGETTE.jpg',
                    width: 0,
                    height: 0
                },
                colorId: 90,
                colorCode: 'blush',
                colorTitle: 'Blush',
                careDescription: '<p>Professional dry-clean only. <br />See label for further details.</p>',
                fabricDescription:
                    'Main: 100% polyester light georgette\nMain: 100% polyester heavy georgette\nTrim: Nylon invisible zip with hook & eye closure'
            },
            img: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG47-BLUSH-LIGHT-GEORGETTE.jpg',
            incompatibleWith: {
                allOptions: [['fast_making']]
            }
        },
        {
            cartId: 233,
            code: 'grey-light-georgette',
            isDefault: false,
            title: 'Grey Light Georgette',
            componentTypeId: 'ColorAndFabric',
            componentTypeCategory: 'ColorAndFabric',
            price: 1600,
            isProductCode: true,
            isRecommended: false,
            type: 'Fabric',
            sortOrder: 1036,
            meta: {
                image: {
                    url: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG48-GREY-LIGHT-GEORGETTE.jpg',
                    width: 0,
                    height: 0
                },
                colorId: 60,
                colorCode: 'grey',
                colorTitle: 'Grey',
                careDescription: '<p>Professional dry-clean only. <br />See label for further details.</p>',
                fabricDescription:
                    'Main: 100% polyester light georgette\nMain: 100% polyester heavy georgette\nTrim: Nylon invisible zip with hook & eye closure'
            },
            img: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG48-GREY-LIGHT-GEORGETTE.jpg',
            incompatibleWith: {
                allOptions: [['fast_making']]
            }
        },
        {
            cartId: 234,
            code: 'cornflower-blue-light-georgette',
            isDefault: false,
            title: 'Cornflower Blue Light Georgette',
            componentTypeId: 'ColorAndFabric',
            componentTypeCategory: 'ColorAndFabric',
            price: 1600,
            isProductCode: true,
            isRecommended: false,
            type: 'Fabric',
            sortOrder: 1038,
            meta: {
                image: {
                    url: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG50-CORNFLOWER-BLUE-LIGHT-GEORGETTE.jpg',
                    width: 0,
                    height: 0
                },
                colorId: 296,
                colorCode: 'cornflower-blue',
                colorTitle: 'Cornflower Blue',
                careDescription: '<p>Professional dry-clean only. <br />See label for further details.</p>',
                fabricDescription:
                    'Main: 100% polyester light georgette\nMain: 100% polyester heavy georgette\nTrim: Nylon invisible zip with hook & eye closure'
            },
            img: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG50-CORNFLOWER-BLUE-LIGHT-GEORGETTE.jpg',
            incompatibleWith: {
                allOptions: [['fast_making']]
            }
        },
        {
            cartId: 235,
            code: 'dark-forest-light-georgette',
            isDefault: false,
            title: 'Dark Forest Light Georgette',
            componentTypeId: 'ColorAndFabric',
            componentTypeCategory: 'ColorAndFabric',
            price: 1600,
            isProductCode: true,
            isRecommended: false,
            type: 'Fabric',
            sortOrder: 1039,
            meta: {
                image: {
                    url: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG51-DARK-FOREST-LIGHT-GEORGETTE.jpg',
                    width: 0,
                    height: 0
                },
                colorId: 276,
                colorCode: 'dark-forest',
                colorTitle: 'Dark Forest',
                careDescription: '<p>Professional dry-clean only. <br />See label for further details.</p>',
                fabricDescription:
                    'Main: 100% polyester light georgette\nMain: 100% polyester heavy georgette\nTrim: Nylon invisible zip with hook & eye closure'
            },
            img: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/LG51-DARK-FOREST-LIGHT-GEORGETTE.jpg',
            incompatibleWith: {
                allOptions: [['fast_making']]
            }
        },
        {
            cartId: 264,
            code: 'metallic-dusty-pink-metallic-coated-georgette',
            isDefault: false,
            title: 'Metallic Dusty Pink Metallic Coated Georgette',
            componentTypeId: 'ColorAndFabric',
            componentTypeCategory: 'ColorAndFabric',
            price: 1600,
            isProductCode: true,
            isRecommended: false,
            type: 'Fabric',
            sortOrder: 1171,
            meta: {
                image: {
                    url:
                        'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/MCG33-METALLIC-DUSTY-PINK-METALLIC-COATED-GEORGETTE.jpg',
                    width: 0,
                    height: 0
                },
                colorId: 1630,
                colorCode: 'metallic-dusty-pink',
                colorTitle: 'Metallic Dusty Pink',
                careDescription: '<p>Professional dry-clean only. <br />See label for further details.</p>',
                fabricDescription: 'Main: 100% polyester metallic coated georgette\nLining: 100% polyester heavy georgette'
            },
            img: 'https://d1msb7dh8kb0o9.cloudfront.net/assets/fabrics/MCG33-METALLIC-DUSTY-PINK-METALLIC-COATED-GEORGETTE.jpg',
            incompatibleWith: {
                allOptions: [['fast_making']]
            }
        },
        {
            cartId: 86,
            code: 'US0/AU4',
            isDefault: false,
            title: 'US 0/AU 4',
            componentTypeId: 'Size',
            componentTypeCategory: 'Size',
            price: 0,
            isProductCode: false,
            isRecommended: false,
            type: 'Size',
            sortOrder: 0,
            meta: {
                sizeUs: '0',
                sizeAu: '4'
            },
            incompatibleWith: {
                allOptions: []
            }
        },
        {
            cartId: 34,
            code: 'US2/AU6',
            isDefault: false,
            title: 'US 2/AU 6',
            componentTypeId: 'Size',
            componentTypeCategory: 'Size',
            price: 0,
            isProductCode: false,
            isRecommended: false,
            type: 'Size',
            sortOrder: 1,
            meta: {
                sizeUs: '2',
                sizeAu: '6'
            },
            incompatibleWith: {
                allOptions: []
            }
        },
        {
            cartId: 20,
            code: 'US4/AU8',
            isDefault: false,
            title: 'US 4/AU 8',
            componentTypeId: 'Size',
            componentTypeCategory: 'Size',
            price: 0,
            isProductCode: false,
            isRecommended: false,
            type: 'Size',
            sortOrder: 2,
            meta: {
                sizeUs: '4',
                sizeAu: '8'
            },
            incompatibleWith: {
                allOptions: []
            }
        },
        {
            cartId: 21,
            code: 'US6/AU10',
            isDefault: false,
            title: 'US 6/AU 10',
            componentTypeId: 'Size',
            componentTypeCategory: 'Size',
            price: 0,
            isProductCode: false,
            isRecommended: false,
            type: 'Size',
            sortOrder: 3,
            meta: {
                sizeUs: '6',
                sizeAu: '10'
            },
            incompatibleWith: {
                allOptions: []
            }
        },
        {
            cartId: 22,
            code: 'US8/AU12',
            isDefault: false,
            title: 'US 8/AU 12',
            componentTypeId: 'Size',
            componentTypeCategory: 'Size',
            price: 0,
            isProductCode: false,
            isRecommended: false,
            type: 'Size',
            sortOrder: 4,
            meta: {
                sizeUs: '8',
                sizeAu: '12'
            },
            incompatibleWith: {
                allOptions: []
            }
        },
        {
            cartId: 23,
            code: 'US10/AU14',
            isDefault: false,
            title: 'US 10/AU 14',
            componentTypeId: 'Size',
            componentTypeCategory: 'Size',
            price: 0,
            isProductCode: false,
            isRecommended: false,
            type: 'Size',
            sortOrder: 5,
            meta: {
                sizeUs: '10',
                sizeAu: '14'
            },
            incompatibleWith: {
                allOptions: []
            }
        },
        {
            cartId: 24,
            code: 'US12/AU16',
            isDefault: false,
            title: 'US 12/AU 16',
            componentTypeId: 'Size',
            componentTypeCategory: 'Size',
            price: 0,
            isProductCode: false,
            isRecommended: false,
            type: 'Size',
            sortOrder: 6,
            meta: {
                sizeUs: '12',
                sizeAu: '16'
            },
            incompatibleWith: {
                allOptions: []
            }
        },
        {
            cartId: 149,
            code: 'US14/AU18',
            isDefault: false,
            title: 'US 14/AU 18',
            componentTypeId: 'Size',
            componentTypeCategory: 'Size',
            price: 0,
            isProductCode: false,
            isRecommended: false,
            type: 'Size',
            sortOrder: 7,
            meta: {
                sizeUs: '14',
                sizeAu: '18'
            },
            incompatibleWith: {
                allOptions: []
            }
        },
        {
            cartId: 148,
            code: 'US16/AU20',
            isDefault: false,
            title: 'US 16/AU 20',
            componentTypeId: 'Size',
            componentTypeCategory: 'Size',
            price: 0,
            isProductCode: false,
            isRecommended: false,
            type: 'Size',
            sortOrder: 8,
            meta: {
                sizeUs: '16',
                sizeAu: '20'
            },
            incompatibleWith: {
                allOptions: []
            }
        },
        {
            cartId: 147,
            code: 'US18/AU22',
            isDefault: false,
            title: 'US 18/AU 22',
            componentTypeId: 'Size',
            componentTypeCategory: 'Size',
            price: 0,
            isProductCode: false,
            isRecommended: false,
            type: 'Size',
            sortOrder: 9,
            meta: {
                sizeUs: '18',
                sizeAu: '22'
            },
            incompatibleWith: {
                allOptions: []
            }
        },
        {
            cartId: 146,
            code: 'US20/AU24',
            isDefault: false,
            title: 'US 20/AU 24',
            componentTypeId: 'Size',
            componentTypeCategory: 'Size',
            price: 0,
            isProductCode: false,
            isRecommended: false,
            type: 'Size',
            sortOrder: 10,
            meta: {
                sizeUs: '20',
                sizeAu: '24'
            },
            incompatibleWith: {
                allOptions: []
            }
        },
        {
            cartId: 145,
            code: 'US22/AU26',
            isDefault: false,
            title: 'US 22/AU 26',
            componentTypeId: 'Size',
            componentTypeCategory: 'Size',
            price: 0,
            isProductCode: false,
            isRecommended: false,
            type: 'Size',
            sortOrder: 11,
            meta: {
                sizeUs: '22',
                sizeAu: '26'
            },
            incompatibleWith: {
                allOptions: []
            }
        },
        {
            cartId: 4843,
            code: 'raise-front-&-back-necklines',
            isDefault: false,
            title: 'Raise Front & Back Necklines',
            componentTypeId: 'LegacyCustomization',
            componentTypeCategory: 'LegacyCustomization',
            price: 1000,
            isProductCode: true,
            isRecommended: false,
            type: 'LegacyCustomization',
            sortOrder: 1,
            meta: {
                image: {
                    url: null,
                    width: -1,
                    height: -1
                }
            },
            incompatibleWith: {
                allOptions: []
            }
        },
        {
            cartId: 4844,
            code: 'change-lining-to-micro-mini',
            isDefault: false,
            title: 'Change Lining To Micro Mini',
            componentTypeId: 'LegacyCustomization',
            componentTypeCategory: 'LegacyCustomization',
            price: 0,
            isProductCode: true,
            isRecommended: false,
            type: 'LegacyCustomization',
            sortOrder: 2,
            meta: {
                image: {
                    url: null,
                    width: -1,
                    height: -1
                }
            },
            incompatibleWith: {
                allOptions: []
            }
        },
        {
            cartId: 4845,
            code: 'make-midi-length',
            isDefault: false,
            title: 'Make Midi Length',
            componentTypeId: 'LegacyCustomization',
            componentTypeCategory: 'LegacyCustomization',
            price: 0,
            isProductCode: true,
            isRecommended: false,
            type: 'LegacyCustomization',
            sortOrder: 3,
            meta: {
                image: {
                    url: null,
                    width: -1,
                    height: -1
                }
            },
            incompatibleWith: {
                allOptions: []
            }
        },
        {
            cartId: 4846,
            code: 'add-side-panels',
            isDefault: false,
            title: 'Add Side Panels',
            componentTypeId: 'LegacyCustomization',
            componentTypeCategory: 'LegacyCustomization',
            price: 1000,
            isProductCode: true,
            isRecommended: false,
            type: 'LegacyCustomization',
            sortOrder: 4,
            meta: {
                image: {
                    url: null,
                    width: -1,
                    height: -1
                }
            },
            incompatibleWith: {
                allOptions: []
            }
        },
        {
            cartId: 3275,
            code: 'fast_making',
            isDefault: false,
            title: 'Express',
            componentTypeId: 'Making',
            componentTypeCategory: 'Making',
            price: 1800,
            isProductCode: false,
            isRecommended: false,
            type: 'Making',
            sortOrder: 2,
            meta: {
                deliveryTimeDescription: 'Estimated Delivery in 2-3 weeks',
                deliveryTimeRange: '2-3 weeks'
            },
            incompatibleWith: {
                allOptions: []
            }
        },
        {
            cartId: 4074,
            code: 'free_fast_making',
            isDefault: false,
            title: 'Express',
            componentTypeId: 'Making',
            componentTypeCategory: 'Making',
            price: 0,
            isProductCode: false,
            isRecommended: false,
            type: 'Making',
            sortOrder: 2,
            meta: {
                deliveryTimeDescription: 'Estimated Delivery in 2-3 weeks',
                deliveryTimeRange: '2-3 weeks'
            },
            incompatibleWith: {
                allOptions: []
            }
        },
        {
            cartId: 5011,
            code: 'super_fast_making',
            isDefault: false,
            title: 'Super Express',
            componentTypeId: 'Making',
            componentTypeCategory: 'Making',
            price: 2800,
            isProductCode: false,
            isRecommended: false,
            type: 'Making',
            sortOrder: 1,
            meta: {
                deliveryTimeDescription: 'Estimated Delivery in 1.5 weeks',
                deliveryTimeRange: '1.5 weeks'
            },
            incompatibleWith: {
                allOptions: []
            }
        },
        {
            cartId: 0,
            code: 'free_returns',
            title: 'Free returns',
            componentTypeId: 'Return',
            componentTypeCategory: 'Return',
            price: 0,
            isProductCode: false,
            isRecommended: false,
            type: 'return',
            sortOrder: 1,
            meta: {
                returnDescription:
                    'Shipping and returns are free. <a href="/faqs#collapse-returns-policy" target="_blank">Learn more</a>'
            },
            incompatibleWith: {
                allOptions: []
            }
        }
    ],
    groups: [
        {
            id: 121,
            title: 'Fabric & Color',
            selectionTitle: 'Select your Fabric & Color',
            changeButtonText: 'Change',
            slug: 'fabric',
            sectionGroups: [
                {
                    title: 'Fabric & Color',
                    slug: 'fabric',
                    previewType: 'image',
                    sections: [
                        {
                            componentTypeId: 'ColorAndFabric',
                            componentTypeCategory: 'ColorAndFabric',
                            selectionType: 'RequiredOne',
                            options: [
                                {
                                    code: 'lemon-light-georgette',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: 'black-light-georgette',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: 'burnt-orange-light-georgette',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: 'cherry-red-light-georgette',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: 'rose-light-georgette',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: 'burgundy-light-georgette',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: 'champagne-light-georgette',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: 'bright-turquoise-light-georgette',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: 'cobalt-light-georgette',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: 'coral-light-georgette',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: 'emerald-green-light-georgette',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: 'forest-green-light-georgette',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: 'hot-pink-light-georgette',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: 'cream-light-georgette',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: 'ivory-light-georgette',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: 'dark-chocolate-light-georgette',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: 'plum-light-georgette',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: 'lilac-light-georgette',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: 'lavender-light-georgette',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: 'dark-lavender-light-georgette',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: 'mint-light-georgette',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: 'navy-light-georgette',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: 'pale-blue-light-georgette',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: 'pale-grey-light-georgette',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: 'pale-pink-light-georgette',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: 'peach-light-georgette',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: 'magenta-light-georgette',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: 'red-light-georgette',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: 'orange-light-georgette',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: 'teal-light-georgette',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: 'indigo-light-georgette',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: 'spring-posey-light-georgette',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: 'sand-light-georgette',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: 'tan-light-georgette',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: 'taupe-light-georgette',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: 'turqoise-light-georgette',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: 'watermelon-light-georgette',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: 'white-light-georgette',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: 'mid-grey-light-georgette',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: 'charcoal-light-georgette',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: 'coffee-light-georgette',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: 'sunset-orange-light-georgette',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: 'aqua-light-georgette',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: 'army-green-light-georgette',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: 'blush-light-georgette',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: 'grey-light-georgette',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: 'cornflower-blue-light-georgette',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: 'dark-forest-light-georgette',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: 'metallic-dusty-pink-metallic-coated-georgette',
                                    isDefault: false,
                                    parentOptionId: null
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            id: 122,
            title: 'Customizations',
            selectionTitle: 'Customize your dress',
            changeButtonText: 'Change',
            slug: 'customize',
            sectionGroups: [
                {
                    title: 'Customizations',
                    slug: 'customize',
                    previewType: 'cad',
                    sections: [
                        {
                            componentTypeId: 'Customization',
                            componentTypeCategory: 'Customization',
                            title: 'Select your customizations',
                            options: [
                                {
                                    code: 'raise-front-&-back-necklines',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: 'change-lining-to-micro-mini',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: 'make-midi-length',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: 'add-side-panels',
                                    isDefault: false,
                                    parentOptionId: null
                                }
                            ],
                            selectionType: 'OptionalMultiple'
                        }
                    ]
                }
            ]
        },
        {
            id: 123,
            title: 'Size',
            selectionTitle: 'Tell us your height and size',
            changeButtonText: 'Select',
            sortOrder: 9,
            slug: 'size',
            sectionGroups: [
                {
                    title: 'Size',
                    slug: 'size',
                    previewType: 'image',
                    sections: [
                        {
                            componentTypeId: 'heightAndSize',
                            componentTypeCategory: 'Size',
                            title: 'Select your height and size',
                            selectionType: 'RequiredOne',
                            options: [
                                {
                                    code: 'US0/AU4',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: 'US2/AU6',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: 'US4/AU8',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: 'US6/AU10',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: 'US8/AU12',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: 'US10/AU14',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: 'US12/AU16',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: 'US14/AU18',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: 'US16/AU20',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: 'US18/AU22',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: 'US20/AU24',
                                    isDefault: false,
                                    parentOptionId: null
                                },
                                {
                                    code: 'US22/AU26',
                                    isDefault: false,
                                    parentOptionId: null
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ],
    media: [
        {
            type: 'photo',
            fitDescription: null,
            sizeDescription: null,
            src: [
                {
                    name: 'original',
                    width: 1536,
                    height: 1306,
                    url: 'https://d3t8z8anmshf26.cloudfront.net/spree/products/41836/original/fp2692-mcg33-1.jpg?1521755591'
                },
                {
                    name: 'product',
                    width: 234,
                    height: 336,
                    url: 'https://d3t8z8anmshf26.cloudfront.net/spree/products/41836/product/fp2692-mcg33-1.jpg?1521755591'
                }
            ],
            sortOrder: 1,
            options: ['metallic-dusty-pink-metallic-coated-georgette']
        },
        {
            type: 'photo',
            fitDescription: null,
            sizeDescription: null,
            src: [
                {
                    name: 'original',
                    width: 1536,
                    height: 1306,
                    url: 'https://d3t8z8anmshf26.cloudfront.net/spree/products/41837/original/fp2692-mcg33-2.jpg?1521755592'
                },
                {
                    name: 'product',
                    width: 234,
                    height: 336,
                    url: 'https://d3t8z8anmshf26.cloudfront.net/spree/products/41837/product/fp2692-mcg33-2.jpg?1521755592'
                }
            ],
            sortOrder: 2,
            options: ['metallic-dusty-pink-metallic-coated-georgette']
        },
        {
            type: 'photo',
            fitDescription: null,
            sizeDescription: null,
            src: [
                {
                    name: 'original',
                    width: 1536,
                    height: 1306,
                    url: 'https://d3t8z8anmshf26.cloudfront.net/spree/products/41847/original/fp2692-mcg33-3.jpg?1521755600'
                },
                {
                    name: 'product',
                    width: 234,
                    height: 336,
                    url: 'https://d3t8z8anmshf26.cloudfront.net/spree/products/41847/product/fp2692-mcg33-3.jpg?1521755600'
                }
            ],
            sortOrder: 3,
            options: ['metallic-dusty-pink-metallic-coated-georgette']
        },
        {
            type: 'photo',
            fitDescription: null,
            sizeDescription: null,
            src: [
                {
                    name: 'original',
                    width: 1536,
                    height: 1306,
                    url: 'https://d3t8z8anmshf26.cloudfront.net/spree/products/41845/original/fp2692-mcg33-4.jpg?1521755599'
                },
                {
                    name: 'product',
                    width: 234,
                    height: 336,
                    url: 'https://d3t8z8anmshf26.cloudfront.net/spree/products/41845/product/fp2692-mcg33-4.jpg?1521755599'
                }
            ],
            sortOrder: 4,
            options: ['metallic-dusty-pink-metallic-coated-georgette']
        },
        {
            type: 'photo',
            fitDescription: null,
            sizeDescription: null,
            src: [
                {
                    name: 'original',
                    width: 1536,
                    height: 1306,
                    url: 'https://d3t8z8anmshf26.cloudfront.net/spree/products/41839/original/fp2692-mcg33-5.jpg?1521755593'
                },
                {
                    name: 'product',
                    width: 234,
                    height: 336,
                    url: 'https://d3t8z8anmshf26.cloudfront.net/spree/products/41839/product/fp2692-mcg33-5.jpg?1521755593'
                }
            ],
            sortOrder: 5,
            options: ['metallic-dusty-pink-metallic-coated-georgette']
        },
        {
            type: 'photo',
            fitDescription: null,
            sizeDescription: null,
            src: [
                {
                    name: 'original',
                    width: 1536,
                    height: 1306,
                    url: 'https://d3t8z8anmshf26.cloudfront.net/spree/products/41835/original/fp2692-mcg33-front.jpg?1521755591'
                },
                {
                    name: 'product',
                    width: 234,
                    height: 336,
                    url: 'https://d3t8z8anmshf26.cloudfront.net/spree/products/41835/product/fp2692-mcg33-front.jpg?1521755591'
                }
            ],
            sortOrder: 8,
            options: ['metallic-dusty-pink-metallic-coated-georgette']
        },
        {
            type: 'photo',
            fitDescription: null,
            sizeDescription: null,
            src: [
                {
                    name: 'original',
                    width: 1536,
                    height: 1306,
                    url: 'https://d3t8z8anmshf26.cloudfront.net/spree/products/41849/original/fp2692-lg16-1.jpg?1521755602'
                },
                {
                    name: 'product',
                    width: 234,
                    height: 336,
                    url: 'https://d3t8z8anmshf26.cloudfront.net/spree/products/41849/product/fp2692-lg16-1.jpg?1521755602'
                }
            ],
            sortOrder: 9,
            options: ['lemon-light-georgette']
        },
        {
            type: 'photo',
            fitDescription: null,
            sizeDescription: null,
            src: [
                {
                    name: 'original',
                    width: 1536,
                    height: 1306,
                    url: 'https://d3t8z8anmshf26.cloudfront.net/spree/products/41848/original/fp2692-lg16-2.jpg?1521755601'
                },
                {
                    name: 'product',
                    width: 234,
                    height: 336,
                    url: 'https://d3t8z8anmshf26.cloudfront.net/spree/products/41848/product/fp2692-lg16-2.jpg?1521755601'
                }
            ],
            sortOrder: 10,
            options: ['lemon-light-georgette']
        },
        {
            type: 'photo',
            fitDescription: null,
            sizeDescription: null,
            src: [
                {
                    name: 'original',
                    width: 1536,
                    height: 1306,
                    url: 'https://d3t8z8anmshf26.cloudfront.net/spree/products/41846/original/fp2692-lg16-3.jpg?1521755599'
                },
                {
                    name: 'product',
                    width: 234,
                    height: 336,
                    url: 'https://d3t8z8anmshf26.cloudfront.net/spree/products/41846/product/fp2692-lg16-3.jpg?1521755599'
                }
            ],
            sortOrder: 11,
            options: ['lemon-light-georgette']
        },
        {
            type: 'photo',
            fitDescription: null,
            sizeDescription: null,
            src: [
                {
                    name: 'original',
                    width: 1536,
                    height: 1306,
                    url: 'https://d3t8z8anmshf26.cloudfront.net/spree/products/41840/original/fp2692-lg16-4.jpg?1521755594'
                },
                {
                    name: 'product',
                    width: 234,
                    height: 336,
                    url: 'https://d3t8z8anmshf26.cloudfront.net/spree/products/41840/product/fp2692-lg16-4.jpg?1521755594'
                }
            ],
            sortOrder: 12,
            options: ['lemon-light-georgette']
        },
        {
            type: 'photo',
            fitDescription: null,
            sizeDescription: null,
            src: [
                {
                    name: 'original',
                    width: 1536,
                    height: 1306,
                    url: 'https://d3t8z8anmshf26.cloudfront.net/spree/products/41844/original/fp2692-lg16-front.jpg?1521755598'
                },
                {
                    name: 'product',
                    width: 234,
                    height: 336,
                    url: 'https://d3t8z8anmshf26.cloudfront.net/spree/products/41844/product/fp2692-lg16-front.jpg?1521755598'
                }
            ],
            sortOrder: 15,
            options: ['lemon-light-georgette']
        }
    ],
    layerCads: [
        {
            url: 'https://d3t8z8anmshf26.cloudfront.net/spree/products/1677/cads/3008/web/layer-3.png?1521755439',
            width: 944,
            height: 800,
            sortOrder: 1,
            type: 'layer',
            components: ['add-side-panels']
        },
        {
            url: 'https://d3t8z8anmshf26.cloudfront.net/spree/products/1677/cads/3009/web/layer-1.png?1521755440',
            width: 944,
            height: 800,
            sortOrder: 2,
            type: 'layer',
            components: ['change-lining-to-micro-mini']
        },
        {
            url: 'https://d3t8z8anmshf26.cloudfront.net/spree/products/1677/cads/3010/web/layer-0.png?1521755441',
            width: 944,
            height: 800,
            sortOrder: 3,
            type: 'layer',
            components: ['raise-front-&-back-necklines']
        },
        {
            url: 'https://d3t8z8anmshf26.cloudfront.net/spree/products/1677/cads/3011/web/base-2.png?1521755443',
            width: 944,
            height: 800,
            sortOrder: 4,
            type: 'base',
            components: ['make-midi-length']
        },
        {
            url: 'https://d3t8z8anmshf26.cloudfront.net/spree/products/1677/cads/3012/web/base-.png?1521755444',
            width: 944,
            height: 800,
            sortOrder: 5,
            type: 'base',
            components: []
        }
    ]
};

const fpgProduct: Partial<Product> = transform(JSON.stringify(fpgProductJSON));
const legacyProduct: Partial<Product> = transform(JSON.stringify(legacyProductJSON));

const fpgCustomizedProduct: Partial<CustomizedProduct> = {
    product: fpgProduct as Product,
    components: []
};

const legacyCustomizedProduct: Partial<CustomizedProduct> = {
    product: legacyProduct as Product,
    components: []
};

global.__FAME_CONFIG__ = createFameConfig();
const store = configureStore(undefined);

storiesOf('Components/Customization/CustomizeInline', module)
    .addDecorator((stories) => (
        <div>
            <style jsx>{`
                div {
                    display: flex;
                    flex-direction: column;
                }
            `}</style>
            <Provider store={store}><UserProvider>{stories()}</UserProvider></Provider>

        </div>
    ))
    .add('FPG1001 - Fabric or Color Section', () => (
        <CustomizeInline
            customizeBeforeAddingToCart={false}
            initialCustomizedProduct={fpgCustomizedProduct as CustomizedProduct}
            uncomittedCustomizedProduct={fpgCustomizedProduct as CustomizedProduct}
            currentGroup={fpgCustomizedProduct.product!.groups![0]}
            currentSectionGroup={fpgCustomizedProduct.product!.groups![0].sectionGroups![0]}
            goToProductPage={() => null}
            goToCustomizationStep={() => null}
            addToCart={() => null}
            onCustomizationChange={() => null}
        />
    ))
    .add('FPG1001 - Top Section', () => (
        <CustomizeInline
            customizeBeforeAddingToCart={false}
            initialCustomizedProduct={fpgCustomizedProduct as CustomizedProduct}
            uncomittedCustomizedProduct={fpgCustomizedProduct as CustomizedProduct}
            currentGroup={fpgCustomizedProduct.product!.groups![1]}
            currentSectionGroup={fpgCustomizedProduct.product!.groups![1].sectionGroups![0]}
            goToProductPage={() => null}
            goToCustomizationStep={() => null}
            addToCart={() => null}
            onCustomizationChange={() => null}
        />
    ))
    .add('FPG1001 - Shipping Section', () => (
      <CustomizeInline
          customizeBeforeAddingToCart={false}
          initialCustomizedProduct={fpgCustomizedProduct as CustomizedProduct}
          uncomittedCustomizedProduct={fpgCustomizedProduct as CustomizedProduct}
          currentGroup={fpgCustomizedProduct.product!.groups![4]}
          currentSectionGroup={fpgCustomizedProduct.product!.groups![4].sectionGroups![0]}
          goToProductPage={() => null}
          goToCustomizationStep={() => null}
          addToCart={() => null}
          onCustomizationChange={() => null}
      />
    ))
    .add('1677 - Color and Fabric Section', () => (
        <CustomizeInline
            customizeBeforeAddingToCart={false}
            initialCustomizedProduct={legacyCustomizedProduct as CustomizedProduct}
            uncomittedCustomizedProduct={legacyCustomizedProduct as CustomizedProduct}
            currentGroup={legacyCustomizedProduct.product!.groups![0]}
            currentSectionGroup={legacyCustomizedProduct.product!.groups![0].sectionGroups![0]}
            goToProductPage={() => null}
            goToCustomizationStep={() => null}
            addToCart={() => null}
            onCustomizationChange={() => null}
        />
    ));
