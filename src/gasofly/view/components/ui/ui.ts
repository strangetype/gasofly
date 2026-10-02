import { View } from '@/common/View';
import uiHtml from './ui.html?raw';
import './ui.scss';

export const Ui = View(
	uiHtml,
	(root) => {
		const header = root.querySelector('.ui__header') as HTMLElement;
		const leftPanel = root.querySelector('.ui__left-panel') as HTMLElement;
		const vectorControl = root.querySelector('.ui__vector-control') as HTMLElement;
		const catchControl = root.querySelector('.ui__catch-control') as HTMLElement;

		return {
			header,
			leftPanel,
			vectorControl,
			catchControl,
		};
	},
	() => {}
);

