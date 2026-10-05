// src/data/experienceData.ts

// Define Experience data type
export interface ExperienceProps {
  title: string;
  company: string;
  duration: string;
  description: string;
  align: "start" | "end";
}

// Export experience data array
export const experienceData: ExperienceProps[] = [
  {
    title: "Special Science Teacher",
    company: "DepEd Catbalogan",
    duration: "2020 - 2022",
    description:
      "Delivered engaging science lessons using hands-on experiments and technology to enhance student learning.",
    align: "start",
  },
  {
    title: "Firmware Developer",
    company: "CreatorBox",
    duration: "2022 - 2023",
    description:
      "Developed and maintained firmware for embedded systems, ensuring performance and functionality.",
    align: "end",
  },
  {
    title: "Information Systems Analyst",
    company: "Samar State University",
    duration: "Present",
    description:
      "Managing and securing university systems while providing IT support and resolving technical issues.",
    align: "start",
  },
];
