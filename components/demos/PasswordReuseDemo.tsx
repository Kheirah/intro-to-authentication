"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Lock, LockOpen, RefreshCcw } from "lucide-react";
import { cn } from "@/lib/utils";

const SERVICES = [
    { id: "email", name: "Email Provider", icon: "📧", color: "text-blue-500" },
    { id: "bank", name: "Mega Bank", icon: "🏦", color: "text-green-500" },
    { id: "shop", name: "Shop-o-rama", icon: "🛍️", color: "text-orange-500" },
    { id: "social", name: "InstaFace", icon: "📱", color: "text-purple-500" },
];

export function PasswordReuseDemo() {
    const [reusePassword, setReusePassword] = useState(true);
    const [breachedService, setBreachedService] = useState<string | null>(null);
    const [hackedServices, setHackedServices] = useState<string[]>([]);

    const reset = () => {
        setBreachedService(null);
        setHackedServices([]);
    };

    const simulateBreach = (serviceId: string) => {
        if (breachedService) return; // Already breached one
        setBreachedService(serviceId);
        setHackedServices([serviceId]);

        if (reusePassword) {
            // Domino effect
            setTimeout(() => {
                setHackedServices((prev) => [...prev, ...SERVICES.map(s => s.id).filter(id => id !== serviceId)]);
            }, 1000);
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto bg-card border-border shadow-xl">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>Impact of Password Reuse</span>
                    <Button variant="outline" size="icon" onClick={reset} title="Reset Simulation">
                        <RefreshCcw className="w-4 h-4" />
                    </Button>
                </CardTitle>
                <CardDescription>
                    Simulating how a single compromised service affects others.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center justify-between space-x-2 p-4 rounded-lg bg-muted/50 border">
                    <Label htmlFor="reuse-mode" className="flex flex-col space-y-1">
                        <span className="font-semibold">Reuse Same Password?</span>
                        <span className="text-xs font-normal text-muted-foreground">
                            {reusePassword ? "Using 'hunter2' everywhere" : "Unique passwords for each site"}
                        </span>
                    </Label>
                    <Switch id="reuse-mode" checked={reusePassword} onCheckedChange={(v) => {
                        setReusePassword(v);
                        reset();
                    }} />
                </div>

                <div className="grid gap-4">
                    {SERVICES.map((service) => {
                        const isBreachedOrigin = service.id === breachedService;
                        const isHacked = hackedServices.includes(service.id);

                        return (
                            <motion.div
                                key={service.id}
                                initial={false}
                                animate={{
                                    borderColor: isHacked ? "var(--destructive)" : "transparent",
                                    backgroundColor: isHacked ? "var(--destructive-foreground)" : "var(--background)"
                                }}
                                className={cn(
                                    "relative flex items-center justify-between p-4 rounded-xl border border-border bg-card transition-all duration-300",
                                    isHacked && "border-destructive bg-destructive/5"
                                )}
                            >
                                <div className="flex items-center gap-4">
                                    <span className="text-2xl">{service.icon}</span>
                                    <div className="flex flex-col">
                                        <span className="font-bold">{service.name}</span>
                                        <span className="text-xs text-muted-foreground">
                                            {isHacked
                                                ? (isBreachedOrigin ? "Source of Breach" : (reusePassword ? "Compromised via Reuse" : "Safe"))
                                                : "Secure"}
                                        </span>
                                    </div>
                                </div>

                                {isHacked ? (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="text-destructive font-bold flex items-center gap-2"
                                    >
                                        <LockOpen className="w-5 h-5" />
                                        <span>{isBreachedOrigin ? "COMPROMISED" : reusePassword ? "ACCESSED" : ""}</span>
                                    </motion.div>
                                ) : (
                                    <div className="flex items-center">
                                        {!breachedService && (
                                            <div className="text-green-500 opacity-50 mr-2 transition-opacity group-hover:opacity-0">
                                                <Lock className="w-5 h-5" />
                                            </div>
                                        )}
                                        <Button
                                            size="sm"
                                            variant={breachedService ? "ghost" : "destructive"}
                                            className={cn(
                                                "opacity-0 hover:opacity-100 focus:opacity-100 transition-opacity",
                                                breachedService && "invisible"
                                            )}
                                            onClick={() => simulateBreach(service.id)}
                                        >
                                            Simulate Breach
                                        </Button>
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
