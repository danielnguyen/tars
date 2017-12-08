import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as fs from 'fs';
import * as http from 'http';
import * as https from 'https';
import * as morgan from 'morgan';
import { Config } from '../config';

export interface ServerOptions {
    hostname?: string;
    port?: number;
    secure?: boolean;
    [prop: string]: any;
}

export class Server {

    public _config: ServerOptions;
    protected _server: express.Application;
    private _startTime: Date;

    private static readonly defaultConfig: ServerOptions = {
        hostname: Config.APP_HOST,
        port: Config.APP_PORT,
        secure: Config.SECURE
    }

    constructor(public options?: ServerOptions) {

        // If options not specified, set defaults
        this._config = options || Server.defaultConfig;

        this._server = express();
        this._server.use(bodyParser.json());
        this._server.use(bodyParser.urlencoded({
            extended: true
        }));

        this._server.set('port', this._config.port);  
        this._server.set('host', this._config.hostname);

        this._server.use(morgan('dev'));  // log every request to the console 

    }
    
    public getExpressApp(): express.Application {
        return this._server;
    }

    public async info() {
        const protocol: string = this._config.secure ? 'https' : 'http';
        const endpoint: string = protocol + '://' + this._config.hostname + ':' + this._config.port;

        return {
            uptime: Date.now() - this._startTime.getTime(),
            // TODO(bajtos) move this code to Application, the URL should
            // be accessible via this.get('http.url')
            url: endpoint
        };
    }

    public start(cb: any): any {
        this._startTime = new Date();
        
        if (this._config.secure) {
            // Start Server in https
            const options = {
                cert: fs.readFileSync(require('path').join(__dirname, '../certs/server.crt')),
                key: fs.readFileSync(require('path').join(__dirname, '../certs/key.pem'))
            };
            https.createServer(options, this._server).listen(this._server.get('port'), this._server.get('host'), () => {
                if (cb) cb(this._server);
            });
        } else {
            // Start Server in http
            this._server.listen(
                this._server.get('port'),
                this._server.get('host'),
                () => {
                    if (cb) cb(this._server);
                }
            )
        }

    }

}