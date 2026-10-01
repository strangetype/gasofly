export default function SystemsEngine<Data, Services>(data: Data, services: Services) {
	type Hook = 'start' | 'cycle' | 'end';
	type System = (data: Data, services: Services) => void;

	const systems: { [hook in Hook]: System[] } = {
		start: [],
		cycle: [],
		end: [],
	};

	const start = systems.start;
	const cycle = systems.cycle;
	const end = systems.end;

	return {
		createSystem(system: System) {
			return system;
		},
		addSystem(hook: Hook, system: System) {
			systems[hook].push(system);
		},
		start() {
			for (let i = 0; i < start.length; i++) {
				start[i](data, services);
			}
		},
		update() {
			for (let i = 0; i < cycle.length; i++) {
				cycle[i](data, services);
			}
		},
		end() {
			for (let i = 0; i < end.length; i++) {
				end[i](data, services);
			}
		},
	};
}
