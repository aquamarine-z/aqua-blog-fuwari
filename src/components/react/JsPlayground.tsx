import React, { useState } from 'react';
import { Play, Code2, Database, TerminalSquare, AlertCircle, CheckCircle2, RotateCcw, RefreshCw, Maximize2, X } from 'lucide-react';
import { i18n } from '@/i18n/translation';
import { JsPlaygroundKey } from '@/i18n/partials/js-playground/keys';
import _Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-json';

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
`;

interface JsPlaygroundProps {
  initialCode?: string;
  initialData?: string;
  readOnlyCode?: boolean;
  readOnlyData?: boolean;
  lang?: string;
}

interface OutputMessage {
  type: 'log' | 'error' | 'return' | 'warn';
  content: string;
}

export default function JsPlayground({
  initialCode = 'return data.map(x => x * 2);',
  initialData = '[\n  1,\n  2,\n  3\n]',
  readOnlyCode = false,
  readOnlyData = false,
  lang,
}: JsPlaygroundProps) {
  const [code, setCode] = useState(initialCode);
  const [data, setData] = useState(initialData);
  const [outputs, setOutputs] = useState<OutputMessage[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentLang, setCurrentLang] = useState<string | undefined>(lang);
  const [expandedView, setExpandedView] = useState<'code' | 'data' | null>(null);

  React.useEffect(() => {
    if (!lang && typeof document !== 'undefined') {
      setCurrentLang(document.documentElement.lang);
      
      // Support dynamic language switching in SPA (e.g. Swup)
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === 'lang') {
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
      log: (...args: any[]) => logs.push({ type: 'log', content: args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ') }),
      error: (...args: any[]) => logs.push({ type: 'error', content: args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ') }),
      warn: (...args: any[]) => logs.push({ type: 'warn', content: args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ') })
    };

    setTimeout(() => {
      let parsedData: any;
      try {
        if (data.trim()) {
          parsedData = JSON.parse(data);
        }
      } catch (err: any) {
        setOutputs([{ type: 'error', content: `Data parsing error: ${err.message}` }]);
        setIsRunning(false);
        return;
      }

      try {
        const fn = new Function('data', 'console', code);
        const result = fn(parsedData, customConsole);
        
        if (result !== undefined) {
          logs.push({ type: 'return', content: typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result) });
        }
        setOutputs([...logs]);
      } catch (err: any) {
        logs.push({ type: 'error', content: err.toString() });
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
    <div className="w-full my-6 flex flex-col overflow-hidden rounded-[var(--radius-large)] bg-[var(--card-bg)] border border-[var(--line-divider)] shadow-lg transition-all duration-300 hover:shadow-xl group font-sans">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--line-divider)] bg-[var(--btn-regular-bg)] px-4 py-3 backdrop-blur-sm transition-colors">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--primary)] transition-colors">
            <Code2 size={20} />
          </div>
          <h3 className="font-bold tracking-tight text-black/90 dark:text-white/90 transition-colors">{t(JsPlaygroundKey.jsPlayground)}</h3>
        </div>
        <button
          onClick={handleReset}
          className="btn-plain scale-animation flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold"
          title={t(JsPlaygroundKey.reset)}
        >
          <RotateCcw size={14} />
          <span>{t(JsPlaygroundKey.reset)}</span>
        </button>
      </div>

      <style>{syntaxStyles}</style>
      <div className="grid grid-cols-1 lg:grid-cols-5 divide-y lg:divide-y-0 lg:divide-x divide-[var(--line-divider)] transition-colors">
        {/* Left Column: Inputs */}
        <div className="flex flex-col lg:col-span-3 h-[36rem]">
          
          {/* JS Code Area */}
          <div className="flex flex-col border-b border-[var(--line-divider)] last:border-0 relative transition-colors flex-[3] min-h-[15rem]">
            <div className="flex items-center justify-between px-4 py-2 bg-[var(--btn-regular-bg)] text-xs font-bold text-[var(--btn-content)] uppercase tracking-wider transition-colors flex-none">
              <div className="flex items-center gap-1.5"><Code2 size={14} /> {t(JsPlaygroundKey.jsCode)}</div>
              <button className="hover:text-[var(--primary)] transition-colors" onClick={() => setExpandedView('code')} title="Expand"><Maximize2 size={14} /></button>
            </div>
            <div className="playground-editor w-full flex-1 overflow-y-auto bg-[var(--codeblock-bg)] font-mono text-sm leading-relaxed text-white/90 focus-within:bg-[var(--codeblock-bg)] transition-colors">
              <Editor
                value={code}
                onValueChange={code => setCode(code)}
                highlight={code => Prism.highlight(code, Prism.languages.javascript, 'javascript')}
                padding={16}
                style={{
                  fontFamily: 'inherit',
                  minHeight: '100%',
                }}
                disabled={readOnlyCode}
                placeholder={t(JsPlaygroundKey.jsCodePlaceholder)}
                textareaClassName="focus:outline-none"
              />
            </div>
          </div>

          {/* JSON Data Area */}
          <div className="flex flex-col relative transition-colors flex-[1] min-h-[6rem]">
            <div className="flex items-center justify-between px-4 py-2 bg-[var(--btn-regular-bg)] text-xs font-bold text-[var(--btn-content)] uppercase tracking-wider transition-colors flex-none">
              <div className="flex items-center gap-1.5"><Database size={14} /> {t(JsPlaygroundKey.inputData)}</div>
              <button className="hover:text-[var(--primary)] transition-colors" onClick={() => setExpandedView('data')} title="Expand"><Maximize2 size={14} /></button>
            </div>
            <div className="playground-editor w-full flex-1 overflow-y-auto bg-[var(--codeblock-bg)] font-mono text-sm leading-relaxed text-white/90 focus-within:bg-[var(--codeblock-bg)] transition-colors">
              <Editor
                value={data}
                onValueChange={data => setData(data)}
                highlight={data => Prism.highlight(data, Prism.languages.json, 'json')}
                padding={16}
                style={{
                  fontFamily: 'inherit',
                  minHeight: '100%',
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
          
          <div className="flex items-center gap-1.5 px-4 py-2 bg-[var(--btn-regular-bg)] text-xs font-bold text-[var(--btn-content)] uppercase tracking-wider border-b border-[var(--line-divider)] transition-colors flex-none">
            <TerminalSquare size={14} /> {t(JsPlaygroundKey.consoleOutput)}
          </div>

          <div className="flex-1 p-4 font-mono text-sm overflow-y-auto bg-[var(--codeblock-bg)] text-white/90 transition-colors">
            {outputs.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center opacity-50">
                <TerminalSquare size={32} className="mb-2" />
                <span className="text-xs">{t(JsPlaygroundKey.awaitingExecution)}</span>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {outputs.map((out, i) => (
                  <div 
                    key={i} 
                    className={`flex items-start gap-2 rounded-md px-3 py-2 text-sm backdrop-blur-sm ${
                      out.type === 'error' ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 
                      out.type === 'warn' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                      out.type === 'return' ? 'bg-[var(--primary)]/20 text-[var(--primary)] border border-[var(--primary)]/30 font-semibold' : 
                      'bg-white/5 text-white/90 border border-white/10'
                    } animate-in fade-in slide-in-from-bottom-1 duration-300`}
                    style={{ animationDelay: `${i * 50}ms`, animationFillMode: 'both' }}
                  >
                    <span className="mt-0.5 shrink-0 opacity-80">
                      {out.type === 'error' ? <AlertCircle size={14} /> : 
                       out.type === 'return' ? <CheckCircle2 size={14} /> : 
                       <TerminalSquare size={14} />}
                    </span>
                    <span className="whitespace-pre-wrap break-all">{out.content}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Action Bar */}
          <div className="p-4 border-t border-[var(--line-divider)] bg-[var(--card-bg)] backdrop-blur-sm transition-colors">
            <button
              onClick={handleRun}
              disabled={isRunning}
              className={`w-full flex items-center justify-center gap-2 rounded-[var(--radius-large)] px-4 py-3 font-bold text-white transition-all duration-300 active:scale-[0.98] ${
                isRunning 
                  ? 'bg-[var(--primary)] opacity-70 cursor-not-allowed' 
                  : 'bg-[var(--primary)] hover:brightness-110 hover:shadow-lg shadow-[var(--primary)]/20'
              }`}
            >
              {isRunning ? (
                <RefreshCw size={18} className="animate-spin" />
              ) : (
                <Play size={18} className="fill-current" />
              )}
              {isRunning ? t(JsPlaygroundKey.executing) : t(JsPlaygroundKey.runCode)}
            </button>
          </div>
        </div>
      </div>

      {/* Fullscreen Editor Modal */}
      {expandedView && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-all duration-300">
          <div className="w-full h-full max-w-6xl max-h-[90vh] flex flex-col rounded-[var(--radius-large)] bg-[var(--card-bg)] border border-[var(--line-divider)] shadow-2xl overflow-hidden font-sans">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[var(--line-divider)] bg-[var(--btn-regular-bg)] px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--primary)]">
                  {expandedView === 'code' ? <Code2 size={20} /> : <Database size={20} />}
                </div>
                <h3 className="font-bold tracking-tight text-black/90 dark:text-white/90">
                  {expandedView === 'code' ? t(JsPlaygroundKey.jsCode) : t(JsPlaygroundKey.inputData)}
                </h3>
              </div>
              <button
                onClick={() => setExpandedView(null)}
                className="btn-plain scale-animation flex h-8 w-8 items-center justify-center rounded-md"
              >
                <X size={18} />
              </button>
            </div>
            {/* Modal Editor */}
            <div className="playground-editor w-full flex-1 overflow-y-auto bg-[var(--codeblock-bg)] font-mono text-sm leading-relaxed text-white/90">
              <Editor
                value={expandedView === 'code' ? code || '' : data || ''}
                onValueChange={val => expandedView === 'code' ? setCode(val) : setData(val)}
                highlight={val => Prism.highlight(val, expandedView === 'code' ? Prism.languages.javascript : Prism.languages.json, expandedView === 'code' ? 'javascript' : 'json')}
                padding={24}
                style={{ fontFamily: 'inherit', minHeight: '100%', fontSize: '1.1rem' }}
                disabled={expandedView === 'code' ? readOnlyCode : readOnlyData}
                placeholder={expandedView === 'code' ? t(JsPlaygroundKey.jsCodePlaceholder) : t(JsPlaygroundKey.inputDataPlaceholder)}
                textareaClassName="focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
