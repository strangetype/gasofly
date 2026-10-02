import { createViewState } from '../gasoflyViewStateMachine';

const levelState = createViewState(
	'level',
	'level',
	(entities) => {
		return entities.animationTicker;
	},
	(ents) => {
		return null;
	}
);

export const createViewLevelSystem = levelState.createSystem;
export const addViewLevelSystem = levelState.addSystem;
