import React, { createContext, useState, useEffect, useRef } from "react";
import { useApi } from "../../customHooks/useApi";
import { tiles } from "./markersConfig";

export const MarkersContext = createContext();

export const MarkersProvider = ({ children }) => {
  const [initialPosition, setInitialPosition] = useState([0, 0]);
  const [tileUrl, setTile] = useState(tiles[0].url);
  const [draggableMarkerPosition, setDraggableMarker] = useState(null);
  const [center, setCenter] = useState(null);
  const { data: markers, setData: setMarkers, callApi: getMarkers } = useApi(
    "/items",
    {
      initialData: [],
    }
  );

  useEffect(() => {
    const id = setInterval(() => {
      getMarkers().then(({ data: cureentMakrers }) => {
        setMarkers(cureentMakrers);
      });
    }, 2001);
    return () => clearInterval(id);
  }, [markers]);

  const { callApi } = useApi("/items", {
    method: "post",
    invokeManually: true,
  });
  const refmarker = useRef();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setInitialPosition([latitude, longitude]);
      });
    }
  }, []);

  const enableDraggableMarker = () => {
    const [lat, lan] = initialPosition;
    setDraggableMarker([lat + 0.01, lan + 0.01]);
  };

  const disableDraggableMarker = () => {
    setDraggableMarker(null);
  };

  const updateDraggableMarker = (e) => {
    const marker = refmarker.current;
    if (marker != null) {
      setDraggableMarker(marker.leafletElement.getLatLng());
    }
  };

  const refreshMarkers = () => {
    return getMarkers().then(({ data: cureentMakrers }) => {
      setMarkers(cureentMakrers);
    });
  };
  const addMarker = (marker) => {
    return callApi({ item: marker }).then(({ data }) => {
      data && setMarkers((_markers) => [..._markers, data]);
      return data;
    });
  };

  const removeMarker = (id) => {
    setMarkers((_markers) => _markers.filter((marker) => marker.id !== id));
  };

  return (
    <MarkersContext.Provider
      value={{
        initialPosition,
        setInitialPosition,
        markers,
        addMarker,
        setMarkers,
        removeMarker,
        enableDraggableMarker,
        draggableMarkerPosition,
        updateDraggableMarker,
        refmarker,
        disableDraggableMarker,
        setCenter,
        center,
        refreshMarkers,
        tileUrl,
        setTile,
      }}
    >
      {children}
    </MarkersContext.Provider>
  );
};
