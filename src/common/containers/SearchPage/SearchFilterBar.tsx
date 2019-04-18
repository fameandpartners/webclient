import React, { CSSProperties } from 'react';
import FilterGroup, { CheckboxType } from '@components/search/FilterGroup';
import { FacetCategory, FacetGroups, Facet, FacetGroup, FacetConfiguration } from 'typings/fame_api/product_document';
import Dropdown from '@components/base/Input/Dropdown';
import FabricOrColorCircle from '@components/customization-overview/FabricOrColorCircle';
import Checkbox from '@components/base/Input/Checkbox';
import Select from '@components/base/Input/Select';
import DropdownContainer from '@containers/SearchPage/DropdownContainer';
const DownIcon = require('@svg/i-down.svg').default;
import classnames from 'classnames';

interface Props {
    facetConfiguration: FacetCategory[];
    facetGroups: FacetGroups;
    selectedFacets: string[];
    baseFacets: string[];
    onSelected: (facet: Facet, group: FacetGroup) => void;
    onResetAllFilters: () => void;
    onResetFiltersForGroup: (facetGroup: FacetGroup) => void;
    title: React.ReactNode;
}

class SearchFilterBar extends React.PureComponent<Props> {
    private renderDropdownContainer(facetGroup: FacetGroup, style: CSSProperties) {
        const { onSelected, selectedFacets, baseFacets, onResetFiltersForGroup } = this.props;

        return (
            <div className={classnames('Filter__Dropdown', {'Filter__Dropdown--TwoColumns': facetGroup.facets.length >= 6})} style={style}>
                <style jsx>{`
                    @import 'vars';

                    .Filter__Dropdown {
                        max-height: 60vh;
                        overflow-y: scroll;
                        padding: space(1) 0;    
                        border: 1px solid $color-grey79;
                        border-top: none;

                        &__Option {
                            width: 150px;
                            padding: space(0.5) space(2);
                        }
                        &--TwoColumns {
                            /* columns: 2; */
                        }
                    }    
                `}</style>

                <div className="Filter__Dropdown__Option">
                    <Checkbox
                        onChange={() => onResetFiltersForGroup(facetGroup)} 
                        label={'All'} 
                        isCircle={true}
                        checked={selectedFacets.length === 0} 
                    />
                </div>

            {
                    facetGroup.facets
                    .sort((a, b) => a.order - b.order)
                    .map((c: Facet) => <div key={c.facetId} className="Filter__Dropdown__Option">
                        <Checkbox
                            disabled={c.docCount === 0}
                            onChange={() => onSelected(c, facetGroup)} 
                            label={c.title} 
                            isCircle={true}
                            fillColor={c.facetMeta && c.facetMeta.hex}
                            fillImage={c.facetMeta && c.facetMeta.image}
                            checked={selectedFacets.includes(c.facetId) || baseFacets.includes(c.facetId)} 
                        />
                    </div>)
                }
            
            </div> 
        );
    }

    private renderFilterDropdowns() {
        const { facetConfiguration, facetGroups, onSelected, selectedFacets, baseFacets } = this.props;

        return facetConfiguration.map((facetCategory: FacetCategory, i) => {
            const groupsInCategory = facetCategory.facetGroupIds.map((fgId) => facetGroups[fgId]);

            return groupsInCategory
                .map((facetGroup) => {
                    if (facetGroup.facets.length > 0) {
                        return <div className="FacetGroup">
                                <style jsx>{`
                                    @import 'vars';

                                    .FacetGroup {
                                        margin-left: space(2);

                                        &__Selection {
                                            margin-left: space(1.5);
                                        }
                                    }

                                    .Filter {
                                        position: relative;
                                        columns: 2;

                                        > :global(div) {
                                            display: inline;
                                        }

                                        &__Title {
                                            cursor: pointer;
                                            padding: 16px;
                                            user-select: none;

                                            :global(svg) {
                                                display: inline-block;
                                            }
                                        }
                                    }    

                                    :global(.DropdownContainer__Trigger--open) .Filter__Title :global(svg) {
                                        transform: rotate(180deg);
                                    }
                                `}</style>

                                <span className="Filter">
                                    <DropdownContainer
                                        containerStyle={{
                                            top: 30,
                                            left: 8,
                                        }}
                                        animate={false}
                                        hoverDelay={50}
                                        trigger={
                                            <span className="Filter__Title">
                                                <DownIcon
                                                    className="rotate"
                                                    style={{
                                                        width: 12,
                                                        minWidth: 12,
                                                        height: 12,
                                                        minHeight: 12,
                                                        margin: '4px 8px 0 0',
                                                    }} 
                                                />
                                                {facetGroup.name}

                                                {
                                                    facetGroup.facets.length > 0 &&
                                                    <span className="FacetGroup__Selection">
                                                        {
                                                            facetGroup.facets
                                                            .filter((f) => selectedFacets.includes(f.facetId) || baseFacets.includes(f.facetId))
                                                            .map((f, fI) => {
                                                                const isColor = f.facetMeta && (f.facetMeta.hex || f.facetMeta.image);
                                                                return (
                                                                    <React.Fragment key={f.facetId}>
                                                                        {fI !== 0 && !isColor && <span>, </span>}
                                                                        {isColor &&
                                                                            <FabricOrColorCircle component={f} style={{width: 16, height: 16, marginBottom: -3, marginRight: 8}} />
                                                                        }
                                                                        {!isColor && f.title}
                                                                    </React.Fragment>
                                                                );
                                                            })
                                                        }
                                                    </span>
                                                }
                                            </span>
                                        }
                                        container={(style) => this.renderDropdownContainer(facetGroup, style)}
                                    />
                                </span>
                        </div>;
                    }

                    return null;
                })
                .notNullOrUndefined();
        });
    }

    public render() {

        const { title } = this.props;
        
        return (
            <div className="SearchFilterBar">
                <style jsx>{`
                    @import 'vars';

                    .SearchFilterBar {
                        position: sticky;
                        background-color: $color-white;
                        left: 0;
                        right: 0;
                        top: $navbar-height;
                        z-index: $z-index-header;

                        &__Inner {
                            display: flex;
                            @include container;
                            height: $search-filter-bar-height;
                            align-items: center;
                        }


                        :global(.dropdown-container), :global(.select-wrapper), :global(.styled-dropdown), :global(button) {
                            border: none;
                        } 
                       
                       :global(.Filter__Dropdown) {
                            background-color: $color-white;
                       }

                        :global(h1) {
                            width: 0;
                            flex-grow: 1;
                            margin: 0;

                            @include text-style-h5;
                        }
                    }
                `}</style>
                <div className="SearchFilterBar__Inner">
                    {title}
                    <a className="no-underline text-secondary" onClick={() => this.props.onResetAllFilters()}>Reset</a>
                    {this.renderFilterDropdowns()}
                </div>
            </div>
        );

    }
}

export default SearchFilterBar;