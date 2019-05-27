import { PreviewType } from '@common/utils/preview-type';
import { auditSelectionType, getRelevantComponents, getSelectedComponents } from '@common/utils/product';
import { isSectionGroupValid, isSizeSection, isSizeSectionComponent, isColorOrFabricSection } from '@common/utils/product-validation';
import Button from '@components/base/Button/Button';
import SectionGroupRender from '@components/customization/SectionGroup';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Component, Group, CustomizedProduct, SectionGroup, Section, SectionComponent } from 'typings';
import KeyListener from '@components/event-listener/KeyListener';
import { KeyCodes } from '@common/utils/key-codes';
import GroupHeaderTitles from '@components/customization/GroupHeaderTitles';
import { trackCustomizationFinished } from '@common/analytics/analytics';
import { RenderPositionId } from '@common/utils/render-position-id';
import { getCads } from '@common/utils/cad-helper';
import CadImage from '@components/product/CadImage';

const CloseCrossIcon = require('@svg/i-close-cross.svg').default;

interface Props {
  customizeBeforeAddingToCart: boolean;
  initialCustomizedProduct: CustomizedProduct;
  uncomittedCustomizedProduct: CustomizedProduct;
  currentGroup: Group;
  currentSectionGroup: SectionGroup;

  goToProductPage: (customizedProduct: CustomizedProduct) => void;
  goToCustomizationStep: (group: Group, sectionGroup: SectionGroup | null, customizedProduct: CustomizedProduct, trackingLabel: string) => void;
  addToCart: (cp: CustomizedProduct) => void;
  onCustomizationChange: (cp: Partial<CustomizedProduct>, selectedComponent?: Component) => void;
}

interface State {
  showErrors: boolean;
}

class CustomizeInline extends React.PureComponent<Props, State> {
  public state: State = {
    showErrors: false
  };

  private _custColumn = React.createRef<HTMLDivElement>();

  public componentDidUpdate(prevProps: Props) {
    if (this._custColumn.current && prevProps.currentGroup.slug !== this.props.currentGroup.slug) {
      this._custColumn.current.scrollTop = 0;
    }
  }

  // This lets us display components in previous sections / current section in full without it being affected by a future selection e.g. front not affected by straps
  private getSelectedComponents(): Component[] {
    const { currentGroup, currentSectionGroup, uncomittedCustomizedProduct } = this.props;
    const {
      product,
      product: { groups },
      components
    } = uncomittedCustomizedProduct;

    return getSelectedComponents({
      groups,
      currentSelectedGroup: currentGroup,
      currentSelectedSectionGroup: currentSectionGroup,
      currentSelectedComponents: components
    });
  }

  private onComponentSelected = (sectionComponents: SectionComponent[]) => {
    const customizedProduct = isSizeSectionComponent(sectionComponents) ? this.props.initialCustomizedProduct : this.props.uncomittedCustomizedProduct;
    const { product } = customizedProduct;
    let selectedComponents = customizedProduct.components;

    sectionComponents.forEach((sc) => {
      const { section, components } = sc;

      for (const component of components) {
        selectedComponents = auditSelectionType(section, component, selectedComponents, customizedProduct, true);
      }

      // Do incompatibilities logic for render type dresses
      if (product.previewType === PreviewType.Render || product.previewType === PreviewType.Cad) {
        for (const component of components) {
          // Update with default selections in order to keep the rendering happy (only for bridesmaids)
          selectedComponents = getRelevantComponents({ product, selectedComponents, additionalComponent: component, ignoreParent: product.previewType === PreviewType.Cad });
        }
      }
    });

    // Push change upstream
    this.props.onCustomizationChange({ components: selectedComponents }, sectionComponents.first()!.components.first());

    // Dynamic URL stuff if needed
    // const updatedCustomizedProduct = {
    //     ...customizedProduct,
    //     components: selectedComponents,
    // };

    // this.props.goToCustomizationStep(this.props.currentGroup, this.props.currentSectionGroup, updatedCustomizedProduct);
  }

  private onSizeSelected = (options: Partial<CustomizedProduct>) => {
    this.props.onCustomizationChange({
      ...options
    });
  }

  private addToCart() {
    const { currentSectionGroup, uncomittedCustomizedProduct } = this.props;
    if (isSectionGroupValid(currentSectionGroup, uncomittedCustomizedProduct)) {
      this.props.addToCart(uncomittedCustomizedProduct);
      this.props.goToProductPage(uncomittedCustomizedProduct);
    }
  }

