import { createState } from '@/gasofly/gasoflyDC';

export const levelState = createState(
	'level',
	({ data, Matter }) => {
		return (update) => {
			Matter.Events.on(data.level.engine, 'beforeUpdate', update);
		};
	},
	() => {
		return null;
	}
);

export const createLevelSystem = levelState.createSystem;
export const addLevelSystem = levelState.addSystem;
