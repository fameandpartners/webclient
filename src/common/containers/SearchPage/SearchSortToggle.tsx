import Dropdown from '@components/base/Input/Dropdown';
import React from 'react';
import { DocumentSearchSortOption } from '@typings';

class SearchSortToggle extends React.PureComponent<{onSortSelected: (sortString: string) => void, selectedSort: string, sortOptions: DocumentSearchSortOption[]}> {
    public render() {
        return (
            <div className={'SearchSortToggle'}>
                <style jsx>{`
                    .SearchSortToggle {
                        width: 100%;

                        .select {
                            margin-right: 0;
                        }
                    }
                `}</style>
                <Dropdown
                    optionGroups={
                        [
                            {
                                title: 'Sort',
                                value: 'sort',
                                options: this.props.sortOptions.map((sO) => ({name: sO.name, value: [sO.sortField, sO.sortOrder].notNullOrUndefined().join('~')}))
                            }
                        ]
                    }
                    onSelect={(value) => this.props.onSortSelected(value)}
                    placeholder="Sort by"
                    alwaysShowPlaceholder
                    selected={this.props.selectedSort}
                />
            </div>
        );
    }
}

export default SearchSortToggle;
