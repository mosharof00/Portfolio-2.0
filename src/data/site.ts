export const site = {
  name: "Md. Mosharof Khan",
  shortName: "MK",
  role: "Senior Flutter Developer",
  tagline: "Platforms that ship",
  location: "Dhaka, Bangladesh",
  email: "mosharof5khan@gmail.com",
  phone: "+880 1314-859997",
  phoneHref: "tel:+8801314859997",
  emailHref: "mailto:mosharof5khan@gmail.com",
  linkedin: "https://linkedin.com/in/mosharof-khan",
  github: "https://github.com/mosharof00",
  availability: "Available for select projects",
  summary:
    "I ship complete platforms, not just screens — 25+ production apps in 3 years, from solo-built three-app ecosystems to rescued legacy systems. Flutter, Go, Next.js, and Supabase, with architecture, offline resilience, testing, and store release.",
} as const;

export const nav = [
  { label: "Home", href: "#top" },
  { label: "Work", href: "#work" },
  { label: "Capabilities", href: "#capabilities" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
] as const;

export const stats = [
  { value: "3+", label: "Years experience" },
  { value: "25+", label: "Apps shipped" },
  { value: "5", label: "Production rescues" },
  { value: "12", label: "iOS widgets" },
] as const;

export const projects = [
  {
    id: "foodx",
    title: "FoodX",
    kicker: "Multi-vendor food delivery",
    description:
      "Customer, restaurant, and rider apps plus backend — live in Sri Lanka, with a realtime auto-dispatch engine and zero double-assignments.",
    tags: ["Flutter", "Supabase", "FCM", "Google Maps"],
    visual: "foodx" as const,
    href: "https://github.com/mosharof00",
  },
  {
    id: "lovelynk",
    title: "Lovelynk",
    kicker: "Couples companion",
    description:
      "Flutter app with 12 native iOS Home and Lock Screen widgets, synchronized through SwiftUI, WidgetKit, and App Groups.",
    tags: ["Flutter", "SwiftUI", "WidgetKit"],
    visual: "lovelynk" as const,
    href: "https://github.com/mosharof00",
  },
  {
    id: "academy",
    title: "Smart Academy",
    kicker: "Learning management system",
    description:
      "Dual-role LMS with secure payments, community, and resumable video — 100+ products sold with a 4.9+ marketplace rating.",
    tags: ["Flutter", "Payments", "LMS"],
    visual: "academy" as const,
    href: "https://github.com/mosharof00",
  },
  {
    id: "workshiftly",
    title: "WorkShiftly",
    kicker: "Staffing platform",
    description:
      "Shift-based hiring for employers and workers with realtime tracking, payments, messaging, and location-aware matching.",
    tags: ["Flutter", "Realtime", "Maps"],
    visual: "shift" as const,
    href: "https://github.com/mosharof00",
  },
  {
    id: "importmark",
    title: "Import Mark",
    kicker: "Trading management",
    description:
      "Next.js + Supabase B2B operations system with Admin, Manager, and Customer portals on RLS-secured PostgreSQL.",
    tags: ["Next.js", "Supabase", "PostgreSQL"],
    visual: "import" as const,
    href: "https://github.com/mosharof00",
  },
] as const;

export type CapIconName =
  | "device"
  | "widget"
  | "layers"
  | "signal"
  | "shield"
  | "stack";

export const capabilities = [
  {
    title: "Flutter engineering",
    body: "iOS & Android, Dart, GetX, BLoC, Clean Architecture, MVVM, Isolates, and reusable design systems that stay fast under load.",
    icon: "device" as CapIconName,
  },
  {
    title: "Native & device",
    body: "Swift, SwiftUI, WidgetKit, App Groups, MethodChannels, Home/Lock Screen widgets, camera, maps, and background execution.",
    icon: "widget" as const,
  },
  {
    title: "Architecture",
    body: "Shared templates, dependency injection, testable repositories, and a code-review bar that every new project has to clear.",
    icon: "layers" as const,
  },
  {
    title: "Resilient networking",
    body: "Authenticated Dio clients, structured errors, Hive caching, connectivity-aware flows, and secure token storage.",
    icon: "signal" as const,
  },
  {
    title: "Quality & release",
    body: "Unit, widget, and BLoC tests, GitHub Actions CI/CD, TestFlight UAT, Google Play, App Store, and CodeCanyon publishing.",
    icon: "shield" as const,
  },
  {
    title: "Full-stack range",
    body: "Go (Fiber), Next.js, Supabase (Auth, RLS, Realtime, Edge Functions), Firebase, and REST APIs that mobile can trust.",
    icon: "stack" as const,
  },
] as const;

export const tools = [
  "Flutter",
  "Dart",
  "GetX",
  "BLoC",
  "SwiftUI",
  "Next.js",
  "Go",
  "Supabase",
  "Firebase",
  "PostgreSQL",
  "GitHub Actions",
  "FCM",
] as const;

export const heroTechOrbit = [
  { label: "Flutter", mark: "FL" },
  { label: "Clean Architecture", mark: "CA" },
  { label: "BLoC", mark: "BL" },
  { label: "SwiftUI", mark: "SW" },
  { label: "Firebase", mark: "FB" },
  { label: "Supabase", mark: "SU" },
  { label: "Go", mark: "GO" },
  { label: "Next.js", mark: "NX" },
] as const;

export const education = [
  {
    title: "B.Sc. Computer Science & Engineering",
    place: "Bangladesh University of Business and Technology (BUBT)",
  },
  {
    title: "Diploma in Engineering, Computer Science",
    place: "Naogaon Government Polytechnic Institute",
  },
] as const;

export const experience = [
  {
    role: "Senior Flutter Developer & Team Lead",
    company: "Arcade Group",
    period: "Apr 2026 – Present",
    place: "Dhaka, Bangladesh",
    points: [
      "Rescued 5 inherited production apps — one with ~90% of its REST contracts changed — and shipped them back to both stores.",
      "Lead 6+ concurrent client apps from discovery call to signed-off Play and App Store release.",
      "Set the architecture bar: Clean Architecture + GetX templates, shared review, and GitHub Actions on every new project.",
    ],
  },
  {
    role: "Flutter Developer → Lead Mobile Developer",
    company: "ArcadexIT",
    period: "Feb 2024 – Apr 2026",
    place: "Gulshan-1, Dhaka",
    points: [
      "Launched FoodX — three apps plus Supabase/PostgreSQL backend, live in Sri Lanka, later sold on CodeCanyon.",
      "Built a realtime auto-dispatch engine with cascading FCM offers and zero double-assigned riders in production.",
      "Shipped Smart Academy LMS to CodeCanyon — 100+ products sold, 4.9+ rating.",
    ],
  },
  {
    role: "Flutter Developer Intern",
    company: "bdtask Software Company Ltd.",
    period: "Sep 2023 – Jan 2024",
    place: "Khilkhet, Dhaka",
    points: [
      "Shipped production GetX and REST features in live client apps under senior review.",
    ],
  },
] as const;

export const process = [
  {
    n: "01",
    title: "Discover",
    body: "Client calls, requirement breakdowns, and the actual problem — not the assumed one.",
  },
  {
    n: "02",
    title: "Define",
    body: "Architecture, Jira sprints, and a shared direction the team can build against.",
  },
  {
    n: "03",
    title: "Build",
    body: "Flutter, native bridges, APIs, offline paths, and the widgets users see every day.",
  },
  {
    n: "04",
    title: "Harden",
    body: "Tests, interceptors, UAT on TestFlight, and release notes that say what to check.",
  },
  {
    n: "05",
    title: "Ship",
    body: "Play Console, App Store Connect, CI/CD, and a versioned rollout that holds.",
  },
] as const;

export const heroChapters = [
  {
    badge: "Production engineer",
    title: "Platforms\nthat ship",
    body: "25+ live apps — Flutter, Go, Next.js — from three-app ecosystems to rescued stores.",
  },
  {
    badge: "Team lead",
    title: "Rescue\nto release",
    body: "Five inherited production apps, one with 90% of its APIs changed, back on both stores.",
  },
  {
    badge: "Native craft",
    title: "Widgets\nat the edge",
    body: "Twelve iOS Home and Lock Screen widgets — Flutter talking to SwiftUI through App Groups.",
  },
] as const;
