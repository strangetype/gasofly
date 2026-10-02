import { View } from '@/common/View';
import markerHtml from './marker.html?raw';
import './marker.scss';

interface MarkerData {
	size: number;
	schemeSize: number;
}

export const Marker = View<
	{
		setPosition: (x: number, y: number) => void;
	},
	MarkerData
>(markerHtml, (root, data?: MarkerData) => {
	const markerElement = root.querySelector('.marker') as HTMLElement;
	const schemeElement = root.querySelector('.marker__scheme') as HTMLElement;

	const size = data?.size ?? 16;
	const schemeSize = data?.schemeSize ?? 0;

	// Set initial size of the filled marker square
	markerElement.style.width = `${size}px`;
	markerElement.style.height = `${size}px`;

	// Set initial size of the outlined scheme square
	schemeElement.style.width = `${schemeSize}px`;
	schemeElement.style.height = `${schemeSize}px`;

	// Method to update marker position (centered at the given coordinates).
	// The scheme square is a child centered on the marker, so it follows automatically.
	function setPosition(x: number, y: number) {
		markerElement.style.transform = `translate(${x - size / 2}px, ${y - size / 2}px)`;
	}

	// Initial position at (0, 0)
	setPosition(0, 0);

	return {
		setPosition,
	};
});
