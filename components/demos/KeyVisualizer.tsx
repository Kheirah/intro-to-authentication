"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Key, Lock, LockOpen, CheckCircle, PenTool } from "lucide-react";

export function KeyVisualizer() {
    const [activeTab, setActiveTab] = useState("symmetric");
    const [stage, setStage] = useState(0);

    const reset = () => setStage(0);
    const nextStage = () => setStage(prev => prev + 1);

    const isSymmetric = activeTab === "symmetric";
    const maxStage = isSymmetric ? 2 : 3;

    return (
        <Card className="w-full max-w-lg mx-auto bg-card border-border shadow-xl">
            <CardHeader>
                <CardTitle>Keys & Locks</CardTitle>
                <CardDescription>
                    {isSymmetric ? "Symmetric: Shared Secret" : "Asymmetric: Public/Private Key pair"}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="symmetric" onValueChange={(v) => { setActiveTab(v); reset(); }}>
                    <TabsList className="grid w-full grid-cols-2 mb-8">
                        <TabsTrigger value="symmetric">Symmetric (Shared)</TabsTrigger>
                        <TabsTrigger value="asymmetric">Asymmetric (Keypair)</TabsTrigger>
                    </TabsList>

                    <div className="min-h-[350px] flex flex-col justify-between">
                        {/* Visual Area */}
                        <div className="flex-1 flex items-center justify-center gap-8 relative p-4">
                            {/* Alice (User Device) */}
                            <div className="flex flex-col items-center gap-2">
                                <span className="font-bold">Alice (User)</span>
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 border-2 border-blue-500 relative">
                                    A
                                    {/* Action Icon on Alice */}
                                    <AnimatePresence>
                                        {!isSymmetric && stage >= 2 && (
                                            <motion.div
                                                initial={{ scale: 0, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                exit={{ scale: 0, opacity: 0 }}
                                                className="absolute -top-4 -right-4 bg-primary text-primary-foreground rounded-full p-1 border-2 border-background"
                                            >
                                                <PenTool className="w-4 h-4" />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                                {/* Key held by Alice */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex flex-col items-center"
                                >
                                    <div className="flex items-center gap-1 text-[10px] bg-muted px-2 py-0.5 rounded border border-yellow-500/30">
                                        <Key className="w-3 h-3 text-yellow-500" />
                                        <span>{isSymmetric ? "Shared Key" : "Private Key"}</span>
                                    </div>
                                    <span className="text-[7px] text-muted-foreground uppercase font-bold tracking-tighter">Signer</span>
                                </motion.div>
                            </div>

                            {/* The "Action" (Messenger/Cloud) */}
                            <div className="flex flex-col items-center justify-center w-32 relative h-24">
                                <AnimatePresence mode="wait">
                                    {/* Symmetric Visuals */}
                                    {isSymmetric && stage >= 1 && (
                                        <motion.div
                                            key="symmetric-action"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="relative z-10"
                                        >
                                            {stage === 1 ? (
                                                <div className="flex flex-col items-center">
                                                    <Lock className="w-10 h-10 text-primary" />
                                                    <span className="text-xs bg-background border px-1 rounded mt-1">Locked</span>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center">
                                                    <LockOpen className="w-10 h-10 text-green-500" />
                                                    <span className="text-xs bg-green-50 border-green-200 border px-1 rounded mt-1 text-green-700">Unlocked</span>
                                                </div>
                                            )}
                                        </motion.div>
                                    )}

                                    {/* Asymmetric Visuals: Challenge moving R -> L */}
                                    {!isSymmetric && stage === 1 && (
                                        <motion.div
                                            key="challenge"
                                            initial={{ x: 60, opacity: 0 }}
                                            animate={{ x: -60, opacity: 1 }}
                                            transition={{ duration: 1 }}
                                            className="flex flex-col items-center"
                                        >
                                            <div className="bg-yellow-100 border border-yellow-500 text-yellow-800 text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                                                Challenge
                                            </div>
                                            <div className="w-px h-4 bg-yellow-500 mt-0.5" />
                                        </motion.div>
                                    )}

                                    {/* Asymmetric Visuals: Proof moving L -> R */}
                                    {!isSymmetric && stage === 2 && (
                                        <motion.div
                                            key="proof"
                                            initial={{ x: -60, opacity: 0 }}
                                            animate={{ x: 60, opacity: 1 }}
                                            transition={{ duration: 1 }}
                                            className="flex flex-col items-center"
                                        >
                                            <div className="bg-green-100 border border-green-500 text-green-800 text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                                                Proof (Signed)
                                            </div>
                                            <div className="w-px h-4 bg-green-500 mt-0.5" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Background Arrows */}
                                <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex flex-col gap-4 w-full -z-10 opacity-20">
                                    <div className="h-0.5 bg-primary w-full relative">
                                        <div className="absolute -left-1 -top-1 border-t-4 border-r-4 border-primary w-2 h-2 rotate-225" />
                                    </div>
                                    <div className="h-0.5 bg-primary w-full relative">
                                        <div className="absolute -right-1 -top-1 border-t-4 border-r-4 border-primary w-2 h-2 rotate-45" />
                                    </div>
                                </div>
                            </div>

                            {/* Bob (Receiver/Verifier) */}
                            <div className="flex flex-col items-center gap-2">
                                <span className="font-bold">Bob (System)</span>
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-500 border-2 border-green-500 relative">
                                    B
                                    {/* Validated Icon on Bob */}
                                    <AnimatePresence>
                                        {!isSymmetric && stage === 3 && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1.2 }}
                                                transition={{ type: "spring" }}
                                                className="absolute -top-4 -left-4 bg-green-500 text-white rounded-full p-1"
                                            >
                                                <CheckCircle className="w-4 h-4" />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex flex-col items-center"
                                >
                                    <div className="flex items-center gap-1 text-[10px] bg-muted px-2 py-0.5 rounded border border-green-500/30">
                                        <Key className="w-3 h-3 text-green-500" />
                                        <span>{isSymmetric ? "Shared Key" : "Public Key"}</span>
                                    </div>
                                    <span className="text-[7px] text-muted-foreground uppercase font-bold tracking-tighter">Verifier</span>
                                </motion.div>
                            </div>
                        </div>

                        {/* Validation Status Text */}
                        <div className="h-20 flex items-center justify-center text-center">
                            <AnimatePresence mode="wait">
                                {isSymmetric && stage === 2 && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center text-green-600">
                                        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full border border-green-200">
                                            <CheckCircle className="w-5 h-5" />
                                            <span className="font-bold">Access Granted</span>
                                        </div>
                                    </motion.div>
                                )}
                                {!isSymmetric && stage === 1 && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-muted-foreground italic">
                                        "Bob sends a random number for Alice to sign..."
                                    </motion.div>
                                )}
                                {!isSymmetric && stage === 2 && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-muted-foreground italic">
                                        "Alice uses her Private Key to sign the number."
                                    </motion.div>
                                )}
                                {!isSymmetric && stage === 3 && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
                                        <div className="flex items-center gap-2 px-4 py-1.5 bg-green-50 text-green-600 rounded-full border border-green-200">
                                            <CheckCircle className="w-4 h-4" />
                                            <span className="font-bold text-sm">Proof Validated</span>
                                        </div>
                                        <span className="text-[10px] text-muted-foreground mt-1 px-4">
                                            Bob verified the math with Alice's Public Key.
                                        </span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Description */}
                        <div className="bg-muted/30 p-4 rounded-lg text-sm mb-4 border min-h-[80px]">
                            {isSymmetric ? (
                                <p className="leading-relaxed">
                                    <strong>Symmetric:</strong> A single shared secret is used for both steps.
                                    The system must also store and protect this exact secret to verify the user.
                                </p>
                            ) : (
                                <p className="leading-relaxed">
                                    {stage === 0 && <span><strong>Asymmetric:</strong> Bob challenges Alice to prove her identity without ever seeing her secret.</span>}
                                    {stage === 1 && <span>Bob starts by sending a "Challenge" (random data). This prevents attackers from replaying old proof.</span>}
                                    {stage === 2 && <span>Alice signs ONLY that specific challenge. She sends back the resulting "Proof" (Signature).</span>}
                                    {stage === 3 && <span>Bob uses Math and the <strong>Public Key</strong> to verify the proof. Security is never shared.</span>}
                                </p>
                            )}
                        </div>

                        <Button onClick={stage < maxStage ? nextStage : reset} className="w-full">
                            {isSymmetric ? (
                                stage === 0 ? "1. Lock Data" :
                                    stage === 1 ? "2. Send & Unlock" : "Reset"
                            ) : (
                                stage === 0 ? "1. Request Challenge" :
                                    stage === 1 ? "2. Alice: Sign & Respond" :
                                        stage === 2 ? "3. Bob: Verify Proof" : "Reset Demo"
                            )}
                        </Button>
                    </div>
                </Tabs>
            </CardContent>
        </Card>
    );
}
