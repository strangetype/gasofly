import Matter from 'matter-js';

function createMatterWorld(gravity: { x: number; y: number }) {
	const engine = Matter.Engine.create({
		gravity,
	});

	return engine;
}

export { createMatterWorld };
