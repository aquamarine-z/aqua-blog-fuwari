import { Maximize2, Play } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { dialog, SurfaceDialogContent } from "@/components/ui/surface";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";

export interface AdaptiveSVGProps {
	onInitialize?: (svg?: SVGSVGElement, data?: any) => void;
	onUpdate?: (svg?: SVGSVGElement, data?: any) => void;
	x?: number;
	y?: number;
	width?: number;
	height?: number;
	data?: any;
	canMaximize?: boolean;
	showInformation?: boolean;
	playable?: boolean;
	onPlay?: (svg: SVGSVGElement, data?: any) => void;
}

function showMaximumImage(component: React.ReactNode) {
	void dialog.custom((close) => (
		<SurfaceDialogContent
			className="max-w-[95vw] h-[95vh] w-[95vw] flex flex-col p-4 md:p-6 bg-[var(--card-bg)] border-[var(--line-divider)] rounded-[var(--radius-large)] shadow-2xl overflow-hidden"
			onPointerDownOutside={() => close()}
		>
			<DialogHeader className="sr-only">
				<DialogTitle>Full Screen Image Viewer</DialogTitle>
			</DialogHeader>
			<div className="w-full h-full overflow-hidden flex justify-center items-center pt-8">
				{component}
			</div>
		</SurfaceDialogContent>
	));
}

function TitleBarButton({
	icon: Icon,
	onClick,
	title,
}: {
	icon: any;
	onClick: () => void;
	title?: string;
}) {
	return (
		<button
			title={title}
			onClick={onClick}
			className="p-2 rounded-xl bg-[var(--btn-regular-bg)] hover:bg-[var(--btn-plain-bg-hover)] active:scale-95 text-[var(--btn-content)] hover:text-[var(--primary)] transition flex items-center justify-center"
		>
			<Icon size={18} />
		</button>
	);
}

export function AdaptiveSVG(props: AdaptiveSVGProps) {
	const {
		x = 0,
		y = 0,
		width = 1024,
		height = 768,
		data = undefined,
		showInformation = true,
		canMaximize = true,
		playable = false,
		onInitialize = () => {},
		onUpdate = () => {},
		onPlay = () => {},
	} = props;

	const svgRef = useRef<SVGSVGElement>(null);
	const startX = x ?? 0;
	const startY = y ?? 0;
	const endX = startX + (width ?? 1024);
	const endY = startY + (height ?? 768);
	const viewBox = `${startX} ${startY} ${endX} ${endY}`;

	const [viewBoxWidth, setViewBoxWidth] = useState(endX - startX);
	const [viewBoxHeight, setViewBoxHeight] = useState(endY - startY);
	const [actualWidth, setActualWidth] = useState(0);
	const [actualHeight, setActualHeight] = useState(0);

	const showTitleBar = canMaximize || playable;

	useEffect(() => {
		onUpdate(svgRef.current!, data);
	}, [data, onUpdate]);

	useEffect(() => {
		if (onInitialize) {
			onInitialize(svgRef.current!);
		}
	}, []);

	useEffect(() => {
		if (!svgRef.current) return;

		const viewBoxObserver = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (
					mutation.type === "attributes" &&
					mutation.attributeName === "viewBox"
				) {
					const target = mutation.target as SVGSVGElement;
					const viewBoxStr = target.getAttribute("viewBox");
					if (viewBoxStr) {
						const viewBoxStrs = viewBoxStr.toString().split(" ");
						if (viewBoxStrs.length >= 4) {
							const w = Number(viewBoxStrs[2]) - Number(viewBoxStrs[0]);
							const h = Number(viewBoxStrs[3]) - Number(viewBoxStrs[1]);
							setViewBoxWidth(w);
							setViewBoxHeight(h);
						}
					}
				}
			});
		});

		const resizeObserver = new ResizeObserver((entries) => {
			for (const entry of entries) {
				setActualWidth(Math.floor(entry.contentRect.width));
				setActualHeight(Math.floor(entry.contentRect.height));
			}
		});

		resizeObserver.observe(svgRef.current);
		viewBoxObserver.observe(svgRef.current, { attributes: true });

		return () => {
			viewBoxObserver.disconnect();
			resizeObserver.disconnect();
		};
	}, []);

	return (
		<div className="w-full flex flex-col items-center justify-center py-2">
			{showTitleBar && (
				<div className="w-full flex justify-end gap-2 mb-2">
					{playable && (
						<TitleBarButton
							icon={Play}
							title="Play"
							onClick={() => {
								if (svgRef.current) onPlay(svgRef.current, data);
							}}
						/>
					)}
					{canMaximize && (
						<TitleBarButton
							icon={Maximize2}
							title="Maximize"
							onClick={() => {
								showMaximumImage(
									<AdaptiveSVG {...props} canMaximize={false} />,
								);
							}}
						/>
					)}
				</div>
			)}

			<svg
				preserveAspectRatio="xMidYMid meet"
				className="w-full h-auto max-h-[50vh] invert-color object-contain"
				viewBox={viewBox}
				ref={svgRef}
			/>

			{showInformation && (
				<div className="w-full flex flex-wrap justify-between items-center gap-3 mt-4 pt-3 border-t border-black/5 dark:border-white/5">
					<div className="flex items-center gap-2 text-sm text-50">
						<span className="font-semibold text-75">True Size:</span>
						<span className="font-mono bg-[var(--btn-regular-bg)] text-[var(--primary)] px-2 py-0.5 rounded-md">
							{actualWidth} × {actualHeight}
						</span>
					</div>
					<div className="flex items-center gap-2 text-sm text-50">
						<span className="font-semibold text-75">ViewBox Size:</span>
						<span className="font-mono bg-[var(--btn-regular-bg)] text-[var(--primary)] px-2 py-0.5 rounded-md">
							{viewBoxWidth} × {viewBoxHeight}
						</span>
					</div>
				</div>
			)}
		</div>
	);
}
