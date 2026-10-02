import '../level/addLevelSystems';
import { createState } from '../gasolfyStateMachine';

const startState = createState(
	'start',
	'level',
	(entities) => {
		return (callback) => {
			const int = entities.Timer.interval(() => {
				callback();
				entities.data.level.counter++;
			}, 16);
			return () => clearInterval(int);
		};
	},
	(entities) => {
		if (entities.data.level.counter > 128) return 'ready';
		return null;
	}
);

const runStartState = startState.runState;

export default runStartState;
