import { AlpineComponent } from 'alpinejs'

interface AudioLensComponent {
    /** States */
    acceptedFileTypes: Array<string>
    fileDraggedWithin: boolean
    incorrectFileDragged: boolean
    mode: AudioLens.Mode
    recordingState: AudioLens.RecordState
    audioChunks: Array<Blob>
    audioData: Array<AudioLens.AudioDataObject>

    /** Also State, but Intended to be used via recorder function */
    _recorder: MediaRecorder | null


    /** Getters */
    isUploadMode: boolean
    isRecordMode: boolean

    showStartRecordingButton: boolean
    showPauseRecordingButton: boolean
    showResumeRecordingButton: boolean
    showStopRecordingButton: boolean
    
    correctFileDraggedIn: boolean
    incorrectFileDraggedIn: boolean

    /** Functions */
    setUploadMode: () => void
    setRecordMode: () => void

    startRecording: () => Promise<void>
    pauseRecording: () => Promise<void>
    resumeRecording: () => Promise<void>
    stopRecording: () => Promise<void>

    onFileChange: (event: Event) => void
    onFileDragEnter: (event: DragEvent) => void
    onFileDragLeave: (event: DragEvent) => void
    onFileUpload: (event: DragEvent) => void

    recorder: () => Promise<MediaRecorder>
}

export const initAudioLensComponent = () => document.addEventListener('alpine:init', () => {
    Alpine.data('audioLens', (
        acceptedFileTypes: Array<string> = ['audio/wav']
    ): AlpineComponent<AudioLensComponent> => ({
        acceptedFileTypes,
        fileDraggedWithin: false,
        incorrectFileDragged: false,
        audioChunks: [],
        audioData: [],

        mode: 'record',
        recordingState: 'stopped',

        _recorder: null,

        get isUploadMode(): boolean { return this.mode === 'upload' },
        get isRecordMode(): boolean { return this.mode === 'record' },

        get showStartRecordingButton(): boolean { return this.isRecordMode && this.recordingState === 'stopped' },
        get showPauseRecordingButton(): boolean { return this.isRecordMode && this.recordingState === 'recording' },
        get showResumeRecordingButton(): boolean { return this.isRecordMode && this.recordingState === 'paused' },
        get showStopRecordingButton(): boolean { return this.isRecordMode && this.recordingState !== 'stopped' },
        
        get correctFileDraggedIn(): boolean { return this.fileDraggedWithin && !this.incorrectFileDragged },
        get incorrectFileDraggedIn(): boolean { return this.fileDraggedWithin && this.incorrectFileDragged },

        setUploadMode(): void { this.mode = 'upload' },
        setRecordMode(): void { this.mode = 'record' },

        async startRecording(): Promise<void> {
            (await this.recorder()).start()
            this.recordingState = 'recording'
        },

        async pauseRecording(): Promise<void> {
            (await this.recorder()).pause()
            this.recordingState = 'paused' 
        },

        async resumeRecording(): Promise<void> {
            (await this.recorder()).resume()
            this.recordingState = 'recording' 
        },
        async stopRecording(): Promise<void> {
            (await this.recorder()).stop()
            this.recordingState = 'stopped'

            this.audioChunks = []
        },
        
        // TODO add cancel recording functionality

        onFileChange(event): void {
            const target = event.target as HTMLInputElement
            const file = target.files?.item(0)

            console.log(event)

            if (file) {
                console.log(file)
            }
        },

        onFileDragEnter(event: DragEvent): void {
            event.preventDefault()

            if (!event.dataTransfer) return

            const file: DataTransferItem = event.dataTransfer.items[0]

            // Check file type
            if (!this.acceptedFileTypes.includes(file.type)) {
                this.incorrectFileDragged = true
            }

            this.fileDraggedWithin = true
        },

        onFileDragLeave(event: DragEvent): void {
            event.preventDefault()
            this.fileDraggedWithin = false
            this.incorrectFileDragged = false
        },

        onFileUpload(event: DragEvent): void {
            event.preventDefault()
            console.log(event)
        },

        async recorder(): Promise<MediaRecorder>{
            const stream: MediaStream = await navigator.mediaDevices.getUserMedia({audio: true})

            if (this._recorder) {
                return this._recorder
            }

            this._recorder = new MediaRecorder(stream)
            
            this._recorder.ondataavailable = event => {
                this.audioChunks.push(event.data)
            }

            this._recorder.onstop = async () => {
                this._recorder!.stream.getTracks().forEach(track => track.stop())

                const audioType = this.acceptedFileTypes[0]
                const blob = new Blob(this.audioChunks, {type: audioType})

                const time = Date.now()
                const fileKey = `recording_${time}`
                const extension = audioType.split('/')[1]
                const fileName = `${fileKey}.${extension}`

                this.audioData.push({title: fileName, blob, url: URL.createObjectURL(blob)})

                console.log(this.audioData)
            }

            return this._recorder
        }
    }))
})
