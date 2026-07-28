import React, { useState } from 'react';
import { 
  X, 
  Terminal, 
  Copy, 
  Check, 
  Download, 
  Server, 
  Globe, 
  CheckCircle2, 
  Layers 
} from 'lucide-react';

interface CoolifyDeploymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CoolifyDeploymentModal: React.FC<CoolifyDeploymentModalProps> = ({
  isOpen,
  onClose
}) => {
  const [copiedFile, setCopiedFile] = useState<string | null>(null);

  if (!isOpen) return null;

  const dockerfileSnippet = `# Dockerfile for Coolify Static Site Deployment (tissue.farmr)
# Step 1: Build Phase
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Step 2: Production Nginx Server
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]`;

  const nginxConfSnippet = `server {
    listen 80;
    server_name explants.farmr localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, no-transform";
    }
}`;

  const dockerComposeSnippet = `version: '3.8'
services:
  tissue-farmr:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "80:80"
    restart: always
    environment:
      - NODE_ENV=production`;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFile(label);
    setTimeout(() => setCopiedFile(null), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#12121e] border border-[#2e2e48] rounded-2xl max-w-2xl w-full p-6 space-y-5 animate-in zoom-in-95 my-8">
        <div className="flex items-center justify-between pb-3 border-b border-[#252538]">
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-[#9d4edd]" />
            <h3 className="text-base font-bold text-white">Coolify Static Site Deployment Guide</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#1a1a28]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs text-slate-300">
          <div className="bg-[#181828] p-3 rounded-xl border border-[#2e2e42] flex items-center gap-3">
            <Globe className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <span className="font-bold text-white block">Target Domain: explants.farmr</span>
              <span className="text-[11px] text-slate-400">Pure client-side React SPA with zero database dependency. Coolify static container setup.</span>
            </div>
          </div>

          {/* Dockerfile */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-slate-200 font-semibold font-mono">
              <span>1. Dockerfile (Multi-stage build)</span>
              <button
                onClick={() => handleCopy(dockerfileSnippet, 'dockerfile')}
                className="text-[10px] bg-[#1a1a28] hover:bg-[#28283e] border border-[#34344e] text-slate-300 px-2.5 py-1 rounded-lg flex items-center gap-1 font-sans"
              >
                {copiedFile === 'dockerfile' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedFile === 'dockerfile' ? 'Copied' : 'Copy Dockerfile'}</span>
              </button>
            </div>
            <pre className="bg-[#0a0a0f] p-3 rounded-xl border border-[#222232] text-[11px] font-mono text-emerald-300 overflow-x-auto">
              {dockerfileSnippet}
            </pre>
          </div>

          {/* Nginx Conf */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-slate-200 font-semibold font-mono">
              <span>2. nginx.conf (SPA Fallback)</span>
              <button
                onClick={() => handleCopy(nginxConfSnippet, 'nginx')}
                className="text-[10px] bg-[#1a1a28] hover:bg-[#28283e] border border-[#34344e] text-slate-300 px-2.5 py-1 rounded-lg flex items-center gap-1 font-sans"
              >
                {copiedFile === 'nginx' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedFile === 'nginx' ? 'Copied' : 'Copy nginx.conf'}</span>
              </button>
            </div>
            <pre className="bg-[#0a0a0f] p-3 rounded-xl border border-[#222232] text-[11px] font-mono text-emerald-300 overflow-x-auto">
              {nginxConfSnippet}
            </pre>
          </div>

          {/* Coolify Steps */}
          <div className="bg-[#161624] p-4 rounded-xl border border-[#26263a] space-y-2">
            <span className="font-bold text-white block">Coolify 3-Step Setup Instructions:</span>
            <ol className="list-decimal list-inside space-y-1 text-slate-300 text-[11px] leading-relaxed">
              <li>In Coolify Dashboard, click <strong>+ Add Resource</strong> &rarr; select <strong>Git Repository / Static Site</strong>.</li>
              <li>Set Build Pack to <strong>Dockerfile</strong> or <strong>Static</strong> with publish directory set to <code>dist</code>.</li>
              <li>Configure Custom Domain to <code>explants.farmr</code> and port <code>80</code>. Click <strong>Deploy</strong>!</li>
            </ol>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="bg-[#7b2cbf] hover:bg-[#9d4edd] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-[#7b2cbf]/30"
          >
            Got it, close guide
          </button>
        </div>
      </div>
    </div>
  );
};
