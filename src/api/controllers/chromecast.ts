import * as HTTP_STATUS from 'http-status-codes';
import {Get, Post, Put, Route, Body, Query, Header, Path, Response, SuccessResponse, Controller, Tags } from 'tsoa';
import { chromecastService } from '../services/chromecast';
import { ErrorResponseModel, ResponseModel } from '../models';
import { ChromecastRequest } from '../models/chromecast';

@Route('Chromecast')
export class ChromecastController extends Controller {
    
    @SuccessResponse(201, 'OK')
    @Post('Discover')
    @Tags('Chromecast')
    public async discoverChromecasts(): Promise<any> {
        const resp = await chromecastService.discoverChromecasts();
        return resp;
    }
    
    @SuccessResponse(200, 'OK')
    @Get('Devices')
    @Tags('Chromecast')
    public async getChromecastDevices(): Promise<any> {
        const resp = await chromecastService.getChromecastDevices();
        return resp;
    }
    
    @SuccessResponse(200, 'OK')
    @Get('Devices/{deviceId}')
    @Tags('Chromecast')
    public async getChromecastDevice(@Path('deviceId') deviceId: string): Promise<any> {
        const resp = await chromecastService.getChromecastDevice(deviceId);
        return resp;
    }
    
    @SuccessResponse(204, 'No content')
    @Put('Devices/{deviceId}/Controller')
    @Tags('Chromecast')
    public async putChromecastDeviceController(@Path('deviceId') deviceId: string, @Body() model: ChromecastRequest): Promise<ResponseModel> {
        const resp = await chromecastService.controlChromecast(model, deviceId);
        this.setStatus(resp.status);
        return resp;
    }
    
    @SuccessResponse(204, 'No content')
    @Put('Default/Controller')
    @Tags('Chromecast')
    public async controlChromecast(@Body() request: ChromecastRequest): Promise<ResponseModel> {
        const resp = await chromecastService.controlChromecast(request);
        this.setStatus(resp.status);
        return resp;
    }
    
    @SuccessResponse(204, 'No content')
    @Put('Default')
    @Tags('Chromecast')
    public async setDefaultChromecastDevice(@Header() device_name: string): Promise<ResponseModel> {
        const resp = await chromecastService.setDefaultChromecastDevice(device_name);
        this.setStatus(resp.status);
        return resp;
    }

    @SuccessResponse(200, 'OK')
    @Get('Status')
    @Tags('Chromecast')
    public async getChromecastDeviceStatus(@Header() device_name: string): Promise<ResponseModel> {
        const resp = await chromecastService.getChromecastDeviceStatus(device_name);
        this.setStatus(resp.status);
        return resp;
    }
}