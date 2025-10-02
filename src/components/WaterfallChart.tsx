import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts';
import { Transaction } from './TransactionForm';
import { BarChart3 } from 'lucide-react';

interface WaterfallChartProps {
  transactions: Transaction[];
  filter?: 'income' | 'expense' | 'all';
}

type WaterfallPoint = {
  name: string;
  start: number;
  value: number;
  end: number;
  type: 'category' | 'total';
  rawAmount: number;
};

type CategoryTotal = {
  category: string;
  total: number;
};

type WaterfallMode = NonNullable<WaterfallChartProps['filter']>;

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const formatCurrency = (value: number) => currencyFormatter.format(Math.abs(value));

const formatSignedCurrency = (value: number) => {
  const formatted = currencyFormatter.format(Math.abs(value));
  return value < 0 ? `- ${formatted}` : formatted;
};

const summarizeTransactionsByCategory = (transactions: Transaction[], mode: WaterfallMode): CategoryTotal[] => {
  const filtered = transactions.filter((transaction) => {
    if (mode === 'income') return transaction.amount > 0;
    if (mode === 'expense') return transaction.amount < 0;
    return true;
  });

  const aggregated = filtered.reduce<Record<string, number>>((acc, transaction) => {
    const key = transaction.category || 'Sem categoria';
    acc[key] = (acc[key] ?? 0) + transaction.amount;
    return acc;
  }, {});

  return Object.entries(aggregated)
    .filter(([, total]) => total !== 0)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([category, total]) => ({ category, total }));
};

const buildWaterfallSeries = (entries: CategoryTotal[], mode: WaterfallMode) => {
  let cumulative = 0;
  const points: WaterfallPoint[] = entries.map(({ category, total }) => {
    let value: number;
    if (mode === 'income') {
      value = Math.abs(total);
    } else if (mode === 'expense') {
      value = -Math.abs(total);
    } else {
      value = total;
    }

    const start = cumulative;
    cumulative += value;

    return {
      name: category,
      start,
      value,
      end: cumulative,
      type: 'category',
      rawAmount: Math.abs(value),
    };
  });

  if (points.length === 0) {
    return { points, finalValue: 0, totalLabel: '' };
  }

  const finalValue = cumulative;
  const totalLabel =
    mode === 'income' ? 'Total Receitas' : mode === 'expense' ? 'Total Despesas' : 'Saldo Final';

  const totalValueForBar =
    mode === 'income' ? Math.abs(finalValue) : mode === 'expense' ? -Math.abs(finalValue) : finalValue;

  points.push({
    name: totalLabel,
    start: 0,
    value: totalValueForBar,
    end: totalValueForBar,
    type: 'total',
    rawAmount: Math.abs(finalValue),
  });

  return { points, finalValue, totalLabel };
};

export const WaterfallChart: React.FC<WaterfallChartProps> = ({ transactions, filter = 'all' }) => {
  const mode: WaterfallMode = filter;
  const isIncomeChart = mode === 'income';
  const isExpenseChart = mode === 'expense';
  const categoryTotals = summarizeTransactionsByCategory(transactions, mode);

  if (categoryTotals.length === 0) {
    return (
      <Card className="card-financial">
        <CardHeader>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl font-semibold">Gráfico de Fluxo Financeiro</CardTitle>
          </div>
          <CardDescription>Sem dados suficientes para montar a cascata por categoria</CardDescription>
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

  const { points, finalValue, totalLabel } = buildWaterfallSeries(categoryTotals, mode);

  const summaryValue =
    isIncomeChart || isExpenseChart ? formatCurrency(Math.abs(finalValue)) : formatSignedCurrency(finalValue);

  const summaryColorClass =
    isIncomeChart
      ? 'text-financial-success'
      : isExpenseChart
        ? 'text-destructive'
        : finalValue >= 0
          ? 'text-financial-success'
          : 'text-destructive';

  const summarySwatchColor =
    isIncomeChart
      ? 'hsl(var(--financial-success))'
      : isExpenseChart
        ? 'hsl(var(--destructive))'
        : finalValue >= 0
          ? 'hsl(var(--financial-success))'
          : 'hsl(var(--destructive))';

  const positiveColor = 'hsl(var(--financial-success))';
  const negativeColor = 'hsl(var(--destructive))';
  const totalColor = isIncomeChart
    ? positiveColor
    : isExpenseChart
      ? negativeColor
      : 'hsl(var(--primary))';

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) {
      return null;
    }

    const valueEntry = payload.find((item: any) => item.dataKey === 'value');
    if (!valueEntry) {
      return null;
    }

    const dataPoint = valueEntry.payload as WaterfallPoint;
    const isTotalPoint = dataPoint.type === 'total';
    const deltaLabel = dataPoint.value >= 0 ? 'Receita' : 'Despesa';

    return (
      <div className="bg-card border rounded-lg shadow-lg p-3">
        <p className="font-medium text-card-foreground">{dataPoint.name}</p>
        {isTotalPoint ? (
          <p className={`text-sm ${dataPoint.value >= 0 ? 'text-financial-success' : 'text-destructive'}`}>
            {formatSignedCurrency(dataPoint.value)}
          </p>
        ) : (
          <>
            <p className={`text-sm ${dataPoint.value >= 0 ? 'text-financial-success' : 'text-destructive'}`}>
              {deltaLabel}: {formatCurrency(Math.abs(dataPoint.value))}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Acumulado: {formatSignedCurrency(dataPoint.end)}</p>
          </>
        )}
      </div>
    );
  };

  return (
    <Card className="card-financial">
      <CardHeader>
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <CardTitle className="text-xl font-semibold">Gráfico de Fluxo Financeiro</CardTitle>
        </div>
        <CardDescription>
          Fluxo financeiro em cascata por categoria
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={points}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis
                dataKey="name"
                className="text-sm fill-muted-foreground"
                angle={-30}
                textAnchor="end"
                height={70}
              />
              <YAxis
                className="text-sm fill-muted-foreground"
                tickFormatter={formatSignedCurrency}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" />
              <Bar dataKey="start" stackId="waterfall" fill="transparent" isAnimationActive={false} />
              <Bar dataKey="value" stackId="waterfall">
                {points.map((entry, index) => {
                  const fill =
                    entry.type === 'total'
                      ? totalColor
                      : entry.value >= 0
                        ? positiveColor
                        : negativeColor;
                  return <Cell key={`cell-${entry.name}-${index}`} fill={fill} />;
                })}
              </Bar>
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: summarySwatchColor }} />
            <span className="text-muted-foreground">{totalLabel}:</span>
            <span className={`font-medium ${summaryColorClass}`}>{summaryValue}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
