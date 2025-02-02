declare global {
    namespace AudioLens {
        type Mode = 'upload' | 'record'
        type RecordState = 'recording' | 'paused' | 'stopped'
    }
}

export {}
