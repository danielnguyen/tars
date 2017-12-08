import * as Broadlink from 'broadlinkjs';
import * as HTTP_STATUS from 'http-status-codes';
import logger from '../../common/logger';
import { BroadlinkDeviceInfo, BroadlinkDeviceController } from '../models/broadlink';
import { ResponseModel } from '../models';
import fs = require('fs');
import { resolve } from 'dns';
import { Device } from 'broadlinkjs';
import { Body } from 'tsoa';

const commands = require('../../broadlink/commands.json');

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
        this._broadlink.on("deviceReady", (dev: any) => {

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
            const message = "Total discovered devices: " + Object.keys(this._devices).length;
            resolve({code: HTTP_STATUS.OK, message: message});
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
                reject({code: HTTP_STATUS.NOT_FOUND, message: "Device not found."});
            }
            resolve(deviceDetails);
        });
    }
    
    putBroadlinkDeviceController(deviceId: number, @Body() model: BroadlinkDeviceController): Promise<ResponseModel> {
        return new Promise(async (resolve, reject) => {
            const device = this._devices[deviceId];
            if (!device) {
                logger.error('Requested device not found.');
                reject({ code: HTTP_STATUS.NOT_FOUND, message: "Device not found."});
            }
            
            // Get target device type
            const deviceType = commands[model.device];
            if (!deviceType) {
                logger.error('Requested command not found.');
                reject({ code: HTTP_STATUS.NOT_FOUND, message: "This device type is not supported: " + deviceType})
            }

            // Get command
            const command = deviceType[model.command];
            if (!command || !command.data) {
                reject({ code: HTTP_STATUS.NOT_FOUND, message: "This command is not supported: " + deviceType})
            }

            const hexDataBuffer = new Buffer(command.data, 'hex');
            device.sendData(hexDataBuffer);

            // If turn off projector, need to send signal twice due to confirmation
            if (model.device === "Projector" && model.command === "TurnOff") {
                logger.info('Target device is a projector and requested operation is TurnOff. Sending signal again.');
                // Wait a few seconds
                await setTimeout(() => {
                    device.sendData(hexDataBuffer);
                }, 3000);
            }

            resolve();              
        });
    }
}

export const broadlinkService = new BroadlinkService();