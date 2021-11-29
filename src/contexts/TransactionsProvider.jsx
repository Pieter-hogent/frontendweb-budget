import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useContext,
} from "react";
import axios from "axios";
import config from "../config.json";

export const TransactionsContext = createContext();
export const useTransactions = () => useContext(TransactionsContext);

export const TransactionsProvider = ({ children }) => {
  const [initialLoad, setInitialLoad] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState({});

  const BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL || config.base_url;

  const refreshTransactions = useCallback(async () => {
    try {
      setError();
      setLoading(true);
      const { data } = await axios.get(
        `${BASE_URL}transactions?limit=25&offset=0`
      );
      setTransactions(data.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [BASE_URL]);

  useEffect(() => {
    if (!initialLoad) {
      refreshTransactions();
      setInitialLoad(true);
    }
  }, [initialLoad, refreshTransactions]);

  const createOrUpdateTransaction = useCallback(
    async ({ id, placeId, amount, date, user }) => {
      setError();
      setLoading(true);
      let data = {
        placeId,
        amount,
        date,
        user,
      };
      let method = id ? "put" : "post";
      let url = `${BASE_URL}transactions/${id ?? ""}`;
      try {
        const { changedTransaction } = await axios({
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
    },
    [refreshTransactions, BASE_URL]
  );

  const deleteTransaction = useCallback(
    async (id) => {
      try {
        setError();
        setLoading(true);
        const { data } = await axios({
          method: "delete",
          url: `${BASE_URL}transactions/${id}`,
        });
        refreshTransactions();
        return data;
      } catch (error) {
        console.log(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [refreshTransactions, BASE_URL]
  );

  const setTransactionToUpdate = useCallback(
    (id) => {
      setCurrentTransaction(
        id === null ? {} : transactions.find((t) => t.id === id)
      );
    },
    [transactions]
  );

  const value = useMemo(
    () => ({
      transactions,
      error,
      loading,
      currentTransaction,
      createOrUpdateTransaction,
      deleteTransaction,
      setTransactionToUpdate,
    }),
    [
      transactions,
      error,
      loading,
      currentTransaction,
      createOrUpdateTransaction,
      deleteTransaction,
      setTransactionToUpdate,
    ]
  );

  return (
    <TransactionsContext.Provider value={value}>
      {children}
    </TransactionsContext.Provider>
  );
};
