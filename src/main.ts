import { LevelState } from './states/LevelState';

const app = document.querySelector<HTMLDivElement>('#app');

const levelExitCode = await LevelState(app!);

console.log(levelExitCode);
