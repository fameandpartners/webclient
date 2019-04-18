import React from 'react';
import FilterGroup, { CheckboxType } from '@components/search/FilterGroup';
import { FacetCategory, FacetGroups, Facet, FacetGroup } from 'typings/fame_api/product_document';
import { CmsCategoryPage } from '@components/cms/CategoryPage';
import { History } from 'history';

interface Props {
    facetConfiguration: FacetCategory[];
    facetGroups: FacetGroups;
    selectedFacets: string[];
    baseFacets: string[];
    onSelected: (facet: Facet, group: FacetGroup) => void;
    onResetFilters?: (category: FacetCategory) => void;
    facetDetails: CmsCategoryPage|null|undefined;
    history: History;
    onlyShowFacetGroups: string[] | null;
}

class SearchFilter extends React.PureComponent<Props> {
    private renderSearchFilters = () => {

        const { facetConfiguration, facetGroups, onSelected, onResetFilters, selectedFacets, baseFacets, onlyShowFacetGroups } = this.props;
        
        if (facetConfiguration) {
            return facetConfiguration.map((facetCategory: FacetCategory, i) => {
                const groupsInCategory = facetCategory.facetGroupIds
                    .filter((fgId) => !onlyShowFacetGroups || onlyShowFacetGroups.includes(fgId))
                    .map((fgId) => facetGroups[fgId]);

                const options = groupsInCategory
                    .map((facetGroup) => {
                        if (facetGroup.facets.length > 0) {
                            return {
                                title: facetGroup.name,
                                value: facetGroup,
                                openOnLoad: i === 0 && !facetGroup.collapsed,
                                children: facetGroup.facets
                                    .sort((a, b) => a.order - b.order)
                                    .map((c: Facet) => {

                                        const isCirle = !facetGroup.multiselect || c.facetMeta && 'hex' in c.facetMeta;
                                        return {
                                            name: c.title,
                                            value: c,
                                            disabled: c.docCount === 0,
                                            selected: selectedFacets.includes(c.facetId) || baseFacets.includes(c.facetId),
                                            styles: {
                                                checkboxType: isCirle ? 'circle' : 'square' as CheckboxType,
                                                fillColor: c.facetMeta && c.facetMeta.hex,
                                                fillImage: c.facetMeta && c.facetMeta.image,
                                            }
                                        };
                                }),
                            };
                        }

                        return null;
                    })
                    .notNullOrUndefined();

                return (
                    <FilterGroup 
                        key={facetCategory.name}
                        title={facetCategory.hideHeader ? undefined : facetCategory.name}
                        onSelected={onSelected}
                        options={options}
                        resetFilters={onResetFilters ? () => onResetFilters(facetCategory) : undefined}
                    />
                );
            });
        }

        return null;
    }

    private renderCmsFilter = () => {
        const filters = this.props.facetDetails && this.props.facetDetails.filters;

        if (!filters) {
            return;
        }

        return filters.map((f) => <FilterGroup 
            key={f.id}
            title={f.title}
            onSelected={(link) => this.props.history.push(link)}
            options={f.groups.map((g) => ({
                title: g.title,
                value: g.id,
                openOnLoad: true,
                children: (g.links || []).map((l) => ({
                    name: l.title,
                    value: l.url,
                    disabled: false,
                    selected: this.props.facetDetails!!.slug === l.url,
                    styles: {
                        checkboxType: 'circle' as CheckboxType,
                    }
                }))
            }))}
            resetFilters={undefined}
        />);
    }

    public render() {
        return (
            <React.Fragment>
                {this.renderCmsFilter()}
                {this.renderSearchFilters()}
            </React.Fragment>

        ); 
    }
}

export default SearchFilter;