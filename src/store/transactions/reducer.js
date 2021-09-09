import actions from './actions';

export const initialState = {
  transactions: [],
  selectedId: null,
  error: null,
  loading: false,
};

export default function reducer(state, action) {
  switch (action.type) {
    case actions.TRANSACTIONS_FETCH_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        transactions: action.payload.data,
      };
    case actions.SELECT_TRANSACTION:
      return {
        ...state,
        selectedId: action.payload.id,
      };
    case actions.TRANSACTION_CREATED:
      return {
        ...state,
        loading: false,
        error: null,
        transactions: state.transactions.concat(action.payload)
      };
    case actions.TRANSACTION_UPDATED:
      return {
        ...state,
        loading: false,
        error: null,
        transactions: state.transactions.map((p) => p.id === action.payload.id ? action.payload : p)
      };
    case actions.TRANSACTION_DELETED:
      return {
        ...state,
        loading: false,
        error: null,
        transactions: state.transactions.filter((p) => p.id !== action.payload.id),
      }
    case actions.START_LOADING:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case actions.SET_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload.error
      };
    default:
      throw new Error(`TransactionsReducer: ${action.type} is not a valid type`);
  }
}
