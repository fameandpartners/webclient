import { Request } from 'express';

export function getRealHost(req: Request) {
    if (req.headers['x-fame-forwarded-host']) {
        return req.headers['x-fame-forwarded-host'] as string;
    }

    return req.hostname;
}
        
export function getRealProtocol(req: Request) {
    if (req.headers['x-fame-forwarded-proto']) {
        return req.headers['x-fame-forwarded-proto'] as string;
    }

    return req.protocol;
}