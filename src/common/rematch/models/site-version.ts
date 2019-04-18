import { DEFAULT_SITE_VERSION, SiteVersion } from '@constants';
import { getBaseUrl } from '@common/services/fameApi';
import { URL } from 'url';
import { createModel } from '@rematch/core';

export type SiteVersionRootState = SiteVersion;

export function inferSiteVersionFromHost(requestHost: string) {
    const auSiteVersionUrl = new URL(global.__FAME_CONFIG__.URLS[SiteVersion.AU].frontend);

    const auSiteVersionHost = auSiteVersionUrl.host;
    const auSiteVersionHostname = auSiteVersionUrl.hostname;

    if (auSiteVersionHost === requestHost || auSiteVersionHostname === requestHost) {
        return SiteVersion.AU;
    } else {
        return SiteVersion.US;
    }
}

const SiteVersionModel = createModel({
    state: DEFAULT_SITE_VERSION,
    reducers: {
        inferSiteVersion(state: SiteVersionRootState, requestHost: string): SiteVersionRootState {
            return inferSiteVersionFromHost(requestHost);
        },
        changeSiteVersion: (state: SiteVersionRootState, payload: SiteVersion): SiteVersionRootState  => {
            window.location.assign(`${getBaseUrl(payload).frontend}${window.location.pathname}${window.location.search}${window.location.hash}`);
            return state;
        }
    },
});

export default SiteVersionModel;
