import React from 'react';
import classnames from 'classnames';

interface Props {
    children?: React.ReactNode;
    className?: any;

    vertical?: boolean;
}
class PillGroup extends React.Component<Props> {
    public render() {
        const {
            children,
            className,
            vertical,
        } = this.props;

        return (
            <React.Fragment>
                <style jsx>{`
                    .PillGroup {
                        display: flex;
                        flex-direction: ${vertical ? 'column' : 'row'};
                        flex-wrap: wrap;

                        justify-content: center;
                        align-items: center;
                    }
                `}</style>

                <div className={classnames('PillGroup', className)}>
                    {children}
                </div>
            </React.Fragment>
        );
    }
}

export default PillGroup;
