import Link from 'next/link';
import { Home, BarChart2, Calendar, List, Banknote, PiggyBank } from 'lucide-react';

export default function Navbar() {
  return (
    <div className="bg-background/90 h-12 flex items-center px-4">
      <div className="flex gap-4 text-sm text-muted-foreground">
        <Link 
          href="/" 
          className="flex items-center gap-2 hover:text-primary transition-colors duration-200"
        >
          <Home className="h-4 w-4" />
          Trip
        </Link>
        <Link 
          href="/mileage" 
          className="flex items-center gap-2 hover:text-primary transition-colors duration-200"
        >
          <List className="h-4 w-4" />
          Log
        </Link>
        <Link 
          href="/mileage/calendar" 
          className="flex items-center gap-2 hover:text-primary transition-colors duration-200"
        >
          <Calendar className="h-4 w-4" />
          Calendar
        </Link>
        <Link 
          href="/stats" 
          className="flex items-center gap-2 hover:text-primary transition-colors duration-200"
        >
          <BarChart2 className="h-4 w-4" />
          Stats
        </Link>
        <Link 
          href="/income" 
          className="flex items-center gap-2 hover:text-primary transition-colors duration-200"
        >
          <PiggyBank className="h-4 w-4" />
          Income
        </Link>
      </div>
    </div>
  );
} 