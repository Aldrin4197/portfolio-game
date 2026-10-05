// Import images from the assets folder
import udemy from "../assets/udemy.webp";
import tesda from "../assets/tesda.png";
import csc from "../assets/csc.png";

const certificationsData = [
  {
    title: "Laravel 11 and Vue 3 Mastery",
    organization: "TutsPrime Online Education - Udemy",
    date: "Feb. 2025",
    description: "Demonstrated expertise in Laravel development and advanced concepts.",
    imgSrc: udemy,
  },
  {
    title: "National Certificate II in Computer Systems Servicing",
    organization: "TESDA",
    date: "April 2021",
    description:
      "A TESDA-accredited qualification in the Philippines that equips individuals with the necessary skills to install, maintain, and repair computer systems and networks. This certification is ideal for those seeking careers in IT support, technical assistance, and computer hardware/software servicing.",
    imgSrc: tesda,
  },
  {
    title: "Career Service Professional",
    organization: "Civil Service Commission",
    date: "July 2017",
    description:
      "A requirement for individuals aspiring to work in government positions, particularly in second-level (professional) positions, which include technical, supervisory, and managerial roles.",
    imgSrc: csc,
  },
];

export default certificationsData;
