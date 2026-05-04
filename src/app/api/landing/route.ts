import { NextResponse } from 'next/server';

export async function GET() {
    // Aquí estamos simulando lo que devolvería una base de datos real
    const dbData = {
        hero: {
            title: "De ahora en adelante, hacé más con tu dinero",
            description: "Tu nueva billetera virtual. Rápida, segura y sin comisiones. Manejá tus ahorros, pagá servicios y transferí al instante.",
            imageUrl: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=1000"
        },
        features: [
            {
                title: "Transferencias inmediatas",
                desc: "Enviá y recibí dinero de cualquier cuenta bancaria o virtual en segundos.",
                icon: "💸"
            },
            {
                title: "Pago de servicios",
                desc: "Pagá luz, gas, internet y más desde la comodidad de tu casa.",
                icon: "🧾"
            }
        ]
    };

    return NextResponse.json(dbData);
}