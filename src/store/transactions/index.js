import {
	createContext,
	useEffect,
	useCallback,
	useMemo,
	useContext,
  useReducer,
} from 'react';
import axios from 'axios';
import config from '../../config.json';
import {
  selectTransaction,
  setError,
  startLoading,
  transactionCreated,
  transactionDeleted,
  transactionUpdated,
  transactionsFetched
} from './actions';
import reducer, { initialState } from './reducer';

const TransactionsContext = createContext();
export const useTransactionsContext = () => useContext(TransactionsContext);

const useTransactionsState = () => {
  const { state } = useTransactionsContext();
  return state;
};
export const useTransactions = () => {
  const { transactions, loading, error } = useTransactionsState();
  const value = useMemo(() => ({
    transactions, loading, error
  }), [transactions, loading, error]);
  return value;
};
export const useCurrentTransaction = () => {
  const { transactions, selectedId } = useTransactionsState();
  const { setTransactionToUpdate } = useTransactionsContext();
  return [transactions.find((t) => t.id === selectedId), setTransactionToUpdate];
};
export const useCreateOrUpdateTransaction = () => {
  const { createOrUpdateTransaction } = useTransactionsContext();
  return createOrUpdateTransaction;
};
export const useDeleteTransaction = () => {
  const { deleteTransaction } = useTransactionsContext();
  return deleteTransaction;
};

const TransactionsStore = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

	const refreshTransactions = useCallback(async () => {
		try {
      dispatch(startLoading());
			const { data } = await axios.get(
				`${config.base_url}transactions?limit=25&offset=0`
			);
      dispatch(transactionsFetched(data));
		} catch (error) {
			dispatch(setError(error));
		}
	}, []);

	const createOrUpdateTransaction = useCallback(
		async ({ id, placeId, amount, date, user }) => {
      dispatch(startLoading());

			try {
				const { data: changedTransaction } = await axios({
					method: id ? 'put' : 'post',
					url: `${config.base_url}transactions/${id ?? ''}`,
					data: {
            placeId,
            amount,
            date: date.toISOString(),
            user,
          },
				});
				dispatch((id ? transactionUpdated : transactionCreated)(changedTransaction));
			} catch (error) {
			  dispatch(setError(error));
			}
		},
		[]
	);

	const deleteTransaction = useCallback(
		async (id) => {
			try {
        dispatch(startLoading());
				await axios({
					method: 'delete',
					url: `${config.base_url}transactions/${id}`,
				});
				dispatch(transactionDeleted(id));
			} catch (error) {
			  dispatch(setError(error));
			}
		},
		[]
	);

	const setTransactionToUpdate = useCallback(
		(id) => dispatch(selectTransaction(id)),
		[]
	);

	const value = useMemo(
		() => ({
			state,
			createOrUpdateTransaction,
			deleteTransaction,
			setTransactionToUpdate,
		}),
		[
			state,
			createOrUpdateTransaction,
			deleteTransaction,
			setTransactionToUpdate,
		]
	);

  // Fetch the transactions at startup
	useEffect(() => {
    refreshTransactions();
	}, [refreshTransactions]);

	return (
		<TransactionsContext.Provider value={value}>
			{children}
		</TransactionsContext.Provider>
	);
};
export default TransactionsStore;
