import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
    <Card>
      <CardHeader>
        <CardTitle>Configurações Financeiras</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="personal">Dados Pessoais</TabsTrigger>
            <TabsTrigger value="financial">Parâmetros</TabsTrigger>
            <TabsTrigger value="values">Valores</TabsTrigger>
            <TabsTrigger value="summary">Resumo</TabsTrigger>
          </TabsList>
          
          <TabsContent value="personal" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>
          </TabsContent>

          <TabsContent value="financial" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <div className="md:col-span-2">
                <Label className="text-muted-foreground">
                  Rentabilidade Real: {(((1 + inputs.rentabilidadeEsperada / 100) / (1 + inputs.inflacao / 100) - 1) * 100).toFixed(2)}%
                </Label>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="values" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <Label htmlFor="retiradaMensalIdeal">Retirada Mensal Ideal (R$)</Label>
                <Input
                  id="retiradaMensalIdeal"
                  type="text"
                  value={formatCurrency(inputs.retiradaMensalIdeal)}
                  disabled
                  className="bg-muted cursor-not-allowed font-semibold"
                />
                <p className="text-xs text-muted-foreground mt-1">Calculado automaticamente</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="summary" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Patrimônio na Aposentadoria</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-financial-success">
                    {formatCurrency(results.patrimonioAposentadoria)}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Patrimônio Final</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-financial-blue">
                    {formatCurrency(results.patrimonioFinal)}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Aportes Total</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-financial-warning">
                    {formatCurrency(results.aportesTotal)}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};