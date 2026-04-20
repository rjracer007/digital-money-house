'use client';

import { useState, useMemo } from 'react';

// --- GENERADOR DE DATOS SIMULADOS ---
// Función auxiliar para crear fechas relativas a hoy y probar los filtros
const getRelativeDate = (daysAgo: number) => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().split('T')[0];
};

const MOCK_TRANSACTIONS = [
    { id: 'TX001', title: 'Transferencia recibida', amount: 15000.00, date: getRelativeDate(0), type: 'ingreso', destination: 'Cuenta propia', operation: '11223344' },
    { id: 'TX002', title: 'Pago Servicio Luz', amount: -4500.50, date: getRelativeDate(0), type: 'egreso', destination: 'EPM', operation: '55667788' },
    { id: 'TX003', title: 'Carga de saldo', amount: 5000.00, date: getRelativeDate(1), type: 'ingreso', destination: 'Visa **** 4567', operation: '99001122' },
    { id: 'TX004', title: 'Supermercado', amount: -12500.00, date: getRelativeDate(4), type: 'egreso', destination: 'Mercado Local', operation: '33445566' },
    { id: 'TX005', title: 'Netflix', amount: -2500.00, date: getRelativeDate(10), type: 'egreso', destination: 'Netflix Inc', operation: '77889900' },
    { id: 'TX006', title: 'Transferencia recibida', amount: 8000.00, date: getRelativeDate(14), type: 'ingreso', destination: 'Juan Pérez', operation: '12312312' },
    { id: 'TX007', title: 'Pago Internet', amount: -3200.00, date: getRelativeDate(20), type: 'egreso', destination: 'Claro', operation: '45645645' },
    { id: 'TX008', title: 'Sueldo', amount: 85000.00, date: getRelativeDate(25), type: 'ingreso', destination: 'Empresa SA', operation: '78978978' },
    { id: 'TX009', title: 'Cena Restaurante', amount: -6400.00, date: getRelativeDate(40), type: 'egreso', destination: 'Restaurante El Buen Sabor', operation: '32132132' },
    { id: 'TX010', title: 'Transferencia enviada', amount: -1500.00, date: getRelativeDate(60), type: 'egreso', destination: 'María Gómez', operation: '65465465' },
    { id: 'TX011', title: 'Devolución compra', amount: 3500.00, date: getRelativeDate(80), type: 'ingreso', destination: 'Tienda de Ropa', operation: '98798798' },
];

