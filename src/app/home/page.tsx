'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function HomePage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Verificamos si existe el token en el Local Storage
        const token = localStorage.getItem('dmh_token');

        if (!token) {
            // Si no hay token (no está logueado), lo expulsamos al login
            router.push('/login');
        } else {
            // Si hay token, dejamos de mostrar el estado de carga
            setIsLoading(false);
        }
    }, [router]);

    const handleLogout = () => {
        // 1. Eliminamos el token del Local Storage (Requerimiento Sprint 1)
        localStorage.removeItem('dmh_token');

        // 2. Redirigimos a la página promocional / Landing (Requerimiento Sprint 1)
        router.push('/');
    };

    // Evitamos destellos extraños (hydration mismatch) mientras verificamos la sesión
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-gray-500 font-bold animate-pulse">Cargando tu billetera...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Navbar del Dashboard */}
            <header className="bg-gray-900 text-white py-4 px-6 flex justify-between items-center">
                <div className="text-xl font-bold text-green-400">Digital Money House</div>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-300 hidden sm:block">
                        Hola, Usuario
                    </span>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 rounded border border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors text-sm font-semibold"
                    >
                        Cerrar sesión
                    </button>
                </div>
            </header>

            {/* Contenido principal (Esqueleto para futuros Sprints) */}
            <main className="flex-1 p-6 max-w-6xl mx-auto w-full">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Inicio</h1>

                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-700 mb-2">Bienvenido a tu panel de control</h2>
                    <p className="text-gray-500 mb-4">
                        Aquí podrás ver tu saldo disponible, pagar servicios y revisar tu actividad reciente (Sprint 3 y 4).
                    </p>
                    <div className="p-6 bg-green-50 rounded-lg border border-green-100 text-center">
                        <span className="block text-sm text-green-800 font-medium mb-1">Saldo disponible</span>
                        <span className="text-4xl font-extrabold text-green-600">$ 0,00</span>
                    </div>
                </div>
            </main>
        </div>
    );
}