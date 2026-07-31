# Chatbot Integration & Prompt Training Manual

## Purpose
Documents the conversational AI assistant architecture, detailed system prompts, fallback logic, `sessionStorage` history cache, and local keywords matching.

## Code References
- Frontend Component: [Chatbot.tsx](file:///c:/VS%20Code/Revenex/artifacts/revenex/src/components/Chatbot.tsx)
- Backend Router: [chat.ts](file:///c:/VS%20Code/Revenex/artifacts/api-server/src/routes/chat.ts)

---

## 1. Chatbot Knowledge Base (System Prompt)

The chatbot is instructed using a master system prompt (`SYS_EN` / `SYS_HI`). To ensure the chatbot remains a specialist, it is trained on the following absolute details:

-   **Founders & Executive Team**:
    -   `Rounak Vijay Sute`: Founder & CEO. Leads product strategy & corporate partnerships.
    -   `Rohan Rajendra Raundal`: Co-Founder. Leads full-stack engineering & platform architecture.
    -   `Prasanna Mate`: CTO. Built the entire platform from scratch, leads platform engineering & smooth deployments.
-   **Contact & Support**:
    -   Phone: `+91 90217 44355`
    -   Email: `team@revenex.in` (support) or `prasannamate1754@gmail.com` (CTO direct).
    -   SLA: Mon-Sat support with 2-hour critical issue resolution.
-   **Technology Stack & Partners**:
    -   Google Cloud (hosting infrastructure), Firebase (auth/database hooks), Gemini AI (dashboard insights), Razorpay (UPI payments), Twilio (SMS/WhatsApp parents alerts).
-   **Pricing**:
    -   `Starter`: Completely free forever for schools with under 500 students.
    -   `Growth`: ₹20,000/year for unlimited students and full modules.
-   **Core Modules**: Admissions registration, biometric attendance, Razorpay fee payments, exam gradebooks, and report cards.

---

## 2. Response Flow & Fallback Architecture

To ensure the chatbot **always** responds (avoiding blank crashes or system errors if the API is offline), it uses a 3-layer response strategy:

```
[User Message] 
      │
      ▼
1. Fetch API Server (/api/chat) ──[Success]──> [Display Answer]
      │
   [Failure]
      │
      ▼
2. Client Fallback to OpenRouter ──[Success]──> [Display Answer]
   (model: openrouter/free)
      │
   [Failure]
      │
      ▼
3. Local Safeguard Resolver ──────[Matched]──> [Display Matched Answer]
   (getLocalResponse keyword search)
      │
   [No Match]
      │
      ▼
4. General Support Responder ────────────────> [Display Contact Details]
```

---

## 3. Session Storage & Persistence

To prevent the chat history from clearing when the user navigates between pages:
1.  All message logs are saved to `sessionStorage` under the key `revenex_chat_messages`.
2.  On component mounting, the `messages` array initializes from `sessionStorage`.
3.  The React key reference `idRef` matches the maximum message ID in cache + 1 to avoid duplicate key errors.

---

## 4. How to Update Chatbot Prompts

1.  **Modify the System Prompt**:
    -   Update the `SYS_EN` variable in both [Chatbot.tsx](file:///c:/VS%20Code/Revenex/artifacts/revenex/src/components/Chatbot.tsx) and [chat.ts](file:///c:/VS%20Code/Revenex/artifacts/api-server/src/routes/chat.ts) with the new details.
2.  **Modify Local Fallback Keywords**:
    -   Add keywords to `getLocalResponse` inside [Chatbot.tsx](file:///c:/VS%20Code/Revenex/artifacts/revenex/src/components/Chatbot.tsx) to capture matching user text strings and return instant answers offline.
