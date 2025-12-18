"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Fingerprint, Server, Smartphone, Key, ShieldCheck, UserCheck, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type State = "idle" | "registering" | "registered" | "authenticating" | "authenticated";

export function WebAuthnDemo() {
    const [state, setState] = useState<State>("idle");
    const [log, setLog] = useState<{ id: string; message: string }[]>([]);

    const addLog = (message: string) => {
        setLog(current => {
            const nextId = `${Date.now()}-${current.length}`;
            return [...current.slice(-3), { id: nextId, message }];
        });
    };

    const register = () => {
        setState("registering");
        setLog([]);
        addLog("→ Device: Creating Secure Keypair...");
        setTimeout(() => {
            addLog("✓ Device: Private Key stored in Secure Enclave.");
            setTimeout(() => {
                addLog("→ Network: Sending Public Key to Server...");
                setTimeout(() => {
                    setState("registered");
                    addLog("✓ Server: Public Key registered.");
                }, 1500);
            }, 1000);
        }, 1200);
    };

    const authenticate = () => {
        setState("authenticating");
        setLog([]);
        addLog("→ Server: Sending Challenge (Random Number).");
        setTimeout(() => {
            addLog("⏳ Device: Awaiting Biometric Consent...");
            setTimeout(() => {
                addLog("✓ Device: Challenge signed with Private Key.");
                setTimeout(() => {
                    addLog("→ Network: Sending Proof (Signature) to Server.");
                    setTimeout(() => {
                        setState("authenticated");
                        addLog("✓ Server: Signature Verified. Access Granted.");
                    }, 1500);
                }, 1000);
            }, 1500);
        }, 1200);
    };

    const reset = () => {
        setState("idle");
        setLog([]);
    };

    return (
        <Card className="w-full max-w-lg mx-auto bg-card border-border shadow-xl overflow-hidden">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>Act 5: Passkeys</span>
                    <Badge variant={state === "authenticated" ? "default" : "outline"} className={cn(state === "authenticated" && "bg-green-500 hover:bg-green-600")}>
                        {state === "authenticated" ? "VERIFIED" : state.toUpperCase()}
                    </Badge>
                </CardTitle>
                <CardDescription>
                    Real-world WebAuthn flow: Cryptographic proof, no shared passwords.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">

                {/* Visual Stage */}
                <div className="relative h-64 bg-muted/10 rounded-xl border border-border/50 p-4 flex justify-between items-center px-10">

                    {/* Background connection line */}
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-border/30 -z-0" />

                    {/* Device Area */}
                    <div className="flex flex-col items-center gap-3 relative z-10 w-24">
                        <div className="w-20 h-32 border-4 border-slate-800 bg-background rounded-2xl flex flex-col items-center justify-center shadow-xl relative overflow-hidden">
                            <div className="absolute top-2 w-8 h-1 bg-slate-800 rounded-full" />

                            {/* Device Screens */}
                            <AnimatePresence mode="wait">
                                {state === "idle" && (
                                    <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                        <Smartphone className="w-8 h-8 text-muted-foreground/40" />
                                    </motion.div>
                                )}

                                {(state === "registering" || state === "authenticating") && (
                                    <motion.div
                                        key="biometric"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex flex-col items-center gap-2"
                                    >
                                        <Fingerprint className="w-12 h-12 text-blue-500 animate-pulse" />
                                        <span className="text-[8px] font-bold uppercase tracking-widest text-blue-400">Scan</span>
                                    </motion.div>
                                )}

                                {(state === "registered" || state === "authenticated") && (
                                    <motion.div key="ready" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-1">
                                        <ShieldCheck className="w-10 h-10 text-green-500" />
                                        <span className="text-[8px] font-bold uppercase text-green-500">Secure</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Internal Private Key */}
                            {(state !== "idle" && state !== "registering") && (
                                <div className="absolute bottom-2 bg-slate-100 dark:bg-slate-900 border border-yellow-500/50 p-1 rounded-sm shadow-sm">
                                    <Key className="w-3 h-3 text-yellow-500" />
                                </div>
                            )}
                        </div>
                        <span className="font-bold text-[10px] uppercase tracking-tighter text-muted-foreground text-center">Your Device<br />(Private Key)</span>
                    </div>

                    {/* Network Transmission Area */}
                    <div className="flex-1 h-20 flex items-center justify-center relative mx-2">
                        <AnimatePresence>
                            {state === "registering" && (
                                <motion.div
                                    key="reg-pk"
                                    initial={{ x: -50, opacity: 0 }}
                                    animate={{ x: 50, opacity: 1 }}
                                    transition={{ duration: 1.5, ease: "easeInOut" }}
                                    className="flex flex-col items-center gap-1"
                                >
                                    <Key className="w-5 h-5 text-green-500" />
                                    <span className="text-[8px] font-bold bg-green-500 text-white px-1.5 rounded uppercase">Public Key</span>
                                </motion.div>
                            )}

                            {state === "authenticating" && (
                                <div className="relative w-full h-full flex items-center justify-center">
                                    {/* Challenge L -> R */}
                                    <motion.div
                                        key="auth-challenge"
                                        initial={{ x: 50, opacity: 0 }}
                                        animate={{ x: -50, opacity: 1 }}
                                        transition={{ duration: 1, delay: 0.5 }}
                                        className="absolute bg-slate-700 text-white text-[8px] font-bold px-1.5 py-0.5 rounded border border-slate-600"
                                    >
                                        Challenge
                                    </motion.div>

                                    {/* Proof R -> L */}
                                    <motion.div
                                        key="auth-proof"
                                        initial={{ x: -50, opacity: 0 }}
                                        animate={{ x: 50, opacity: 1 }}
                                        transition={{ duration: 1, delay: 3.5 }}
                                        className="absolute bg-blue-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded border border-blue-500 shadow-md"
                                    >
                                        Proof
                                    </motion.div>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Server Area */}
                    <div className="flex flex-col items-center gap-3 relative z-10 w-24">
                        <div className="w-20 h-24 bg-slate-100 dark:bg-slate-900 rounded-lg flex flex-col items-center justify-center border border-border shadow-lg relative">
                            <Server className="w-10 h-10 text-muted-foreground/30" />

                            {/* Stored Public Key */}
                            {(state === "registered" || state === "authenticating" || state === "authenticated") && (
                                <div className="absolute -bottom-2 bg-background border border-green-500/50 p-1 rounded-full shadow-sm">
                                    <Key className="w-3 h-3 text-green-500" />
                                </div>
                            )}
                        </div>
                        <span className="font-bold text-[10px] uppercase tracking-tighter text-muted-foreground text-center">Auth Server<br />(Public Key)</span>
                    </div>

                    {/* Success Overlay */}
                    {state === "authenticated" && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 bg-background/60 backdrop-blur-[2px] flex items-center justify-center flex-col gap-2 z-20 rounded-xl"
                        >
                            <motion.div
                                initial={{ scale: 0.5 }}
                                animate={{ scale: 1 }}
                                className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white shadow-xl"
                            >
                                <UserCheck className="w-8 h-8" />
                            </motion.div>
                            <span className="text-lg font-black text-green-600 tracking-tight">VERIFIED</span>
                        </motion.div>
                    )}
                </div>

                {/* System Logs (Clean & Readable) */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-[11px] h-40 flex flex-col justify-start">
                    <div className="text-slate-600 mb-3 border-b border-slate-800 pb-2 flex justify-between">
                        <span>SYSTEM LOG</span>
                        <span className="text-[9px] opacity-50">v1.2 — WEBAUTHN</span>
                    </div>
                    <div className="space-y-2 py-1">
                        {log.length === 0 && <span className="text-slate-700 animate-pulse">Waiting for interaction...</span>}
                        <AnimatePresence initial={false}>
                            {log.map((entry) => (
                                <motion.div
                                    key={entry.id}
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={cn(
                                        "flex gap-2",
                                        entry.message.startsWith("✓") ? "text-green-400" : "text-blue-300"
                                    )}
                                >
                                    <span>{entry.message}</span>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

            </CardContent>
            <CardFooter className="bg-muted/30 border-t border-border/50 p-4">
                {state === "idle" && (
                    <Button onClick={register} className="w-full" variant="default">
                        Register Passkey
                    </Button>
                )}
                {state === "registered" && (
                    <Button onClick={authenticate} className="w-full" variant="default">
                        Sign In with Passkey
                    </Button>
                )}
                {(state === "registering" || state === "authenticating") && (
                    <Button disabled className="w-full gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Processing Protocol...</span>
                    </Button>
                )}
                {state === "authenticated" && (
                    <Button onClick={reset} variant="outline" className="w-full">
                        Try Again / Reset
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}
