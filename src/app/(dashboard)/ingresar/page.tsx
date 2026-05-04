'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';

// Mock de tarjetas (En el futuro esto vendrá de un fetch a la Rest API)
const MOCK_CARDS = [
    { id: '1', lastFour: '4567', brand: 'Visa' },
    { id: '2', lastFour: '9876', brand: 'Mastercard' }
];

export default function IngresarDineroPage() {
    // Manejo de pasos: 1 (Selección), 2 (Monto y Tarjeta), 3 (Comprobante), 4 (Transferencia)
    const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

    // Estados para el formulario
    const [selectedCardId, setSelectedCardId] = useState<string>('');
    const [amount, setAmount] = useState<string>('');
    const [errorMsg, setErrorMsg] = useState('');

    // Lógica para procesar el pago
    const handleDeposit = (e: FormEvent) => {
        e.preventDefault();
        setErrorMsg('');

        const numericAmount = parseFloat(amount);

        if (!selectedCardId) {
            setErrorMsg('Por favor, selecciona una tarjeta.');
            return;
        }
        if (isNaN(numericAmount) || numericAmount <= 0) {
            setErrorMsg('El monto debe ser mayor a $0.');
            return;
        }

        // TODO: Aquí iría la llamada POST a la API para fondear la cuenta
        // Simulamos éxito y pasamos al comprobante (Paso 3)
        setStep(3);
    };

    // Estados para el feedback de copiado
    const [copyFeedback, setCopyFeedback] = useState<'cvu' | 'alias' | null>(null);

    // Función para copiar al portapapeles
    const handleCopy = async (text: string, type: 'cvu' | 'alias') => {
        await navigator.clipboard.writeText(text);
        setCopyFeedback(type);
        setTimeout(() => setCopyFeedback(null), 2000);
    };

    const getSelectedCard = () => MOCK_CARDS.find(c => c.id === selectedCardId);

    return (
        <div className="max-w-3xl mx-auto flex flex-col gap-8">
            <h1 className="text-3xl font-bold text-gray-800">Ingresar dinero</h1>

            {/* PASO 1: Selección de Medio de Pago */}
            {step === 1 && (
                <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-4">
                    <h2 className="text-xl font-bold text-gray-700 mb-2">¿Cómo querés ingresar dinero?</h2>

                    <button
                        onClick={() => setStep(4)}
                        className="flex items-center justify-between p-6 rounded-2xl border-2 border-gray-100 hover:border-green-400 hover:bg-green-50 transition-all text-left"
                    >
                        <div className="flex items-center gap-4">
                            <div className="text-2xl">🏦</div>
                            <div>
                                <p className="font-bold text-gray-800">Transferencia bancaria</p>
                                <p className="text-sm text-gray-500">Desde cualquier cuenta con tu CVU o Alias</p>
                            </div>
                        </div>
                        <span className="text-gray-400">→</span>
                    </button>

                    <button
                        onClick={() => setStep(2)}
                        className="flex items-center justify-between p-6 rounded-2xl border-2 border-gray-100 hover:border-green-400 hover:bg-green-50 transition-all text-left"
                    >
                        <div className="flex items-center gap-4">
                            <div className="text-2xl">💳</div>
                            <div>
                                <p className="font-bold text-gray-800">Tarjeta de débito o crédito</p>
                                <p className="text-sm text-gray-500">Usá tus tarjetas asociadas a tu cuenta</p>
                            </div>
                        </div>
                        <span className="text-gray-400">→</span>
                    </button>
                </section>
            )}

            {/* PASO 2: Ingreso por Tarjeta */}
            {step === 2 && (
                <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <button onClick={() => setStep(1)} className="text-sm text-green-500 font-bold mb-6 hover:underline">
                        ← Volver a opciones
                    </button>

                    <h2 className="text-xl font-bold text-gray-700 mb-6">¿Cuánto querés ingresar?</h2>

                    <form onSubmit={handleDeposit} className="flex flex-col gap-6">
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-400">$</span>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                className="w-full p-4 pl-10 text-3xl font-bold text-gray-800 border-b-2 border-gray-200 focus:outline-none focus:border-green-500 bg-transparent"
                                autoFocus
                            />
                        </div>

                        <div className="mt-4">
                            <p className="text-sm font-bold text-gray-600 mb-4">Seleccioná tu tarjeta</p>
                            <div className="flex flex-col gap-3">
                                {MOCK_CARDS.map(card => (
                                    <label key={card.id} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${selectedCardId === card.id ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'}`}>
                                        <input
                                            type="radio"
                                            name="card"
                                            value={card.id}
                                            onChange={(e) => setSelectedCardId(e.target.value)}
                                            className="w-5 h-5 accent-green-500"
                                        />
                                        <span className="font-medium text-gray-800">
                                            {card.brand} terminada en {card.lastFour}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {errorMsg && <p className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-lg">{errorMsg}</p>}

                        <button type="submit" className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl transition-colors text-lg">
                            Continuar
                        </button>
                    </form>
                </section>
            )}

            {/* PASO 3: Comprobante Exitoso */}
            {step === 3 && (
                <section className="bg-green-500 p-8 rounded-3xl shadow-lg text-gray-900 flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-4xl mb-6 shadow-sm">
                        ✅
                    </div>
                    <h2 className="text-2xl font-extrabold mb-2">¡Carga exitosa!</h2>
                    <p className="text-green-900 font-medium mb-8">El dinero ya está disponible en tu cuenta.</p>

                    <div className="bg-white/90 w-full p-6 rounded-2xl flex flex-col gap-4 text-left">
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                            <span className="text-gray-500 text-sm">Monto cargado</span>
                            <span className="font-bold text-lg">${parseFloat(amount).toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                            <span className="text-gray-500 text-sm">Medio de pago</span>
                            <span className="font-bold">{getSelectedCard()?.brand} **** {getSelectedCard()?.lastFour}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500 text-sm">Fecha</span>
                            <span className="font-bold">{new Date().toLocaleDateString('es-AR')}</span>
                        </div>
                    </div>

                    <Link href="/home" className="mt-8 bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 px-8 rounded-xl transition-colors w-full">
                        Ir al inicio
                    </Link>
                </section>
            )}

            {/* PASO 4: Transferencia Externa (CVU) */}
            {step === 4 && (
                <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <button onClick={() => setStep(1)} className="text-sm text-green-500 font-bold mb-6 hover:underline">
                        ← Volver a opciones
                    </button>
                    <h2 className="text-xl font-bold text-gray-700 mb-6">Transferí desde tu banco</h2>
                    <p className="text-gray-600 mb-8">Copiá tu CVU o Alias para transferirte dinero desde otra cuenta bancaria o billetera virtual.</p>

                    <div className="bg-gray-50 p-6 rounded-2xl flex flex-col gap-6">
                        {/* CVU con botón de copiar */}
                        <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                            <div>
                                <p className="text-xs font-bold uppercase text-gray-500 mb-1">Tu CVU</p>
                                <p className="font-mono text-xl text-gray-800 font-medium tracking-wider">0000003100012345678901</p>
                            </div>
                            <button
                                onClick={() => handleCopy('0000003100012345678901', 'cvu')}
                                className="p-3 bg-green-100 hover:bg-green-200 text-green-800 rounded-xl font-bold transition-colors"
                            >
                                {copyFeedback === 'cvu' ? '✅ Copiado' : '📋 Copiar'}
                            </button>
                        </div>

                        {/* Alias con botón de copiar */}
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-xs font-bold uppercase text-gray-500 mb-1">Tu Alias</p>
                                <p className="text-xl text-gray-800 font-bold">$estiven.pago.casa</p>
                            </div>
                            <button
                                onClick={() => handleCopy('$estiven.pago.casa', 'alias')}
                                className="p-3 bg-green-100 hover:bg-green-200 text-green-800 rounded-xl font-bold transition-colors"
                            >
                                {copyFeedback === 'alias' ? '✅ Copiado' : '📋 Copiar'}
                            </button>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}