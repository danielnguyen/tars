export interface BroadlinkDevice {
    id: number,
    name: string,
    host: string,
    mac?: string,
    type: string
}

export interface BroadlinkDeviceState {
    is_active: boolean
}