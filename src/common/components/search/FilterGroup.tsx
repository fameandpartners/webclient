import React from 'react';
import classnames from 'classnames';
import Checkbox from '@components/base/Input/Checkbox';
import Accordion from '@components/base/Accordion';
import { FormattedMessage } from 'react-intl';
import FabricOrColorCircle from '@components/customization-overview/FabricOrColorCircle';
import { Facet } from 'typings';

export type CheckboxType = 'circle' | 'square';

interface Option<G, V>  {
    title: string;
    value: G;
    openOnLoad: boolean;
    children: Array<{
        name: string,
        value: V,
        disabled: boolean,
        selected:  boolean,
        styles?: {
            checkboxType: CheckboxType,
            fillColor?: string,
            fillImage?: string,
        }
    }>;
}
interface Props<G, V> {
    title?: string;
    options: Array<Option<G, V>>;
    onSelected: (value: V, group: G) => void;
    resetFilters?: () => void;
}

class FilterGroup extends React.PureComponent<Props<any, any>> {

    private getSideTitle(o: Option<any, any>) {
        const selected = o.children.filter((x) => x.selected);
        const selectedCount = selected.length;

        if (selectedCount === 0) {
            return <FormattedMessage id={'FilterGroup.SideTitle.All'} defaultMessage={'All'} />;
        } else {
            if (selected[0].styles && selected[0].styles!.fillColor) {
                return selected.map((s) => <FabricOrColorCircle key={s.name} component={s.value as Facet} style={{width: 16, height: 16, marginBottom: -3, marginRight: 8}}/>);
            } else if (selectedCount === 1) {
                return selected[0].name;
            } else {
                return `${selectedCount} ${o.title}s`;
            }
        }
    }
    public render() {
        const { title, options, onSelected, resetFilters } = this.props;

        return <div className={classnames('FilterGroup')}>
            <style jsx>{`
                @import 'vars';

                .FilterGroup {
                    .sidebar-heading {
                        p {
                            @include text-style-title;
                            text-transform: uppercase;
                            padding-top: 2*$space-base;

                        }

                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        @include media(">tablet") {
                            padding: 3*$space-base 0;
                        }
                    }

                    ul {
                        column-count: 2;

                        @include mobile {
                            column-count: 1;
                        }
                    }

                    li {
                        margin-bottom: $space-base;
                        min-height: 2*$space-base;
                    }

                }
            `}</style>

            {title &&
                <div className={'sidebar-heading'}>
                    <p>{title}:</p>
                    {resetFilters && <a onClick={resetFilters}><FormattedMessage id={'SearchPage.Filters.Clear'} defaultMessage={'Clear'} /></a>}
                </div>
            }

            {options.map((o, i) => {
                return <Accordion
                    key={o.title}
                    title={o.title}
                    openOnLoad={o.openOnLoad}
                    sideTitle={this.getSideTitle(o)}
                >
                    <ul>
                        {o.children.map((c) => (
                            <li key={c.name}>
                                <Checkbox
                                    disabled={c.disabled}
                                    onChange={() => onSelected(c.value, o.value)}
                                    label={c.name}
                                    isCircle={c.styles ? c.styles.checkboxType === 'circle' : false}
                                    fillColor={c.styles && c.styles.fillColor}
                                    fillImage={c.styles && c.styles.fillImage}
                                    checked={c.selected}
                                />
                            </li>
                        ))}
                    </ul>
                </Accordion>;
            })}

            <hr />
        </div>;
    }
}

export default FilterGroup;
