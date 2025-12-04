import Matter from 'matter-js';

export function createBallRope(
	engine: Matter.Engine,
	ball: Matter.Body,
	segmentCount: number = 3,
	segmentRadius: number = 3
) {
	const segments: Matter.Body[] = [];
	const constraints: Matter.Constraint[] = [];

	// Calculate starting position (below the ball)
	const startX = ball.position.x;
	const startY = ball.position.y + ball.circleRadius!;

	// Create rope segments (initially at the same position, inactive)
	for (let i = 0; i < segmentCount; i++) {
		const segment = Matter.Bodies.circle(startX, startY, segmentRadius, {
			restitution: 0.2,
			friction: 0.5,
			frictionAir: 0.02,
			density: 0.0005, // Light weight
			isSleeping: true, // Initially inactive for physics world
			collisionFilter: {
				category: 0x0008, // Unique category for rope segments
				mask: 0x0001, // Only collide with walls (default category)
				group: -2, // Negative group prevents collision between rope segments
			},
		});

		segments.push(segment);
		Matter.Composite.add(engine.world, segment);
	}

	// Create spring constraints between ball and first segment
	const ballConstraint = Matter.Constraint.create({
		bodyA: ball,
		bodyB: segments[0],
		pointA: { x: 0, y: ball.circleRadius! }, // Bottom of the ball
		pointB: { x: 0, y: -segmentRadius }, // Top of first segment
		stiffness: 1, // Spring stiffness (0-1, lower = more flexible)
		damping: 1, // Damping to reduce oscillations
		length: 1, // Initially zero length (inactive)
	});

	constraints.push(ballConstraint);
	Matter.Composite.add(engine.world, ballConstraint);

	// Create spring constraints between rope segments
	for (let i = 0; i < segmentCount - 1; i++) {
		const constraint = Matter.Constraint.create({
			bodyA: segments[i],
			bodyB: segments[i + 1],
			pointA: { x: 0, y: segmentRadius }, // Bottom of current segment
			pointB: { x: 0, y: -segmentRadius }, // Top of next segment
			stiffness: 1, // Spring stiffness
			damping: 1, // Damping
			length: 0, // Initially zero length (inactive)
		});

		constraints.push(constraint);
		Matter.Composite.add(engine.world, constraint);
	}

	return {
		segments,
		constraints,
	};
}
