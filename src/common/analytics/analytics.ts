import qs from 'query-string';

import { CustomizedProduct, ProductListSummary, Section, SectionGroup, Group, Component, FacetGroup, ProductDocument, Facet, OrderCustomizedProduct, Order } from 'typings';
import { totalPrice } from '@common/utils/product';
import { OrientationType } from '@common/utils/orientation-type';
import { GTMAddToCartEvent, GTMRemoveFromCartEvent, GTMGenericEvent, GTMPageView, GTMPageType, GTMSocialSharedEvent, GTMProduct, GTMOrderEvent } from '@common/analytics/datalayer';
import { formatProductId, findImages } from '@common/utils/render-url-helper';
import { SiteVersion } from '@common/constants';
import { SearchParams } from '@containers/SearchPage/SearchPage';
import { UserRootState } from '@common/rematch/models/user';

function mapToProduct(cp: CustomizedProduct, productSummary: ProductListSummary | null): GTMProduct {
  const images = findImages(cp, productSummary, true);
  const isCuration = images.length > 0;

  return {
    id: cp.product.productId,
    sku: formatProductId(cp),
    name: (productSummary && productSummary.name) || cp.product.curationMeta.name,
    price: totalPrice(cp) / 100.0,
    type: 'Dress', // TODO update
    isCuration
  };
}

function cartCustomziedProductMapToProduct(op: OrderCustomizedProduct): GTMProduct {
  const isCuration = false; // TODO update

  return {
    id: op.product.productId,
    sku: formatProductId(op),
    name: op.product.title,
    price: op.price / 100.0,
    type: 'Dress', // TODO update
    isCuration
  };
}

function mapToListProduct(siteVersion: SiteVersion, document: ProductDocument): GTMProduct {
  const isCuration = !!document && !!document.images && document.images.length > 0;

  return {
    id: document.productId,
    sku: document.pid,
    name: document.name,
    price: document.price[siteVersion],
    type: 'Dress', // TODO update
    isCuration
  };
}

export function trackAddToCart(customizedProduct: CustomizedProduct, productSummary: ProductListSummary | null) {
  const event: GTMAddToCartEvent = {
    event: 'Cart - Product Added',
    eventDetail: {
      product: mapToProduct(customizedProduct, productSummary)
    }
  };
  global.dataLayer.push(event);
}

export function trackRemoveFromCart(orderCustomizedProduct: OrderCustomizedProduct) {
  const event: GTMRemoveFromCartEvent = {
    event: 'Cart - Product Removed',
    eventDetail: {
      product: cartCustomziedProductMapToProduct(orderCustomizedProduct)
    }
  };
  global.dataLayer.push(event);
}

export function trackAbandondedCartRestore(cartId: string) {
  const event: GTMGenericEvent = {
    event: 'Cart',
    eventDetail: {
      category: 'Cart Restored',
      label: cartId
    }
  };

  if (global && global.dataLayer && Array.isArray(global.dataLayer)) {
    global.dataLayer.push(event);
  }
}

export function trackOrderInProgress(cart: Order, siteVersion: SiteVersion, user: UserRootState) {
  const queryString = qs.parseUrl(window.location.href);
  let tid = '';

  const data = {
    ...((queryString && queryString.query) || {}),
    referrer: document.referrer
  };

  if (data && '_bta_tid' in data) {
    tid = data._bta_tid;
  }
  console.log('--> track order in progress', cart, user);
  if (user && user.email) {
    // klaviyo tracking
    console.log('---> learn', window._learnq);
    const klaviyo = window._learnq;
    klaviyo.push([
      'identify',
      {
        $email: user.email,
        $first_name: user.firstName,
        $last_name: user.lastName
      }
    ]);
    console.log('----< sending checkout');
    klaviyo.push([
      'track',
      'Started Checkout',
      {
        $event_id: cart.id, // The cart ID if you have it. Otherwise remove this line.
        $value: cart.total / 100,
        ItemNames: cart.items.map((x) => x.product.title),
        CheckoutURL: `https://www.fameandpartners.com/cart/${cart.id}`,
        Items: cart.items.map((x) => ({
          SKU: formatProductId(x),
          ProductName: x.product.title,
          Quantity: 1,
          ItemPrice: x.price / 100,
          RowTotal: x.price / 100,
          ProductURL: window.location.origin + x.url,
          ImageURL: x.image,
          ProductCategories: []
        }))
      }
    ]);
  }
  const event: GTMOrderEvent = {
    event: 'order_in_progress',
    order: {
      tid,
      phase: 'SHOPPING',
      currency: siteVersion === SiteVersion.AU ? 'AUD' : 'USD',
      total_amount: cart.total / 100,
      number: cart.number,
      email: user ? user.email : undefined,
      line_items: cart.items.map((x) => ({
        sku: formatProductId(x),
        name: x.product.title,
        description: '',
        category: '',
        variant_price: x.price / 100,
        quantity: 1,
        total_amount: x.price / 100,
        image_url: x.image,
        product_url: window.location.origin + x.url,
        line_item_id: x.lineItemId
      }))
    }
  };

  global.dataLayer.push(event);
}

