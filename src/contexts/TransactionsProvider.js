import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useContext
} from 'react';
import axios from 'axios';
import config from '../config.json';

export const TransactionsContext = createContext();
export const useTransactions = () => useContext(TransactionsContext);

export const TransactionsProvider = ({
  children
}) => {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState({});

  const refreshTransactions = useCallback(async () => {
    try {
      setError();
      setLoading(true);
      const {
        data
      } = await axios.get(`${config.base_url}transactions?limit=25&offset=0`);
      setTransactions(data.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshTransactions();
  }, [refreshTransactions]);

  const createOrUpdateTransaction = useCallback(async ({
    id,
    placeId,
    amount,
    date,
    user
  }) => {
    setError();
    setLoading(true);
    let data = {
      placeId,
      amount,
      date,
      user
    };
    let method = id ? 'put' : 'post';
    let url = `${config.base_url}transactions/${id ?? ''}`;
    try {
      const {
        changedTransaction
      } = await axios({
        method,
        url,
        data,
      });
      await refreshTransactions();
      return changedTransaction;
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
        setLoading(false);
    }
  }, [refreshTransactions]);

  const deleteTransaction = useCallback(async (id) => {
    try {
      setError();
      setLoading(true);
      const {
        data
      } = await axios({
        method: 'delete',
        url: `${config.base_url}transactions/${id}`,
      });
      refreshTransactions();
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [refreshTransactions]);

  const setTransactionToUpdate = useCallback((id) => {
    setCurrentTransaction(id === null ? {} : transactions.find((t) => t.id === id));
  }, [transactions]);

  const value = useMemo(() => ({
    transactions,
    error,
    loading,
    currentTransaction,
    createOrUpdateTransaction,
    deleteTransaction,
    setTransactionToUpdate,
  }), [transactions, error, loading, currentTransaction, createOrUpdateTransaction,
    deleteTransaction,
    setTransactionToUpdate
  ]);

  return (
  <TransactionsContext.Provider value = {value} >
    {children}
  </TransactionsContext.Provider>
  );
};
