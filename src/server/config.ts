import { FameConfig } from '@typings';
import { SiteVersion } from '@common/constants';
import { URL } from 'url';

function stripPassword(urlString?: string) {
    if (!urlString) {
        return undefined;
    }

    const url = new URL(urlString);
    url.password = '';
    return url.toString();
}

export function createFameConfig(): FameConfig {
    return {
        NEWSLETTER_SIGNUP_URL: process.env.NEWSLETTER_SIGNUP_URL!!,
        FLAGS: {
            MAINTENANCE_MODE: process.env.MAINTENANCE_MODE === 'true',
        },
        SENTRY_DSN: stripPassword(process.env.SENTRY_DSN),
        ROBOTS_INDEX: process.env.ROBOTS_INDEX === 'true',
        GTM_CONTAINER: process.env.GTM_CONTAINER,
        RELEASE: process.env.CIRCLE_SHA1 || 'unknown',
        ENVIRONMENT: process.env.ENVIRONMENT_NAME || process.env.NODE_ENV || 'unknown',
        URLS: {
            [SiteVersion.US]: {
                api: process.env.FAME_API_URL_US || 'https://qa4.fameandpartners.com' || 'http://localhost:3000',
                frontend: process.env.FAME_FRONTEND_URL_US || 'http://localhost:3002',
                pcApi: process.env.FAME_PC_API_URL_US || 'http://product-catalog-qa4.fameandgroups.com' || 'https://localhost:5001',
                renderUrl: process.env.FAME_RENDER_URL_US ||  'https://s3.amazonaws.com/fame-product-renders-dev' || 'https://d3m99ch6bfu0n9.cloudfront.net',
                renderFallbackUrl: process.env.FAME_RENDER_FALLBACK_URL_US || 'https://9v2re8nkt4.execute-api.us-east-1.amazonaws.com/dev/ImagePreview',
            },
            [SiteVersion.AU]: {
                api: process.env.FAME_API_URL_AU || 'http://au.lvh.me:3000',
                frontend: process.env.FAME_FRONTEND_URL_AU || 'http://au.lvh.me:3002',
                pcApi: process.env.FAME_PC_API_URL_AU || 'https://localhost:5001',
                renderUrl: process.env.FAME_RENDER_URL_AU || 'https://d3m99ch6bfu0n9.cloudfront.net' || 'https://s3.amazonaws.com/fame-product-renders-dev',
                renderFallbackUrl: process.env.FAME_RENDER_FALLBACK_URL_AU || 'https://9v2re8nkt4.execute-api.us-east-1.amazonaws.com/dev/ImagePreview',
            }
        }
    };
}
