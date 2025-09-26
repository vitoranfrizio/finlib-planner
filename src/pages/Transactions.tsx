import React, { useState, useEffect, useMemo } from 'react';
import { TransactionForm, Transaction } from '@/components/TransactionForm';
import { TransactionTable } from '@/components/TransactionTable';
import { WaterfallChart } from '@/components/WaterfallChart';
import { PeriodSelector } from '@/components/PeriodSelector';
import { CategoryModal } from '@/components/CategoryModal';
import { Settings } from 'lucide-react';

const Transactions = () => {
  // Transaction management state
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  
  // Period filters
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [customPeriod, setCustomPeriod] = useState<{ start: string | null; end: string | null }>({
    start: null,
    end: null,
  });
  const [useCustomPeriod, setUseCustomPeriod] = useState(false);

  // Default categories (organized by type)
  const incomeCategories = ['Dividendos', 'Freelance', 'Salário'].sort((a,b)=>a.localeCompare(b));
  const expenseCategories = ['Alimentação','Combustível','Compras','Educação','Lazer','Moradia','Outros','Saúde','Transporte'].sort((a,b)=>a.localeCompare(b));
  const defaultCategories = [...incomeCategories, ...expenseCategories];

  // Initialize data from localStorage
  useEffect(() => {
    const savedTransactions = localStorage.getItem('financial-transactions');
    const savedCategories = localStorage.getItem('financial-categories');

    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }

    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    } else {
      setCategories(defaultCategories);
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('financial-transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('financial-categories', JSON.stringify(categories));
  }, [categories]);

  // Filter transactions based on selected period
  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      
      if (useCustomPeriod) {
        if (!customPeriod.start || !customPeriod.end) return true;
        const startDate = new Date(customPeriod.start);
        const endDate = new Date(customPeriod.end);
        return transactionDate >= startDate && transactionDate <= endDate;
      } else {
        return (
          transactionDate.getMonth() === selectedMonth &&
          transactionDate.getFullYear() === selectedYear
        );
      }
    });
  }, [transactions, selectedMonth, selectedYear, customPeriod, useCustomPeriod]);

  // Transaction handlers
  const handleAddTransaction = (transactionData: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transactionData,
      id: Date.now().toString(),
    };
    setTransactions(prev => [...prev, newTransaction]);
  };

  const handleUpdateTransaction = (updatedTransaction: Transaction) => {
    setTransactions(prev =>
      prev.map(t => t.id === updatedTransaction.id ? updatedTransaction : t)
    );
    setEditingTransaction(null);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
  };

  const handleCancelEdit = () => {
    setEditingTransaction(null);
  };

  // Category handlers
  const handleAddCategory = (category: string) => {
    setCategories(prev => [...prev, category]);
  };

  const handleRemoveCategory = (category: string) => {
    setCategories(prev => prev.filter(c => c !== category));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Same gradient as main page */}
      <header className="bg-gradient-to-r from-financial-blue to-financial-blue-dark text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-2">
            Receitas e Despesas
          </h1>
          <p className="text-center text-blue-100 text-lg">
            Gerencie suas receitas e despesas com precisão
          </p>
          <div className="absolute top-6 right-6">
            <button
              onClick={() => setIsCategoryModalOpen(true)}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2 rounded text-sm font-medium transition-smooth"
            >
              <Settings className="h-4 w-4 mr-2 inline" />
              Categorias
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">

        {/* Transaction Management Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-1 space-y-6">
            <PeriodSelector
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              customPeriod={customPeriod}
              useCustomPeriod={useCustomPeriod}
              onMonthChange={setSelectedMonth}
              onYearChange={setSelectedYear}
              onCustomPeriodChange={setCustomPeriod}
              onToggleCustomPeriod={setUseCustomPeriod}
            />
            
            <TransactionForm
              categories={categories}
              onAddTransaction={handleAddTransaction}
              onUpdateTransaction={handleUpdateTransaction}
              editingTransaction={editingTransaction}
              onCancelEdit={handleCancelEdit}
            />
          </div>
          
          <div className="xl:col-span-2">
            <TransactionTable
              transactions={filteredTransactions}
              onEditTransaction={handleEditTransaction}
              onDeleteTransaction={handleDeleteTransaction}
            />
          </div>
        </div>

        {/* Waterfall Charts: Receitas e Despesas separadas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-financial-blue-dark mb-2">Receitas por Categoria</h3>
            <WaterfallChart transactions={filteredTransactions} filter="income" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-financial-blue-dark mb-2">Despesas por Categoria</h3>
            <WaterfallChart transactions={filteredTransactions} filter="expense" />
          </div>
        </div>

        {/* Stats Overview */}
        {filteredTransactions.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card-financial text-center">
              <h3 className="text-lg font-semibold text-financial-neutral mb-2">
                Total de Transações
              </h3>
              <p className="text-3xl font-bold text-financial-blue">
                {filteredTransactions.length}
              </p>
            </div>
            
            <div className="card-financial text-center">
              <h3 className="text-lg font-semibold text-financial-neutral mb-2">
                Categorias Utilizadas
              </h3>
              <p className="text-3xl font-bold text-accent">
                {new Set(filteredTransactions.map(t => t.category)).size}
              </p>
            </div>
            
            <div className="card-financial text-center">
              <h3 className="text-lg font-semibold text-financial-neutral mb-2">
                Período Analisado
              </h3>
              <p className="text-lg font-semibold text-financial-blue-dark">
                {!useCustomPeriod 
                  ? `${new Date(selectedYear, selectedMonth).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}`
                  : customPeriod.start && customPeriod.end
                    ? `${new Date(customPeriod.start).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })} - ${new Date(customPeriod.end).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}`
                    : 'Personalizado'
                }
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-financial-blue-light py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-financial-neutral">
            © 2024 Calculadora de Liberdade Financeira - Gerencie suas finanças com inteligência
          </p>
        </div>
      </footer>

      {/* Category Management Modal */}
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        categories={categories}
        onAddCategory={handleAddCategory}
        onRemoveCategory={handleRemoveCategory}
      />
    </div>
  );
};

export default Transactions;
