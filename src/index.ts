import http from 'http';
import app from './server';

/* tslint:disable no-console */

const server = http.createServer(app);

server.listen(process.env.PORT || 3002, (error: Error) => {
    if (error) {
        console.log(error);
    }

    console.log('🚀 started');
});

if (module.hot) {
    module.hot.accept('./server', () => {
        console.log('🔁  HMR Reloading `./server`...');
    });
    console.info('✅  Server-side HMR Enabled!');
}

/* tslint:enable no-console */
