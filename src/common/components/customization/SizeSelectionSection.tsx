import { SAVED_HEIGHT, SAVED_HEIGHT_UNIT, SAVED_SIZE_UNIT, SAVED_SIZE_AU, SAVED_SIZE_US, HeightUnitType, SiteVersion, SizeUnitType } from '@common/constants';
import { setLocalData } from '@common/services/localStorage';
import { ComponentType } from '@common/utils/component-type';
import { sortByOrder, mapToCode } from '@common/utils/product';
import { isHeightValid, isSizeValid } from '@common/utils/product-validation';
import { convertCmToTotalInch, convertTotalInchesToFeetInchString, convertTotalInchToCm, extractCmAndTotalInches } from '@common/utils/size-helper';
import Dropdown from '@components/base/Input/Dropdown';
import Input from '@components/base/Input/Input';
import InputWrapper from '@components/base/Input/InputWrapper';
import Toggle from '@components/base/Input/Toggle';
import classnames from 'classnames';
import React, { FormEvent } from 'react';
import { FormattedMessage } from 'react-intl';
import { Component, CustomizedProduct, Section, SectionComponent } from 'typings/product';

interface State {
  inches: number | null;
  cm: number | null;
  showHeightError: boolean;
  showSizeError: boolean;
}

interface Props {
  section: Section;
  customizedProduct: CustomizedProduct;
  saveSize: (options: Partial<CustomizedProduct>) => void;
  onSelected: (sectionComponents: SectionComponent[]) => void;

  showErrors: boolean;
  siteVersion: SiteVersion;
}

class SizeSelectionSection extends React.PureComponent<Props, State> {
  public state: State = {
    ...extractCmAndTotalInches(this.props.customizedProduct),
    showHeightError: false,
    showSizeError: false
  };

  private onSelectHeightUnit = (e: string) => {
    if (e === HeightUnitType.CM) {
      setLocalData(SAVED_HEIGHT, this.state.cm);
      setLocalData(SAVED_HEIGHT_UNIT, HeightUnitType.CM);
      this.props.saveSize({ height: this.state.cm, heightUnit: HeightUnitType.CM });
    } else {
      setLocalData(SAVED_HEIGHT, this.state.inches || 0);
      setLocalData(SAVED_HEIGHT_UNIT, HeightUnitType.INCH);
      this.props.saveSize({ height: this.state.inches || 0, heightUnit: HeightUnitType.INCH });
    }
  }

  private updateCm = (e: FormEvent<HTMLInputElement>) => {
    let cm = null;
    let inches = null;
    let height = null;

    if (e.currentTarget.checkValidity()) {
      cm = parseInt(e.currentTarget.value, 10);
      height = cm;
      inches = convertCmToTotalInch(cm);
    }

    setLocalData(SAVED_HEIGHT, height!!);
    setLocalData(SAVED_HEIGHT_UNIT, HeightUnitType.CM);
    this.props.saveSize({ height: height!!, heightUnit: HeightUnitType.CM });

    this.setState({
      cm,
      inches
    });
  }

  private updateInches = (totalInches: string) => {
    const inches = parseInt(totalInches, 10);
    const cm = convertTotalInchToCm(inches);

    this.setState({ inches, cm });
    setLocalData(SAVED_HEIGHT, inches || 0);
    setLocalData(SAVED_HEIGHT_UNIT, HeightUnitType.INCH);
    this.props.saveSize({ height: inches, heightUnit: HeightUnitType.INCH });
  }

  private sizeName(size: Component) {
    const { siteVersion } = this.props;

    const countryCode = siteVersion === SiteVersion.US ? 'US' : 'AU';
    const sizeValue = siteVersion === SiteVersion.US ? size.meta.sizeUs! : size.meta.sizeAu!;

    return {
      name: `${countryCode} ${sizeValue}`,
      value: size.code
    };
  }

