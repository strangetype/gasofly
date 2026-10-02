export default function animationTicker(callback: () => void) {
	let h: number;
	let stop = false;
	function render() {
		callback();
		if (stop) return;
		h = requestAnimationFrame(render);
	}
	render();
	return () => {
		cancelAnimationFrame(h);
		stop = true;
	};
}
