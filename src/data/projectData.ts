// src/data/projectData.ts

import project1 from "../assets/proj1.webp";
import project2 from "../assets/proj2.webp";
import project3 from "../assets/proj3.webp";
import project4 from "../assets/proj4.webp";
import project5 from "../assets/eaph.webp";
import project6 from "../assets/proj6.webp";
import project7 from "../assets/proj7.webp";
import project8 from "../assets/proj8.webp";
import project9 from "../assets/proj5.webp";



// Define the project item interface
interface ProjectItem {
  id: string;
  slug: string;
  title: string;
  status: string;
  desc: string;
  fullDescription: string;
  tech: string[];
  img: string;
  screenshots: string[]; // Array of image URLs for carousel
  visitLink: string;
  githubLink: string;
  features?: string[];
  challenges?: string[];
  outcomes?: string[];
  duration?: string;
  role?: string;
}

// Export the project data array
export const projectData: ProjectItem[] = [
  {
    id: "1",
    slug: "ssu-digital-assets-management",
    title: "SSU Digital Assets Management System",
    status: "Completed",
    desc: "A comprehensive digital asset management system for SSU-ICT Unit.",
    fullDescription: "The SSU Digital Assets Management System is a robust platform designed to streamline the management and tracking of digital assets within the SSU-ICT Unit. This system provides comprehensive tools for cataloging, organizing, and maintaining digital resources, ensuring efficient asset lifecycle management.",
    tech: ["Laravel", "MySQL", "Vue"],
    img: project8,
    screenshots: [project8, project8, project8], // Add more screenshots as available
    visitLink: "https://dams.ssu.edu.ph/",
    githubLink: "#",
    features: [
      "Asset cataloging and categorization system",
      "Advanced search and filtering capabilities",
      "User access control and permissions management",
      "Asset lifecycle tracking and reporting",
      "Real-time dashboard for asset monitoring"
    ],
    challenges: [
      "Implementing secure multi-user access controls",
      "Optimizing database queries for large asset inventories",
      "Creating an intuitive UI for complex asset relationships"
    ],
    outcomes: [
      "Reduced asset retrieval time by 60%",
      "Improved asset tracking accuracy",
      "Enhanced collaboration among ICT unit members"
    ],
    duration: "6 months",
    role: "Full Stack Developer"
  },
  {
    id: "2",
    slug: "equity-access-ph",
    title: "Equity Access PH",
    status: "Completed",
    desc: "Unified College Admission System for CHED",
    fullDescription: "Equity Access PH is a groundbreaking unified college admission system developed for the Commission on Higher Education (CHED). This platform democratizes access to higher education by providing a centralized application system for students across the Philippines, streamlining the entire college admission process.",
    tech: ["Laravel", "MySQL", "Vue", "React"],
    img: project5,
    screenshots: [project5, project5, project5], // Add more screenshots as available
    visitLink: "https://equityaccessph.com",
    githubLink: "#",
    features: [
      "Unified application system for multiple universities",
      "Automated document verification system",
      "Real-time application tracking",
      "Integrated payment gateway",
      "Analytics dashboard for administrators",
      "Mobile-responsive design"
    ],
    challenges: [
      "Handling concurrent applications from thousands of students",
      "Ensuring data security and privacy compliance",
      "Integrating with multiple university systems",
      "Managing high traffic during peak admission periods"
    ],
    outcomes: [
      "Processed over 100,000 applications in first year",
      "Reduced application processing time by 70%",
      "Increased accessibility for students in remote areas",
      "Successfully integrated with 50+ educational institutions"
    ],
    duration: "12 months",
    role: "Lead Full Stack Developer"
  },
  {
    id: "3",
    slug: "ssu-hrmo",
    title: "SSU HRMO",
    status: "Completed",
    desc: "Streamlines human resource processes and employee record management efficiently.",
    fullDescription: "SSU HRMO is a comprehensive Human Resource Management Office system that digitizes and automates HR processes for Samar State University. The platform provides end-to-end solutions for employee management, from recruitment to retirement, ensuring efficient and transparent HR operations.",
    tech: ["Laravel", "MySQL", "Vue"],
    img: project1,
    screenshots: [project1, project1], // Add more screenshots as available
    visitLink: "https://icthrmo.ssuict.tech/",
    githubLink: "#",
    features: [
      "Employee information management system",
      "Leave management and approval workflows",
      "Payroll processing and generation",
      "Performance evaluation module",
      "Document management system",
      "Reporting and analytics tools"
    ],
    challenges: [
      "Migrating legacy HR data to new system",
      "Designing complex approval workflows",
      "Ensuring GDPR and data privacy compliance",
      "Creating flexible reporting system for various HR metrics"
    ],
    outcomes: [
      "Digitized records for 500+ employees",
      "Reduced HR processing time by 50%",
      "Improved data accuracy and accessibility",
      "Enhanced transparency in HR processes"
    ],
    duration: "8 months",
    role: "Full Stack Developer"
  },
  {
    id: "4",
    slug: "air-quality-monitoring",
    title: "Air Quality Monitoring",
    status: "Completed",
    desc: "Monitors and analyzes air quality data for environmental safety.",
    fullDescription: "An IoT-based air quality monitoring system that provides real-time environmental data collection and analysis. This system integrates embedded sensors with a web-based dashboard to track air quality metrics, helping ensure environmental safety and compliance with health standards.",
    tech: ["Embedded Systems", "Laravel", "MySQL"],
    img: project2,
    screenshots: [project2, project2], // Add more screenshots as available
    visitLink: "https://airqualitymonitor.intspace.tech/",
    githubLink: "#",
    features: [
      "Real-time air quality data collection",
      "Multiple sensor integration (PM2.5, CO2, temperature, humidity)",
      "Historical data visualization and trends",
      "Alert system for hazardous air quality levels",
      "Data export capabilities for research",
      "Mobile-friendly monitoring dashboard"
    ],
    challenges: [
      "Ensuring reliable data transmission from sensors",
      "Calibrating sensors for accurate readings",
      "Handling intermittent connectivity issues",
      "Processing and storing large volumes of time-series data"
    ],
    outcomes: [
      "Successfully deployed 10 monitoring stations",
      "Collected over 1 million data points",
      "Provided actionable insights for environmental policy",
      "Enabled early warning system for air quality issues"
    ],
    duration: "5 months",
    role: "IoT & Backend Developer"
  },
  {
    id: "5",
    slug: "ipovcon-2025",
    title: "IPOVCON 2025",
    status: "Completed",
    desc: "Website for the 6th International Conference on Poverty Alleviation and Sustainable Development.",
    fullDescription: "The official website for IPOVCON 2025, the 6th International Conference on Poverty Alleviation and Sustainable Development. This platform serves as the central hub for conference information, registration, abstract submissions, and participant engagement.",
    tech: ["WordPress", "PHP", "MySQL"],
    img: project7,
    screenshots: [project7, project7], // Add more screenshots as available
    visitLink: "https://ipovcon2025.ssu.edu.ph/",
    githubLink: "#",
    features: [
      "Conference registration system",
      "Abstract submission and review portal",
      "Dynamic schedule management",
      "Participant information system",
      "News and updates section",
      "Multi-language support"
    ],
    challenges: [
      "Managing multiple user roles (attendees, speakers, reviewers)",
      "Integrating payment system for international participants",
      "Creating a scalable abstract submission workflow",
      "Ensuring website accessibility standards"
    ],
    outcomes: [
      "Hosted information for 500+ participants",
      "Processed 200+ abstract submissions",
      "Streamlined conference organization",
      "Enhanced participant experience and engagement"
    ],
    duration: "3 months",
    role: "Web Developer"
  },
  {
    id: "6",
    slug: "mlbb-draft-simulator",
    title: "MLBB Draft Simulator V1",
    status: "Completed",
    desc: "A web-based application for simulating drafts in Mobile Legends: Bang Bang.",
    fullDescription: "A comprehensive draft simulation tool for Mobile Legends: Bang Bang that allows players and teams to practice and strategize their hero selections. The application replicates the in-game draft experience, providing valuable training for competitive play.",
    tech: ["Vue", "Node.js", "Laravel", "MySQL"],
    img: project6,
    screenshots: [project6, project6, project6], // Add more screenshots as available
    visitLink: "https://mlbbdraftsim.intspace.tech/",
    githubLink: "#",
    features: [
      "Real-time draft simulation interface",
      "Complete hero database with stats",
      "Ban and pick phase mechanics",
      "Draft history and analytics",
      "Team composition suggestions",
      "Counter-pick recommendations"
    ],
    challenges: [
      "Maintaining up-to-date hero data with game updates",
      "Implementing real-time synchronization for multiplayer",
      "Creating intuitive drag-and-drop interface",
      "Optimizing performance for smooth user experience"
    ],
    outcomes: [
      "Over 10,000 unique users",
      "Used by esports teams for practice",
      "Average session duration of 25 minutes",
      "Positive feedback from gaming community"
    ],
    duration: "4 months",
    role: "Full Stack Developer"
  },
  {
    id: "7",
    slug: "kuryente-meter-management",
    title: "Kuryente - Electric Meter Management System",
    status: "Completed",
    desc: "Monitor electricity consumption in real-time with AI-powered predictions for smarter energy management.",
    fullDescription: "Kuryente is an intelligent Electric Meter Management System that revolutionizes how users monitor and manage their electricity consumption. The platform provides real-time monitoring, smart analytics, and AI-powered predictions to help users make informed decisions about their energy usage, reduce costs, and optimize consumption patterns.",
    tech: ["React", "Node.js", "Python", "TensorFlow", "PostgreSQL"],
    img: project9,
    screenshots: [project9, project9, project9], // Add more screenshots as available
    visitLink: "https://kuryenteh.intspace.tech",
    githubLink: "#",
    features: [
      "Real-time electricity consumption monitoring with 30-second updates",
      "Hourly breakdown charts and detailed reading history",
      "Last 20 readings timeline for quick reference",
      "Interactive consumption pattern visualization",
      "Daily, weekly, and monthly trend analysis",
      "Top consumers ranking and comparisons",
      "Month-over-month consumption insights",
      "AI-powered consumption forecasting using linear regression",
      "Next month bill estimates with accuracy predictions",
      "Adaptive learning algorithms for improved forecasts",
      "Potential savings opportunity identification",
      "Mobile-responsive dashboard design"
    ],
    challenges: [
      "Implementing reliable real-time data synchronization from smart meters",
      "Training accurate machine learning models with limited historical data",
      "Handling data transmission interruptions gracefully",
      "Optimizing database performance for time-series data storage",
      "Creating intuitive visualizations for complex consumption patterns",
      "Ensuring prediction accuracy across different consumption behaviors"
    ],
    outcomes: [
      "Successfully deployed for 500+ households",
      "Ac9ieved 85% prediction accuracy for monthly bills",
      "Users reported 15-20% reduction in electricity costs",
      "Average of 50+ daily active users per deployment",
      "Reduced customer service inquiries by 40%",
      "Positive feedback on real-time monitoring features"
    ],
    duration: "7 months",
    role: "Full Stack Developer & ML Engineer"
  },
  {
    id: "8",
    slug: "document-tracker",
    title: "Document Tracker",
    status: "On-going",
    desc: "Simplifies and tracks document processing for student enrollment systems.",
    fullDescription: "A document tracking system designed to streamline the enrollment process by monitoring and managing student documentation. This system provides transparency in document processing, reduces bottlenecks, and improves overall enrollment efficiency.",
    tech: ["Vue", "Laravel", "PostgreSQL"],
    img: project3,
    screenshots: [project3, project3], // Add more screenshots as available
    visitLink: "#",
    githubLink: "#",
    features: [
      "Document submission portal for students",
      "Real-time tracking and status updates",
      "Automated workflow routing",
      "Digital signature integration",
      "Notification system for stakeholders",
      "Comprehensive audit trails"
    ],
    challenges: [
      "Designing flexible workflow engine for various document types",
      "Ensuring document security and authenticity",
      "Managing peak loads during enrollment periods",
      "Integrating with existing student information systems"
    ],
    outcomes: [
      "Currently in beta testing phase",
      "Pilot deployment with 200+ students",
      "Positive initial feedback on usability",
      "Identified areas for optimization before full rollout"
    ],
    duration: "Ongoing (Started 4 months ago)",
    role: "Full Stack Developer"
  },
  {
    id: "8",
    slug: "job-recruitment-system",
    title: "Job Recruitment System",
    status: "On-going",
    desc: "Manages hiring processes with advanced features and seamless automation.",
    fullDescription: "A modern applicant tracking system (ATS) that automates and optimizes the recruitment process. This platform provides end-to-end recruitment management, from job posting to candidate onboarding, with AI-powered features for efficient hiring.",
    tech: ["React", "MongoDB", "Node.js"],
    img: project4,
    screenshots: [project4, project4, project4], // Add more screenshots as available
    visitLink: "#",
    githubLink: "#",
    features: [
      "Job posting and management",
      "Applicant tracking and screening",
      "Resume parsing and analysis",
      "Interview scheduling automation",
      "Collaborative hiring workflows",
      "Candidate communication system",
      "Analytics and reporting dashboard"
    ],
    challenges: [
      "Implementing accurate resume parsing algorithms",
      "Creating scalable real-time notification system",
      "Designing intuitive candidate evaluation workflows",
      "Ensuring ATS compliance with hiring regulations"
    ],
    outcomes: [
      "Currently in active development",
      "Core features implemented and tested",
      "Scheduled for beta release next quarter",
      "Early demos received positive client feedback"
    ],
    duration: "Ongoing (Started 6 months ago)",
    role: "Lead Developer"
  },
];
