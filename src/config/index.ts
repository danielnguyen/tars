export class Config {
    
    public static __DEVELOPMENT__: boolean = process.env.NODE_ENV !== 'production' ? true : false;
    
    public static SECURE: boolean = process.env.HTTPS === 'on' ? true : false;

    public static APP_PROTOCOL: string = Config.SECURE ? 'https' : 'http';

    public static APP_HOST: string = process.env.HOST || 'localhost';

    public static APP_PORT: number = +process.env.PORT || (Config.__DEVELOPMENT__ ? 3000 : 8080);

    public static APP_ENDPOINT: string = Config.APP_PROTOCOL + '://' + Config.APP_HOST + ':' + Config.APP_PORT;

    public static ENABLE_TUNNEL: boolean = process.env.ENABLE_TUNNEL === 'true' ? true : (Config.__DEVELOPMENT__ ? false : true);

    public static LOCALTUNNEL_SUBDOMAIN: string = process.env.LOCALTUNNEL_SUBDOMAIN || 'tars';
}