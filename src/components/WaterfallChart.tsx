import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Transaction } from './TransactionForm';
import { BarChart3 } from 'lucide-react';

interface WaterfallChartProps {
  transactions: Transaction[];
  filter?: 'income' | 'expense' | 'all';
}

export const WaterfallChart: React.FC<WaterfallChartProps> = ({ transactions, filter = 'all' }) => {
  // Group transactions by category
  const groupTransactionsByCategory = (items: Transaction[]) => {
    const filtered = items.filter((t) => {
      if (filter === 'income') return t.amount > 0;
      if (filter === 'expense') return t.amount < 0;
      return true;
    });

    const grouped = filtered.reduce((acc, transaction) => {
      const key = transaction.category || 'Sem categoria';
      if (!acc[key]) {
        acc[key] = { income: 0, expenses: 0 };
      }
      if (transaction.amount > 0) {
        acc[key].income += transaction.amount;
      } else {
        acc[key].expenses += Math.abs(transaction.amount);
      }
      return acc;
    }, {} as Record<string, { income: number; expenses: number }>);

    return Object.entries(grouped)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([category, data]) => {
        if (filter === 'income') {
          return { category, receitas: data.income } as any;
        }
        if (filter === 'expense') {
          return { category, despesas: data.expenses } as any;
        }
        return { category, receitas: data.income, despesas: data.expenses };
      });
  };

  const chartData = groupTransactionsByCategory(transactions);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(value));
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border rounded-lg shadow-lg p-3">
          <p className="font-medium text-card-foreground">{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className={`text-sm ${
              entry.dataKey === 'receitas' ? 'text-success' : 
              entry.dataKey === 'despesas' ? 'text-destructive' : 'text-foreground'
            }`}>
              {entry.dataKey === 'receitas' ? 'Receitas: ' : 'Despesas: '}
              {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) {
    return (
      <Card className="card-financial">
        <CardHeader>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl font-semibold">Gráfico de Fluxo Financeiro</CardTitle>
          </div>
          <CardDescription>Receitas e despesas agrupadas por categoria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">
              Sem dados para exibir
            </h3>
            <p className="text-sm text-muted-foreground">
              Adicione transações para ver o gráfico de fluxo por categoria
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-financial">
      <CardHeader>
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <CardTitle className="text-xl font-semibold">Gráfico de Fluxo Financeiro</CardTitle>
        </div>
        <CardDescription>
          Receitas e despesas por categoria
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="category" 
                className="text-sm fill-muted-foreground"
              />
              <YAxis 
                className="text-sm fill-muted-foreground"
                tickFormatter={formatCurrency}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar 
                dataKey="receitas" 
                name="Receitas"
                className="fill-success"
                radius={[2, 2, 0, 0]}
              />
              <Bar 
                dataKey="despesas" 
                name="Despesas"
                className="fill-destructive"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legend with totals */}
        <div className="mt-4 pt-4 border-t">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-success rounded"></div>
              <span className="text-muted-foreground">Total Receitas:</span>
              <span className="font-medium text-success">
                {formatCurrency(chartData.reduce((sum, item) => sum + item.receitas, 0))}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-destructive rounded"></div>
              <span className="text-muted-foreground">Total Despesas:</span>
              <span className="font-medium text-destructive">
                {formatCurrency(Math.abs(chartData.reduce((sum, item) => sum + item.despesas, 0)))}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
