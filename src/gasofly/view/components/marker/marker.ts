import { View } from '@/common/View';
import markerHtml from './marker.html?raw';
import './marker.scss';

interface MarkerData {
	size: number;
}

export const Marker = View<
	{
		setPosition: (x: number, y: number) => void;
	},
	MarkerData
>(markerHtml, (root, data?: MarkerData) => {
	const markerElement = root.querySelector('.marker') as HTMLElement;

	const size = data?.size ?? 16;

	// Set initial size based on the given size
	markerElement.style.width = `${size}px`;
	markerElement.style.height = `${size}px`;

	// Method to update marker position (centered at the given coordinates)
	function setPosition(x: number, y: number) {
		markerElement.style.transform = `translate(${x - size / 2}px, ${y - size / 2}px)`;
	}

	// Initial position at (0, 0)
	setPosition(0, 0);

	return {
		setPosition,
	};
});
