export class Config {
    
    public static __DEVELOPMENT__: boolean = process.env.NODE_ENV !== 'production' ? true : false;
    
    public static SECURE: boolean = process.env.HTTP === 'on' ? false : true;

    public static APP_PROTOCOL: string = Config.SECURE ? 'https' : 'http';

    public static APP_HOST: string = process.env.HOST || 'localhost';

    public static APP_PORT: number = +process.env.PORT || (Config.__DEVELOPMENT__ ? 3000 : 443);

    public static APP_ENDPOINT: string = Config.APP_PROTOCOL + '://' + Config.APP_HOST + ':' + Config.APP_PORT;
}