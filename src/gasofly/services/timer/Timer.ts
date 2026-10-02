export default {
	timeout: (cl: () => void, int: number) => setTimeout(cl, int),
	interval: (cl: () => void, int: number) => setInterval(cl, int),
};
