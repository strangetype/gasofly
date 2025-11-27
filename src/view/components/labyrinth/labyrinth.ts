import { View } from '@/common/View';
import labyrinthHtml from './labyrinth.html?raw';
import './labyrinth.scss';

interface LabyrinthData {
	labyrinth: number[][];
	wallSize: number;
}

export const Labyrinth = View(labyrinthHtml, (root, data?: LabyrinthData) => {
	const container = root.querySelector('.labyrinth') as HTMLElement;

	if (!data) {
		container.innerHTML = 'no data for labyrinth provided';
		return;
	}

	const { labyrinth, wallSize } = data;

	// Clear previous walls
	container.innerHTML = '';

	// Create wall divs based on labyrinth array
	for (let y = 0; y < labyrinth.length; y++) {
		for (let x = 0; x < labyrinth[y].length; x++) {
			if (labyrinth[y][x] === 1) {
				const wall = document.createElement('div');
				wall.className = 'labyrinth__wall';
				wall.style.left = `${x * wallSize}px`;
				wall.style.top = `${y * wallSize}px`;
				wall.style.width = `${wallSize}px`;
				wall.style.height = `${wallSize}px`;
				container.appendChild(wall);
			}
		}
	}

	return {
		container,
	};
});
