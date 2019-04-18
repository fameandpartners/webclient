import React from 'react';
const BackArrow = require('@svg/i-back.svg').default;

interface Props {
    children?: React.ReactNode;
    title: string;
    sideTitle?: React.ReactNode;
    openOnLoad?: boolean;
}

interface State {
    isOpen: boolean;
}

class Accordion extends React.PureComponent<Props, State> {
    public state: State = {
        isOpen: this.props.openOnLoad || false,
    };

    public render() {
        const { title, sideTitle, children } = this.props;
        const { isOpen } = this.state;

        return (
            <div className={'Accordion'}>
                <style jsx>{`
                    @import 'vars';

                    .Accordion {
                        .Accordion--header {
                            cursor: pointer;

                            display: flex;
                            align-items: baseline;
                            justify-content: space-between;
                            padding: 2*$space-base $space-base;


                            user-select: none;

                            p {
                                @include text-style-title;
                                text-transform: uppercase;
                                flex-grow: 1;
                                margin-left: 2*$space-base;
                                margin-bottom: 0;
                            }

                            span {
                                margin: 0;
                                margin-left: 16px;
                                color: $color-copy-secondary;
                            }
                        }

                        .Accordion--panel {
                            display: ${isOpen ? 'block' : 'none'};

                            padding: $space-base $space-base 3*$space-base;

                            position: relative;
                        }
                    }
                `}</style>
                <hr />
                <section 
                    className={'Accordion--header'} 
                    onClick={() => this.setState((prevState) => ({ isOpen: !prevState.isOpen }))}
                >
                    <BackArrow style={{ width: 8, height: 8, transform: isOpen ? 'rotate(270deg)' : 'rotate(180deg)' }} />
                    <p>{title}</p>
                    {!isOpen && sideTitle && <span>{sideTitle}</span>}
                </section>
                <section className={'Accordion--panel'}>
                    {children}
                </section>
            </div>
        );
    }
}

export default Accordion;
