import React from 'react';
import { Component, CustomizedProduct, OrderCustomizedProduct, OrderComponent } from 'typings';
import { sortByOrder } from '@common/utils/product';
import { ComponentType } from '@common/utils/component-type';
import { HeightUnitType, SiteVersion } from '@common/constants';
import { convertTotalInchToFeetAndInch } from '@common/utils/size-helper';
import classnames from 'classnames';
import FabricOrColorCircle from '@components/customization-overview/FabricOrColorCircle';

interface Props {
    customizedProduct: CustomizedProduct | OrderCustomizedProduct;
    components: Array<Component | OrderComponent>;
    slim: boolean;
    showSwatch?: boolean;
    siteVersion: SiteVersion;
}

function formatName(siteVersion: SiteVersion, c: Component | OrderComponent, cp: CustomizedProduct | OrderCustomizedProduct): React.ReactNode {
    if (c.componentTypeCategory === ComponentType.Size) {
        let height = '';
        if (cp.heightUnit === HeightUnitType.CM) {
            height = `${cp.height}cm`;
        } else if (cp.heightUnit === HeightUnitType.INCH && cp.height) {
            const { feet, inch } = convertTotalInchToFeetAndInch(cp.height);
            height = `${feet}' ${inch}"`;
        }

        let size = c.title;
        if ('sizeUs' in c.meta && 'sizeAu' in c.meta) {
            const countryCode = siteVersion === SiteVersion.US ? 'US' : 'AU';
            const sizeValue = siteVersion === SiteVersion.US ? c.meta.sizeUs! : c.meta.sizeAu!;

            size = `${countryCode} ${sizeValue}`;
        }

        if (!height || height === '') {
            return size;
        } else {
            return `${size} • ${height}`;
        }
    }

    return c.title;
}

const ComponentList: React.SFC<Props> = ({ components, customizedProduct, slim, showSwatch, siteVersion }) => {
    return (
        <div className={'PDP__Content__Components-list-wrapper'}>
            <style jsx>{`
                @import 'vars';

                .PDP__Content__Components-list-wrapper {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                }

                .PDP__Content__Components-list {
                    @include text-style-form-option;

                    margin: $space-base 0;

                    &.PDP__Content__Components-list--slim {
                        margin: 0;
                    }

                    &:empty {
                        margin: 0;
                    }

                    li {
                        display: inline-block;
                    }
                }
            `}</style>

            <ul className={classnames('PDP__Content__Components-list', {'PDP__Content__Components-list--slim': slim})}>
                {components.sort(sortByOrder).map((c, index) =>
                    <li key={c.code}>
                        {showSwatch && c.meta.hex && <FabricOrColorCircle component={c} style={{width: 16, height: 16, marginBottom: -3, marginRight: 8}} />}
                        {formatName(siteVersion, c, customizedProduct)}
                        {index !== components.length - 1 && ',\u00A0'}
                    </li>
                )}
            </ul>
        </div>
    );
};

export default ComponentList;
