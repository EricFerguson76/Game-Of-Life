import React, { useState, useCallback, useRef } from 'react';
import produce from 'immer';

const numRows = 30;
const numCols = 30;

const operations = [
	[0, 1],
	[0, -1],
	[1, -1],
	[-1, 1],
	[1, 1],
	[-1, -1],
	[1, 0],
	[-1, 0],
];

const EmptyGrid = () => {
	const rows = [];
	for (let i = 0; i < numRows; i++) {
		rows.push(Array.from(Array(numCols), () => 0));
	}
	return rows;
};

function Game() {
	const [running, setRunning] = useState(false);
	const [speed, setSpeed] = useState(1000);
	const [generation, setGeneration] = useState(0);
	const [grid, setGrid] = useState(() => {
		return EmptyGrid();
	});

	const runningRef = useRef(running);
	runningRef.current = running;

	const generationRef = useRef(generation);
	generationRef.current = generation;

	const speedRef = useRef(speed);
	speedRef.current = speed;

	const runSim = useCallback(() => {
		if (!runningRef.current) {
			return;
		}

		setGrid((g) => {
			return produce(g, (gridCopy) => {
				for (let i = 0; i < numRows; i++) {
					for (let j = 0; j < numCols; j++) {
						let neighbors = 0;
						operations.forEach(([x, y]) => {
							const newI = i + x;
							const newJ = j + y;
							if (newI >= 0 && newI < numRows && newJ >= 0 && newJ < numCols) {
								neighbors += g[newI][newJ];
							}
						});
						if (neighbors < 2 || neighbors > 3) {
							gridCopy[i][j] = 0;
						} else if (g[i][j] === 0 && neighbors === 3) {
							gridCopy[i][j] = 1;
						}
					}
				}
			});
		});
		setGeneration(++generationRef.current);
		setTimeout(runSim, speed);
	}, []);
	return (
		<>
			<h1 style={{ display: 'flex', justifyContent: 'center' }}>
				Conway's Game Of Life
			</h1>
			<h3 style={{ display: 'flex', justifyContent: 'center' }}>
				Generation: {generation}
			</h3>
			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					display: 'grid',
					gridTemplateColumns: `repeat(${numCols}, 22px)`,
				}}
			>
				{grid.map((rows, i) =>
					rows.map((col, j) => (
						<div
							key={`$(i)-$(j)`}
							onClick={() => {
								const newGrid = produce(grid, (gridCopy) => {
									gridCopy[i][j] = grid[i][j] ? 0 : 1;
								});
								setGrid(newGrid);
							}}
							style={{
								width: 20,
								height: 20,
								backgroundColor: grid[i][j] ? 'blue' : undefined,
								border: 'solid 1px black',
							}}
						/>
					))
				)}
			</div>
			<button
				className="btn"
				onClick={() => {
					setRunning(!running);
					if (!running) {
						runningRef.current = true;
						runSim();
					}
				}}
			>
				{running ? 'Stop' : 'Start'}
			</button>

			<button
				className="btn"
				onClick={() => {
					setGrid(EmptyGrid());
					setGeneration(0);
				}}
			>
				Clear
			</button>

			<button
				className="btn"
				onClick={() => {
					if (speed <= 100) {
						setSpeed(speed + 100);
					}
				}}
			>
				Speed Up
			</button>

			<button
				className="btn"
				onClick={() => {
					if (speed >= 2000) {
						setSpeed(speed - 100);
					}
				}}
			>
				Speed Down
			</button>

			<button
				className="btn"
				onClick={() => {
					const rows = [];
					for (let i = 0; i < numRows; i++) {
						rows.push(
							Array.from(Array(numCols), () => (Math.random() > 0.5 ? 1 : 0))
						);
					}
					setGrid(rows);
				}}
			>
				Random
			</button>
		</>
	);
}

export default Game;
