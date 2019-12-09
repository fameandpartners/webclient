import React from 'react';
import { storiesOf } from '@storybook/react';
import CustomizationOverview from '@components/customization-overview/CustomizationOverview';
import { action } from '@storybook/addon-actions';
import { Group } from 'typings/product';
import { HeightUnitType, SizeUnitType, SiteVersion } from '@common/constants';
import { createBrowserHistory } from 'history';
import configureStore from '@common/rematch';
import { Provider } from 'react-redux';
import UserProvider, { UserContext } from '@common/context/UserContext';
import SiteVersionProvider from '@common/context/SiteVersionContext';

const red: any = {
    title: 'Red',
    code: 'red',
    meta: {
        hex: 'red'
    }
};

const green: any = {
    title: 'Red',
    code: 'red'
};

const size10: any = {
    title: 'US 10',
    code: 'US10'
};

const hemruffel: any = {
    title: 'Change Hemruffel',
    price: 1000,
    code: 'hemruffel'
};

const mini: any = {
    title: 'Make Mini',
    price: 0,
    code: 'mini'
};

const product: any = {
    groups: [
        {
            title: 'Colour',
            sectionGroups: [
                {
                    title: '',
                    sections: [
                        {
                            title: '',
                            options: [{ code: red.code }, { code: green.code }]
                        }
                    ]
                }
            ]
        },
        {
            title: 'Customize',
            sectionGroups: [
                {
                    title: '',
                    sections: [
                        {
                            title: '',
                            options: [{ code: hemruffel.code }, { code: mini.code }]
                        }
                    ]
                }
            ]
        },
        {
            title: 'Size',
            sectionGroups: [
                {
                    title: '',
                    sections: [
                        {
                            title: '',
                            options: [{ code: size10.code }]
                        }
                    ]
                }
            ]
        },
        {
          title: 'Shipping',
          sectionGroups: [
              {
                  title: '',
                  sections: [
                      {
                          title: '',
                          options: [{ code: size10.code }]
                      }
                  ]
              }
          ]
      },
    ]
};

const startCustomize = () => {
    action(`Clicked customize`);
};

const store = configureStore(undefined);

storiesOf('Components/CustomizationOverview', module)
    .addDecorator((story) => (
        <Provider store={store}>
            <UserProvider>
                <SiteVersionProvider>
                    {story()}
                </SiteVersionProvider>
            </UserProvider>
        </Provider>
    ))
    .add('no customizations', () => (
      <CustomizationOverview
          canCustomize={true}
          includeSeparators={true}
          customizedProduct={{ product, height: null, heightUnit: HeightUnitType.CM, sizeUnit: SizeUnitType.AU, components: [red] }}
          startCustomize={startCustomize}
      />
    ))
    .add('no customizations with Apple Pay', () => (
        <CustomizationOverview
            canCustomize={true}
            includeSeparators={true}
            customizedProduct={{ product, height: null, heightUnit: HeightUnitType.CM, sizeUnit: SizeUnitType.AU, components: [red] }}
            startCustomize={startCustomize}
            applePaySupport={true}
        />
    ))
    .add('normal customizations', () => (
        <CustomizationOverview
            canCustomize={true}
            includeSeparators={true}
            customizedProduct={{ product, height: null, heightUnit: HeightUnitType.CM, sizeUnit: SizeUnitType.AU, components: [green, size10, hemruffel, mini] }}
            startCustomize={startCustomize}
        />
    ))
    .add('bridesmaid customization', () => (
        <CustomizationOverview
            canCustomize={true}
            includeSeparators={true}
            customizedProduct={{ product, height: null, heightUnit: HeightUnitType.CM, sizeUnit: SizeUnitType.AU, components: [] }}
            startCustomize={startCustomize}
        />
    ))
    .add('color customization', () => (
        <CustomizationOverview
            canCustomize={true}
            includeSeparators={true}
            customizedProduct={{ product: { ...product, groups: [product.groups[0]] }, height: null, heightUnit: HeightUnitType.CM, sizeUnit: SizeUnitType.AU, components: [red] }}
            startCustomize={startCustomize}
            condensed
        />
    ));
