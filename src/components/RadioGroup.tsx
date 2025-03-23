'use client'

import React from 'react'

interface RadioGroupProps {
    name: string
    options: { label: string; value: string }[]
    selectedValue: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function RadioGroup({
                                       name,
                                       options,
                                       selectedValue,
                                       onChange
                                   }: RadioGroupProps) {
    return (
        <div style={{ display: 'flex', gap: '10px' }}>
            {options.map(opt => (
                <label key={opt.value}>
                    <input
                        type="radio"
                        name={name}
                        value={opt.value}
                        checked={selectedValue === opt.value}
                        onChange={onChange}
                    />
                    {opt.label}
                </label>
            ))}
        </div>
    )
}