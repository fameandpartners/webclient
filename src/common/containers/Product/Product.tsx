import { DEFAULT_HEIGHT_UNIT, DEFAULT_SIZE_UNIT, SiteVersion } from '@common/constants';
import { AddToCart } from '@common/rematch/models/cart';
import { ProductsModelRootState } from '@common/rematch/models/products';
import { OrientationType } from '@common/utils/orientation-type';
import { PreviewType } from '@common/utils/preview-type';
import { getRelevantComponents, isNewProduct } from '@common/utils/product';
import { getDefaultParent, getParentComponentCodes } from '@common/utils/product-component';
import { getFirstInvalidSectionGroup } from '@common/utils/product-validation';
import { componentShouldBeInUrl, generateProductDetailUrl, getComponentsFromSlug, getIdFromSlug, URL_COMPONENT_SEPARATOR } from '@common/utils/url-helper';
import ErrorPage from '@components/error-page/ErrorPage';
import GalleryModal from '@components/gallery-modal/GalleryModal';
import ProductPage from '@containers/Product/ProductPage';
import { Component, Group, Product as ProductModel, User, CustomizedProduct, SectionGroup } from '@typings';
import React from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router';
import { trackOpenGallery, trackToggleDressOrientation, trackPageView, trackViewedCustomizeStep, trackViewedProduct } from '@common/analytics/analytics';
import { isBrowser } from '@common/utils/server-client-helpers';
import FullScreenLoader from '@components/base/FullScreenLoader';
import { formatProductId } from '@common/utils/render-url-helper';
import { CmsElementState } from '@common/rematch/models/cms';
import { CmsPageGlobalConfig } from '@components/cms/CmsPageGlobalConfig';

interface Props extends RouteComponentProps<{ slug: string }> {
  products: ProductsModelRootState;
  isAddingToCart: boolean;
  isErrorAddingToCart: boolean;
  addToCart: AddToCart;

  siteVersion: SiteVersion;

  loadProduct: (id: string) => void;
  loadProductSummaries: (pids: string[]) => void;
  loadSimilarSilhouettes: (silhouette: string) => void;

  user: User | null;

  pageConfig?: CmsElementState<CmsPageGlobalConfig>;
}

interface State {
  currentCustomizedProduct: CustomizedProduct | null | undefined;
  customizeBeforeAddingToCart: boolean;
  orientation: OrientationType;
}

class Product extends React.Component<Props, State> {
  public static getDerivedStateFromProps(nextProps: Props, prevState: State): Partial<State> {
    const { siteVersion, match, loadProduct, loadProductSummaries, products } = nextProps;

    const id = getIdFromSlug(match.params.slug);

    const product = products.products[id];
    console.log('--> product products', products);

    if (product) {
      const { currentCustomizedProduct } = prevState;
      console.log(currentCustomizedProduct);

      const { colorIdOrCodes, componentCodes } = getComponentsFromSlug(match.params.slug, nextProps.location.search);

      const components: Component[] = componentCodes.map((code) => product.components.find((x) => x.code === code)).notNullOrUndefined();
      const colors = colorIdOrCodes.map((codeOrId) => product.components.find((x) => x.code === codeOrId || x.cartId === parseInt(codeOrId, 10) || x.meta.colorCode === codeOrId || x.meta.colorId === parseInt(codeOrId, 10)));

      const urlComponents = [...components, ...colors].notNullOrUndefined();

      // Need to load saved localStorage height and sizeComponent
      let height = 76;
      let heightUnit = DEFAULT_HEIGHT_UNIT[siteVersion];
      let sizeUnit = DEFAULT_SIZE_UNIT[siteVersion];

      const parentCodes = getParentComponentCodes(product);
      const parentFromUrl = components.find((x) => parentCodes.includes(x.code));
      const defaultParent = parentFromUrl || getDefaultParent(product);

      let selectedComponents: Component[] = [...urlComponents];

      if (currentCustomizedProduct) {
        height = currentCustomizedProduct.height;
        sizeUnit = currentCustomizedProduct.sizeUnit;
        heightUnit = currentCustomizedProduct.heightUnit;
        selectedComponents = [...currentCustomizedProduct.components.filter((x) => !componentShouldBeInUrl(x)), ...selectedComponents];
      }

      const defaultComponents = getRelevantComponents({ product, selectedComponents, additionalComponent: undefined, defaultParent });

      const updatedCustomizedProduct = {
        product,
        components: defaultComponents,
        height,
        heightUnit,
        sizeUnit
      };

      // Only load the summary for new products
      const pid = formatProductId(updatedCustomizedProduct);
      if (isNewProduct(pid) && !pid.endsWith(URL_COMPONENT_SEPARATOR)) {
        loadProductSummaries([pid]);
      }

      return {
        currentCustomizedProduct: updatedCustomizedProduct
      };
    } else if (product === undefined) {
      loadProduct(id);
      return {
        currentCustomizedProduct: undefined
      };
    } else {
      return {
        currentCustomizedProduct: null
      };
    }
  }

