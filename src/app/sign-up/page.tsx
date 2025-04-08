'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import InputField from '@/components/InputField'
//import RadioGroup from '@/components/RadioGroup'
import ErrorMessage from '@/components/ErrorMessage'
import Button from '@/components/Button'
import SpinnerOverlay from '@/components/SpinnerOverlay'
import Modal from '@/components/Modal'
import { BASE_API_URL } from '@/lib/api'
import { hashSHA256 } from '@/lib/hash'

export default function SignUpPage() {
    const router = useRouter()

    const [form, setForm] = useState({
        loginId: '',
        loginPwd: '',
        loginPwdConfirm: '',
        userNm: '',
        userNknm: '',
        // gndrCd: '',
        // bhdt: '',
        // userCno: '',
        userEmail: '',
        // userCi: ''
    })

    const [error, setError] = useState('')
    const [passwordMismatch, setPasswordMismatch] = useState(false)
    const [emailSent, setEmailSent] = useState(false)
    const [authCode, setAuthCode] = useState('')
    const [isVerified, setIsVerified] = useState(false)
    const [isSendingEmail, setIsSendingEmail] = useState(false)
    const [infoModal, setInfoModal] = useState<{ open: boolean; title: string; message: string; onClose?: () => void }>({
        open: false,
        title: '',
        message: ''
    })
    const [timer, setTimer] = useState(0)

    useEffect(() => {
        if (!emailSent || isVerified || timer <= 0) return
        const countdown = setInterval(() => {
            setTimer(prev => {
                if (prev <= 1) clearInterval(countdown)
                return prev - 1
            })
        }, 1000)
        return () => clearInterval(countdown)
    }, [emailSent, isVerified, timer])

    const formatTimer = (seconds: number) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0')
        const s = (seconds % 60).toString().padStart(2, '0')
        return `${m}:${s}`
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setForm(prev => {
            const updated = { ...prev, [name]: value }
            if (name === 'loginPwd' || name === 'loginPwdConfirm') {
                setPasswordMismatch(updated.loginPwd !== updated.loginPwdConfirm)
            }
            return updated
        })
    }

    const handleEmailAuth = async () => {
        if (!form.userEmail) {
            setError('이메일을 입력해주세요.')
            return
        }

        setIsSendingEmail(true)

        try {
            const res = await fetch(`${BASE_API_URL}/sign/send-auth-email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                body: JSON.stringify({ userEmail: form.userEmail })
            })

            const result = await res.json()

            if (result.status === 'SUCCESS') {
                setInfoModal({
                    open: true,
                    title: '인증 메일 발송',
                    message: '입력한 이메일 주소로 인증 메일이 전송되었습니다.'
                })
                setEmailSent(true)
                setTimer(60*3) // 3분
                setError('')
            } else {
                setError(result.message || '이메일 전송에 실패했습니다.')
            }
        } catch (err) {
            console.error(err)
            setError('서버와 연결할 수 없습니다.')
        } finally {
            setIsSendingEmail(false)
        }
    }

    const handleVerifyAuthCode = async () => {
        if (!authCode || !form.userEmail) {
            setError('이메일과 인증코드를 입력해주세요.')
            return
        }

        try {
            const res = await fetch(`${BASE_API_URL}/sign/verify-email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                body: JSON.stringify({
                    userEmail: form.userEmail,
                    authCode: authCode
                })
            })

            const result = await res.json()

            if (result.status === 'SUCCESS' && result.data?.isVerified) {
                setInfoModal({
                    open: true,
                    title: '이메일 인증 완료',
                    message: '이메일 인증이 성공적으로 완료되었습니다.'
                })
                setIsVerified(true)
                setTimer(0)
                setError('')
            } else {
                setError(result.message || '인증번호가 올바르지 않습니다.')
            }
        } catch (err) {
            console.error(err)
            setError('서버와 연결할 수 없습니다.')
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!isVerified) {
            setError('이메일 인증을 완료해주세요.')
            return
        }

        if (form.loginPwd !== form.loginPwdConfirm) {
            setError('비밀번호가 일치하지 않습니다.')
            return
        }

        const hashedPwd = await hashSHA256(form.loginPwd)
        alert(hashedPwd)

        const payload = {
            loginId: form.loginId,
            loginPwd: hashedPwd,
            userNm: form.userNm,
            userNknm: form.userNknm,
            // gndrCd: form.gndrCd,
            // bhdt: form.bhdt,
            // userCno: form.userCno,
            userEmail: form.userEmail,
            // userCi: 'string'
        }

        try {
            const res = await fetch(`${BASE_API_URL}/sign/sign-up`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                body: JSON.stringify(payload)
            })

            const result = await res.json()

            if (result.status === 'SUCCESS') {
                setInfoModal({
                    open: true,
                    title: '회원가입 완료',
                    message: '가입이 성공적으로 완료되었습니다. 로그인 페이지로 이동합니다.',
                    onClose: () => router.push('/login')
                })
            } else {
                setError(result.message || '회원가입에 실패했습니다.')
            }
        } catch (err) {
            console.error(err)
            setError('서버와 연결할 수 없습니다.')
        }
    }

    const isFormValid =
        form.loginId.trim() !== '' &&
        form.loginPwd.trim() !== '' &&
        form.loginPwdConfirm.trim() !== '' &&
        form.loginPwd === form.loginPwdConfirm &&
        form.userNm.trim() !== '' &&
        form.userEmail.trim() !== '' &&
        isVerified

    return (
        <div className="p-6 max-w-md mx-auto relative">
            <h1 className="text-2xl font-bold mb-6 text-center">회원가입</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                {/* 🔐 로그인 정보 */}
                <section>
                    <h2 className="text-lg font-semibold mb-2 border-b pb-1">로그인 정보</h2>
                    <div className="flex flex-col gap-2 mt-2">
                        <InputField name="loginId" placeholder="아이디" value={form.loginId} onChange={handleChange} required />
                        <InputField name="loginPwd" type="password" placeholder="비밀번호" value={form.loginPwd} onChange={handleChange} required />
                        <InputField name="loginPwdConfirm" type="password" placeholder="비밀번호 확인" value={form.loginPwdConfirm} onChange={handleChange} required />
                        {passwordMismatch && <ErrorMessage message="비밀번호가 일치하지 않습니다." />}
                    </div>
                </section>

                {/* 👤 회원 정보 */}
                <section>
                    <h2 className="text-lg font-semibold mb-2 border-b pb-1">회원 정보</h2>
                    <div className="flex flex-col gap-2 mt-2">
                        <InputField name="userNm" placeholder="이름" value={form.userNm} onChange={handleChange} required />

                        {/* 이메일 인증 */}
                        <div className="flex gap-2 items-center">
                            <div className="flex-1 flex items-center">
                                <InputField
                                    name="userEmail"
                                    placeholder="이메일"
                                    value={form.userEmail}
                                    onChange={handleChange}
                                    required
                                    disabled={isVerified}
                                />
                            </div>
                            <div className="flex items-center h-10">
                                <Button
                                    type="button"
                                    onClick={handleEmailAuth}
                                    disabled={isVerified || isSendingEmail}
                                    className="w-20"
                                >
                                    {emailSent && !isVerified && timer <= 0 ? '재전송' : '인증'}
                                </Button>
                            </div>
                        </div>

                        {/* 인증번호 입력 */}
                        {emailSent && !isVerified && (
                            <div className="flex gap-2 items-center">
                                <div className="flex-1 flex items-center relative">
                                    <InputField
                                        name="authCode"
                                        placeholder="인증번호 입력"
                                        value={authCode}
                                        onChange={(e) => setAuthCode(e.target.value)}
                                    />
                                    {timer > 0 && (
                                        <span className="absolute right-3 text-sm text-gray-400">{formatTimer(timer)}</span>
                                    )}
                                </div>
                                <div className="flex items-center h-10">
                                    <Button type="button" onClick={handleVerifyAuthCode} className="w-20">
                                        확인
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {error && <ErrorMessage message={error} />}
                <Button type="submit" disabled={!isFormValid}>회원가입</Button>
            </form>

            {isSendingEmail && <SpinnerOverlay />}

            {/* 통합 모달 */}
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