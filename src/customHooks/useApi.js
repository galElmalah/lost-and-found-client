import { useState, useContext, useEffect, useCallback } from "react";
import Axios from "axios";
import { UserDetailsContext } from "../providers/UserDetailsProvider";

const defaultOptions = {
  initialData: null,
  invokeManually: false,
  data: {},
  method: "get",
};
const baseUrl =
  process.env.NODE_ENV === "production"
    ? `https://school-lost-and-found-app.herokuapp.com`
    : `http://localhost:3001`;

const getEndpoint = (endpoint, method, userId, queryParams = []) => {
  const qp = queryParams[0] === "?" ? queryParams.substring(1) : queryParams;
  const url = baseUrl + endpoint;
  if (method.toLowerCase() === "get") {
    return `${url}?userId=${userId}&${qp}`;
  }
  return url;
};

const dataMixer = (optionsData, userDetails = {}) =>
  userDetails.name ? { ...optionsData, user: userDetails } : optionsData;

export const useApi = (endpoint, options = defaultOptions) => {
  const _options = { ...defaultOptions, ...options };
  const { data: optionsData, method, initialData, invokeManually } = _options;
  const { userDetails, queryParams } = useContext(UserDetailsContext);
  const [isFetching, setIsFetching] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [data, setData] = useState(initialData);

  const _data = dataMixer(optionsData, userDetails);

  const callApi = useCallback(
    (passedData, url) => {
      console.log(url);
      return Axios.request({
        url: getEndpoint(
          url || endpoint,
          method,
          userDetails.googleId,
          queryParams
        ),
        method,
        data: passedData ? dataMixer(passedData, userDetails) : _data,
      });
    },
    [method, endpoint, _data, userDetails]
  );

  useEffect(() => {
    if (!invokeManually) {
      callApi()
        .then(({ data }) => {
          setData(data);
          return data;
        })
        .catch(setHasError)
        .finally(() => setIsFetching(false));
    }
  }, []);

  return { isFetching, data, hasError, callApi, setData };
};
