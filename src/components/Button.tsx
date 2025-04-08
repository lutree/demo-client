'use client'

import React from 'react'

interface ButtonProps {
    type?: 'button' | 'submit' | 'reset'
    children: React.ReactNode
    onClick?: () => void
    disabled?: boolean
    className?: string
}

export default function Button({
                                   type = 'button',
                                   children,
                                   onClick,
                                   disabled = false,
                                   className = ''
                               }: ButtonProps) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`h-10 px-4 rounded font-medium text-base align-middle
        ${disabled
                ? 'bg-neutral-700 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-500 cursor-pointer'}
            ${className}`}
        >
            {children}
        </button>
    )
}