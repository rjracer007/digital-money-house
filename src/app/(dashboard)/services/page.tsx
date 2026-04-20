'use client';

import { useState, useMemo, FormEvent } from 'react';
import Link from 'next/link';

// --- MOCK DATA (Simulación de Base de Datos) ---
const MOCK_SERVICES = [
    { id: '1', name: 'EPM - Agua y Luz', icon: '💧', category: 'Servicios Básicos' },
    { id: '2', name: 'Claro Internet', icon: '🌐', category: 'Telecomunicaciones' },
    { id: '3', name: 'Gas Natural', icon: '🔥', category: 'Servicios Básicos' },
    { id: '4', name: 'Movistar', icon: '📱', category: 'Telecomunicaciones' },
    { id: '5', name: 'DirectTV', icon: '📺', category: 'Entretenimiento' },
    { id: '6', name: 'Netflix', icon: '🍿', category: 'Entretenimiento' },
    { id: '7', name: 'Autopistas', icon: '🚗', category: 'Peajes' },
    { id: '8', name: 'Impuestos AFIP', icon: '🏛️', category: 'Gubernamental' },
];

const MOCK_CARDS = [
    { id: 'c1', lastFour: '4567', brand: 'Visa' },
    { id: 'c2', lastFour: '9876', brand: 'Mastercard' }
];

const USER_BALANCE = 15000.00; // Saldo disponible simulado para la validación

