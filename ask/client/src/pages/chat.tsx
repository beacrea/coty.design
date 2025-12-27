import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Copy, Check, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { FormattedMessage } from "@/components/formatted-message";
import { FollowUpCard, type FollowUpOption } from "@/components/follow-up-card";
import type { Message } from "@shared/schema";
import avatarImage from "@assets/IMG_8938_1765775159138.png";

interface SuggestionChip {
  text: string;
  signalPersona: string;
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

function getTimeBasedGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 17) return "Good afternoon";
  if (hour >= 17 && hour < 21) return "Good evening";
  return "Hey there";
}

function getSessionId(): string {
  if (typeof window === "undefined" || !window.localStorage) {
    return `fallback-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  }
  const storageKey = "ask_coty_session_id";
  try {
    let sessionId = localStorage.getItem(storageKey);
    if (!sessionId) {
      sessionId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
      localStorage.setItem(storageKey, sessionId);
    }
    return sessionId;
  } catch {
    return `fallback-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  }
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pendingChipTap, setPendingChipTap] = useState<string | null>(null);
  const [followUps, setFollowUps] = useState<{ [messageId: string]: { title: string; options: FollowUpOption[] } }>({});
  const [preResponsePrompt, setPreResponsePrompt] = useState<{ 
    title: string; 
    options: FollowUpOption[]; 
    acknowledgment: string;
    userMessageId: string;
  } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const { toast } = useToast();
  
  const { data: suggestionsData } = useQuery<{ suggestions: SuggestionChip[] }>({
    queryKey: ["/api/suggestions"],
  });
  
  const suggestions = suggestionsData?.suggestions || [
    { text: "Walk me through a recent project", signalPersona: "evaluator" },
    { text: "What's Coty's story?", signalPersona: "explorer" },
    { text: "How does this AI agent work?", signalPersona: "peer" },
  ];
  
  const greeting = getTimeBasedGreeting();

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleCopy = async (content: string, id: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast({
        title: "Failed to copy",
        description: "Could not copy message to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleClear = () => {
    if (isStreaming && abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setMessages([]);
    setIsStreaming(false);
    setError(null);
    inputRef.current?.focus();
  };

  const handleSuggestedQuestion = (question: string) => {
    setInputValue(question);
    setPendingChipTap(question);
    inputRef.current?.focus();
  };

  const handleFollowUpClick = (query: string) => {
    // Clear pre-response prompt when user selects an option
    setPreResponsePrompt(null);
    handleSubmit(undefined, query);
  };

  const handleSubmit = async (e?: React.FormEvent, directMessage?: string) => {
    e?.preventDefault();
    
    const trimmedInput = (directMessage || inputValue).trim();
    if (!trimmedInput || isStreaming) return;

    setError(null);
    
    const userMessage: Message = {
      id: generateId(),
      role: "user",
      content: trimmedInput,
      timestamp: Date.now(),
    };

    const assistantMessage: Message = {
      id: generateId(),
      role: "assistant",
      content: "",
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setInputValue("");
    setIsStreaming(true);

    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].slice(-4),
          userQuestion: trimmedInput,
          sessionId: getSessionId(),
          chipTapped: pendingChipTap || undefined,
        }),
        signal: abortControllerRef.current.signal,
      });
      
      setPendingChipTap(null);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Request failed with status ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No response body");
      }

      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.type === "delta" && data.text) {
                setMessages((prev) => {
                  const updated = [...prev];
                  const lastMessage = updated[updated.length - 1];
                  if (lastMessage && lastMessage.role === "assistant") {
                    lastMessage.content += data.text;
                  }
                  return updated;
                });
              } else if (data.type === "followup_prompt" && data.followups) {
                // Pre-response disambiguation: remove empty assistant message, show choices
                setMessages((prev) => {
                  const userMessage = prev.find(m => m.role === "user" && m.id);
                  // Remove the empty assistant placeholder
                  const filtered = prev.filter(m => !(m.role === "assistant" && !m.content));
                  
                  if (userMessage) {
                    setPreResponsePrompt({
                      title: data.followupTitle || "What would you like to know?",
                      options: data.followups,
                      acknowledgment: data.acknowledgment || "Let me help you narrow that down.",
                      userMessageId: userMessage.id,
                    });
                  }
                  return filtered;
                });
              } else if (data.type === "followups" && data.followups) {
                setMessages((prev) => {
                  const lastMessage = prev[prev.length - 1];
                  if (lastMessage && lastMessage.role === "assistant") {
                    setFollowUps((current) => ({
                      ...current,
                      [lastMessage.id]: {
                        title: data.followupTitle || "Explore further",
                        options: data.followups,
                      },
                    }));
                  }
                  return prev;
                });
              } else if (data.type === "error") {
                throw new Error(data.error || "Stream error");
              }
            } catch (parseError) {
              if (parseError instanceof SyntaxError) continue;
              throw parseError;
            }
          }
        }
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        return;
      }
      
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      
      // Keep the assistant bubble with a fallback message instead of removing it
      setMessages((prev) => {
        const updated = [...prev];
        const lastMessage = updated[updated.length - 1];
        if (lastMessage && lastMessage.role === "assistant" && !lastMessage.content) {
          lastMessage.content = "I'm sorry, I couldn't process that request. Please try again.";
        }
        return updated;
      });
      
      toast({
        title: "Connection issue",
        description: "Please try again in a moment",
        variant: "destructive",
      });
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div 
      className="flex flex-col bg-background fixed inset-0" 
      style={{ 
        paddingTop: "env(safe-area-inset-top)",
      }}
      role="main"
      aria-label="Chat with ask.coty"
    >
      {messages.length > 0 && (
        <header className="flex items-center justify-between gap-4 px-4 py-3 border-b bg-background/95 backdrop-blur-lg sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <img 
              src={avatarImage} 
              alt="Coty's pixel art avatar" 
              className="w-10 h-10 rounded-full object-cover"
              data-testid="img-avatar"
            />
            <div>
              <h1 className="text-lg font-semibold" data-testid="text-app-title">ask.coty</h1>
              <p className="text-sm text-muted-foreground">Ask me anything</p>
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleClear}
            data-testid="button-clear-chat"
            aria-label="Clear all messages and start over"
          >
            Reset
          </Button>
        </header>
      )}

      <main className="flex-1 min-h-0 overflow-y-auto px-4 py-6" aria-live="polite" aria-atomic="false">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full max-w-md mx-auto text-center space-y-6 px-2">
            <img 
              src={avatarImage} 
              alt="Coty's pixel art avatar" 
              className="w-24 h-24 rounded-full object-cover"
              data-testid="img-avatar-welcome"
            />
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold" data-testid="text-empty-title">
                {greeting}! Ask me anything about Coty.
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed" data-testid="text-empty-subtitle">
                I can share what he works on, the projects he's built, and how he approaches complex problems. What would you like to know?
              </p>
            </div>
            
            <nav className="flex flex-wrap justify-center gap-3" aria-label="Suggested questions">
              {suggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="rounded-full text-sm px-4 py-2 min-h-11"
                  onClick={() => handleSuggestedQuestion(suggestion.text)}
                  data-testid={`button-suggested-${index}`}
                >
                  {suggestion.text}
                </Button>
              ))}
            </nav>
          </div>
        ) : (
          <div className="space-y-5 max-w-3xl mx-auto" role="log" aria-label="Conversation">
            {messages.map((message) => (
              <article
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                aria-label={message.role === "user" ? "Your message" : "Response from assistant"}
              >
                <div
                  className={`group relative max-w-[90%] sm:max-w-[85%] px-4 py-3 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground rounded-2xl rounded-tr-md"
                      : "bg-card border border-border text-foreground rounded-2xl rounded-tl-md"
                  }`}
                  data-testid={`message-${message.role}-${message.id}`}
                >
                  {message.role === "user" ? (
                    <p className="text-base leading-relaxed">{message.content}</p>
                  ) : (
                    <FormattedMessage 
                      content={message.content} 
                      isStreaming={isStreaming && message === messages[messages.length - 1]}
                    />
                  )}
                  
                  {message.role === "assistant" && message.content && !isStreaming && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute -right-12 top-1 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity min-w-10 min-h-10"
                      onClick={() => handleCopy(message.content, message.id)}
                      data-testid={`button-copy-${message.id}`}
                      aria-label="Copy this response to clipboard"
                    >
                      {copiedId === message.id ? (
                        <Check className="w-5 h-5 text-green-500" aria-label="Copied" />
                      ) : (
                        <Copy className="w-5 h-5" />
                      )}
                    </Button>
                  )}
                  
                  {message.role === "assistant" && !isStreaming && followUps[message.id] && (
                    <FollowUpCard
                      title={followUps[message.id].title}
                      options={followUps[message.id].options}
                      onSelect={handleFollowUpClick}
                    />
                  )}
                </div>
              </article>
            ))}
            
            {preResponsePrompt && !isStreaming && (
              <article className="flex justify-start" aria-label="Choose a topic">
                <div 
                  className="max-w-[90%] sm:max-w-[85%] px-4 py-3 bg-card border border-border text-foreground rounded-2xl rounded-tl-md"
                  data-testid="prompt-disambiguation"
                >
                  <p className="text-base leading-relaxed mb-3 text-muted-foreground">
                    {preResponsePrompt.acknowledgment}
                  </p>
                  <FollowUpCard
                    title={preResponsePrompt.title}
                    options={preResponsePrompt.options}
                    onSelect={handleFollowUpClick}
                  />
                </div>
              </article>
            )}
            
            <div ref={messagesEndRef} aria-hidden="true" />
          </div>
        )}
      </main>

      {error && (
        <div className="px-4 py-3 bg-destructive/10 border-t border-destructive/20" role="alert">
          <div className="flex items-center gap-3 max-w-3xl mx-auto">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" aria-hidden="true" />
            <p className="text-sm text-destructive" data-testid="text-error">{error}</p>
          </div>
        </div>
      )}

      <footer 
        className="border-t bg-background/95 backdrop-blur-lg px-4 py-4"
        style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
      >
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto" aria-label="Send a message">
          <div className="flex items-end gap-3">
            <div className="flex-1 relative">
              <label htmlFor="chat-input" className="sr-only">Type your question</label>
              <Input
                id="chat-input"
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your question here..."
                className="h-12 rounded-2xl pl-5 pr-5 text-base"
                disabled={isStreaming}
                data-testid="input-message"
                aria-describedby="input-hint"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="sentences"
                spellCheck={false}
                enterKeyHint="send"
              />
              <span id="input-hint" className="sr-only">Press Enter to send</span>
            </div>
            <Button
              type="submit"
              size="icon"
              className="min-h-12 min-w-12 rounded-full flex-shrink-0"
              disabled={!inputValue.trim() || isStreaming}
              data-testid="button-send"
              aria-label={isStreaming ? "Sending message..." : "Send message"}
            >
              {isStreaming ? (
                <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
              ) : (
                <Send className="w-5 h-5" aria-hidden="true" />
              )}
            </Button>
          </div>
        </form>
      </footer>
    </div>
  );
}
