import Link from 'next/link';
import Image from 'next/image';

// Simulamos la llamada a la base de datos/API
async function getLandingData() {
  // Usamos localhost para desarrollo, o la URL de Vercel en producción
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  try {
    // fetch a nuestra propia API simulada
    const res = await fetch(`${apiUrl}/api/landing`, {
      cache: 'no-store' // Obligamos a que siempre consulte la API, demostrando que es dinámico
    });

    if (!res.ok) {
      throw new Error('Error en la respuesta de la API');
    }

    return res.json();
  } catch (error) {
    console.error("Error al obtener datos:", error);
    // Retorno de seguridad (Fallback) por si la API falla
    return {
      hero: { title: "Digital Money House", description: "Cargando...", imageUrl: "" },
      features: []
    };
  }
}

export default async function LandingPage() {
  const data = await getLandingData();

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header / Nav */}
      <header className="bg-gray-900 text-white py-4 px-6 flex justify-between items-center sticky top-0 z-50">
        <div className="text-xl font-bold text-green-400">Digital Money House</div>
        <nav className="flex gap-4">
          <Link href="/login" className="px-4 py-2 rounded border border-green-500 text-green-500 hover:bg-green-500 hover:text-white transition-colors text-sm font-semibold">
            Iniciar sesión
          </Link>
          <Link href="/register" className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600 transition-colors text-sm font-semibold">
            Crear cuenta
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={data.hero.imageUrl}
            alt="DMH Billetera"
            className="w-full h-full object-cover brightness-50"
          />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">
            {data.hero.title}
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            {data.hero.description}
          </p>
          <Link href="/register" className="bg-green-500 text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-green-600 transition-transform hover:scale-105 inline-block">
            Empezar ahora
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Tus finanzas, simplificadas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {data.features.map((feature, index) => (
              <div key={index} className="p-8 border border-gray-100 rounded-2xl bg-gray-50 hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer simple */}
      <footer className="mt-auto bg-gray-100 py-8 px-6 text-center text-gray-500 text-sm">
        © 2026 Digital Money House. Todos los derechos reservados.
      </footer>
    </main>
  );
}