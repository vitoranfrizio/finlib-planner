import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

export type CategoryPieDatum = {
  name: string;
  value: number;
};

interface CategoryPieChartProps {
  title: string;
  data: CategoryPieDatum[];
  colors: string[];
}

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const formatCurrency = (value: number) => currencyFormatter.format(value);

const CategoryPieChart: React.FC<CategoryPieChartProps> = ({ title, data, colors }) => {
  if (!data.length) {
    return null;
  }

  const total = data.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) {
      return null;
    }

    const { name, value, percent } = payload[0];

    return (
      <div className="bg-card border rounded-lg shadow-lg px-3 py-2 text-sm">
        <p className="font-medium text-card-foreground">{name}</p>
        <p className="text-muted-foreground">{formatCurrency(value)}</p>
        <p className="text-financial-blue-dark">{`${(percent * 100).toFixed(1)}%`}</p>
      </div>
    );
  };

  const renderLabel = ({ name, percent }: any) => `${name}: ${(percent * 100).toFixed(0)}%`;

  return (
    <Card className="card-financial">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-financial-blue-dark">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius="80%"
                dataKey="value"
                nameKey="name"
                label={renderLabel}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`slice-${entry.name}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Total analisado: <span className="font-medium text-financial-blue-dark">{formatCurrency(total)}</span>
        </p>
      </CardContent>
    </Card>
  );
};

export default CategoryPieChart;
