import * as HTTP_STATUS from 'http-status-codes';
import {Get, Post, Route, Body, Query, Header, Path, SuccessResponse, Controller } from 'tsoa';
import { HealthService } from '../services/health';
import { ResponseModel } from '../models';

@Route('HealthCheck')
export class HealthController extends Controller {

    @SuccessResponse(HTTP_STATUS.OK, 'OK')
    @Get()
    public async getHealth(): Promise<ResponseModel> {
        return await new HealthService().get();
    }
}