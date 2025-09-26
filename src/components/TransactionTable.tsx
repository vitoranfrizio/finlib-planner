import React from 'react';
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

export const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  onEditTransaction,
  onDeleteTransaction,
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(Math.abs(value));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const handleDelete = (id: string, type: string, amount: number) => {
    if (window.confirm(`Tem certeza que deseja excluir esta ${type}?`)) {
      onDeleteTransaction(id);
      toast({
        title: "Transação excluída",
        description: `${type} de ${formatCurrency(amount)} foi excluída com sucesso.`,
      });
    }
  };

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

  // Sort transactions by date (most recent first)
  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

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
              <TableHead>Data</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">
                  {formatDate(transaction.date)}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={transaction.amount > 0 ? "default" : "destructive"}
                    className={`${
                      transaction.amount > 0 
                        ? 'bg-success hover:bg-success/90' 
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
    </div>
  );
};
