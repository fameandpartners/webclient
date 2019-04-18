import { ContentfulClientApi, Entry, Asset, EntryCollection, createClient } from 'contentful';
import { logHandledError } from '@common/utils/error-reporting';
import { User, CmsElement, CmsObject, CmsAsset, CmsAssetImage, CmsAssetVideo, ContentfulService } from '@typings';
import { SiteVersion } from '@common/constants';
import NodeCache from 'node-cache';
import { cache } from '../utils/cache-util';

export default class ServerContentfulService implements ContentfulService {
    public previewClient: ContentfulClientApi;
    public publishedClient: ContentfulClientApi;
    private cache: NodeCache;

    constructor(nodeCache: NodeCache) {
        const spaceId = process.env.CONTENTFUL_SPACE_ID || 'cvlcgjxo5px5';
        const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN || 'b55c5558e38d81f9e28066b5788549bc24ca9d24df73bbe887a5b7ec68201a1a';
        const previewToken = process.env.CONTENTFUL_PREVIEW_TOKEN || '4b9e5ee31d83ba901ced682ea1ba7e6e0a0e1d684102200453abcfb4af09b1da';

        this.cache = nodeCache;

        this.previewClient = createClient({
            space: spaceId,
            accessToken: previewToken,
            host: 'preview.contentful.com'
        });

        this.publishedClient = createClient({
            space: spaceId,
            accessToken,
            host: 'cdn.contentful.com'
        });
    }

    public _resolveContent(response: EntryCollection<any>, content: Entry<any>): Entry<any> | Asset | null {
        if (content.fields != null) {
            // content has been inlined in object
            return content;
        }

        const linkType = (content.sys as any).linkType;
        if (linkType != null && response.includes != null && response.includes[linkType] != null) {
            const includedContent = response.includes[linkType].find((element: any) => element.sys.id === content.sys.id);
            if (includedContent) {
                // content has been included in inital response
                return includedContent;
            }
        }

        logHandledError(new Error('unable to resolve content, the reference might either be deleted or the nesting exceeds 10 elements'));
        return null;
    }

    public _mapContentfulElementToObject(response: EntryCollection<any>, contentRef: Entry<any>): CmsObject | null {
        const content = this._resolveContent(response, contentRef);
        if (!content) {
            return null;
        }

        const componentProps = content.fields;
        const newComponentProps = {};
        Object.keys(componentProps).forEach((key) => {
            const prop = componentProps[key];
            if (Array.isArray(prop) && prop.length > 0 && prop[0].sys) {
                newComponentProps[key] = prop
                    .map((itemRef) => {
                        return this._mapContentfulElementToObject(response, itemRef);
                    })
                    .filter((x) => !!x);
            } else if (prop && prop.sys) {
                newComponentProps[key] = this._mapContentfulElementToObject(response, prop);
            } else {
                newComponentProps[key] = prop;
            }
        });
        const componentId = content.sys.id;
        const componentSpace = (content.sys as any).space.sys.id;

        if (content.sys.type === 'Asset') {
            const fileField: any = (content.fields && content.fields.file) || {};
            const description: any = (content.fields && content.fields.description) || '';

            const asset: CmsAsset = {
                id: componentId,
                spaceId: componentSpace,
                cmsType: 'asset',
                url: fileField.url,
                title: fileField.title,
                description
            };

            if (fileField.details && fileField.details.image) {
                const image: CmsAssetImage = {
                    ...asset,
                    type: 'image',
                    width: fileField.details.image.width,
                    height: fileField.details.image.height
                };

                return image;
            } else if (fileField.contentType && fileField.contentType.startsWith('video')) {
                const video: CmsAssetVideo = {
                    ...asset,
                    type: 'video'
                    // width: fileField.details.video.width,
                    // height: fileField.details.video.height,
                };

                return video;
            }
            return asset;
        } else if (content.sys.type === 'Entry') {
            const componentType = content.sys.contentType.sys.id;

            return {
                id: componentId,
                spaceId: componentSpace,
                type: componentType,
                cmsType: 'element',
                lastModified: content.sys.updatedAt,
                ...newComponentProps
            };
        } else {
            throw new Error(`unknown cms type ${content.sys.type}`);
        }
    }

    public query<T>(query: any, isPreview: boolean, user: User | null, siteVersion: SiteVersion): Promise<T | null> {
        const fn = () => this.queryImpl<T>(query, isPreview, user, siteVersion);

        if (isPreview) {
            return fn();
        } else {
            const key = `contentful/queryAll/${JSON.stringify(query)}`;
            return cache<T | null>(key, this.cache, fn, 3600);
        }
    }

    public async queryImpl<T>(query: any, isPreview: boolean, user: User | null, siteVersion: SiteVersion): Promise<T | null> {
        const client = isPreview ? this.previewClient : this.publishedClient;

        if (isPreview && (!user || !user.isAdmin)) {
            // return null;
            // TODO handle
        }

        const response = await client.getEntries(query);
        if (response.items != null && response.items.length === 1) {
            return this._mapContentfulElementToObject(response, response.items[0]) as any;
        }
        return null;
    }

    public queryAll<T>(query: any, isPreview: boolean, user: User | null, siteVersion: SiteVersion): Promise<T[]> {
        const fn = () => this.queryAllImpl<T>(query, isPreview, user, siteVersion);

        if (isPreview) {
            return fn();
        } else {
            const key = `contentful/queryAll/${JSON.stringify(query)}`;
            return cache<T[]>(key, this.cache, fn, 3600);
        }
    }

    public async queryAllImpl<T>(query: any, isPreview: boolean, user: User | null, siteVersion: SiteVersion): Promise<T[]> {
        const client = isPreview ? this.previewClient : this.publishedClient;

        if (isPreview && (!user || !user.isAdmin)) {
            // return null;
            // TODO handle
        }

        const response = await client.getEntries(query);
        if (response.items != null) {
            return response.items.map((e) => this._mapContentfulElementToObject(response, e) as any);
        }
        return [];
    }

    public getEntryByField<T extends CmsElement, K extends keyof T>(field: K, value: T[K], contentType: string, isPreview: boolean, user: User | null, siteVersion: SiteVersion): Promise<T | null> {
        const contentfulQuery = {
            content_type: contentType,
            [`fields.${field}`]: value,
            include: 10,
            locale: siteVersion
        };
        return this.query<T | null>(contentfulQuery, isPreview, user, siteVersion);
    }

    public getEntriesByField<T extends CmsElement, K extends keyof T>(field: K, value: T[K], contentType: string, isPreview: boolean, user: User | null, siteVersion: SiteVersion, include: number = 1): Promise<T[]> {
        const contentfulQuery = {
            content_type: contentType,
            [`fields.${field}`]: value,
            include,
            locale: siteVersion
        };
        return this.queryAll<T>(contentfulQuery, isPreview, user, siteVersion);
    }

    public getEntryById<T extends CmsElement>(id: string, isPreview: boolean, user: User | null, siteVersion: SiteVersion): Promise<T | null> {
        const contentfulQuery = {
            'sys.id': id,
            'include': 10,
            'locale': siteVersion
        };
        return this.query<T | null>(contentfulQuery, isPreview, user, siteVersion);
    }
}
