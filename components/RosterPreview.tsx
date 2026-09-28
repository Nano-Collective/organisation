"use client";

import { useEffect, useState } from "react";

// A compact take on the portal + notifications hero at
// roster.nanocollective.org (Roster's website/src/components/PortalMock.tsx
// and Notifications.tsx). The morning's notifications stack in over the
// portal, and the sidebar counts climb as each one lands.

type Notification = {
  who: string;
  tint: string;
  time: string;
  title: string;
  body: string;
  inbox: number;
  pending: number;
};

const NOTIFICATIONS: Notification[] = [
  {
    who: "cto",
    tint: "var(--r-accent-fill)",
    time: "07:22",
    title: "Pull request #214 on acme/app",
    body: "Onboarding step 2, rewritten. Waiting on you to merge.",
    inbox: 0,
    pending: 1,
  },
  {
    who: "cto",
    tint: "var(--r-accent-fill)",
    time: "07:22",
    title: "Filed on acme/marketing",
    body: "from-cto · The setup email promises a step that no longer exists.",
    inbox: 1,
    pending: 1,
  },
  {
    who: "cmo",
    tint: "var(--r-blue)",
    time: "07:41",
    title: "Decision needed",
    body: "Two drafts for the launch post. Neither goes out unread.",
    inbox: 2,
    pending: 1,
  },
];

const FACTS = [
  {
    id: "setup-step-drop-off",
    tag: "measured",
    tagColor: "var(--r-accent)",
    tagBg: "var(--r-accent-soft)",
    fact: "38% of accounts never finish the setup step (n=212, Jun to Aug).",
    so: "nothing upstream of it is worth spending on until it moves.",
  },
  {
    id: "approve-outbound",
    tag: "boss",
    tagColor: "var(--r-blue)",
    tagBg: "color-mix(in srgb, var(--r-blue) 10%, transparent)",
    fact: "Nothing goes out under the company name unread.",
    so: "finished work waits in drafts/; never schedule a send.",
  },
];

// Beats of the loop: one per notification, then a pause before it resets.
const HOLD_BEATS = 3;

