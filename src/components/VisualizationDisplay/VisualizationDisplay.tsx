import React from "react";
import { AdaptiveSVG, type AdaptiveSVGProps } from "@components/AdaptiveSVG/AdaptiveSVG";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

export interface VisualizationDisplayProps extends AdaptiveSVGProps {
    children?: React.ReactNode,
    diagramName?: string,
    defaultExpand?: ("code" | "svg")[],
}

export function VisualizationDisplay(props: VisualizationDisplayProps) {
    const codeComponent = typeof props.children === "string" ? <code>{props.children}</code> : props.children;
    const defaultExpand = props.defaultExpand ?? ['code', 'svg'];
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="card-base w-full flex flex-col my-6 min-h-[100px] items-center justify-center text-50 text-sm">
                Loading visualization...
            </div>
        );
    }

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
            <Accordion 
                type="multiple" 
                defaultValue={defaultExpand} 
                className="w-full px-2"
            >
                {props.children && (
                    <AccordionItem value="code" className="border-none mb-1">
                        <AccordionTrigger className="py-2 min-h-0 text-[var(--btn-content)] hover:text-[var(--primary)] font-medium text-base transition">
                            Code
                        </AccordionTrigger>
                        <AccordionContent className="pb-2">
                            <div className="w-full text-left overflow-x-auto rounded-lg [&_pre]:!m-0 [&_pre]:!rounded-none">
                                {codeComponent}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                )}
                <AccordionItem value="svg" className="border-none">
                    <AccordionTrigger className="py-2 min-h-0 text-[var(--btn-content)] hover:text-[var(--primary)] font-medium text-base transition">
                        Visualization
                    </AccordionTrigger>
                    <AccordionContent className="pb-2">
                        <div className="w-full">
                            <AdaptiveSVG {...props} />
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}