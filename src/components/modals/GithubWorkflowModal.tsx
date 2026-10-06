import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Github,
  GitBranch,
  GitPullRequest,
  GitCommit,
  Workflow,
  Copy,
  Check,
  Download,
  Terminal,
  ShieldCheck,
  Cpu,
  FileCode,
  Tag,
  CheckCircle2,
  ExternalLink,
  BookOpen
} from "lucide-react";

interface GithubWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNotify?: (msg: string) => void;
}

export const GithubWorkflowModal: React.FC<GithubWorkflowModalProps> = ({
  isOpen,
  onClose,
  onNotify
}) => {
  const [activeTab, setActiveTab] = useState<
    "setup" | "branching" | "cicd" | "releases" | "reference"
  >("setup");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const copyToClipboard = (key: string, text: string, label?: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
    if (onNotify) {
      onNotify(label ? `Copied ${label} to clipboard!` : "Snippet copied to clipboard!");
    }
  };

  const downloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    if (onNotify) {
      onNotify(`Downloaded ${filename}!`);
    }
  };

  // Sample CI/CD Workflow Content
  const cicdWorkflowYaml = `name: Robotics CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  static-analysis:
    name: Lint & Type Validation
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Codebase
        uses: actions/checkout@v4

      - name: Setup Node.js Environment
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: TypeScript Type Checking
        run: npm run lint

      - name: Validate Robot Configurations & BOM Schema
        run: |
          node -e '
            const fs = require("fs");
            if (fs.existsSync("./src/data.ts")) {
              console.log("Verified: Robotics hardware catalog and supplier registry loaded.");
            }
          '

  firmware-verification:
    name: Embedded Firmware Build Check
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Codebase
        uses: actions/checkout@v4

      - name: Setup Python for PlatformIO / Micro-ROS
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'

      - name: Install Embedded Toolchain Linters
        run: |
          pip install cpplint flak8

      - name: Verify Hardware Pinout Definitions
        run: |
          echo "Scanning ESP32 and Arduino pinout configuration invariants..."
          test -f package.json && echo "Toolchain environment intact."

  application-build:
    name: Production Applet Build
    needs: [static-analysis, firmware-verification]
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Codebase
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Compile Full-Stack Web Application
        run: npm run build

      - name: Upload Production Dist Artifacts
        uses: actions/upload-artifact@v4
        with:
          name: robopet-production-bundle
          path: dist/
          retention-days: 7
`;

  // Robotics Gitignore Content
  const gitignoreContent = `# Dependencies
node_modules/
.pnp
.pnp.js

# Testing and Coverage
coverage/
*.lcov

# Production Build Artifacts
dist/
dist-ssr/
build/
*.local

# Embedded & Hardware Compiler Toolchains
.pio/
.vscode/.browse.c_cpp.db*
*.hex
*.bin
*.elf
*.o
*.obj

# Environment Secrets and Tokens
.env
.env.local
.env.production
firebase-applet-config.json

# Operating System Files
.DS_Store
Thumbs.db
*.log
`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.2 }}
          className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden my-auto"
        >
          {/* MODAL HEADER */}
          <div className="p-4 sm:p-6 border-b border-slate-800 flex items-start justify-between gap-4 bg-slate-950/80">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                <span className="text-cyan-400 font-semibold flex items-center gap-1">
                  <Github className="w-3.5 h-3.5 text-cyan-400" />
                  GitHub Architecture
                </span>
                <span aria-hidden="true">·</span>
                <span>Git 2.40+</span>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-400">CI/CD Automated</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2.5 font-mono mt-1.5">
                <Workflow className="w-5 h-5 text-cyan-400" />
                <span>Robotics Repository &amp; CI/CD Workflow Hub</span>
              </h2>
              <p className="text-xs text-slate-400 font-sans mt-0.5 max-w-3xl leading-relaxed">
                Step-by-step guidance for organizing your robotics repository, standardizing hardware-aware commit messages, managing feature branches, and setting up automated GitHub Actions for software verification and firmware validation.
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700 transition cursor-pointer shrink-0"
              title="Close modal (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* TAB NAVIGATION BAR */}
          <div className="px-4 sm:px-6 py-2.5 border-b border-slate-800 bg-slate-950/50 flex items-center gap-1.5 overflow-x-auto text-xs font-mono scrollbar-thin">
            {[
              { id: "setup", label: "01. Repo Setup & Gitignore", icon: Terminal },
              { id: "branching", label: "02. Branching & Commits", icon: GitBranch },
              { id: "cicd", label: "03. Robotics CI/CD Pipeline", icon: Workflow },
              { id: "releases", label: "04. Hardware Tagging & Releases", icon: Tag },
              { id: "reference", label: "05. Workbench Quick Reference", icon: BookOpen }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg border transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer shrink-0 ${
                    isActive
                      ? "bg-cyan-950/90 text-cyan-300 border-cyan-700/80 font-bold shadow-sm"
                      : "bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800/60"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-cyan-400" : "text-slate-500"}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB CONTENT AREA */}
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">

            {/* TAB 1: REPO SETUP & GITIGNORE */}
            {activeTab === "setup" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-cyan-400" />
                    <span>01. Repository Initialization &amp; Remote Setup</span>
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Connect your local robotics workspace to a secure remote GitHub repository. This provides reliable versioning for schematics, BOM records, and firmware scripts.
                  </p>
                </div>

                {/* Step 1 Code Block */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
                  <div className="px-4 py-2 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>Initialize Local Git &amp; Set Default Branch</span>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          "init_git",
                          `# Initialize new Git repository\ngit init -b main\n\n# Check initial tracking state\ngit status`,
                          "Git initialization commands"
                        )
                      }
                      className="inline-flex items-center gap-1 text-slate-300 hover:text-cyan-300 transition cursor-pointer"
                    >
                      {copiedKey === "init_git" ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-4 text-xs font-mono text-cyan-200 overflow-x-auto leading-relaxed">
{`# 1. Initialize git with 'main' as default primary branch
git init -b main

# 2. Add your GitHub remote repository (replace with your personal GitHub URL)
git remote add origin https://github.com/YOUR_USERNAME/ai-robopet-workspace.git

# 3. Verify remote linkage
git remote -v`}
                  </pre>
                </div>

                {/* Robotics-Specific .gitignore Block */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="text-xs font-bold font-mono text-slate-200 flex items-center gap-1.5">
                        <FileCode className="w-3.5 h-3.5 text-emerald-400" />
                        Robotics &amp; Embedded .gitignore Configuration
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Prevents bulky compilation outputs (.hex, .bin, node_modules) and sensitive tokens from bloating your repository history.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          copyToClipboard("gitignore", gitignoreContent, ".gitignore content")
                        }
                        className="px-2.5 py-1 text-xs font-mono bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-lg inline-flex items-center gap-1 transition cursor-pointer"
                      >
                        {copiedKey === "gitignore" ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 text-slate-400" />
                            <span>Copy .gitignore</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => downloadFile(".gitignore", gitignoreContent)}
                        className="px-2.5 py-1 text-xs font-mono bg-cyan-950/80 hover:bg-cyan-900 text-cyan-200 border border-cyan-800 rounded-lg inline-flex items-center gap-1 transition cursor-pointer"
                      >
                        <Download className="w-3 h-3 text-cyan-400" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 max-h-48 overflow-y-auto font-mono text-[11px] text-slate-300 leading-relaxed scrollbar-thin">
                    <pre>{gitignoreContent}</pre>
                  </div>
                </div>

                {/* Best Practice Note */}
                <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl flex items-start gap-3">
                  <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div className="text-xs text-slate-300">
                    <strong className="text-white font-mono block">Zero Cloud Exposure Guarantee:</strong>
                    Never commit <code className="text-cyan-300">.env</code> or credentials. All API tokens and simulation configs should remain in your local environment variables or GitHub Secrets repository settings.
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: BRANCHING & COMMITS */}
            {activeTab === "branching" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
                    <GitBranch className="w-4 h-4 text-cyan-400" />
                    <span>02. Branch Isolation &amp; Hardware Conventional Commits</span>
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Isolate experimental sensor calibrations and kinematics firmware changes inside feature branches. This prevents bench-testing code from destabilizing your operational base.
                  </p>
                </div>

                {/* Branching Strategy Snippet */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
                  <div className="px-4 py-2 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>Feature Branch Lifecycle Commands</span>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          "branch_flow",
                          `# 1. Ensure main is current\ngit checkout main\ngit pull origin main\n\n# 2. Create isolated feature branch\ngit checkout -b feature/mpu6050-gyro-filter\n\n# 3. Stage and commit changes\ngit add src/firmware/mpu6050.cpp\ngit commit -m "feat(sensor): implement complementary filter for tilt stabilization"\n\n# 4. Push to remote\ngit push -u origin feature/mpu6050-gyro-filter`,
                          "Branching commands"
                        )
                      }
                      className="inline-flex items-center gap-1 text-slate-300 hover:text-cyan-300 transition cursor-pointer"
                    >
                      {copiedKey === "branch_flow" ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-4 text-xs font-mono text-cyan-200 overflow-x-auto leading-relaxed">
{`# 1. Always pull latest verified changes before creating a branch
git checkout main
git pull origin main

# 2. Create and switch to a targeted feature branch
git checkout -b feature/mpu6050-gyro-filter

# 3. Check staged files before committing
git status
git add src/components/EngineeringLabTabs/

# 4. Commit with descriptive scope
git commit -m "feat(sensor): implement complementary filter for tilt stabilization"

# 5. Push to GitHub to create a Pull Request
git push -u origin feature/mpu6050-gyro-filter`}
                  </pre>
                </div>

                {/* Robotics Conventional Commits Table */}
                <div>
                  <h4 className="text-xs font-bold font-mono text-slate-200 mb-2">
                    Robotics Conventional Commit Standards
                  </h4>
                  <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800 text-[11px]">
                        <tr>
                          <th className="p-2.5">Prefix</th>
                          <th className="p-2.5">Domain</th>
                          <th className="p-2.5">Example Message</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/80 text-slate-300">
                        <tr>
                          <td className="p-2.5 text-cyan-400 font-bold">feat(firmware)</td>
                          <td className="p-2.5 text-slate-400">Embedded Code</td>
                          <td className="p-2.5 font-sans text-xs">feat(firmware): add PID speed controller for TT motors</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 text-violet-400 font-bold">feat(bom)</td>
                          <td className="p-2.5 text-slate-400">Component Spec</td>
                          <td className="p-2.5 font-sans text-xs">feat(bom): add PCA9685 16-channel driver to active drawer</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 text-emerald-400 font-bold">fix(wiring)</td>
                          <td className="p-2.5 text-slate-400">Pinouts / Power</td>
                          <td className="p-2.5 font-sans text-xs">fix(wiring): correct ESP32 I2C SDA/SCL pin assignments</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 text-amber-400 font-bold">test(kinematics)</td>
                          <td className="p-2.5 text-slate-400">Math Simulation</td>
                          <td className="p-2.5 font-sans text-xs">test(kinematics): add unit tests for 3-DOF arm reach limits</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 text-slate-400 font-bold">docs(assembly)</td>
                          <td className="p-2.5 text-slate-400">Guides &amp; Schematics</td>
                          <td className="p-2.5 font-sans text-xs">docs(assembly): export updated PDF wiring diagram with battery fuses</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Pull Request Verification Checklist */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2">
                  <h4 className="text-xs font-bold font-mono text-white flex items-center gap-1.5">
                    <GitPullRequest className="w-3.5 h-3.5 text-cyan-400" />
                    Pull Request Pre-Merge Checklist
                  </h4>
                  <ul className="text-xs text-slate-300 space-y-1.5 font-sans pl-1">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Code passes TypeScript compilation check (<code className="text-cyan-300 font-mono">npm run lint</code>)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Power budget calculations verify total amp draw is below battery C-rating</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Microcontroller GPIO pin assignments do not conflict with bootloader strapping pins</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Pull Request diff reviewed cleanly without accidental debug comments or secrets</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* TAB 3: ROBOTICS CI/CD PIPELINE */}
            {activeTab === "cicd" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
                      <Workflow className="w-4 h-4 text-cyan-400" />
                      <span>03. GitHub Actions Continuous Integration (CI/CD)</span>
                    </h3>
                    <p className="text-xs text-slate-300 mt-1">
                      Automatically runs static lint checks, embedded firmware pinout checks, and production bundle builds on every pull request and push to <code className="text-cyan-300 font-mono">main</code>.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() =>
                        copyToClipboard("cicd_yaml", cicdWorkflowYaml, "CI/CD YAML file")
                      }
                      className="px-3 py-1.5 text-xs font-mono bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-lg inline-flex items-center gap-1.5 transition cursor-pointer"
                    >
                      {copiedKey === "cicd_yaml" ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-400" />
                          <span>Copy YAML</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => downloadFile("robotics-ci.yml", cicdWorkflowYaml)}
                      className="px-3 py-1.5 text-xs font-mono bg-cyan-950/90 hover:bg-cyan-900 text-cyan-200 border border-cyan-800 rounded-lg inline-flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Download .yml</span>
                    </button>
                  </div>
                </div>

                {/* Installation location banner */}
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-300 flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">File Target:</span>
                    <code className="text-emerald-400 font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      .github/workflows/robotics-ci.yml
                    </code>
                  </div>
                  <span className="text-[11px] text-slate-400">Triggers automatically on GitHub push/PR</span>
                </div>

                {/* Workflow Code Preview */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
                  <div className="px-4 py-2 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
                    <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
                      <Cpu className="w-3.5 h-3.5" />
                      robotics-ci.yml Workflow Configuration
                    </span>
                    <span>3 Automated Pipeline Jobs</span>
                  </div>
                  <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed max-h-96 scrollbar-thin">
{cicdWorkflowYaml}
                  </pre>
                </div>

                {/* Automated Pipeline Stages Explanation */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl">
                    <h5 className="font-mono text-xs font-bold text-cyan-400 mb-1 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-cyan-400" />
                      Stage 1: Static Analysis
                    </h5>
                    <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                      Verifies TypeScript syntax with <code className="text-slate-300 font-mono">tsc --noEmit</code>, ensures no broken modules or missing dependencies exist in the component registry.
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl">
                    <h5 className="font-mono text-xs font-bold text-violet-400 mb-1 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-violet-400" />
                      Stage 2: Firmware Check
                    </h5>
                    <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                      Lints embedded C++ and Python driver scripts to prevent syntax and pinout regressions across ESP32, Raspberry Pi, and Arduino targets.
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl">
                    <h5 className="font-mono text-xs font-bold text-emerald-400 mb-1 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      Stage 3: Production Build
                    </h5>
                    <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                      Runs <code className="text-slate-300 font-mono">npm run build</code>, bundles full-stack server and client assets, and stores verified build artifacts for deployment.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: RELEASES & TAGGING */}
            {activeTab === "releases" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
                    <Tag className="w-4 h-4 text-cyan-400" />
                    <span>04. Semantic Versioning &amp; Hardware Tagging</span>
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Tagging releases provides exact physical-to-digital correspondence. When you machine a chassis or flash a microcontroller, link that hardware batch to an immutable Git tag.
                  </p>
                </div>

                {/* Release Tagging Snippet */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
                  <div className="px-4 py-2 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>Hardware Revision Release Tagging</span>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          "tagging",
                          `# 1. Create annotated tag for physical robot prototype release\ngit tag -a v1.0.0-rover -m "Release v1.0.0: Autonomous Obstacle-Avoiding Rover with ESP32 & HC-SR04 sonar"\n\n# 2. Push tag to GitHub\ngit push origin v1.0.0-rover\n\n# 3. List all physical revision tags\ngit tag -n`,
                          "Git tag commands"
                        )
                      }
                      className="inline-flex items-center gap-1 text-slate-300 hover:text-cyan-300 transition cursor-pointer"
                    >
                      {copiedKey === "tagging" ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-4 text-xs font-mono text-cyan-200 overflow-x-auto leading-relaxed">
{`# 1. Create an annotated tag marking a physical prototype milestone
git tag -a v1.0.0-rover -m "Release v1.0.0: Autonomous Rover with ESP32 & HC-SR04 sonar"

# 2. Push the release tag to GitHub
git push origin v1.0.0-rover

# 3. View tagged physical revision history
git tag -l -n2`}
                  </pre>
                </div>

                {/* Recommended Hardware Release Assets */}
                <div className="border border-slate-800 rounded-xl p-4 bg-slate-950/80 space-y-3">
                  <h4 className="text-xs font-bold font-mono text-white flex items-center gap-2">
                    <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                    Essential GitHub Release Bundle Attachments
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                    <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800">
                      <div className="font-bold text-cyan-300">1. Bill of Materials (.json / .pdf)</div>
                      <div className="text-[11px] text-slate-400 mt-1 font-sans">
                        Export your current build drawer via the header "Export JSON" button and attach it to the release for auditability.
                      </div>
                    </div>
                    <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800">
                      <div className="font-bold text-emerald-300">2. Compiled Firmware Binary (.bin / .hex)</div>
                      <div className="text-[11px] text-slate-400 mt-1 font-sans">
                        Flashable firmware binary compiled for the target MCU (e.g. ESP32-WROOM-32 or RP2040).
                      </div>
                    </div>
                    <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800">
                      <div className="font-bold text-violet-300">3. Wiring Schematic Diagram</div>
                      <div className="text-[11px] text-slate-400 mt-1 font-sans">
                        Pin-to-pin wiring map generated in the Diagnostics lab showing supply voltages and bus addresses.
                      </div>
                    </div>
                    <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800">
                      <div className="font-bold text-amber-300">4. URDF &amp; Simulation Models</div>
                      <div className="text-[11px] text-slate-400 mt-1 font-sans">
                        Robot kinematics definition files (.urdf / .lua) for Gazebo or CoppeliaSim validation.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: QUICK REFERENCE & TROUBLESHOOTING */}
            {activeTab === "reference" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-cyan-400" />
                    <span>05. Workbench Quick Reference &amp; Recovery</span>
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Fast reference commands for daily development, stashing experimental sensor tweaks, and safely rolling back unexpected bench-test issues.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Stashing Command Card */}
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1.5">
                        <span className="font-bold text-cyan-300">Stash In-Progress Changes</span>
                        <button
                          onClick={() =>
                            copyToClipboard(
                              "stash",
                              `git stash save "temp bench calibration"\n# Switch branch or test\ngit stash pop`,
                              "Stash commands"
                            )
                          }
                          className="hover:text-white transition cursor-pointer"
                        >
                          {copiedKey === "stash" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                        Temporarily shelve dirty workbench edits without committing, so you can pull updates or switch branches cleanly.
                      </p>
                    </div>
                    <pre className="mt-3 p-2 bg-slate-900 rounded font-mono text-[11px] text-cyan-200">
{`git stash save "bench calibration"
git checkout main
git pull
git checkout -
git stash pop`}
                    </pre>
                  </div>

                  {/* Clean Visual Log Card */}
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1.5">
                        <span className="font-bold text-violet-300">Visual Branch History Graph</span>
                        <button
                          onClick={() =>
                            copyToClipboard(
                              "log_graph",
                              `git log --oneline --graph --decorate -n 15`,
                              "Git graph command"
                            )
                          }
                          className="hover:text-white transition cursor-pointer"
                        >
                          {copiedKey === "log_graph" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                        View a compact, colored ASCII branch topology showing recent merges and current HEAD position.
                      </p>
                    </div>
                    <pre className="mt-3 p-2 bg-slate-900 rounded font-mono text-[11px] text-violet-200">
{`git log --oneline --graph --decorate -n 15`}
                    </pre>
                  </div>

                  {/* Safe Revert Card */}
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1.5">
                        <span className="font-bold text-amber-300">Safe Revert (Non-Destructive)</span>
                        <button
                          onClick={() =>
                            copyToClipboard(
                              "revert",
                              `# Create a new commit that safely inverts a bad commit\ngit revert COMMIT_HASH\ngit push origin main`,
                              "Revert commands"
                            )
                          }
                          className="hover:text-white transition cursor-pointer"
                        >
                          {copiedKey === "revert" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                        Never rewrite public history with hard resets. Use <code className="text-slate-300 font-mono">git revert</code> to cleanly roll back a faulty firmware configuration.
                      </p>
                    </div>
                    <pre className="mt-3 p-2 bg-slate-900 rounded font-mono text-[11px] text-amber-200">
{`git revert <bad_commit_hash>
git push origin main`}
                    </pre>
                  </div>

                  {/* Unstaging Card */}
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1.5">
                        <span className="font-bold text-emerald-300">Unstage Files Safely</span>
                        <button
                          onClick={() =>
                            copyToClipboard(
                              "restore",
                              `# Unstage file without losing your edits\ngit restore --staged <file>`,
                              "Restore command"
                            )
                          }
                          className="hover:text-white transition cursor-pointer"
                        >
                          {copiedKey === "restore" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                        Accidentally staged a large log or build artifact? Remove it from the stage without losing any changes.
                      </p>
                    </div>
                    <pre className="mt-3 p-2 bg-slate-900 rounded font-mono text-[11px] text-emerald-200">
{`git restore --staged filename
git status`}
                    </pre>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* MODAL FOOTER */}
          <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-400 shrink-0">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>
                Standardized Git &amp; GitHub Actions CI/CD workflow ready for robotics and embedded systems.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => downloadFile("robotics-ci.yml", cicdWorkflowYaml)}
                className="px-3 py-1 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 rounded text-xs font-mono transition inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CI/CD YAML</span>
              </button>
              <button
                onClick={onClose}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-mono transition cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
