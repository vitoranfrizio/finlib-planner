import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Calendar, 
  Plus, 
  MoreHorizontal,
  Bell
} from 'lucide-react';

export const DashboardHeader = () => {
  return (
    <header className="h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left side - Breadcrumb */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Página Inicial</span>
          <span className="text-sm text-muted-foreground">→</span>
          <span className="text-sm font-medium">Dashboard</span>
        </div>

        <div className="flex items-center justify-center flex-1">
          <h1 className="text-2xl font-bold">Dashboard Financeiro</h1>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar..."
              className="w-64 pl-8"
            />
          </div>
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Definir Período
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Objetivo
          </Button>
          <Button variant="outline" size="sm">
            Criar Relatório
          </Button>
          <Button variant="ghost" size="sm">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};