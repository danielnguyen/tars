import * as HTTP_STATUS from 'http-status-codes';
import logger from '../../common/logger';
import { ResponseModel } from '../models';
import { ChromecastMediaOptions, ChromecastOperations, ChromecastRequest } from '../models/chromecast';
import { resolve } from 'dns';
import { Body, Header } from 'tsoa';

// Need to require as chromecasts package does not have typings.
const ChromecastDriver = require('chromecasts');

class ChromecastService {

    private _ChromecastDriver: any;
    private _devices: any = {};
    private _defaultDevice: any;
    private _currentDevice: any;

    constructor() {
        // Do an initial discovery of devices
        this._ChromecastDriver = ChromecastDriver();

        // Handle updating of devices at discovery time.
        this._ChromecastDriver.on('update', (device: any) => {
            logger.info('Discovered new Chromecast device: ' + device.name + ' at ' + device.host);

            // Add it to the list of devices.
            this._devices[device.name] = device;
        })

        this._ChromecastDriver.on('error', (err: Error) => {
            logger.error('Error: %s', err.message);
            this._ChromecastDriver.close();
        });
    }
    
    discoverChromecasts(): Promise<any> {
        return new Promise(async (resolve, reject) => {
            await this._ChromecastDriver.update();
            resolve(this._devices);
        });
    }

    getChromecastDevices(): Promise<any> {
        return new Promise((resolve, reject) => {
            resolve(this._devices);
        });
    }
    
    getChromecastDevice(deviceId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const deviceDetails = this._devices[deviceId];
            if (!deviceDetails) {
                logger.error('Requested device not found.');
                reject({status: HTTP_STATUS.NOT_FOUND, message: "Device not found."});
            }
            resolve(deviceDetails);
        });
    }
  
    controlChromecast(@Body() request: ChromecastRequest, deviceId?: string): Promise<ResponseModel> {
        return new Promise(async (resolve, reject) => {
            let device: any;
            if (deviceId && this._devices[deviceId]) {
                // Use requested device
                device = this._devices[deviceId];
            } else {
                // Use current or default device
                device = this._currentDevice || this._defaultDevice;
            }

            if (!device) {
                logger.error('Error: No current device running or default device set. Need to specify a device.');
                resolve({ status: HTTP_STATUS.BAD_REQUEST, message: 'No device currently running and no default device found. You need to specify a device.'});
            }

            if (!request.command) {
                logger.error('Error: No Chromecast commands specified.');
                resolve({ status: HTTP_STATUS.BAD_REQUEST, message: 'You need to specify a Chromecast command.'});
            }

            const response: ResponseModel = await this.execCommand(device, request);
            resolve(response);
        });
    }

    setDefaultChromecastDevice(@Header() deviceName: string): Promise<ResponseModel> {
        return new Promise((resolve, reject) => {
            const device = this._devices[deviceName];
            if (!device) {
                logger.error('Error: The Chromecast device requested was not found: ' + deviceName);
                resolve({ status: HTTP_STATUS.NOT_FOUND, message: 'The Chromecast device you requested was not found.' });
            }

            resolve({ status: HTTP_STATUS.OK, message: 'Successfully set ' + deviceName + ' as default chromecast device.'});
        });
    }

    getChromecastDeviceStatus(@Header() deviceName: string): Promise<ResponseModel> {
        return new Promise(async (resolve, reject) => {
            const device = this._devices[deviceName];
            if (!device) {
                logger.error('Error: The Chromecast device requested was not found: ' + deviceName);
                resolve({ status: HTTP_STATUS.NOT_FOUND, message: 'The Chromecast device you requested was not found.' });
            }

            const deviceStatus = await device.status();
            resolve({ status: HTTP_STATUS.OK, message: deviceStatus });
        });
    }

    async execCommand(device: any, request: ChromecastRequest) {
        let response: ResponseModel;
        
        switch(request.command) {
            case ChromecastOperations.PLAY: {
                if (!request.url) {
                    logger.error('Error: No URL specified to play on Chromecast.');
                    response = { status: HTTP_STATUS.BAD_REQUEST, message: 'You need to specify a URL for Chromecast to play.'};   
                } else {
                    let options: ChromecastMediaOptions = {};
                    if (request.options) options = request.options;
                    await device.play(request.url, options);
                    response = { status: HTTP_STATUS.OK, message: "Sent the media to Chromecast." };
                }
                break;
            }
            case ChromecastOperations.PAUSE: {
                await device.pause();
                response = { status: HTTP_STATUS.OK, message: "Media is paused." }; 
                break;
            }
            case ChromecastOperations.RESUME: {
                await device.resume();
                response = { status: HTTP_STATUS.OK, message: "Media has resumed." };  
                break;   
            }
            case ChromecastOperations.SEEK: {
                if (!request.options || !request.options.seek || typeof request.options.seek !== 'number') {
                    logger.error('Error: No value specified to seek to.');
                    response = { status: HTTP_STATUS.BAD_REQUEST, message: 'You need to specify a value in seconds for Chromecast to seek to.'};  
                } else {
                    await device.seek(request.options.seek);
                    response = { status: HTTP_STATUS.OK, message: "Seeking to " + request.options.seek + " seconds."}; 
                }
                break;
            }
            case ChromecastOperations.STOP: {
                await device.stop();
                response = { status: HTTP_STATUS.OK, message: "Media playing has stopped." };
                break;
            }
            case ChromecastOperations.SUBTITLES: {
                if (!request.options || !request.options.subtitles) {
                    logger.error('Error: No subtitle settings specified.');
                    response = { status: HTTP_STATUS.BAD_REQUEST, message: 'You need to specify a subtitle setting for Chromecast to set.'};  
                }
                await device.subtitles(request.options.subtitles);
                response = { status: HTTP_STATUS.OK, message: "Media subtitle changed." };
                break;
            }
            default: { 
                logger.error('Error: Unknown Chromecast command: ' + request.command);
                response = { status: HTTP_STATUS.BAD_REQUEST, message: 'You need to specify a valid Chromecast command to execute.'};
                break; 
            } 
        }
        return response;
    }

}

export const chromecastService = new ChromecastService();