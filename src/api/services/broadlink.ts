import * as Broadlink from 'broadlinkjs';
import * as HTTP_STATUS from 'http-status-codes';
import logger from '../../common/logger';
import { BroadlinkDeviceInfo, BroadlinkRequest } from '../models/broadlink';
import { ResponseModel } from '../models';
import fs = require('fs');
import { resolve } from 'dns';
import { Device } from 'broadlinkjs';
import { Body } from 'tsoa';

const broadlinkData = require('../../data/broadlink-commands.json');

class BroadlinkService {

    private _broadlink: Broadlink;

    /**
     * Broadlink Devices
     */
    private _devices: any = {};

    /**
     * Broadlink Devices information.
     */
    private _devicesDetails: any = {};

    constructor() {
        this._broadlink = new Broadlink();

        this._broadlink.on('deviceReady', (dev: any) => {

            if (dev.getType() !== 'RM2') {
                console.log('Not a supported device yet.');
            }

            const id = dev.mac[0] * 100 + dev.mac[1];
            const address = dev.host.address;

            this._devices[id] = dev;
            this._devicesDetails[id] = {
                id: id,
                host: address,
                mac: dev.mac,
                type: dev.type
            }
            
            console.log('Discovered Broadlink device (id: ' + id + ', ip: ' + address + ', type: ' + dev.type +')');
        });
        this._broadlink.discover();
    }
    
    discoverBroadlinkDevices(): Promise<ResponseModel> {
        return new Promise(async (resolve, reject) => {
            await this._broadlink.discover();
            const message = 'Total discovered devices: ' + Object.keys(this._devices).length;
            resolve({status: HTTP_STATUS.OK, message: message});
        });
    }
  
    getBroadlinkDevices(): Promise<any> {
        return new Promise((resolve, reject) => {
            resolve(this._devicesDetails);
        });
    }

    getBroadlinkDevice(deviceId: number): Promise<BroadlinkDeviceInfo> {
        return new Promise((resolve, reject) => {
            const deviceDetails = this._devicesDetails[deviceId];
            if (!deviceDetails) {
                logger.error('Requested device not found.');
                reject({status: HTTP_STATUS.NOT_FOUND, message: 'Device not found.'});
            }
            resolve(deviceDetails);
        });
    }
    
    putBroadlinkDeviceController(deviceId: number, @Body() model: BroadlinkRequest): Promise<ResponseModel> {
        return new Promise(async (resolve, reject) => {
            const device = this._devices[deviceId];
            if (!device) {
                logger.error('Requested device not found.');
                resolve({ status: HTTP_STATUS.NOT_FOUND, message: 'Device not found.'});
            }

            const broadlinkDevice = broadlinkData[model.device]
            if (!broadlinkDevice) {
                logger.error('Requested device type not found: ' + broadlinkDevice);
                resolve({ status: HTTP_STATUS.NOT_FOUND, message: 'Requested device type not found: ' + broadlinkDevice});
            }

            let response: ResponseModel;
            // Get command
            const command = broadlinkDevice[model.command];
            if (!command) {
                logger.error('Requested device type not found.');
                response = { status: HTTP_STATUS.NOT_FOUND, message: 'This device type is not supported: ' + model.device};
            } else if (!command.data) {
                logger.error('Requested command not found.');
                response = { status: HTTP_STATUS.NOT_FOUND, message: 'This command is not supported: ' + model.device};
            } else {
                // Buffered command
                const hexDataBuffer = new Buffer(command.data, 'hex');
                // Send the command
                device.sendData(hexDataBuffer);
                // If turn off projector, need to send signal twice due to confirmation
                if (model.device === 'Projector' && model.command === 'TurnOff') {
                    logger.info('Target device is a projector and requested operation is TurnOff. Sending signal again.');
                    // Wait a few seconds
                    await setTimeout(() => {
                        device.sendData(hexDataBuffer);
                    }, 3000);
                }
                response = { status: HTTP_STATUS.OK, message: 'Command executed successfully.' };
            }
            resolve(response);              
        });
    }
}

export const broadlinkService = new BroadlinkService();