'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import InputField from '@/components/InputField'
// import RadioGroup from '@/components/RadioGroup'
import ErrorMessage from '@/components/ErrorMessage'
import Button from '@/components/Button'
import { BASE_API_URL } from '@/lib/api'

export default function SignUpPage() {
    const router = useRouter()

    const [form, setForm] = useState({
        loginId: '',
        loginPwd: '',
        loginPwdConfirm: '',
        userNm: '',
        // userNknm: '',
        // gndrCd: '',
        // bhdt: '',
        // userCno: '',
        userEmail: ''
    })

    const [error, setError] = useState('')
    const [emailSent, setEmailSent] = useState(false)
    const [authCode, setAuthCode] = useState('')
    const [isVerified, setIsVerified] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
    }

    const handleEmailAuth = async () => {
        if (!form.userEmail) {
            setError('이메일을 입력해주세요.')
            return
        }

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
                alert('인증 이메일이 전송되었습니다.')
                setEmailSent(true)
                setError('')
            } else {
                setError(result.message || '이메일 전송에 실패했습니다.')
            }
        } catch (err) {
            console.error(err)
            setError('서버와 연결할 수 없습니다.')
        }
    }

    // 인증코드 확인 핸들러
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

            if (result.status === 'SUCCESS' && result.data.isVerified) {
                alert('이메일 인증이 완료되었습니다.')
                setIsVerified(true)
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

        if (form.loginPwd !== form.loginPwdConfirm) {
            setError('비밀번호가 일치하지 않습니다.')
            return
        }

        const payload = {
            loginId: form.loginId,
            loginPwd: form.loginPwd,
            userNm: form.userNm,
            // userNknm: form.userNknm,
            // bhdt: form.bhdt,
            // gndrCd: form.gndrCd,
            // userCno: form.userCno,
            userEmail: form.userEmail,
            userCi: 'string'
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
                alert('회원가입이 완료되었습니다.')
                router.push('/login')
            } else {
                setError(result.message || '회원가입에 실패했습니다.')
            }
        } catch (err) {
            console.error(err)
            setError('서버와 연결할 수 없습니다.')
        }
    }

    return (
        <div className="p-6 max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-center">회원가입</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                {/* 로그인 정보 구역 */}
                <section>
                    <h2 className="text-lg font-semibold mb-2 border-b pb-1">로그인 정보</h2>
                    <div className="flex flex-col gap-2 mt-2">
                        <InputField name="loginId" placeholder="아이디" value={form.loginId} onChange={handleChange} required />
                        <InputField name="loginPwd" type="password" placeholder="비밀번호" value={form.loginPwd} onChange={handleChange} required />
                        <InputField name="loginPwdConfirm" type="password" placeholder="비밀번호 확인" value={form.loginPwdConfirm} onChange={handleChange} required />
                    </div>
                </section>

                {/* 회원 정보 구역 */}
                <section>
                    <h2 className="text-lg font-semibold mb-2 border-b pb-1">회원 정보</h2>
                    <div className="flex flex-col gap-2 mt-2">
                        <InputField name="userNm" placeholder="이름" value={form.userNm} onChange={handleChange} required />

                        {/* 이메일 입력 + 인증버튼 */}
                        <div className="flex gap-2">
                            <input
                                name="userEmail"
                                placeholder="이메일"
                                value={form.userEmail}
                                onChange={handleChange}
                                required
                                className="flex-1 px-3 py-2 border border-gray-300 rounded"
                                disabled={isVerified}
                            />
                            <Button type="button" onClick={handleEmailAuth} disabled={isVerified}>인증</Button>
                        </div>

                        {/* 인증번호 입력 + 확인 버튼 */}
                        {emailSent && !isVerified && (
                            <div className="flex gap-2">
                                <input
                                    name="authCode"
                                    placeholder="인증번호 입력"
                                    value={authCode}
                                    onChange={(e) => setAuthCode(e.target.value)}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded"
                                />
                                <Button type="button" onClick={handleVerifyAuthCode}>확인</Button>
                            </div>
                        )}
                    </div>
                </section>

                {error && <ErrorMessage message={error} />}
                <Button type="submit">회원가입</Button>
            </form>
        </div>
    )
}