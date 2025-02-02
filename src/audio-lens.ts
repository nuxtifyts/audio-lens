import { AlpineComponent } from 'alpinejs'

interface AudioLensComponent {
    acceptedFileTypes: Array<string>
    fileDraggedWithin: boolean
    incorrectFileDragged: boolean
    mode: AudioLens.Mode
    recordingState: AudioLens.RecordState
    files: Array<File>

    isUploadMode: boolean
    isRecordMode: boolean

    showStartRecordingButton: boolean
    showPauseRecordingButton: boolean
    showResumeRecordingButton: boolean
    showStopRecordingButton: boolean
    
    correctFileDraggedIn: boolean
    incorrectFileDraggedIn: boolean

    setUploadMode: () => void
    setRecordMode: () => void

    onFileChange: (event: Event) => void
    onFileDragEnter: (event: DragEvent) => void
    onFileDragLeave: (event: DragEvent) => void
    onFileUpload: (event: DragEvent) => void
}

export function initAudioLens() {
    document.addEventListener('alpine:init', () => {
        Alpine.data('audioLens', (
            acceptedFileTypes: Array<string> = ['audio/wav']
        ): AlpineComponent<AudioLensComponent> => ({
            acceptedFileTypes,
            fileDraggedWithin: false,
            incorrectFileDragged: false,
            files: [],
            mode: 'record',
            recordingState: 'stopped',

            get isUploadMode(): boolean { return this.mode === 'upload' },
            get isRecordMode(): boolean { return this.mode === 'record' },

            get showStartRecordingButton(): boolean {
                return this.isRecordMode && this.recordingState === 'stopped'
            },
            get showPauseRecordingButton(): boolean {
                return this.isRecordMode && this.recordingState === 'recording'
            },
            get showResumeRecordingButton(): boolean {
                return this.isRecordMode && this.recordingState === 'paused'
            },
            get showStopRecordingButton(): boolean {
                return this.isRecordMode && this.recordingState !== 'stopped'
            },
            
            get correctFileDraggedIn(): boolean { return this.fileDraggedWithin && !this.incorrectFileDragged },
            get incorrectFileDraggedIn(): boolean { return this.fileDraggedWithin && this.incorrectFileDragged },

            setUploadMode(): void { this.mode = 'upload' },

            setRecordMode(): void { this.mode = 'record' },

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
        }))
    })
}
