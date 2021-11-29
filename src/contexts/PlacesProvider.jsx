import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
  useMemo
} from 'react';
import * as placesApi from '../api/places';
import { useSession } from './AuthProvider';

export const PlacesContext = createContext();
export const usePlaces = () => useContext(PlacesContext);

export const PlacesProvider = ({
  children
}) => {
  const { ready: authReady } = useSession();
  const [currentPlace, setCurrentPlace] = useState({});
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(false);
  const [places, setPlaces] = useState([]);

  const refreshPlaces = useCallback(async () => {
    try {
      setError();
      setLoading(true);
      const data = await placesApi.getAllPlaces();
      setPlaces(data.data);
      return data.data;
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false)
    }
  }, []);

  useEffect(() => {
    if (authReady && !initialLoad) {
      refreshPlaces();
      setInitialLoad(true);
    }
  }, [authReady, initialLoad, refreshPlaces]);

  const createOrUpdatePlace = useCallback(async ({
    id,
    name,
    rating
  }) => {
    setError();
    setLoading(true);
    try {
      const changedPlace = await placesApi.savePlace({
        id,
        name,
        rating
      });
      await refreshPlaces();
      return changedPlace;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setLoading(false)
    }
  }, [refreshPlaces]);

  const ratePlace = useCallback(async (id, rating) => {
    const place = places.find((p) => p.id === id);
    return await createOrUpdatePlace({ ...place, rating });
  }, [places, createOrUpdatePlace]);

  const deletePlace = useCallback(async (id) => {
    setLoading(true);
    setError();
    try {
      await placesApi.deletePlace(id);
      refreshPlaces();
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setLoading(false)
    }
  }, [refreshPlaces]);

  const value = useMemo(() => ({
    currentPlace,
    setCurrentPlace,
    places,
    error,
    loading,
    ratePlace,
    deletePlace,
    createOrUpdatePlace,
  }), [places, error, loading, setCurrentPlace, ratePlace, deletePlace, currentPlace, createOrUpdatePlace])

  return (
    <PlacesContext.Provider value={value}>
      {children}
    </PlacesContext.Provider>
  );
};
