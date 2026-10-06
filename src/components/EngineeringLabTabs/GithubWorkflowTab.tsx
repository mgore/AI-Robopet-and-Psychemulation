import React, { useState } from "react";
import {
  Github,
  GitBranch,
  GitPullRequest,
  Workflow,
  Copy,
  Check,
  Download,
  Terminal,
  ShieldCheck,
  Cpu,
  FileCode,
  Tag,
  BookOpen
} from "lucide-react";

interface GithubWorkflowTabProps {
  onNotify?: (msg: string) => void;
}

export const GithubWorkflowTab: React.FC<GithubWorkflowTabProps> = ({ onNotify }) => {
  const [activeTab, setActiveTab] = useState<
    "setup" | "branching" | "cicd" | "releases" | "reference"
  >("setup");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

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
        run: npm ci`;

  return (
    <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-6 shadow-xl">
      <h3 className="text-base font-bold text-white flex items-center gap-2 font-mono mb-4">
        <Github className="w-5 h-5 text-cyan-400" />
        Robotics CI/CD Workflow Hub
      </h3>
      
      <div className="flex gap-2 mb-4 border-b border-slate-800 pb-2">
        {(["setup", "branching", "cicd", "releases", "reference"] as const).map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1 rounded text-xs font-mono capitalize ${activeTab === tab ? "bg-slate-800 text-white" : "text-slate-500 hover:text-slate-300"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="text-sm text-slate-300 font-mono">
        {activeTab === "cicd" && (
          <div>
            <p className="mb-2">Example CI/CD Pipeline:</p>
            <pre className="bg-slate-950 p-4 rounded text-[10px] overflow-auto border border-slate-800">{cicdWorkflowYaml}</pre>
            <button 
              onClick={() => downloadFile("ci-cd.yml", cicdWorkflowYaml)}
              className="mt-2 text-xs flex items-center gap-1 text-cyan-400 hover:text-cyan-300"
            >
              <Download className="w-3 h-3" /> Download Workflow
            </button>
          </div>
        )}
        {activeTab === "setup" && <p>Repository setup instructions...</p>}
      </div>
    </div>
  );
};
