import { useState, ChangeEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 2,
});

type FinancingFormState = {
  valor: string;
  entrada: string;
  prazo: string;
  jurosAnual: string;
  sistema: "price" | "sac";
  seguroMensal: string;
};

type FinancingResult =
  | { totalPago: number; parcelaMedia: number; entrada: number }
  | { error: string };

type ConsorcioFormState = {
  valorCarta: string;
  prazo: string;
  taxaAdministracaoAnual: string;
  inflacaoAnual: string;
  mesContemplacao: string;
  lancePercentual: string;
};

type ConsorcioResult =
  | { totalPago: number; parcelaMedia: number; lance: number }
  | { error: string };

const calculateFinancing = (form: FinancingFormState): FinancingResult => {
  const valor = Number(form.valor) || 0;
  const entrada = Number(form.entrada) || 0;
  const prazo = Number(form.prazo) || 0;
  const jurosAnual = Number(form.jurosAnual) / 100 || 0;
  const sistema = form.sistema;
  const seguro = Number(form.seguroMensal) || 0;

  if (valor <= 0 || prazo <= 0 || entrada < 0 || seguro < 0) {
    return { error: "Informe valores válidos para simular." };
  }

  const saldoInicial = Math.max(valor - entrada, 0);
  if (saldoInicial <= 0) {
    return { error: "O valor do imóvel deve ser maior que a entrada." };
  }

  const jurosMensal = Math.pow(1 + jurosAnual, 1 / 12) - 1;
  let totalPago = 0;

  if (sistema === "price") {
    if (prazo === 0) return { error: "Informe um prazo maior que zero." };
    const potencia = Math.pow(1 + jurosMensal, prazo);
    const divisor = potencia - 1;
    const parcelaBase = divisor === 0 ? saldoInicial / prazo : saldoInicial * ((jurosMensal * potencia) / divisor);
    const parcelaTotal = parcelaBase + seguro;
    totalPago = parcelaTotal * prazo;
  } else {
    let saldo = saldoInicial;
    const amortizacao = saldoInicial / prazo;
    for (let i = 0; i < prazo; i += 1) {
      const juros = saldo * jurosMensal;
      const parcela = amortizacao + juros + seguro;
      totalPago += parcela;
      saldo = Math.max(saldo - amortizacao, 0);
    }
  }

  const parcelaMedia = totalPago / prazo;
  return {
    totalPago,
    parcelaMedia,
    entrada,
  };
};

const calculateConsorcio = (form: ConsorcioFormState): ConsorcioResult => {
  const valor = Number(form.valorCarta) || 0;
  const prazo = Number(form.prazo) || 0;
  const taxaAdmAnual = Number(form.taxaAdministracaoAnual) / 100 || 0;
  const inflacaoAnual = Number(form.inflacaoAnual) / 100 || 0;
  const lancePerc = Number(form.lancePercentual) / 100 || 0;

  if (valor <= 0 || prazo <= 0 || taxaAdmAnual < 0 || inflacaoAnual < 0 || lancePerc < 0) {
    return { error: "Informe valores válidos para simular." };
  }

  const inflacaoMensal = Math.pow(1 + inflacaoAnual, 1 / 12) - 1;
  const taxaAdmMensal = taxaAdmAnual / 12;
  const parcelaBase = valor / prazo;

  let totalPago = 0;
  for (let i = 1; i <= prazo; i += 1) {
    const correcao = Math.pow(1 + inflacaoMensal, i);
    const parcela = parcelaBase * correcao + (valor / prazo) * taxaAdmMensal;
    totalPago += parcela;
  }

  const lance = valor * lancePerc;
  totalPago += lance;
  const parcelaMedia = totalPago / prazo;

  return {
    totalPago,
    parcelaMedia,
    lance,
  };
};

const formatCurrency = (value: number) => currencyFormatter.format(value);

