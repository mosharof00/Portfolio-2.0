import { education, experience, projects, site, tools } from "../data/site";

export function downloadResume() {
  const lines = [
    site.name,
    `${site.role} | Full-Stack Software Engineer`,
    `${site.location} · ${site.phone} · ${site.email}`,
    `${site.linkedin} · ${site.github}`,
    "",
    "PROFESSIONAL SUMMARY",
    site.summary,
    "",
    "CAREER HIGHLIGHTS",
    "• 25+ production apps in 3 years.",
    "• Built FoodX solo — Customer, Restaurant, and Rider apps plus backend — live in Sri Lanka.",
    "• Rescued 5 broken production apps, one with ~90% of its API contracts changed.",
    "• Realtime auto-dispatch engine with zero double-assignments in production.",
    "• 12 native iOS Home and Lock Screen widgets for Lovelynk.",
    "",
    "EXPERIENCE",
    ...experience.flatMap((job) => [
      `${job.role} — ${job.company}  ${job.period}`,
      job.place,
      ...job.points.map((p) => `• ${p}`),
      "",
    ]),
    "KEY PROJECTS",
    ...projects.map((p) => `• ${p.title} — ${p.kicker}: ${p.description}`),
    "",
    "EDUCATION",
    ...education.map((e) => `• ${e.title} — ${e.place}`),
    "",
    "TOOLS",
    tools.join(" · "),
  ];

  const blob = new Blob([lines.join("\n")], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "Mosharof_Khan_Resume.txt";
  a.click();
  URL.revokeObjectURL(url);
}
