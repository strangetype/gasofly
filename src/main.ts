const app = document.querySelector<HTMLDivElement>('#app');
import { Screen } from './view/components/screen/screen';
import { Labyrinth } from './view/components/labyrinth/labyrinth';
import { State } from './common/State';
import { data } from './model/data/data';
import { generateLabyrinth } from './model/systems/generateLabyrinth';
import { createMatterWorld } from './model/systems/createMatterWorld';
import { createLabyrinth } from './model/systems/createLabyrinth';

type LevelExitCode = 'win' | 'lose' | 'next';
type LevelData = {
	model: typeof data;
	view: {
		screen: ReturnType<typeof Screen.mount> | null;
		labyrinth: ReturnType<typeof Labyrinth.mount> | null;
	};
};

const levelData: LevelData = {
	model: data,
	view: {
		screen: null,
		labyrinth: null,
	},
};

const exitLevelCode = await State<LevelData, LevelExitCode>({
	data: levelData,
	enter: (data) => {
		return new Promise((resolve) => {
			data.model.labyrinth = generateLabyrinth(data.model.level);
			data.model.engine = createMatterWorld();
			createLabyrinth(data.model.engine, data.model.labyrinth);

			const screen = Screen.mount(app!);
			const labyrinthView = Labyrinth.mount(screen.camera!, {
				labyrinth: data.model.labyrinth,
				wallSize: 128,
			});

			data.view.screen = screen;
			data.view.labyrinth = labyrinthView;

			console.log(screen);
			resolve();
		});
	},
	live: (data) => {
		return new Promise((resolve) => {
			setInterval(() => {
				data.view.screen?.setCameraPoint(500, 500);
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
