import * as d3 from "d3";
import { useEffect, useRef } from "react";
export function SingleComponent() {
	const svgRef = useRef();
	useEffect(() => {
		d3.select(svgRef.current)
			.attr("width", "600px")
			.attr("height", "400px")
			.style("border", "1px black solid")
			.style("border-radius", "5px");
	}, []);
	return <svg ref={svgRef} />;
}