function Mark({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="var(--r-accent-fill)" />
      <path
        d="M11 23V10h6a4 4 0 0 1 0 8h-6m6 0 4.5 5"
        fill="none"
        stroke="#fff"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function RosterPreview() {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setShown(NOTIFICATIONS.length);
      return;
    }
    const id = setInterval(
      () =>
        setShown((n) => (n >= NOTIFICATIONS.length + HOLD_BEATS ? 0 : n + 1)),
      1400,
    );
    return () => clearInterval(id);
  }, []);

  const visible = NOTIFICATIONS.slice(0, Math.min(shown, NOTIFICATIONS.length));
  const latest = visible.at(-1);
  const inbox = latest?.inbox ?? 0;
  const pending = latest?.pending ?? 0;

  const nav = [
    { label: "Inbox", n: inbox },
    { label: "Pending work", n: pending },
    { label: "Org" },
    { label: "Staff" },
  ];

  return (
    <div className="roster-preview relative w-full">
      <div
        className="overflow-hidden rounded-xl border text-left"
        style={{
          background: "var(--r-surface)",
          borderColor: "var(--r-line)",
          boxShadow: "var(--r-shadow-lg)",
        }}
      >
        <div className="flex min-h-[380px] sm:min-h-[420px]">
          {/* Sidebar */}
          <aside
            className="hidden sm:block w-[168px] shrink-0 border-r px-2.5 pt-3 pb-4"
            style={{
              background: "var(--r-bg-2)",
              borderColor: "var(--r-line)",
            }}
          >
            <div className="flex gap-1.5 pb-4 pl-1">
              <span className="size-2.5 rounded-full bg-[#ff5f57]" />
              <span className="size-2.5 rounded-full bg-[#febc2e]" />
              <span className="size-2.5 rounded-full bg-[#28c840]" />
            </div>
            <div className="flex items-center gap-2 px-1.5 pb-3">
              <Mark />
              <div className="leading-tight">
                <div className="text-[12px] font-semibold">Roster</div>
                <div
                  className="text-[10.5px]"
                  style={{ color: "var(--r-text-2)" }}
                >
                  acme · 2 staff
                </div>
              </div>
            </div>
            <div className="space-y-px">
              {nav.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-md px-1.5 py-1 text-[12px]"
                >
                  {item.label}
                  {item.n !== undefined && item.n > 0 && (
                    <span
                      key={item.n}
                      className="roster-notif-in text-[11px] tabular-nums"
                      style={{ color: "var(--r-text-2)" }}
                    >
                      {item.n}
                    </span>
                  )}
                </div>
              ))}
            </div>
            <div
              className="mt-4 px-1.5 pb-1 text-[10.5px] font-semibold"
              style={{ color: "var(--r-text-3)" }}
            >
              Staff
            </div>
            {[
              { name: "Chief Technology Officer", id: "cto", open: true },
              { name: "Chief Marketing Officer", id: "cmo", open: false },
            ].map((s) => (
              <div key={s.id}>
                <div className="flex items-center justify-between gap-2 rounded-md px-1.5 py-1 text-[12px]">
                  <span className="truncate">{s.name}</span>
                  <span
                    className="font-mono text-[10px]"
                    style={{ color: "var(--r-text-3)" }}
                  >
                    {s.id}
                  </span>
                </div>
                {s.open && (
                  <div className="space-y-px pl-2.5">
                    {["Brain", "Prompt", "Graph", "Health"].map((view, i) => (
                      <div
                        key={view}
                        className="rounded-md px-1.5 py-[3px] text-[11.5px]"
                        style={
                          i === 0
                            ? { background: "var(--r-fill-2)", fontWeight: 500 }
                            : { color: "var(--r-text-2)" }
                        }
                      >
                        {view}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </aside>

          {/* Main: the CTO's brain */}
          <div className="min-w-0 flex-1 p-5 sm:p-6">
            <div className="flex gap-1.5 pb-4 sm:hidden">
              <span className="size-2.5 rounded-full bg-[#ff5f57]" />
              <span className="size-2.5 rounded-full bg-[#febc2e]" />
              <span className="size-2.5 rounded-full bg-[#28c840]" />
            </div>
            <div className="text-[17px] font-semibold tracking-[-0.02em]">
              Brain
            </div>
            <div
              className="mt-0.5 text-[11.5px]"
              style={{ color: "var(--r-text-2)" }}
            >
              Chief Technology Officer · 2 facts
            </div>
            <div
              className="mt-4 flex h-7 items-center rounded-lg px-2.5 text-[11.5px]"
              style={{ background: "var(--r-fill)", color: "var(--r-text-3)" }}
            >
              Search facts and files
            </div>
            <div
              className="mt-4 overflow-hidden rounded-xl"
              style={{ background: "var(--r-bg-2)" }}
            >
              {FACTS.map((f) => (
                <div
                  key={f.id}
                  className="border-b px-3.5 py-2.5 last:border-0"
                  style={{ borderColor: "var(--r-line)" }}
                >
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span
                      className="font-mono text-[10.5px]"
                      style={{ color: "var(--r-text-2)" }}
                    >
                      {f.id}
                    </span>
                    <span
                      className="rounded-full px-1.5 py-px text-[9.5px] font-medium"
                      style={{ color: f.tagColor, background: f.tagBg }}
                    >
                      {f.tag}
                    </span>
                  </div>
                  <div className="mt-1 text-[12.5px] tracking-[-0.01em]">
                    {f.fact}
                  </div>
                  <div
                    className="mt-0.5 text-[11px]"
                    style={{ color: "var(--r-text-2)" }}
                  >
                    So: {f.so}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* The morning's notifications, stacking in over the portal */}
      <div
        className="absolute right-3 bottom-3 left-3 sm:left-auto sm:w-[290px] flex flex-col gap-2"
        aria-live="polite"
      >
        {visible.map((n) => (
          <div
            key={n.title}
            className="roster-notif-in rounded-[16px] border px-3 py-2.5 backdrop-blur-2xl"
            style={{
              borderColor: "var(--r-line)",
              background:
                "color-mix(in srgb, var(--r-surface) 88%, transparent)",
              boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
            }}
          >
            <div className="flex items-start gap-2.5">
              <div
                className="grid size-8 shrink-0 place-items-center rounded-[8px] font-mono text-[10px] font-semibold text-white"
                style={{ background: n.tint }}
              >
                {n.who}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <div className="truncate text-[12px] font-semibold tracking-[-0.01em]">
                    {n.title}
                  </div>
                  <div
                    className="shrink-0 text-[10px]"
                    style={{ color: "var(--r-text-3)" }}
                  >
                    {n.time}
                  </div>
                </div>
                <div
                  className="mt-0.5 text-[11.5px] leading-snug"
                  style={{ color: "var(--r-text-2)" }}
                >
                  {n.body}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
