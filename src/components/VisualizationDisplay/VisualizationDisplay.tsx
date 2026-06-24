import {
	AdaptiveSVG,
	type AdaptiveSVGProps,
} from "@components/AdaptiveSVG/AdaptiveSVG";
import type React from "react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, Code2, Eye, FileCode } from "lucide-react";
import { i18n } from "@/i18n/translation";
import { VisualizationKey } from "@/i18n/partials/visualization/keys";

export interface VisualizationDisplayProps extends AdaptiveSVGProps {
	children?: React.ReactNode;
	diagramName?: string;
	defaultExpand?: ("code" | "svg")[];
	lang?: string;
}

function SimpleAccordionItem({
	title,
	icon: Icon,
	isOpen,
	onToggle,
	children,
}: {
	title: string;
	icon: React.ComponentType<{ size?: number; className?: string }>;
	isOpen: boolean;
	onToggle: () => void;
	children: React.ReactNode;
}) {
	return (
		<div className="border-b border-black/5 dark:border-white/5 last:border-none">
			<button
				onClick={onToggle}
				data-state={isOpen ? "open" : "closed"}
				className={cn(
					"w-full text-left px-5 py-4 min-h-0 transition-all flex items-center justify-between group",
					isOpen
						? "bg-[var(--btn-regular-bg)]/20 text-[var(--primary)] font-semibold"
						: "text-75 hover:bg-black/[0.01] dark:hover:bg-white/[0.01] hover:text-[var(--primary)]",
				)}
			>
				<div className="flex items-center gap-2.5 font-bold text-sm md:text-base">
					<Icon size={18} className="opacity-70 group-hover:opacity-100 transition-opacity" />
					<span>{title}</span>
				</div>
				<ChevronDown
					size={18}
					className={cn(
						"shrink-0 transition-transform duration-300 opacity-60 group-hover:opacity-100",
						isOpen && "rotate-180 text-[var(--primary)]",
					)}
				/>
			</button>
			<div
				className={cn(
					"grid transition-all duration-300 ease-in-out",
					isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 pointer-events-none",
				)}
			>
				<div className="overflow-hidden min-h-0">
					<div className="px-5 pb-5 pt-3 w-full text-left bg-black/[0.005] dark:bg-white/[0.003]">
						{children}
					</div>
				</div>
			</div>
		</div>
	);
}

export function VisualizationDisplay(props: VisualizationDisplayProps) {
	const codeComponent =
		typeof props.children === "string" ? (
			<code>{props.children}</code>
		) : (
			props.children
		);
	const defaultExpand = props.defaultExpand ?? ["code", "svg"];
	const { lang } = props;

	const [openItems, setOpenItems] = useState<string[]>(defaultExpand);
	const [currentLang, setCurrentLang] = useState<string | undefined>(lang);

	useEffect(() => {
		if (lang) {
			setCurrentLang(lang);
			return;
		}
		if (typeof document !== "undefined") {
			setCurrentLang(document.documentElement.lang);

			const observer = new MutationObserver((mutations) => {
				mutations.forEach((mutation) => {
					if (mutation.attributeName === "lang") {
						setCurrentLang(document.documentElement.lang);
					}
				});
			});
			observer.observe(document.documentElement, { attributes: true });
			return () => observer.disconnect();
		}
	}, [lang]);

	const t = (key: VisualizationKey) => i18n(key, currentLang);

	const toggleItem = (val: string) => {
		setOpenItems((prev) =>
			prev.includes(val) ? prev.filter((i) => i !== val) : [...prev, val],
		);
	};

	const titleText = props.diagramName || t(VisualizationKey.untitled);
	const badgeText = t(VisualizationKey.interactiveDiagram);

	return (
		<div className="card-base border border-black/5 dark:border-white/5 my-8 flex flex-col relative w-full overflow-hidden bg-[var(--card-bg)]">
			<div className="w-full flex items-center justify-between px-5 py-4 border-b border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.01]">
				<div className="flex items-center gap-2.5">
					<div className="p-2 rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center">
						<FileCode size={20} />
					</div>
					<h3 className="text-base md:text-lg font-bold text-90 m-0 tracking-tight">
						{titleText}
					</h3>
				</div>
				<div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--primary)]/5 text-[var(--primary)] text-xs font-bold uppercase tracking-wider scale-90 md:scale-100 origin-right select-none">
					<span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-pulse" />
					{badgeText}
				</div>
			</div>
			<div className="w-full flex flex-col">
				{props.children && (
					<SimpleAccordionItem
						title={t(VisualizationKey.code)}
						icon={Code2}
						isOpen={openItems.includes("code")}
						onToggle={() => toggleItem("code")}
					>
						<div className="w-full overflow-x-auto">
							{codeComponent}
						</div>
					</SimpleAccordionItem>
				)}
				<SimpleAccordionItem
					title={t(VisualizationKey.visualization)}
					icon={Eye}
					isOpen={openItems.includes("svg")}
					onToggle={() => toggleItem("svg")}
				>
					<div className="w-full">
						<AdaptiveSVG {...props} />
					</div>
				</SimpleAccordionItem>
			</div>
		</div>
	);
}


