import { User } from "./user";
import { SiteVersion } from "@common/constants";

export interface CmsElement {
  cmsType: "element",
  id: string,
  spaceId: string,
  type: string,
  lastModified: string,
}

export interface CmsAsset {
  cmsType: "asset",
  id: string,
  spaceId: string,
  url: string,
  title: string,
  description: string,
}

export interface CmsAssetImage extends CmsAsset {
  width: number,
  height: number,
  type: 'image'
}

export interface CmsAssetVideo extends CmsAsset {
  type: 'video'
}

export type CmsAssetVideoOrPhoto = CmsAssetImage | CmsAssetVideo;
export type CmsObject = CmsElement | CmsAsset;


export interface ContentfulService {
  getEntryByField(field: string, value: any, contentType: string, isPreview: boolean, user: User|null, siteVersion: SiteVersion): Promise<CmsElement|null>;
  getEntryById(id: string, isPreview: boolean, user: User|null, siteVersion: SiteVersion): Promise<CmsElement|null>;
}
