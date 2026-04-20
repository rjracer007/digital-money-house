'use client';

import { useState, FormEvent } from 'react';

// Tipado estricto para nuestras tarjetas
type CardBrand = 'Visa' | 'Mastercard' | 'AMEX' | 'Desconocida' | '';

interface Card {
    id: string;
    lastFour: string;
    brand: CardBrand;
}

export default function CardsPage() {
    const [cards, setCards] = useState<Card[]>([]);
    const [cardNumber, setCardNumber] = useState('');
    const [detectedBrand, setDetectedBrand] = useState<CardBrand>('');
    const [errorMsg, setErrorMsg] = useState('');

    // Función clave: Detección de marca por primeros dígitos
    const detectBrand = (num: string): CardBrand => {
        if (num.startsWith('4')) return 'Visa';
        if (num.startsWith('5')) return 'Mastercard';
        if (num.startsWith('34') || num.startsWith('37')) return 'AMEX';
        if (num.length >= 4) return 'Desconocida';
        return '';
    };

    // Manejador de input para limpiar caracteres y detectar en tiempo real
    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/\D/g, ''); // Solo permitimos números

        // Limitamos la longitud visual (AMEX 15, Visa/MC 16)
        if (val.length > 16) return;

        setCardNumber(val);
        setDetectedBrand(detectBrand(val));
        setErrorMsg(''); // Limpiamos errores al escribir
    };

    const handleAddCard = (e: FormEvent) => {
        e.preventDefault();

        // Regla 1: Límite de 10 tarjetas
        if (cards.length >= 10) {
            setErrorMsg('Has alcanzado el límite máximo de 10 tarjetas asociadas.');
            return;
        }

        // Regla 2: Longitud mínima aceptable para tarjetas reales
        if (cardNumber.length < 14) {
            setErrorMsg('El número de tarjeta ingresado es inválido.');
            return;
        }

        // Guardamos SOLO los últimos 4 dígitos (Regla de seguridad)
        const newCard: Card = {
            id: Math.random().toString(36).substring(2, 9), // ID temporal
            lastFour: cardNumber.slice(-4),
            brand: detectedBrand || 'Desconocida',
        };

        setCards([...cards, newCard]);
        setCardNumber(''); // Reseteamos el formulario
        setDetectedBrand('');
    };

    const handleDeleteCard = (id: string) => {
        setCards(cards.filter(c => c.id !== id));
    };

    return (
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
            <h1 className="text-3xl font-bold text-gray-800">Tarjetas</h1>

            {/* Formulario de Agregar Tarjeta */}
            <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-700 mb-6">Nueva tarjeta</h2>

                <form onSubmit={handleAddCard} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="cardNumber" className="text-sm font-medium text-gray-600">
                            Número de la tarjeta
                        </label>
                        <div className="relative">
                            <input
                                id="cardNumber"
                                type="text"
                                value={cardNumber}
                                onChange={handleNumberChange}
                                placeholder="0000 0000 0000 0000"
                                className="w-full p-4 pr-12 rounded-xl border border-gray-300 focus:outline-none focus:border-green-500 text-lg tracking-widest"
                                disabled={cards.length >= 10}
                            />
                            {/* Indicador visual de la marca detectada */}
                            {detectedBrand && (
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-sm text-gray-400 bg-gray-100 px-2 py-1 rounded">
                                    {detectedBrand}
                                </div>
                            )}
                        </div>
                    </div>

                    {errorMsg && <p className="text-red-500 text-sm font-medium">{errorMsg}</p>}

                    <button
                        type="submit"
                        disabled={cards.length >= 10 || cardNumber.length < 14}
                        className="mt-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-colors"
                    >
                        Asociar tarjeta
                    </button>
                </form>
            </section>

            {/* Lista de Tarjetas */}
            <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-700 mb-6">Tus tarjetas asociadas</h2>

                {cards.length === 0 ? (
                    <div className="p-8 text-center bg-gray-50 rounded-2xl border border-gray-200">
                        <p className="text-gray-500 font-medium">No tienes tarjetas asociadas</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {cards.map((card) => (
                            <div key={card.id} className="flex justify-between items-center p-4 rounded-2xl border border-gray-200 hover:border-green-300 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-8 bg-gray-900 rounded flex items-center justify-center text-white text-xs font-bold">
                                        {card.brand === 'Visa' ? 'VISA' : card.brand === 'Mastercard' ? 'MC' : card.brand === 'AMEX' ? 'AMX' : '💳'}
                                    </div>
                                    <p className="font-mono text-lg tracking-widest text-gray-700">
                                        **** **** **** {card.lastFour}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleDeleteCard(card.id)}
                                    className="text-red-400 hover:text-red-600 font-semibold text-sm px-4 py-2 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    Eliminar
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}