import '../level/addLevelSystems';
import { createState } from '../gasolfyStateMachine';

const startState = createState(
	'start',
	'common',
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
		if (entities.data.level.counter > 128) {
			entities.data.common.isReady = true;
			return 'ready';
		}
		return null;
	}
);

const runStartState = startState.runState;

export default runStartState;
