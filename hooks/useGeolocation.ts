
import { useState, useEffect } from 'react';

interface GeolocationState {
  loading: boolean;
  error: GeolocationPositionError | null;
  data: GeolocationCoordinates | null;
}

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    loading: true,
    error: null,
    data: null,
  });

  const fetchLocation = () => {
    setState({ loading: true, error: null, data: null });
    if (!navigator.geolocation) {
      setState(s => ({ ...s, loading: false, error: { message: "Geolocation not supported", code: 0, PERMISSION_DENIED: 1, POSITION_UNAVAILABLE: 2, TIMEOUT: 3 } as GeolocationPositionError}));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          loading: false,
          error: null,
          data: position.coords,
        });
      },
      (error) => {
        setState({
          loading: false,
          error,
          data: null,
        });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };
  
  // We don't fetch on mount, but provide a function to be called on demand
  return { ...state, fetchLocation };
};
