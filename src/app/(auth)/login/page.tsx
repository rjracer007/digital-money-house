'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
    const router = useRouter();

    // Estados para manejar los dos pasos y los datos
    const [step, setStep] = useState<1 | 2>(1);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    // Paso 1: Validación del Email
    const handleEmailSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!email.trim()) {
            setErrorMsg('El correo electrónico es requerido.');
            return;
        }

        // Aquí puedes agregar una validación de formato Regex si lo deseas
        setErrorMsg('');
        setStep(2); // Avanzamos a la pantalla de contraseña
    };

    // Paso 2: Validación de la Contraseña y Login
    const handlePasswordSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!password.trim()) {
            setErrorMsg('La contraseña es requerida.');
            return;
        }

        setErrorMsg('');

        // TODO: Aquí irá la llamada POST a tu Rest API
        // Simulamos un login exitoso
        const fakeToken = "abc.123.xyz";

        // Guardamos el token para mantener la sesión al recargar
        localStorage.setItem('dmh_token', fakeToken);

        // Redirigimos al home tras loguearse correctamente
        router.push('/home');
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
            <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold mb-6 text-center">¡Hola! Ingresa tus datos</h1>

                {/* Mostrar mensajes de error acordes */}
                {errorMsg && (
                    <div className="bg-red-500/20 text-red-400 p-3 rounded mb-4 text-sm text-center">
                        {errorMsg}
                    </div>
                )}

                {step === 1 ? (
                    <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="email" className="text-sm">Correo electrónico</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="p-3 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-green-400"
                                placeholder="ejemplo@correo.com"
                            />
                        </div>
                        <button
                            type="submit"
                            className="mt-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded transition-colors"
                        >
                            Continuar
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="password" className="text-sm">Contraseña para {email}</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="p-3 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-green-400"
                                placeholder="********"
                            />
                        </div>
                        <div className="flex gap-2 mt-2">
                            <button
                                type="button"
                                onClick={() => { setStep(1); setErrorMsg(''); }}
                                className="flex-1 bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 rounded transition-colors"
                            >
                                Volver
                            </button>
                            <button
                                type="submit"
                                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded transition-colors"
                            >
                                Ingresar
                            </button>
                        </div>
                    </form>
                )}

                {/* Enlace a la pantalla de Registro */}
                <div className="mt-6 text-center text-sm">
                    <span className="text-gray-400">¿No tienes cuenta? </span>
                    <Link href="/register" className="text-green-400 hover:underline">
                        Regístrate aquí
                    </Link>
                </div>
            </div>
        </main>
    );
}