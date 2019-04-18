import React from 'react';

import { Component, Facet, OrderComponent } from 'typings';
import { getColorOrFabricStyle } from '@common/utils/color';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    component: Component | OrderComponent | Facet;
}

const FabricOrColorCircle: React.SFC<Props> = ({ component, style, ...otherProps }) => {
    let hex;
    let image;

    if ('facetMeta' in component && component.facetMeta) {
        hex = component.facetMeta.hex;
        image = component.facetMeta.image;
    } else if ('meta' in component) {
        hex = component.meta.hex;
        image = component.meta.image && component.meta.image.url;
    }

    if (image || hex) {
        return <div
            {...otherProps}
            style={{
                ...style,
                ...getColorOrFabricStyle(image, hex),
                display: 'inline-block',
                borderRadius: '50%',
            }}
        />;
    }

    return null;
};

export default FabricOrColorCircle;
