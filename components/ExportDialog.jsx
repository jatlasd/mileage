import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ExportDialog({ onExport }) {
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getAvailableMonths = () => {
    if (!selectedYear) return [];
    if (selectedYear < currentYear) return months;
    return months.slice(0, currentMonth + 1);
  };

  const handleYearSelect = (year) => {
    setSelectedYear(year);
    setSelectedMonth(null);
  };

  const handleLast30Days = () => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 30);
    onExport({
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0]
    });
  };

  const handleMonthSelect = (monthIndex) => {
    setSelectedMonth(monthIndex);
  };

  const handleDownload = () => {
    if (selectedYear === null || selectedMonth === null) return;
    
    const start = new Date(selectedYear, selectedMonth, 1);
    const end = new Date(selectedYear, selectedMonth + 1, 0);
    onExport({
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0]
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[300px]">
        <DialogHeader>
          <DialogTitle>Export Mileage Data</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-4">
          <div className="flex gap-2">
            <button
              onClick={() => handleYearSelect(currentYear)}
              className={`flex-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedYear === currentYear
                  ? 'bg-primary/20 text-primary border border-primary/20'
                  : 'bg-white/[0.07] border border-white/[0.05] hover:bg-white/[0.1]'
              }`}
            >
              {currentYear}
            </button>
            <button
              onClick={() => handleYearSelect(currentYear - 1)}
              className={`flex-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedYear === currentYear - 1
                  ? 'bg-primary/20 text-primary border border-primary/20'
                  : 'bg-white/[0.07] border border-white/[0.05] hover:bg-white/[0.1]'
              }`}
            >
              {currentYear - 1}
            </button>
            <button
              onClick={handleLast30Days}
              className={`flex-1 px-3 py-2 rounded-lg text-sm transition-colors
                bg-white/[0.07] border border-white/[0.05] hover:bg-white/[0.1]`}
            >
              Last 30
            </button>
          </div>
          
          {selectedYear && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full justify-between text-left font-normal"
                >
                  <span>{selectedMonth !== null ? months[selectedMonth] : 'Select Month'}</span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[240px]">
                {getAvailableMonths().map((month, index) => (
                  <DropdownMenuItem
                    key={index}
                    onClick={() => handleMonthSelect(index)}
                  >
                    {month}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {selectedYear && selectedMonth !== null && (
            <Button 
              className="w-full" 
              onClick={handleDownload}
            >
              Download CSV
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 