export default function ActivityPage() {
    // --- ESTADOS DE FILTROS Y PAGINACIÓN ---
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all'); // all, ingreso, egreso
    const [filterPeriod, setFilterPeriod] = useState('all'); // all, today, yesterday, week, 15days, month, 3months
    const [currentPage, setCurrentPage] = useState(1);

    // Estado para el modal de detalles
    const [selectedTx, setSelectedTx] = useState<typeof MOCK_TRANSACTIONS[0] | null>(null);

    const ITEMS_PER_PAGE = 10; // Regla de negocio del Sprint 3

    // --- LÓGICA DE FILTRADO (useMemo para rendimiento) ---
    const filteredTransactions = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return MOCK_TRANSACTIONS.filter(tx => {
            // 1. Filtro por Buscador (Título)
            const matchesSearch = tx.title.toLowerCase().includes(searchTerm.toLowerCase());

            // 2. Filtro por Tipo
            const matchesType = filterType === 'all' || tx.type === filterType;

            // 3. Filtro por Período
            let matchesPeriod = true;
            const txDate = new Date(tx.date);
            txDate.setHours(0, 0, 0, 0);
            const diffTime = Math.abs(today.getTime() - txDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (filterPeriod === 'today') matchesPeriod = diffDays === 0;
            else if (filterPeriod === 'yesterday') matchesPeriod = diffDays === 1;
            else if (filterPeriod === 'week') matchesPeriod = diffDays <= 7;
            else if (filterPeriod === '15days') matchesPeriod = diffDays <= 15;
            else if (filterPeriod === 'month') matchesPeriod = diffDays <= 30;
            else if (filterPeriod === '3months') matchesPeriod = diffDays <= 90;

            return matchesSearch && matchesType && matchesPeriod;
        }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Orden default: más nuevo a antiguo
    }, [searchTerm, filterType, filterPeriod]);

    // --- LÓGICA DE PAGINACIÓN ---
    const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
    const paginatedTransactions = filteredTransactions.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const clearFilters = () => {
        setSearchTerm('');
        setFilterType('all');
        setFilterPeriod('all');
        setCurrentPage(1);
    };

    // Resetea a la página 1 cada vez que cambian los filtros
    useMemo(() => { setCurrentPage(1); }, [searchTerm, filterType, filterPeriod]);

    return (
        <div className="max-w-5xl mx-auto flex flex-col gap-6 relative">
            <h1 className="text-3xl font-bold text-gray-800">Tu actividad</h1>

            {/* --- PANEL DE CONTROLES Y FILTROS --- */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col lg:flex-row gap-4 items-end">
                <div className="w-full lg:flex-1 flex flex-col gap-2">
                    <label className="text-sm font-bold text-gray-600">Buscar</label>
                    <input
                        type="text"
                        placeholder="Ej: Netflix, Transferencia..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:border-green-500"
                    />
                </div>

                <div className="w-full lg:w-48 flex flex-col gap-2">
                    <label className="text-sm font-bold text-gray-600">Operación</label>
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:border-green-500 bg-white"
                    >
                        <option value="all">Todas</option>
                        <option value="ingreso">Ingresos</option>
                        <option value="egreso">Egresos</option>
                    </select>
                </div>

                <div className="w-full lg:w-48 flex flex-col gap-2">
                    <label className="text-sm font-bold text-gray-600">Período</label>
                    <select
                        value={filterPeriod}
                        onChange={(e) => setFilterPeriod(e.target.value)}
                        className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:border-green-500 bg-white"
                    >
                        <option value="all">Todos</option>
                        <option value="today">Hoy</option>
                        <option value="yesterday">Ayer</option>
                        <option value="week">Última semana</option>
                        <option value="15days">Últimos 15 días</option>
                        <option value="month">Último mes</option>
                        <option value="3months">Últimos 3 meses</option>
                    </select>
                </div>

                <button
                    onClick={clearFilters}
                    className="w-full lg:w-auto px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors border border-gray-200"
                >
                    Limpiar
                </button>
            </section>

            {/* --- LISTA DE TRANSACCIONES --- */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[400px] flex flex-col">
                {paginatedTransactions.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-gray-400">
                        <span className="text-4xl mb-4">📭</span>
                        <p className="font-medium">No encontramos transacciones con esos filtros.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100 flex-1">
                        {paginatedTransactions.map((tx) => (
                            <button
                                key={tx.id}
                                onClick={() => setSelectedTx(tx)}
                                className="w-full p-4 hover:bg-gray-50 flex justify-between items-center transition-colors text-left"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-sm ${tx.type === 'ingreso' ? 'bg-green-100' : 'bg-red-50'}`}>
                                        {tx.type === 'ingreso' ? '⬇️' : '⬆️'}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-800">{tx.title}</p>
                                        <p className="text-sm text-gray-500">{new Date(tx.date).toLocaleDateString('es-AR')}</p>
                                    </div>
                                </div>
                                <p className={`font-bold text-lg ${tx.type === 'ingreso' ? 'text-green-600' : 'text-gray-800'}`}>
                                    {tx.type === 'ingreso' ? '+' : '-'}${Math.abs(tx.amount).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                                </p>
                            </button>
                        ))}
                    </div>
                )}

                {/* --- PAGINACIÓN --- */}
                {totalPages > 1 && (
                    <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(p => p - 1)}
                            className="px-4 py-2 font-bold text-sm bg-white border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-100 transition-colors"
                        >
                            Anterior
                        </button>
                        <span className="text-sm font-bold text-gray-500">
                            Página {currentPage} de {totalPages}
                        </span>
                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(p => p + 1)}
                            className="px-4 py-2 font-bold text-sm bg-white border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-100 transition-colors"
                        >
                            Siguiente
                        </button>
                    </div>
                )}
            </section>

            {/* --- MODAL DE DETALLE (Overlay) --- */}
            {selectedTx && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-start mb-6">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${selectedTx.type === 'ingreso' ? 'bg-green-100' : 'bg-red-50'}`}>
                                {selectedTx.type === 'ingreso' ? '⬇️' : '⬆️'}
                            </div>
                            <button onClick={() => setSelectedTx(null)} className="text-gray-400 hover:text-gray-800 font-bold text-xl">✕</button>
                        </div>

                        <h2 className="text-2xl font-bold text-gray-800 mb-1">{selectedTx.title}</h2>
                        <p className={`text-3xl font-extrabold mb-6 ${selectedTx.type === 'ingreso' ? 'text-green-600' : 'text-gray-900'}`}>
                            {selectedTx.type === 'ingreso' ? '+' : '-'}${Math.abs(selectedTx.amount).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                        </p>

                        <div className="space-y-4 border-t border-gray-100 pt-6">
                            <div className="flex justify-between">
                                <span className="text-gray-500 text-sm font-medium">Fecha</span>
                                <span className="font-bold text-sm text-gray-800">{new Date(selectedTx.date).toLocaleDateString('es-AR')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500 text-sm font-medium">Medio / Destino</span>
                                <span className="font-bold text-sm text-gray-800">{selectedTx.destination}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500 text-sm font-medium">Nº de Operación</span>
                                <span className="font-bold text-sm text-gray-800">#{selectedTx.operation}</span>
                            </div>
                        </div>

                        <button onClick={() => setSelectedTx(null)} className="mt-8 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition-colors">
                            Cerrar detalle
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}