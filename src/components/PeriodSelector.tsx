import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Filter } from 'lucide-react';

interface PeriodSelectorProps {
  selectedMonth: number;
  selectedYear: number;
  customPeriod: { start: string | null; end: string | null };
  useCustomPeriod: boolean;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
  onCustomPeriodChange: (period: { start: string | null; end: string | null }) => void;
  onToggleCustomPeriod: (useCustom: boolean) => void;
}

export const PeriodSelector: React.FC<PeriodSelectorProps> = ({
  selectedMonth,
  selectedYear,
  customPeriod,
  useCustomPeriod,
  onMonthChange,
  onYearChange,
  onCustomPeriodChange,
  onToggleCustomPeriod,
}) => {
  const months = [
    { value: 0, label: 'Janeiro' },
    { value: 1, label: 'Fevereiro' },
    { value: 2, label: 'Março' },
    { value: 3, label: 'Abril' },
    { value: 4, label: 'Maio' },
    { value: 5, label: 'Junho' },
    { value: 6, label: 'Julho' },
    { value: 7, label: 'Agosto' },
    { value: 8, label: 'Setembro' },
    { value: 9, label: 'Outubro' },
    { value: 10, label: 'Novembro' },
    { value: 11, label: 'Dezembro' },
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

  return (
    <div className="card-financial">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="h-5 w-5 text-primary" />
        <h3 className="section-title text-lg">Filtrar por Período</h3>
      </div>
      <p className="text-sm label-teal mb-4">
        Selecione o período para visualizar as transações
      </p>
      
      <div className="space-y-4">
        {/* Period Type Toggle */}
        <div className="flex gap-2">
          <Button
            variant={!useCustomPeriod ? "default" : "outline"}
            size="sm"
            onClick={() => onToggleCustomPeriod(false)}
            className="flex-1"
          >
            <Filter className="h-4 w-4 mr-2" />
            Mês/Ano
          </Button>
          <Button
            variant={useCustomPeriod ? "default" : "outline"}
            size="sm"
            onClick={() => onToggleCustomPeriod(true)}
            className="flex-1"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Período Personalizado
          </Button>
        </div>

        {!useCustomPeriod ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-title-blue">Mês</label>
              <select
                value={selectedMonth.toString()}
                onChange={(e) => onMonthChange(parseInt(e.target.value))}
                className="input-field w-full focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {months.map((month) => (
                  <option key={month.value} value={month.value.toString()}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-title-blue">Ano</label>
              <select
                value={selectedYear.toString()}
                onChange={(e) => onYearChange(parseInt(e.target.value))}
                className="input-field w-full focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {years.map((year) => (
                  <option key={year} value={year.toString()}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-title-blue">Data Inicial</label>
              <input
                type="date"
                value={customPeriod.start || ''}
                onChange={(e) => onCustomPeriodChange({
                  ...customPeriod,
                  start: e.target.value || null
                })}
                className="input-field w-full focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-title-blue">Data Final</label>
              <input
                type="date"
                value={customPeriod.end || ''}
                onChange={(e) => onCustomPeriodChange({
                  ...customPeriod,
                  end: e.target.value || null
                })}
                className="input-field w-full focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
        )}

        {/* Current Filter Display */}
        <div className="input-field">
          <p className="text-sm label-teal font-medium">
            Período ativo: {!useCustomPeriod 
              ? `${months[selectedMonth].label} de ${selectedYear}`
              : customPeriod.start && customPeriod.end
                ? `${new Date(customPeriod.start).toLocaleDateString('pt-BR')} até ${new Date(customPeriod.end).toLocaleDateString('pt-BR')}`
                : 'Defina um período personalizado'
            }
          </p>
        </div>
      </div>
    </div>
  );
};
