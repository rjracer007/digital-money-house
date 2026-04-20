'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
    const router = useRouter();

    // Estados para el formulario
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');

        // 1. Validar que no haya campos vacíos
        if (Object.values(formData).some(value => value.trim() === '')) {
            setErrorMsg('Todos los campos son obligatorios.');
            return;
        }

        // 2. Validar formato de email simple
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setErrorMsg('Por favor, ingresa un correo electrónico válido.');
            return;
        }

        // 3. Validar longitud de contraseña
        if (formData.password.length < 6) {
            setErrorMsg('La contraseña debe tener al menos 6 caracteres.');
            return;
        }

        // 4. Validar que las contraseñas coincidan
        if (formData.password !== formData.confirmPassword) {
            setErrorMsg('Las contraseñas no coinciden. Verifica e intenta nuevamente.');
            return;
        }

        // TODO: Aquí irá la llamada POST a la Rest API de registro

        // Simulamos un registro exitoso según el requerimiento
        setSuccessMsg('¡Registro exitoso! Redirigiendo al login...');

        setTimeout(() => {
            router.push('/login');
        }, 2000);
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
            <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-lg my-8">
                <h1 className="text-2xl font-bold mb-6 text-center">Crea tu cuenta</h1>

                {/* Mensajes de feedback para el usuario */}
                {errorMsg && (
                    <div className="bg-red-500/20 border border-red-500 text-red-400 p-3 rounded mb-4 text-sm text-center">
                        {errorMsg}
                    </div>
                )}
                {successMsg && (
                    <div className="bg-green-500/20 border border-green-500 text-green-400 p-3 rounded mb-4 text-sm text-center">
                        {successMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Agregamos min-w-0 al contenedor */}
                        <div className="flex flex-col gap-2 flex-1 min-w-0">
                            <label htmlFor="firstName" className="text-sm">Nombre</label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                /* Agregamos w-full al input */
                                className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-green-400"
                                placeholder="Tu nombre"
                            />
                        </div>

                        {/* Agregamos min-w-0 al contenedor */}
                        <div className="flex flex-col gap-2 flex-1 min-w-0">
                            <label htmlFor="lastName" className="text-sm">Apellido</label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                /* Agregamos w-full al input */
                                className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-green-400"
                                placeholder="Tu apellido"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="email" className="text-sm">Correo electrónico</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="p-3 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-green-400"
                            placeholder="ejemplo@correo.com"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="password" className="text-sm">Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="p-3 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-green-400"
                            placeholder="Mínimo 6 caracteres"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="confirmPassword" className="text-sm">Confirmar Contraseña</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="p-3 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-green-400"
                            placeholder="Repite tu contraseña"
                        />
                    </div>

                    <button
                        type="submit"
                        className="mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded transition-colors"
                    >
                        Registrarse
                    </button>
                </form>

                <div className="mt-6 text-center text-sm">
                    <span className="text-gray-400">¿Ya tienes cuenta? </span>
                    <Link href="/login" className="text-green-400 hover:underline">
                        Inicia sesión
                    </Link>
                </div>
            </div>
        </main>
    );
}