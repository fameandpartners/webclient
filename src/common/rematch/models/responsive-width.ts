import { createModel } from '@rematch/core';

export type ResponsiveWidthRootState = number;

const ResponsiveWidthModel = createModel({
    reducers: {
        update(state: ResponsiveWidthRootState, width: number): ResponsiveWidthRootState {
            return width;
        },
    },
    state: 0,
});

export default ResponsiveWidthModel;
