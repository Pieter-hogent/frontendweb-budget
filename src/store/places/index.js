import {
  createContext,
  useEffect,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from 'react';
import {
  placeCreated,
  placeDeleted,
  placeUpdated,
  placesFetched,
  selectPlace,
  setError,
  startLoading,
} from './actions';
import reducer, { initialState } from './reducer';
import * as placesApi from '../../api/places';

const PlacesContext = createContext();

const usePlacesContext = () => useContext(PlacesContext);

const usePlacesState = () => {
  const { state } = usePlacesContext();
  return state;
};
export const usePlaces = () => {
  const { places, loading, error } = usePlacesState();
  const value = useMemo(() => ({
    places, loading, error
  }), [places, loading, error]);
  return value;
};
export const useCurrentPlace = () => {
  const { places, selectedId } = usePlacesState();
  return places.find((p) => p.id === selectedId);
};
export const useRatePlace = () => {
  const { ratePlace } = usePlacesContext();
  return ratePlace;
};
export const useCreateOrUpdatePlace = () => {
  const { createOrUpdatePlace } = usePlacesContext();
  return createOrUpdatePlace;
};
export const useDeletePlace = () => {
  const { deletePlace } = usePlacesContext();
  return deletePlace;
};

const PlacesStore = ({
  children
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const refreshPlaces = useCallback(async () => {
    try {
      dispatch(startLoading());
      const data = await placesApi.getAllPlaces();
      dispatch(placesFetched(data));
    } catch (error) {
      dispatch(setError(error));
    }
  }, []);

  const createOrUpdatePlace = useCallback(async ({
    id,
    name,
    rating
  }) => {
    try {
      dispatch(startLoading());
      const changedPlace = await placesApi.savePlace({ id, name, rating });
      dispatch((id ? placeUpdated : placeCreated)(changedPlace));
      return changedPlace;
    } catch (error) {
      dispatch(setError(error));
    }
  }, []);

  const ratePlace = useCallback(async (id, rating) => {
    const place = state.places.find((p) => p.id === id);
    return await createOrUpdatePlace({ ...place, rating });
  }, [state.places, createOrUpdatePlace]);

  const deletePlace = useCallback(async (id) => {
    try {
      dispatch(startLoading());
      await placesApi.deletePlace();
      dispatch(placeDeleted(id));
    } catch (error) {
      dispatch(setError(error));
    }
  }, []);

  const setCurrentPlace = useCallback((id) => {
    dispatch(selectPlace(id));
  }, []);

  const value = useMemo(() => ({
    state,
    setCurrentPlace,
    ratePlace,
    deletePlace,
    createOrUpdatePlace,
  }), [state, setCurrentPlace, ratePlace, deletePlace, createOrUpdatePlace])

  // Fetch the places at startup
  useEffect(() => {
    refreshPlaces();
  }, [refreshPlaces]);

  return (
    <PlacesContext.Provider value={value}>
      {children}
    </PlacesContext.Provider>
  );
};

export default PlacesStore;
