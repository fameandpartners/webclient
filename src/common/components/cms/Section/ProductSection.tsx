import { CustomizedProduct, ProductListSummary } from 'typings/product';
import React from 'react';
import BaseSection, { SectionWidth, BaseSectionGridSpacingBottom } from '@components/cms/Section/BaseSection';
import BaseSectionGrid, { BaseSectionGridConfiguration, BaseSectionGridGutter } from '@components/cms/Section/BaseSectionGrid';
import { connectProducts, connectProductSummaries } from '@containers/CmsPage/DataLoader';
import { ItemProduct } from '@components/cms/Item/Product';
import { ItemTextAlign } from '../Item/BaseItem';

interface Props {
    pids: string[];
    products: ProductListSummary[];
    gridConfiguration:  BaseSectionGridConfiguration;
    mobileGridConfiguration:  BaseSectionGridConfiguration;
    width: SectionWidth;
    mobileWidth: SectionWidth;
    spacingBottom: BaseSectionGridSpacingBottom;
    mobileSpacingBottom: BaseSectionGridSpacingBottom;
    gridGutter: BaseSectionGridGutter;
    mobileGridGutter: BaseSectionGridGutter;
    textAlignment: ItemTextAlign;
    background?: 'None' | 'Light Grey';
}

const ProductSection: React.SFC<Props> = ({ products, gridConfiguration, width, mobileWidth, mobileGridConfiguration, spacingBottom, mobileSpacingBottom, gridGutter, mobileGridGutter, textAlignment, background}: Props) => {
    const title = null;

    return (
        <BaseSection width={width} spacingBottom={spacingBottom} mobileSpacingBottom={mobileSpacingBottom} mobileWidth={mobileWidth}>
            <style jsx>{`
                @import 'vars';

                h3 {
                    @include container;
                    margin-bottom: 3*$space-base;
                }
            `}</style>

            {title && <h3>{title}</h3>}

            <BaseSectionGrid gridConfiguration={gridConfiguration} mobileGridConfiguration={mobileGridConfiguration} gridGutter={gridGutter} mobileGridGutter={mobileGridGutter}>
                {products && products.map((product, index) => {
                    return <div key={index}>
                        <ItemProduct product={product} pid={product.pid} size="Normal - top" textAlignment={textAlignment} textSize="Medium" mobileSize="Normal - top" background={background} />
                    </div>;
                })}
            </BaseSectionGrid>
        </BaseSection>
    );
};

export default connectProductSummaries()(ProductSection);
