import { addLevelSystem } from './levelState';
import generateLabyrinth from './systems/start/generateLabyrinth';
import createPhysicsWorld from './systems/start/createPhysicsWorld';
import createLabyrinth from './systems/start/createLabyrinth';
import createBall from './systems/start/createBall';
import createBallRope from './systems/start/createBallRope';
import createCubes from './systems/start/createCubes';
import spreadCubes from './systems/start/spreadCubes';
import runWorld from './systems/start/runWorld';
import updateBallThrust from './systems/cycle/updateBallThrust';
import checkSquareFilled from './systems/cycle/checkSquareFilled';
import ropeActivitySystem from './systems/cycle/ropeActivitySystem';
import checkRopeCatchSystem from './systems/cycle/checkRopeCatchSystem';
import releaseRopeCatchSystem from './systems/cycle/releaseRopeCatchSystem';

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

addLevelSystem('cycle', ropeActivitySystem);
addLevelSystem('cycle', checkRopeCatchSystem);
addLevelSystem('cycle', releaseRopeCatchSystem);

addLevelSystem('cycle', checkSquareFilled);
