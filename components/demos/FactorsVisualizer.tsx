"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Mail, Key, Lock, Unlock, ShieldAlert, Smartphone } from "lucide-react";

export function FactorsVisualizer() {
    const [activeTab, setActiveTab] = useState("2sv");
    const [step, setStep] = useState(0);
    // 0: Idle, 1: Password Entered, 2: Code Sent, 3: Attacker Intercepts/Fails

    const reset = () => setStep(0);

    const performStep = () => {
        if (step < 3) setStep(prev => prev + 1);
        else reset();
    };

    const is2FA = activeTab === "2fa";

    return (
        <Card className="w-full max-w-lg mx-auto bg-card border-border shadow-xl">
            <CardHeader>
                <CardTitle>Two-Steps vs. Two-Factors</CardTitle>
                <CardDescription>
                    See why "two steps" isn't always "two factors".
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="2sv" onValueChange={(v) => { setActiveTab(v); reset(); }}>
                    <TabsList className="grid w-full grid-cols-2 mb-8">
                        <TabsTrigger value="2sv">Weak 2SV (Email)</TabsTrigger>
                        <TabsTrigger value="2fa">Strong 2FA (Hardware)</TabsTrigger>
                    </TabsList>

                    <div className="relative min-h-[300px] flex flex-col justify-between">
                        {/* Visual Flow */}
                        <div className="flex justify-between items-center mb-12 relative z-10">
                            {/* User/Attacker */}
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center text-3xl border-2 border-primary">
                                    {step === 3 && !is2FA ? "😈" : "👤"}
                                </div>
                                <span className="text-sm font-bold">{step === 3 && !is2FA ? "Attacker" : "User"}</span>
                            </div>

                            {/* Step 1: Password */}
                            <div className="flex flex-col items-center gap-2 relative">
                                <motion.div
                                    animate={{
                                        opacity: step >= 1 ? 1 : 0.3,
                                        scale: step === 1 ? 1.2 : 1,
                                        color: step >= 1 ? "var(--primary)" : "var(--muted-foreground)"
                                    }}
                                    className="p-3 bg-card border rounded-xl"
                                >
                                    <Key className="w-6 h-6" />
                                </motion.div>
                                <span className="text-xs text-muted-foreground">Step 1: Pwd</span>
                            </div>

                            <ArrowRight className="w-6 h-6 text-muted" />

                            {/* Step 2: Second Factor */}
                            <div className="flex flex-col items-center gap-2">
                                <motion.div
                                    animate={{
                                        opacity: step >= 2 ? 1 : 0.3,
                                        scale: step === 2 ? 1.2 : 1,
                                        color: step >= 2 ? (is2FA ? "var(--purple-500)" : "var(--blue-500)") : "var(--muted-foreground)"
                                    }}
                                    className="p-3 bg-card border rounded-xl"
                                >
                                    {is2FA ? <Smartphone className="w-6 h-6" /> : <Mail className="w-6 h-6" />}
                                </motion.div>
                                <span className="text-xs text-muted-foreground">Step 2: {is2FA ? "Device" : "Email"}</span>
                            </div>

                            <ArrowRight className="w-6 h-6 text-muted" />

                            {/* Result: Account */}
                            <div className="flex flex-col items-center gap-2">
                                <motion.div
                                    animate={{
                                        backgroundColor: step === 3 ? (is2FA ? "#22c55e" : "#ef4444") : "transparent"
                                    }}
                                    className="w-16 h-16 bg-muted rounded-xl flex items-center justify-center border-2 border-border transition-colors duration-500"
                                >
                                    {step === 3 ? (
                                        is2FA ? <Unlock className="w-8 h-8 text-white" /> : <Lock className="w-8 h-8 text-white" />
                                    ) : (
                                        <div className="text-2xl">🏦</div>
                                    )}

                                    {/* Attacker with same factor */}
                                    {step === 3 && !is2FA && (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-500/90 rounded-xl p-2 text-white text-center">
                                            <Badge className="absolute -top-2 right-2 bg-red-600">COMPROMISED</Badge>
                                            <div className="text-[10px] text-white">
                                                <p className="font-bold">Attacker:</p>
                                                <p>I have the password AND the email access.</p>
                                            </div>
                                            <div className="font-bold text-xl mt-2">
                                                UNAUTHORIZED ACCESS
                                            </div>
                                        </div>
                                    )}

                                    {/* Attacker Overlay for 2SV */}
                                    {!is2FA && step === 3 && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute -top-4 -right-4 bg-destructive text-white p-2 rounded-full shadow-lg"
                                        >
                                            <ShieldAlert className="w-6 h-6" />
                                        </motion.div>
                                    )}
                                </motion.div>
                            </div>
                        </div>

                        {/* Explanation Area */}
                        <div className="bg-muted/30 p-4 rounded-lg text-sm min-h-[100px]">
                            {step === 0 && <p>Ready to simulate login flow.</p>}
                            {step === 1 && <p>Step 1: User enters password. (Attacker might already know this!)</p>}
                            {step === 2 && (is2FA
                                ? <p>Step 2: Request sent to <strong>Hardware Key/Phone</strong>. Independent physical device.</p>
                                : <p>Step 2: Code sent to <strong>Email</strong>. Wait...</p>
                            )}
                            {step === 3 && (is2FA
                                ? <p className="text-green-600 font-bold">Safe! Attacker doesn't have your physical device.</p>
                                : <p className="text-destructive font-bold">BREACHED! Attacker also hacked your email, saw the code, and logged in.</p>
                            )}
                        </div>

                        {/* Controls */}
                        <div className="flex justify-end mt-4">
                            <Button onClick={performStep} disabled={step === 3}>
                                {step === 0 ? "Start Login" : step < 3 ? "Next Step" : "Scenerio Complete"}
                            </Button>
                            {step === 3 && <Button variant="outline" onClick={reset} className="ml-2">Reset</Button>}
                        </div>
                    </div>
                </Tabs>
            </CardContent>
        </Card>
    );
}
