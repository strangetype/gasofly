import { View } from '@/common/View';
import ballHtml from './ball.html?raw';
import './ball.scss';

interface BallData {
	radius: number;
}

export const Ball = View<
	{
		setPosition: (x: number, y: number) => void;
	},
	BallData
>(ballHtml, (root, data?: BallData) => {
	const ballElement = root.querySelector('.ball') as HTMLElement;

	if (!data) {
		console.error('No data provided for Ball component');
		return {
			setPosition: () => {},
		};
	}

	const { radius } = data;

	// Set initial size based on radius
	ballElement.style.width = `${radius * 2}px`;
	ballElement.style.height = `${radius * 2}px`;

	// Method to update ball position
	function setPosition(x: number, y: number) {
		// Center the ball at the given coordinates
		ballElement.style.transform = `translate(${x - radius}px, ${y - radius}px)`;
	}

	// Initial position at (0, 0)
	setPosition(0, 0);

	return {
		setPosition,
	};
});
