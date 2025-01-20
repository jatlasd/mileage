import Link from 'next/link';
import { Home, BarChart2, List, PiggyBank, ChartSpline, Car, IdCard, Trophy } from 'lucide-react';

export default function Navbar() {
  return (
    <div className="bg-background/90 h-12 flex items-center px-4">
      <div className="flex gap-4 text-sm text-muted-foreground">
        <Link 
          href="/" 
          className="flex items-center gap-2 hover:text-primary transition-colors duration-200"
        >
          <IdCard className="h-4 w-4" />
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
          href="/ar" 
          className="flex items-center gap-2 hover:text-primary transition-colors duration-200"
        >
          <Trophy className="h-4 w-4" />
          AR
        </Link>
        <Link 
          href="/income" 
          className="flex items-center gap-2 hover:text-primary transition-colors duration-200"
        >
          <PiggyBank className="h-4 w-4" />
          Income
        </Link>
        <Link 
          href="/analytics" 
          className="flex items-center gap-2 hover:text-primary transition-colors duration-200"
        >
          <ChartSpline className="h-4 w-4" />
          Analytics
        </Link>
      </div>
    </div>
  );
} 