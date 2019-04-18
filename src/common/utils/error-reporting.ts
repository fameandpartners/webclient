export class NotFoundError extends Error {
    
}

export function logHandledError(error: any, errorInfo?: any) {
    if ('Raven' in global) {
        (global as any).Raven.captureException(error, errorInfo && { extra: errorInfo });
    } else {
        console.warn('Couldn\'t report error to raven');
    }

    console.warn(errorInfo);
    console.warn(error);
}

export function setUpRaven(raven: any) {
    raven.config(global.__FAME_CONFIG__.SENTRY_DSN, {
        release: global.__FAME_CONFIG__.RELEASE,
        environment: global.__FAME_CONFIG__.ENVIRONMENT,
        ignoreErrors: [

        ]
    }).install();
}