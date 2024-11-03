export class BaseAPI {
	create(data: unknown): unknown {
		console.debug(data)
		throw new Error('Not implemented');
	}

	request() { throw new Error('Not implemented'); }

	update(data: unknown): unknown {
		console.debug(data)
		throw new Error('Not implemented');
	}

	delete(data: unknown): unknown {
		console.debug(data)
		throw new Error('Not implemented');
	}
}
