import { VisualizationDisplay } from "@components/VisualizationDisplay/VisualizationDisplay";
import * as d3 from "d3";
import { useState } from "react";

function PlayableTest() {
	return (
		<>
			<VisualizationDisplay playable={true}>111</VisualizationDisplay>
		</>
	);
}
function UpdateTest() {
	const [count, setCount] = useState(0);
	return (
		<>
			<div className="w-full flex justify-center mb-4">
				<button
					onClick={() => {
						setCount(count + 1);
					}}
					className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg font-bold hover:opacity-90 active:scale-95 transition"
				>
					Click to update: {count}
				</button>
			</div>
			<VisualizationDisplay
				canMaximize={true}
				data={count}
				onUpdate={(svg, data) => {
					console.log(`update: ${data}`);
					const selection = d3.select(svg);
					selection
						.selectAll("text.count-text")
						.data([data])
						.join("text")
						.attr("class", "count-text")
						.attr("x", 512)
						.attr("y", 384)
						.attr("text-anchor", "middle")
						.attr("font-size", "120px")
						.attr("font-weight", "bold")
						.attr("fill", "var(--primary)")
						.text((d) => d);
				}}
			/>
		</>
	);
}
export { PlayableTest, UpdateTest };
