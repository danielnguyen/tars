import * as HTTP_STATUS from 'http-status-codes';
import {Get, Post, Put, Route, Body, Query, Header, Path, Response, SuccessResponse, Controller, Tags } from 'tsoa';
import { chromecastService } from '../services/chromecast';
import { ErrorResponseModel, ResponseModel } from '../models';
import { ChromecastRequest } from '../models/chromecast';

@Route('Chromecast')
export class ChromecastController extends Controller {
    
    @SuccessResponse(HTTP_STATUS.OK, 'OK')
    @Post('Discover')
    @Tags('Chromecast')
    public async discoverChromecasts(): Promise<any> {
        const resp = await chromecastService.discoverChromecasts();
        return resp;
    }
    
    @SuccessResponse(HTTP_STATUS.OK, 'OK')
    @Put('Controller')
    @Tags('Chromecast')
    public async controlChromecast(@Body() request: ChromecastRequest): Promise<ResponseModel> {
        const resp = await chromecastService.controlChromecast(request);
        this.setStatus(resp.status);
        return resp;
    }
    
    @SuccessResponse(HTTP_STATUS.OK, 'OK')
    @Put('Default')
    @Tags('Chromecast')
    public async setDefaultChromecastPlayer(@Header() player_name: string): Promise<ResponseModel> {
        const resp = await chromecastService.setDefaultChromecastPlayer(player_name);
        this.setStatus(resp.status);
        return resp;
    }

    @SuccessResponse(HTTP_STATUS.OK, 'OK')
    @Get('Status')
    @Tags('Chromecast')
    public async getChromecastPlayerStatus(@Header() player_name: string): Promise<ResponseModel> {
        const resp = await chromecastService.getChromecastPlayerStatus(player_name);
        this.setStatus(resp.status);
        return resp;
    }
}