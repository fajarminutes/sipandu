import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../store';
import { useEffect, useState } from 'react';
import { setPageTitle } from '../../store/themeConfigSlice';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import IconMail from '../../components/Icon/IconMail';
import IconLockDots from '../../components/Icon/IconLockDots';

const MySwal = withReactContent(Swal);

const LoginBoxed = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Login Boxed'));
    });
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const submitForm = async (e: React.FormEvent) => {
        e.preventDefault();
    
        console.log({ username, password }); // Log data yang dikirim
    
        if (!username || !password) {
            MySwal.fire({
                title: 'Kesalahan',
                text: 'Username dan kata sandi harus diisi!',
                icon: 'error',
                confirmButtonText: 'OK',
            });
            return;
        }
    
        try {
            const response = await fetch('https://sipandu.sinarjernihsuksesindo.biz.id/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
    
            const result = await response.json();
            console.log("Response:", result); // Log respons backend
    
            if (response.ok) {
                MySwal.fire({
                    title: 'Berhasil',
                    text: 'Login berhasil, selamat datang!',
                    icon: 'success',
                    confirmButtonText: 'OK',
                }).then(() => {
                    localStorage.setItem('access_token', result.access_token);
                    navigate('/');
                });
            } else {
                MySwal.fire({
                    title: 'Gagal',
                    text: result.error || 'Username atau kata sandi salah.',
                    icon: 'error',
                    confirmButtonText: 'Coba Lagi',
                });
            }
        } catch (error) {
            console.error("Error:", error); // Log error jika ada
            MySwal.fire({
                title: 'Kesalahan',
                text: 'Terjadi kesalahan pada server. Silakan coba lagi nanti.',
                icon: 'error',
                confirmButtonText: 'OK',
            });
        }
    };
    

    return (
        <div>
            <div className="absolute inset-0">
                <img src="/assets/images/auth/bg-gradient.png" alt="image" className="h-full w-full object-cover" />
            </div>

            <div className="relative flex min-h-screen items-center justify-center bg-[url(/assets/images/auth/map.png)] bg-cover bg-center bg-no-repeat px-6 py-10 dark:bg-[#060818] sm:px-16">
                <div className="relative w-full max-w-[870px] rounded-md bg-[linear-gradient(45deg,#fff9f9_0%,rgba(255,255,255,0)_25%,rgba(255,255,255,0)_75%,_#fff9f9_100%)] p-2 dark:bg-[linear-gradient(52.22deg,#0E1726_0%,rgba(14,23,38,0)_18.66%,rgba(14,23,38,0)_51.04%,rgba(14,23,38,0)_80.07%,#0E1726_100%)]">
                    <div className="relative flex flex-col justify-center rounded-md bg-white/60 backdrop-blur-lg dark:bg-black/50 px-6 lg:min-h-[758px] py-20">
                        <div className="mx-auto w-full max-w-[440px]">
                            <div className="mb-10">
                                <h1 className="text-3xl font-extrabold uppercase !leading-snug text-primary md:text-4xl">Sign in</h1>
                                <p className="text-base font-bold leading-normal text-white-dark">Masukkan username dan kata sandi untuk login</p>
                            </div>
                            <form className="space-y-5 dark:text-white" onSubmit={submitForm}>
                                <div>
                                    <label htmlFor="Username">Username</label>
                                    <div className="relative text-white-dark">
                                        <input
                                            id="Username"
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            placeholder="Masukkan Username"
                                            className="form-input ps-10 placeholder:text-white-dark"
                                        />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconMail fill={true} />
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="Password">Password</label>
                                    <div className="relative text-white-dark">
                                        <input
                                            id="Password"
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Masukkan Kata Sandi"
                                            className="form-input ps-10 placeholder:text-white-dark"
                                        />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconLockDots fill={true} />
                                        </span>
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
                                    Login
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginBoxed;
