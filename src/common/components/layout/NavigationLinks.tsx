import React, { PureComponent } from 'react';
import classnames from 'classnames';
import { CmsNavigationLinkList, CmsNavigationLink, CmsNavigationLinkSection } from '@components/cms/CmsPageGlobalConfig';
import { mapToMedia } from '@components/cms/CmsUtils';

export interface NavigationProps {
    items: CmsNavigationLinkList;
    showAd: boolean;
    showTitle: boolean;

    horizontal?: boolean;
}

class NavigationLinks extends PureComponent<NavigationProps> {

    public static defaultProps: Partial<NavigationProps> = {
        horizontal: false,
    };

    private renderTitle({ title }: CmsNavigationLinkSection) {
        if (!title || !this.props.showTitle) {
            return null;
        }

        return <p className="NavigationLinks__Title">
            <style jsx>{`
                @import 'vars';

                .NavigationLinks__Title {
                    text-transform: uppercase;
                    margin-bottom: 2*$space-base;
                }
            `}</style>
            {title}
        </p>;
    }

    private renderLink(item: CmsNavigationLink, i: number) {
        /* if ('type' in item && item.type === 'divider') {
            return <li className="NavigationLinks__Divider" key={`divider-${i}`}>-</li>;
        } */

        return (
            <li key={item.title} className={classnames({ horizontal: this.props.horizontal })}>
                <style jsx>{`
                    @import 'vars';

                    li {
                        &.horizontal {
                            display: inline-block;
                            margin-right: 20px;
                            margin-bottom: 0;
                        }
                    }
                `}</style>
                
                {item.url ? <a className="no-underline" href={item.url}>{item.title}</a> : item.title}
            </li>
        );

    }

    private renderGroup(group: CmsNavigationLinkSection, index: number) {
        return (
            <div className="NavigationLinks" key={index}>
                <style jsx>{`
                    @import "vars";
                    
                    .NavigationLinks {
                        @include text-style-navigation-item;
                    }

                    :global(.NavigationLinks__Divider) {
                        @include media("<tablet") {
                            display: none;
                        }
                    }

                    ul {
                        :global(li) {
                            margin-bottom: $space-base;

                            
                        }
                    }
                `}</style>
                {this.renderTitle(group)}
                <ul>{group.links.map(this.renderLink, this)}</ul>
            </div>
        );
    }

    private renderAd({ promoMedia, promoText, promoUrl }: CmsNavigationLinkList) {
        return (<React.Fragment>
            <div className="NavigationSpacer" />
            <div className="NavigationAd">
                <a className="no-underline" href={promoUrl}>
                    {mapToMedia(promoMedia)}

                    {promoText}
                </a>
            </div>
            </React.Fragment>
        );
    }

    public render() {
        const { items, showAd } = this.props;

        return (
            <React.Fragment>
                {items.sections.map(this.renderGroup, this)}
                {showAd && items.promoText && this.renderAd(items)}
            </React.Fragment>
        );
    }
}

export default NavigationLinks;
