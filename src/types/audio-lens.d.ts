declare global {
    namespace AudioLens {
        type Mode = 'upload' | 'record'
        type RecordState = 'recording' | 'paused' | 'stopped'
        type AudioPlayerState = 'playing' | 'paused' | 'stopped'

        interface AudioDataObject {
            title: string
            blob: Blob
            url: string
        }
    }
}

export {}
