import React from 'react';
import { CmsElement } from 'typings/cms';
import AspectRatio from '@components/base/AspectRatio';

type AspectRatioType = '4:3' | '16:9' | '18:9' | '21:9' | '36:10' | '1:1';
interface Props extends CmsElement {
    url: string;
    background: boolean;
    aspectRatio?: AspectRatioType; 
}

const ratioToNumber = {
    '4:3': 0.75,
    '16:9': 0.5625,
    '21:9': 0.4286,
    '36:10': 0.2778,
    '1:1': 1
};

const Video: React.SFC<Props> = ({ url, background, aspectRatio }: Props) => {
    const videoUrl = url.replace('//vimeo.com', '//player.vimeo.com/video') + `?background=${background ? 1 : 0}`;
    return (
        <AspectRatio ratio={ratioToNumber[aspectRatio || 1]}>
            <iframe src={videoUrl} frameBorder="0" allowFullScreen />
        </AspectRatio>
    );
};

export default Video;