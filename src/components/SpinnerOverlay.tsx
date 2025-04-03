'use client'

export default function SpinnerOverlay() {
    return (
        <div className="absolute inset-0 z-10 bg-black/60 flex items-center justify-center pointer-events-auto">
            <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
        </div>
    )
}