import {
	AlertCircle,
	CheckCircle2,
	Code2,
	Database,
	Maximize2,
	Play,
	RefreshCw,
	RotateCcw,
	TerminalSquare,
	X,
} from "lucide-react";
import Prism from "prismjs";
import React, { useState } from "react";
import { createPortal } from "react-dom";
import _Editor from "react-simple-code-editor";
import { JsPlaygroundKey } from "@/i18n/partials/js-playground/keys";
import { i18n } from "@/i18n/translation";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-json";

// Handle ESM/CJS interop for the Editor component
const Editor = (_Editor as any).default || _Editor;

const syntaxStyles = `
  /* Always Dark Theme (One Dark style) for Editors */
  .playground-editor ::selection { background: rgba(97, 175, 239, 0.4) !important; color: inherit !important; }
  .playground-editor textarea::selection { background: rgba(97, 175, 239, 0.4) !important; color: inherit !important; }
  .playground-editor .token.comment, .playground-editor .token.prolog, .playground-editor .token.doctype, .playground-editor .token.cdata { color: #7f848e; }
  .playground-editor .token.punctuation { color: #abb2bf; }
  .playground-editor .token.keyword, .playground-editor .token.atrule { color: #c678dd; }
  .playground-editor .token.operator { color: #56b6c2; }
  .playground-editor .token.string, .playground-editor .token.char, .playground-editor .token.attr-name, .playground-editor .token.inserted { color: #98c379; }
  .playground-editor .token.function, .playground-editor .token.tag, .playground-editor .token.builtin { color: #61afef; }
  .playground-editor .token.class-name, .playground-editor .token.property { color: #e5c07b; }
  .playground-editor .token.boolean, .playground-editor .token.number, .playground-editor .token.constant, .playground-editor .token.symbol, .playground-editor .token.deleted { color: #d19a66; }
  .playground-editor .token.variable, .playground-editor .token.entity, .playground-editor .token.url, .playground-editor .token.regex { color: #e06c75; }

  /* Custom scrollbar styling for editors and console */
  .playground-editor,
  .playground-console,
  .playground-editor textarea {
    scrollbar-width: thin;
    scrollbar-color: var(--primary) transparent;
  }
  .playground-editor::-webkit-scrollbar,
  .playground-console::-webkit-scrollbar,
  .playground-editor textarea::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  .playground-editor::-webkit-scrollbar-track,
  .playground-console::-webkit-scrollbar-track,
  .playground-editor textarea::-webkit-scrollbar-track {
    background: transparent;
  }
  .playground-editor::-webkit-scrollbar-thumb,
  .playground-console::-webkit-scrollbar-thumb,
  .playground-editor textarea::-webkit-scrollbar-thumb {
    background: var(--primary);
    opacity: 0.4;
    border-radius: 9999px;
  }
  .playground-editor::-webkit-scrollbar-thumb:hover,
  .playground-console::-webkit-scrollbar-thumb:hover,
  .playground-editor textarea::-webkit-scrollbar-thumb:hover {
    background: var(--primary);
    filter: brightness(1.2);
  }
`;

interface JsPlaygroundProps {
	initialCode?: string;
	initialData?: string;
	readOnlyCode?: boolean;
	readOnlyData?: boolean;
	lang?: string;
}

interface OutputMessage {
	type: "log" | "error" | "return" | "warn";
	content: string;
}

