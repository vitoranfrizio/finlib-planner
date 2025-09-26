import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { Transaction } from './TransactionForm';

interface FinancialSummaryProps {
  transactions: Transaction[];
}

export const FinancialSummary: React.FC<FinancialSummaryProps> = ({ transactions }) => {
  const totalIncome = transactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const balance = totalIncome - totalExpenses;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="bg-gradient-to-r from-financial-blue-light to-financial-blue-light/50 border border-financial-blue/20 rounded-lg p-6 mb-8">
      <h2 className="text-xl font-semibold text-financial-blue-dark mb-6">Resultados Principais</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        {/* Patrimônio na Aposentadoria */}
        <div>
          <p className="text-sm font-medium text-financial-neutral mb-1">Patrimônio na Aposentadoria</p>
          <p className="text-2xl font-bold text-financial-blue">{formatCurrency(totalIncome)}</p>
        </div>

        {/* Patrimônio Final */}
        <div>
          <p className="text-sm font-medium text-financial-neutral mb-1">Patrimônio Final</p>
          <p className={`text-2xl font-bold ${balance >= 0 ? 'text-financial-blue-dark' : 'text-financial-warning'}`}>
            {formatCurrency(balance)}
          </p>
        </div>

        {/* Aportes Total */}
        <div>
          <p className="text-sm font-medium text-financial-neutral mb-1">Aportes Total</p>
          <p className="text-2xl font-bold text-financial-blue">{formatCurrency(totalExpenses)}</p>
        </div>
      </div>
    </div>
  );
};
