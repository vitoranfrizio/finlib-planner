import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export interface Transaction {
  id: string;
  date: string;
  type: 'receita' | 'despesa';
  amount: number;
  category: string;
  description?: string;
}

interface TransactionFormProps {
  categories: string[];
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  onUpdateTransaction: (transaction: Transaction) => void;
  editingTransaction: Transaction | null;
  onCancelEdit: () => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  categories,
  onAddTransaction,
  onUpdateTransaction,
  editingTransaction,
  onCancelEdit,
}) => {
  const [formData, setFormData] = useState({
    date: editingTransaction?.date || new Date().toISOString().split('T')[0],
    type: editingTransaction?.type || 'receita' as 'receita' | 'despesa',
    amount: editingTransaction?.amount || 0,
    category: editingTransaction?.category || '',
    description: editingTransaction?.description || '',
  });
  const [amountFocused, setAmountFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.date || !formData.category || formData.amount <= 0) {
      toast({
        title: "Erro de validação",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const transactionData = {
      date: formData.date,
      type: formData.type,
      amount: formData.type === 'despesa' ? -Math.abs(formData.amount) : Math.abs(formData.amount),
      category: formData.category,
      description: formData.description,
    };

    if (editingTransaction) {
      onUpdateTransaction({ ...transactionData, id: editingTransaction.id });
      toast({
        title: "Transação atualizada",
        description: "A transação foi atualizada com sucesso.",
      });
    } else {
      onAddTransaction(transactionData);
      toast({
        title: "Transação adicionada",
        description: "A transação foi adicionada com sucesso.",
      });
    }

    // Reset form
    setFormData({
      date: new Date().toISOString().split('T')[0],
      type: 'receita',
      amount: 0,
      category: '',
      description: '',
    });
  };

  const handleCancel = () => {
    onCancelEdit();
    setFormData({
      date: new Date().toISOString().split('T')[0],
      type: 'receita',
      amount: 0,
      category: '',
      description: '',
    });
  };

  React.useEffect(() => {
    if (editingTransaction) {
      setFormData({
        date: editingTransaction.date,
        type: editingTransaction.type,
        amount: Math.abs(editingTransaction.amount),
        category: editingTransaction.category,
        description: editingTransaction.description || '',
      });
    }
  }, [editingTransaction]);

  return (
    <div className="card-financial">
      <div className="flex items-center gap-2 mb-4">
        {editingTransaction ? <Edit className="h-5 w-5 text-primary" /> : <PlusCircle className="h-5 w-5 text-primary" />}
        <h3 className="section-title text-lg">
          {editingTransaction ? 'Editar Transação' : 'Nova Transação'}
        </h3>
      </div>
      <p className="text-sm label-teal mb-4">
        {editingTransaction ? 'Edite os dados da transação' : 'Adicione uma nova receita ou despesa'}
      </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-title-blue">Data</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="input-field w-full focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-title-blue">Tipo</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'receita' | 'despesa' })}
                className="input-field w-full focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="receita">Receita</option>
                <option value="despesa">Despesa</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-title-blue">Valor (R$)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={amountFocused && formData.amount === 0 ? '' : formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                className="input-field w-full focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="0,00"
                required
                onFocus={() => setAmountFocused(true)}
                onBlur={() => setAmountFocused(false)}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-title-blue">Categoria</label>
              {(() => {
                const expenseOnlySet = new Set(['alimentação','combustível','lazer','moradia','transporte','saúde','educação','compras','outros']);
                const incomeOnlySet = new Set(['salário','freelance','dividendos']);

                let filteredCategories = categories.filter((category) => {
                  const key = category.toLowerCase();
                  if (formData.type === 'despesa') return expenseOnlySet.has(key);
                  // When type is receita, show only income categories
                  return incomeOnlySet.has(key);
                });
                filteredCategories = filteredCategories.sort((a,b)=>a.localeCompare(b));
                return (
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="input-field w-full focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  >
                    <option value="">Selecione a categoria</option>
                    {filteredCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                );
              })()}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-title-blue">Descrição (opcional)</label>
            <input
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-field w-full focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Descrição da transação"
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="submit"
              className={`flex-1 ${formData.type === 'receita' ? 'btn-income' : 'btn-expense'}`}
            >
              {editingTransaction ? 'Atualizar' : 'Adicionar'} {formData.type === 'receita' ? 'Receita' : 'Despesa'}
            </Button>
            {editingTransaction && (
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancelar
              </Button>
            )}
          </div>
        </form>
    </div>
  );
};
