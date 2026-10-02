import { View } from '@/common/View';
import ropeHtml from './rope.html?raw';
import './rope.scss';

interface RopeSegment {
	radius: number;
	x?: number;
	y?: number;
}

interface RopeData {
	segments: RopeSegment[];
}

export const Rope = View(ropeHtml, (root, data?: RopeData) => {
	const container = root.querySelector('.rope') as HTMLElement;

	if (!data || !data.segments) {
		console.error('No data provided for Rope component');
		return {
			updateTransform: () => {},
		};
	}

	const { segments } = data;

	// Create segment elements and lines
	const segmentElements: HTMLElement[] = [];
	const lineElements: SVGLineElement[] = [];

	// Create SVG for lines
	const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	svg.setAttribute('class', 'rope__svg');
	container.appendChild(svg);

	// Create lines between segments (n-1 lines for n segments)
	for (let i = 0; i < segments.length - 1; i++) {
		const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
		line.setAttribute('class', 'rope__line');
		svg.appendChild(line);
		lineElements.push(line);
	}

	// Create segment elements
	for (let i = 0; i < segments.length; i++) {
		const segment = segments[i];
		const segmentElement = document.createElement('div');
		segmentElement.className = 'rope__segment';
		segmentElement.style.width = `${segment.radius * 2}px`;
		segmentElement.style.height = `${segment.radius * 2}px`;

		// Set initial position if provided
		const x = segment.x ?? 0;
		const y = segment.y ?? 0;

		segmentElement.style.transform = `translate(${x - segment.radius}px, ${y - segment.radius}px)`;

		container.appendChild(segmentElement);
		segmentElements.push(segmentElement);
	}

	// Method to update segment transforms
	function updateTransform(
		callback: (i: number, setPosition: (x: number, y: number) => void) => void
	) {
		const segmentPositions: { x: number; y: number }[] = [];

		// Iterate through all segments
		for (let i = 0; i < segmentElements.length; i++) {
			const segment = segments[i];
			const segmentElement = segmentElements[i];

			const setPosition = (x: number, y: number) => {
				segmentElement.style.transform = `translate(${x - segment.radius}px, ${y - segment.radius}px)`;
				segmentPositions.push({ x, y });
			};

			callback(i, setPosition);
		}

		// Update lines between segments
		for (let i = 0; i < lineElements.length; i++) {
			// Connect current segment to next segment
			lineElements[i].setAttribute('x1', segmentPositions[i].x.toString());
			lineElements[i].setAttribute('y1', segmentPositions[i].y.toString());
			lineElements[i].setAttribute('x2', segmentPositions[i + 1].x.toString());
			lineElements[i].setAttribute('y2', segmentPositions[i + 1].y.toString());
		}
	}

	return {
		updateTransform,
		container,
	};
});
