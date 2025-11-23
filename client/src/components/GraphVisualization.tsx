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
  Laptop,
  Cloud,
  Lock,
  ZoomIn,
  ZoomOut,
  Maximize2
} from "lucide-react";

interface GraphNode {
  id: string;
  label: string;
  type: "asset" | "threat" | "vulnerability" | "user" | "network";
  risk?: "high" | "medium" | "low";
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
}

interface GraphEdge {
  source: string;
  target: string;
  label: string;
  type: "exploits" | "connects" | "protects" | "accesses";
}

const nodeIcons = {
  asset: Server,
  threat: AlertTriangle,
  vulnerability: Shield,
  user: Laptop,
  network: Network
};

const nodeColors = {
  asset: "#3b82f6",
  threat: "#ef4444",
  vulnerability: "#f59e0b",
  user: "#8b5cf6",
  network: "#10b981"
};

const riskColors = {
  high: "#dc2626",
  medium: "#f59e0b",
  low: "#10b981"
};

export default function GraphVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const animationRef = useRef<number>(0);

  // Sample graph data
  const nodes: GraphNode[] = [
    { id: "web-server", label: "Web Server", type: "asset", risk: "high" },
    { id: "database", label: "Database", type: "asset", risk: "medium" },
    { id: "firewall", label: "Firewall", type: "asset", risk: "low" },
    { id: "cve-2024-001", label: "CVE-2024-001", type: "vulnerability", risk: "high" },
    { id: "sql-injection", label: "SQL Injection", type: "threat", risk: "high" },
    { id: "ddos", label: "DDoS Attack", type: "threat", risk: "medium" },
    { id: "admin-user", label: "Admin User", type: "user", risk: "medium" },
    { id: "internal-net", label: "Internal Network", type: "network", risk: "low" },
    { id: "dmz", label: "DMZ", type: "network", risk: "medium" },
    { id: "api-server", label: "API Server", type: "asset", risk: "medium" },
    { id: "auth-service", label: "Auth Service", type: "asset", risk: "low" },
    { id: "xss-vuln", label: "XSS Vulnerability", type: "vulnerability", risk: "medium" }
  ];

  const edges: GraphEdge[] = [
    { source: "cve-2024-001", target: "web-server", label: "exploits", type: "exploits" },
    { source: "sql-injection", target: "database", label: "targets", type: "exploits" },
    { source: "ddos", target: "web-server", label: "attacks", type: "exploits" },
    { source: "web-server", target: "database", label: "queries", type: "connects" },
    { source: "firewall", target: "web-server", label: "protects", type: "protects" },
    { source: "admin-user", target: "web-server", label: "manages", type: "accesses" },
    { source: "web-server", target: "dmz", label: "resides in", type: "connects" },
    { source: "database", target: "internal-net", label: "resides in", type: "connects" },
    { source: "firewall", target: "dmz", label: "secures", type: "protects" },
    { source: "api-server", target: "database", label: "queries", type: "connects" },
    { source: "auth-service", target: "admin-user", label: "authenticates", type: "protects" },
    { source: "xss-vuln", target: "api-server", label: "exploits", type: "exploits" },
    { source: "api-server", target: "dmz", label: "resides in", type: "connects" }
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Initialize node positions
    nodes.forEach((node, i) => {
      if (!node.x || !node.y) {
        const angle = (i / nodes.length) * 2 * Math.PI;
        const radius = Math.min(width, height) * 0.3;
        node.x = width / 2 + radius * Math.cos(angle);
        node.y = height / 2 + radius * Math.sin(angle);
        node.vx = 0;
        node.vy = 0;
      }
    });

    // Force simulation
    const simulate = () => {
      // Apply forces
      const centerForce = 0.01;
      const repelForce = 2000;
      const attractForce = 0.01;
      const damping = 0.9;

      nodes.forEach(node => {
        if (!node.x || !node.y || !node.vx || !node.vy) return;

        // Center attraction
        const dx = width / 2 - node.x;
        const dy = height / 2 - node.y;
        node.vx! += dx * centerForce;
        node.vy! += dy * centerForce;

        // Node repulsion
        nodes.forEach(other => {
          if (node === other || !other.x || !other.y) return;
          const dx = node.x! - other.x;
          const dy = node.y! - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy) + 1;
          const force = repelForce / (dist * dist);
          node.vx! += (dx / dist) * force;
          node.vy! += (dy / dist) * force;
        });

        // Edge attraction
        edges.forEach(edge => {
          const source = nodes.find(n => n.id === edge.source);
          const target = nodes.find(n => n.id === edge.target);
          if (!source || !target || !source.x || !source.y || !target.x || !target.y) return;

          if (node === source) {
            const dx = target.x - source.x;
            const dy = target.y - source.y;
            node.vx! += dx * attractForce;
            node.vy! += dy * attractForce;
          }
          if (node === target) {
            const dx = source.x - target.x;
            const dy = source.y - target.y;
            node.vx! += dx * attractForce;
            node.vy! += dy * attractForce;
          }
        });

        // Apply velocity with damping
        node.vx! *= damping;
        node.vy! *= damping;
        node.x! += node.vx!;
        node.y! += node.vy!;
      });

      // Render
      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.translate(pan.x, pan.y);
      ctx.scale(zoom, zoom);

      // Draw edges
      edges.forEach(edge => {
        const source = nodes.find(n => n.id === edge.source);
        const target = nodes.find(n => n.id === edge.target);
        if (!source || !target || !source.x || !source.y || !target.x || !target.y) return;

        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.lineTo(target.x, target.y);
        
        if (edge.type === "exploits") {
          ctx.strokeStyle = "#ef4444";
          ctx.lineWidth = 2;
          ctx.setLineDash([5, 5]);
        } else if (edge.type === "protects") {
          ctx.strokeStyle = "#10b981";
          ctx.lineWidth = 2;
          ctx.setLineDash([]);
        } else {
          ctx.strokeStyle = "#94a3b8";
          ctx.lineWidth = 1;
          ctx.setLineDash([]);
        }
        ctx.stroke();

        // Draw arrow
        const angle = Math.atan2(target.y - source.y, target.x - source.x);
        const arrowSize = 8;
        ctx.save();
        ctx.translate(target.x, target.y);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(-arrowSize, -arrowSize / 2);
        ctx.lineTo(0, 0);
        ctx.lineTo(-arrowSize, arrowSize / 2);
        ctx.strokeStyle = edge.type === "exploits" ? "#ef4444" : edge.type === "protects" ? "#10b981" : "#94a3b8";
        ctx.stroke();
        ctx.restore();
      });

      ctx.setLineDash([]);

      // Draw nodes
      nodes.forEach(node => {
        if (!node.x || !node.y) return;

        const isSelected = selectedNode?.id === node.id;
        const radius = isSelected ? 35 : 25;

        // Node circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = nodeColors[node.type];
        ctx.fill();
        
        if (isSelected) {
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 3;
          ctx.stroke();
        }

        // Risk indicator
        if (node.risk) {
          ctx.beginPath();
          ctx.arc(node.x + radius - 8, node.y - radius + 8, 6, 0, 2 * Math.PI);
          ctx.fillStyle = riskColors[node.risk];
          ctx.fill();
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        // Label
        ctx.fillStyle = "#1f2937";
        ctx.font = "12px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(node.label, node.x, node.y + radius + 15);
      });

      ctx.restore();

      animationRef.current = requestAnimationFrame(simulate);
    };

    simulate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [zoom, pan, selectedNode]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - pan.x) / zoom;
    const y = (e.clientY - rect.top - pan.y) / zoom;

    const clicked = nodes.find(node => {
      if (!node.x || !node.y) return false;
      const dist = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2);
      return dist < 25;
    });

    setSelectedNode(clicked || null);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch support for mobile
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX - pan.x, y: e.touches[0].clientY - pan.y });
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDragging || e.touches.length !== 1) return;
    e.preventDefault();
    setPan({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoom(Math.min(zoom * 1.2, 3))}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoom(Math.max(zoom / 1.2, 0.5))}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setZoom(1);
              setPan({ x: 0, y: 0 });
            }}
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-4 text-sm">
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

      <div className="grid lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3">
          <Card>
            <CardContent className="p-0">
              <canvas
                ref={canvasRef}
                width={800}
                height={600}
                className="w-full h-[400px] md:h-[600px] cursor-move touch-none"
                onClick={handleCanvasClick}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              />
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-4">Node Details</h3>
              {selectedNode ? (
                <div className="space-y-4">
                  <div>
                    <Badge style={{ backgroundColor: nodeColors[selectedNode.type] }} className="text-white">
                      {selectedNode.type}
                    </Badge>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Name</div>
                    <div className="font-semibold">{selectedNode.label}</div>
                  </div>
                  {selectedNode.risk && (
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Risk Level</div>
                      <Badge 
                        style={{ backgroundColor: riskColors[selectedNode.risk] }}
                        className="text-white uppercase"
                      >
                        {selectedNode.risk}
                      </Badge>
                    </div>
                  )}
                  <div>
                    <div className="text-sm text-gray-600 mb-2">Connections</div>
                    <div className="space-y-1 text-sm">
                      {edges
                        .filter(e => e.source === selectedNode.id || e.target === selectedNode.id)
                        .map((edge, i) => (
                          <div key={i} className="text-gray-700">
                            {edge.source === selectedNode.id ? "→" : "←"} {edge.label}
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-600">Click on a node to view details</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
