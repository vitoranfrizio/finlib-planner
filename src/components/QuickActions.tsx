import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Calculator, 
  TrendingUp, 
  Target, 
  PieChart,
  BarChart3,
  Wallet,
  CreditCard,
  Repeat
} from 'lucide-react';

const actions = [
  {
    icon: Calculator,
    name: 'Simulação',
    description: 'Simular cenários',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: TrendingUp,
    name: 'Investimentos',
    description: 'Comparar opções',
    color: 'bg-green-50 text-green-600',
  },
  {
    icon: Target,
    name: 'Metas',
    description: 'Definir objetivos',
    color: 'bg-purple-50 text-purple-600',
  },
  {
    icon: PieChart,
    name: 'Análises',
    description: 'Ver sensibilidade',
    color: 'bg-orange-50 text-orange-600',
  },
  {
    icon: BarChart3,
    name: 'Relatórios',
    description: 'Gerar gráficos',
    color: 'bg-indigo-50 text-indigo-600',
  },
  {
    icon: Wallet,
    name: 'Carteira',
    description: 'Ver patrimônio',
    color: 'bg-teal-50 text-teal-600',
  },
  {
    icon: CreditCard,
    name: 'Aportes',
    description: 'Ajustar valores',
    color: 'bg-pink-50 text-pink-600',
  },
  {
    icon: Repeat,
    name: 'Rebalancear',
    description: 'Otimizar portfolio',
    color: 'bg-amber-50 text-amber-600',
  },
];

export const QuickActions = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Ações Rápidas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-4">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                className="flex flex-col items-center p-3 rounded-lg hover:bg-accent transition-colors group"
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${action.color} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-sm font-medium text-center">{action.name}</div>
                <div className="text-xs text-muted-foreground text-center">{action.description}</div>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};