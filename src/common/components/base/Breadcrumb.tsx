import React from 'react';
import classnames from 'classnames';

interface Props {
    paths: Array<{
        title: string;
        url: string;
        isActive: boolean;
    }>;
}

class Breadcrumb extends React.PureComponent<Props> {
    public render() {
        return (
            <div className={'Breadcrumb'}>
                <style jsx>{`
                    @import 'vars';

                    .Breadcrumb {
                        a {
                            cursor: pointer;
                            text-decoration: none;
                        }

                        .active {
                            color: $color-grey79;
                            user-select: none;
                            cursor: unset;
                        }
                    }
                `}</style>

                {this.props.paths
                        .map((x) => <a key={x.title} href={x.url} className={classnames({ active: x.isActive })}><span>{x.title}</span></a>)
                        .reduce((prev: JSX.Element, current: JSX.Element, currentIndex: number): any => [prev, (<span key={`sep-${currentIndex}`}>{' / '}</span>), current])
                }
            </div>
        );
    }
}

export default Breadcrumb;
