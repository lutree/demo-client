'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import InputField from '@/components/InputField'
import ErrorMessage from '@/components/ErrorMessage'
import Button from '@/components/Button'

export default function LoginPage() {
    const router = useRouter()
    const [form, setForm] = useState({
        loginId: '',
        loginPwd: ''
    })
    const [error, setError] = useState('')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const res = await fetch('http://localhost:8080/sign/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                body: JSON.stringify({
                    loginId: form.loginId,
                    loginPwd: form.loginPwd
                })
            })

            const result = await res.json()

            if (result.status === 'SUCCESS') {
                // 추후: 토큰 저장, 리다이렉트 등
                console.log('로그인 성공!', result.data)
                alert('로그인 성공!')
                // router.push('/dashboard') // 예시
            } else {
                setError(result.message || '로그인에 실패했습니다.')
            }
        } catch (err) {
            console.error(err)
            setError('서버와 연결할 수 없습니다.')
        }
    }

    return (
        <div className="p-6 max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4">로그인</h1>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px', margin: '0 auto' }}>
                <InputField name="loginId" placeholder="아이디" value={form.loginId} onChange={handleChange} required />
                <InputField name="loginPwd" type="password" placeholder="비밀번호" value={form.loginPwd} onChange={handleChange} required />
                {error && <ErrorMessage message={error} />}
                <Button type="submit">로그인</Button>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                    <button type="button" onClick={() => router.push('/sign-up')} style={{ background: 'none', border: 'none', color: '#0070f3', cursor: 'pointer' }}>
                        회원가입
                    </button>
                    <button type="button" onClick={() => alert('비밀번호 찾기는 추후 구현 예정입니다.')} style={{ background: 'none', border: 'none', color: '#0070f3', cursor: 'pointer' }}>
                        비밀번호 찾기
                    </button>
                </div>
            </form>
        </div>
    )
}