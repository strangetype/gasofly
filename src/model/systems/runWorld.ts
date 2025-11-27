import Matter from 'matter-js';

function runWorld(engine: Matter.Engine) {
	const runner = Matter.Runner.create();
	Matter.Runner.run(runner, engine);
	return runner;
}

export { runWorld };
