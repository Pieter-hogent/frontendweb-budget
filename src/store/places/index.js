import {
  createContext,
  useEffect,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from 'react';
import axios from 'axios';
import config from '../../config.json';
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
      const {
        data
      } = await axios.get(`${config.base_url}places`);
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
    dispatch(startLoading());
    try {
      const {
        data: changedPlace
      } = await axios({
        method: id ? 'put' : 'post',
        url: `${config.base_url}places/${id ?? ''}`,
        data: {
          name,
          rating
        },
      });
      console.log('changedPlace', changedPlace);
      dispatch(id ? placeUpdated(changedPlace) : placeCreated(changedPlace));
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
    dispatch(startLoading());
    try {
      await axios({
        method: 'delete',
        url: `${config.base_url}places/${id}`,
      });
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
