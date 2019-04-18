import { init, RematchRootState, Models, ModelEffects, ModelConfig, ModelReducers } from '@rematch/core';

import * as Redux from 'redux';

type ExtractRematchDispatcherAsyncFromEffect<E> =
  E extends () => Promise<infer R> ? RematchDispatcherAsync<void, void, R> :
  E extends (payload: infer P) => Promise<infer R> ? RematchDispatcherAsync<P, void, R> :
  E extends (payload: infer P, meta: infer M) => Promise<infer R> ? RematchDispatcherAsync<P, M, R> :
  RematchDispatcherAsync<any, any, any>;

type ExtractRematchDispatchersFromEffectsObject<effects extends ModelEffects<any>> = {
  [effectKey in keyof effects]: ExtractRematchDispatcherAsyncFromEffect<effects[effectKey]>
};

type ExtractRematchDispatchersFromEffects<effects extends ModelConfig['effects']> = 
  (effects extends ((...args: any[]) => infer R)
    ? R extends ModelEffects<any>
      ? ExtractRematchDispatchersFromEffectsObject<R>
      : {}
    : effects extends ModelEffects<any>
      ? ExtractRematchDispatchersFromEffectsObject<effects>
      : {});

type ExtractRematchDispatcherFromReducer<R> =
  R extends () => any ? RematchDispatcher<void, void> :
  R extends (state: infer S) => infer S ? RematchDispatcher<void, void> :
  R extends (state: infer S, payload: infer P) => infer S ? RematchDispatcher<P, void> :
  R extends (state: infer S, payload: infer P, meta: infer M) => infer S ? RematchDispatcher<P, M> :
  RematchDispatcher<any, any>;

type ExtractRematchDispatchersFromReducersObject<reducers extends ModelReducers<any>> = {
  [reducerKey in keyof reducers]: ExtractRematchDispatcherFromReducer<reducers[reducerKey]>
};

type ExtractRematchDispatchersFromReducers<reducers extends ModelConfig['reducers']> =
  ExtractRematchDispatchersFromReducersObject<reducers & {}>;

type ExtractRematchDispatchersFromModel<M extends ModelConfig> = 
  ExtractRematchDispatchersFromReducers<M['reducers']> &
  ExtractRematchDispatchersFromEffects<M['effects']>;

type ExtractRematchDispatchersFromModels<M extends Models> = {
  [modelKey in keyof M]: ExtractRematchDispatchersFromModel<M[modelKey]>
};

type ExtractRematchSelectorsFromModels<M extends Models, RS = any> = {
  [modelKey in keyof M]: {
    [reducerKey in keyof M[modelKey]['selectors']]:
    (state: RematchRootState<M>, ...args: any[]) =>
      M[modelKey]['selectors'][reducerKey] extends ((...args: any[]) => any)
        ? ReturnType<M[modelKey]['selectors'][reducerKey]>
        : {}
  }
};

type RematchDispatcher<P = void, M = void> =
  (P extends void ? ((...args: any[]) => void) :
    (payload: P) => void);

type RematchDispatcherAsync<P = void, M = void, R = void> =
  (P extends void ? ((...args: any[]) => Promise<R>) :
    (payload: P) => Promise<R>);

type CustomRematchDispatch<M extends Models> = ExtractRematchDispatchersFromModels<M>;
