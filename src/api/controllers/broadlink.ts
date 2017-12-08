import * as HTTP_STATUS from 'http-status-codes';
import {Get, Post, Put, Route, Body, Query, Header, Path, Response, SuccessResponse, Controller, Tags } from 'tsoa';
import { broadlinkService } from '../services/broadlink';
import { BroadlinkDeviceInfo, BroadlinkDeviceController } from '../models/broadlink';
import { ErrorResponseModel, ResponseModel } from '../models';

@Route('Broadlink')
export class BroadlinkController extends Controller {
    
    @SuccessResponse(HTTP_STATUS.OK, 'OK')
    @Post('Discover')
    @Tags('Broadlink')
    public async discoverBroadlinkDevices(): Promise<ResponseModel> {
        return await broadlinkService.discoverBroadlinkDevices();
    }

    @SuccessResponse(HTTP_STATUS.OK, 'OK')
    @Get('Devices')
    @Tags('Broadlink')
    public async getBroadlinkDevices(): Promise<any> {
        return await broadlinkService.getBroadlinkDevices();
    }
    
    @SuccessResponse(HTTP_STATUS.OK, 'OK')
    @Get('Devices/{deviceId}')
    @Tags('Broadlink')
    public async getBroadlinkDevice(deviceId: number): Promise<BroadlinkDeviceInfo> {
        return await broadlinkService.getBroadlinkDevice(deviceId);
    }
    
    @SuccessResponse(HTTP_STATUS.NO_CONTENT, 'No content')
    @Put('Devices/{deviceId}/Controller')
    @Tags('Broadlink')
    public async putBroadlinkDeviceController(deviceId: number, @Body() model: BroadlinkDeviceController): Promise<ResponseModel> {
        return await broadlinkService.putBroadlinkDeviceController(deviceId, model);
    }
}