import customizedProductToLineItem from '@transforms/customizedProductToLineItem';
import { Product, User, ProductListSummary, CustomizedProduct, DocumentSearchArgs, DocumentSearchResponse, UserWithPassword, SpreeOrder, Order, OrderCustomizedProduct, ReturnItemsResponse } from '@typings';
import axios, { AxiosInstance } from 'axios';
import cartResponseToCart from '@transforms/cartResponseToCart';
import userResponseToUser from '@transforms/userResponseToUser';
import { SiteVersion } from '@common/constants';
import productApiToProductModel from '@transforms/productApiToProductModel';
import { Agent } from 'https';
import qs from 'qs';
import { isSwatchProduct, isNewProduct } from '@common/utils/product';
import userToUserRequest from '@transforms/userToUserRequest';
import { UserProfileRequest } from '@containers/Account/Profile/Profile';
import { SpreeGetCartResponse } from 'typings/fame_api/get_cart';
import { SpreeUser } from 'typings/fame_api/user';
import { OrderReturnLineItemRequest } from 'typings/fame_api/returns';

export function getBaseUrl(siteVersion: SiteVersion) {
  return global.__FAME_CONFIG__.URLS[siteVersion];
}

class FameAPI {
  private webbyApi: AxiosInstance;
  private pcApi: AxiosInstance;
  private baseSiteVersionUrls: { api: string; pcApi: string } | null = null;

  constructor(private siteVersion: SiteVersion) {
    this.baseSiteVersionUrls = getBaseUrl(siteVersion);
    const webbyBaseURL = this.baseSiteVersionUrls.api;
    const pcBaseURL = this.baseSiteVersionUrls.pcApi;

    const headers: any = {
      Accept: 'application/json'
    };

    this.webbyApi = axios.create({
      baseURL: webbyBaseURL,
      timeout: 60000,
      headers,
      paramsSerializer(params: any) {
        return qs.stringify(params, { arrayFormat: 'brackets' });
      },
      withCredentials: true
    });

    this.pcApi = axios.create({
      baseURL: pcBaseURL,
      timeout: 60000,
      headers,
      paramsSerializer(params: any) {
        return qs.stringify(params, { arrayFormat: 'repeat' });
      },
      httpsAgent: new Agent({
        rejectUnauthorized: process.env.NODE_ENV === 'production'
      })
    });
  }

  public async subscribeNewsletter(data: any) {
    const response = await this.webbyApi.post<any>('/api/v1/subscribe_newsletter', { ...data });
    return Promise.resolve(response.data.user);
  }

  public async trackAndApplyCampaign(data: any) {
    const response = await this.webbyApi.get<any>('/api/v1/track', { params: data });
  }

  public async fetchUserCartDetails(cookie?: string): Promise<{ cart: Order | null; user: User | null }> {
    try {
      const url = '/user_cart/details';
      const headers = cookie ? { Cookie: cookie } : {};
      const response = await this.webbyApi.get<SpreeGetCartResponse>(url, { headers });
      return {
        cart: response.data.cart ? cartResponseToCart(response.data.cart) : null,
        user: userResponseToUser(response.data.user)
      };
    } catch (error) {
      console.error(error);
      throw Error(error);
    }
  }

  public async addToCart(item: CustomizedProduct, summary: ProductListSummary | null): Promise<Order> {
    try {
      const url = '/user_cart/products';
      const transformedItem = customizedProductToLineItem(item, summary);
      const response = await this.webbyApi.post<SpreeOrder>(url, transformedItem);
      return cartResponseToCart(response.data);
    } catch (error) {
      console.error(error);
      throw Error(error);
    }
  }

  public async removeFromCart(item: OrderCustomizedProduct): Promise<Order> {
    try {
      const url = `/user_cart/products/${item.lineItemId}`;
      const response = await this.webbyApi.delete(url);
      return cartResponseToCart(response.data);
    } catch (error) {
      console.error(error);
      throw Error(error);
    }
  }