// TODO
export function trackProductCollectionClick(collection: string, position: number, product: CustomizedProduct | ProductListSummary) {
  console.log('track product collection click');
}

export function trackViewedCustomizeStep(group: Group, sectionGroup: SectionGroup | null, product: CustomizedProduct, trackingLabel: string) {
  const event: GTMGenericEvent = {
    event: 'Customisation Step Viewed',
    eventDetail: {
      category: 'PDP',
      label: sectionGroup ? `${group.title} / ${sectionGroup.title}` : group.title,
      context: trackingLabel,
      product: {
        id: product.product.productId,
        sku: formatProductId(product)
      },
      step: sectionGroup ? `${group.title} / ${sectionGroup.title}` : group.title
    }
  };
  global.dataLayer.push(event);
}

export function trackStartCustomize(group: Group, sectionGroup: SectionGroup | null, product: CustomizedProduct, trackingLabel: string) {
  const event: GTMGenericEvent = {
    event: 'Customisation Started',
    eventDetail: {
      category: 'PDP',
      label: sectionGroup ? `${group.title} / ${sectionGroup.title}` : group.title,
      context: trackingLabel,
      product: {
        id: product.product.productId,
        sku: formatProductId(product)
      },
      step: sectionGroup ? `${group.title} / ${sectionGroup.title}` : group.title
    }
  };
  global.dataLayer.push(event);
}

export function trackOpenGallery(product: CustomizedProduct) {
  const event: GTMGenericEvent = {
    event: 'Clicked - Open Gallery',
    eventDetail: {
      category: 'PDP',
      label: product.product.productId,
      product: {
        id: product.product.productId,
        sku: formatProductId(product)
      }
    }
  };
  global.dataLayer.push(event);
}

export function trackToggleDressOrientation(orientation: OrientationType, product: CustomizedProduct) {
  const event: GTMGenericEvent = {
    event: 'Clicked - Toggle Dress Orientation',
    eventDetail: {
      category: 'PDP',
      label: orientation,
      product: {
        id: product.product.productId,
        sku: formatProductId(product)
      }
    }
  };
  global.dataLayer.push(event);
}

export function trackSelectCustomization(section: Section, component: Component, product: CustomizedProduct) {
  const event: GTMGenericEvent = {
    event: 'Customisation Selected',
    eventDetail: {
      category: 'PDP',
      label: component.code,
      product: {
        id: product.product.productId,
        sku: formatProductId(product)
      },
      step: section.title
    }
  };
  global.dataLayer.push(event);
}

export function trackDeselectCustomization(section: Section, component: Component, product: CustomizedProduct) {
  const event: GTMGenericEvent = {
    event: 'Customisation Deselected',
    eventDetail: {
      category: 'PDP',
      label: component.code,
      product: {
        id: product.product.productId,
        sku: formatProductId(product)
      },
      step: section.title
    }
  };
  global.dataLayer.push(event);
}

export function trackViewedProduct(product: CustomizedProduct, productSummary: ProductListSummary | null) {
  const event: GTMGenericEvent = {
    event: 'Viewed',
    eventDetail: {
      category: 'PDP',
      label: formatProductId(product),
      product: mapToProduct(product, productSummary)
    }
  };
  global.dataLayer.push(event);
}

export function trackCustomizationFinished(product: CustomizedProduct, trackingLabel: string) {
  const event: GTMGenericEvent = {
    event: 'Customisation Finished',
    eventDetail: {
      category: 'PDP',
      label: formatProductId(product),
      context: trackingLabel,
      product: {
        id: product.product.productId,
        sku: formatProductId(product)
      }
    }
  };
  global.dataLayer.push(event);
}

export function trackCMSHeaderClick(headerName: string, buttonTitle: string) {
  const event: GTMGenericEvent = {
    event: 'Clicked - CMS Header',
    eventDetail: {
      category: 'CMS',
      label: headerName
    }
  };
  global.dataLayer.push(event);
}

