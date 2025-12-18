"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
    title: string;
    subtitle?: string;
    children: ReactNode;
    className?: string;
    sideContent?: ReactNode; // For split views (Text | Demo)
}

export function Section({ title, subtitle, children, className, sideContent }: SectionProps) {
    return (
        <div className={cn("min-h-full w-full max-w-7xl mx-auto px-6 py-12 flex flex-col justify-center", className)}>
            <header className="mb-12 max-w-3xl">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    {title}
                </h1>
                {subtitle && (
                    <p className="text-xl md:text-2xl text-muted-foreground font-light leading-relaxed">
                        {subtitle}
                    </p>
                )}
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Narrative Column */}
                <div className="space-y-6 text-lg leading-relaxed text-foreground/90">
                    {children}
                </div>

                {/* Demo/Visual Column */}
                <div className="relative w-full lg:min-h-[700px] bg-muted/30 rounded-3xl border border-white/10 flex items-center justify-center p-4 lg:p-12 shadow-2xl">
                    {sideContent ? sideContent : (
                        <div className="text-muted-foreground italic">Interactive Demo Placeholder</div>
                    )}
                </div>
            </div>
        </div>
    );
}
