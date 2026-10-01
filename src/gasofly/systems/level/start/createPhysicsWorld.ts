import { createLevelSystem } from '../levelSystem';

export default createLevelSystem((data, { Matter }) => {
	data.engine = Matter.Engine.create({
		gravity: data.gravity,
	});
});
