'use client'

interface ErrorMessageProps {
    message: string
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
    return (
        <label style={{ color: 'red', fontSize: '0.875rem' }}>{message}</label>
    )
}