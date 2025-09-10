import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FinancialInputs, formatCurrency } from '@/utils/financial';

interface FinancialFormProps {
  inputs: FinancialInputs;
  onChange: (inputs: FinancialInputs) => void;
  results: {
    patrimonioAposentadoria: number;
    patrimonioFinal: number;
    aportesTotal: number;
  };
}

export const FinancialForm: React.FC<FinancialFormProps> = ({ inputs, onChange, results }) => {
  const handleInputChange = (field: keyof FinancialInputs, value: string | number) => {
    // For numeric fields, always convert to number
    const numericFields = ['idadeAtual', 'idadeAposentadoria', 'expectativaVida', 'patrimonioInicial', 'aportesMensais', 'retiradasMensais', 'inflacao', 'rentabilidadeEsperada', 'retiradaMensalIdeal'];
    
    onChange({
      ...inputs,
      [field]: numericFields.includes(field) ? Number(value) : value
    });
  };

  const handleCurrencyChange = (field: keyof FinancialInputs, value: string) => {
    const numericValue = parseFloat(value.replace(/[^0-9.-]/g, '')) || 0;
    handleInputChange(field, numericValue);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Results Display */}
      <Card className="lg:col-span-4 bg-gradient-to-r from-financial-blue-light to-financial-blue-light/50 border-financial-blue/20">
        <CardHeader>
          <CardTitle className="text-financial-blue-dark">Resultados Principais</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-sm text-financial-neutral font-medium">Patrimônio na Aposentadoria</p>
              <p className="text-2xl font-bold text-financial-blue-dark">
                {formatCurrency(results.patrimonioAposentadoria)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-financial-neutral font-medium">Patrimônio Final</p>
              <p className="text-2xl font-bold text-financial-blue-dark">
                {formatCurrency(results.patrimonioFinal)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-financial-neutral font-medium">Aportes Total</p>
              <p className="text-2xl font-bold text-financial-blue-dark">
                {formatCurrency(results.aportesTotal)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Data */}
      <Card>
        <CardHeader>
          <CardTitle className="text-financial-blue-dark">Dados Pessoais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="nome">Nome</Label>
            <Input
              id="nome"
              value={inputs.nome}
              onChange={(e) => handleInputChange('nome', e.target.value)}
              placeholder="Seu nome"
            />
          </div>
          <div>
            <Label htmlFor="idadeAtual">Idade Atual</Label>
            <Input
              id="idadeAtual"
              type="number"
              value={inputs.idadeAtual}
              onChange={(e) => handleInputChange('idadeAtual', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="idadeAposentadoria">Idade na Aposentadoria</Label>
            <Input
              id="idadeAposentadoria"
              type="number"
              value={inputs.idadeAposentadoria}
              onChange={(e) => handleInputChange('idadeAposentadoria', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="expectativaVida">Expectativa de Vida</Label>
            <Input
              id="expectativaVida"
              type="number"
              value={inputs.expectativaVida}
              onChange={(e) => handleInputChange('expectativaVida', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Financial Parameters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-financial-blue-dark">Parâmetros Financeiros</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="perfilInvestimento">Perfil de Investimento</Label>
            <Select
              value={inputs.perfilInvestimento}
              onValueChange={(value) => handleInputChange('perfilInvestimento', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="conservador">Conservador</SelectItem>
                <SelectItem value="moderado">Moderado</SelectItem>
                <SelectItem value="agressivo">Agressivo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="inflacao">Inflação Esperada (%)</Label>
            <Input
              id="inflacao"
              type="number"
              step="0.01"
              value={inputs.inflacao}
              onChange={(e) => handleInputChange('inflacao', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="rentabilidadeEsperada">Rentabilidade Esperada (%)</Label>
            <Input
              id="rentabilidadeEsperada"
              type="number"
              step="0.01"
              value={inputs.rentabilidadeEsperada}
              onChange={(e) => handleInputChange('rentabilidadeEsperada', e.target.value)}
            />
          </div>
          <div>
            <Label className="text-financial-neutral">
              Rentabilidade Real: {(((1 + inputs.rentabilidadeEsperada / 100) / (1 + inputs.inflacao / 100) - 1) * 100).toFixed(2)}%
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Monetary Values */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-financial-blue-dark">Valores Monetários</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="patrimonioInicial">Patrimônio Inicial (R$)</Label>
            <Input
              id="patrimonioInicial"
              type="number"
              value={inputs.patrimonioInicial}
              onChange={(e) => handleCurrencyChange('patrimonioInicial', e.target.value)}
              placeholder="0"
            />
          </div>
          <div>
            <Label htmlFor="aportesMensais">Aportes Mensais (R$)</Label>
            <Input
              id="aportesMensais"
              type="number"
              value={inputs.aportesMensais}
              onChange={(e) => handleCurrencyChange('aportesMensais', e.target.value)}
              placeholder="0"
            />
          </div>
          <div>
            <Label htmlFor="retiradasMensais">Retiradas Mensais na Aposentadoria (R$)</Label>
            <Input
              id="retiradasMensais"
              type="number"
              value={inputs.retiradasMensais}
              onChange={(e) => handleCurrencyChange('retiradasMensais', e.target.value)}
              placeholder="0"
            />
          </div>
          <div>
            <Label htmlFor="retiradaMensalIdeal">Retirada Mensal Ideal (R$) - Calculado automaticamente</Label>
            <Input
              id="retiradaMensalIdeal"
              type="text"
              value={formatCurrency(inputs.retiradaMensalIdeal)}
              disabled
              className="bg-gray-100 cursor-not-allowed text-financial-blue-dark font-semibold"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};