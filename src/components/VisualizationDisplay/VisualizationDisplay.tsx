import React, { useState } from "react";
import { AdaptiveSVG, type AdaptiveSVGProps } from "@components/AdaptiveSVG/AdaptiveSVG";
import { cn } from "@/lib/utils";

export interface VisualizationDisplayProps extends AdaptiveSVGProps {
    children?: React.ReactNode,
    diagramName?: string,
    defaultExpand?: ("code" | "svg")[],
}

function SimpleAccordionItem({ title, isOpen, onToggle, children }: { title: string, isOpen: boolean, onToggle: () => void, children: React.ReactNode }) {
    return (
        <div className="border-none mb-1">
            <button 
                onClick={onToggle}
                data-state={isOpen ? "open" : "closed"}
                className="w-full text-left py-2 min-h-0 text-[var(--btn-content)] hover:text-[var(--primary)] font-medium text-base transition flex items-center justify-between [&[data-state=open]>svg]:rotate-180"
            >
                {title}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 shrink-0 transition-transform duration-200"
                >
                    <path d="m6 9 6 6 6-6" />
                </svg>
            </button>
            <div 
                className={cn(
                    "grid transition-all duration-300 ease-out",
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                )}
            >
                <div className="overflow-hidden min-h-0">
                    <div className="pb-2 w-full text-left [&_pre]:!m-0 [&_pre]:!rounded-none">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}

export function VisualizationDisplay(props: VisualizationDisplayProps) {
    const codeComponent = typeof props.children === "string" ? <code>{props.children}</code> : props.children;
    const defaultExpand = props.defaultExpand ?? ['code', 'svg'];
    
    const [openItems, setOpenItems] = useState<string[]>(defaultExpand);

    const toggleItem = (val: string) => {
        setOpenItems(prev => 
            prev.includes(val) ? prev.filter(i => i !== val) : [...prev, val]
        );
    };

    return (
        <div className="w-full flex flex-col mt-10 mb-6 pt-8 pb-2 relative before:absolute before:content-[''] before:inset-x-0 before:top-0 before:h-[2px] before:bg-gradient-to-r before:from-transparent before:via-[var(--primary)] before:to-transparent before:opacity-40">
            {props.diagramName && (
                <div className="w-full flex justify-center mb-4">
                    <h1 className="text-[var(--primary)] text-sm font-bold m-0 inline-flex items-center gap-2 opacity-90 px-4 py-1 rounded-full bg-[var(--primary)]/5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]"></span>
                        {props.diagramName}
                    </h1>
                </div>
            )}
            <div className="w-full px-2">
                {props.children && (
                    <SimpleAccordionItem 
                        title="Code" 
                        isOpen={openItems.includes('code')} 
                        onToggle={() => toggleItem('code')}
                    >
                        <div className="w-full overflow-x-auto rounded-lg">
                            {codeComponent}
                        </div>
                    </SimpleAccordionItem>
                )}
                <SimpleAccordionItem 
                    title="Visualization" 
                    isOpen={openItems.includes('svg')} 
                    onToggle={() => toggleItem('svg')}
                >
                    <AdaptiveSVG {...props} />
                </SimpleAccordionItem>
            </div>
        </div>
    );
}