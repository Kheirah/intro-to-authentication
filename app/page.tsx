import { PresentationShell } from "@/components/presentation/PresentationShell";
import { Section } from "@/components/presentation/Section";
import { PasswordReuseDemo } from "@/components/demos/PasswordReuseDemo";
import { FactorsVisualizer } from "@/components/demos/FactorsVisualizer";
import { TotpSimulator } from "@/components/demos/TotpSimulator";
import { KeyVisualizer } from "@/components/demos/KeyVisualizer";
import { WebAuthnDemo } from "@/components/demos/WebAuthnDemo";
import { ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <PresentationShell>
      {/* INTRO */}
      <Section
        title="Authentication Systems"
        subtitle="An overview of identity verification methods."
        sideContent={
          <div className="flex flex-col h-full justify-center p-8 space-y-8">
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground/50">Topics covered</h3>
            <div className="space-y-6">
              {[
                { label: "1. Shared Secrets", detail: "Password security and usage" },
                { label: "2. Verification Steps", detail: "2SV vs 2FA" },
                { label: "3. Time-based Codes", detail: "Authenticators (TOTP)" },
                { label: "4. Cryptographic Pairs", detail: "Symmetric and Asymmetric keys" },
                { label: "5. Passkeys", detail: "Public/Private key authentication" },
              ].map((item, i) => (
                <div key={item.label} className="flex items-start gap-4 group">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground border shrink-0">
                    {i + 1}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground/80">{item.label}</div>
                    <div className="text-sm text-muted-foreground">{item.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        }
      >
        <div className="space-y-6 text-lg">
          <p>
            Authentication is the process of <strong>verifying a claimed identity</strong>.
          </p>
          <p className="leading-relaxed">
            Traditionally, this verification relies on shared secrets—information known to both the user and the system. This model has limitations regarding how secrets are stored, transmitted, and reused.
          </p>
          <div className="space-y-4 pt-4 border-t border-border">
            <p className="text-muted-foreground">
              This presentation examines the progression from passwords to modern cryptographic methods like <strong>Passkeys</strong>.
            </p>
            <p className="text-sm text-muted-foreground border-l-2 pl-4 py-1 italic">
              "The objective is to move from secrets that can be shared to proofs that stay on the local device."
            </p>
          </div>
        </div>
      </Section>

      {/* ACT 1: PASSWORDS */}
      <Section
        title="Act 1: Password-based Authentication"
        subtitle="The use of shared secrets for identity verification."
        sideContent={<PasswordReuseDemo />}
      >
        <p>Passwords are a form of shared secret authentication where both the user and the system store a common string.</p>
        <div className="space-y-4 my-6 text-base">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-muted rounded-lg text-muted-foreground">01</div>
            <div>
              <h4 className="font-bold">Implementation</h4>
              <p className="text-muted-foreground">Relatively simple to implement and widely supported across legacy and modern systems.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-2 bg-muted rounded-lg text-muted-foreground">02</div>
            <div>
              <h4 className="font-bold">Usage Risks</h4>
              <p className="text-muted-foreground">Usage patterns, such as password reuse across multiple services, can increase the risk of credential discovery across systems.</p>
            </div>
          </div>
        </div>
        <div className="p-4 border-l-2 border-muted bg-muted/20 text-sm">
          <p><strong>Demo:</strong> The simulation illustrates how credential reuse across services can lead to multiple account compromises if one system is breached.</p>
        </div>
      </Section>

      {/* ACT 2: 2SV vs 2FA */}
      <Section
        title="Act 2: Multi-step Authentication"
        subtitle="Comparing Two-Step Verification (2SV) and Two-Factor Authentication (2FA)."
        sideContent={<FactorsVisualizer />}
      >
        <div className="space-y-6">
          <p>Multi-step authentication adds verification layers beyond a single password.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-card border rounded-xl">
              <h3 className="font-bold mb-2">2SV (Two-Step Verification)</h3>
              <p className="text-sm text-muted-foreground">Requires two consecutive steps, which may rely on the same factor type (e.g., password and temporary code via email).</p>
            </div>
            <div className="p-4 bg-card border rounded-xl">
              <h3 className="font-bold mb-2">2FA (Two-Factor Auth)</h3>
              <p className="text-sm text-muted-foreground">Utilizes two distinct factor types, such as something you know (password) and something you possess (a physical device).</p>
            </div>
          </div>

          <p className="text-sm text-muted-foreground border-l-2 pl-4 italic">
            "2SV refers to the sequence of verification, while 2FA refers to the diversity of verification factors."
          </p>
        </div>
      </Section>

      {/* ACT 3: Time-based One-Time Passwords */}
      <Section
        title="Act 3: TOTP Authenticators"
        subtitle="Time-based verification without network dependency."
        sideContent={<TotpSimulator />}
      >
        <p>Time-based One-Time Password (TOTP) systems generate codes locally on both the device and server.</p>

        <div className="space-y-4 my-6">
          <p className="text-base">The process relies on cryptographic synchronization:</p>
          <ol className="list-decimal pl-6 space-y-4 text-sm text-muted-foreground">
            <li>
              <strong>Initial Configuration:</strong> A shared secret is exchanged during setup (typically via QR code).
            </li>
            <li>
              <strong>Algorithmic Generation:</strong>
              <div className="p-4 bg-muted rounded-lg font-mono text-xs mt-2 text-foreground">
                Current Code = HMAC(Shared Secret, Current Time / Interval)
              </div>
            </li>
            <li>
              <strong>Validation:</strong> The server performs the same calculation. If the results match, the code is accepted.
            </li>
          </ol>

          <div className="p-4 border-l-2 border-muted bg-muted/20 text-xs">
            <strong>Demo:</strong> Adjust the time offset slider to observe how synchronization failures lead to verification errors.
          </div>
        </div>
      </Section>

      {/* ACT 4: Cryptographic Keys */}
      <Section
        title="Act 4: Cryptographic Keys"
        subtitle="Symmetric and Asymmetric encryption."
        sideContent={<KeyVisualizer />}
      >
        <p>A fundamental concept in secure authentication is <strong>Asymmetric Cryptography</strong>.</p>

        <div className="space-y-6 my-6 text-base">
          <div>
            <h4 className="font-bold mb-2">Symmetric Key Systems</h4>
            <p className="text-muted-foreground">Utilize a single shared key for both encryption and decryption. Both the user and the system must possess the same secret.</p>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-bold mb-2">Asymmetric Key Systems</h4>
            <p className="text-muted-foreground">Utilize a key pair consisting of:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2 text-sm text-muted-foreground">
              <li><strong>Private Key:</strong> Kept exclusively on the user's device. Used for generating digital signatures.</li>
              <li><strong>Public Key:</strong> Shared with the server. Used to verify the integrity of signatures.</li>
            </ul>
          </div>

          <div className="p-4 bg-muted/20 rounded-lg text-sm">
            This approach enables identity verification without the need to transmit or share private secrets.
          </div>
        </div>
      </Section>

      {/* ACT 5: Passkeys */}
      <Section
        title="Act 5: Passkeys"
        subtitle="Public/Private key authentication for users."
        sideContent={<WebAuthnDemo />}
      >
        <div className="space-y-6">
          <p>Passkeys are a standardized implementation of <strong>asymmetric key-pair authentication</strong>.</p>

          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="bg-muted text-muted-foreground font-bold w-8 h-8 rounded-full flex items-center justify-center shrink-0 border">1</div>
              <div>
                <h4 className="font-bold">Registration</h4>
                <p className="text-sm text-muted-foreground">The device generates a key pair. The Public Key is sent to the server, while the Private Key remains local.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="bg-muted text-muted-foreground font-bold w-8 h-8 rounded-full flex items-center justify-center shrink-0 border">2</div>
              <div>
                <h4 className="font-bold">Authentication</h4>
                <p className="text-sm text-muted-foreground">The system sends a challenge. The device signs it locally (verified via biometrics or device PIN) and returns the signature.</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-card border rounded-xl shadow-sm">
            <h4 className="font-bold mb-2 flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-muted-foreground" /> Security Properties</h4>
            <p className="text-sm text-muted-foreground">
              Since the private key remains on the device, it is resistant to remote theft and phishing attacks that target shared secrets.
            </p>
          </div>
        </div>
      </Section>
    </PresentationShell>
  );
}
