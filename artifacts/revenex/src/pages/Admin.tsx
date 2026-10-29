import { useHindiText as useSiteText } from "@/lib/hindi-text";
import { BrandLogo } from '@/components/BrandLogo'
import { apiRequest } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { useEffect, useState, useCallback } from "react";
import { useLocation } from "wouter";

const BASE = import.meta.env.BASE_URL?.replace(/\/$/, "") ?? "";

type Stats = { users: number; reviews: number; contacts: number; demos: number };
type Contact = { id: number; name: string; email: string; institution: string | null; subject: string | null; message: string; status: string; createdAt: string };
type Demo = { id: number; name: string; schoolName: string; type: string | null; email: string; phone: string | null; city: string | null; students: string | null; preferredDate: string | null; preferredTime: string | null; message: string | null; status: string; createdAt: string };
type Review = { id: number; name: string; role: string; school: string; content: string; rating: number; approved: boolean; createdAt: string };
type User = { id: number; name: string; email: string; role: string; provider: string; school: string | null; createdAt: string; lastLogin: string | null };

type Tab = "overview" | "contacts" | "demos" | "reviews" | "users";

const DEMO_STATUSES = ["pending", "contacted", "scheduled", "completed"];

async function apiFetch(path: string, options: RequestInit = {}) {
  return apiRequest(`${BASE}/api${path}`, options);
}

function StatusBadge({ status }: { status: string }) {
  const siteText = useSiteText();
  const colors: Record<string, string> = {
    pending: "#f59e0b",
    resolved: "#10b981",
    contacted: "#3b82f6",
    scheduled: "#8b5cf6",
    completed: "#10b981",
    approved: "#10b981",
    rejected: "#ef4444",
  };
  return (
    <span style={{
      display: "inline-block",
      padding: "2px 10px",
      borderRadius: 20,
      fontSize: 12,
      fontWeight: 600,
      background: (colors[status] ?? "#6b7280") + "22",
      color: colors[status] ?? "#6b7280",
      border: `1px solid ${colors[status] ?? "#6b7280"}44`,
      textTransform: "capitalize",
    }}>{siteText(status)}</span>
  );
}

