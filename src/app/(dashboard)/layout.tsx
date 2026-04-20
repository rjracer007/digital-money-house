import { Sidebar } from '@/components/Sidebar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar persistente */}
            <Sidebar />

            {/* Contenido dinámico */}
            <main className="flex-1 flex flex-col">

                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}