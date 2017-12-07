import * as HTTP_STATUS from 'http-status-codes';
// import l from '../../common/logger';
import { ResponseModel } from '../models';
import { resolve } from 'dns';

export class HealthService {
  
    get(): Promise<ResponseModel> {
        return new Promise((resolve, reject) => {
            const status: ResponseModel = {
                code: HTTP_STATUS.OK,
                message: "All good!"
            };
            resolve(status);
        });
    }
}