  private go(step: number, trackingLabel: string) {
    const { currentGroup, currentSectionGroup } = this.props;
    const sectionGroupIndex = currentGroup.sectionGroups.indexOf(currentSectionGroup);

    this.goTo(sectionGroupIndex + step, trackingLabel);
  }

  private goTo(step: number, trackingLabel: string) {
    const { currentGroup, currentSectionGroup } = this.props;

    if (!isSectionGroupValid(currentSectionGroup, this.props.uncomittedCustomizedProduct)) {
      this.setState({ showErrors: true });
      return;
    }

    const nextSectionGroup = currentGroup.sectionGroups[step];

    if (nextSectionGroup) {
      this.props.goToCustomizationStep(this.props.currentGroup, nextSectionGroup, this.props.uncomittedCustomizedProduct, trackingLabel);
    } else {
      trackCustomizationFinished(this.props.uncomittedCustomizedProduct, trackingLabel);
      this.props.goToProductPage(this.props.uncomittedCustomizedProduct);
    }
  }

  private prev(trackingLabel: string) {
    this.go(-1, trackingLabel);
  }

  private next(trackingLabel: string) {
    const { currentSectionGroup, currentGroup } = this.props;
    const isCadCustomisation = currentSectionGroup.previewType === PreviewType.Cad;

    this.go(isCadCustomisation ? currentGroup.sectionGroups.length : 1, trackingLabel);
  }

  private onClose() {
    // Use:
    //  - Initial when you want to revert changes
    //  - Uncomitted to save changes on close

    // this.props.goToProductPage(this.props.initialCustomizedProduct);
    trackCustomizationFinished(this.props.uncomittedCustomizedProduct, 'Close Cross');
    this.props.goToProductPage(this.props.uncomittedCustomizedProduct);
  }

  // #region Render

  protected getButtons(): React.ReactNode {
    const { customizeBeforeAddingToCart, currentGroup, currentSectionGroup } = this.props;

    if (customizeBeforeAddingToCart) {
      return [
        <Button key="add-to-bag" className="action-buttons" onClick={() => this.addToCart()} fullwidth>
          <FormattedMessage id="Pdp.AddToCart" defaultMessage="ADD TO BAG" />
        </Button>
      ];
    } else {
      const elements = [];

      const currentIndex = currentGroup.sectionGroups.indexOf(currentSectionGroup);
      const hasPrevious = currentIndex !== 0;
      const isLast = currentIndex === currentGroup.sectionGroups.length - 1;
      const isCadCustomisation = currentSectionGroup.previewType === PreviewType.Cad;

      if (hasPrevious && !isCadCustomisation) {
        elements.push(
          <Button key="back" className="action-buttons" tertiary onClick={() => this.prev('Previous Button')} fullwidth>
            <FormattedMessage id="back" defaultMessage="Back" />
          </Button>
        );
      }

      elements.push(
        <Button key="next" className="action-buttons" onClick={() => this.next('Next Button')} fullwidth secondary={!isCadCustomisation}>
          {isLast || isCadCustomisation ? <FormattedMessage id="done" defaultMessage="Done" /> : <FormattedMessage id="next" defaultMessage="Next" />}
        </Button>
      );

      return elements;
    }
  }

