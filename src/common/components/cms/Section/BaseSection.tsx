import React from 'react';
import classnames from 'classnames';

export type SectionWidth = 'Full width' | 'Normal width' | 'Narrow width' | 'Tiny width';
export type BaseSectionGridSpacingBottom = 'None' | 'Half' | 'Normal';

interface Props {
    width: SectionWidth;
    mobileWidth: SectionWidth;
    children: React.ReactNode;
    spacingBottom: BaseSectionGridSpacingBottom;
    mobileSpacingBottom: BaseSectionGridSpacingBottom;
    className?: string;
}

const BaseSection: React.SFC<Props> = ({ mobileWidth, width, spacingBottom, mobileSpacingBottom, children, className}: Props) => {
    const computedClassNames = classnames(
        'BaseSection',
        className,
        {
            'BaseSection--width-full': width === 'Full width',
            'BaseSection--width-normal': !width || width === 'Normal width',
            'BaseSection--width-narrow': width === 'Narrow width',
            'BaseSection--width-tiny': width === 'Tiny width',

            'BaseSection--spacing-bottom-none': spacingBottom === 'None',
            'BaseSection--spacing-bottom-half': spacingBottom === 'Half',
            'BaseSection--spacing-bottom-normal': !spacingBottom || spacingBottom === 'Normal',

            'BaseSection--mobile-width-full': mobileWidth === 'Full width',
            'BaseSection--mobile-width-normal': !mobileWidth || mobileWidth === 'Normal width',
            'BaseSection--mobile-width-narrow': mobileWidth === 'Narrow width',
            'BaseSection--mobile-width-tiny': mobileWidth === 'Tiny width',

            'BaseSection--mobile-spacing-bottom-none': mobileSpacingBottom === 'None',
            'BaseSection--mobile-spacing-bottom-half': mobileSpacingBottom === 'Half',
            'BaseSection--mobile-spacing-bottom-normal': !mobileSpacingBottom || mobileSpacingBottom === 'Normal',
        }
    );
    return (
        <section className={computedClassNames}>
            <style jsx>{`
                @import 'vars';

                .BaseSection {
                    @include container;
                    overflow: hidden;

                    &--width-full {
                        @include container-full-width;
                        max-width: none;
                    }

                    &--width-normal {
                        @include container-normal-width;
                    }

                    &--width-narrow {
                        @include container-narrow-width;
                    }

                    &--width-tiny {
                        max-width: 960px;
                    }

                    &--spacing-bottom-none {
                        padding-bottom: 0;
                    }

                    &--spacing-bottom-half {
                        padding-bottom: 8*$space-base;
        
                        @include media("<tablet") {
                            padding-bottom: 3*$space-base;
                        }
                    }

                    &--spacing-bottom-normal {
                        padding-bottom: 16*$space-base;
        
                        @include media("<tablet") {
                            padding-bottom: 6*$space-base;
                        }
                    }


                    @include media('<tablet') {
                        &--mobile-width-full {
                            @include container-full-width;
                            max-width: none;
                        }
    
                        &--mobile-width-normal {
                            @include container-normal-width;
                        }
    
                        &--mobile-width-narrow {
                            @include container-narrow-width;
                        }

                        &--mobile-spacing-bottom-none {
                            padding-bottom: 0;
                        }
    
                        &--mobile-spacing-bottom-half {
                            padding-bottom: 8*$space-base;
            
                            @include media("<tablet") {
                                padding-bottom: 3*$space-base;
                            }
                        }
    
                        &--mobile-spacing-bottom-normal {
                            padding-bottom: 16*$space-base;
            
                            @include media("<tablet") {
                                padding-bottom: 6*$space-base;
                            }
                        }
                    }
                }
            `}</style>
            {children}
        </section>
    );
};

export default BaseSection;
