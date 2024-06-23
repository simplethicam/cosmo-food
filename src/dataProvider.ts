import axios, { AxiosInstance } from "axios";
import { stringify } from "query-string";
import { DataProvider } from "@refinedev/core";
import { generateFilter, generateSort } from "@refinedev/simple-rest";

type MethodTypes = "get" | "delete" | "head" | "options";
type MethodTypesWithBody = "post" | "put" | "patch";

const axiosInstance = axios.create();

const TOKEN_KEY = "cosmo-auth";

axios.interceptors.response.use(
  response => response,
  error => {
    console.log("AXIOS INTERCEPT ERROR -> ", error)
  }
)

const getAuthHeaders = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const dataProvider = (
  apiUrl: string, 
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

    return {
      data: data.body.body,
      total: total || data.length,
    };
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

    console.log("Headers: ", headers)

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
    
    console.log("RequestMethod update: ", requestMethod)
    
    console.log("variables update: ", variables)

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
    return apiUrl;
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
