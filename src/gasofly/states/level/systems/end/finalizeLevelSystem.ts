import { createLevelSystem } from '../../levelState';

export default createLevelSystem((data) => {
	if (data.isCubeAssembled) {
		data.level++;
	}
});
