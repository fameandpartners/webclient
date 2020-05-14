import { HelmetData } from 'react-helmet';
import { SiteVersion } from '@common/constants';
import { DataLayer } from '@common/analytics/datalayer';

declare module '*.json' {
  const content: any;
  export default content;
}

declare module '*.svg' {
  const content: any;
  export default content;
}

export type HelmetContext = {
  helmet?: HelmetData;
};

export type DeepPartial<T> = { [P in Extract<keyof T, string>]?: DeepPartial<T[P]> };

export type FameConfig = {
  NEWSLETTER_SIGNUP_URL: string;
  SENTRY_DSN?: string;
  ROBOTS_INDEX: boolean;
  GTM_CONTAINER?: string;
  RELEASE: string;
  ENVIRONMENT: string;
  KLAVIYO_KEY: string;
  SALE_OFF: number;
  FLAGS: {
    MAINTENANCE_MODE?: boolean;
  };
  URLS: {
    [SiteVersion.AU]: {
      frontend: string;
      api: string;
      pcApi: string;
      renderUrl: string;
      renderFallbackUrl: string;
    };
    [SiteVersion.US]: {
      frontend: string;
      api: string;
      pcApi: string;
      renderUrl: string;
      renderFallbackUrl: string;
    };
  };
};

declare global {
  interface Window {
    main(): void;
    dataLayer: DataLayer;
    __PRELOADED_STATE__: any;
    _learnq: any;
  }
  module NodeJS {
    interface Global {
      dataLayer: DataLayer;
      __FAME_CONFIG__: FameConfig;
    }
  }
}

export * from './user';
export * from './product';
export * from './fame_api/add_to_cart';
export * from './fame_api/order';
export * from './fame_api/product_document';
export * from './orders';
export * from './cms';
