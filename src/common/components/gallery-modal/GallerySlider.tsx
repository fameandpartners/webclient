import React from 'react';
import { ProductMedia, CustomizedProduct } from 'typings/product';
import KeyListener from '@components/event-listener/KeyListener';
import { KeyCodes } from '@common/utils/key-codes';
import FallbackImage from '@components/base/FallbackImage';
import SwipeableViews from 'react-swipeable-views';
import { Helmet } from 'react-helmet';

interface Props {
    images: ProductMedia[];
    showBackground: boolean;
    position: number;
    useAspectRatio: boolean;

    onLeft: () => void;
    onRight: () => void;
    close: () => void;
    onClick?: () => void;

    containerClass?: string;
}

interface State {
    // createRef doesn't cause a re-render when it gets the ref
    refReady: boolean;
    elementX: number;
}

class GallerySlider extends React.PureComponent<Props, State> {

    public state: State = {
        refReady: false,
        elementX: -1,
    };

    private _ref = React.createRef<HTMLDivElement>();

    public componentDidMount() {
        // The ref is available once we reach this point
        if (this._ref.current) {
            this.setState({ refReady: true });
        }
    }

    private goTo(index: number) {
        if (index < this.props.position) {
            this.props.onLeft();
        } else if (index > this.props.position) {
            this.props.onRight();
        }
    }

    public render() {

        return (
            <div className={'GallerySlider'} ref={this._ref} tabIndex={0}>
                <style jsx>{`
                    @import 'vars';

                    .GallerySlider {
                        :global(.FallbackImage) {
                            @include mobile {
                                pointer-events: none;
                            }
                        }

                    }
                `}</style>
                {this.state.refReady && <KeyListener
                    element={this._ref.current}
                    options={[
                        {
                            keyCode: KeyCodes.Esc,
                            action: () => this.props.close(),
                        },
                        {
                            keyCode: KeyCodes.Left,
                            action: () => this.props.onLeft(),
                        },
                        {
                            keyCode: KeyCodes.Right,
                            action: () => this.props.onRight(),
                        }
                    ]}
                />}

                <SwipeableViews
                    index={this.props.position}
                    onChangeIndex={(index) => this.goTo(index)}
                    slideClassName={this.props.containerClass}
                    containerStyle={{width: 'calc(100% - 16px)'}}
                    slideStyle={{width: 'calc(100%)', paddingRight: '8px'}}
                    resistance
                    enableMouseEvents
                >
                    {this.props.images.map((x, i) => (
                        <div
                            onClick={(e: any) => {
                                if (this.props.onClick) {
                                    const delta = Math.abs(e.screenX - this.state.elementX);

                                    if (delta > 10) {
                                        e.preventDefault();
                                        e.stopPropagation();
                                    } else {
                                        this.props.onClick();
                                        this.setState({ elementX: -1 });
                                    }
                                }
                            }}
                            onMouseDown={(e: any) => this.setState({ elementX: e.screenX })}
                        >
                            <FallbackImage
                                key={x.src[0].url}
                                showBackground={this.props.showBackground}
                                image={x}
                                aspectRatio={this.props.useAspectRatio ? undefined : null}
                                objectFit={'contain'}
                                objectPosition={'center'}
                                sizes={'100vw'}
                            />
                        </div>
                    ))}
                </SwipeableViews>

            </div>
        );
    }
}

export default GallerySlider;