  public async restoreAbandonedCart(cartId: string | number): Promise<Order | null> {
    try {
      const url = '/user_cart/restore';
      const response = await this.webbyApi.post<SpreeGetCartResponse>(url, { cart_id: cartId });
      return response.data.cart ? cartResponseToCart(response.data.cart) : null;
    } catch (error) {
      console.error(error);
      throw Error(error);
    }
  }

  public async getProductSummaries(productIds: string[]) {
    const newProducts = productIds.filter((pid) => FameAPI.useNewApi(pid));
    const oldProducts = productIds.filter((pid) => !FameAPI.useNewApi(pid));

    const data = await Promise.all([this.getProductSummariesFromProductCatalog(newProducts), this.getProductSummariesFromSpree(oldProducts)]);

    return data.flatMap((x) => x);
  }

  private async getProductSummariesFromSpree(productIds: string[]): Promise<ProductListSummary[]> {
    if (productIds.length === 0) {
      return [];
    }

    try {
      const url = `/api/v1/products`;
      const response = await this.webbyApi.get<any>(url, { params: { pids: productIds } });
      return response.data.products;
    } catch (error) {
      console.error(error);
      throw Error(error);
    }
  }

  private async getProductSummariesFromProductCatalog(productIds: string[]): Promise<ProductListSummary[]> {
    if (productIds.length === 0) {
      return [];
    }

    try {
      const url = productIds.length === 1 ? `/api/Curations/${this.siteVersion}/${productIds.first()}` : `/api/Curations/${this.siteVersion}`;
      const params = productIds.length === 1 ? undefined : { pids: productIds };
      const response = await this.pcApi.get<ProductListSummary[] | ProductListSummary>(url, { params });

      const data = response.data;
      return Array.isArray(data) ? data : [data];
    } catch (error) {
      console.error(error);
      throw Error(error);
    }
  }

  public async getSimilarSilhouttes(silhouette: string) {
    try {
      const url = `/api/Curations/silhouette/${this.siteVersion}/${silhouette}`;
      const response = await this.pcApi.get<any>(url);
      return response.data;
    } catch (error) {
      console.error(error);
      throw Error(error);
    }
  }

  public async getProduct(productId: string | number): Promise<Product | null> {
    try {
      // TODO: Do the API switch in dotnet
      const useNewApi = FameAPI.useNewApi(productId);
      const url = useNewApi ? `/api/ProductSummary/${productId}/${this.siteVersion}` : `/api/v1/products/${productId}`;
      const options = useNewApi
        ? {
            transformResponse: productApiToProductModel
          }
        : undefined;
      const response = useNewApi ? await this.pcApi.get<Product>(url, options) : await this.webbyApi.get<Product>(url, options);
      return response.data;
    } catch (error) {
      if (error && 'response' in error && error.response && 'status' in error.response && error.response.status === 404) {
        return null;
      } else {
        console.error(error);
        throw Error(error);
      }
    }
  }

  public async getDocumentFromProductCatalog(options: DocumentSearchArgs): Promise<DocumentSearchResponse> {
    try {
      // Build up the search args with defaults for missing values
      const url = `/api/ProductDocument`;
      const response = await this.pcApi.get<DocumentSearchResponse>(url, { params: options });
      return response.data;
    } catch (error) {
      console.error(error);
      throw Error(error);
    }
  }

  public async getDocumentFromSpree(options: DocumentSearchArgs): Promise<DocumentSearchResponse> {
    try {
      // Build up the search args with defaults for missing values
      const url = `/api/v1/products/search`;
      const response = await this.webbyApi.get<DocumentSearchResponse>(url, { params: options });
      return response.data;
    } catch (error) {
      console.error(error);
      throw Error(error);
    }
  }

