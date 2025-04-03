'use client'

import React from 'react'

interface InputFieldProps {
    name: string
    type?: string
    placeholder: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    required?: boolean
    disabled?: boolean
}

export default function InputField({
                                       name,
                                       type = 'text',
                                       placeholder,
                                       value,
                                       onChange,
                                       required = false,
                                       disabled = false
                                   }: InputFieldProps) {
    return (
        <input
            name={name}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            required={required}
            disabled={disabled}
            className={`w-full h-10 px-3 border rounded text-base align-middle
            ${disabled
                ? 'bg-neutral-700 text-gray-400 border-neutral-600 cursor-not-allowed'
                : 'bg-neutral-900 text-white border-neutral-700'}`}
        />
    )
}