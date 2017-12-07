import * as HTTP_STATUS from 'http-status-codes';
import {Get, Post, Put, Route, Body, Query, Header, Path, Response, SuccessResponse, Controller, Tags } from 'tsoa';
import { broadlinkService } from '../services/broadlink';
import { BroadlinkDevice, BroadlinkDeviceState } from '../models/broadlink';
import { ErrorResponseModel, ResponseModel } from '../models';

@Route('Broadlink')
export class BroadlinkController extends Controller {
    
    @SuccessResponse(HTTP_STATUS.OK, 'OK')
    @Post('Discover')
    @Tags('Broadlink')
    public async discoverBroadlinkDevices(): Promise<BroadlinkDevice[]> {
        return await broadlinkService.discoverBroadlinkDevices();
    }

    @SuccessResponse(HTTP_STATUS.OK, 'OK')
    @Get('Devices')
    @Tags('Broadlink')
    public async getBroadlinkDevices(): Promise<BroadlinkDevice[]> {
        return await broadlinkService.getBroadlinkDevices();
    }
    
    @SuccessResponse(HTTP_STATUS.OK, 'OK')
    @Get('Devices/{deviceId}')
    @Tags('Broadlink')
    public async getBroadlinkDevice(deviceId: number): Promise<BroadlinkDevice> {
        return await broadlinkService.getBroadlinkDevice(deviceId);
    }
    
    @SuccessResponse(HTTP_STATUS.NO_CONTENT, 'No content')
    @Put('Devices/{deviceId}/State')
    @Tags('Broadlink')
    public async putBroadlinkDeviceState(deviceId: number, @Body() model: BroadlinkDeviceState): Promise<ResponseModel> {
        return await broadlinkService.putBroadlinkDeviceState(deviceId, model);
    }
}