import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatCurrency } from '@/utils/financial';

interface PatrimonyEvolution {
  age: number;
  year: number;
  patrimony: number;
  phase: 'accumulation' | 'withdrawal';
}

interface PatrimonyChartProps {
  data: PatrimonyEvolution[];
  retirementAge: number;
}

export const PatrimonyChart: React.FC<PatrimonyChartProps> = ({ data, retirementAge }) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const isRetirement = label === retirementAge;
      return (
        <div className="bg-white p-3 border border-financial-blue/20 rounded-lg shadow-lg">
          <p className="font-medium text-financial-blue-dark">{`Idade: ${label} anos`}</p>
          <p className="text-financial-blue">
            {`Patrimônio: ${formatCurrency(payload[0].value)}`}
          </p>
          {isRetirement && (
            <p className="text-financial-warning text-sm font-medium">Aposentadoria</p>
          )}
        </div>
      );
    }
    return null;
  };

  const maxValue = Math.max(...data.map(d => d.patrimony));
  const retirementData = data.find(d => d.age === retirementAge);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-financial-blue-dark">Evolução Patrimonial</CardTitle>
        <p className="text-sm text-financial-neutral">
          Crescimento até a aposentadoria e redução com retiradas
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPatrimony" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(210 100% 47%)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(210 100% 47%)" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="age" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'hsl(210 10% 50%)' }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'hsl(210 10% 50%)' }}
                tickFormatter={(value) => formatCurrency(value).replace('R$', 'R$').slice(0, -3) + 'k'}
              />
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(210 30% 88%)" />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="patrimony"
                stroke="hsl(210 100% 47%)"
                strokeWidth={2}
                fill="url(#colorPatrimony)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        {retirementData && (
          <div className="mt-4 p-4 bg-financial-blue-light rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-financial-blue-dark font-medium">
                Pico na Aposentadoria ({retirementAge} anos):
              </span>
              <span className="text-financial-blue font-bold text-lg">
                {formatCurrency(retirementData.patrimony)}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};