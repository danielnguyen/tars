import * as Broadlink from 'broadlinkjs';
import * as HTTP_STATUS from 'http-status-codes';
// import l from '../../common/logger';
import { BroadlinkDevice, BroadlinkDeviceState } from '../models/broadlink';
import { ResponseModel } from '../models';
import fs = require('fs');
import { resolve } from 'dns';
import { Device } from 'broadlinkjs';
import { Body } from 'tsoa';

class BroadlinkService {

    private _broadlink: Broadlink;
    private _devices: BroadlinkDevice[] = [];

    constructor() {
        this._broadlink = new Broadlink();
        this._broadlink.on("deviceReady", (dev: any) => {
            let name = "";
            name = dev.host.address;
            this._devices.push({
                id: dev.mac[0] * 100 + dev.mac[1],
                name: name,
                host: dev.host.address,
                type: dev.type
            });
            console.log('Discovered Broadlink device (ip: ' + name + ', type: ' + dev.type +')');
        });
        
        this._broadlink.discover();
    }
    
    discoverBroadlinkDevices(): Promise<BroadlinkDevice[]> {
        return new Promise((resolve, reject) => {
            this._broadlink.discover();
            resolve(this._devices);
        });
    }
  
    getBroadlinkDevices(): Promise<BroadlinkDevice[]> {
        return new Promise((resolve, reject) => {
            resolve(this._devices);
        });
    }

    getBroadlinkDevice(deviceId: number): Promise<BroadlinkDevice> {
        return new Promise((resolve, reject) => {
            this._devices.forEach((device) => {
                if (device.id === deviceId) {
                    resolve(device);
                }
            });
            reject("Device not found.");
        });
    }
    
    putBroadlinkDeviceState(deviceId: number, @Body() model: BroadlinkDeviceState): Promise<ResponseModel> {
        return new Promise((resolve, reject) => {
            if (true /* replace with turn on*/) {
                resolve();              
            }
        });
    }
}

export const broadlinkService = new BroadlinkService();