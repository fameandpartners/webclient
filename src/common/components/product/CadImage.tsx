import React from 'react';
import classnames from 'classnames';
import { LayerCADActive, ProductMedia } from 'typings/product';
import FallbackImage from '@components/base/FallbackImage';

interface Props {
    cads: LayerCADActive[];
}

const CadImage: React.SFC<Props> = ({ cads }) => (
    <div className="CadImage">
        <style jsx>{`
            @import 'vars';

            .CadImage {
                position: relative;
                background-color: $color-white;
                max-height: 300px;

                @include mobile {
                    max-height: 35vh;
                }

                &:before {
                    content: '';
                    display: block;
                    padding-top: 85%;
                }

                // Drop z-index to allow clicking of navigation sections
                z-index: -1;

                // Flex to display the fallback images
                display: flex;
            }

            .cad {
                position: absolute;
                top: 0;
                right: 0;
                left: 0;
                bottom: 0;
                opacity: 0;
                background-repeat: no-repeat;
                background-position-x: center;
                background-position-y: top;
                background-size: contain;

                &.active {
                    opacity: 1;
                }
            }
        `}</style>
        {
            cads
                .map((x) => {
                    const classNames = classnames('cad', { active: x.isActive });

                    // If there is a collection of FallbackMedia then it is a legacy dress in the new system
                    if (Array.isArray(x.src) && x.src.length > 0) {
                        const media: Partial<ProductMedia> = {
                            src: x.src,
                        };

                        return (
                            <FallbackImage
                                key={x.url}
                                image={media as ProductMedia}
                                objectFit="contain"
                                aspectRatio={1}
                            />
                        );
                    }

                    return <div key={x.sortOrder} className={classNames} style={{ backgroundImage: `url(${x.url})` }} />;
                })
        }
    </div>
);

export default CadImage;
