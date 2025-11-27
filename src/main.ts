const app = document.querySelector<HTMLDivElement>('#app');
import { Screen } from './view/components/screen/screen';
import { Labyrinth } from './view/components/labyrinth/labyrinth';

const screen = Screen.mount(app!);
const labyrinth = Labyrinth.mount(screen.camera!, {
	labyrinth: [
		[1, 1, 1, 1, 1],
		[1, 0, 0, 0, 1],
		[1, 0, 1, 0, 1],
		[1, 0, 0, 0, 1],
		[1, 1, 1, 1, 1],
	],
	wallSize: 128,
});

console.log(screen);
