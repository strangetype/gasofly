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
	(ents) => {
		if (ents.data.level.levelState === 'win') {
			return 'win';
		}
		return null;
	}
);

export const createLevelSystem = levelState.createSystem;
export const addLevelSystem = levelState.addSystem;
