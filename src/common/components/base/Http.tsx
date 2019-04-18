import { Route, Redirect, RedirectProps } from 'react-router';
import React from 'react';

export enum HttpStatus {
    OK = 200,
    NotFound = 404,
    ServerError = 500,
    TemporaryRedirect = 302,
    PermanentRedirect = 301
}

interface RedirectWithStatusProps extends RedirectProps {
    status: HttpStatus.TemporaryRedirect | HttpStatus.PermanentRedirect;
}
export const RedirectWithStatus: React.SFC<RedirectWithStatusProps> = ({ status, ...redirectProps }) => (
    <Route
        render={({ staticContext }) => {
            // there is no `staticContext` on the client, so
            // we need to guard against that here
            if (staticContext) {
                staticContext.statusCode = status;
            }
            return <Redirect {...redirectProps} />;
        }}
    />
);

interface StatusProps {
  code: HttpStatus.OK | HttpStatus.NotFound | HttpStatus.ServerError;
}
export const Status: React.SFC<StatusProps> = ({ code }) => (
    <Route
        render={({ staticContext }) => {
            if (staticContext) {
                staticContext.statusCode = code;
            }
            return null;
        }}
    />
);
