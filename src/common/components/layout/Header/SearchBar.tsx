import React, { Component, KeyboardEvent, PureComponent } from 'react';
import Input from '../../base/Input/Input';

interface SearchBarProps {
    onBlur: () => void;
}

class SearchBar extends PureComponent<SearchBarProps> {
    private handleKeyDown(evt: KeyboardEvent<HTMLInputElement>) {
        if (evt.which === 27 || evt.keyCode === 27) {
            this.props.onBlur();
        }
    }

    public render() {
        const { onBlur } = this.props;
        return (
            <form action="/search" method="GET" className="SearchBar">
                <style jsx>{`
                    @import 'vars';
                    .SearchBar {
                        :global(.input-wrapper) {
                            width:200px;
                        }
                        :global(#dress_query) {
                            // Remove 1px for the border;
                            height: calc(#{$navbar-height} - 1px);
                            padding-left:0; 
                            padding-right:0;
                            border-bottom-color: $color-grey20; 
                            &::placeholder {
                                line-height: 36px;
                            }
                        }
                    }
                `}</style>
                <Input id="dress_query" autoFocus={true} placeholder="Search" name="q" onBlur={onBlur} onKeyDown={(e) => this.handleKeyDown(e)} noBorder={true} />
            </form>
        );
    }
}

export default SearchBar;