  // We don't care about the cart here because it'll be fetched server side when the user navigates to something else
  public async signup(user: UserWithPassword): Promise<User> {
    try {
      const url = `/api/v1/user/signup`;
      const response = await this.webbyApi.post<SpreeUser>(url, userToUserRequest(user));
      return userResponseToUser(response.data)!;
    } catch (error) {
      console.error(error);
      throw Error(error);
    }
  }

  public async login(user: UserWithPassword): Promise<User> {
    try {
      const url = `/api/v1/user/login`;
      const userRequest = userToUserRequest(user);
      const response = await this.webbyApi.post<SpreeUser>(url, userRequest);
      return userResponseToUser(response.data)!;
    } catch (error) {
      console.error(error);
      throw Error(error);
    }
  }

  public async logout(): Promise<void> {
    try {
      const url = '/api/v1/user/logout';
      await this.webbyApi.delete(url, { maxRedirects: 0 });
    } catch (error) {
      console.error(error);
      throw Error(error);
    }
  }

  public async resetPassword(token: string, password: string): Promise<User> {
    try {
      const url = '/api/v1/user/reset_password';
      const response = await this.webbyApi.post<SpreeUser>(url, { token, password });
      return userResponseToUser(response.data)!;
    } catch (error) {
      console.error(error);
      throw Error(error);
    }
  }

  public async sendResetPasswordEmail(email: string): Promise<void> {
    try {
      const url = '/api/v1/user/send_reset_password_email';
      await this.webbyApi.post(url, { email });
    } catch (error) {
      console.error(error);
      throw Error(error);
    }
  }

  public async updateProfile(profile: UserProfileRequest): Promise<User> {
    try {
      const url = '/api/v1/profile/update';
      const response = await this.webbyApi.post<SpreeUser>(url, profile);
      return userResponseToUser(response.data)!;
    } catch (error) {
      console.error(error);
      throw Error(error);
    }
  }

  public async fetchOrder(orderNumber: string, cookie?: string): Promise<Order> {
    try {
      const params = { order_number: orderNumber };
      const url = `/api/v1/order_history`;
      const headers = cookie ? { Cookie: cookie } : {};
      const response = await this.webbyApi.get<SpreeOrder>(url, { headers, params });
      return cartResponseToCart(response.data);
    } catch (error) {
      console.error(error);
      throw Error(error);
    }
  }

  public async fetchOrders(cookie?: string): Promise<Order[]> {
    try {
      const url = '/api/v1/order_history';
      const headers = cookie ? { Cookie: cookie } : {};
      const response = await this.webbyApi.get<SpreeOrder[]>(url, { headers });
      return response.data.map(cartResponseToCart);
    } catch (error) {
      console.error(error);
      throw Error(error);
    }
  }

  public async fetchGuestOrder(orderNumber: string, email: string, cookie?: string): Promise<Order> {
    try {
      const params = { order_number: orderNumber, email };
      const url = `/api/v1/guest/order`;
      const headers = cookie ? { Cookie: cookie } : {};
      const response = await this.webbyApi.get<SpreeOrder>(url, { headers, params });
      return cartResponseToCart(response.data);
    } catch (error) {
      console.error(error);
      throw Error(error);
    }
  }

  public async submitReturnRequest(orderNumber: string, lineItems: OrderReturnLineItemRequest[], email: string, cookie?: string): Promise<ReturnItemsResponse> {
    try {
      const data = {
        order_number: orderNumber,
        line_items: lineItems,
        email
      };

      const url = `/api/v1/submit_return`;
      const headers = cookie ? { Cookie: cookie } : {};
      const response = await this.webbyApi.post<ReturnItemsResponse>(url, { headers, ...data });

      return response.data;
    } catch (error) {
      console.error(error);
      throw Error(error);
    }
  }

  // #region Helpers

  private static useNewApi(productId: string | number) {
    return isNewProduct(productId) || isSwatchProduct(productId);
  }

  // #endregion Helpers
}

export default FameAPI;
