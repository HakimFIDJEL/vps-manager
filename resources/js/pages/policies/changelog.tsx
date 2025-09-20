// pages/policies/changelog.tsx

import { useMemo } from "react";
import { Head } from "@inertiajs/react";
import { PoliciesLayout } from "@/layouts/policies";
import { Separator } from "@/components/ui/separator";

type Entry = {
  version: string;
  date: string; // YYYY-MM-DD
  added?: string[];
  changed?: string[];
  fixed?: string[];
  removed?: string[];
  notes?: string[];
};

export default function Changelog() {
  const updatedAt = useMemo(() => "2025-09-20", []);

  const entries: Entry[] = [
    {
      version: "v0.5.1",
      date: "2025-09-20",
      added: [
        "Legal pages: Terms of Service, Privacy Policy, Changelog",
      ],
      changed: [],
      fixed: [
        "Cookie consent links to privacy policy"
      ],
      notes: ["Docs and minor UI polish"],
    },
    {
      version: "v0.5.0",
      date: "2025-09-19",
      added: [
        "Public landing page",
        "User authentication bound to server local accounts",
        "Projects page with list and grid views",
        "Project creation wizard: path, env vars, Docker Compose, Makefile commands",
        "Project editor with same capabilities as creation",
        "Docker containers management per project",
      ],
      notes: ["First broadly usable version"],
    },
  ];

  return (
    <PoliciesLayout>
      <Head title="Changelog" />

      <h1 className="text-2xl font-semibold">Changelog</h1>
      <p>Last updated: {updatedAt}</p>

      <Separator className="my-2" />

      <nav aria-label="Versions" className="text-sm">
        <ul className="list-disc pl-5 space-y-1">
          {entries.map((e) => (
            <li key={e.version}>
              <a href={`#${e.version}`} className="underline">
                {e.version} — {e.date}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <Separator className="my-4" />

      <div className="space-y-8">
        {entries.map((e) => (
          <section key={e.version} id={e.version} className="space-y-3">
            <header>
              <h2 className="text-xl font-semibold">{e.version}</h2>
              <p className="text-sm">Date: {e.date}</p>
            </header>

            {e.added?.length ? (
              <div>
                <h3 className="font-medium">Added</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {e.added.map((item, i) => (
                    <li key={`a-${i}`}>{item}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {e.changed?.length ? (
              <div>
                <h3 className="font-medium">Changed</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {e.changed.map((item, i) => (
                    <li key={`c-${i}`}>{item}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {e.fixed?.length ? (
              <div>
                <h3 className="font-medium">Fixed</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {e.fixed.map((item, i) => (
                    <li key={`f-${i}`}>{item}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {e.removed?.length ? (
              <div>
                <h3 className="font-medium">Removed</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {e.removed.map((item, i) => (
                    <li key={`r-${i}`}>{item}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {e.notes?.length ? (
              <div>
                <h3 className="font-medium">Notes</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {e.notes.map((item, i) => (
                    <li key={`n-${i}`}>{item}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            <Separator className="mt-2" />
          </section>
        ))}
      </div>
    </PoliciesLayout>
  );
}
