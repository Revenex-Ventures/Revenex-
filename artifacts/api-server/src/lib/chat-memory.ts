export type ChatMessage = { role: "user" | "assistant"; content: string };
export class ChatMemory {
  private sessions = new Map<
    string,
    { messages: ChatMessage[]; expires: number }
  >();
  constructor(
    private maxSessions = 1000,
    private ttlMs = 30 * 60 * 1000,
    private now = Date.now,
  ) {}
  get size() {
    return this.sessions.size;
  }
  get(id: string): ChatMessage[] {
    const entry = this.sessions.get(id);
    if (!entry) return [];
    if (entry.expires <= this.now()) {
      this.sessions.delete(id);
      return [];
    }
    return entry.messages;
  }
  set(id: string, messages: ChatMessage[]) {
    for (const [key, entry] of this.sessions)
      if (entry.expires <= this.now()) this.sessions.delete(key);
    this.sessions.delete(id);
    while (this.sessions.size >= this.maxSessions)
      this.sessions.delete(this.sessions.keys().next().value!);
    this.sessions.set(id, {
      messages: messages
        .slice(-12)
        .map((m) => ({ ...m, content: m.content.slice(0, 2000) })),
      expires: this.now() + this.ttlMs,
    });
  }
}
