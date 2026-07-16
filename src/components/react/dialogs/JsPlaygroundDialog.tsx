import React, { useState } from "react";
import _Editor from "react-simple-code-editor";
import Prism from "prismjs";
import { Code2, Database, X } from "lucide-react";
import { SurfaceDialogContent } from "@/components/ui/surface";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-json";

const Editor = (_Editor as any).default || _Editor;

export default function JsPlaygroundDialog({
	title,
	viewType,
	initialValue,
	placeholder,
	readOnly,
	close,
}: {
	title: string;
	viewType: "code" | "data";
	initialValue: string;
	placeholder?: string;
	readOnly?: boolean;
	close: (result?: string) => void;
}) {
	const [value, setValue] = useState(initialValue);

	return (
		<SurfaceDialogContent
			className="w-[95vw] h-auto max-h-[85dvh] sm:max-h-[95vh] sm:max-w-7xl flex flex-col p-0 rounded-[var(--radius-large)] bg-[var(--card-bg)] border border-black/10 dark:border-white/10 shadow-2xl overflow-hidden font-sans gap-0"
			onPointerDownOutside={() => close(value)}
			showCloseButton={false}
		>
			<DialogHeader className="sr-only">
				<DialogTitle>{title}</DialogTitle>
			</DialogHeader>

			{/* Modal Header */}
			<div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 bg-[var(--btn-regular-bg)] px-5 py-4 flex-none">
				<div className="flex items-center gap-2.5">
					<div className="p-2 rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center">
						{viewType === "code" ? <Code2 size={20} /> : <Database size={20} />}
					</div>
					<h3 className="font-bold tracking-tight text-90 text-base md:text-lg m-0">
						{title}
					</h3>
				</div>
				<button
					onClick={() => close(value)}
					className="flex h-9 w-9 items-center justify-center rounded-xl bg-transparent hover:bg-black/5 dark:hover:bg-white/5 transition-all text-75 hover:text-[var(--primary)] active:scale-95"
				>
					<X size={18} />
				</button>
			</div>

			{/* Modal Editor */}
			<div className="playground-editor w-full flex-1 overflow-y-auto bg-[var(--codeblock-bg)] font-mono text-sm leading-relaxed text-white/90">
				<Editor
					value={value}
					onValueChange={setValue}
					highlight={(val) =>
						Prism.highlight(
							val,
							viewType === "code" ? Prism.languages.javascript : Prism.languages.json,
							viewType === "code" ? "javascript" : "json",
						)
					}
					padding={24}
					style={{
						fontFamily: "inherit",
						minHeight: "100%",
						fontSize: "1.05rem",
					}}
					disabled={readOnly}
					placeholder={placeholder}
					textareaClassName="focus:outline-none"
				/>
			</div>
		</SurfaceDialogContent>
	);
}
