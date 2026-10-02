import { createLevelSystem } from '../../levelState';

export default createLevelSystem((data, { constants }) => {
	data.labyrinth = constants.FIRST_LEVEL_LABYRINTH;
});
