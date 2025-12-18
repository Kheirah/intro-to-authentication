"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { WifiOff, Server, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

// Pseudo-HMAC for demo purposes (modulo 1M for better visibility of changes)
const generateCode = (secret: string, time: number) => {
    const epoch = Math.floor(time / 30);
    const input = `${secret}-${epoch}`;
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
        hash = ((hash << 5) - hash) + input.charCodeAt(i);
        hash |= 0; // Force 32bit integer
    }
    const code = Math.abs(hash) % 1000000;
    return code.toString().padStart(6, '0');
};

export function TotpSimulator() {
    const [secret] = useState("JBSWY3DPEHPK3PXP");
    const [serverTime, setServerTime] = useState(Date.now() / 1000);
    const [deviceDrift, setDeviceDrift] = useState(0); // Seconds drift
    const [progress, setProgress] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);

    useEffect(() => {
        const timer = setInterval(() => {
            const now = Date.now() / 1000;
            setServerTime(now);

            const remaining = 30 - (now % 30);
            setTimeLeft(Math.ceil(remaining));
            setProgress((now % 30) / 30 * 100);
        }, 100);
        return () => clearInterval(timer);
    }, []);

    const deviceTime = serverTime + deviceDrift;
    const serverCode = generateCode(secret, serverTime);
    const deviceCode = generateCode(secret, deviceTime);
    const isMatch = serverCode === deviceCode;

    return (
        <Card className="w-full max-w-xl mx-auto bg-card border-border shadow-xl">
            <CardHeader>
                <CardTitle>Authenticator Mechanism</CardTitle>
                <CardDescription>
                    Synchronization between device and server.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                {/* Secret Display */}
                <div className="bg-muted/50 p-4 rounded-lg flex flex-col items-center gap-2 text-center border">
                    <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Hash Calculation</span>
                    <div className="font-mono text-sm font-bold text-primary">
                        Code = Hash(Secret + TimeWindow)
                    </div>
                    <p className="text-[10px] text-muted-foreground italic">
                        The window changes every 30 seconds.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-8 relative">
                    {/* Divider */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2" />

                    {/* Device Side */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="flex items-center gap-2 text-foreground font-bold italic">
                            <Smartphone className="w-5 h-5 text-muted-foreground" />
                            <span>Phone</span>
                        </div>
                        <Badge variant="outline" className="gap-1 text-[10px] h-5">
                            <WifiOff className="w-3 h-3" /> Offline
                        </Badge>

                        <div className="flex flex-col items-center p-4 bg-muted/20 rounded-xl border border-border w-full relative overflow-hidden">
                            <span className="text-[10px] uppercase font-bold text-muted-foreground mb-2">Device Code</span>

                            <AnimatePresence mode="wait">
                                <motion.span
                                    key={deviceCode}
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -10, opacity: 0 }}
                                    className="text-3xl font-mono tracking-tighter font-black tabular-nums text-primary"
                                >
                                    {deviceCode.slice(0, 3)} {deviceCode.slice(3)}
                                </motion.span>
                            </AnimatePresence>

                            <div className="w-full h-1 bg-muted mt-4 rounded-full overflow-hidden">
                                <motion.div
                                    className={cn("h-full bg-primary", timeLeft < 5 && "bg-destructive")}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.1 }}
                                />
                            </div>
                            <span className="text-[9px] mt-1 text-muted-foreground font-mono">
                                Next code in {timeLeft}s
                            </span>
                        </div>

                        <div className="w-full space-y-3 px-2">
                            <div className="flex justify-between text-[10px] font-bold uppercase text-muted-foreground">
                                <span>Time Offset</span>
                                <span className={cn(Math.abs(deviceDrift) > 20 && "text-destructive")}>
                                    {deviceDrift > 0 ? `+${deviceDrift}s` : `${deviceDrift}s`}
                                </span>
                            </div>
                            <Slider
                                min={-120}
                                max={120}
                                step={5}
                                value={[deviceDrift]}
                                onValueChange={(v) => setDeviceDrift(v[0])}
                                className="py-2"
                            />
                            <p className="text-[10px] text-center text-muted-foreground leading-tight">
                                Adjust the device clock to see the effect on code synchronization.
                            </p>
                        </div>
                    </div>

                    {/* Server Side */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="flex items-center gap-2 text-foreground font-bold italic">
                            <Server className="w-5 h-5 text-muted-foreground" />
                            <span>Server</span>
                        </div>
                        <Badge variant="secondary" className="gap-1 text-[10px] h-5 opacity-0">
                            Hidden
                        </Badge>

                        <div className="flex flex-col items-center p-4 bg-muted/20 rounded-xl border border-border w-full relative overflow-hidden">
                            <span className="text-[10px] uppercase font-bold text-muted-foreground mb-2">Expected Code</span>

                            <AnimatePresence mode="wait">
                                <motion.span
                                    key={serverCode}
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -10, opacity: 0 }}
                                    className="text-3xl font-mono tracking-tighter font-black tabular-nums"
                                >
                                    {serverCode.slice(0, 3)} {serverCode.slice(3)}
                                </motion.span>
                            </AnimatePresence>

                            <div className="w-full h-1 bg-muted mt-4 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-muted-foreground/30"
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.1 }}
                                />
                            </div>
                            <span className="text-[9px] mt-1 text-muted-foreground font-mono">
                                System Window
                            </span>
                        </div>

                        <div className="flex flex-col items-center justify-center flex-1 min-h-[80px]">
                            <motion.div
                                animate={{
                                    scale: isMatch ? 1 : 0.9,
                                    opacity: isMatch ? 1 : 0.6,
                                }}
                                className={cn(
                                    "px-4 py-2 rounded-full border text-xs font-black tracking-widest uppercase transition-colors",
                                    isMatch ? "bg-green-500/10 text-green-600 border-green-500/20" : "bg-destructive/10 text-destructive border-destructive/20"
                                )}
                            >
                                {isMatch ? "Valid Access" : "Invalid Code"}
                            </motion.div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
