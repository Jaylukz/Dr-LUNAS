import { useState, FormEvent } from 'react';
import { Head, useForm } from '@inertiajs/react';
import '../../../css/login.css';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = (e: FormEvent) => {
        e.preventDefault();
        post('/login');
    };

    const handleGoogleLogin = () => {
        window.location.href = `/api/auth/google/redirect`;
    };

    return (
        <>
            <Head title="Log in - Dr-LUNAS" />
            <div className="login-container">
                <div className="login-card">
                    {/* Left Panel - Branding & Layered Backgrounds */}
                    <div className="login-left-panel">
                        {/* 1. Tagum City Seal */}
                        <img
                            src="/images/Tagum_City_Seal_HD_version.png"
                            alt="Tagum City Seal"
                            className="login-seal-watermark"
                            style={{
                                width: '250px',
                                height: '235px',
                                maxWidth: '100%',
                            }}
                        />

                        {/* 2. Tagum Map Outline */}
                        <img
                            src="/images/Gemini_Generated_Image_xk2291xk2291xk22-removebg-preview.png"
                            alt="Tagum Map Outline"
                            className="login-map-bg"
                            style={{
                                width: '379px',
                                height: '501px',
                                maxWidth: '100%',
                            }}
                        />

                        {/* 3. Foreground Text Content */}
                        <div className="login-left-panel-content">
                            <div style={{ width: '100%', textAlign: 'left' }}>
                                <p className="login-brand-subtitle-top">
                                    Tagum City Health Office
                                </p>
                                <div className="login-brand">
                                    <div className="login-brand-icon">
                                        <svg
                                            style={{
                                                width: '24px',
                                                height: '24px',
                                                color: '#ffffff',
                                            }}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L5.6 15.12a2 2 0 01-1.183-1.84V5.059a2 2 0 011.183-1.84l2.383-.477a6 6 0 013.86.517l.318.158a6 6 0 003.86.517l2.387-.477a2 2 0 011.022.547"
                                            />
                                        </svg>
                                    </div>
                                    <h1 className="login-brand-title">
                                        Dr-LUNAS
                                    </h1>
                                </div>
                            </div>

                            <div style={{ width: '100%', textAlign: 'center' }}>
                                <p className="login-brand-tagline">
                                    Providing quality healthcare to every
                                    Tagumenyo.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel - Form */}
                    <div className="login-right-panel">
                        <div className="login-header">
                            <h2 className="login-title">Welcome to Dr-LUNAS</h2>
                            <p className="login-subtitle">
                                Secure access for authorized Tagum City health
                                personnel.
                            </p>
                        </div>

                        <form onSubmit={handleLogin} className="login-form">
                            {/* Email Address - Facebook Floating Label */}
                            <div className="form-group">
                                <div className="floating-group">
                                    <span className="floating-icon">
                                        <svg
                                            style={{
                                                width: '20px',
                                                height: '20px',
                                            }}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                            />
                                        </svg>
                                    </span>
                                    <input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData('email', e.target.value)
                                        }
                                        placeholder=" "
                                        className="floating-input"
                                        autoComplete="off"
                                        required
                                    />
                                    <label
                                        htmlFor="email"
                                        className="floating-label"
                                    >
                                        Email or mobile number
                                    </label>
                                </div>
                                {errors.email && (
                                    <p
                                        style={{
                                            fontSize: '12px',
                                            color: '#dc2626',
                                            marginTop: '4px',
                                        }}
                                    >
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Password - Facebook Floating Label */}
                            <div className="form-group">
                                <div className="floating-group">
                                    <span className="floating-icon">
                                        <svg
                                            style={{
                                                width: '20px',
                                                height: '20px',
                                            }}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                            />
                                        </svg>
                                    </span>
                                    <input
                                        id="password"
                                        type={
                                            showPassword ? 'text' : 'password'
                                        }
                                        value={data.password}
                                        onChange={(e) =>
                                            setData('password', e.target.value)
                                        }
                                        placeholder=" "
                                        className="floating-input"
                                        style={{ paddingRight: '42px' }}
                                        autoComplete="current-password"
                                        required
                                    />
                                    <label
                                        htmlFor="password"
                                        className="floating-label"
                                    >
                                        Password
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="form-toggle-password"
                                    >
                                        {showPassword ? (
                                            <svg
                                                style={{
                                                    width: '20px',
                                                    height: '20px',
                                                }}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0z"
                                                />
                                            </svg>
                                        ) : (
                                            <svg
                                                style={{
                                                    width: '20px',
                                                    height: '20px',
                                                }}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p
                                        style={{
                                            fontSize: '12px',
                                            color: '#dc2626',
                                            marginTop: '4px',
                                        }}
                                    >
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            <div className="form-footer">
                                <label className="form-checkbox-wrapper">
                                    <input
                                        type="checkbox"
                                        checked={data.remember}
                                        onChange={(e) =>
                                            setData(
                                                'remember',
                                                e.target.checked,
                                            )
                                        }
                                        className="form-checkbox"
                                    />
                                    <span className="form-checkbox-label">
                                        Remember me
                                    </span>
                                </label>
                                <a
                                    href="/forgot-password"
                                    className="form-forgot-link"
                                >
                                    Forgot password?
                                </a>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="btn-signin"
                            >
                                {processing ? 'Signing in...' : 'Sign in'}
                            </button>

                            <div className="form-divider">
                                <div className="form-divider-line">
                                    <div></div>
                                </div>
                                <div className="form-divider-text">
                                    <span>or continue with</span>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handleGoogleLogin}
                                className="btn-google"
                            >
                                <svg
                                    style={{
                                        width: '20px',
                                        height: '20px',
                                        flexShrink: 0,
                                    }}
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        fill="#4285F4"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="#34A853"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="#FBBC04"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                                    />
                                    <path
                                        fill="#EA4335"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                                    />
                                </svg>
                                <span>Sign in with Google</span>
                            </button>
                        </form>

                        <p className="login-footer-text">
                            Protected system — Authorized personnel only.{' '}
                            <a href="/help" className="login-footer-link">
                                Need help?
                            </a>
                        </p>
                    </div>
                </div>

                <div className="login-copyright">
                    © 2026 Tagum City Health Office. All rights reserved. ·{' '}
                    <a href="/privacy">Privacy Policy</a>
                </div>
            </div>
        </>
    );
}

Login.layout = (page: React.ReactNode) => page;
