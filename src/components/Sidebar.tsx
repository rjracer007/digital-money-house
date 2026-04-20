'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export const Sidebar = () => {
    const pathname = usePathname();
    const router = useRouter();

    const menuItems = [
        { name: 'Inicio', href: '/home' },
        { name: 'Actividad', href: '/activity' },
        { name: 'Pago de servicios', href: '/services' },
        { name: 'Mi perfil', href: '/profile' },
        { name: 'Tarjetas', href: '/cards' },
        { name: 'Ingresar dinero', href: '/ingresar' },

    ];

    const handleLogout = () => {
        localStorage.removeItem('dmh_token');
        router.push('/');
    };

    return (
        <aside className="w-64 bg-green-500 min-h-screen flex flex-col text-gray-900">
            {/* Cabecera del Sidebar con info del usuario */}
            <div className="p-8 border-b border-green-600">
                <p className="text-sm font-medium opacity-80">Hola,</p>
                <p className="text-xl font-bold">Estiven</p>
            </div>

            {/* Navegación */}
            <nav className="flex-1 px-4 py-6 flex flex-col gap-2">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`px-4 py-3 rounded-lg font-semibold transition-colors ${isActive
                                ? 'bg-gray-900 text-green-400'
                                : 'hover:bg-green-600'
                                }`}
                        >
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            {/* Botón de Cerrar Sesión */}
            <div className="p-4 border-t border-green-600">
                <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 font-semibold hover:bg-green-600 rounded-lg transition-colors"
                >
                    Cerrar sesión
                </button>
            </div>
        </aside>
    );
};