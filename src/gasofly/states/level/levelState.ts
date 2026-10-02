import { createState } from '@/gasofly/states/gasolfyStateMachine';

const levelState = createState(
	'level',
	'level',
	({ data, Matter }) => {
		return (update) => {
			Matter.Events.on(data.level.engine, 'beforeUpdate', update);
			return () => {
				Matter.Events.off(data.level.engine, 'beforeUpdate', update);
			};
		};
	},
	() => {
		return null;
	}
);

export const createLevelSystem = levelState.createSystem;
export const addLevelSystem = levelState.addSystem;
