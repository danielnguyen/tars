export enum ChromecastOperations {
    PLAY = "play",
    PAUSE = "pause",
    RESUME = "resume",
    STOP = "stop",
    SEEK = "seek",
    SUBTITLES = "subtitles"
}

export interface ChromecastRequest {
    command: ChromecastOperations,
    url?: string,    
    options?: ChromecastMediaOptions
}

export interface ChromecastMediaOptions {
    title?: string, // 'My movie',
    type?: string, // 'video/mp4',
    seek?: number, // seconds (start by seeking to this offset)
    subtitles?: string[], // ['http://example.com/sub.vtt'], // subtitle track 1,
    autoSubtitles?: boolean // enable first track if you provide subs
}