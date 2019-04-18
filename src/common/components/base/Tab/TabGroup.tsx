import React from 'react';
import classnames from 'classnames';

interface Props {
    tabTitles: Array<{ title: React.ReactNode, value?: string, onClick?: () => void }>;
    activeTab: string | null;
}

class TabGroup extends React.PureComponent<Props> {

    public render() {
        const { tabTitles, children, activeTab } = this.props;

        return (
            <div className={classnames('TabGroup')}>
                <style jsx>{`
                    @import 'vars';

                    .TabGroup {
                        display: flex;
                        flex-wrap: wrap;
                        flex-direction: column;

                        ul {
                            flex: 1;
                            border-bottom: 1px solid $color-grey79;
                        }

                        .TabTitle {
                            cursor: pointer;
                            &.active {
                                border-bottom: 1px solid $color-black;
                            }
                            :hover {
                                border-bottom: 1px solid $color-black;
                            }
                        }

                        li {
                            display: inline-block;
                            padding: 2*$space-base 4*$space-base 2*$space-base 0;
                        }
                    }
                `}</style>

                <ul>
                    {tabTitles.map((tabTitle) => <li className={classnames('TabTitle', { active: activeTab === tabTitle.value })} key={tabTitle.value} onClick={tabTitle.onClick}>{tabTitle.title}</li>)}
                </ul>
                
                {children}
            </div>
        );
    }
}

export default TabGroup;
