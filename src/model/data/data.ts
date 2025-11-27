interface Data {
	level: number;
	score: number;
	health: number;
	engine: Matter.Engine | null;
	labyrinth: number[][];
}

export const data: Data = {
	level: 0,
	score: 0,
	health: 100,
	engine: null,
	labyrinth: [[0]],
};
