'use client'

import React from 'react'

interface InputFieldProps {
    name: string
    type?: string
    placeholder: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    required?: boolean
}

export default function InputField({
                                       name,
                                       type = 'text',
                                       placeholder,
                                       value,
                                       onChange,
                                       required = false
                                   }: InputFieldProps) {
    return (
        <input
            name={name}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            required={required}
            style={{
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px'
            }}
        />
    )
}