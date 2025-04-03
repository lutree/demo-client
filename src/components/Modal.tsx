'use client'

import React from 'react'

interface ModalProps {
    isOpen: boolean
    title: string
    message: string
    onClose: () => void
}

export default function Modal({ isOpen, title, message, onClose }: ModalProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-neutral-800 text-white rounded-xl shadow-lg p-6 w-full max-w-sm">
                <h2 className="text-xl font-semibold mb-2">{title}</h2>
                <p className="text-sm mb-4">{message}</p>
                <div className="text-right">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-blue-600 rounded text-white hover:bg-blue-500"
                    >
                        확인
                    </button>
                </div>
            </div>
        </div>
    )
}