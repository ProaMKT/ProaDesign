
import { Header } from '@/components/Header';
import { PrintForgeForm } from '@/components/PrintForgeForm';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto p-4 sm:p-6 md:p-8">
        <PrintForgeForm />
      </main>
      <footer className="py-6 text-center text-muted-foreground text-sm border-t">
        © {new Date().getFullYear()} Configurador de Vehículos. Todos los derechos reservados.
      </footer>
    </div>
  );
}