function StarRating({ rating }: { rating: number }) {
  const siteText = useSiteText();
  return (
    <span style={{ color: "#f59e0b", fontSize: 14 }}>
      {siteText("★".repeat(rating))}{siteText("☆".repeat(5 - rating))}
    </span>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export default function Admin() {
  const siteText = useSiteText();
  const [, navigate] = useLocation();
  const { logout } = useAuth();
  const [tab, setTab] = useState<Tab>("overview");
  const [adminName, setAdminName] = useState("");
  const [authChecked, setAuthChecked] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [demos, setDemos] = useState<Demo[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    async function checkAuth() {
      try {
        const data = await apiFetch("/auth/me") as { name: string; role: string };
        if (data.role !== "admin") {
          navigate("/");
          return;
        }
        setAdminName(data.name);
        setAuthChecked(true);
      } catch {
        navigate("/login");
      }
    }
    void checkAuth();
  }, [navigate]);

  const loadStats = useCallback(async () => {
    try {
      const data = await apiFetch("/admin/stats") as Stats;
      setStats(data);
    } catch (e) {
      showToast((e as Error).message, "error");
    }
  }, []);

  const loadContacts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch("/admin/contacts") as Contact[];
      setContacts(data);
    } catch (e) {
      showToast((e as Error).message, "error");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadDemos = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch("/admin/demos") as Demo[];
      setDemos(data);
    } catch (e) {
      showToast((e as Error).message, "error");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadReviews = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch("/admin/reviews") as Review[];
      setReviews(data);
    } catch (e) {
      showToast((e as Error).message, "error");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch("/admin/users") as User[];
      setUsers(data);
    } catch (e) {
      showToast((e as Error).message, "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authChecked) return;
    void loadStats();
  }, [authChecked, loadStats]);

  useEffect(() => {
    if (!authChecked) return;
    if (tab === "contacts") void loadContacts();
    if (tab === "demos") void loadDemos();
    if (tab === "reviews") void loadReviews();
    if (tab === "users") void loadUsers();
  }, [tab, authChecked, loadContacts, loadDemos, loadReviews, loadUsers]);

  async function updateContactStatus(id: number, status: string) {
    try {
      await apiFetch(`/admin/contacts/${id}`, { method: "PATCH", body: JSON.stringify({ status }) });
      setContacts(prev => prev.map(c => c.id === id ? { ...c, status } : c));
      showToast("Status updated");
    } catch (e) { showToast((e as Error).message, "error"); }
  }

  async function deleteContact(id: number) {
    if (!confirm(siteText("Delete this contact request?"))) return;
    try {
      await apiFetch(`/admin/contacts/${id}`, { method: "DELETE" });
      setContacts(prev => prev.filter(c => c.id !== id));
      showToast("Deleted");
      void loadStats();
    } catch (e) { showToast((e as Error).message, "error"); }
  }

  async function updateDemoStatus(id: number, status: string) {
    try {
      await apiFetch(`/admin/demos/${id}`, { method: "PATCH", body: JSON.stringify({ status }) });
      setDemos(prev => prev.map(d => d.id === id ? { ...d, status } : d));
      showToast("Status updated");
    } catch (e) { showToast((e as Error).message, "error"); }
  }

  async function deleteDemo(id: number) {
    if (!confirm(siteText("Delete this demo request?"))) return;
    try {
      await apiFetch(`/admin/demos/${id}`, { method: "DELETE" });
      setDemos(prev => prev.filter(d => d.id !== id));
      showToast("Deleted");
      void loadStats();
    } catch (e) { showToast((e as Error).message, "error"); }
  }

  async function approveReview(id: number, approved: boolean) {
    try {
      await apiFetch(`/admin/reviews/${id}`, { method: "PATCH", body: JSON.stringify({ approved }) });
      setReviews(prev => prev.map(r => r.id === id ? { ...r, approved } : r));
      showToast(approved ? "Review approved — now visible publicly" : "Review rejected");
    } catch (e) { showToast((e as Error).message, "error"); }
  }

  async function deleteReview(id: number) {
    if (!confirm(siteText("Delete this review?"))) return;
    try {
      await apiFetch(`/admin/reviews/${id}`, { method: "DELETE" });
      setReviews(prev => prev.filter(r => r.id !== id));
      showToast("Review deleted");
      void loadStats();
    } catch (e) { showToast((e as Error).message, "error"); }
  }

  async function updateUserRole(id: number, role: string) {
    try {
      await apiFetch(`/admin/users/${id}/role`, { method: "PATCH", body: JSON.stringify({ role }) });
      setUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u));
      showToast(`User role updated to ${role}`);
    } catch (e) { showToast((e as Error).message, "error"); }
  }

  async function handleLogout() {
    try { await logout(); navigate("/login"); }
    catch (error) { showToast((error as Error).message, "error"); }
  }

  if (!authChecked) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0a0f" }}>
        <div style={{ color: "#fff", fontSize: 18 }}>{siteText("Verifying access…")}</div>
      </div>
    );
  }

  const TABS: { id: Tab; label: string; icon: string }[] = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "contacts", label: "Contacts", icon: "📬" },
    { id: "demos", label: "Demo Requests", icon: "🗓" },
    { id: "reviews", label: "Reviews", icon: "⭐" },
    { id: "users", label: "Users", icon: "👥" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "#fff", fontFamily: "system-ui, sans-serif" }}>
      {toast && (
        <div style={{
          position: "fixed", top: 20, right: 20, zIndex: 9999,
          padding: "12px 24px", borderRadius: 8, fontWeight: 600, fontSize: 14,
          background: toast.type === "success" ? "#10b981" : "#ef4444",
          color: "#fff", boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
          animation: "fadeIn 0.2s ease",
        }}>{siteText(toast.msg)}</div>
      )}

      <header style={{ background: "#111118", borderBottom: "1px solid #1e1e2e", padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <a href="/" style={{ color: "#6C63FF", textDecoration: "none", fontSize: 22, fontWeight: 700 }}><BrandLogo tone="light" size="sm" /></a>
          <span style={{ color: "#444", fontSize: 18 }}>/</span>
          <span style={{ color: "#fff", fontWeight: 600 }}>{siteText("Admin Panel")}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ color: "#888", fontSize: 14 }}>{siteText("Logged in as ")}<strong style={{ color: "#6C63FF" }}>{siteText(adminName)}</strong></span>
          <button onClick={handleLogout} style={{ background: "#1e1e2e", border: "1px solid #333", color: "#aaa", padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13 }}>{siteText("Logout")}</button>
        </div>
      </header>

      <div style={{ display: "flex", minHeight: "calc(100vh - 65px)" }}>
        <nav style={{ width: 220, background: "#111118", borderRight: "1px solid #1e1e2e", padding: "24px 0", flexShrink: 0 }}>
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                display: "flex", alignItems: "center", gap: 10, width: "100%",
                padding: "12px 24px", background: tab === t.id ? "#1e1e2e" : "transparent",
                borderLeft: tab === t.id ? "3px solid #6C63FF" : "3px solid transparent",
                border: "none", color: tab === t.id ? "#fff" : "#666",
                cursor: "pointer", fontSize: 14, fontWeight: tab === t.id ? 600 : 400,
                textAlign: "left", transition: "all 0.15s",
              }}
            >
              <span>{siteText(t.icon)}</span> {siteText(t.label)}
            </button>
          ))}
        </nav>

        <main style={{ flex: 1, padding: "32px", overflowY: "auto" }}>
          {tab === "overview" && (
            <div>
              <h2 style={{ margin: "0 0 24px", fontSize: 24 }}>{siteText("Dashboard Overview")}</h2>
              {stats ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 20, marginBottom: 32 }}>
                  {[
                    { label: "Total Users", value: stats.users, icon: "👥", color: "#6C63FF" },
                    { label: "Total Reviews", value: stats.reviews, icon: "⭐", color: "#f59e0b" },
                    { label: "Contact Requests", value: stats.contacts, icon: "📬", color: "#3b82f6" },
                    { label: "Demo Requests", value: stats.demos, icon: "🗓", color: "#10b981" },
                  ].map(card => (
                    <div key={card.label} style={{
                      background: "#111118", border: "1px solid #1e1e2e", borderRadius: 12,
                      padding: "24px", textAlign: "center",
                    }}>
                      <div style={{ fontSize: 32, marginBottom: 8 }}>{siteText(card.icon)}</div>
                      <div style={{ fontSize: 36, fontWeight: 700, color: card.color }}>{siteText(card.value)}</div>
                      <div style={{ fontSize: 13, color: "#666", marginTop: 4 }}>{siteText(card.label)}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ color: "#666" }}>{siteText("Loading stats…")}</div>
              )}
              <div style={{ background: "#111118", border: "1px solid #1e1e2e", borderRadius: 12, padding: "24px" }}>
                <h3 style={{ margin: "0 0 12px", color: "#aaa", fontSize: 16 }}>{siteText("Quick Actions")}</h3>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  {(["contacts", "demos", "reviews", "users"] as Tab[]).map(t => (
                    <button key={t} onClick={() => setTab(t)} style={{
                      background: "#1e1e2e", border: "1px solid #333", color: "#fff",
                      padding: "10px 20px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 500,
                      textTransform: "capitalize",
                    }}>{siteText("Manage ")}{siteText(t)}</button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === "contacts" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <h2 style={{ margin: 0, fontSize: 24 }}>{siteText("Contact Requests ")}<span style={{ color: "#444", fontSize: 16 }}>({siteText(contacts.length)})</span></h2>
                <button onClick={() => void loadContacts()} style={{ background: "#1e1e2e", border: "1px solid #333", color: "#aaa", padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13 }}>{siteText("↻ Refresh")}</button>
              </div>
              {loading ? <div style={{ color: "#666" }}>{siteText("Loading…")}</div> : contacts.length === 0 ? (
                <div style={{ color: "#666", textAlign: "center", padding: 40 }}>{siteText("No contact requests yet.")}</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {contacts.map(c => (
                    <div key={c.id} style={{ background: "#111118", border: "1px solid #1e1e2e", borderRadius: 12, padding: "20px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                            <strong style={{ fontSize: 16 }}>{siteText(c.name)}</strong>
                            <StatusBadge status={c.status} />
                          </div>
                          <div style={{ color: "#888", fontSize: 13, marginBottom: 4 }}>📧 {siteText(c.email)} {siteText(c.institution && `· 🏫 ${c.institution}`)}</div>
                          {c.subject && <div style={{ color: "#aaa", fontSize: 13, marginBottom: 6 }}>{siteText("Subject: ")}{siteText(c.subject)}</div>}
                          <div style={{ color: "#ccc", fontSize: 14, lineHeight: 1.5, maxWidth: 600 }}>{siteText(c.message)}</div>
                          <div style={{ color: "#555", fontSize: 12, marginTop: 8 }}>{siteText(formatDate(c.createdAt))}</div>
                        </div>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          {c.status !== "resolved" && (
                            <button onClick={() => void updateContactStatus(c.id, "resolved")} style={{ background: "#10b98122", border: "1px solid #10b98144", color: "#10b981", padding: "6px 14px", borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>{siteText("✓ Resolve")}</button>
                          )}
                          {c.status !== "pending" && (
                            <button onClick={() => void updateContactStatus(c.id, "pending")} style={{ background: "#f59e0b22", border: "1px solid #f59e0b44", color: "#f59e0b", padding: "6px 14px", borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>{siteText("↩ Reopen")}</button>
                          )}
                          <button onClick={() => void deleteContact(c.id)} style={{ background: "#ef444422", border: "1px solid #ef444444", color: "#ef4444", padding: "6px 14px", borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>{siteText("🗑 Delete")}</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "demos" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <h2 style={{ margin: 0, fontSize: 24 }}>{siteText("Demo Requests ")}<span style={{ color: "#444", fontSize: 16 }}>({siteText(demos.length)})</span></h2>
                <button onClick={() => void loadDemos()} style={{ background: "#1e1e2e", border: "1px solid #333", color: "#aaa", padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13 }}>{siteText("↻ Refresh")}</button>
              </div>
              {loading ? <div style={{ color: "#666" }}>{siteText("Loading…")}</div> : demos.length === 0 ? (
                <div style={{ color: "#666", textAlign: "center", padding: 40 }}>{siteText("No demo requests yet.")}</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {demos.map(d => (
                    <div key={d.id} style={{ background: "#111118", border: "1px solid #1e1e2e", borderRadius: 12, padding: "20px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                            <strong style={{ fontSize: 16 }}>{siteText(d.name)}</strong>
                            <StatusBadge status={d.status} />
                          </div>
                          <div style={{ color: "#aaa", fontSize: 14, marginBottom: 4 }}>🏫 {siteText(d.schoolName)} {siteText(d.city && `· 📍 ${d.city}`)}</div>
                          <div style={{ color: "#888", fontSize: 13, marginBottom: 4 }}>📧 {siteText(d.email)} {siteText(d.phone && `· 📱 ${d.phone}`)}</div>
                          {d.students && <div style={{ color: "#888", fontSize: 13, marginBottom: 4 }}>{siteText("Students: ")}{siteText(d.students)} {siteText(d.type && `· Type: ${d.type}`)}</div>}
                          {(d.preferredDate ?? d.preferredTime) && <div style={{ color: "#888", fontSize: 13, marginBottom: 4 }}>{siteText("Preferred: ")}{siteText(d.preferredDate)} {siteText(d.preferredTime)}</div>}
                          {d.message && <div style={{ color: "#ccc", fontSize: 14, lineHeight: 1.5, maxWidth: 600 }}>{siteText(d.message)}</div>}
                          <div style={{ color: "#555", fontSize: 12, marginTop: 8 }}>{siteText(formatDate(d.createdAt))}</div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                          <select
                            value={d.status}
                            onChange={e => void updateDemoStatus(d.id, e.target.value)}
                            style={{ background: "#1e1e2e", border: "1px solid #333", color: "#fff", padding: "8px 12px", borderRadius: 6, cursor: "pointer", fontSize: 13 }}
                          >
                            {DEMO_STATUSES.map(s => <option key={s} value={s}>{siteText(s.charAt(0).toUpperCase() + s.slice(1))}</option>)}
                          </select>
                          <button onClick={() => void deleteDemo(d.id)} style={{ background: "#ef444422", border: "1px solid #ef444444", color: "#ef4444", padding: "6px 14px", borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>{siteText("🗑 Delete")}</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "reviews" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <h2 style={{ margin: 0, fontSize: 24 }}>{siteText("Reviews ")}<span style={{ color: "#444", fontSize: 16 }}>({siteText(reviews.length)})</span></h2>
                <div style={{ display: "flex", gap: 8 }}>
                  <span style={{ color: "#888", fontSize: 13, alignSelf: "center" }}>
                    {siteText(reviews.filter(r => r.approved).length)}{siteText(" approved · ")}{siteText(reviews.filter(r => !r.approved).length)}{siteText(" pending")}</span>
                  <button onClick={() => void loadReviews()} style={{ background: "#1e1e2e", border: "1px solid #333", color: "#aaa", padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13 }}>{siteText("↻ Refresh")}</button>
                </div>
              </div>
              {loading ? <div style={{ color: "#666" }}>{siteText("Loading…")}</div> : reviews.length === 0 ? (
                <div style={{ color: "#666", textAlign: "center", padding: 40 }}>{siteText("No reviews yet.")}</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {reviews.map(r => (
                    <div key={r.id} style={{
                      background: "#111118", border: `1px solid ${r.approved ? "#10b98133" : "#1e1e2e"}`,
                      borderRadius: 12, padding: "20px",
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                            <strong style={{ fontSize: 16 }}>{siteText(r.name)}</strong>
                            <StatusBadge status={r.approved ? "approved" : "pending"} />
                          </div>
                          <div style={{ color: "#888", fontSize: 13, marginBottom: 6 }}>{siteText(r.role)} · {siteText(r.school)}</div>
                          <StarRating rating={r.rating} />
                          <div style={{ color: "#ccc", fontSize: 14, lineHeight: 1.6, maxWidth: 600, marginTop: 8 }}>"{siteText(r.content)}"</div>
                          <div style={{ color: "#555", fontSize: 12, marginTop: 8 }}>{siteText(formatDate(r.createdAt))}</div>
                        </div>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          {!r.approved ? (
                            <button onClick={() => void approveReview(r.id, true)} style={{ background: "#10b98122", border: "1px solid #10b98144", color: "#10b981", padding: "6px 14px", borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>{siteText("✓ Approve")}</button>
                          ) : (
                            <button onClick={() => void approveReview(r.id, false)} style={{ background: "#f59e0b22", border: "1px solid #f59e0b44", color: "#f59e0b", padding: "6px 14px", borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>{siteText("↩ Reject")}</button>
                          )}
                          <button onClick={() => void deleteReview(r.id)} style={{ background: "#ef444422", border: "1px solid #ef444444", color: "#ef4444", padding: "6px 14px", borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>{siteText("🗑 Delete")}</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "users" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <h2 style={{ margin: 0, fontSize: 24 }}>{siteText("Users ")}<span style={{ color: "#444", fontSize: 16 }}>({siteText(users.length)})</span></h2>
                <button onClick={() => void loadUsers()} style={{ background: "#1e1e2e", border: "1px solid #333", color: "#aaa", padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13 }}>{siteText("↻ Refresh")}</button>
              </div>
              {loading ? <div style={{ color: "#666" }}>{siteText("Loading…")}</div> : users.length === 0 ? (
                <div style={{ color: "#666", textAlign: "center", padding: 40 }}>{siteText("No users yet.")}</div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid #1e1e2e" }}>
                        {["ID", "Name", "Email", "Role", "Provider", "School", "Joined", "Last Login", "Actions"].map(h => (
                          <th key={h} style={{ padding: "10px 12px", textAlign: "left", color: "#666", fontWeight: 600, fontSize: 12, whiteSpace: "nowrap" }}>{siteText(h)}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(u => (
                        <tr key={u.id} style={{ borderBottom: "1px solid #1e1e2e" }}>
                          <td style={{ padding: "12px", color: "#555" }}>{siteText(u.id)}</td>
                          <td style={{ padding: "12px", fontWeight: 500 }}>{siteText(u.name)}</td>
                          <td style={{ padding: "12px", color: "#888" }}>{siteText(u.email)}</td>
                          <td style={{ padding: "12px" }}><StatusBadge status={u.role} /></td>
                          <td style={{ padding: "12px", color: "#888", textTransform: "capitalize" }}>{siteText(u.provider)}</td>
                          <td style={{ padding: "12px", color: "#888" }}>{siteText(u.school ?? "—")}</td>
                          <td style={{ padding: "12px", color: "#666", whiteSpace: "nowrap" }}>{siteText(formatDate(u.createdAt))}</td>
                          <td style={{ padding: "12px", color: "#666", whiteSpace: "nowrap" }}>{siteText(u.lastLogin ? formatDate(u.lastLogin) : "—")}</td>
                          <td style={{ padding: "12px" }}>
                            <select
                              value={u.role}
                              onChange={e => void updateUserRole(u.id, e.target.value)}
                              style={{ background: "#1e1e2e", border: "1px solid #333", color: "#fff", padding: "4px 8px", borderRadius: 4, cursor: "pointer", fontSize: 12 }}
                            >
                              <option value="user">{siteText("user")}</option>
                              <option value="admin">{siteText("admin")}</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
