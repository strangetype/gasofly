import { View } from '@/common/View';
import cubesHtml from './cubes.html?raw';
import './cubes.scss';

interface CubeItem {
	width: number;
	height: number;
	x?: number;
	y?: number;
	rotation?: number;
}

interface CubesData {
	cubes: CubeItem[];
}

export const Cubes = View<
	{
		updateTransform: (
			callback: (
				i: number,
				setPosition: (x: number, y: number, rotation: number) => void
			) => void
		) => void;
	},
	CubesData
>(cubesHtml, (root, data?: CubesData) => {
	const container = root.querySelector('.cubes') as HTMLElement;

	if (!data || !data.cubes) {
		console.error('No data provided for Cubes component');
		return {
			updateTransform: () => {},
		};
	}

	const { cubes } = data;

	// Create cube elements
	const cubeElements: HTMLElement[] = [];

	for (let i = 0; i < cubes.length; i++) {
		const cube = cubes[i];
		const cubeElement = document.createElement('div');
		cubeElement.className = 'cubes__cube';
		cubeElement.style.width = `${cube.width}px`;
		cubeElement.style.height = `${cube.height}px`;

		// Set initial position and rotation if provided
		const x = cube.x ?? 0;
		const y = cube.y ?? 0;
		const rotation = cube.rotation ?? 0;

		cubeElement.style.transform = `translate(${x - cube.width / 2}px, ${y - cube.height / 2}px) rotate(${rotation}rad)`;

		container.appendChild(cubeElement);
		cubeElements.push(cubeElement);
	}

	// Method to update cube transforms
	function updateTransform(
		callback: (i: number, setPosition: (x: number, y: number, rotation: number) => void) => void
	) {
		// Iterate through all cubes
		for (let i = 0; i < cubeElements.length; i++) {
			const cube = cubes[i];
			const cubeElement = cubeElements[i];

			const setPosition = (x: number, y: number, rotation: number) => {
				cubeElement.style.transform = `translate(${x - cube.width / 2}px, ${y - cube.height / 2}px) rotate(${rotation}rad)`;
			};

			callback(i, setPosition);
		}
	}

	return {
		updateTransform,
		container,
	};
});
