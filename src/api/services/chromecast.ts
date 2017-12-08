import * as HTTP_STATUS from 'http-status-codes';
import logger from '../../common/logger';
import { ResponseModel } from '../models';
import { ChromecastMediaOptions, ChromecastOperations, ChromecastRequest } from '../models/chromecast';
import { resolve } from 'dns';
import { Body, Header } from 'tsoa';

// Need to require as chromecasts package does not have typings.
const chromecasts = require('chromecasts');

class ChromecastService {

    private _chromecasts: any;
    private _players: any = {};
    private _defaultPlayer: any;
    private _currentPlayer: any;

    constructor() {
        
        // Do an initial discovery of devices
        this._chromecasts = chromecasts();

        // Handle updating of players at discovery time.
        this._chromecasts.on('update', (device: any) => {
            logger.info('Discovered new Chromecast player: ' + device.name + ' at ' + device.host);

            // Add it to the list of players.
            this._players[device.name] = device;

            // Refresh all of the Chromecast Players if not cached or out-of-date
            chromecasts.players.forEach((player: any) => {

                player.on('status', (status: any): any => {
                    return status;
                });

                if (!this._players[player.name] || this._players[player.name] !== player.host) {
                    this._players[player.name] = player;                    
                }
            });
        })
    }
    
    discoverChromecasts(): Promise<any> {
        return new Promise(async (resolve, reject) => {
            await this._chromecasts.update();
            resolve(this._players);
        });
    }
  
    controlChromecast(@Body() request: ChromecastRequest): Promise<ResponseModel> {
        return new Promise(async (resolve, reject) => {
            const player: any = this._currentPlayer || this._defaultPlayer;

            if (!player) {
                logger.error('Error: No current player running or default player set. Need to specify a player.');
                resolve({ status: HTTP_STATUS.BAD_REQUEST, message: 'No player currently running and no default player found. You need to specify a player.'});
            }

            if (!request.command) {
                logger.error('Error: No Chromecast commands specified.');
                resolve({ status: HTTP_STATUS.BAD_REQUEST, message: 'You need to specify a Chromecast command.'});
            }

            if (request.command === ChromecastOperations.PLAY) {
                if (!request.url) {
                    logger.error('Error: No URL specified to play on Chromecast.');
                    resolve({ status: HTTP_STATUS.BAD_REQUEST, message: 'You need to specify a URL for Chromecast to play.'});   
                }
                let options: ChromecastMediaOptions = {};
                if (request.options) options = request.options;
                await player.play(request.url, options);
                resolve({ status: HTTP_STATUS.OK, message: "Sent the media to Chromecast." });
            } else if (request.command === ChromecastOperations.PAUSE) {
                await player.pause();
                resolve({ status: HTTP_STATUS.OK, message: "Media is paused." });                
            } else if (request.command === ChromecastOperations.RESUME) {
                await player.resume();
                resolve({ status: HTTP_STATUS.OK, message: "Media has resumed." });                
            } else if (request.command === ChromecastOperations.SEEK) {
                if (!request.options || !request.options.seek || typeof request.options.seek !== 'number') {
                    logger.error('Error: No value specified to seek to.');
                    resolve({ status: HTTP_STATUS.BAD_REQUEST, message: 'You need to specify a value in seconds for Chromecast to seek to.'});  
                }
                await player.seek(request.options.seek);
                resolve({ status: HTTP_STATUS.OK, message: "Seeking to " });                
            } else if (request.command === ChromecastOperations.STOP) {
                await player.stop();
                resolve({ status: HTTP_STATUS.OK, message: "Media playing has stopped." });                
            } else if (request.command === ChromecastOperations.SUBTITLES) {
                if (!request.options || !request.options.subtitles) {
                    logger.error('Error: No subtitle settings specified.');
                    resolve({ status: HTTP_STATUS.BAD_REQUEST, message: 'You need to specify a subtitle setting for Chromecast to set.'});  
                }
                await player.subtitles(request.options.subtitles);
                resolve({ status: HTTP_STATUS.OK, message: "Media subtitle changed." });                
            } else {
                logger.error('Error: Unknown Chromecast command: ' + request.command);
                resolve({ status: HTTP_STATUS.BAD_REQUEST, message: 'You need to specify a valid Chromecast command to execute.'});
            }

            resolve({ status: HTTP_STATUS.OK, message: "Operation" });
        });
    }

    setDefaultChromecastPlayer(@Header() playerName: string): Promise<ResponseModel> {
        return new Promise((resolve, reject) => {
            const player = this._players[playerName];
            if (!player) {
                logger.error('Error: The Chromecast player requested was not found: ' + playerName);
                resolve({ status: HTTP_STATUS.NOT_FOUND, message: 'The Chromecast player you requested was not found.' });
            }

            resolve({ status: HTTP_STATUS.OK, message: 'Successfully set ' + playerName + ' as default chromecast player.'});
        });
    }

    getChromecastPlayerStatus(@Header() playerName: string): Promise<ResponseModel> {
        return new Promise(async (resolve, reject) => {
            const player = this._players[playerName];
            if (!player) {
                logger.error('Error: The Chromecast player requested was not found: ' + playerName);
                resolve({ status: HTTP_STATUS.NOT_FOUND, message: 'The Chromecast player you requested was not found.' });
            }

            const playerStatus = await player.status();
            resolve({ status: HTTP_STATUS.OK, message: playerStatus });
        });
    }

}

export const chromecastService = new ChromecastService();