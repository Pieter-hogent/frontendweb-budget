import actions from './actions';

export const initialState = {
  places: [],
  selectedId: null,
  error: null,
  loading: false,
};

export default function reducer(state, action) {
  switch (action.type) {
    case actions.PLACES_FETCH_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        places: action.payload.data,
      };
    case actions.SELECT_PLACE:
      return {
        ...state,
        selectedId: action.payload.id,
      };
    case actions.PLACE_CREATED:
      return {
        ...state,
        loading: false,
        error: null,
        places: state.places.concat(action.payload)
      };
    case actions.PLACE_UPDATED:
      return {
        ...state,
        loading: false,
        error: null,
        places: state.places.map((p) => p.id === action.payload.id ? action.payload : p)
      };
    case actions.PLACE_DELETED:
      return {
        ...state,
        loading: false,
        error: null,
        places: state.places.filter((p) => p.id !== action.payload.id),
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
      throw new Error(`PlacesReducer: ${action.type} is not a valid type`);
  }
}
