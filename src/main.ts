const app = document.querySelector<HTMLDivElement>('#app');
import { Screen } from './view/components/screen/screen';
import { Labyrinth } from './view/components/labyrinth/labyrinth';
import { State } from './common/State';
import { data } from './model/data/data';
import { generateLabyrinth } from './model/systems/generateLabyrinth';
import { createMatterWorld } from './model/systems/createMatterWorld';
import { createLabyrinth } from './model/systems/createLabyrinth';
import { Ball } from './view/components/ball/ball';
import { createBall } from './model/systems/createBall';
import { runWorld } from './model/systems/runWorld';

type LevelExitCode = 'win' | 'lose' | 'exit';
type LevelData = {
	model: typeof data;
	view: {
		screen: ReturnType<typeof Screen.mount> | null;
		labyrinth: ReturnType<typeof Labyrinth.mount> | null;
		ball: ReturnType<typeof Ball.mount> | null;
	};
};

const levelData: LevelData = {
	model: data,
	view: {
		screen: null,
		labyrinth: null,
		ball: null,
	},
};

const exitLevelCode = await State<LevelData, LevelExitCode>({
	data: levelData,
	enter: (data) => {
		return new Promise((resolve) => {
			data.model.labyrinth = generateLabyrinth(data.model.level);
			data.model.engine = createMatterWorld(data.model.gravity);
			data.model.runner = runWorld(data.model.engine);
			createLabyrinth(data.model.engine, data.model.labyrinth, data.model.wallSize);
			data.model.ball.RigidBody = createBall(
				data.model.engine,
				data.model.labyrinth,
				data.model.wallSize,
				data.model.ball.radius
			);

			const screen = Screen.mount(app!);
			const labyrinthView = Labyrinth.mount(screen.camera!, {
				labyrinth: data.model.labyrinth,
				wallSize: data.model.wallSize,
			});

			const ballElement = document.createElement('div');
			const ballView = Ball.mount(ballElement, {
				radius: data.model.ball.radius,
			});

			labyrinthView.container.appendChild(ballElement);

			data.view.screen = screen;
			data.view.labyrinth = labyrinthView;
			data.view.ball = ballView;

			console.log(screen);
			resolve();
		});
	},
	live: (data) => {
		return new Promise((resolve) => {
			let ballX = 0;
			let ballY = 0;
			function render() {
				ballX = data.model.ball.RigidBody!.position.x;
				ballY = data.model.ball.RigidBody!.position.y;
				data.view.ball!.setPosition(ballX, ballY);

				requestAnimationFrame(render);
			}
			render();
			setInterval(() => {
				data.view.screen?.setCameraPoint(ballX, ballY);
				data.view.screen?.setCameraZoom(Math.random() * 0.8 + 0.2);
			}, 3e3);
		});
	},
	exit: (data, exitCode) => {
		return new Promise((resolve) => {
			resolve(exitCode);
		});
	},
});

console.log(exitLevelCode);
