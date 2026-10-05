// src/data/hackathonData.ts

import hackathon from "../assets/hackathon.jpg";
import bootcamp from "../assets/bootcamp.png";
import amy from "../assets/amy.jpg";
import dost from "../assets/dost8.png";

// Define Hackathon data type
export interface HackathonProps {
  date: string;
  title: string;
  location: string;
  description: string;
  logo: string;
}

// Export hackathon data array
export const hackathonData: HackathonProps[] = [
  {
    date: "December 21st - 22nd, 2023",
    title: "2023 Hackathon: Co-creating Solutions for Catbalogan City",
    location: "Catbalogan City, Samar",
    description:
      "Developed and designed an E-commerce application for local businesses.",
    logo: hackathon,
  },
  {
    date: "September 13th - 17th, 2021",
    title: "Catbalogan City Bootcamp 2021",
    location: "Catbalogan City, Samar",
    description: "Attended multiple workshops related to tech and development.",
    logo: bootcamp,
  },
  {
    date: "October 10th, 2019",
    title: "PCCI AMY IP Awards 2019",
    location: "BGC Taguig, Metro Manila",
    description:
      "Showcased a project prototype of an Electric Utility Meter with IoT.",
    logo: amy,
  },
  {
    date: "August 9th - 11th, 2018",
    title: "DOST VIII Regional Invention Contests and Exhibits 2019",
    location: "Tacloban City, Leyte",
    description:
      "Showcased a project prototype of Pork Quality Assessment System.",
    logo: dost,
  },
];
