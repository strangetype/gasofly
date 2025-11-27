import Matter from 'matter-js';
import { GRAVITY } from '../constants/constants';

function createMatterWorld() {
	const engine = Matter.Engine.create({
		gravity: GRAVITY,
	});

	return engine;
}

export { createMatterWorld };
