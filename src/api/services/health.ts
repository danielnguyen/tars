import * as HTTP_STATUS from 'http-status-codes';
import logger from '../../common/logger';
import { ResponseModel } from '../models';
import { resolve } from 'dns';

export class HealthService {
  
    get(): Promise<ResponseModel> {
        return new Promise((resolve, reject) => {
            const status: ResponseModel = {
                status: HTTP_STATUS.OK,
                message: "All good!"
            };
            resolve(status);
        });
    }
}