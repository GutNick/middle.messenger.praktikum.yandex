enum METHOD {
	GET = 'GET',
	POST = 'POST',
	PUT = 'PUT',
	PATCH = 'PATCH',
	DELETE = 'DELETE'
};

type Options = {
	method: METHOD;
	data?: unknown;
};

type OptionsWithoutMethod = Omit<Options, 'method'>;

// Helper function to convert an object into a query string
function queryStringify(data: Record<string, unknown>): string {
	return '?' + Object.entries(data).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`).join('&');
}

export class HTTPTransport {
	baseUrl: string
	constructor() {
		this.baseUrl = 'https://ya-praktikum.tech/api/v2'
	}
	get(url: string, options: OptionsWithoutMethod = {}): Promise<XMLHttpRequest> {
		const query = options.data && typeof options.data === 'object' ? queryStringify(options.data as Record<string, unknown>) : '';
		return this.request(url + query, { ...options, method: METHOD.GET });
	}

	post(url: string, options: OptionsWithoutMethod = {}): Promise<XMLHttpRequest> {
		return this.request(url, { ...options, method: METHOD.POST });
	}

	put(url: string, options: OptionsWithoutMethod = {}): Promise<XMLHttpRequest> {
		return this.request(url, { ...options, method: METHOD.PUT });
	}

	delete(url: string, options: OptionsWithoutMethod = {}): Promise<XMLHttpRequest> {
		return this.request(url, { ...options, method: METHOD.DELETE });
	}

	request(url: string, options: Options = { method: METHOD.GET }): Promise<XMLHttpRequest> {
		const { method, data } = options;

		return new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			xhr.open(method, `${this.baseUrl}${url}`);
			if (!(data instanceof FormData)) {
				xhr.setRequestHeader('Content-Type', 'application/json');
			}

			xhr.onload = function() {
				resolve(xhr);
			};

			xhr.onabort = reject;
			xhr.onerror = reject;
			xhr.ontimeout = reject;
			xhr.withCredentials = true;

			if (method === METHOD.GET || !data) {
				xhr.send();
			} else {
				xhr.send(data instanceof FormData ? data : JSON.stringify(data));
			}
		});
	}
}
