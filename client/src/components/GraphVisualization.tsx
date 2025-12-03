import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  Server, 
  AlertTriangle, 
  Network, 
  Database,
  Users,
  ZoomIn,
  ZoomOut,
  Maximize2
} from "lucide-react";

interface GraphNode {
  id: string;
  label: string;
  type: "asset" | "threat" | "vulnerability" | "user" | "network";
  risk: "high" | "medium" | "low";
  x: number;
  y: number;
  description?: string;
  ip?: string;
  status?: string;
  lastSeen?: string;
}

interface GraphEdge {
  source: string;
  target: string;
  label: string;
  type: "exploits" | "protects" | "connects" | "accesses";
  description?: string;
  protocol?: string;
  port?: number;
  traffic?: string;
  timestamp?: string;
}

const nodeColors = {
  asset: "#3b82f6",
  threat: "#ef4444",
  vulnerability: "#f59e0b",
  user: "#a855f7",
  network: "#10b981"
};

const nodeIcons = {
  asset: Server,
  threat: AlertTriangle,
  vulnerability: Shield,
  user: Users,
  network: Network
};

const riskColors = {
  high: "#dc2626",
  medium: "#f59e0b",
  low: "#10b981"
};

export default function GraphVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<GraphEdge | null>(null);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  // Fixed node positions for reliable layout
  const nodes: GraphNode[] = [
    { id: "web-server", label: "Web Server", type: "asset", risk: "high", x: 550, y: 350, description: "Apache 2.4.52 web server hosting customer portal", ip: "192.168.1.100", status: "Active", lastSeen: "2 minutes ago" },
    { id: "database", label: "Database", type: "asset", risk: "medium", x: 550, y: 500, description: "relational database 14.5 primary database", ip: "10.0.2.50", status: "Active", lastSeen: "1 minute ago" },
    { id: "firewall", label: "Firewall", type: "asset", risk: "low", x: 400, y: 500, description: "Cisco ASA 5525-X next-gen firewall", ip: "192.168.1.1", status: "Active", lastSeen: "30 seconds ago" },
    { id: "cve-2024-001", label: "CVE-2024-001", type: "vulnerability", risk: "high", x: 350, y: 450, description: "Remote code execution vulnerability in Apache HTTP Server", status: "Unpatched", lastSeen: "Detected 3 hours ago" },
    { id: "sql-injection", label: "SQL Injection", type: "threat", risk: "high", x: 300, y: 500, description: "Active SQL injection attack attempts detected", status: "Blocked", lastSeen: "15 minutes ago" },
    { id: "ddos", label: "DDoS Attack", type: "threat", risk: "medium", x: 250, y: 400, description: "Distributed denial of service traffic spike", status: "Mitigated", lastSeen: "1 hour ago" },
    { id: "admin-user", label: "Admin User", type: "user", risk: "medium", x: 200, y: 350, description: "System administrator account - John Smith", status: "Logged in", lastSeen: "5 minutes ago" },
    { id: "internal-net", label: "Internal Network", type: "network", risk: "low", x: 250, y: 300, description: "Corporate internal network segment", ip: "10.0.0.0/16", status: "Normal", lastSeen: "Active" },
    { id: "dmz", label: "DMZ", type: "network", risk: "medium", x: 350, y: 250, description: "Demilitarized zone for public-facing services", ip: "192.168.1.0/24", status: "Monitored", lastSeen: "Active" },
    { id: "api-server", label: "API Server", type: "asset", risk: "medium", x: 450, y: 250, description: "Node.js REST API backend service", ip: "192.168.1.150", status: "Active", lastSeen: "3 minutes ago" },
    { id: "auth-service", label: "Auth Service", type: "asset", risk: "low", x: 500, y: 300, description: "OAuth 2.0 authentication service", ip: "10.0.2.100", status: "Active", lastSeen: "2 minutes ago" },
    { id: "xss-vuln", label: "XSS Vulnerability", type: "vulnerability", risk: "medium", x: 600, y: 300, description: "Cross-site scripting vulnerability in API endpoints", status: "Patch pending", lastSeen: "Detected 2 days ago" }
  ];

  const edges: GraphEdge[] = [
    { source: "cve-2024-001", target: "web-server", label: "exploits", type: "exploits", description: "Vulnerability allows remote code execution on web server", protocol: "HTTP", port: 443, traffic: "15 MB/day", timestamp: "2024-11-24 07:30:00" },
    { source: "sql-injection", target: "database", label: "targets", type: "exploits", description: "Malicious SQL queries attempting data exfiltration", protocol: "relational database", port: 5432, traffic: "250 requests/hour", timestamp: "2024-11-24 09:45:00" },
    { source: "ddos", target: "web-server", label: "attacks", type: "exploits", description: "Volumetric DDoS attack overwhelming server resources", protocol: "TCP/UDP", port: 80, traffic: "2.5 GB/hour", timestamp: "2024-11-24 09:00:00" },
    { source: "web-server", target: "database", label: "queries", type: "connects", description: "Normal database queries for application data", protocol: "relational database", port: 5432, traffic: "500 MB/day", timestamp: "Active" },
    { source: "firewall", target: "web-server", label: "protects", type: "protects", description: "Firewall rules filtering inbound traffic", protocol: "Stateful inspection", port: 443, traffic: "Monitored", timestamp: "Active" },
    { source: "admin-user", target: "web-server", label: "manages", type: "accesses", description: "Administrative SSH access for server management", protocol: "SSH", port: 22, traffic: "10 sessions/day", timestamp: "2024-11-24 10:05:00" },
    { source: "web-server", target: "dmz", label: "resides in", type: "connects", description: "Web server deployed in DMZ network segment", protocol: "N/A", traffic: "N/A", timestamp: "Permanent" },
    { source: "database", target: "internal-net", label: "resides in", type: "connects", description: "Database isolated in internal network", protocol: "N/A", traffic: "N/A", timestamp: "Permanent" },
    { source: "firewall", target: "dmz", label: "secures", type: "protects", description: "Firewall protecting DMZ perimeter", protocol: "Stateful inspection", traffic: "All traffic", timestamp: "Active" },
    { source: "api-server", target: "database", label: "queries", type: "connects", description: "API backend querying database for REST endpoints", protocol: "relational database", port: 5432, traffic: "1.2 GB/day", timestamp: "Active" },
    { source: "auth-service", target: "admin-user", label: "authenticates", type: "protects", description: "OAuth 2.0 token validation for admin access", protocol: "HTTPS", port: 443, traffic: "50 requests/day", timestamp: "2024-11-24 10:05:00" },
    { source: "xss-vuln", target: "api-server", label: "exploits", type: "exploits", description: "XSS payload injection in API response headers", protocol: "HTTP", port: 8080, traffic: "5 attempts/day", timestamp: "2024-11-22 14:20:00" },
    { source: "api-server", target: "dmz", label: "resides in", type: "connects", description: "API server deployed in DMZ for external access", protocol: "N/A", traffic: "N/A", timestamp: "Permanent" }
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.translate(pan.x, pan.y);
    ctx.scale(zoom, zoom);

    // Draw edges
    edges.forEach(edge => {
      const source = nodes.find(n => n.id === edge.source);
      const target = nodes.find(n => n.id === edge.target);
      if (!source || !target) return;

      ctx.beginPath();
      ctx.moveTo(source.x, source.y);
      ctx.lineTo(target.x, target.y);
      
      // Style based on edge type
      if (edge.type === "exploits") {
        ctx.strokeStyle = "#ef4444";
        ctx.setLineDash([5, 5]);
        ctx.lineWidth = 2;
      } else if (edge.type === "protects") {
        ctx.strokeStyle = "#10b981";
        ctx.setLineDash([]);
        ctx.lineWidth = 2;
      } else {
        ctx.strokeStyle = "#94a3b8";
        ctx.setLineDash([]);
        ctx.lineWidth = 1;
      }
      
      // Highlight selected edge
      if (selectedEdge && selectedEdge.source === edge.source && selectedEdge.target === edge.target) {
        ctx.lineWidth = 4;
        ctx.strokeStyle = "#3b82f6";
      }
      
      ctx.stroke();
      ctx.setLineDash([]);
    });

    // Draw nodes
    nodes.forEach(node => {
      const isSelected = selectedNode?.id === node.id;
      const isHovered = hoveredNode?.id === node.id;
      const radius = isSelected ? 30 : isHovered ? 28 : 25;

      // Node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
      ctx.fillStyle = nodeColors[node.type];
      ctx.fill();
      
      // Selection/hover ring
      if (isSelected || isHovered) {
        ctx.strokeStyle = isSelected ? "#3b82f6" : "#64748b";
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      // Risk indicator (small dot)
      ctx.beginPath();
      ctx.arc(node.x + 15, node.y - 15, 6, 0, 2 * Math.PI);
      ctx.fillStyle = riskColors[node.risk];
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Label
      ctx.fillStyle = "#1e293b";
      ctx.font = "12px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(node.label, node.x, node.y + radius + 15);
    });

    ctx.restore();
  }, [nodes, edges, selectedNode, selectedEdge, hoveredNode, zoom, pan]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const canvasX = (e.clientX - rect.left) * scaleX;
    const canvasY = (e.clientY - rect.top) * scaleY;
    
    const x = (canvasX - pan.x) / zoom;
    const y = (canvasY - pan.y) / zoom;

    // Check for node click
    const clickedNode = nodes.find(node => {
      const dist = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2);
      return dist < 25;
    });

    if (clickedNode) {
      setSelectedNode(clickedNode);
      setSelectedEdge(null);
      return;
    }

    // Check for edge click
    const clickedEdge = edges.find(edge => {
      const source = nodes.find(n => n.id === edge.source);
      const target = nodes.find(n => n.id === edge.target);
      if (!source || !target) return false;

      // Calculate distance from point to line segment
      const A = x - source.x;
      const B = y - source.y;
      const C = target.x - source.x;
      const D = target.y - source.y;

      const dot = A * C + B * D;
      const lenSq = C * C + D * D;
      let param = -1;
      if (lenSq !== 0) param = dot / lenSq;

      let xx, yy;
      if (param < 0) {
        xx = source.x;
        yy = source.y;
      } else if (param > 1) {
        xx = target.x;
        yy = target.y;
      } else {
        xx = source.x + param * C;
        yy = source.y + param * D;
      }

      const dx = x - xx;
      const dy = y - yy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      return dist < 10;
    });

    if (clickedEdge) {
      setSelectedEdge(clickedEdge);
      setSelectedNode(null);
    } else {
      setSelectedNode(null);
      setSelectedEdge(null);
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const canvasX = (e.clientX - rect.left) * scaleX;
    const canvasY = (e.clientY - rect.top) * scaleY;
    
    const x = (canvasX - pan.x) / zoom;
    const y = (canvasY - pan.y) / zoom;

    const hovered = nodes.find(node => {
      const dist = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2);
      return dist < 25;
    });

    setHoveredNode(hovered || null);
    canvas.style.cursor = hovered ? "pointer" : "default";
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev * 1.2, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev / 1.2, 0.5));
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const getNodeIcon = (type: string) => {
    const Icon = nodeIcons[type as keyof typeof nodeIcons];
    return Icon ? <Icon className="h-5 w-5" /> : null;
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graph Canvas */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleZoomIn}>
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleZoomOut}>
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleReset}>
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span>Assets</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span>Threats</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                    <span>Vulnerabilities</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                    <span>Users</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span>Networks</span>
                  </div>
                </div>
              </div>
              <canvas
                ref={canvasRef}
                width={800}
                height={600}
                onClick={handleCanvasClick}
                onMouseMove={handleCanvasMouseMove}
                className="w-full border border-border rounded-lg bg-slate-50"
              />
            </CardContent>
          </Card>
        </div>

        {/* Details Panel */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Details</h3>
              
              {selectedNode ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="p-3 rounded-lg"
                      style={{ backgroundColor: nodeColors[selectedNode.type] + "20" }}
                    >
                      {getNodeIcon(selectedNode.type)}
                    </div>
                    <div>
                      <h4 className="font-semibold">{selectedNode.label}</h4>
                      <Badge variant={selectedNode.risk === "high" ? "destructive" : selectedNode.risk === "medium" ? "default" : "secondary"}>
                        {selectedNode.risk.toUpperCase()} RISK
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Type:</span>
                      <span className="ml-2 capitalize">{selectedNode.type}</span>
                    </div>
                    {selectedNode.description && (
                      <div>
                        <span className="font-medium">Description:</span>
                        <p className="mt-1 text-muted-foreground">{selectedNode.description}</p>
                      </div>
                    )}
                    {selectedNode.ip && (
                      <div>
                        <span className="font-medium">IP Address:</span>
                        <span className="ml-2 font-mono text-xs">{selectedNode.ip}</span>
                      </div>
                    )}
                    {selectedNode.status && (
                      <div>
                        <span className="font-medium">Status:</span>
                        <Badge variant="outline" className="ml-2">{selectedNode.status}</Badge>
                      </div>
                    )}
                    {selectedNode.lastSeen && (
                      <div>
                        <span className="font-medium">Last Seen:</span>
                        <span className="ml-2 text-muted-foreground">{selectedNode.lastSeen}</span>
                      </div>
                    )}
                  </div>

                  {/* Connected nodes */}
                  <div className="pt-4 border-t">
                    <h5 className="font-medium mb-2">Connections</h5>
                    <div className="space-y-1 text-sm">
                      {edges.filter(e => e.source === selectedNode.id || e.target === selectedNode.id).map((edge, i) => (
                        <div key={i} className="text-muted-foreground">
                          {edge.source === selectedNode.id ? `→ ${nodes.find(n => n.id === edge.target)?.label}` : `← ${nodes.find(n => n.id === edge.source)?.label}`}
                          <span className="ml-2 text-xs">({edge.label})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : selectedEdge ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Relationship</h4>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">{nodes.find(n => n.id === selectedEdge.source)?.label}</span>
                      <span className="text-muted-foreground">→</span>
                      <span className="font-medium">{nodes.find(n => n.id === selectedEdge.target)?.label}</span>
                    </div>
                    <Badge variant="outline" className="mt-2 capitalize">{selectedEdge.type}</Badge>
                  </div>

                  <div className="space-y-2 text-sm">
                    {selectedEdge.description && (
                      <div>
                        <span className="font-medium">Description:</span>
                        <p className="mt-1 text-muted-foreground">{selectedEdge.description}</p>
                      </div>
                    )}
                    {selectedEdge.protocol && (
                      <div>
                        <span className="font-medium">Protocol:</span>
                        <span className="ml-2">{selectedEdge.protocol}</span>
                      </div>
                    )}
                    {selectedEdge.port && (
                      <div>
                        <span className="font-medium">Port:</span>
                        <span className="ml-2 font-mono">{selectedEdge.port}</span>
                      </div>
                    )}
                    {selectedEdge.traffic && (
                      <div>
                        <span className="font-medium">Traffic:</span>
                        <span className="ml-2">{selectedEdge.traffic}</span>
                      </div>
                    )}
                    {selectedEdge.timestamp && (
                      <div>
                        <span className="font-medium">Timestamp:</span>
                        <span className="ml-2 text-muted-foreground">{selectedEdge.timestamp}</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">
                  Click on a node or edge to view details
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
