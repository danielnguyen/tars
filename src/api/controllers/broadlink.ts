import * as HTTP_STATUS from 'http-status-codes';
import {Get, Post, Put, Route, Body, Query, Header, Path, Response, SuccessResponse, Controller, Tags } from 'tsoa';
import { broadlinkService } from '../services/broadlink';
import { BroadlinkDeviceInfo, BroadlinkRequest } from '../models/broadlink';
import { ErrorResponseModel, ResponseModel } from '../models';

@Route('Broadlink')
export class BroadlinkController extends Controller {
    
    @SuccessResponse(201, 'Created')
    @Post('Discover')
    @Tags('Broadlink')
    public async discoverBroadlinkDevices(): Promise<ResponseModel> {
        const resp = await broadlinkService.discoverBroadlinkDevices();
        this.setStatus(resp.status);
        return resp;
    }

    @SuccessResponse(200, 'OK')
    @Get('Devices')
    @Tags('Broadlink')
    public async getBroadlinkDevices(): Promise<any> {
        const resp = await broadlinkService.getBroadlinkDevices();
        return resp;
    }
    
    @SuccessResponse(200, 'OK')
    @Get('Devices/{deviceId}')
    @Tags('Broadlink')
    public async getBroadlinkDevice(@Path('deviceId') deviceId: number): Promise<BroadlinkDeviceInfo> {
        const resp = await broadlinkService.getBroadlinkDevice(deviceId);
        return resp;
    }
    
    @SuccessResponse(204, 'No content')
    @Put('Devices/{deviceId}/Controller')
    @Tags('Broadlink')
    public async putBroadlinkDeviceController(@Path('deviceId') deviceId: number, @Body() model: BroadlinkRequest): Promise<ResponseModel> {
        const resp = await broadlinkService.putBroadlinkDeviceController(deviceId, model);
        this.setStatus(resp.status);
        return resp;
    }
}