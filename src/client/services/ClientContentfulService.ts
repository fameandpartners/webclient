
import Axios, { AxiosInstance } from 'axios';
import { User, ContentfulService, CmsElement } from '@typings';
import { SiteVersion } from '@common/constants';

export default class ClientContentfulService implements ContentfulService {
    protected client: AxiosInstance;

    constructor() {
        this.client = Axios.create({
            baseURL: '/_webclient/cms',
            timeout: 60000,
            withCredentials: true,
        });
    }

    public async getEntryByField(field: string, value: any, contentType: string, isPreview: boolean, user: User|null, siteVersion: SiteVersion): Promise<CmsElement|null> {
        const response =  await this.client.get<CmsElement|null>('/entry', {
            params: {
                field,
                value,
                contentType,
                isPreview
            }
        });

        return response.data;
    }

    public async getEntryById(id: string, isPreview: boolean, user: User|null, siteVersion: SiteVersion): Promise<CmsElement|null> {
        const response = await this.client.get<CmsElement|null>('/entry', {
            params: {
                id,
                isPreview
            }
        });

        return response.data;
    }
}
