import { createViewState } from '../gasoflyViewStateMachine';

const levelState = createViewState(
	'level',
	'level',
	(entities) => {
		return entities.animationTicker;
	},
	(ents) => {
		if (ents.data.level.levelState === 'win') {
			return 'win';
		}
		return null;
	}
);

export const createViewLevelSystem = levelState.createSystem;
export const addViewLevelSystem = levelState.addSystem;
