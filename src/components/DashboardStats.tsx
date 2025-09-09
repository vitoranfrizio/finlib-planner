import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  DollarSign, 
  Target, 
  Calendar,
  ArrowUpRight,
  MoreHorizontal,
  History
} from 'lucide-react';
import { formatCurrency } from '@/utils/financial';

interface DashboardStatsProps {
  results: {
    patrimonioAposentadoria: number;
    patrimonioFinal: number;
    aportesTotal: number;
  };
  inputs: {
    patrimonioInicial: number;
    retiradaMensalIdeal: number;
  };
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ results, inputs }) => {
  const currentBalance = inputs.patrimonioInicial;
  const totalEarnings = results.patrimonioAposentadoria;
  const monthlyWithdrawal = inputs.retiradaMensalIdeal;
  
  // Calculate growth percentage
  const growthPercentage = ((totalEarnings - currentBalance) / currentBalance * 100).toFixed(1);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Current Balance Card - Similar to the image */}
      <Card className="relative overflow-hidden">
        <div className="absolute top-4 right-4">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
        
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Patrimônio Disponível</p>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  BRL
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-3xl font-bold">
              {formatCurrency(currentBalance)}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button variant="secondary" size="sm">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  Investir
                </Button>
                <Button variant="outline" size="sm">
                  <History className="h-4 w-4 mr-1" />
                  Histórico
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Earnings Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Patrimônio na Aposentadoria</p>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs text-green-600 border-green-200">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +{growthPercentage}%
                </Badge>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-2">
            <div className="text-3xl font-bold text-financial-success">
              {formatCurrency(totalEarnings)}
            </div>
            <p className="text-sm text-muted-foreground">
              Crescimento projetado ao longo do tempo
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Income Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Retirada Mensal Ideal</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-financial-blue">
            {formatCurrency(monthlyWithdrawal)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Preservando o patrimônio
          </p>
        </CardContent>
      </Card>

      {/* Final Patrimony Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Patrimônio Final</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(results.patrimonioFinal)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Após todas as retiradas
          </p>
        </CardContent>
      </Card>
    </div>
  );
};