import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, X, FolderPlus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: string[];
  onAddCategory: (category: string) => void;
  onRemoveCategory: (category: string) => void;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  categories,
  onAddCategory,
  onRemoveCategory,
}) => {
  const [newCategory, setNewCategory] = useState('');

  const defaultCategories = [
    'Alimentação',
    'Combustível', 
    'Lazer',
    'Moradia',
    'Transporte',
    'Saúde',
    'Educação',
    'Compras',
    'Salário',
    'Freelance',
    'Investimentos',
    'Outros'
  ];

  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, digite o nome da categoria.",
        variant: "destructive",
      });
      return;
    }

    if (categories.includes(newCategory.trim())) {
      toast({
        title: "Categoria já existe",
        description: "Esta categoria já está cadastrada.",
        variant: "destructive",
      });
      return;
    }

    onAddCategory(newCategory.trim());
    setNewCategory('');
    toast({
      title: "Categoria adicionada",
      description: `A categoria "${newCategory.trim()}" foi adicionada com sucesso.`,
    });
  };

  const handleRemoveCategory = (category: string) => {
    if (defaultCategories.includes(category)) {
      toast({
        title: "Não é possível remover",
        description: "Categorias padrão não podem ser removidas.",
        variant: "destructive",
      });
      return;
    }

    if (window.confirm(`Deseja realmente remover a categoria "${category}"?`)) {
      onRemoveCategory(category);
      toast({
        title: "Categoria removida",
        description: `A categoria "${category}" foi removida com sucesso.`,
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddCategory();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <FolderPlus className="h-5 w-5 text-primary" />
            <DialogTitle>Gerenciar Categorias</DialogTitle>
          </div>
          <DialogDescription>
            Adicione ou remova categorias para organizar suas transações
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Add new category */}
          <div className="space-y-2">
            <Label htmlFor="newCategory">Nova Categoria</Label>
            <div className="flex gap-2">
              <Input
                id="newCategory"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite o nome da categoria"
                className="flex-1"
              />
              <Button onClick={handleAddCategory} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Categories list */}
          <div className="space-y-2">
            <Label>Categorias Cadastradas ({categories.length})</Label>
            <div className="max-h-60 overflow-y-auto border rounded-md p-3">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Badge
                    key={category}
                    variant="secondary"
                    className="flex items-center gap-1 px-3 py-1"
                  >
                    <span>{category}</span>
                    {!defaultCategories.includes(category) && (
                      <button
                        onClick={() => handleRemoveCategory(category)}
                        className="ml-1 hover:text-destructive transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </Badge>
                ))}
              </div>
              {categories.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhuma categoria cadastrada
                </p>
              )}
            </div>
          </div>

          {/* Default categories info */}
          <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-md">
            <p className="font-medium mb-1">Categorias padrão:</p>
            <p>As categorias padrão (Alimentação, Combustível, etc.) não podem ser removidas.</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
