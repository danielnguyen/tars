import * as HTTP_STATUS from 'http-status-codes';
// import l from '../../common/logger';
import { Health } from '../models/health';
import { resolve } from 'dns';

export class HealthService {
  
    get(): Promise<Health> {
        return new Promise((resolve, reject) => {
            const status: Health = {
                status: HTTP_STATUS.OK,
                message: "All good!"
            };
            resolve(status);
        });
    }
}