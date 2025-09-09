import React, { useState, useMemo } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { DashboardHeader } from '@/components/DashboardHeader';
import { DashboardStats } from '@/components/DashboardStats';
import { QuickActions } from '@/components/QuickActions';
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
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <DashboardHeader />
        
        {/* Main Dashboard Content */}
        <main className="flex-1 overflow-auto p-6 space-y-6">
          {/* Stats Cards */}
          <DashboardStats results={results} inputs={inputsWithIdealWithdrawal} />
          
          {/* Quick Actions */}
          <QuickActions />
          
          {/* Charts Section */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">
              <PatrimonyChart 
                data={chartData}
                retirementAge={inputsWithIdealWithdrawal.idadeAposentadoria}
              />
            </div>
            <div>
              <InvestmentComparator />
            </div>
          </div>
          
          {/* Financial Form */}
          <FinancialForm 
            inputs={inputsWithIdealWithdrawal}
            onChange={setInputs}
            results={results}
          />
          
          {/* Sensitivity Analysis */}
          <SensitivityAnalysis inputs={inputsWithIdealWithdrawal} />
        </main>
      </div>
    </div>
  );
};

export default Index;
