import { createLevelSystem } from '../levelSystem';

export default createLevelSystem((data, { Matter }) => {
	const runner = Matter.Runner.create();
	Matter.Runner.run(runner, data.engine!);
	data.runner = runner;
});
