// Utility functions for financial calculations and formatting

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100);
};

export const parseCurrency = (value: string): number => {
  return parseFloat(value.replace(/[^0-9.-]/g, '')) || 0;
};

export interface FinancialInputs {
  nome: string;
  idadeAtual: number;
  idadeAposentadoria: number;
  expectativaVida: number;
  perfilInvestimento: 'conservador' | 'moderado' | 'agressivo';
  inflacao: number;
  rentabilidadeEsperada: number;
  patrimonioInicial: number;
  aportesMensais: number;
  retiradasMensais: number;
  retiradaMensalIdeal: number;
}

export const calculateRealReturn = (nominalRate: number, inflation: number): number => {
  return ((nominalRate - inflation) / (1 + inflation / 100)) * 100;
};

export const calculateFutureValue = (
  pv: number, 
  pmt: number, 
  rate: number, 
  periods: number
): number => {
  const monthlyRate = rate / 100 / 12;
  const futureValuePV = pv * Math.pow(1 + monthlyRate, periods);
  const futureValuePMT = pmt * ((Math.pow(1 + monthlyRate, periods) - 1) / monthlyRate);
  return futureValuePV + futureValuePMT;
};

export const calculateSustainableWithdrawal = (
  patrimonio: number,
  rate: number,
  periods: number
): number => {
  const monthlyRate = rate / 100 / 12;
  return patrimonio * (monthlyRate * Math.pow(1 + monthlyRate, periods)) / 
         (Math.pow(1 + monthlyRate, periods) - 1);
};

export const calculatePatrimonyEvolution = (inputs: FinancialInputs) => {
  const yearsToRetirement = inputs.idadeAposentadoria - inputs.idadeAtual;
  const yearsInRetirement = inputs.expectativaVida - inputs.idadeAposentadoria;
  const realReturn = calculateRealReturn(inputs.rentabilidadeEsperada, inputs.inflacao);
  
  const evolution = [];
  
  // Accumulation phase
  for (let year = 0; year <= yearsToRetirement; year++) {
    const age = inputs.idadeAtual + year;
    const months = year * 12;
    const patrimony = calculateFutureValue(
      inputs.patrimonioInicial,
      inputs.aportesMensais,
      realReturn,
      months
    );
    
    evolution.push({
      age,
      year: year + 1,
      patrimony,
      phase: 'accumulation'
    });
  }
  
  // Withdrawal phase
  const retirementPatrimony = evolution[evolution.length - 1].patrimony;
  let currentPatrimony = retirementPatrimony;
  
  for (let year = 1; year <= yearsInRetirement; year++) {
    const age = inputs.idadeAposentadoria + year;
    const monthlyRate = realReturn / 100 / 12;
    
    // Calculate patrimony after withdrawals and returns
    for (let month = 0; month < 12; month++) {
      currentPatrimony = currentPatrimony * (1 + monthlyRate) - inputs.retiradasMensais;
      if (currentPatrimony < 0) currentPatrimony = 0;
    }
    
    evolution.push({
      age,
      year: yearsToRetirement + year + 1,
      patrimony: Math.max(0, currentPatrimony),
      phase: 'withdrawal'
    });
  }
  
  return evolution;
};