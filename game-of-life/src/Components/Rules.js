import React from 'react';

function Rules() {
	return (
		<div>
			<h2>
				<strong>Rules of the Game:</strong>
			</h2>
			<p>
				Rule 1: Any live cell with fewer than two live neighbours dies, as if by
				underpopulation.
			</p>
			<p>
				Rule 2: Any live cell with two or three live neighbours lives on to the
				next generation
			</p>
			<p>
				Rule 3: Any live cell with more than three live neighbours dies, as if
				by overpopulation.
			</p>
			<p>
				Rule 4: Any dead cell with exactly three live neighbours becomes a live
				cell, as if by reproduction.
			</p>
		</div>
	);
}

export default Rules;
