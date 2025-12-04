import { data } from '@/model/data/levelModelData';
import { State } from '@/common/State';
import { createMatterWorld } from '@/model/systems/createMatterWorld';
import { runWorld } from '@/model/systems/runWorld';
import { createLabyrinth } from '@/model/systems/createLabyrinth';
import { createBall } from '@/model/systems/createBall';
import { createBallRope } from '@/model/systems/createBallRope';
import { updateBallThrust } from '@/model/systems/updateBallThrust';
import { generateLabyrinth } from '@/model/systems/generateLabyrinth';
import { createLevelView } from '@/view/systems/createLevelView';
import Matter from 'matter-js';
import { renderBall } from '@/view/systems/renderBall';
import { renderCamera } from '@/view/systems/renderCamera';
import { renderRope } from '@/view/systems/renderRope';
import { createCubes } from '@/model/systems/createCubes';
import { spreadCubes } from '@/model/systems/spreadCubes';
import { renderCubes } from '@/view/systems/renderCubes';
import { ropeActivity } from '@/model/systems/ropeActivity';
import { checkCatch } from '@/model/systems/checkCatch';
import { releaseCatch } from '@/model/systems/releaseCatch';
import { createSquareFilledChecker } from '@/model/systems/checkSquareFilled';

export async function LevelState(appElement: HTMLElement) {
	let view: ReturnType<typeof createLevelView> | null = null;

	const checkSquareFilled = createSquareFilledChecker();

	return State<typeof data, 'win' | 'lose' | 'exit'>({
		data,
		enter: (data) => {
			return new Promise((resolve) => {
				data.labyrinth = generateLabyrinth(data.level);
				data.engine = createMatterWorld(data.gravity);
				createLabyrinth(data.engine.world, data.labyrinth, data.wallSize);
				data.ball.RigidBody = createBall(
					data.engine,
					data.labyrinth,
					data.wallSize,
					data.ball.radius
				);

				// Create rope attached to the ball
				const rope = createBallRope(data.engine, data.ball.RigidBody);
				data.rope.segments = rope.segments;
				data.rope.constraints = rope.constraints;

				data.cubes = createCubes(data.engine.world, data.cubeSize, 2);
				spreadCubes(data.engine.world, data.cubes, data.labyrinth, data.wallSize);

				data.runner = runWorld(data.engine);

				view = createLevelView(
					appElement,
					data.labyrinth,
					data.wallSize,
					data.ball.radius,
					data.cubes,
					data.rope.segments
				);

				resolve();
			});
		},
		live: (data) => {
			return new Promise((resolve) => {
				Matter.Events.on(data.engine, 'beforeUpdate', () => {
					updateBallThrust(data.ball, view!.vectorControl!.vector);

					if (data.catchedCube) {
						ropeActivity(data.rope.constraints, 64, true);
						if (view!.catchControl!.tapped[0]) {
							releaseCatch(
								data.engine!,
								data.catchedCube,
								data.rope.segments[data.rope.segments.length - 1]
							);
							data.catchedCube = false;
							view!.catchControl!.tapped[0] = false;
						}
					} else {
						const isCatching = ropeActivity(
							data.rope.constraints,
							32,
							view!.catchControl!.tapped[0]
						);

						if (isCatching && !data.catchedCube) {
							const catchedCube = checkCatch(
								data.engine!,
								data.cubes,
								data.rope.segments[data.rope.segments.length - 1]
							);

							// Если куб был пойман, constraint уже создан и добавлен в мир
							if (catchedCube) {
								console.log('Cube catched:', catchedCube);
								data.catchedCube = catchedCube;
								view!.catchControl!.tapped[0] = false;
							}
						} else if (!isCatching && view!.catchControl!.tapped[0]) {
							view!.catchControl!.tapped[0] = false;
						}
					}

					const isSquareFilled = checkSquareFilled({
						cubes: data.cubes,
						cellSize: data.cubeSize,
						cellsCount: 2,
						matchSize: data.cubeSize / 2,
					});

					if (isSquareFilled) {
						alert('Square filled');
					}

					render();
				});

				function render() {
					renderBall(
						view!.ball,
						data.ball.RigidBody!.position.x,
						data.ball.RigidBody!.position.y,
						data.ball.RigidBody!.angle
					);
					renderCamera(
						view!.screen,
						data.ball.RigidBody!.position.x,
						data.ball.RigidBody!.position.y,
						data.ball.RigidBody!.speed
					);
					renderCubes(data.cubes, view!.cubesView);
					renderRope(data.rope.segments, view!.ropeView);

					//requestAnimationFrame(render);
				}
			});
		},
		exit: (data, exitCode) => {
			return new Promise((resolve) => {
				resolve(exitCode);
			});
		},
	});
}
