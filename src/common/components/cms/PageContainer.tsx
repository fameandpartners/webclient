import React from 'react';
import { CmsElement, CmsAssetImage } from 'typings/cms';
import BaseLayout from '@containers/BaseLayout';
import SEOIndexPage from '@components/base/Seo/SeoIndexPage';
import classNames from 'classnames';
import { SiteVersionContext } from '@common/context/SiteVersionContext';

export interface CmsPageContainer extends CmsElement {
    url: string;
    metaTitle: string;
    metaDescription: string;
    metaImage?: CmsAssetImage;
    pageIndex: boolean;
    headerStyle: 'White' | 'Transparent with white text' | 'Transparent with black text';
    backgroundColor: 'White' | 'Light Pink';
    content: React.ReactNode;
}

const PageContainer: React.SFC<CmsPageContainer> = ({ url, metaTitle, metaDescription, metaImage, pageIndex, content, headerStyle, backgroundColor }: CmsPageContainer) => {
    const transparentHeader = headerStyle === 'Transparent with black text' || headerStyle === 'Transparent with white text';
    const textColorWhenTransparent = headerStyle === 'Transparent with white text' ? 'white' : undefined;
    const innerClassName = classNames(
        'inner',
        {
            'inner--background-light-pink': backgroundColor === 'Light Pink'
        }
    );

    return <BaseLayout transparentHeader={transparentHeader} headerTextColorWhenTransparent={textColorWhenTransparent} headerBackgroundColor={backgroundColor}>
        <style jsx>{`
            @import 'vars';
            
            .inner {
        
                &--background-light-pink {
                    background-color: $color-light-pink;
                }

                :global(h1) {
                    @include text-style-content-h1;
                }

                :global(h2) {
                    @include media("<tablet") {
                        line-height: 40px;
                    }
                }

                :global(table) {
                    width: 100%;
                    text-align: center;
                    border-collapse: collapse;

                    :global(.dark-grey) {
                        background-color: #f2f2f2;
                    }

                    :global(.grey) {
                        background-color: #fcfcfc;
                    }

                    :global(.sub-heading) {
                        font-weight: bold;
                    }

                    :global(tr) {
                        border-bottom: 1px solid #ddd;
                    }

                    :global(td), :global(th) {
                        padding: 4px 8px;
                    }

                    :global(td:nth-child(1)), :global(td:nth-child(2)) {
                        width: 95px;
                      }
                    :global(td:nth-child(1)), :global(td:nth-child(2)), :global(td:nth-child(5)), :global(td:nth-child(6)), :global(td:nth-child(9)), :global(td:nth-child(10)), :global(td:nth-child(11)){
                        background-color: #f2f2f2;
                      }
                    :global(td:nth-child(3)), :global(td:nth-child(4)), :global(td:nth-child(7)), :global(td:nth-child(8)){
                        background-color: #fcfcfc;
                      }
                }
            }
        `}</style>
        <SiteVersionContext.Consumer>{(sv) => 
            <SEOIndexPage
                canonicalUrl={url}
                description={metaDescription}
                keywords={''}
                siteVersion={sv}
                title={metaTitle}
                shouldIndex={pageIndex as any}
                image={metaImage}
                customizedProduct={undefined}
            />
        }</SiteVersionContext.Consumer>
        <div className={innerClassName}>
            {content}
        </div>
    </BaseLayout>;
};

export default PageContainer;