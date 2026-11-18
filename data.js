// ===== 1. PASTE YOUR FIREBASE CONFIG HERE (see setup steps). Leave empty to use the default content below. =====
export const firebaseConfig = { apiKey: "AIzaSyB-GA2Zt05HeAFoYRq9M6xOc7QAqHqu5Ak", authDomain: "mamungithubio.firebaseapp.com", projectId: "mamungithubio", appId: "1:242539222683:web:7623d33870bcf95bdf183e" };

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ===== 2. Default content (taken from your CV). Used until you save from the admin panel. =====
export const defaults = {
  profile: {
    name: "Md. Mamun Ahmed",
    title: "Electrical & Electronic Engineer · Robotics & Embedded Systems",
    bio: "EEE graduate from Green University of Bangladesh (CGPA 3.61/4.00) building robots, embedded systems and brain-computer interfaces. Developer & Trainer at Robodemy, former President of Green Robotics Society, and founding member of the university's Mars Rover team.",
    email: "Ask.mamunahmed@gmail.com",
    location: "Sylhet, Bangladesh",
    github: "",
    linkedin: ""
  },
  skills: [
    { group: "Programming", items: "Embedded C, Python, PLC Programming" },
    { group: "Hardware", items: "PCB Design, PCB Fabrication, Robotics, IoT, FPGA/VLSI" },
    { group: "Software & Tools", items: "Proteus, Altium Designer, EasyEDA, MATLAB, DopSoft, WPLSoft" },
    { group: "Other", items: "Digital Marketing, SEO, Project Management" }
  ],
  projects: [
    { title: "Deep Learning Based BCI for Wheelchair Control", date: "2025 – Present", desc: "Undergraduate thesis. A 5-direction brain-computer interface using an Emotiv Insight headset and ESP32 prototype. CNN-LSTM model reaches 92.6% EEG classification accuracy." },
    { title: "Project Lotus – Mars Rover", date: "2024 – Present", desc: "Semi-autonomous rover with a 6-DOF robotic arm. Built the core electrical modules and custom PCBs, and led project management." },
    { title: "High-Speed Line Follower Robot", date: "2023 – Present", desc: "Custom chassis, self-designed PCB, 8-channel IR array on Arduino Nano, plus a GUI for real-time tuning. Top rankings in national competitions." }
  ],
  experience: [
    { role: "Developer & Trainer", org: "Robodemy, Dhaka", date: "Oct 2026 – Present", desc: "Embedded firmware, IoT integration and PCB design; hands-on robotics and electronics training." },
    { role: "Robotics & Embedded System Intern", org: "Robodemy, Dhaka", date: "Jul 2026 – Sep 2026", desc: "VTOL, smart door lock, attendance counter and healthcare device projects." },
    { role: "Industrial Trainee", org: "Brac Institute of Skills Development", date: "Feb 2026 – May 2026", desc: "PLC programming, HMI development, installation and commissioning." },
    { role: "Founding Member & Management Lead", org: "Green University Mars Rover Team", date: "Jun 2024 – May 2026", desc: "Co-founded the team, secured funding, designed electrical architecture." },
    { role: "SEO Specialist", org: "Wizard Media Pro", date: "Feb 2022 – Nov 2024", desc: "SEO strategy, site audits and keyword research for agency clients." }
  ],
  achievements: [
    { text: "Global Finalist, Anatolian Rover Challenge 2025 (Ankara, Turkey)", date: "May 2025" },
    { text: "Alumni Associate, GUBMRT: 6th worldwide and Champion in Asia at ARC 2026", date: "Aug 2026" },
    { text: "Competed in 12+ national robotics competitions with top-tier results", date: "2024 – Present" },
    { text: "President, Green Robotics Society", date: "Mar 2025 – May 2026" },
    { text: "Workshop Instructor: PCB Design, Line Following Robot, Basic Electronics & Robotics", date: "2025 – 2026" }
  ]
};

// ===== Firebase helpers =====
const B = "https://www.gstatic.com/firebasejs/10.12.2/";
export const ready = !!firebaseConfig.apiKey;
export async function fb() {
  const [a, f, u] = await Promise.all([import(B + "firebase-app.js"), import(B + "firebase-firestore.js"), import(B + "firebase-auth.js")]);
  const app = a.initializeApp(firebaseConfig);
  return { db: f.getFirestore(app), auth: u.getAuth(app), f, u };
}
export async function load() {
  if (!ready) return defaults;
  try {
    const { db, f } = await fb();
    const s = await f.getDoc(f.doc(db, "portfolio", "main"));
    return s.exists() ? { ...defaults, ...s.data() } : defaults;
  } catch (e) { return defaults; }
}
