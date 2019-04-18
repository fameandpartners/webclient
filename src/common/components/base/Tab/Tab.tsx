import React from 'react';
import classnames from 'classnames';

interface Props {
    isActive: boolean;
}

class Tab extends React.Component<Props> {
    public render() {
        const { isActive, children } = this.props;

        return (
            <div className={classnames('Tab', { active: isActive })}>
                <style jsx>{`
                    @import 'vars';

                    .Tab {
                        display: inline-flex;
                    }
                `}</style>

                {isActive && <section>
                    {children}
                </section>}
            </div>
        );
    }
}

export default Tab;
