'use client';

import { useState } from 'react';
import Link from 'next/link';

// Datos simulados (Mock Data) para los últimos 10 movimientos
const MOCK_MOVIMIENTOS = [
    { id: 1, detalle: 'Transferencia recibida', monto: 15000.00, fecha: '2026-04-18', tipo: 'ingreso' },
    { id: 2, detalle: 'Pago Servicio Luz', monto: -4500.50, fecha: '2026-04-17', tipo: 'egreso' },
    { id: 3, detalle: 'Carga de saldo', monto: 2000.00, fecha: '2026-04-15', tipo: 'ingreso' },
    { id: 4, detalle: 'Supermercado central', monto: -8200.00, fecha: '2026-04-14', tipo: 'egreso' },
    // ... añadir más para completar los 10
];

export default function HomePage() {
    const [searchTerm, setSearchTerm] = useState('');
    const saldo = 12450.75; // Saldo simulado

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Buscando:", searchTerm);
        // En el futuro, esto redirigirá a /activity con el filtro
    };

    return (
        <div className="flex flex-col gap-8">
            {/* Sección de Saldo y Accesos */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 bg-gray-900 text-white p-8 rounded-3xl shadow-lg relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-sm font-medium text-gray-400 mb-2">Dinero disponible</h2>
                        <p className="text-4xl md:text-5xl font-bold">
                            ${saldo.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                        </p>
                    </div>
                    {/* Decoración visual */}
                    <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-green-500 rounded-full opacity-10"></div>
                </div>

                <div className="flex flex-col gap-4">
                    <Link href="/home/cvu" className="flex-1 bg-green-500 hover:bg-green-600 text-gray-900 font-bold p-4 rounded-2xl flex items-center justify-center transition-transform hover:scale-105">
                        Ver mi CVU
                    </Link>
                    <Link href="/home/ingresar" className="flex-1 bg-green-500 hover:bg-green-600 text-gray-900 font-bold p-4 rounded-2xl flex items-center justify-center transition-transform hover:scale-105">
                        Ingresar dinero
                    </Link>
                </div>
            </section>

            {/* Buscador de Actividad */}
            <section>
                <form onSubmit={handleSearch} className="relative mb-4">
                    <input
                        type="text"
                        placeholder="Buscar en tu actividad"
                        className="w-full p-4 pl-12 rounded-xl border border-gray-300 focus:outline-none focus:border-green-500 shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                </form>

                {/* Lista de Movimientos */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h3 className="font-bold text-gray-800 text-lg">Tu actividad</h3>
                    </div>

                    <div className="divide-y divide-gray-50">
                        {MOCK_MOVIMIENTOS.map((mov) => (
                            <div key={mov.id} className="p-4 hover:bg-gray-50 flex justify-between items-center transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`w-3 h-3 rounded-full ${mov.tipo === 'ingreso' ? 'bg-green-500' : 'bg-red-400'}`}></div>
                                    <div>
                                        <p className="font-medium text-gray-800">{mov.detalle}</p>
                                        <p className="text-xs text-gray-400">{mov.fecha}</p>
                                    </div>
                                </div>
                                <p className={`font-bold ${mov.tipo === 'ingreso' ? 'text-gray-800' : 'text-gray-400'}`}>
                                    ${Math.abs(mov.monto).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="p-4 bg-gray-50 text-center">
                        <Link href="/activity" className="text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors">
                            Ver toda la actividad →
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}