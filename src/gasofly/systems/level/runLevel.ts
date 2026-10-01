import { addLevelSystem, levelState } from './levelSystem';
import generateLabyrinth from './start/generateLabyrinth';
import createPhysicsWorld from './start/createPhysicsWorld';
import createLabyrinth from './start/createLabyrinth';
import createBall from './start/createBall';
import createBallRope from './start/createBallRope';
import createCubes from './start/createCubes';
import spreadCubes from './start/spreadCubes';
import runWorld from './start/runWorld';
import updateBallThrust from './cycle/updateBallThrust';
import catchSystem from './cycle/catchSystem';
import checkSquareFilled from './cycle/checkSquareFilled';

// Порядок важен: createBall должен создать тело до createBallRope
addLevelSystem('start', generateLabyrinth);
addLevelSystem('start', createPhysicsWorld);
addLevelSystem('start', createLabyrinth);
addLevelSystem('start', createBall);
addLevelSystem('start', createBallRope);
addLevelSystem('start', createCubes);
addLevelSystem('start', spreadCubes);
addLevelSystem('start', runWorld);

addLevelSystem('cycle', updateBallThrust);
addLevelSystem('cycle', catchSystem);
addLevelSystem('cycle', checkSquareFilled);

const runLevel = levelState.run;

export default runLevel;
