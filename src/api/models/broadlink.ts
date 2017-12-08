import * as Broadlink from 'broadlinkjs';

export interface BroadlinkDeviceInfo {
    id: number,
    host: string,
    mac?: string,
    type: string
}

export interface BroadlinkDeviceController {
    device: "Projector" | "TV",
    command: string
}