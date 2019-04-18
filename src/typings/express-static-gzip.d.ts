declare module 'express-static-gzip' {
    import { ServeStaticOptions } from "serve-static";
    import { Handler } from "express-serve-static-core";

    function serveStaticGzip(root: string, options?: ServeStaticGzipOptions): Handler;

    interface ServeStaticGzipOptions extends ServeStaticOptions {
        enableBrotli?: boolean;
    }

    export = serveStaticGzip;
}
