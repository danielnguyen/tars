import * as HTTP_STATUS from 'http-status-codes';
import {Get, Post, Route, Body, Query, Header, Path, SuccessResponse, Controller } from 'tsoa';
import { HealthService } from '../services/health';
import { Health } from '../models/health';

@Route('Health')
export class HealthController extends Controller {

    @SuccessResponse(HTTP_STATUS.OK, 'OK')
    @Get()
    public async getHealth(): Promise<Health> {
        return await new HealthService().get();
    }
}