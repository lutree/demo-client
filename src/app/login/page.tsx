'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import InputField from '@/components/InputField'
import ErrorMessage from '@/components/ErrorMessage'
import Button from '@/components/Button'
import Modal from '@/components/Modal'
import {BASE_API_URL} from "@/lib/api";

export default function LoginPage() {
    const router = useRouter()
    const [form, setForm] = useState({
        loginId: '',
        loginPwd: ''
    })
    const [error, setError] = useState('')
    const [infoModal, setInfoModal] = useState<{ open: boolean; title: string; message: string; onClose?: () => void }>({
        open: false,
        title: '',
        message: ''
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const res = await fetch(`${BASE_API_URL}/sign/sign-in`, {
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
                setInfoModal({
                    open: true,
                    title: '로그인 성공',
                    message: '환영합니다! 이제 서비스를 이용하실 수 있습니다.'
                })
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
            <h1 className="text-2xl font-bold mb-6 text-center">로그인</h1>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px', margin: '0 auto' }}>
                <InputField name="loginId" placeholder="아이디" value={form.loginId} onChange={handleChange} required />
                <InputField name="loginPwd" type="password" placeholder="비밀번호" value={form.loginPwd} onChange={handleChange} required />
                {error && <ErrorMessage message={error} />}
                <Button type="submit">로그인</Button>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                    <button type="button" onClick={() => router.push('/sign-up')} style={{ background: 'none', border: 'none', color: '#0070f3', cursor: 'pointer' }}>
                        회원가입
                    </button>
                    <button type="button" onClick={() => setInfoModal({ open: true, title: '안내', message: '비밀번호 찾기는 추후 구현 예정입니다.' })} style={{ background: 'none', border: 'none', color: '#0070f3', cursor: 'pointer' }}>
                        비밀번호 찾기
                    </button>
                </div>
            </form>

            <Modal
                isOpen={infoModal.open}
                title={infoModal.title}
                message={infoModal.message}
                onClose={() => {
                    setInfoModal({ open: false, title: '', message: '' })
                    infoModal.onClose?.()
                }}
            />
        </div>
    )
}
