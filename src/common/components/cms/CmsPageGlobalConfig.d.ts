import { CmsAsset, CmsAssetImage, CmsElement, CmsAssetVideoOrPhoto } from "typings/cms";
import { SimpleHeaderProps } from "@components/cms/Header/SimpleHeader";

export interface CmsNavigationLink extends CmsElement {
    title: string;
    url: string;
}

export interface CmsNavigationLinkSection extends CmsElement {
    title: string;
    links: CmsNavigationLink[];
}

export interface CmsNavigationLinkList extends CmsElement {
    title: string;
    sections: CmsNavigationLinkSection[];
    promoMedia: CmsAssetVideoOrPhoto;
    promoText: string;
    promoUrl: string;
}

export interface EmailCaptureSettings extends CmsElement {
    internalName: string;
    components: CmsElement[];
    ignoredUrls: CmsNavigationLinkSection;
}


export interface SitewideBannerSettings extends CmsElement {
    text: string;
    mobileText: string;
    style: 'Gold'|'Black'|'White'|'Grey';
}

export interface CmsPageGlobalConfig extends CmsElement {
    navigation: CmsNavigationLinkList[];
    footerNavigation: CmsNavigationLinkList[];
    emailCaptureSettings: EmailCaptureSettings;
    pdpContent: CmsElement[];
    sitewideBanners?: SitewideBannerSettings[];
}
