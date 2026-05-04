'use client';

import { useState, useMemo, FormEvent } from 'react';
import Link from 'next/link';

// --- MOCK DATA ---
const MOCK_SERVICES = [
    { id: '1', name: 'EPM - Agua y Luz', icon: '💧', category: 'Servicios Básicos' },
    { id: '2', name: 'Claro Internet', icon: '🌐', category: 'Telecomunicaciones' },
    { id: '3', name: 'Gas Natural', icon: '🔥', category: 'Servicios Básicos' },
    { id: '4', name: 'Movistar', icon: '📱', category: 'Telecomunicaciones' },
    { id: '5', name: 'DirectTV', icon: '📺', category: 'Entretenimiento' },
    { id: '6', name: 'Netflix', icon: '🍿', category: 'Entretenimiento' },
];

const INITIAL_CARDS = [
    { id: 'c1', lastFour: '4567', brand: 'Visa' },
    { id: 'c2', lastFour: '9876', brand: 'Mastercard' }
];

const USER_BALANCE = 15000.00;

export default function ServicesPage() {
    const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

    // Estados generales
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedService, setSelectedService] = useState<typeof MOCK_SERVICES[0] | null>(null);
    const [accountNumber, setAccountNumber] = useState('');
    const [invoiceAmount, setInvoiceAmount] = useState<number>(0);
    const [errorMsg, setErrorMsg] = useState('');

    // Estados de Pago y Tarjetas (Sprint 4 - Corrección)
    const [cards, setCards] = useState(INITIAL_CARDS);
    const [paymentMethod, setPaymentMethod] = useState<string>('balance');

    // Estados para agregar nueva tarjeta inline
    const [isAddingCard, setIsAddingCard] = useState(false);
    const [newCardNumber, setNewCardNumber] = useState('');

    // --- PASO 1: Filtrado ---
    const filteredServices = useMemo(() => {
        return MOCK_SERVICES.filter(service =>
            service.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

    const handleSelectService = (service: typeof MOCK_SERVICES[0]) => {
        setSelectedService(service);
        setStep(2);
    };

    // --- PASO 2: Buscar Factura (Corrección "Sin Facturas") ---
    const handleSearchInvoice = (e: FormEvent) => {
        e.preventDefault();
        if (accountNumber.length < 6) {
            setErrorMsg('El número de cuenta debe tener al menos 6 dígitos.');
            return;
        }

        // CORRECCIÓN SPRINT 4: Simulamos "Sin facturas" si la cuenta termina en "0"
        if (accountNumber.endsWith('0')) {
            setErrorMsg('No se encontraron facturas pendientes para este número de cuenta.');
            return;
        }

        setErrorMsg('');
        const randomAmount = Math.floor(Math.random() * (12000 - 1000 + 1) + 1000);
        setInvoiceAmount(randomAmount);
        setStep(3);
    };

    // --- NUEVA FUNCIÓN: Agregar tarjeta en el flujo ---
    const handleAddNewCardInline = (e: FormEvent) => {
        e.preventDefault();
        if (newCardNumber.length < 14) {
            setErrorMsg('Número de tarjeta inválido.');
            return;
        }

        // Detectamos la marca por el primer dígito
        let brand = 'Desconocida';
        if (newCardNumber.startsWith('4')) brand = 'Visa';
        else if (newCardNumber.startsWith('5')) brand = 'Mastercard';
        else if (newCardNumber.startsWith('3')) brand = 'AMEX';

        const newCard = {
            id: Math.random().toString(36).substring(2, 9),
            lastFour: newCardNumber.slice(-4),
            brand: brand
        };

        setCards([...cards, newCard]); // Agregamos a la lista
        setPaymentMethod(newCard.id);  // La seleccionamos automáticamente
        setIsAddingCard(false);        // Cerramos el formulario
        setNewCardNumber('');
        setErrorMsg('');
    };

    // --- PASO 3: Pagar Factura ---
    const handlePayInvoice = (e: FormEvent) => {
        e.preventDefault();
        setErrorMsg('');

        if (paymentMethod === 'balance' && invoiceAmount > USER_BALANCE) {
            setErrorMsg('Fondos insuficientes en tu billetera para realizar este pago.');
            return;
        }
        setStep(4);
    };

    return (
        <div className="max-w-4xl mx-auto flex flex-col gap-6">
            <h1 className="text-3xl font-bold text-gray-800">Pago de Servicios</h1>

            {/* --- PASO 1: CATÁLOGO --- */}
            {step === 1 && (
                <section className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-6">
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                        <input
                            type="text"
                            placeholder="Buscá la empresa o servicio..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full p-4 pl-12 rounded-xl border border-gray-300 focus:outline-none focus:border-green-500 shadow-sm"
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {filteredServices.map(service => (
                            <button
                                key={service.id}
                                onClick={() => handleSelectService(service)}
                                className="flex items-center gap-4 p-4 rounded-2xl border-2 border-gray-100 hover:border-green-400 hover:bg-green-50 transition-all text-left group"
                            >
                                <div className="text-2xl">{service.icon}</div>
                                <div>
                                    <p className="font-bold text-gray-800">{service.name}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </section>
            )}

            {/* --- PASO 2: NÚMERO DE CUENTA --- */}
            {step === 2 && (
                <section className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 max-w-xl mx-auto w-full">
                    <button onClick={() => setStep(1)} className="text-sm text-green-500 font-bold mb-6 hover:underline">
                        ← Volver a servicios
                    </button>

                    <h2 className="text-2xl font-bold text-gray-800 mb-6">{selectedService?.icon} {selectedService?.name}</h2>

                    <form onSubmit={handleSearchInvoice} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-gray-600">Número de cuenta (Tip: terminá en 0 para error)</label>
                            <input
                                type="text"
                                value={accountNumber}
                                onChange={(e) => {
                                    setAccountNumber(e.target.value.replace(/\D/g, ''));
                                    setErrorMsg('');
                                }}
                                placeholder="Ej: 1122334"
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

            {/* --- PASO 3: MEDIO DE PAGO --- */}
            {step === 3 && (
                <section className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 max-w-xl mx-auto w-full">
                    <button onClick={() => setStep(2)} className="text-sm text-green-500 font-bold mb-6 hover:underline">
                        ← Volver
                    </button>

                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 mb-6">
                        <p className="text-sm text-gray-500 mb-1">Total a pagar</p>
                        <p className="text-3xl font-extrabold text-gray-900">${invoiceAmount.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</p>
                    </div>

                    <div className="flex flex-col gap-3 mb-6">
                        <p className="text-sm font-bold text-gray-600">Elegí cómo pagar</p>

                        {/* Opciones de pago (Saldo y Tarjetas guardadas) */}
                        <label className={`flex justify-between items-center p-4 rounded-xl border-2 cursor-pointer transition-colors ${paymentMethod === 'balance' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'}`}>
                            <div className="flex items-center gap-3">
                                <input type="radio" value="balance" checked={paymentMethod === 'balance'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-5 h-5 accent-green-500" />
                                <span className="font-bold text-gray-800">Dinero en cuenta</span>
                            </div>
                            <span className="text-sm font-medium text-gray-500">${USER_BALANCE.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
                        </label>

                        {cards.map(card => (
                            <label key={card.id} className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${paymentMethod === card.id ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'}`}>
                                <input type="radio" value={card.id} checked={paymentMethod === card.id} onChange={(e) => setPaymentMethod(e.target.value)} className="w-5 h-5 accent-green-500" />
                                <span className="font-bold text-gray-800">{card.brand} terminada en {card.lastFour}</span>
                            </label>
                        ))}

                        {/* CORRECCIÓN SPRINT 4: Botón para agregar tarjeta inline */}
                        {!isAddingCard ? (
                            <button
                                onClick={() => setIsAddingCard(true)}
                                className="flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-gray-300 text-gray-500 font-bold hover:border-green-500 hover:text-green-600 transition-colors"
                            >
                                <span>➕</span> Agregar nueva tarjeta
                            </button>
                        ) : (
                            <div className="p-4 border-2 border-green-200 bg-green-50 rounded-xl flex flex-col gap-3">
                                <input
                                    type="text"
                                    placeholder="Número de tarjeta (16 dígitos)"
                                    value={newCardNumber}
                                    onChange={(e) => setNewCardNumber(e.target.value.replace(/\D/g, ''))}
                                    className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:border-green-500"
                                    maxLength={16}
                                />
                                <div className="flex gap-2">
                                    <button onClick={handleAddNewCardInline} className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-lg">Agregar</button>
                                    <button onClick={() => setIsAddingCard(false)} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 rounded-lg">Cancelar</button>
                                </div>
                            </div>
                        )}
                    </div>

                    {errorMsg && <p className="text-red-500 text-sm font-medium bg-red-50 p-4 rounded-xl border border-red-200 mb-4">❌ {errorMsg}</p>}

                    <button onClick={handlePayInvoice} className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 rounded-xl transition-colors">
                        Confirmar pago
                    </button>
                </section>
            )}

            {/* --- PASO 4: COMPROBANTE --- */}
            {step === 4 && (
                <section className="bg-green-500 p-8 rounded-3xl shadow-lg text-gray-900 flex flex-col items-center text-center max-w-xl mx-auto w-full">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl mb-4 shadow-sm">✅</div>
                    <h2 className="text-2xl font-extrabold mb-8">¡Pago realizado!</h2>
                    <div className="bg-white/95 w-full p-6 rounded-2xl flex flex-col gap-4 text-left">
                        <div className="flex justify-between border-b border-gray-200 pb-3">
                            <span className="text-gray-500 text-sm">Servicio</span>
                            <span className="font-bold text-gray-800">{selectedService?.name}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-200 pb-3">
                            <span className="text-gray-500 text-sm">Nº de Cuenta</span>
                            <span className="font-bold text-gray-800">{accountNumber}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2">
                            <span className="text-gray-500 font-bold">Total pagado</span>
                            <span className="font-black text-2xl text-green-600">${invoiceAmount.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
                        </div>
                    </div>
                    <Link href="/home" className="mt-8 bg-gray-900 text-white font-bold py-4 px-8 rounded-xl w-full">Volver al inicio</Link>
                </section>
            )}
        </div>
    );
}