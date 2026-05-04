'use client';

import { useState } from 'react';

export default function ProfilePage() {
    // Datos principales
    const [userData, setUserData] = useState({
        firstName: 'Estiven',
        lastName: 'Digital',
        dni: '12.345.678',
        email: 'estiven@dev.com',
        cvu: '0000003100012345678901'
    });

    // Estados para Edición de Perfil
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [tempUserData, setTempUserData] = useState(userData);

    // Estados para Alias
    const [alias, setAlias] = useState('$estiven.pago.casa');
    const [isEditingAlias, setIsEditingAlias] = useState(false);
    const [tempAlias, setTempAlias] = useState(alias);

    const [copyFeedback, setCopyFeedback] = useState<'cvu' | 'alias' | null>(null);

    const handleCopy = async (text: string, type: 'cvu' | 'alias') => {
        await navigator.clipboard.writeText(text);
        setCopyFeedback(type);
        setTimeout(() => setCopyFeedback(null), 2000);
    };

    const saveAlias = () => {
        const aliasRegex = /^\$[a-z0-9]+\.[a-z0-9]+\.[a-z0-9]+$/i;
        if (aliasRegex.test(tempAlias)) {
            setAlias(tempAlias);
            setIsEditingAlias(false);
        } else {
            alert("El alias debe tener el formato $palabra.palabra.palabra");
        }
    };

    // NUEVO: Función para guardar el perfil
    const saveProfile = () => {
        setUserData(tempUserData);
        setIsEditingProfile(false);
    };

    return (
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
            <h1 className="text-3xl font-bold text-gray-800">Mi Perfil</h1>

            {/* --- TARJETA DE DATOS PERSONALES CORREGIDA --- */}
            <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-700">Tus datos</h2>
                    {isEditingProfile ? (
                        <button onClick={saveProfile} className="text-white bg-green-500 px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors">
                            Guardar
                        </button>
                    ) : (
                        <button onClick={() => setIsEditingProfile(true)} className="text-green-500 font-semibold hover:underline">
                            Editar
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <p className="text-sm text-gray-400 mb-1">Email</p>
                        {isEditingProfile ? (
                            <input
                                type="email"
                                value={tempUserData.email}
                                onChange={(e) => setTempUserData({ ...tempUserData, email: e.target.value })}
                                className="w-full p-2 border border-gray-300 rounded focus:border-green-500 outline-none"
                            />
                        ) : (
                            <p className="font-medium">{userData.email}</p>
                        )}
                    </div>
                    <div>
                        <p className="text-sm text-gray-400 mb-1">Nombre</p>
                        {isEditingProfile ? (
                            <input
                                type="text"
                                value={tempUserData.firstName}
                                onChange={(e) => setTempUserData({ ...tempUserData, firstName: e.target.value })}
                                className="w-full p-2 border border-gray-300 rounded focus:border-green-500 outline-none"
                            />
                        ) : (
                            <p className="font-medium">{userData.firstName}</p>
                        )}
                    </div>
                    <div>
                        <p className="text-sm text-gray-400 mb-1">Apellido</p>
                        {isEditingProfile ? (
                            <input
                                type="text"
                                value={tempUserData.lastName}
                                onChange={(e) => setTempUserData({ ...tempUserData, lastName: e.target.value })}
                                className="w-full p-2 border border-gray-300 rounded focus:border-green-500 outline-none"
                            />
                        ) : (
                            <p className="font-medium">{userData.lastName}</p>
                        )}
                    </div>
                    <div>
                        <p className="text-sm text-gray-400 mb-1">DNI</p>
                        {isEditingProfile ? (
                            <input
                                type="text"
                                value={tempUserData.dni}
                                onChange={(e) => setTempUserData({ ...tempUserData, dni: e.target.value })}
                                className="w-full p-2 border border-gray-300 rounded focus:border-green-500 outline-none"
                            />
                        ) : (
                            <p className="font-medium">{userData.dni}</p>
                        )}
                    </div>
                </div>
            </section>

            {/* --- TARJETA DE GESTIÓN DE CVU Y ALIAS (Queda igual) --- */}
            <section className="bg-green-500 text-gray-900 p-8 rounded-3xl shadow-lg">
                <h2 className="text-xl font-bold mb-6">Copia tu CVU o alias para recibir transferencias</h2>

                <div className="flex flex-col gap-6">
                    {/* CVU */}
                    <div className="flex justify-between items-center bg-green-400/30 p-4 rounded-xl border border-green-600/20">
                        <div>
                            <p className="text-xs font-bold uppercase opacity-70">CVU</p>
                            <p className="font-mono text-lg">{userData.cvu}</p>
                        </div>
                        <button
                            onClick={() => handleCopy(userData.cvu, 'cvu')}
                            className="p-2 hover:bg-green-600 rounded-lg transition-colors"
                        >
                            {copyFeedback === 'cvu' ? '✅ Copiado' : '📋 Copiar'}
                        </button>
                    </div>

                    {/* Alias */}
                    <div className="flex justify-between items-center bg-green-400/30 p-4 rounded-xl border border-green-600/20">
                        <div className="flex-1">
                            <p className="text-xs font-bold uppercase opacity-70">Alias</p>
                            {isEditingAlias ? (
                                <input
                                    value={tempAlias}
                                    onChange={(e) => setTempAlias(e.target.value)}
                                    className="bg-white/90 p-1 rounded border-none w-full max-w-xs mt-1"
                                />
                            ) : (
                                <p className="text-lg font-bold">{alias}</p>
                            )}
                        </div>
                        <div className="flex gap-2">
                            {isEditingAlias ? (
                                <button onClick={saveAlias} className="text-xs font-bold bg-gray-900 text-white px-3 py-2 rounded-lg">Guardar</button>
                            ) : (
                                <>
                                    <button onClick={() => setIsEditingAlias(true)} className="p-2 hover:bg-green-600 rounded-lg">✏️</button>
                                    <button
                                        onClick={() => handleCopy(alias, 'alias')}
                                        className="p-2 hover:bg-green-600 rounded-lg transition-colors"
                                    >
                                        {copyFeedback === 'alias' ? '✅ Copiado' : '📋 Copiar'}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}