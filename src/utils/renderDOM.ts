import Block from './Block';

export function render(query: string, block: Block): HTMLElement | null {
	const root = document.querySelector(query) as HTMLElement | null;

	if (root) {
		// root.innerHTML = '';
		// console.debug("root", root)
		// console.debug("block.getContent", block.getContent())
		root.appendChild(block.getContent());
		block.dispatchComponentDidMount();
	}

	return root;
}
