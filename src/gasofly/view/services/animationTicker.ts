export default function animationTicker(callback: () => void) {
	let h: number;
	let _stop = false;
	function render() {
		callback();
		if (_stop) return;
		h = requestAnimationFrame(render);
	}
	render();
	return () => {
		cancelAnimationFrame(h);
		_stop = true;
	};
}