  private renderHeader() {
    const { currentGroup, currentSectionGroup, customizeBeforeAddingToCart, uncomittedCustomizedProduct } = this.props;

    const { showErrors } = this.state;

    return (
      <div className={'customization-header'}>
        <style jsx>{`
          @import 'vars';

          .customization-header {
            display: flex;
            flex-direction: column;
            position: relative;

            :global(.close-cross-icon) {
              position: absolute;
              top: 20px;
              right: 16px;
            }
          }

          .group-title {
            display: flex;
            flex-grow: 1;
            align-items: center;
            justify-content: center;
            margin: 0 0 2 * $space-base;

            @include mobile {
              height: $navbar-height;
              margin-bottom: 0;
            }

            h2 {
              flex-grow: 1;
              text-align: center;
              margin: 0;

              @include mobile {
                font-size: 18px;
                line-height: 24px;
              }
            }
          }

          .info-box {
            background: $color-grey96;
            padding: 2 * $space-base;
            text-align: center;
            margin: $space-base 0;

            p {
              margin: 0;
            }
          }
        `}</style>

        <CloseCrossIcon className="close-cross-icon" style={{ cursor: 'pointer', userSelect: 'none', width: 16, height: 16 }} onClick={() => this.onClose()} />

        <div className={'group-title'}>
          <h2>{currentGroup.title}</h2>
        </div>

        {showErrors && !customizeBeforeAddingToCart && (
          <div className="info-box">
            <FormattedMessage id="PDP.CustomizationModal.Error.FillOut" defaultMessage="Oh no, it seems that you haven't completed this, yet." />
          </div>
        )}
        {customizeBeforeAddingToCart && (
          <div className="info-box">
            <FormattedMessage id="PDP.CustomizationModal.Error.FillOutBeforeAddingToCart" defaultMessage="One last thing before you can add this product to your cart..." />
          </div>
        )}

        {!currentSectionGroup.sections.some((s) => isSizeSection(s)) && !currentSectionGroup.sections.some((s) => isColorOrFabricSection(s)) && (
          <React.Fragment>
            {(currentSectionGroup.renderPositionId === RenderPositionId.CadNone || currentSectionGroup.previewType === PreviewType.Cad) && (
              <React.Fragment>
                <CadImage cads={getCads(uncomittedCustomizedProduct)} />
                {currentSectionGroup.previewType === PreviewType.Cad && <GroupHeaderTitles sectionGroups={currentGroup.sectionGroups} currentSectionGroup={currentSectionGroup} goTo={(step) => this.goTo(step, 'Customization Navigation')} />}
              </React.Fragment>
            )}
          </React.Fragment>
        )}

        {currentSectionGroup.previewType === PreviewType.Render && <GroupHeaderTitles currentSectionGroup={currentSectionGroup} sectionGroups={currentGroup.sectionGroups} goTo={(step) => this.goTo(step, 'Customization Navigation')} />}
      </div>
    );
  }

  private renderFooter() {
    const buttons = this.getButtons();

    return (
      <div className={'customization-footer'}>
        <style jsx>{`
          @import 'vars';

          $horizontal-margin: 0.075 * 100%;
          $footer-width: 100% - $horizontal-margin * 2;

          .customization-footer {
            position: absolute;
            display: inline-flex;
            justify-content: center;
            width: $footer-width;
            right: $horizontal-margin;
            bottom: 2 * $space-base;
            height: 6 * $space-base;

            @include mobile {
              // Needs to be fixed so that safari mobile for example doesn't have a spaz attack
              position: fixed;
              width: 100%;
              left: 0;
              right: 0;
              bottom: 0;
            }

            @include media($iphoneX...) {
              bottom: 4 * $space-base;
            }

            :global(.action-buttons) {
              &:nth-child(2) {
                border-left: 0;
              }
              @include desktop {
                width: 50%;
              }
            }
          }
        `}</style>
        {buttons}
      </div>
    );
  }

  public render() {
    const { currentGroup, currentSectionGroup, initialCustomizedProduct, uncomittedCustomizedProduct, customizeBeforeAddingToCart } = this.props;
    const { showErrors } = this.state;
    const { product } = uncomittedCustomizedProduct;

    return (
      <div className="CustomizeInline">
        <style jsx>{`
          @import 'vars';
          $horizontal-margin: 0.075 * 100%;

          .CustomizeInline {
            height: 100%;
            width: 100%;
            display: flex;
            flex-direction: column;

            &__MobileClose {
              display: block;
              position: fixed;
              padding: $page-padding-mobile 2 * $space-base;
              right: 0;
              top: 0;
            }
          }

          .CustomizeInline__Content {
            height: 0;
            flex: 1;
            scroll-behavior: smooth;
            overflow-y: auto;
            overflow-x: hidden;

            /* spacer for button overlay */
            &:after {
              content: '';
              height: space(8);
              display: block;
            }
          }
        `}</style>

        <KeyListener
          element={this._custColumn.current}
          options={[
            {
              keyCode: KeyCodes.Esc,
              action: () => this.onClose()
            },
            {
              keyCode: KeyCodes.Left,
              action: () => this.go(-1, 'Left Keyboard')
            },
            {
              keyCode: KeyCodes.Right,
              action: () => this.go(1, 'Right Keyboard')
            }
          ]}
        />

        {this.renderHeader()}

        <div className="CustomizeInline__Content" ref={this._custColumn} tabIndex={0}>
          <SectionGroupRender
            key={currentSectionGroup.title}
            sectionGroup={currentSectionGroup}
            componentsList={product.components}
            selectedComponents={this.getSelectedComponents()}
            initialCustomizedProduct={initialCustomizedProduct}
            currentCustomizedProduct={uncomittedCustomizedProduct}
            onSelected={this.onComponentSelected}
            saveSize={this.onSizeSelected}
            showErrors={showErrors || customizeBeforeAddingToCart}
          />
        </div>

        {this.renderFooter()}
      </div>
    );
  }

  // #endregion
}

export default CustomizeInline;
