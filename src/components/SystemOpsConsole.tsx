import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Cpu, Database, Activity, RefreshCw, Layers, ShieldCheck, Play, Radio, Wifi, Server, AlertOctagon } from 'lucide-react';

interface LogEntry {
  id: string;
  timestamp: string;
  service: string;
  operation: string;
  details: any;
  status: 'info' | 'success' | 'warn' | 'error';
}

interface ServiceMetric {
  name: string;
  category: string;
  status: 'online' | 'busy' | 'offline';
  latency: number;
  cpu: number;
  memory: number;
}

export default function SystemOpsConsole() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'logs' | 'services' | 'db'>('logs');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isAutoScroll, setIsAutoScroll] = useState(true);
  const [metrics, setMetrics] = useState<any>({
    cpuLoad: 24,
    memoryUsage: 54,
    activeStreams: 140,
    bandwidth: 220,
    errorRate: '0.015',
    activeUsers: 1540
  });

  const terminalEndRef = useRef<HTMLDivElement | null>(null);

  // Poll system logs
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOpen) {
      const fetchLogsAndMetrics = async () => {
        try {
          const logsRes = await fetch('/api/system/logs');
          if (logsRes.ok) {
            const data = await logsRes.json();
            setLogs(data);
          }

          const metricsRes = await fetch('/api/admin/system/metrics');
          if (metricsRes.ok) {
            const mData = await metricsRes.json();
            setMetrics(mData);
          }
        } catch (e) {
          console.warn("DevOps Console: fetch failed.", e);
        }
      };

      fetchLogsAndMetrics();
      interval = setInterval(fetchLogsAndMetrics, 1500);
    }
    return () => clearInterval(interval);
  }, [isOpen]);

  // Auto scroll
  useEffect(() => {
    if (isAutoScroll && terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isAutoScroll]);

  // Simulated Services metadata
  const SERVICE_LIST: ServiceMetric[] = [
    { name: 'Auth & JWT Gateway', category: 'Security', status: 'online', latency: 12, cpu: 5, memory: 45 },
    { name: 'User Directory Service', category: 'Core', status: 'online', latency: 8, cpu: 3, memory: 30 },
    { name: 'Course Content Service', category: 'LMS', status: 'online', latency: 15, cpu: 7, memory: 65 },
    { name: 'Video Token Transcoder', category: 'Streaming', status: metrics.activeStreams > 150 ? 'busy' : 'online', latency: 45, cpu: metrics.cpuLoad, memory: metrics.memoryUsage },
    { name: 'Live WebRTC Orchestrator', category: 'Streaming', status: 'online', latency: 22, cpu: 18, memory: 120 },
    { name: 'Checkout Ledger Service', category: 'Finance', status: 'online', latency: 35, cpu: 2, memory: 55 },
    { name: 'Sankalp Quiz Service', category: 'Assessment', status: 'online', latency: 10, cpu: 4, memory: 35 },
    { name: 'Assignment Evaluator', category: 'Assessment', status: 'online', latency: 14, cpu: 3, memory: 40 },
    { name: 'Vedas SMS & Email Worker', category: 'Notification', status: 'online', latency: 90, cpu: 6, memory: 28 },
    { name: 'Support Ticketing Hub', category: 'Support', status: 'online', latency: 25, cpu: 1, memory: 15 },
    { name: 'Audit Compliance Engine', category: 'Security', status: 'online', latency: 6, cpu: 1, memory: 10 },
    { name: 'Analytics Event Collector', category: 'Data', status: 'online', latency: 18, cpu: 12, memory: 95 },
  ];

  return (
    <>
      {/* Floating Action Button (FAB) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[9999] bg-[var(--color-occult-purple)] text-white hover:bg-[var(--color-occult-purple-light)] p-3.5 rounded-full shadow-[0_0_20px_rgba(249,115,22,0.45)] hover:scale-105 transition-all cursor-pointer flex items-center space-x-1"
        title="Toggle DevOps Architecture HUD Console"
      >
        <Terminal className="w-5 h-5 animate-pulse" />
        <span className="text-[10px] font-mono font-bold tracking-widest uppercase hidden md:inline-block">System Ops</span>
      </button>

      {/* Slide-out Terminal Drawer */}
      {isOpen && (
        <div className="fixed inset-y-0 right-0 z-[9998] w-full sm:w-[580px] bg-white/98 border-l border-gray-300 shadow-[0_0_40px_rgba(0,0,0,0.85)] flex flex-col font-mono text-xs text-gray-600 animate-in slide-in-from-right duration-350">

          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-[var(--color-occult-purple-very-light)] to-[#120703] border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-[var(--color-occult-purple)] animate-pulse" />
              <div>
                <h3 className="text-[var(--color-occult-purple)] font-bold font-serif text-sm tracking-wider uppercase">Vedic-OS Architecture HUD</h3>
                <p className="text-[9px] text-gray-500 uppercase font-mono">Microservice Telemetry & System Traces</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-orange-400 text-sm font-serif font-black"
            >
              ✕
            </button>
          </div>

          {/* Quick HUD Metrics Bar */}
          <div className="grid grid-cols-3 gap-1 bg-orange-50 border-b border-gray-200 p-2 text-center text-[10px]">
            <div className="border-r border-gray-200 py-1">
              <span className="text-gray-500 block">VIRTUAL LOAD</span>
              <span className="text-[var(--color-occult-purple)] font-bold">{metrics.cpuLoad}% CPU</span>
            </div>
            <div className="border-r border-gray-200 py-1">
              <span className="text-gray-500 block">ACTIVE STREAMS</span>
              <span className="text-[var(--color-occult-purple)] font-bold">{metrics.activeStreams} HLS</span>
            </div>
            <div className="py-1">
              <span className="text-gray-500 block">BANDWIDTH</span>
              <span className="text-[var(--color-occult-purple)] font-bold">{metrics.bandwidth} Mbps</span>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex bg-white border-b border-gray-200">
            <button
              onClick={() => setActiveTab('logs')}
              className={`flex-1 py-3 text-center border-b-2 font-bold flex items-center justify-center space-x-1.5 cursor-pointer uppercase tracking-wider text-[10px] ${activeTab === 'logs'
                  ? 'border-orange-500 text-[var(--color-occult-purple)] bg-orange-950/10'
                  : 'border-transparent text-gray-500 hover:text-gray-200'
                }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Trace logs</span>
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`flex-1 py-3 text-center border-b-2 font-bold flex items-center justify-center space-x-1.5 cursor-pointer uppercase tracking-wider text-[10px] ${activeTab === 'services'
                  ? 'border-orange-500 text-[var(--color-occult-purple)] bg-orange-950/10'
                  : 'border-transparent text-gray-500 hover:text-gray-200'
                }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Microservices</span>
            </button>
            <button
              onClick={() => setActiveTab('db')}
              className={`flex-1 py-3 text-center border-b-2 font-bold flex items-center justify-center space-x-1.5 cursor-pointer uppercase tracking-wider text-[10px] ${activeTab === 'db'
                  ? 'border-orange-500 text-[var(--color-occult-purple)] bg-orange-950/10'
                  : 'border-transparent text-gray-500 hover:text-gray-200'
                }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Data Rings</span>
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto bg-white p-4 min-h-0">
            {activeTab === 'logs' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-gray-500 text-[10px] border-b border-gray-200 pb-2">
                  <span>SHOWING {logs.length} TRACE LOOPS</span>
                  <label className="flex items-center space-x-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAutoScroll}
                      onChange={(e) => setIsAutoScroll(e.target.checked)}
                      className="rounded border-gray-300 text-orange-600 bg-transparent"
                    />
                    <span>AUTO SCROLL</span>
                  </label>
                </div>

                {logs.length === 0 ? (
                  <div className="text-center py-20 text-gray-600">
                    <Activity className="w-8 h-8 mx-auto mb-2 text-orange-500/10 animate-pulse" />
                    <p className="font-serif italic text-xs">Awaiting platform interactions...</p>
                    <p className="text-[10px] text-gray-650 mt-1">Every click in the platform (purchases, playing videos, logging, quizzes) prints operation traces here.</p>
                  </div>
                ) : (
                  <div className="space-y-3 font-mono text-[11px] leading-relaxed">
                    {logs.map((log) => (
                      <div
                        key={log.id}
                        className={`p-2.5 border rounded-lg bg-orange-50 ${log.status === 'success' ? 'border-emerald-500/20 text-emerald-400/90' :
                            log.status === 'warn' ? 'border-yellow-500/20 text-yellow-400/90' :
                              log.status === 'error' ? 'border-red-500/20 text-red-500/90' :
                                'border-gray-200 text-orange-300/80'
                          }`}
                      >
                        <div className="flex items-center justify-between border-b border-gray-200 pb-1 mb-1.5 opacity-80 text-[10px]">
                          <span className="font-bold uppercase tracking-wider bg-orange-950/20 px-1 py-0.5 rounded text-[var(--color-occult-purple)] border border-gray-200">
                            ⚙️ {log.service}
                          </span>
                          <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <div className="font-bold mb-1">{log.operation}</div>
                        {log.details && (
                          <pre className="bg-gray-100 p-2 rounded text-[10px] overflow-x-auto border border-gray-200 text-gray-500 max-h-24 scrollbar-thin">
                            {JSON.stringify(log.details, null, 2)}
                          </pre>
                        )}
                      </div>
                    ))}
                    <div ref={terminalEndRef} />
                  </div>
                )}
              </div>
            )}

            {activeTab === 'services' && (
              <div className="space-y-4">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest">Federated Microservices Ring Node Registry</p>
                <div className="grid grid-cols-1 gap-2.5">
                  {SERVICE_LIST.map((srv, idx) => (
                    <div key={idx} className="p-3 bg-white border border-gray-200 rounded-xl flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${srv.status === 'online' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse' :
                            srv.status === 'busy' ? 'bg-yellow-500 shadow-[0_0_8px_rgba(245,158,11,0.5)] animate-pulse' :
                              'bg-red-500'
                          }`} />
                        <div>
                          <div className="font-bold text-gray-700">{srv.name}</div>
                          <div className="text-[9px] text-gray-500 font-mono uppercase">{srv.category} service</div>
                        </div>
                      </div>
                      <div className="text-right text-[10px] space-y-0.5">
                        <div className="text-[var(--color-occult-purple)] font-bold">{srv.latency}ms latency</div>
                        <div className="text-gray-500 font-mono">CPU: {srv.cpu}% | MEM: {srv.memory}MB</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'db' && (
              <div className="space-y-5">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest">Enterprise Database Mappings</p>

                {/* Postgres */}
                <div className="p-3.5 bg-white border border-gray-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between border-b border-gray-200 pb-1.5">
                    <span className="font-bold text-gray-700 flex items-center space-x-1.5">
                      <Database className="w-3.5 h-3.5 text-blue-400" />
                      <span>PostgreSQL Relational Storage</span>
                    </span>
                    <span className="text-[9px] text-emerald-500 bg-emerald-950/20 px-1.5 py-0.5 rounded border border-emerald-500/10">Active Connections: 18</span>
                  </div>
                  <div className="text-[10px] text-gray-500 space-y-1 font-mono">
                    <div>📊 Total Tuples: 45,920 records cached</div>
                    <div>⚡ Master Replication: Primary Node (100% synced)</div>
                    <div>🔐 SSL: Enabled (TLS v1.3)</div>
                  </div>
                </div>

                {/* Redis */}
                <div className="p-3.5 bg-white border border-gray-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between border-b border-gray-200 pb-1.5">
                    <span className="font-bold text-gray-700 flex items-center space-x-1.5">
                      <Cpu className="w-3.5 h-3.5 text-red-500" />
                      <span>Redis In-Memory Session Cache</span>
                    </span>
                    <span className="text-[9px] text-emerald-500 bg-emerald-950/20 px-1.5 py-0.5 rounded border border-emerald-500/10">Hit Rate: 98.4%</span>
                  </div>
                  <div className="text-[10px] text-gray-500 space-y-1 font-mono">
                    <div>🔑 Cached Sessions: {metrics.activeUsers} active user segments</div>
                    <div>🗄️ Caching size: 142.5 MB used memory</div>
                    <div>⏱️ Rate limiter rules: 60 requests / minute / IP</div>
                  </div>
                </div>

                {/* Pinecone */}
                <div className="p-3.5 bg-white border border-gray-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between border-b border-gray-200 pb-1.5">
                    <span className="font-bold text-gray-700 flex items-center space-x-1.5">
                      <Layers className="w-3.5 h-3.5 text-purple-400" />
                      <span>Pinecone Vector Database (AI)</span>
                    </span>
                    <span className="text-[9px] text-emerald-500 bg-emerald-950/20 px-1.5 py-0.5 rounded border border-emerald-500/10">Dimensions: 1536</span>
                  </div>
                  <div className="text-[10px] text-gray-500 space-y-1 font-mono">
                    <div>📂 Vector Count: 8,420 Scripture Embeddings</div>
                    <div>🔍 Indexing: Cosine Similarity Metric</div>
                    <div>✨ AI Query Engine: Enabled (Sankalp neural core)</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
