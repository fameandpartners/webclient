import React from 'react';
import classnames from 'classnames';
import { SectionGroup } from 'typings/product';

interface GroupHeaderTitleProps {
    isActive: boolean;
    title: string;
    onSelected: () => void;
}

interface Props {
    sectionGroups: SectionGroup[];
    currentSectionGroup: SectionGroup;
    goTo: (step: number, slug?: string) => void;
}

class GroupHeaderTitle extends React.Component<GroupHeaderTitleProps> {
    public shouldComponentUpdate(nextProps: GroupHeaderTitleProps) {
        if (nextProps.isActive !== this.props.isActive) {
            return true;
        }
        
        if (nextProps.title !== this.props.title) {
            return true;
        }

        return false;
    }

    public render() {
        const { title, isActive, onSelected } = this.props;

        return (
            <React.Fragment>
                <style jsx>{`
                    @import 'vars';

                    span {
                        @include text-style-form-label;
                        text-transform: uppercase;
                        color: $color-grey79;
                        cursor: pointer;
                        padding: 0 2*$space-base;
                        white-space: nowrap;

                        @include desktop {
                            padding: $space-base 3*$space-base;
                        }

                        &.active {
                            color: $color-black;
                        }
                    }
                `}</style>
                <span className={classnames({ active: isActive })} onClick={onSelected}>{title}</span>
            </React.Fragment>
        );
    }
}

const GroupHeaderTitles: React.SFC<Props> = ({ sectionGroups, currentSectionGroup, goTo }) => (
    sectionGroups.length > 1 ?
    <div className={'GroupHeaderTitles'}>
        <style jsx>{`
            @import 'vars';

            .GroupHeaderTitles {
                text-align: center;

                @include mobile {
                    width: 100%;
                    padding: 0 2*$space-base;
                    margin: space(1) 0;
                    overflow-x: auto;
                    scroll-behavior: smooth;
                }
                
                @include desktop {
                    margin: 0 0 space(2);
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                }
            }
        `}</style>
            {sectionGroups.map((sg, sgIndex) => (
                <GroupHeaderTitle key={sg.title} title={sg.title} isActive={currentSectionGroup.slug === sg.slug} onSelected={() => goTo(sgIndex, sg.slug)} />
            ))}
    </div> : null
);

export default GroupHeaderTitles;
