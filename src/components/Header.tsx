
import Link from 'next/link';
import { Car } from 'lucide-react';

export function Header() {
  return (
    <header className="py-4 px-6 shadow-md bg-card">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary">
          <Car className="h-8 w-8" />
          <span>Configurador de Vehículos</span>
        </Link>
        {/* Future navigation items can go here */}
      </div>
    </header>
  );
}
