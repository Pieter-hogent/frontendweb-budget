export const actions = {
  TRANSACTIONS_FETCH_SUCCESS: 'TRANSACTIONS_FETCH_SUCCESS',
  SELECT_TRANSACTION: 'SELECT_TRANSACTION',
  TRANSACTION_CREATED: 'TRANSACTION_CREATED',
  TRANSACTION_UPDATED: 'TRANSACTION_UPDATED',
  TRANSACTION_DELETED: 'TRANSACTION_DELETED',
  START_LOADING: 'START_LOADING',
  SET_ERROR: 'SET_ERROR',
};
export default actions;

export const transactionsFetched = ({ data }) => ({
  type: actions.TRANSACTIONS_FETCH_SUCCESS,
  payload: { data }
});

export const selectTransaction = (id) => ({
  type: actions.SELECT_TRANSACTION,
  payload: { id },
});

export const transactionCreated = (transaction) => ({
  type: actions.TRANSACTION_CREATED,
  payload: transaction,
});

export const transactionUpdated = (transaction) => ({
  type: actions.TRANSACTION_UPDATED,
  payload: transaction,
});

export const transactionDeleted = (id) => ({
  type: actions.TRANSACTION_DELETED,
  payload: { id },
});

export const startLoading = () => ({
  type: actions.START_LOADING,
});

export const setError = (error) => ({
  type: actions.SET_ERROR,
  payload: { error },
});
