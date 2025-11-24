import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface QuickReply {
  text: string;
  response: string;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadInfo, setLeadInfo] = useState({ name: "", email: "", company: "" });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickReplies: QuickReply[] = [
    { text: "What is TruContext?", response: "TruContext is an agentic AI-powered intelligence platform with dual database architecture (Neo4j + PostgreSQL) that transforms cybersecurity and operational intelligence. Our platform delivers 4x faster query performance, 90% reduction in false positives, and autonomous AI agents that plan and execute complex workflows without human intervention." },
    { text: "Pricing information", response: "TruContext pricing starts at $1/node per month with volume discounts as your deployment scales. We have a minimum monthly fee of $10,000. Most customers see 340% ROI within 18 months with average annual savings of $2.8M. Would you like to use our interactive pricing calculator or speak with our sales team for a custom quote?" },
    { text: "Key features", response: "TruContext's key features include: (1) Dual Database Architecture with Neo4j + PostgreSQL, (2) Agentic AI with autonomous workflow execution, (3) Real-time threat detection with 75% faster MTTD, (4) Tru-InSight™ Video Intelligence, (5) MITRE ATT&CK framework integration, (6) Digital twin capabilities, and (7) Defense-grade provenance. Which feature would you like to learn more about?" },
    { text: "Schedule a demo", response: "I'd be happy to help you schedule a demo! To get you connected with the right team member, I'll need a few details. Let me collect your information." }
  ];

  const knowledgeBase: { [key: string]: string } = {
    // Platform & Technology
    "agentic ai": "TruContext features autonomous AI agents that iteratively plan and execute complex workflows without human intervention. Our agentic AI capabilities include automatic icon generation, multi-step threat investigations, behavioral anomaly detection, and self-optimizing algorithms. This delivers a 90% reduction in manual analysis time.",
    "dual database": "Our patented dual database architecture combines Neo4j graph database for real-time relationship intelligence with PostgreSQL for time-series efficiency. This delivers 20 QPS pathfinding performance vs 5 QPS for traditional systems—4x faster query performance with complete analytical coverage.",
    "graph database": "TruContext uses Neo4j's native graph storage for complex relationship traversals in milliseconds. Our patented Scalable Multi-Layered Graph Database architecture enables 3D utility network representation, co-offending network analysis, and link prediction with 20 QPS performance.",
    "neo4j": "Neo4j serves as our relationship intelligence engine, providing subject-predicate-object modeling, transparent Cypher queries, and 20 QPS pathfinding performance. Combined with PostgreSQL for time-series data, this dual database approach delivers unmatched analytical capabilities.",
    
    // Features & Capabilities
    "video intelligence": "Tru-InSight™ is our autonomous video intelligence platform that provides real-time face recognition, license plate detection (ALPR), behavioral analytics, and multi-camera event correlation. It can analyze 1,200+ video streams simultaneously with autonomous investigation planning.",
    "tru-insight": "Tru-InSight™ is our autonomous video intelligence platform that provides real-time face recognition, license plate detection (ALPR), behavioral analytics, and multi-camera event correlation. It can analyze 1,200+ video streams simultaneously with autonomous investigation planning.",
    "mitre": "TruContext has deep MITRE heritage—enhanced from MITRE Corporation's CyGraph platform originally developed for US Army Cyber Command. We provide native MITRE ATT&CK framework integration with automatic threat technique identification and correlation.",
    "threat detection": "TruContext delivers 75% faster Mean Time to Detect (MTTD) through real-time graph analytics, agentic AI correlation, and temporal contextualization. We reduce false positives by 90% (from 35-41% to 6-9%) through intelligent relationship analysis.",
    
    // Performance & ROI
    "performance": "TruContext delivers: 20 QPS graph query performance (vs 5 QPS traditional), 100K+ events/second throughput, sub-second dashboard refresh rates, 75% faster MTTD, 90% reduction in false positives, and 60% faster incident response.",
    "roi": "Customers achieve an average 340% ROI within 18 months with $2.8M average annual savings. Cost savings come from 90% reduction in manual analysis time, 75% faster incident resolution, 83% reduction in false positives, and prevented cascading failures. Typical payback period is 6 months.",
    "pricing": "TruContext pricing starts at $1/node per month with volume discounts (declining to $0.20/node at scale). Minimum monthly fee is $10,000. Most deployments achieve ROI within 6 months. Use our interactive pricing calculator or contact sales for a custom quote.",
    
    // Industries & Solutions
    "cybersecurity": "TruContext serves cybersecurity with real-time threat detection, MITRE ATT&CK integration, CVE/CVSS risk mapping, and behavioral anomaly detection. We deliver 75% faster MTTD, 90% reduction in false positives, and automatic threat correlation across cyber-physical systems.",
    "smart cities": "For smart cities, TruContext provides intelligent transportation management, public safety analytics, video intelligence, and infrastructure monitoring. Customers achieve 78% crime prevention rates, 40% faster emergency response, and 35% reduction in traffic congestion.",
    "critical infrastructure": "TruContext protects critical infrastructure with cyber-physical threat correlation, digital twin simulation, SCADA integration, and cascading failure prevention. Customers achieve zero cascading failures and 50% lower maintenance costs.",
    
    // Comparison & Differentiation
    "vs siem": "TruContext outperforms traditional SIEM platforms with: 4x faster queries (20 QPS vs 5 QPS), agentic AI vs rule-based automation, 90% vs 35-41% false positive rates, native MITRE ATT&CK integration, dual database architecture, and digital twin capabilities that legacy systems lack.",
    "competitors": "TruContext differentiates through: (1) Patented dual database architecture, (2) Autonomous agentic AI, (3) MITRE heritage and native ATT&CK integration, (4) 4x faster graph query performance, (5) Digital twin capabilities, and (6) Defense-grade provenance with full audit trails.",
    
    // Company & Support
    "demo": "To schedule a demo, I'll need your name, email, and company. Our team will reach out within 24 hours to schedule a personalized demonstration of TruContext's capabilities tailored to your use case.",
    "contact": "You can reach our team at: Sales inquiries - contact through our demo request form, Technical support - available through the customer portal, General inquiries - info@visiumtechnologies.com, or call our main office.",
    "support": "TruContext customers receive 24/7 technical support, dedicated customer success managers, quarterly business reviews, training and certification programs, and access to our knowledge base and API documentation.",
  };

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Welcome message
      setTimeout(() => {
        addBotMessage("Hello! I'm the TruContext AI assistant. I can help you learn about our agentic AI-powered intelligence platform, pricing, features, and schedule a demo. What would you like to know?");
      }, 500);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const addBotMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: "bot",
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
    setIsTyping(false);
  };

  const addUserMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: "user",
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Check for lead capture triggers
    if (lowerMessage.includes("demo") || lowerMessage.includes("schedule") || lowerMessage.includes("talk to") || lowerMessage.includes("contact")) {
      setShowLeadForm(true);
      return "I'd be happy to help you schedule a demo! Please provide your contact information below, and our team will reach out within 24 hours.";
    }

    // Search knowledge base
    for (const [key, value] of Object.entries(knowledgeBase)) {
      if (lowerMessage.includes(key)) {
        return value;
      }
    }

    // Greeting responses
    if (lowerMessage.match(/\b(hi|hello|hey|greetings)\b/)) {
      return "Hello! I'm here to help you learn about TruContext. You can ask me about our platform features, pricing, ROI, industry solutions, or schedule a demo. What interests you most?";
    }

    // Thank you responses
    if (lowerMessage.match(/\b(thanks|thank you|appreciate)\b/)) {
      return "You're welcome! Is there anything else you'd like to know about TruContext? I'm here to help with questions about features, pricing, demos, or any other aspect of our platform.";
    }

    // Default response with suggestions
    return "I'd be happy to help with that! Here are some topics I can assist with:\n\n• Platform features and capabilities\n• Pricing and ROI information\n• Industry solutions (cybersecurity, smart cities, etc.)\n• Technical architecture and performance\n• Scheduling a demo\n\nWhat would you like to explore?";
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    addUserMessage(inputValue);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI thinking delay
    setTimeout(() => {
      const response = getAIResponse(inputValue);
      addBotMessage(response);
    }, 1000 + Math.random() * 1000);
  };

  const handleQuickReply = (reply: QuickReply) => {
    addUserMessage(reply.text);
    setIsTyping(true);

    setTimeout(() => {
      addBotMessage(reply.response);
      if (reply.text.includes("demo")) {
        setShowLeadForm(true);
      }
    }, 1000);
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create mailto link with lead information
    const subject = encodeURIComponent('Demo Request from Chat Widget - ' + leadInfo.company);
    const body = encodeURIComponent(
      `Name: ${leadInfo.name}\n` +
      `Email: ${leadInfo.email}\n` +
      `Company: ${leadInfo.company}\n\n` +
      `Source: Chat Widget Demo Request`
    );
    
    window.location.href = `mailto:info@visiumtechnologies.com?subject=${subject}&body=${body}`;
    
    setShowLeadForm(false);
    addBotMessage(`Thank you, ${leadInfo.name}! I've recorded your information. Our team will reach out to ${leadInfo.email} within 24 hours to schedule your personalized TruContext demo. In the meantime, feel free to ask me any questions!`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 h-14 w-14 md:h-16 md:w-16 rounded-full shadow-2xl bg-primary hover:bg-primary/90 text-white"
          size="icon"
        >
          <MessageCircle className="h-6 w-6 md:h-7 md:w-7" />
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white"></span>
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-0 right-0 md:bottom-6 md:right-6 z-50 w-full h-full md:w-[400px] md:h-[600px] md:rounded-lg shadow-2xl flex flex-col">
          <CardHeader className="bg-gradient-to-r from-primary to-secondary text-white p-4 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-bold">TruContext AI Assistant</div>
                  <div className="text-xs opacity-90 flex items-center gap-1">
                    <span className="h-2 w-2 bg-green-400 rounded-full"></span>
                    Online - Instant replies
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.sender === "bot" && (
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-5 w-5 text-primary" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] rounded-lg p-3 ${
                    message.sender === "user"
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <div className="text-sm whitespace-pre-line">{message.text}</div>
                  <div className={`text-xs mt-1 ${message.sender === "user" ? "text-white/70" : "text-gray-500"}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
                {message.sender === "user" && (
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                    <User className="h-5 w-5 text-gray-600" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2 justify-start">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Bot className="h-5 w-5 text-primary" />
                </div>
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                    <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></span>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Replies */}
            {messages.length === 1 && !isTyping && (
              <div className="space-y-2">
                <div className="text-xs text-gray-500 font-semibold">Quick replies:</div>
                <div className="flex flex-wrap gap-2">
                  {quickReplies.map((reply, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="cursor-pointer hover:bg-primary hover:text-white transition-colors"
                      onClick={() => handleQuickReply(reply)}
                    >
                      {reply.text}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Lead Capture Form */}
            {showLeadForm && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <form onSubmit={handleLeadSubmit} className="space-y-3">
                  <div className="text-sm font-semibold text-gray-900 mb-2">Contact Information</div>
                  <Input
                    placeholder="Your name"
                    value={leadInfo.name}
                    onChange={(e) => setLeadInfo({ ...leadInfo, name: e.target.value })}
                    required
                    className="bg-white"
                  />
                  <Input
                    type="email"
                    placeholder="Email address"
                    value={leadInfo.email}
                    onChange={(e) => setLeadInfo({ ...leadInfo, email: e.target.value })}
                    required
                    className="bg-white"
                  />
                  <Input
                    placeholder="Company name"
                    value={leadInfo.company}
                    onChange={(e) => setLeadInfo({ ...leadInfo, company: e.target.value })}
                    required
                    className="bg-white"
                  />
                  <Button type="submit" className="w-full bg-primary text-white">
                    Submit
                  </Button>
                </form>
              </div>
            )}

            <div ref={messagesEndRef} />
          </CardContent>

          {/* Input Area */}
          <div className="p-4 border-t flex-shrink-0">
            <div className="flex gap-2">
              <Input
                placeholder="Type your message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="bg-primary text-white"
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-xs text-gray-500 mt-2 text-center">
              Powered by TruContext AI
            </div>
          </div>
        </Card>
      )}
    </>
  );
}
