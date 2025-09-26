import React, { useState, useMemo } from 'react';
import { FinancialForm } from '@/components/FinancialForm';
import { PatrimonyChart } from '@/components/PatrimonyChart';
import { SensitivityAnalysis } from '@/components/SensitivityAnalysis';
import { InvestmentComparator } from '@/components/InvestmentComparator';
import { FinancialInputs, calculatePatrimonyEvolution, calculateFutureValue, calculateRealReturn } from '@/utils/financial';

const Index = () => {
  const [inputs, setInputs] = useState<FinancialInputs>({
    nome: '',
    idadeAtual: 32,
    idadeAposentadoria: 65,
    expectativaVida: 95,
    perfilInvestimento: 'moderado',
    inflacao: 0,
    rentabilidadeEsperada: 0,
    patrimonioInicial: 50000,
    aportesMensais: 2000,
    retiradasMensais: 8000,
    retiradaMensalIdeal: 0, // Will be calculated automatically
  });


  // Calculate ideal monthly withdrawal based on preserving patrimony table
  const idealWithdrawal = useMemo(() => {
    const realReturn = calculateRealReturn(inputs.rentabilidadeEsperada, inputs.inflacao);
    const yearsToRetirement = inputs.idadeAposentadoria - inputs.idadeAtual;
    const monthsToRetirement = yearsToRetirement * 12;
    
    const futurePatrimony = calculateFutureValue(
      inputs.patrimonioInicial,
      inputs.aportesMensais,
      realReturn,
      monthsToRetirement
    );
    
    // Monthly withdrawal that preserves capital (interest only)
    const monthlyRate = realReturn / 100 / 12;
    return futurePatrimony * monthlyRate;
  }, [inputs.patrimonioInicial, inputs.aportesMensais, inputs.rentabilidadeEsperada, inputs.inflacao, inputs.idadeAposentadoria, inputs.idadeAtual]);

  // Update inputs with calculated ideal withdrawal
  const inputsWithIdealWithdrawal = useMemo(() => ({
    ...inputs,
    retiradaMensalIdeal: idealWithdrawal
  }), [inputs, idealWithdrawal]);

  const results = useMemo(() => {
    const yearsToRetirement = inputsWithIdealWithdrawal.idadeAposentadoria - inputsWithIdealWithdrawal.idadeAtual;
    const yearsInRetirement = inputsWithIdealWithdrawal.expectativaVida - inputsWithIdealWithdrawal.idadeAposentadoria;
    const realReturn = calculateRealReturn(inputsWithIdealWithdrawal.rentabilidadeEsperada, inputsWithIdealWithdrawal.inflacao);
    const monthsToRetirement = yearsToRetirement * 12;
    
    // Patrimônio na aposentadoria
    const patrimonioAposentadoria = calculateFutureValue(
      inputsWithIdealWithdrawal.patrimonioInicial,
      inputsWithIdealWithdrawal.aportesMensais,
      realReturn,
      monthsToRetirement
    );

    // Aportes totais
    const aportesTotal = inputsWithIdealWithdrawal.aportesMensais * monthsToRetirement;

    // Patrimônio final (após retiradas)
    const monthlyRate = realReturn / 100 / 12;
    let patrimonioFinal = patrimonioAposentadoria;
    const monthsInRetirement = yearsInRetirement * 12;
    
    for (let i = 0; i < monthsInRetirement; i++) {
      patrimonioFinal = patrimonioFinal * (1 + monthlyRate) - inputsWithIdealWithdrawal.retiradasMensais;
      if (patrimonioFinal <= 0) {
        patrimonioFinal = 0;
        break;
      }
    }

    return {
      patrimonioAposentadoria,
      patrimonioFinal: Math.max(0, patrimonioFinal),
      aportesTotal,
    };
  }, [inputsWithIdealWithdrawal]);

  const chartData = useMemo(() => {
    return calculatePatrimonyEvolution(inputsWithIdealWithdrawal);
  }, [inputsWithIdealWithdrawal]);


  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-to-r from-financial-blue to-financial-blue-dark text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-2">
            Calculadora de Liberdade Financeira
          </h1>
          <p className="text-center text-blue-100 text-lg">
            Planeje seu futuro financeiro com precisão e confiança
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Financial Form */}
        <section>
          <FinancialForm 
            inputs={inputsWithIdealWithdrawal}
            onChange={setInputs}
            results={results}
          />
        </section>

        {/* Charts Section */}
        <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <PatrimonyChart 
              data={chartData}
              retirementAge={inputsWithIdealWithdrawal.idadeAposentadoria}
            />
          </div>
          <div>
            <InvestmentComparator />
          </div>
        </section>

        {/* Sensitivity Analysis */}
        <section>
          <SensitivityAnalysis inputs={inputsWithIdealWithdrawal} />
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-financial-blue-light py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-financial-neutral">
            © 2024 Calculadora de Liberdade Financeira - Planeje seu futuro com inteligência
          </p>
        </div>
      </footer>

    </div>
  );
};

export default Index;