export function trackClickSimilarDress(from: CustomizedProduct, to: CustomizedProduct) {
  const event: GTMGenericEvent = {
    event: 'Clicked - Similar Dress',
    eventDetail: {
      category: 'PDP',
      label: formatProductId(to),
      product: {
        id: to.product.productId,
        sku: formatProductId(to)
      }
    }
  };
  global.dataLayer.push(event);
}

export function trackSelectDressFinderOption(option: string, facetGroup: FacetGroup) {
  const event: GTMGenericEvent = {
    event: 'Facet Selected',
    eventDetail: {
      category: 'Dress Finder',
      label: option,
      step: facetGroup.slug
    }
  };
  global.dataLayer.push(event);
}

export function trackDeselectDressFinderOption(option: string, facetGroup: FacetGroup) {
  const event: GTMGenericEvent = {
    event: 'Facet Deselected',
    eventDetail: {
      category: 'Dress Finder',
      label: option,
      step: facetGroup.slug
    }
  };
  global.dataLayer.push(event);
}

export function trackDressFinderCompletedSection(facetGroup: FacetGroup, options: Facet[]) {
  const event: GTMGenericEvent = {
    event: 'Completed Step',
    eventDetail: {
      category: 'Dress Finder',
      label: options.map((o) => o.facetId).join('~'),
      step: facetGroup.slug
    }
  };
  global.dataLayer.push(event);
}

export function trackSelectFacet(facetValue: string, facetCategory: string) {
  const event: GTMGenericEvent = {
    event: 'Facet Selected',
    eventDetail: {
      category: 'Search',
      label: facetValue,
      step: facetCategory
    }
  };
  global.dataLayer.push(event);
}

export function trackDeselectFacet(facetValue: string, facetCategory: string) {
  const event: GTMGenericEvent = {
    event: 'Facet Deselected',
    eventDetail: {
      category: 'Search',
      label: facetValue,
      step: facetCategory
    }
  };
  global.dataLayer.push(event);
}

export function trackSearchFilterApplied(serach: SearchParams) {
  const event: GTMGenericEvent = {
    event: 'Filter Applied',
    eventDetail: {
      category: 'Search',
      label: serach.selectedFacets.join('~')
    }
  };
  global.dataLayer.push(event);
}

export function trackSearchCleared() {
  const event: GTMGenericEvent = {
    event: 'Facets Cleared',
    eventDetail: {
      category: 'Search',
      label: ''
    }
  };
  global.dataLayer.push(event);
}

export function trackSearchLoadMore(count: number) {
  const event: GTMGenericEvent = {
    event: 'Load More',
    eventDetail: {
      category: 'Search',
      label: `Count: ${count}`
    }
  };
  global.dataLayer.push(event);
}

export function trackOpenCart() {
  const event: GTMGenericEvent = {
    event: 'Cart',
    eventDetail: {
      category: 'Cart Opened',
      label: ''
    }
  };
  global.dataLayer.push(event);
}

export function trackShared(url: string, platform: string) {
  const event: GTMSocialSharedEvent = {
    event: 'Social Shared',
    socialShared: {
      url,
      platform
    }
  };
  global.dataLayer.push(event);
}

export function trackError(code: string, status: string) {
  const event: GTMGenericEvent = {
    event: code,
    eventDetail: {
      category: 'Error',
      label: status
    }
  };
  global.dataLayer.push(event);
}

export function trackEmailCaptureCompleted(captureName: string) {
  const event: GTMGenericEvent = {
    event: 'Email Capture Completed',
    eventDetail: {
      category: 'Email Capture',
      label: captureName
    }
  };
  global.dataLayer.push(event);
}

export function trackEmailCaptureSkipped(captureName: string) {
  const event: GTMGenericEvent = {
    event: 'Email Capture Skipped',
    eventDetail: {
      category: 'Email Capture',
      label: captureName
    }
  };
  global.dataLayer.push(event);
}

export function trackPageView(siteVersion: SiteVersion, type: GTMPageType, product: CustomizedProduct | null, productSummary: ProductListSummary | null, collection: ProductDocument[] | null) {
  const event: GTMPageView = {
    event: 'Page Loaded',
    page: {
      type
    },
    product: product ? mapToProduct(product, productSummary) : null,
    collection: collection ? collection.map((p) => mapToListProduct(siteVersion, p)) : null
  };
  global.dataLayer.push(event);
}
