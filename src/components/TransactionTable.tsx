import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Edit2, Trash2, Receipt } from 'lucide-react';
import { Transaction } from './TransactionForm';
import { toast } from '@/hooks/use-toast';

interface TransactionTableProps {
  transactions: Transaction[];
  onEditTransaction: (transaction: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
}

type SortKey = 'date' | 'type' | 'category' | 'description' | 'amount';

export const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  onEditTransaction,
  onDeleteTransaction,
}) => {
  const itemsPerPage = 8;
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(Math.abs(value));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'asc' | 'desc' }>({
    key: 'date',
    direction: 'desc',
  });
  const [currentPage, setCurrentPage] = useState(1);

  const handleDelete = (id: string, type: string, amount: number) => {
    if (window.confirm(`Tem certeza que deseja excluir esta ${type}?`)) {
      onDeleteTransaction(id);
      toast({
        title: "Transação excluída",
        description: `${type} de ${formatCurrency(amount)} foi excluída com sucesso.`,
      });
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [transactions.length]);

  const getSortValue = (transaction: Transaction, key: SortKey) => {
    switch (key) {
      case 'date':
        return new Date(transaction.date).getTime();
      case 'type':
        return transaction.amount > 0 ? 'Receita' : 'Despesa';
      case 'category':
        return transaction.category || '';
      case 'description':
        return transaction.description || '';
      case 'amount':
        return transaction.amount;
      default:
        return '';
    }
  };

  const sortedTransactions = useMemo(() => {
    const sorted = [...transactions].sort((a, b) => {
      const aValue = getSortValue(a, sortConfig.key);
      const bValue = getSortValue(b, sortConfig.key);

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return sortConfig.direction === 'asc'
        ? String(aValue).localeCompare(String(bValue), 'pt-BR', { sensitivity: 'base' })
        : String(bValue).localeCompare(String(aValue), 'pt-BR', { sensitivity: 'base' });
    });

    return sorted;
  }, [transactions, sortConfig]);

  const totalPages = Math.max(1, Math.ceil(sortedTransactions.length / itemsPerPage));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedTransactions.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedTransactions, currentPage]);

  const handleSort = (key: SortKey) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: key === 'date' ? 'desc' : 'asc' };
    });
    setCurrentPage(1);
  };

  const renderSortIndicator = (key: SortKey) => {
    if (sortConfig.key !== key) {
      return <span className="text-muted-foreground">↕</span>;
    }
    return sortConfig.direction === 'asc' ? <span>↑</span> : <span>↓</span>;
  };

  const SortableHeader: React.FC<{ label: string; sortKey: SortKey; align?: 'left' | 'right' }>
    = ({ label, sortKey, align = 'left' }) => (
      <button
        type="button"
        onClick={() => handleSort(sortKey)}
        className={`flex items-center gap-1 text-sm font-medium ${
          align === 'right' ? 'ml-auto justify-end' : 'justify-start'
        } text-foreground hover:text-primary transition-smooth`}
      >
        {label}
        {renderSortIndicator(sortKey)}
      </button>
    );

  if (transactions.length === 0) {
    return (
      <div className="card-financial">
        <div className="flex items-center gap-2 mb-4">
          <Receipt className="h-5 w-5 text-primary" />
          <h3 className="section-title text-lg">Histórico de Transações</h3>
        </div>
        <p className="text-sm label-teal mb-4">
          Suas receitas e despesas aparecerão aqui
        </p>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Receipt className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">
            Nenhuma transação encontrada
          </h3>
          <p className="text-sm text-muted-foreground">
            Adicione sua primeira receita ou despesa para começar
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card-financial">
      <div className="flex items-center gap-2 mb-4">
        <Receipt className="h-5 w-5 text-primary" />
        <h3 className="section-title text-lg">Histórico de Transações</h3>
      </div>
      <p className="text-sm label-teal mb-4">
        {transactions.length} transação(ões) registrada(s)
      </p>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <SortableHeader label="Data" sortKey="date" />
              </TableHead>
              <TableHead>
                <SortableHeader label="Tipo" sortKey="type" />
              </TableHead>
              <TableHead>
                <SortableHeader label="Categoria" sortKey="category" />
              </TableHead>
              <TableHead>
                <SortableHeader label="Descrição" sortKey="description" />
              </TableHead>
              <TableHead className="text-right">
                <SortableHeader label="Valor" sortKey="amount" align="right" />
              </TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">
                  {formatDate(transaction.date)}
                </TableCell>
                <TableCell>
                  <Badge 
                    className={`${
                      transaction.amount > 0 
                        ? 'bg-financial-blue hover:bg-financial-blue/90 text-white border-transparent'
                        : 'bg-destructive hover:bg-destructive/90'
                    } text-white`}
                  >
                    {transaction.amount > 0 ? 'Receita' : 'Despesa'}
                  </Badge>
                </TableCell>
                <TableCell>{transaction.category}</TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {transaction.description || '-'}
                </TableCell>
                <TableCell className={`text-right font-semibold ${
                  transaction.amount > 0 ? 'value-text' : 'text-destructive'
                }`}>
                  {transaction.amount > 0 ? '' : '-'}{formatCurrency(transaction.amount)}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditTransaction(transaction)}
                      className="h-8 w-8 p-0 hover:bg-primary/10"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(
                        transaction.id, 
                        transaction.amount > 0 ? 'receita' : 'despesa',
                        transaction.amount
                      )}
                      className="h-8 w-8 p-0 hover:bg-destructive/10 text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-sm text-muted-foreground">
          Página {currentPage} de {totalPages}
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Próxima
          </Button>
        </div>
      </div>
    </div>
  );
};
