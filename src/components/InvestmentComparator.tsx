import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatCurrency } from '@/utils/financial';

export const InvestmentComparator: React.FC = () => {
  const [comparatorInputs, setComparatorInputs] = useState({
    depositoInicial: 10000,
    valorDeposito: 1000,
    numeroMeses: 120,
  });

  const taxasScenarios = [
    { mensal: 0.2, anual: 2.44 },
    { mensal: 0.4, anual: 4.91 },
    { mensal: 0.6, anual: 7.44 },
    { mensal: 0.8, anual: 10.03 },
    { mensal: 1.0, anual: 12.68 },
    { mensal: 1.2, anual: 15.39 },
  ];

  const calculateFinalAmount = (taxaMensal: number) => {
    const { depositoInicial, valorDeposito, numeroMeses } = comparatorInputs;
    const monthlyRate = taxaMensal / 100;
    
    // Future value of initial deposit
    const futureValueInitial = depositoInicial * Math.pow(1 + monthlyRate, numeroMeses);
    
    // Future value of monthly deposits
    const futureValueMonthly = valorDeposito * ((Math.pow(1 + monthlyRate, numeroMeses) - 1) / monthlyRate);
    
    return futureValueInitial + futureValueMonthly;
  };

  const handleInputChange = (field: keyof typeof comparatorInputs, value: string) => {
    setComparatorInputs(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-financial-blue-dark">Comparador de Investimentos</CardTitle>
        <p className="text-sm text-financial-neutral">
          Compare diferentes cenários de rentabilidade
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <Label htmlFor="depositoInicial">Depósito Inicial (R$)</Label>
            <Input
              id="depositoInicial"
              type="number"
              value={comparatorInputs.depositoInicial}
              onChange={(e) => handleInputChange('depositoInicial', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="valorDeposito">Valor do Depósito Mensal (R$)</Label>
            <Input
              id="valorDeposito"
              type="number"
              value={comparatorInputs.valorDeposito}
              onChange={(e) => handleInputChange('valorDeposito', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="numeroMeses">Número de Meses</Label>
            <Input
              id="numeroMeses"
              type="number"
              value={comparatorInputs.numeroMeses}
              onChange={(e) => handleInputChange('numeroMeses', e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-financial-blue-light">
                <th className="p-3 text-left text-financial-blue-dark border border-financial-blue/20">
                  Taxa Mensal (%)
                </th>
                <th className="p-3 text-center text-financial-blue-dark border border-financial-blue/20">
                  Taxa Anual (%)
                </th>
                <th className="p-3 text-right text-financial-blue-dark border border-financial-blue/20">
                  Montante Final
                </th>
              </tr>
            </thead>
            <tbody>
              {taxasScenarios.map((scenario, index) => {
                const finalAmount = calculateFinalAmount(scenario.mensal);
                const isHighReturn = scenario.mensal >= 1.0;
                
                return (
                  <tr 
                    key={index} 
                    className={`hover:bg-financial-blue-light/30 ${
                      isHighReturn ? 'bg-financial-success/10' : ''
                    }`}
                  >
                    <td className="p-3 border border-financial-blue/20 font-medium text-financial-blue-dark">
                      {scenario.mensal.toFixed(1)}%
                    </td>
                    <td className="p-3 text-center border border-financial-blue/20 text-financial-blue">
                      {scenario.anual.toFixed(2)}%
                    </td>
                    <td className={`p-3 text-right border border-financial-blue/20 font-bold ${
                      isHighReturn ? 'text-financial-success' : 'text-financial-blue'
                    }`}>
                      {formatCurrency(finalAmount)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-4 p-4 bg-financial-blue-light rounded-lg">
          <p className="text-sm text-financial-neutral">
            <strong>Cenário Base:</strong> Depósito inicial de {formatCurrency(comparatorInputs.depositoInicial)} + 
            aportes mensais de {formatCurrency(comparatorInputs.valorDeposito)} por {comparatorInputs.numeroMeses} meses 
            ({(comparatorInputs.numeroMeses / 12).toFixed(1)} anos)
          </p>
        </div>
      </CardContent>
    </Card>
  );
};