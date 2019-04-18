import { init, RematchRootState } from '@rematch/core';

import * as models from './models';
import { CustomRematchDispatch } from 'typings/rematch';

export type models = typeof models;

export type RootState = RematchRootState<models>;
export type RootDispatch = CustomRematchDispatch<models>; // TODO change to RematchDispatch<models>; in the future

const configureStore = (initialState: any) => init({
    models,
    redux: {
        initialState,
    },
});

export default configureStore;