  public render() {
    const { customizedProduct, siteVersion } = this.props;

    const sizeOptions = customizedProduct.product.components.filter((c) => this.props.section.options.map(mapToCode).includes(c.code)).sort(sortByOrder);

    const selectedSize = customizedProduct.components.find((x) => x.componentTypeCategory === ComponentType.Size);

    const validHeight = isHeightValid(customizedProduct);
    const validSize = isSizeValid(customizedProduct);

    const inchesCount = customizedProduct.product.size.maxHeightInch - customizedProduct.product.size.minHeightInch;
    const inches = [
      {
        title: 'INCH',
        value: 'INCH',
        options: Array.from({ length: inchesCount + 1 }, (k, i) => i + customizedProduct.product.size.minHeightInch).map((x) => {
          return {
            name: convertTotalInchesToFeetInchString(x),
            value: x.toString()
          };
        })
      }
    ];

    // Sizes are based on the current siteversion
    const sizes = sizeOptions.map((option) => this.sizeName(option));

    return (
      <React.Fragment>
        <style jsx>{`
          @import 'vars';

          .size-selection {
            margin-top: space(2);
            padding: 0 space(2);
          }

          .height,
          .size {
            margin-bottom: 2 * $space-base;

            @include desktop {
              margin-top: 4 * $space-base;
            }
          }

          .height {
            @include desktop {
              margin-top: 2 * $space-base;
            }
          }

          .height-section-wrapper {
            display: flex;
          }

          .height-section {
            flex: 1;
            display: flex;
          }

          .height-input {
            flex: 2;
            display: flex;
            margin-right: 3 * $space-base;

            :global(div.dropdown-container) {
              flex: 1;
            }

            &.height-input--cm {
              border: 1px solid $color-grey90;
            }
          }

          p {
            text-align: center;
            @include text-style-form-label;
            @include desktop {
              margin-bottom: 4 * $space-base;
            }
          }

          .size-info {
            background: $color-grey96;
            padding: 2 * $space-base;
            text-align: center;

            margin-top: -$space-base * 2;

            p {
              margin: 0;
            }
          }

          :global(.size-section-wrapper) {
            display: flex;
            flex-wrap: wrap;
            margin: 0 (-$space-base);
          }

          .size-option {
            width: 25%;
            padding: 0 $space-base;
            margin-bottom: 2 * $space-base;
            cursor: pointer;
            user-select: none;

            > div {
              padding: 2 * $space-base 0;
              border: 1px solid $color-grey90;
              text-align: center;

              @include border-transition;
            }

            &.active {
              > div {
                border: 1px solid $color-black;
              }
            }
          }

          .input-info {
            text-align: center;
            > a {
              color: $color-grey79;
            }
          }
        `}</style>
        <div className={classnames('size-selection', { 'size-selection--error': this.props.showErrors })}>
          <div className="height">
            <p>
              <FormattedMessage id="PDP.SizeSelection.HeightTitle" defaultMessage="HEIGHT" />
              <br />
              <FormattedMessage id="PDP.SizeSelection.HeightDescription" defaultMessage="Tell us your height without heels and we'll do the rest" />
            </p>

            <InputWrapper
              className="height-section-wrapper"
              error={(this.state.showHeightError || this.props.showErrors) && !validHeight}
              inlineError={
                customizedProduct.heightUnit === HeightUnitType.CM ? (
                  <FormattedMessage
                    id="PDP.SizeSelection.Height.ErrorCm"
                    defaultMessage={'Please enter your height between {min} and {max}'}
                    values={{
                      min: customizedProduct.product.size.minHeightCm,
                      max: customizedProduct.product.size.maxHeightCm
                    }}
                  />
                ) : (
                  <FormattedMessage id="PDP.SizeSelection.Height.ErrorInch" defaultMessage={'Please select your height'} values={{ min: customizedProduct.product.size.minHeightCm, max: customizedProduct.product.size.maxHeightCm }} />
                )
              }
            >
              <div className="height-section">
                <div
                  className={classnames('height-input', {
                    'height-input--error': (this.state.showHeightError || this.props.showErrors) && !validHeight,
                    'height-input--cm': customizedProduct.heightUnit === HeightUnitType.CM,
                    'height-input--inch': customizedProduct.heightUnit === HeightUnitType.INCH
                  })}
                >
                  {customizedProduct.heightUnit === HeightUnitType.INCH ? (
                    <Dropdown placeholder="Height" optionGroups={inches} selected={this.state.inches ? this.state.inches.toString() : null} onSelect={this.updateInches} isError={(this.state.showSizeError || this.props.showErrors) && !validSize} />
                  ) : (
                    <Input
                      type="text"
                      placeholder="Height"
                      inputMode="decimal"
                      required
                      noBorder
                      min={customizedProduct.product.size.minHeightCm}
                      max={customizedProduct.product.size.maxHeightCm}
                      minLength={0}
                      maxLength={3}
                      onChange={this.updateCm}
                      onBlur={() => this.setState({ showHeightError: true })}
                      value={this.state.cm || ''}
                    />
                  )}
                </div>
                <Toggle initialValue={customizedProduct.heightUnit === HeightUnitType.CM} leftTitle={'IN'} leftValue={HeightUnitType.INCH} rightTitle={'CM'} rightValue={HeightUnitType.CM} onToggle={this.onSelectHeightUnit} />
              </div>
            </InputWrapper>
          </div>

          <div className="size">
            <p>
              <FormattedMessage id="PDP.SizeSelection.SizeTitle" defaultMessage="SIZE" />
            </p>

            <InputWrapper className="size-section-wrapper" error={(this.state.showSizeError || this.props.showErrors) && !validSize} inlineError={<FormattedMessage id="PDP.SizeSelection.Size.Error" defaultMessage="Please select your size." />}>
              {sizes.map((size) => (
                <div
                  key={size.value}
                  className={classnames('size-option', { active: !!(selectedSize && selectedSize.code === size.value) })}
                  onClick={() => {
                    const component = customizedProduct.product.components.find((x) => x.code === size.value)!!;
                    const sizeUnit = siteVersion === SiteVersion.US ? SizeUnitType.US : SizeUnitType.AU;
                    const metaData = component.meta || {};

                    this.props.onSelected([{ section: this.props.section, components: [component] }]);
                    setLocalData(SAVED_SIZE_AU, metaData.sizeAu);
                    setLocalData(SAVED_SIZE_US, metaData.sizeUs);
                    setLocalData(SAVED_SIZE_UNIT, sizeUnit);
                    this.props.saveSize({ sizeUnit });
                    this.setState({ showSizeError: true });
                  }}
                >
                  <div>{size.name}</div>
                </div>
              ))}
            </InputWrapper>

            <p className="input-info">
              <a href="/size-guide" target="_blank">
                <FormattedMessage id="PDP.SizeSelection.MoreInfo.Link" defaultMessage="View our size guide" />
              </a>
            </p>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default SizeSelectionSection;
