import { ImageSizeType } from '@common/utils/image-size-type';
import { isNode } from '@common/utils/server-client-helpers';

export enum HeightUnitType {
  INCH = 'inch',
  CM = 'cm'
}

export enum SizeUnitType {
  US = 'US',
  AU = 'AU'
}

export const SAVED_HEIGHT = 'SavedHeight';
export const SAVED_HEIGHT_UNIT = 'SavedHeightUnit';
export const SAVED_SIZE_UNIT = 'SavedSizeUnit';
export const SAVED_SIZE_AU = 'SizeAU';
export const SAVED_SIZE_US = 'SizeUS';

export enum SiteVersion {
  US = 'en-US',
  AU = 'en-AU'
}

export const DEFAULT_HEIGHT_UNIT = {
  [SiteVersion.US]: HeightUnitType.INCH,
  [SiteVersion.AU]: HeightUnitType.CM
};

export const DEFAULT_SIZE_UNIT = {
  [SiteVersion.US]: SizeUnitType.US,
  [SiteVersion.AU]: SizeUnitType.AU
};

export const CURRENCIES = {
  [SiteVersion.US]: 'USD',
  [SiteVersion.AU]: 'AUD'
};

export const DEFAULT_SITE_VERSION = SiteVersion.US;

export const DEFAULT_GLOBAL_OPTIONS_NAME = 'allOptions';

export const COMPONENT_IMAGE_SIZES = [ImageSizeType.Option352, ImageSizeType.Option528, ImageSizeType.Option704];
export const RENDER_IMAGE_SIZES = [ImageSizeType.Option1056, ImageSizeType.Option1408, ImageSizeType.Option2816];
export const RENDER_GALLERY_IMAGE_SIZES = [ImageSizeType.Option1056, ImageSizeType.Option2816, ImageSizeType.Option4048];

export const DEFAULT_PAGE_SIZE = 36;

export const DELAY_REHYDRATE_IN_MS = 2000;
export const DELAY_KEYLISTENER_IN_MS = 200;

const mediaQueryScss = require('@scss/partials/_media-query.scss');
const breakpoints = isNode() ? mediaQueryScss.locals : mediaQueryScss;
export enum MediaQueryBreakpoint {
  PHONE = parseInt(breakpoints.PHONE, 10),
  PHONE_LARGE = parseInt(breakpoints.PHONE_LARGE, 10),
  TABLET = parseInt(breakpoints.TABLET, 10),
  TABLET_LARGE = parseInt(breakpoints.TABLET_LARGE, 10),
  DESKTOP_SMALL = parseInt(breakpoints.DESKTOP_SMALL, 10),
  DESKTOP_MEDIUM = parseInt(breakpoints.DESKTOP_MEDIUM, 10),
  DESKTOP_LARGE = parseInt(breakpoints.DESKTOP_LARGE, 10),
  DESKTOP_EXTRA_LARGE = parseInt(breakpoints.DESKTOP_EXTRA_LARGE, 10),
  DESKTOP_ULTRA_WIDE = parseInt(breakpoints.DESKTOP_ULTRA_WIDE, 10)
}
