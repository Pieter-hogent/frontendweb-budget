export const actions = {
  PLACES_FETCH_SUCCESS: 'PLACES_FETCH_SUCCESS',
  SELECT_PLACE: 'SELECT_PLACE',
  PLACE_CREATED: 'PLACE_CREATED',
  PLACE_UPDATED: 'PLACE_UPDATED',
  PLACE_DELETED: 'PLACE_DELETED',
  START_LOADING: 'START_LOADING',
  SET_ERROR: 'SET_ERROR',
};
export default actions;

export const placesFetched = ({ data }) => ({
  type: actions.PLACES_FETCH_SUCCESS,
  payload: { data }
});

export const selectPlace = (id) => ({
  type: actions.SELECT_PLACE,
  payload: { id },
});

export const placeCreated = (place) => ({
  type: actions.PLACE_CREATED,
  payload: place,
});

export const placeUpdated = (place) => ({
  type: actions.PLACE_UPDATED,
  payload: place,
});

export const placeDeleted = (id) => ({
  type: actions.PLACE_DELETED,
  payload: { id },
});

export const startLoading = () => ({
  type: actions.START_LOADING,
});

export const setError = (error) => ({
  type: actions.SET_ERROR,
  payload: { error },
});
