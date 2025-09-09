import React from 'react';
import { Card } from '@/components/ui/card';
import { 
  Calculator, 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  Target,
  Settings,
  User,
  DollarSign 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  {
    title: 'Dashboard',
    icon: BarChart3,
    active: true,
  },
  {
    title: 'Calculadora',
    icon: Calculator,
    active: false,
  },
  {
    title: 'Investimentos',
    icon: TrendingUp,
    active: false,
  },
  {
    title: 'Análises',
    icon: PieChart,
    active: false,
  },
  {
    title: 'Metas',
    icon: Target,
    active: false,
  },
];

const shortcuts = [
  {
    title: 'Patrimônio',
    icon: DollarSign,
  },
  {
    title: 'Perfil',
    icon: User,
  },
  {
    title: 'Configurações',
    icon: Settings,
  },
];

export const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Calculator className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <div className="text-sm font-medium text-sidebar-foreground">Finanças</div>
          </div>
        </div>
      </div>

      {/* Main Menu */}
      <div className="flex-1 p-4">
        <nav className="space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  item.active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <Icon className="w-4 h-4" />
                {item.title}
              </button>
            );
          })}
        </nav>

        {/* Shortcuts */}
        <div className="mt-8">
          <div className="text-xs font-medium text-sidebar-foreground/60 uppercase tracking-wider mb-3 px-3">
            Atalhos
          </div>
          <nav className="space-y-1">
            {shortcuts.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={index}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                >
                  <Icon className="w-4 h-4" />
                  {item.title}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom upgrade card */}
      <div className="p-4">
        <Card className="p-4 bg-gradient-to-b from-primary/10 to-primary/5 border-primary/20">
          <div className="space-y-2">
            <div className="text-sm font-medium">Plano Premium</div>
            <div className="text-xs text-muted-foreground">
              Tenha acesso a análises avançadas e relatórios completos.
            </div>
            <button className="w-full bg-primary text-primary-foreground text-xs py-2 px-3 rounded-md font-medium hover:bg-primary/90 transition-colors">
              Upgrade Agora
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};