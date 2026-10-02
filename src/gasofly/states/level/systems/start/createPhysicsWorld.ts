import { createLevelSystem } from '../../levelState';

export default createLevelSystem((data, { Matter }) => {
	data.engine = Matter.Engine.create({
		gravity: data.gravity,
	});
});