export default function JsPlayground({
	initialCode = "return data.map(x => x * 2);",
	initialData = "[\n  1,\n  2,\n  3\n]",
	readOnlyCode = false,
	readOnlyData = false,
	lang,
}: JsPlaygroundProps) {
	const [code, setCode] = useState(initialCode);
	const [data, setData] = useState(initialData);
	const [outputs, setOutputs] = useState<OutputMessage[]>([]);
	const [isRunning, setIsRunning] = useState(false);
	const [currentLang, setCurrentLang] = useState<string | undefined>(lang);
	const [expandedView, setExpandedView] = useState<"code" | "data" | null>(
		null,
	);

	React.useEffect(() => {
		if (!lang && typeof document !== "undefined") {
			setCurrentLang(document.documentElement.lang);

			// Support dynamic language switching in SPA (e.g. Swup)
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

	const t = (key: JsPlaygroundKey) => i18n(key, currentLang);

	const handleRun = () => {
		setIsRunning(true);
		setOutputs([]);
		const logs: OutputMessage[] = [];

		const customConsole = {
			log: (...args: any[]) =>
				logs.push({
					type: "log",
					content: args
						.map((a) =>
							typeof a === "object" ? JSON.stringify(a, null, 2) : String(a),
						)
						.join(" "),
				}),
			error: (...args: any[]) =>
				logs.push({
					type: "error",
					content: args
						.map((a) =>
							typeof a === "object" ? JSON.stringify(a, null, 2) : String(a),
						)
						.join(" "),
				}),
			warn: (...args: any[]) =>
				logs.push({
					type: "warn",
					content: args
						.map((a) =>
							typeof a === "object" ? JSON.stringify(a, null, 2) : String(a),
						)
						.join(" "),
				}),
		};

		setTimeout(() => {
			let parsedData: any;
			try {
				if (data.trim()) {
					parsedData = JSON.parse(data);
				}
			} catch (err: any) {
				setOutputs([
					{ type: "error", content: `Data parsing error: ${err.message}` },
				]);
				setIsRunning(false);
				return;
			}

			try {
				const fn = new Function("data", "console", code);
				const result = fn(parsedData, customConsole);

				if (result !== undefined) {
					logs.push({
						type: "return",
						content:
							typeof result === "object"
								? JSON.stringify(result, null, 2)
								: String(result),
					});
				}
				setOutputs([...logs]);
			} catch (err: any) {
				logs.push({ type: "error", content: err.toString() });
				setOutputs([...logs]);
			}
			setIsRunning(false);
		}, 300); // Artificial delay to show beautiful button animation
	};

	const handleReset = () => {
		setCode(initialCode);
		setData(initialData);
		setOutputs([]);
	};

	return (
		<div className="w-full my-8 flex flex-col overflow-hidden rounded-[var(--radius-large)] bg-[var(--card-bg)] border border-black/5 dark:border-white/5 group font-sans">
			{/* Header */}
			<div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.01] px-5 py-4 flex-none">
				<div className="flex items-center gap-2.5">
					<div className="p-2 rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center">
						<Code2 size={20} />
					</div>
					<h3 className="font-bold tracking-tight text-90 text-base md:text-lg m-0">
						{t(JsPlaygroundKey.jsPlayground)}
					</h3>
				</div>
				<button
					onClick={handleReset}
					className="flex items-center gap-1.5 rounded-xl bg-[var(--btn-regular-bg)] hover:bg-[var(--btn-regular-bg)]/80 text-[var(--btn-content)] hover:text-[var(--primary)] px-3.5 py-2 text-xs font-bold transition-all active:scale-[0.98]"
					title={t(JsPlaygroundKey.reset)}
				>
					<RotateCcw size={14} />
					<span>{t(JsPlaygroundKey.reset)}</span>
				</button>
			</div>

			<style>{syntaxStyles}</style>
			<div className="grid grid-cols-1 lg:grid-cols-5 divide-y lg:divide-y-0 lg:divide-x divide-black/5 dark:divide-white/5 transition-colors">
				{/* Left Column: Inputs */}
				<div className="flex flex-col lg:col-span-3 h-[36rem]">
					{/* JS Code Area */}
					<div className="flex flex-col border-b border-black/5 dark:border-white/5 last:border-0 relative transition-colors flex-[3] min-h-[15rem]">
						<div className="flex items-center justify-between px-4 py-2.5 bg-black/[0.02] dark:bg-white/[0.01] text-xs font-bold text-75 border-b border-black/5 dark:border-white/5 uppercase tracking-wider transition-colors flex-none">
							<div className="flex items-center gap-1.5">
								<Code2 size={14} /> {t(JsPlaygroundKey.jsCode)}
							</div>
							<button
								className="hover:text-[var(--primary)] text-50 hover:opacity-100 transition-colors"
								onClick={() => setExpandedView("code")}
								title="Expand"
							>
								<Maximize2 size={14} />
							</button>
						</div>
						<div className="playground-editor w-full flex-1 overflow-y-auto bg-[var(--codeblock-bg)] font-mono text-sm leading-relaxed text-white/90 focus-within:bg-[var(--codeblock-bg)] transition-colors">
							<Editor
								value={code}
								onValueChange={(code) => setCode(code)}
								highlight={(code) =>
									Prism.highlight(
										code,
										Prism.languages.javascript,
										"javascript",
									)
								}
								padding={16}
								style={{
									fontFamily: "inherit",
									minHeight: "100%",
								}}
								disabled={readOnlyCode}
								placeholder={t(JsPlaygroundKey.jsCodePlaceholder)}
								textareaClassName="focus:outline-none"
							/>
						</div>
					</div>

					{/* JSON Data Area */}
					<div className="flex flex-col relative transition-colors flex-[1] min-h-[6rem]">
						<div className="flex items-center justify-between px-4 py-2.5 bg-black/[0.02] dark:bg-white/[0.01] text-xs font-bold text-75 border-b border-black/5 dark:border-white/5 uppercase tracking-wider transition-colors flex-none">
							<div className="flex items-center gap-1.5">
								<Database size={14} /> {t(JsPlaygroundKey.inputData)}
							</div>
							<button
								className="hover:text-[var(--primary)] text-50 hover:opacity-100 transition-colors"
								onClick={() => setExpandedView("data")}
								title="Expand"
							>
								<Maximize2 size={14} />
							</button>
						</div>
						<div className="playground-editor w-full flex-1 overflow-y-auto bg-[var(--codeblock-bg)] font-mono text-sm leading-relaxed text-white/90 focus-within:bg-[var(--codeblock-bg)] transition-colors">
							<Editor
								value={data}
								onValueChange={(data) => setData(data)}
								highlight={(data) =>
									Prism.highlight(data, Prism.languages.json, "json")
								}
								padding={16}
								style={{
									fontFamily: "inherit",
									minHeight: "100%",
								}}
								disabled={readOnlyData}
								placeholder={t(JsPlaygroundKey.inputDataPlaceholder)}
								textareaClassName="focus:outline-none"
							/>
						</div>
					</div>
				</div>

				{/* Right Column: Console & Controls */}
				<div className="flex flex-col lg:col-span-2 h-[20rem] lg:h-[36rem] transition-colors">
					<div className="flex items-center gap-1.5 px-4 py-2.5 bg-black/[0.02] dark:bg-white/[0.01] text-xs font-bold text-75 uppercase tracking-wider border-b border-black/5 dark:border-white/5 transition-colors flex-none">
						<TerminalSquare size={14} /> {t(JsPlaygroundKey.consoleOutput)}
					</div>

					<div className="playground-console flex-1 p-4 font-mono text-sm overflow-y-auto bg-[var(--codeblock-bg)] text-white/90 transition-colors">
						{outputs.length === 0 ? (
							<div className="flex h-full flex-col items-center justify-center opacity-50">
								<TerminalSquare size={32} className="mb-2" />
								<span className="text-xs">
									{t(JsPlaygroundKey.awaitingExecution)}
								</span>
							</div>
						) : (
							<div className="flex flex-col gap-2">
								{outputs.map((out, i) => (
									<div
										key={i}
										className={`flex items-start gap-2 rounded-md px-3 py-2 text-sm backdrop-blur-sm ${
											out.type === "error"
												? "bg-red-500/20 text-red-300 border border-red-500/30"
												: out.type === "warn"
													? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
													: out.type === "return"
														? "bg-[var(--primary)]/20 text-[var(--primary)] border border-[var(--primary)]/30 font-semibold"
														: "bg-white/5 text-white/90 border border-white/10"
										} animate-in fade-in slide-in-from-bottom-1 duration-300`}
										style={{
											animationDelay: `${i * 50}ms`,
											animationFillMode: "both",
										}}
									>
										<span className="mt-0.5 shrink-0 opacity-80">
											{out.type === "error" ? (
												<AlertCircle size={14} />
											) : out.type === "return" ? (
												<CheckCircle2 size={14} />
											) : (
												<TerminalSquare size={14} />
											)}
										</span>
										<span className="whitespace-pre-wrap break-all">
											{out.content}
										</span>
									</div>
								))}
							</div>
						)}
					</div>

					{/* Action Bar */}
					<div className="p-4 border-t border-black/5 dark:border-white/5 bg-[var(--card-bg)] backdrop-blur-sm transition-colors">
						<button
							onClick={handleRun}
							disabled={isRunning}
							className={`w-full flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-bold text-white transition-all duration-300 active:scale-[0.98] ${
								isRunning
									? "bg-[var(--primary)] opacity-70 cursor-not-allowed"
									: "bg-[var(--primary)] hover:brightness-110 hover:shadow-lg shadow-[var(--primary)]/20"
							}`}
						>
							{isRunning ? (
								<RefreshCw size={18} className="animate-spin" />
							) : (
								<Play size={18} className="fill-current" />
							)}
							{isRunning
								? t(JsPlaygroundKey.executing)
								: t(JsPlaygroundKey.runCode)}
						</button>
					</div>
				</div>
			</div>

			{/* Fullscreen Editor Modal (Using React Portal to escape Swup transform container) */}
			{expandedView && typeof document !== "undefined" && createPortal(
				<div className="fixed inset-0 z-[2147483647] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md transition-all duration-300 animate-in fade-in duration-200">
					<div className="w-full h-full md:w-[95vw] md:h-[95vh] max-w-7xl max-h-none flex flex-col rounded-none md:rounded-2xl bg-[var(--card-bg)] border border-black/10 dark:border-white/10 shadow-2xl overflow-hidden font-sans animate-in zoom-in-95 duration-200">
						{/* Modal Header */}
						<div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 bg-[var(--btn-regular-bg)] px-5 py-4 flex-none">
							<div className="flex items-center gap-2.5">
								<div className="p-2 rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center">
									{expandedView === "code" ? (
										<Code2 size={20} />
									) : (
										<Database size={20} />
									)}
								</div>
								<h3 className="font-bold tracking-tight text-90 text-base md:text-lg">
									{expandedView === "code"
										? t(JsPlaygroundKey.jsCode)
										: t(JsPlaygroundKey.inputData)}
								</h3>
							</div>
							<button
								onClick={() => setExpandedView(null)}
								className="btn-plain scale-animation flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--btn-regular-bg)] hover:bg-black/5 dark:hover:bg-white/5 transition-all text-75 hover:text-[var(--primary)] active:scale-95"
							>
								<X size={18} />
							</button>
						</div>
						{/* Modal Editor */}
						<div className="playground-editor w-full flex-1 overflow-y-auto bg-[var(--codeblock-bg)] font-mono text-sm leading-relaxed text-white/90">
							<Editor
								value={expandedView === "code" ? code || "" : data || ""}
								onValueChange={(val) =>
									expandedView === "code" ? setCode(val) : setData(val)
								}
								highlight={(val) =>
									Prism.highlight(
										val,
										expandedView === "code"
											? Prism.languages.javascript
											: Prism.languages.json,
										expandedView === "code" ? "javascript" : "json",
									)
								}
								padding={24}
								style={{
									fontFamily: "inherit",
									minHeight: "100%",
									fontSize: "1.05rem",
								}}
								disabled={expandedView === "code" ? readOnlyCode : readOnlyData}
								placeholder={
									expandedView === "code"
										? t(JsPlaygroundKey.jsCodePlaceholder)
										: t(JsPlaygroundKey.inputDataPlaceholder)
								}
								textareaClassName="focus:outline-none"
							/>
						</div>
					</div>
				</div>,
				document.body
			)}
		</div>
	);
}

