import '../level/addViewLevelSystems';
import { createViewState } from '../gasoflyViewStateMachine';

const startState = createViewState(
	'start',
	'common',
	(entities) => {
		return entities.animationTicker;
	},
	(ents) => {
		if (ents.data.common.isReady) return 'ready';
		return null;
	}
);

export default startState.runState;
