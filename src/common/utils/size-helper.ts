import { HeightUnitType } from '@common/constants';
import { CustomizedProduct } from 'typings';

export function convertCmToTotalInch(cm: number) {
    return Math.round(cm / 2.54);
}

export function convertCmToInchAndFeet(cm: number) {
    return convertTotalInchToFeetAndInch(convertCmToTotalInch(cm));
}

export function convertTotalInchToCm(totalInch: number) {
    return Math.round(totalInch * 2.54);
}

export function convertFeetAndInchToCm(feet: number, inch: number) {
    return convertTotalInchToCm(
        convertFeetAndInchToTotalInch(feet, inch)
    );
}

export function convertFeetAndInchToTotalInch(feet: number, inch: number): number {
    return feet * 12 + inch;
}

export function convertTotalInchToFeetAndInch(totalInch: number) {
    const inch = totalInch % 12;
    const feet = Math.floor(totalInch / 12);

    return { inch, feet };
}

export function convertTotalInchesToFeetInchString(totalInch: number) {
    const { inch, feet } = convertTotalInchToFeetAndInch(totalInch);
    return `${feet}ft ${inch}in`;
}

export function extractCmInchAndFeet(customizedProduct: CustomizedProduct) {
   if (customizedProduct.heightUnit === HeightUnitType.CM && customizedProduct.height) {
        return {
            cm: customizedProduct.height,
            ...convertCmToInchAndFeet(customizedProduct.height)
        };
    }

   if (customizedProduct.heightUnit === HeightUnitType.INCH && customizedProduct.height) {
        return {
            cm: convertTotalInchToCm(customizedProduct.height),
            ...convertTotalInchToFeetAndInch(customizedProduct.height)
        };
    }

   return {
        inch: 0,
        feet: 0,
        cm: 0
    };
}

export function extractCmAndTotalInches(customizedProduct: CustomizedProduct) {
    if (customizedProduct.heightUnit === HeightUnitType.CM && customizedProduct.height) {
        return {
            cm: customizedProduct.height,
            inches: convertCmToTotalInch(customizedProduct.height),
        };
    }

    if (customizedProduct.heightUnit === HeightUnitType.INCH && customizedProduct.height) {
       return {
            cm: convertTotalInchToCm(customizedProduct.height),
            inches: customizedProduct.height,
       };
   }

    return {
        inches: 0,
        cm: 0
    };
}
