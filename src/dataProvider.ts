import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from "axios";
import { stringify } from "query-string";
import { DataProvider } from "@refinedev/core";
import { generateFilter, generateSort } from "@refinedev/simple-rest";
import { authProvider } from './authProvider';

type MethodTypes = "get" | "delete" | "head" | "options";
type MethodTypesWithBody = "post" | "put" | "patch";

const axiosInstance = axios.create();

const TOKEN_KEY = "cosmo-auth";
let errorCount = 0;
const MAX_RETRIES = 3;

const getAuthHeaders = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Add a response interceptor
axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    if (error.code === 'ERR_NETWORK') {
      if (errorCount >= MAX_RETRIES) {
        return Promise.reject(error);
      }

      errorCount++;

      const checkResponse = await authProvider.check();
      if (checkResponse.authenticated) {
        const config: AxiosRequestConfig = error.config;
        config.headers = { ...config.headers, ...getAuthHeaders() };
        return axiosInstance.request(config);
      } else {
        await authProvider.logout({});
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export const dataProvider = (
  apiUrl?: string, 
  httpClient: AxiosInstance = axiosInstance,
): Omit<
  Required<DataProvider>,
  "createMany" | "updateMany" | "deleteMany"
> => ({
  getList: async ({ resource, pagination, filters, sorters, meta }) => {
    const url = `${meta?.url}/${resource}${meta?.all}`;

    const { current = 1, pageSize = 10, mode = "server" } = pagination ?? {};

    const { headers: headersFromMeta, method } = meta ?? {};
    const requestMethod = (method as MethodTypes) ?? "get";

    const queryFilters = generateFilter(filters);

    const query: {
      _start?: number;
      _end?: number;
      _sort?: string;
      _order?: string;
    } = {};

    if (mode === "server") {
      query._start = (current - 1) * pageSize;
      query._end = current * pageSize;
    }

    const generatedSort = generateSort(sorters);
    if (generatedSort) {
      const { _sort, _order } = generatedSort;
      query._sort = _sort.join(",");
      query._order = _order.join(",");
    }

    const combinedQuery = { ...query, ...queryFilters };
    const urlWithQuery = Object.keys(combinedQuery).length
      ? `${url}?${stringify(combinedQuery)}`
      : url;

    const { data, headers } = await httpClient[requestMethod](urlWithQuery, {
      headers: {
        ...headersFromMeta,
        ...getAuthHeaders(),
      },
    });

    const total = +headers["x-total-count"];

    if(data.body === undefined) {
      return {
        data: data,
        total: total || data.length,
      };
    } else {
      return {
        data: data.body.body,
        total: total || data.length,
      };
    }
  },

  getMany: async ({ resource, ids, meta }) => {
    const { headers, method } = meta ?? {};
    const requestMethod = (method as MethodTypes) ?? "get";

    const { data } = await httpClient[requestMethod](
      `${meta?.url}/${resource}?${stringify({ id: ids })}`,
      { headers: { ...headers, ...getAuthHeaders() } },
    );

    return {
      data: data.body.body,
    };
  },

  create: async ({ variables, meta }) => {
    const url = `${meta?.url}/${meta?.resource}`;

    const { headers, method } = meta ?? {};
    const requestMethod = (method as MethodTypesWithBody) ?? "post";

    const { data } = await httpClient[requestMethod](url, variables, {
      headers: { 
        ...headers, 
        ...getAuthHeaders(), 
      },
    });

    return {
      data: data.body.body,
    };
  },

  update: async ({ variables, meta }) => {
    const url = `${meta?.url}/${meta?.resource}`;

    const { headers, method } = meta ?? {};

    const requestMethod = (method as MethodTypesWithBody) ?? "put";

    const { data } = await httpClient[requestMethod](url, variables, {
      headers: { ...headers, ...getAuthHeaders() },
    });

    return {
      data: data.body.body,
    };
  },

  getOne: async ({ id, meta }) => {
    const url = `${meta?.url}/${meta?.resource}/${id}`;

    const { headers, method } = meta ?? {};
    const requestMethod = (method as MethodTypes) ?? "get";

    const { data } = await httpClient[requestMethod](url, { headers: { ...headers, ...getAuthHeaders() } });

    return {
      data: data.body.body,
    };
  },

  deleteOne: async ({ id, variables, meta }) => {
    const url = `${meta?.url}/${meta?.resource}/${id}`;

    const { headers, method } = meta ?? {};
    const requestMethod = (method as MethodTypesWithBody) ?? "delete";

    const { data } = await httpClient[requestMethod](url, {
      data: variables,
      headers: { ...headers, ...getAuthHeaders() },
    });

    return {
      data: data.body.body,
    };
  },

  getApiUrl: () => {
    return '';
  },

  custom: async ({
    url,
    method,
    filters,
    sorters,
    payload,
    query,
    headers,
  }) => {
    let requestUrl = `${url}?`;

    if (sorters) {
      const generatedSort = generateSort(sorters);
      if (generatedSort) {
        const { _sort, _order } = generatedSort;
        const sortQuery = {
          _sort: _sort.join(","),
          _order: _order.join(","),
        };
        requestUrl = `${requestUrl}&${stringify(sortQuery)}`;
      }
    }

    if (filters) {
      const filterQuery = generateFilter(filters);
      requestUrl = `${requestUrl}&${stringify(filterQuery)}`;
    }

    if (query) {
      requestUrl = `${requestUrl}&${stringify(query)}`;
    }

    let axiosResponse;
    switch (method) {
      case "put":
      case "post":
      case "patch":
        axiosResponse = await httpClient[method](url, payload, {
          headers: { ...headers, ...getAuthHeaders() },
        });
        break;
      case "delete":
        axiosResponse = await httpClient.delete(url, {
          headers: { ...headers, ...getAuthHeaders() },
          data: payload,
        });
        break;
      default:
        axiosResponse = await httpClient.get(requestUrl, {
          headers: { ...headers, ...getAuthHeaders() },
        });
        break;
    }

    const { data } = axiosResponse;

    return { data };
  },
});
