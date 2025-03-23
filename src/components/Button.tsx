'use client'

import React from 'react'

interface ButtonProps {
    type?: 'button' | 'submit' | 'reset'
    children: React.ReactNode
    onClick?: () => void
    disabled?: boolean
}

export default function Button({
                                   type = 'button',
                                   children,
                                   onClick,
                                   disabled = false
                               }: ButtonProps) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            style={{
                padding: '10px 16px',
                backgroundColor: disabled ? '#ccc' : '#0070f3',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: disabled ? 'not-allowed' : 'pointer',
                fontWeight: 500,
                fontSize: '1rem',
                marginTop: '8px'
            }}
        >
            {children}
        </button>
    )
}