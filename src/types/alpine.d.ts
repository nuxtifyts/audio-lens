import Alpine from '@types/alpinejs'

declare global {
    const Alpine: Alpine.Alpine

    interface Window {
        Alpine: Alpine.Alpine
    }
}

export {}
