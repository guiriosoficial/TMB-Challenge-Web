type RequestOptions = {
  headers?: HeadersInit;
  body?: unknown;
};

enum HTTPVerbs {
  PUT = 'PUT',
  GET = 'GET',
  POST = 'POST',
  DELETE = 'DELETE',
}

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:5000/api'

const createApiClient = (baseUrl: string) => {
  const request = async (url: string, method: string, options: RequestOptions = {}) => {
    const { headers, body } = options;
    const response = await fetch(`${baseUrl}${url}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    if (response.status === 204) {
      return null
    }

    return response.json()
  };

  return {
    get: (url: string, options?: RequestOptions) => request(url, HTTPVerbs.GET, options),
    post: (url: string, body: unknown, options?: RequestOptions) => request(url, HTTPVerbs.POST, { ...options, body }),
    put: (url: string, body: unknown, options?: RequestOptions) => request(url, HTTPVerbs.PUT, { ...options, body }),
    delete: (url: string, options?: RequestOptions) => request(url, HTTPVerbs.DELETE, options),
  };
};

const apiClient = createApiClient(apiBaseUrl)

export default apiClient;