export default function ServicesPage() {
    // --- ESTADOS DE LA MÁQUINA (State Machine) ---
    const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

    // Estados de datos
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedService, setSelectedService] = useState<typeof MOCK_SERVICES[0] | null>(null);
    const [accountNumber, setAccountNumber] = useState('');
    const [invoiceAmount, setInvoiceAmount] = useState<number>(0);
    const [paymentMethod, setPaymentMethod] = useState<string>('balance'); // 'balance' o id de tarjeta
    const [errorMsg, setErrorMsg] = useState('');

    // --- PASO 1: Filtrado de Servicios en tiempo real ---
    const filteredServices = useMemo(() => {
        return MOCK_SERVICES.filter(service =>
            service.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

    const handleSelectService = (service: typeof MOCK_SERVICES[0]) => {
        setSelectedService(service);
        setStep(2);
    };

    // --- PASO 2: Buscar Factura ---
    const handleSearchInvoice = (e: FormEvent) => {
        e.preventDefault();
        if (accountNumber.length < 6) {
            setErrorMsg('El número de cuenta debe tener al menos 6 dígitos.');
            return;
        }
        setErrorMsg('');

        // Simulamos que encontramos una factura pendiente con un valor aleatorio entre $1000 y $20000
        const randomAmount = Math.floor(Math.random() * (20000 - 1000 + 1) + 1000);
        setInvoiceAmount(randomAmount);
        setStep(3);
    };

    // --- PASO 3: Pagar Factura ---
    const handlePayInvoice = (e: FormEvent) => {
        e.preventDefault();
        setErrorMsg('');

        // Validación de fondos requerida por el Sprint 4
        if (paymentMethod === 'balance' && invoiceAmount > USER_BALANCE) {
            setErrorMsg('Fondos insuficientes en tu billetera para realizar este pago.');
            return;
        }

        // TODO: Aquí iría la petición a la API (/account) para asentar el pago

        // Si pasa las validaciones, vamos al comprobante
        setStep(4);
    };

    return (
        <div className="max-w-4xl mx-auto flex flex-col gap-6">
            <h1 className="text-3xl font-bold text-gray-800">Pago de Servicios</h1>

            {/* --- PASO 1: CATÁLOGO DE SERVICIOS --- */}
            {step === 1 && (
                <section className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-6">
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                        <input
                            type="text"
                            placeholder="Buscá la empresa o servicio..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full p-4 pl-12 rounded-xl border border-gray-300 focus:outline-none focus:border-green-500 text-lg shadow-sm"
                        />
                    </div>

                    {filteredServices.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            No encontramos servicios que coincidan con tu búsqueda.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {filteredServices.map(service => (
                                <button
                                    key={service.id}
                                    onClick={() => handleSelectService(service)}
                                    className="flex items-center gap-4 p-4 rounded-2xl border-2 border-gray-100 hover:border-green-400 hover:bg-green-50 transition-all text-left group"
                                >
                                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-2xl group-hover:bg-white group-hover:shadow-sm transition-all">
                                        {service.icon}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-800 leading-tight">{service.name}</p>
                                        <p className="text-xs text-gray-500">{service.category}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </section>
            )}

            {/* --- PASO 2: NÚMERO DE CUENTA --- */}
            {step === 2 && (
                <section className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 max-w-xl mx-auto w-full">
                    <button onClick={() => setStep(1)} className="text-sm text-green-500 font-bold mb-6 hover:underline flex items-center gap-1">
                        ← Volver a servicios
                    </button>

                    <div className="flex items-center gap-4 mb-8">
                        <div className="text-4xl">{selectedService?.icon}</div>
                        <h2 className="text-2xl font-bold text-gray-800">{selectedService?.name}</h2>
                    </div>

                    <form onSubmit={handleSearchInvoice} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-gray-600">Número de cuenta o medidor</label>
                            <input
                                type="text"
                                value={accountNumber}
                                onChange={(e) => {
                                    setAccountNumber(e.target.value);
                                    setErrorMsg('');
                                }}
                                placeholder="Ej: 11223344"
                                className="w-full p-4 rounded-xl border border-gray-300 focus:outline-none focus:border-green-500 text-lg"
                                autoFocus
                            />
                        </div>

                        {errorMsg && <p className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-lg border border-red-100">{errorMsg}</p>}

                        <button type="submit" className="mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl transition-colors">
                            Buscar factura
                        </button>
                    </form>
                </section>
            )}

            {/* --- PASO 3: CONFIRMACIÓN Y MEDIO DE PAGO --- */}
            {step === 3 && (
                <section className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 max-w-xl mx-auto w-full">
                    <button onClick={() => setStep(2)} className="text-sm text-green-500 font-bold mb-6 hover:underline flex items-center gap-1">
                        ← Volver
                    </button>

                    <h2 className="text-xl font-bold text-gray-800 mb-6">Resumen de pago</h2>

                    {/* Tarjeta de la Factura */}
                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 mb-8">
                        <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
                            <span className="font-medium text-gray-600">{selectedService?.name}</span>
                            <span className="text-sm text-gray-400">Nº {accountNumber}</span>
                        </div>
                        <div className="flex justify-between items-end">
                            <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total a pagar</span>
                            <span className="text-3xl font-extrabold text-gray-900">
                                ${invoiceAmount.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                            </span>
                        </div>
                    </div>

                    <form onSubmit={handlePayInvoice} className="flex flex-col gap-6">
                        <div>
                            <p className="text-sm font-bold text-gray-600 mb-3">¿Cómo querés pagar?</p>
                            <div className="flex flex-col gap-3">
                                {/* Opción 1: Saldo */}
                                <label className={`flex justify-between items-center p-4 rounded-xl border-2 cursor-pointer transition-colors ${paymentMethod === 'balance' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'}`}>
                                    <div className="flex items-center gap-3">
                                        <input type="radio" name="payment" value="balance" checked={paymentMethod === 'balance'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-5 h-5 accent-green-500" />
                                        <span className="font-bold text-gray-800">Dinero en cuenta</span>
                                    </div>
                                    <span className="text-sm font-medium text-gray-500">${USER_BALANCE.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
                                </label>

                                {/* Opciones 2+: Tarjetas */}
                                {MOCK_CARDS.map(card => (
                                    <label key={card.id} className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${paymentMethod === card.id ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'}`}>
                                        <input type="radio" name="payment" value={card.id} checked={paymentMethod === card.id} onChange={(e) => setPaymentMethod(e.target.value)} className="w-5 h-5 accent-green-500" />
                                        <span className="font-bold text-gray-800">{card.brand} terminada en {card.lastFour}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {errorMsg && <p className="text-red-500 text-sm font-medium bg-red-50 p-4 rounded-xl border border-red-200">❌ {errorMsg}</p>}

                        <button type="submit" className="mt-2 bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 rounded-xl transition-colors">
                            Confirmar pago
                        </button>
                    </form>
                </section>
            )}

            {/* --- PASO 4: COMPROBANTE DE PAGO EXITOSO --- */}
            {step === 4 && (
                <section className="bg-green-500 p-8 rounded-3xl shadow-lg text-gray-900 flex flex-col items-center text-center max-w-xl mx-auto w-full">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-4xl mb-6 shadow-sm">
                        ✅
                    </div>
                    <h2 className="text-2xl font-extrabold mb-2">¡Pago realizado!</h2>
                    <p className="text-green-900 font-medium mb-8">El pago a {selectedService?.name} se procesó correctamente.</p>

                    <div className="bg-white/95 w-full p-6 rounded-2xl flex flex-col gap-4 text-left shadow-sm">
                        <div className="flex justify-between border-b border-gray-200 pb-3">
                            <span className="text-gray-500 text-sm">Servicio</span>
                            <span className="font-bold text-gray-800">{selectedService?.name}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-200 pb-3">
                            <span className="text-gray-500 text-sm">Nº de Cuenta</span>
                            <span className="font-bold text-gray-800">{accountNumber}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-200 pb-3">
                            <span className="text-gray-500 text-sm">Medio de pago</span>
                            <span className="font-bold text-gray-800">
                                {paymentMethod === 'balance' ? 'Dinero en cuenta' : `Tarjeta ****${MOCK_CARDS.find(c => c.id === paymentMethod)?.lastFour}`}
                            </span>
                        </div>
                        <div className="flex justify-between items-center pt-2">
                            <span className="text-gray-500 font-bold">Total pagado</span>
                            <span className="font-black text-2xl text-green-600">${invoiceAmount.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
                        </div>
                    </div>

                    <Link href="/home" className="mt-8 bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 px-8 rounded-xl transition-colors w-full">
                        Volver al inicio
                    </Link>
                </section>
            )}
        </div>
    );
}