const ConsorcioOuFinanciamento = () => {
  const [financingForm, setFinancingForm] = useState<FinancingFormState>({
    valor: "300000",
    entrada: "60000",
    prazo: "240",
    jurosAnual: "9",
    sistema: "price",
    seguroMensal: "150",
  });

  const [consorcioForm, setConsorcioForm] = useState<ConsorcioFormState>({
    valorCarta: "300000",
    prazo: "180",
    taxaAdministracaoAnual: "0.2",
    inflacaoAnual: "4",
    mesContemplacao: "24",
    lancePercentual: "0",
  });

  const [financingResult, setFinancingResult] = useState<FinancingResult>(() => calculateFinancing(financingForm));
  const [consorcioResult, setConsorcioResult] = useState<ConsorcioResult>(() => calculateConsorcio(consorcioForm));

  const handleFinancingChange = (field: keyof FinancingFormState) => (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setFinancingForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSystemChange = (value: "price" | "sac") => {
    setFinancingForm((prev) => ({ ...prev, sistema: value }));
  };

  const handleConsorcioChange = (field: keyof ConsorcioFormState) => (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setConsorcioForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleFinancingCalculate = () => {
    setFinancingResult(calculateFinancing(financingForm));
  };

  const handleConsorcioCalculate = () => {
    setConsorcioResult(calculateConsorcio(consorcioForm));
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-gradient-to-r from-financial-blue to-financial-blue-dark text-white py-10 shadow-lg">
        <div className="container mx-auto px-4 text-center space-y-3">
          <h1 className="text-3xl md:text-4xl font-bold leading-tight">
            Simulador: Consórcio vs Financiamento Imobiliário
          </h1>
          <p className="text-blue-100 max-w-2xl mx-auto text-base md:text-lg">
            Compare custos, parcelas e condições para escolher a melhor estratégia na conquista do seu imóvel.
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 space-y-8">
        <section className="text-center space-y-3">
          <h2 className="text-2xl font-semibold text-foreground">
            Consórcio ou Financiamento?
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Ajuste os parâmetros de cada modalidade para visualizar o impacto nas parcelas e no valor total desembolsado. Todas as simulações consideram valores em reais (R$) e resultados atualizados na hora.
          </p>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-primary/10">
            <CardHeader className="space-y-1.5">
              <CardTitle className="text-2xl">Financiamento Imobiliário</CardTitle>
              <CardDescription>
                Informe as condições do financiamento para estimar o custo total e a parcela média.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fin_valor">Valor do imóvel</Label>
                  <Input
                    id="fin_valor"
                    type="number"
                    min="0"
                    step="1000"
                    value={financingForm.valor}
                    onChange={handleFinancingChange("valor")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fin_entrada">Entrada</Label>
                  <Input
                    id="fin_entrada"
                    type="number"
                    min="0"
                    step="1000"
                    value={financingForm.entrada}
                    onChange={handleFinancingChange("entrada")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fin_prazo">Prazo (meses)</Label>
                  <Input
                    id="fin_prazo"
                    type="number"
                    min="1"
                    value={financingForm.prazo}
                    onChange={handleFinancingChange("prazo")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fin_juros">Taxa de juros anual (%)</Label>
                  <Input
                    id="fin_juros"
                    type="number"
                    min="0"
                    step="0.01"
                    value={financingForm.jurosAnual}
                    onChange={handleFinancingChange("jurosAnual")}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Sistema de amortização</Label>
                  <Select value={financingForm.sistema} onValueChange={handleSystemChange}>
                    <SelectTrigger aria-label="Sistema de amortização">
                      <SelectValue placeholder="Selecione o sistema" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="price">Tabela Price (parcelas fixas)</SelectItem>
                      <SelectItem value="sac">SAC (amortização constante)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fin_seguro">Seguro MIP + DFI (R$ / mês)</Label>
                  <Input
                    id="fin_seguro"
                    type="number"
                    min="0"
                    step="10"
                    value={financingForm.seguroMensal}
                    onChange={handleFinancingChange("seguroMensal")}
                  />
                </div>
              </div>

              <Button className="w-full" onClick={handleFinancingCalculate}>
                Calcular financiamento
              </Button>

              <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 text-left">
                {"error" in financingResult ? (
                  <p className="text-sm font-medium text-destructive">{financingResult.error}</p>
                ) : (
                  <div className="space-y-2 text-sm md:text-base">
                    <p>
                      <span className="font-semibold text-primary">Total pago:</span> {formatCurrency(financingResult.totalPago)}
                    </p>
                    <p>
                      <span className="font-semibold text-primary">Parcela média:</span> {formatCurrency(financingResult.parcelaMedia)}
                    </p>
                    <p>
                      <span className="font-semibold text-primary">Entrada considerada:</span> {formatCurrency(financingResult.entrada)}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/10">
            <CardHeader className="space-y-1.5">
              <CardTitle className="text-2xl">Consórcio Imobiliário</CardTitle>
              <CardDescription>
                Avalie a evolução das parcelas com taxas de administração e inflação estimadas.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cons_valor">Valor da carta de crédito</Label>
                  <Input
                    id="cons_valor"
                    type="number"
                    min="0"
                    step="1000"
                    value={consorcioForm.valorCarta}
                    onChange={handleConsorcioChange("valorCarta")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cons_prazo">Prazo (meses)</Label>
                  <Input
                    id="cons_prazo"
                    type="number"
                    min="1"
                    value={consorcioForm.prazo}
                    onChange={handleConsorcioChange("prazo")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cons_txadm">Taxa de administração anual (%)</Label>
                  <Input
                    id="cons_txadm"
                    type="number"
                    min="0"
                    step="0.01"
                    value={consorcioForm.taxaAdministracaoAnual}
                    onChange={handleConsorcioChange("taxaAdministracaoAnual")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cons_inflacao">Inflação anual esperada (%)</Label>
                  <Input
                    id="cons_inflacao"
                    type="number"
                    min="0"
                    step="0.01"
                    value={consorcioForm.inflacaoAnual}
                    onChange={handleConsorcioChange("inflacaoAnual")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cons_contemplacao">Mês de contemplação (estimado)</Label>
                  <Input
                    id="cons_contemplacao"
                    type="number"
                    min="1"
                    value={consorcioForm.mesContemplacao}
                    onChange={handleConsorcioChange("mesContemplacao")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cons_lance">Lance oferecido (%)</Label>
                  <Input
                    id="cons_lance"
                    type="number"
                    min="0"
                    step="0.1"
                    value={consorcioForm.lancePercentual}
                    onChange={handleConsorcioChange("lancePercentual")}
                  />
                </div>
              </div>

              <Button className="w-full" onClick={handleConsorcioCalculate}>
                Calcular consórcio
              </Button>

              <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 text-left">
                {"error" in consorcioResult ? (
                  <p className="text-sm font-medium text-destructive">{consorcioResult.error}</p>
                ) : (
                  <div className="space-y-2 text-sm md:text-base">
                    <p>
                      <span className="font-semibold text-primary">Total pago:</span> {formatCurrency(consorcioResult.totalPago)}
                    </p>
                    <p>
                      <span className="font-semibold text-primary">Parcela média:</span> {formatCurrency(consorcioResult.parcelaMedia)}
                    </p>
                    <p>
                      <span className="font-semibold text-primary">Lance considerado:</span> {formatCurrency(consorcioResult.lance)}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="max-w-4xl mx-auto">
          <Card className="border-0 bg-financial-blue-light/40">
            <CardHeader className="pb-0">
              <CardTitle className="text-xl text-financial-blue-dark">Dica FinLib</CardTitle>
            </CardHeader>
            <CardContent className="text-sm md:text-base text-muted-foreground">
              Compare sempre o prazo de pagamento com a segurança do seu fluxo de caixa. Use os demais módulos do FinLib Planner para avaliar como cada cenário impacta sua liberdade financeira e o equilíbrio do seu orçamento.
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default ConsorcioOuFinanciamento;
