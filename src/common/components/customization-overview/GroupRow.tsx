import React from 'react';
import { FormattedMessage } from 'react-intl';
import classnames from 'classnames';
import { Component, Group, CustomizedProduct, SectionGroup, OrderCustomizedProduct, OrderGroup, OrderSectionGroup, OrderComponent } from 'typings';
import ComponentList from './ComponentList';
import { filterComponentInSectionGroup } from '@common/utils/product';
import { ComponentType } from '@common/utils/component-type';
import { SiteVersion } from '@common/constants';
import { Mobile, Desktop } from '@components/base/MediaQuerySSR';

interface Props {
    group: Group  | OrderGroup;
    startCustomize: null | ((group: Group) => void);
    customizedProduct: CustomizedProduct | OrderCustomizedProduct;
    includeSeparators: boolean;
    condensed?: boolean;
    siteVersion: SiteVersion;
}

interface RowProps {
    title?: string;
    components: Component[];
    customizedProduct: CustomizedProduct | OrderCustomizedProduct;
    condensed?: boolean;
    siteVersion: SiteVersion;
}

const GroupRowSection: React.SFC<RowProps> = ({ title, components, customizedProduct, condensed, siteVersion }) => (
    <React.Fragment>
        <style jsx>{`
            @import 'vars';

            .aggregate-title {
                margin-top: $space-base;
                margin-bottom: 0;
                text-transform: uppercase;
                font-size: 12px;
                letter-spacing: 0.4px;
                line-height: 24px;
            }
        `}</style>
        {title && <p className="aggregate-title">{title}</p>}
        <ComponentList components={components} customizedProduct={customizedProduct} slim={true} showSwatch={condensed} siteVersion={siteVersion} />
    </React.Fragment>
);

const HIDE_TITLE = [
    ComponentType.Color,
    ComponentType.ColorAndFabric,
    ComponentType.Fabric
];

class GroupRow extends React.PureComponent<Props> {

    public renderRow() {
        const { group, startCustomize, customizedProduct, includeSeparators, condensed, siteVersion } = this.props;

        const sectionGroups = (group.sectionGroups as Array<SectionGroup | OrderSectionGroup>);
        const components: Array<Component | OrderComponent> = customizedProduct.components;

        const hasAggregateTitle = (group.sectionGroups as Array<SectionGroup | OrderSectionGroup>).some((x) => x.aggregateTitle !== undefined && x.aggregateTitle !== '');

        const codesInSectionGroup = sectionGroups
            .flatMap((sg) => sg.sections)
            .flatMap((s) => s.options)
            .map((o) => o.code);
        const componentsInGroup = components.filter((c) => codesInSectionGroup.includes(c.code));

        const hideTitle = condensed && componentsInGroup.every((component) => HIDE_TITLE.includes(component.componentTypeCategory));

        return (
            <div className={classnames('GroupRow__Wrapper', { 'GroupRow__Wrapper--separators': includeSeparators, 'GroupRow__Wrapper--condensed': condensed })}>
                <style jsx>{`
                    @import 'vars';

                    .GroupRow__Wrapper {
                        &--separators {
                            @include desktop {
                                &:first-child {
                                    border-top: 1px solid $color-grey90;
                                }
                            }

                            padding-top: $space-base;

                            border-bottom: 1px solid $color-grey90;

                        }

                        &--condensed {
                            @include text-style-form-option;

                            .group-title {
                                text-transform: none;
                                font-weight: 600;
                            }
                        }

                        padding-bottom: $space-base;
                    }

                    .title {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        @include text-style-form-label;
                    }

                    .group-title {
                        text-transform: uppercase;
                        line-height: 4*$space-base;
                    }
                `}</style>
                { !hideTitle && <div className="title">
                    <span className="group-title">
                        {group.title}
                    </span>
                    {startCustomize && <a className="start-customize-link" onClick={() => startCustomize(group as Group)}>{(group as Group).changeButtonText || <FormattedMessage id="change" defaultMessage="Change" />}</a>}
                </div> }
                <div className="options-text">
                    {hasAggregateTitle
                        ? Object.entries(sectionGroups
                            .reduce((acc, curr) => {
                                const title = curr.aggregateTitle || '';
                                acc[title] = title in acc ? [...acc[title], ...curr.sections] : [...curr.sections];

                                return acc;
                            },      {}))
                            .map(([key, value]) => ({ aggregateTitle: key, sections: value }))
                            .map((sectionGroup, index) => {
                                const componentsInSectionGroup = (components as Component[]).filter(filterComponentInSectionGroup(sectionGroup as SectionGroup));

                                if (componentsInSectionGroup.length === 0) {
                                    return null;
                                }

                                return (
                                    <GroupRowSection
                                        key={index}
                                        title={sectionGroup.aggregateTitle}
                                        components={componentsInSectionGroup}
                                        customizedProduct={customizedProduct}
                                        condensed={condensed}
                                        siteVersion={siteVersion}
                                    />
                                );
                            })
                        : (
                            <GroupRowSection
                                components={sectionGroups.map((sectionGroup) => (components as Component[]).filter(filterComponentInSectionGroup(sectionGroup as SectionGroup))).flatMap((x) => x)}
                                customizedProduct={customizedProduct}
                                condensed={condensed}
                                siteVersion={siteVersion}
                            />
                        )
                    }

                </div>
            </div>
        );
    }

    public render() {
        const { group, startCustomize } = this.props;
        return (
            <React.Fragment>
                <Mobile>
                    <div className={'GroupRow__Wrapper--mobile'} onClick={() => startCustomize ? startCustomize(group as Group) : null}>
                        <style jsx>{`
                            @import 'vars';

                            .GroupRow__Wrapper--mobile {
                                cursor: pointer;
                            }
                        `}</style>
                        {this.renderRow()}
                    </div>
                </Mobile>
                <Desktop>
                    {this.renderRow()}
                </Desktop>
            </React.Fragment>
        );
    }
}

export default GroupRow;