  constructor(props: Props) {
    super(props);

    this.state = {
      currentCustomizedProduct: undefined,
      customizeBeforeAddingToCart: false,
      orientation: OrientationType.Front
    };
  }

  public componentDidMount() {
    if (this.state.currentCustomizedProduct) {
      const pid = formatProductId(this.state.currentCustomizedProduct);
      const summary = this.props.products.productListSummmaries[pid];

      trackPageView(this.props.siteVersion, 'product', this.state.currentCustomizedProduct, summary, null);
      trackViewedProduct(this.state.currentCustomizedProduct, summary);
    }
  }

  private goToCustomizationStep = (group: Group, sectionGroup: SectionGroup | null, customizedProduct: CustomizedProduct, trackingLabel: string) => {
    trackViewedCustomizeStep(group, sectionGroup, customizedProduct, trackingLabel);

    if (group.sectionGroups.length === 1) {
      this.props.history.push(generateProductDetailUrl(customizedProduct, '/customize/' + group.slug));
    } else {
      const firstOrSelectedSectionGroup = sectionGroup || group.sectionGroups[0];
      this.props.history.push(generateProductDetailUrl(customizedProduct, '/customize/' + group.slug + '/' + firstOrSelectedSectionGroup.slug));
    }
  }

  private goToProductPage = (customizedProduct: CustomizedProduct) => {
    this.saveSelection(customizedProduct);
    this.props.history.push(generateProductDetailUrl(customizedProduct, ''));
  }

  private goToGallery = (position: number, customizedProduct: CustomizedProduct) => {
    trackOpenGallery(customizedProduct);

    if (customizedProduct.product.media.length > 0 || customizedProduct.product.previewType === PreviewType.Render) {
      this.props.history.push(generateProductDetailUrl(customizedProduct, '/gallery/' + position));
    }
  }

  private saveSelection = (customizedProduct: CustomizedProduct) => {
    this.setState({ currentCustomizedProduct: customizedProduct });
  }

  protected onAddToCart = (customizedProduct: CustomizedProduct) => {
    const invalidSectionGroup = getFirstInvalidSectionGroup(customizedProduct);

    if (invalidSectionGroup === null) {
      const pid = formatProductId(customizedProduct);
      const summary = this.props.products.productListSummmaries[pid];
      this.props.addToCart({ product: customizedProduct, summary });
      this.setState({ customizeBeforeAddingToCart: false });
    } else {
      this.setState({ customizeBeforeAddingToCart: true });
      this.goToCustomizationStep(invalidSectionGroup.group, invalidSectionGroup.sectionGroup, customizedProduct, 'Complete Section On Add To Cart');
    }
  }

  private showOrientation = (orientation: OrientationType, trackEvent: boolean) => {
    if (isBrowser() && trackEvent) {
      trackToggleDressOrientation(orientation, this.state.currentCustomizedProduct!!);
    }

    this.setState({ orientation });
  }

  public render() {
    const { match, isAddingToCart, isErrorAddingToCart, siteVersion, products } = this.props;
    const { currentCustomizedProduct, customizeBeforeAddingToCart } = this.state;
    if (currentCustomizedProduct === undefined) {
      return <FullScreenLoader />;
    }

    if (currentCustomizedProduct === null) {
      return <ErrorPage type={404} />;
    }

    return (
      <React.Fragment>
        <Switch>
          <Route
            path={match.path + '/gallery/:position?'}
            render={({ match: submatch }) => {
              const { position } = submatch.params;

              return <GalleryModal position={parseInt(position, 10)} customizedProduct={currentCustomizedProduct} productListSummaries={products.productListSummmaries} goToGallery={this.goToGallery} goToProductPage={this.goToProductPage} siteVersion={siteVersion} />;
            }}
          />

          <Route
            path={match.path}
            render={() => (
              <ProductPage
                addToCart={this.onAddToCart}
                isAddingToCart={isAddingToCart}
                isErrorAddingToCart={isErrorAddingToCart}
                customizeBeforeAddingToCart={customizeBeforeAddingToCart}
                currentCustomizedProduct={currentCustomizedProduct}
                productListSummaries={this.props.products.productListSummmaries}
                orientation={this.state.orientation}
                showOrientation={this.showOrientation}
                saveSelection={this.saveSelection}
                goToCustomizationStep={this.goToCustomizationStep}
                goToGallery={this.goToGallery}
                goToProductPage={this.goToProductPage}
                loadProductSummaries={this.props.loadProductSummaries}
                loadSimilarSilhouettes={this.props.loadSimilarSilhouettes}
                pageConfig={this.props.pageConfig}
              />
            )}
          />

          <Route render={() => <ErrorPage type={404} />} />
        </Switch>
      </React.Fragment>
    );
  }
}

export default Product;
