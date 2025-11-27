export function View<Component, Data>(
	html: string,
	build: (root: HTMLElement, data?: Data) => Component,
	unmount: (root: HTMLElement) => void = () => undefined
) {
	function mount(root: HTMLElement, data?: Data) {
		root.innerHTML = html;
		const component = build(root, data);
		function _unmount() {
			unmount(root);
			root.innerHTML = '';
		}
		return {
			unmount: _unmount,
			...component,
		};
	}

	return {
		mount,
	};
}
