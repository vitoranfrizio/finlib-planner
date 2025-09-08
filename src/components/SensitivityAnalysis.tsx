import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FinancialInputs, calculateFutureValue, calculateSustainableWithdrawal, formatCurrency, calculateRealReturn } from '@/utils/financial';

interface SensitivityAnalysisProps {
  inputs: FinancialInputs;
}

export const SensitivityAnalysis: React.FC<SensitivityAnalysisProps> = ({ inputs }) => {
  const baseAporte = 2000;
  const aporteVariations = [-1000, -500, 0, 500, 1000, 1500];
  const retirementAgeVariations = [55, 60, 65, 70];
  
  const realReturn = calculateRealReturn(inputs.rentabilidadeEsperada, inputs.inflacao);

  const calculatePreservingPatrimony = (monthlyContribution: number, retirementAge: number) => {
    const yearsToRetirement = retirementAge - inputs.idadeAtual;
    const monthsToRetirement = yearsToRetirement * 12;
    
    const futurePatrimony = calculateFutureValue(
      inputs.patrimonioInicial,
      monthlyContribution,
      realReturn,
      monthsToRetirement
    );
    
    // Monthly withdrawal that preserves capital (interest only)
    const monthlyRate = realReturn / 100 / 12;
    return futurePatrimony * monthlyRate;
  };

  const calculateExhaustingPatrimony = (monthlyContribution: number, retirementAge: number) => {
    const yearsToRetirement = retirementAge - inputs.idadeAtual;
    const monthsToRetirement = yearsToRetirement * 12;
    const monthsInRetirement = (inputs.expectativaVida - retirementAge) * 12;
    
    const futurePatrimony = calculateFutureValue(
      inputs.patrimonioInicial,
      monthlyContribution,
      realReturn,
      monthsToRetirement
    );
    
    return calculateSustainableWithdrawal(futurePatrimony, realReturn, monthsInRetirement);
  };

  const PreservingTable = () => (
    <Card>
      <CardHeader>
        <CardTitle className="text-financial-blue-dark text-lg">
          Análise de Sensibilidade - Preservando Patrimônio
        </CardTitle>
        <p className="text-sm text-financial-neutral">
          Quanto posso retirar mensalmente para manter meu patrimônio preservado - em patamar real
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-financial-blue-light">
                <th className="p-3 text-left text-financial-blue-dark border border-financial-blue/20">
                  Aportes Mensais
                </th>
                {retirementAgeVariations.map(age => (
                  <th key={age} className="p-3 text-center text-financial-blue-dark border border-financial-blue/20">
                    {age} anos
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {aporteVariations.map(variation => {
                const monthlyContribution = baseAporte + variation;
                return (
                  <tr key={variation} className="hover:bg-financial-blue-light/30">
                    <td className="p-3 border border-financial-blue/20 font-medium text-financial-blue-dark">
                      {formatCurrency(monthlyContribution)}
                    </td>
                    {retirementAgeVariations.map(age => (
                      <td key={age} className="p-3 text-center border border-financial-blue/20 text-financial-blue">
                        {formatCurrency(calculatePreservingPatrimony(monthlyContribution, age))}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );

  const ExhaustingTable = () => (
    <Card>
      <CardHeader>
        <CardTitle className="text-financial-blue-dark text-lg">
          Análise de Sensibilidade - Exaurindo Patrimônio (Até {inputs.expectativaVida} anos)
        </CardTitle>
        <p className="text-sm text-financial-neutral">
          Quanto posso retirar mensalmente para exaurir meu patrimônio até a idade de expectativa
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-financial-blue-light">
                <th className="p-3 text-left text-financial-blue-dark border border-financial-blue/20">
                  Aportes Mensais
                </th>
                {retirementAgeVariations.map(age => (
                  <th key={age} className="p-3 text-center text-financial-blue-dark border border-financial-blue/20">
                    {age} anos
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {aporteVariations.map(variation => {
                const monthlyContribution = baseAporte + variation;
                return (
                  <tr key={variation} className="hover:bg-financial-blue-light/30">
                    <td className="p-3 border border-financial-blue/20 font-medium text-financial-blue-dark">
                      {formatCurrency(monthlyContribution)}
                    </td>
                    {retirementAgeVariations.map(age => (
                      <td key={age} className="p-3 text-center border border-financial-blue/20 text-financial-blue">
                        {formatCurrency(calculateExhaustingPatrimony(monthlyContribution, age))}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <PreservingTable />
      <ExhaustingTable />
    </div>
  );
};