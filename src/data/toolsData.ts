// PNG keys refer to tech-stack-v2.png. New entries may fall back to a monogram.
export interface ToolIcon {
  name: string;
  category: string;
  description: string;
  spriteKey?: string;
  mark?: string;
}
export const toolIcons: ToolIcon[] = [
  { name: "React", category: "Frontend", spriteKey: "react", description: "Component-based web interfaces." },
  { name: "Vue", category: "Frontend", spriteKey: "vue", description: "Reactive interfaces, including this game portfolio." },
  { name: "JavaScript", category: "Language", spriteKey: "javascript", description: "Interactions and application behavior for the web." },
  { name: "Laravel", category: "Backend", spriteKey: "laravel", description: "Web applications, APIs, and data workflows." },
  { name: "Flutter", category: "Mobile", spriteKey: "flutter", description: "Cross-platform mobile application interfaces." },
  { name: "PHP", category: "Backend", spriteKey: "php", description: "Server-side applications and web services." },
  { name: "Node.js", category: "Backend", spriteKey: "nodejs", description: "JavaScript services and development tooling." },
  { name: "MySQL", category: "Data", spriteKey: "sql", description: "Relational data, queries, and application records." },
  { name: "PostgreSQL", category: "Data", spriteKey: "sql", description: "Relational databases and structured queries." },
  { name: "MongoDB", category: "Data", spriteKey: "mongodb", description: "Document-oriented application data." },
  { name: "REST APIs", category: "Backend", spriteKey: "api", description: "Interfaces that connect applications and services." },
  { name: "Embedded Systems", category: "Hardware", spriteKey: "embedded", description: "Firmware and connected hardware." },
  { name: "WordPress", category: "Web", spriteKey: "wordpress", description: "Content-managed websites." },
  { name: "Git", category: "Workflow", spriteKey: "git", description: "Version control and collaboration." },
  { name: "Figma", category: "Design", spriteKey: "figma", description: "Interface design and prototyping." },
];
