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
	const [grid, setGrid] = useState(() => {
		return EmptyGrid();
	});

	const runningRef = useRef(running);
	runningRef.current = running;

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
		setTimeout(runSim, speed);
	});
	return (
		<>
			<div
				style={{
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
				onClick={() => {
					setRunning(!running);
					if (!running) {
						runningRef.current = true;
						runSim();
					}
				}}
			>
				{running ? 'stop' : 'start'}
			</button>

			<button
				onClick={() => {
					const rows = [];
					for (let i = 0; i < numRows; i++) {
						rows.push(Array.from(Array(numCols)));
					}
				}}
			></button>
		</>
	);
}

export default Game;
