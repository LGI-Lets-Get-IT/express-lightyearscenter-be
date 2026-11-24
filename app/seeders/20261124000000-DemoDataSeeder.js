"use strict";

/**
 * Demo data for The Lightyears CDC dashboard.
 *
 * Builds one connected story per client: intake consultation -> assessment ->
 * feedback consultation + treatment plan -> weekly therapy sessions with
 * progress notes. All dates are relative to the day the seeder runs, so the
 * dashboard always shows past history, today's bookings and upcoming ones.
 *
 * Requires RoleSeeder to have run first (roles 1-5).
 *
 *   npx sequelize-cli db:seed --seed 20261124000000-DemoDataSeeder.js
 *   npx sequelize-cli db:seed:undo --seed 20261124000000-DemoDataSeeder.js
 *
 * Set SEED_DRY_RUN=1 to run everything inside a transaction and roll it back.
 *
 * All seeded logins use the password "password123". Email addresses use the
 * reserved example.com domain so appointment emails never reach real people.
 */

const bcrypt = require("bcrypt");
const crypto = require("crypto");

const PASSWORD = "password123";
const TZ_OFFSET = "+07:00";
const ROLE = { STAFF: 1, PSYCHOLOGIST: 2, THERAPIST: 3, SPED_TEACHER: 4, SCHOOL_PIC: 5 };
const ROLE_NAME = { 2: "Psychologist", 3: "Therapist", 4: "SPED Teacher" };
const SLOTS = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"];
const ROOMS = [1, 2];

// ---------------------------------------------------------------- master data

const SCHOOLS = [
  { key: "cahaya", name: "Sekolah Cahaya Nusantara", address: "Jl. Kemang Raya No. 18, Jakarta Selatan", phone: "+62217190245", email: "info@cahayanusantara.example.com", pic: ["Ratna Wulandari", "+6281288340112", "ratna.wulandari@example.com"] },
  { key: "pelita", name: "Pelita Bangsa International School", address: "Jl. Pantai Indah Kapuk Boulevard No. 7, Jakarta Utara", phone: "+62215698810", email: "admissions@pelitabangsa.example.com", pic: ["Daniel Hartono", "+6281377125540", "daniel.hartono@example.com"] },
  { key: "tunas", name: "SD Tunas Mekar", address: "Jl. Cempaka Putih Tengah No. 42, Jakarta Pusat", phone: "+62214247733", email: "tu@tunasmekar.example.com", pic: ["Sri Lestari", "+6285691022347", "sri.lestari@example.com"] },
  { key: "bintang", name: "Bintang Kecil Montessori", address: "Jl. BSD Grand Boulevard Blok C3 No. 5, Tangerang Selatan", phone: "+62215371190", email: "hello@bintangkecil.example.com", pic: ["Maria Gunawan", "+6281510298876", "maria.gunawan@example.com"] },
];

const EMPLOYEES = [
  { key: "anita", role: ROLE.STAFF, name: "Anita Kusuma", phone: "+6281219874520", email: "anita.kusuma@example.com" },
  { key: "laras", role: ROLE.PSYCHOLOGIST, name: "Laras Pratiwi, M.Psi., Psikolog", phone: "+6281311442098", email: "laras.pratiwi@example.com", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], hours: ["09:00", "17:00"] },
  { key: "bima", role: ROLE.PSYCHOLOGIST, name: "Bima Aditya, M.Psi., Psikolog", phone: "+6281288901134", email: "bima.aditya@example.com", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], hours: ["09:00", "17:00"] },
  { key: "clara", role: ROLE.PSYCHOLOGIST, name: "Clara Wijaya, M.Psi., Psikolog", phone: "+6281776540021", email: "clara.wijaya@example.com", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], hours: ["09:00", "17:00"] },
  { key: "dewi", role: ROLE.THERAPIST, name: "Dewi Anggraini, S.Tr.Kes", phone: "+6285710334589", email: "dewi.anggraini@example.com", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], hours: ["08:30", "17:00"] },
  { key: "fajar", role: ROLE.THERAPIST, name: "Fajar Nugroho, S.Ft", phone: "+6281390117745", email: "fajar.nugroho@example.com", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], hours: ["08:30", "17:00"] },
  { key: "putri", role: ROLE.THERAPIST, name: "Putri Maharani, S.Psi", phone: "+6281244560987", email: "putri.maharani@example.com", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], hours: ["08:30", "17:00"] },
  { key: "yohanes", role: ROLE.THERAPIST, name: "Yohanes Setiawan, S.Tr.Kes", phone: "+6287882203316", email: "yohanes.setiawan@example.com", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], hours: ["08:30", "17:00"] },
  { key: "rina", role: ROLE.SPED_TEACHER, name: "Rina Marlina, S.Pd", phone: "+6281317762204", email: "rina.marlina@example.com", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], hours: ["09:00", "17:00"] },
  { key: "hendra", role: ROLE.SPED_TEACHER, name: "Hendra Saputra, S.Pd", phone: "+6289601148823", email: "hendra.saputra@example.com", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], hours: ["09:00", "17:00"] },
  { key: "ratnaPic", role: ROLE.SCHOOL_PIC, name: "Ratna Wulandari", phone: "+6281288340112", email: "ratna.wulandari@example.com", school: "cahaya" },
  { key: "danielPic", role: ROLE.SCHOOL_PIC, name: "Daniel Hartono", phone: "+6281377125540", email: "daniel.hartono@example.com", school: "pelita" },
];
const PSYCHOLOGISTS = ["laras", "bima", "clara"];

const TEST_TYPES = {
  wisc: { name: "WISC-V (Wechsler Intelligence Scale for Children)", short: "WISC-V", description: "Standardised cognitive assessment for children aged 6-16 measuring verbal comprehension, visual spatial, fluid reasoning, working memory and processing speed." },
  ados: { name: "ADOS-2 (Autism Diagnostic Observation Schedule)", short: "ADOS-2", description: "Semi-structured, play-based observation used to assess communication, social interaction and restricted or repetitive behaviours associated with autism." },
  vineland: { name: "Vineland-3 Adaptive Behavior Scales", short: "Vineland-3", description: "Parent and teacher interview measuring adaptive functioning across communication, daily living skills and socialisation." },
  conners: { name: "Conners 3 ADHD Rating Scales", short: "Conners 3", description: "Parent, teacher and self-report rating scales for attention, hyperactivity/impulsivity, learning problems and executive functioning." },
  denver: { name: "Denver II Developmental Screening", short: "Denver II", description: "Developmental screening for children 0-6 years across personal-social, fine motor, language and gross motor domains." },
  cpm: { name: "Raven's Coloured Progressive Matrices (CPM)", short: "CPM", description: "Non-verbal reasoning test for children aged 5-11, useful when language or cultural factors may affect verbal tests." },
};

// Each treatment carries the clinical content used for plans and session notes.
const TREATMENTS = {
  speech: {
    name: "Speech Therapy", therapists: ["dewi"],
    description: "Individual therapy targeting receptive and expressive language, articulation and functional communication.",
    aim: "Improve expressive language so the child can communicate needs with short phrases",
    target: ["Expressive language: requesting with 2-3 word phrases", "Uses single words and pointing to request", "Requests 10 preferred items using 2-word phrases in 4/5 trials", "Picture cards, toy food set, bubbles, mirror"],
    goals: ["Request items using 2-word phrases", "Name 10 common objects from pictures"],
    activities: ["Requesting game with picture cards during snack time", "Picture naming with farm animal set"],
  },
  ot: {
    name: "Occupational Therapy", therapists: ["fajar", "yohanes"],
    description: "Therapy for fine motor, visual motor and self-help skills to support independence at home and school.",
    aim: "Develop fine motor control and pre-writing skills for classroom readiness",
    target: ["Fine motor: pencil grasp and pre-writing strokes", "Fisted grasp; scribbles without control", "Uses tripod grasp to copy lines, circle and cross", "Triangular crayons, playdough, tweezers, lacing beads"],
    goals: ["Hold pencil with tripod grasp for 5 minutes", "Copy circle and cross shapes"],
    activities: ["Playdough strengthening and tweezer transfer", "Tracing shapes on a vertical whiteboard"],
  },
  sensory: {
    name: "Sensory Integration Therapy", therapists: ["yohanes"],
    description: "Play-based therapy using controlled sensory input to improve regulation, attention and tolerance of everyday sensations.",
    aim: "Improve sensory regulation and reduce meltdowns triggered by noise and textures",
    target: ["Sensory regulation and tolerance", "Covers ears and cries with loud sounds; avoids messy textures", "Tolerates 10 minutes of messy play and noise using 1 calming strategy", "Therapy swing, weighted vest, sensory bin, noise-cancelling headphones"],
    goals: ["Tolerate tactile play for 10 minutes", "Use a calming strategy when overwhelmed"],
    activities: ["Linear swinging followed by sensory bin play", "Heavy-work obstacle course"],
  },
  aba: {
    name: "Behavior Therapy (ABA)", therapists: ["putri"],
    description: "Applied Behavior Analysis program building attention, compliance, communication and daily routines through structured reinforcement.",
    aim: "Increase on-task behaviour and the ability to follow multi-step instructions",
    target: ["Following instructions and sitting at table", "Follows 1-step instruction with full prompts; sits for 2 minutes", "Follows 2-step instructions and sits for 10 minutes with minimal prompts", "Token board, visual schedule, sand timer, preferred reinforcers"],
    goals: ["Follow 2-step instructions", "Stay seated at table for 10 minutes"],
    activities: ["Discrete trial training with token board", "Table-top task with visual timer"],
  },
  social: {
    name: "Social Skills Group", therapists: ["putri"],
    description: "Small-group sessions practising turn-taking, conversation, emotion recognition and cooperative play.",
    aim: "Build turn-taking and peer interaction skills for the classroom and playground",
    target: ["Turn-taking and initiating with peers", "Grabs toys and rarely initiates play with peers", "Takes turns for 3 rounds in a structured game and greets peers", "Board games, social stories, role-play cards"],
    goals: ["Take turns for 3 rounds in a game", "Greet a peer and invite them to play"],
    activities: ["Structured board game in a small group", "Role-play greetings using a social story"],
  },
  remedial: {
    name: "Remedial Teaching", therapists: ["rina", "hendra"],
    description: "One-to-one academic support for reading, writing and numeracy using multisensory teaching methods.",
    aim: "Improve reading decoding and fluency to reach grade-level expectations",
    target: ["Reading decoding and fluency", "Reads CVC words with errors; reverses b and d", "Reads 20 CVC and blend words accurately and distinguishes b/d", "Phonics flashcards, sand tray, levelled readers"],
    goals: ["Decode CVC and blend words", "Distinguish b and d when reading"],
    activities: ["Multisensory phonics with sand tray", "Guided reading with a levelled book"],
  },
  play: {
    name: "Play Therapy", therapists: ["putri"],
    description: "Child-led therapeutic play to help children express feelings, manage anxiety and build coping skills.",
    aim: "Strengthen emotional regulation and reduce separation anxiety",
    target: ["Emotional regulation and separation", "Cries and refuses to separate from parent for 15+ minutes", "Separates from parent within 5 minutes and names 4 feelings", "Feelings chart, puppets, sand tray, calm-down corner kit"],
    goals: ["Name feelings using a feelings chart", "Separate from parent within 5 minutes"],
    activities: ["Puppet play about the school day", "Feelings check-in and breathing exercise"],
  },
};

// Presenting concern -> problem text, assessment used, treatments, parent plan.
const CONCERNS = {
  speech: { test: "denver", treatments: ["speech"], problem: "Speech delay: limited expressive vocabulary for age, mostly uses single words and gestures to communicate needs.", parentPlan: "Practise 2-word requests during meals and play; read picture books together 15 minutes every night; limit screen time to 1 hour per day." },
  asd: { test: "ados", treatments: ["aba", "speech"], problem: "Suspected autism spectrum disorder: limited eye contact, repetitive play with spinning objects, distress during transitions.", parentPlan: "Use a visual schedule for morning and bedtime routines; reinforce eye contact and requesting at home; join the monthly parent coaching session." },
  adhd: { test: "conners", treatments: ["aba", "social"], problem: "Difficulty sustaining attention in class, impulsive behaviour and frequently leaving seat; teacher reports incomplete work.", parentPlan: "Break homework into 10-minute blocks with short movement breaks; use a reward chart for completed tasks; keep a consistent sleep schedule." },
  learning: { test: "wisc", treatments: ["remedial"], problem: "Reading and spelling well below grade level; reverses letters, slow reading fluency and avoids reading aloud.", parentPlan: "Read levelled books together 15 minutes daily; practise phonics flashcards 3 times a week; request extra time for written tests at school." },
  sensory: { test: "vineland", treatments: ["sensory", "ot"], problem: "Over-sensitive to noise and textures, frequent meltdowns in crowded places and poor fine-motor control for handwriting.", parentPlan: "Follow the home sensory diet (heavy work before school, calm corner after school); prepare the child before noisy outings; practise playdough and lacing activities." },
  devdelay: { test: "denver", treatments: ["ot", "speech"], problem: "Global developmental delay: late fine-motor and language milestones and limited self-help skills (dressing, feeding).", parentPlan: "Encourage self-feeding and dressing with extra time; daily fine-motor play (blocks, stickers); narrate daily activities to build vocabulary." },
  emotional: { test: "cpm", treatments: ["play"], problem: "Frequent tantrums and school refusal after a family relocation; strong anxiety when separating from parents.", parentPlan: "Keep a short, predictable goodbye routine at school drop-off; use the feelings chart each evening; praise brave behaviour specifically." },
};

// [fullName, gender, age, schoolKey|null, className, nationality, concern, guardian, relationship, guardianNationality]
const CLIENTS = [
  ["Alya Putri Ramadhani", "Female", 4, "bintang", "K1", "Indonesian", "speech", "Rina Ramadhani", "Mother"],
  ["Muhammad Rafi Pratama", "Male", 5, "bintang", "K2", "Indonesian", "asd", "Andi Pratama", "Father"],
  ["Kenzo Wijaya", "Male", 8, "pelita", "Grade 3", "Indonesian", "adhd", "Linda Wijaya", "Mother"],
  ["Nayla Azzahra", "Female", 9, "tunas", "Kelas 4", "Indonesian", "learning", "Siti Rahmawati", "Mother"],
  ["Ethan Gunawan", "Male", 6, "pelita", "Grade 1", "Indonesian", "sensory", "Michael Gunawan", "Father"],
  ["Aisyah Nurul Hidayah", "Female", 3, null, null, "Indonesian", "devdelay", "Nurul Hidayah", "Mother"],
  ["Darren Tanoto", "Male", 7, "pelita", "Grade 2", "Indonesian", "adhd", "Yenny Tanoto", "Mother"],
  ["Keisha Amanda Siregar", "Female", 10, "cahaya", "Kelas 5", "Indonesian", "emotional", "Robert Siregar", "Father"],
  ["Arkana Bagas Saputra", "Male", 4, "bintang", "K1", "Indonesian", "speech", "Dimas Saputra", "Father"],
  ["Chloe Hartanto", "Female", 6, "pelita", "Grade 1", "Indonesian", "asd", "Jessica Hartanto", "Mother"],
  ["Rizky Maulana Akbar", "Male", 11, "cahaya", "Kelas 6", "Indonesian", "learning", "Akbar Maulana", "Father"],
  ["Olivia Tan", "Female", 5, null, null, "Singaporean", "sensory", "Grace Tan", "Mother", "Singaporean"],
  ["Bintang Mahendra", "Male", 8, "tunas", "Kelas 3", "Indonesian", "adhd", "Hendra Mahendra", "Father"],
  ["Zahra Khairunnisa", "Female", 7, "cahaya", "Kelas 2", "Indonesian", "emotional", "Fatimah Zahra", "Grand Mother"],
  ["Liam Prasetyo", "Male", 4, null, null, "Indonesian", "devdelay", "Sarah Prasetyo", "Mother"],
  ["Shakira Valentina", "Female", 9, "pelita", "Grade 4", "Indonesian", "learning", "Valentina Lim", "Mother"],
  ["Gibran Alfarizi", "Male", 3, null, null, "Indonesian", "speech", "Fauzi Alfarizi", "Father"],
  ["Felicia Kurniawan", "Female", 12, "cahaya", "Kelas 7", "Indonesian", "emotional", "Hadi Kurniawan", "Father"],
  ["Daffa Ardiansyah", "Male", 6, "tunas", "Kelas 1", "Indonesian", "asd", "Rudi Ardiansyah", "Father"],
  ["Jasmine Halim", "Female", 8, "pelita", "Grade 3", "Indonesian", "adhd", "Kevin Halim", "Father"],
  ["Raka Dwi Putra", "Male", 5, "bintang", "K2", "Indonesian", "sensory", "Dwi Lestari", "Mother"],
  ["Naura Salsabila", "Female", 10, "tunas", "Kelas 5", "Indonesian", "learning", "Ahmad Fauzan", "Father"],
  ["Noah Sebastian", "Male", 4, null, null, "Australian", "speech", "Emily Sebastian", "Mother", "Australian"],
  ["Kirana Larasati", "Female", 7, "cahaya", "Kelas 2", "Indonesian", "adhd", "Bayu Wicaksono", "Father"],
];
// Clients 0-13 are in active treatment, 14-19 are mid-assessment, 20-23 are new intakes.
const IN_TREATMENT = 14;
const IN_ASSESSMENT = 20;

const CITIES = ["Jakarta", "Jakarta", "Jakarta", "Tangerang", "Bekasi", "Bandung", "Surabaya", "Depok"];
const STREETS = ["Jl. Kebagusan Raya No. 21, Jakarta Selatan", "Jl. Gading Serpong Blok M5 No. 9, Tangerang", "Jl. Pluit Karang Indah No. 14, Jakarta Utara", "Jl. Tebet Barat Dalam VI No. 3, Jakarta Selatan", "Jl. Bintaro Utama Sektor 3A No. 27, Tangerang Selatan", "Jl. Kelapa Gading Boulevard TN2 No. 11, Jakarta Utara", "Jl. Cipete Raya No. 55, Jakarta Selatan", "Jl. Harapan Indah Boulevard No. 8, Bekasi", "Jl. Margonda Raya No. 102, Depok", "Jl. Puri Indah Raya Blok A No. 6, Jakarta Barat"];
const RELIGIONS = ["Islam", "Islam", "Islam", "Christian", "Catholic", "Buddhist", "Hindu"];
const HEARD = ["Instagram", "School recommendation", "Pediatrician referral", "Friend or family", "Google search", "Parenting seminar"];
const EDUCATION = ["Bachelor's degree", "Master's degree", "Diploma", "High school"];

// ------------------------------------------------------------------- helpers

function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildCalendar() {
  // "Today" in Jakarta, regardless of the machine's timezone.
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta" }).format(new Date());
  const [y, m, d] = today.split("-").map(Number);
  const dayInfo = (offset) => {
    const dt = new Date(Date.UTC(y, m - 1, d + offset));
    return { ymd: dt.toISOString().slice(0, 10), weekday: dt.getUTCDay() };
  };
  const at = (offset, time = "00:00") => new Date(`${dayInfo(offset).ymd}T${time}:00${TZ_OFFSET}`);
  return { dayInfo, at };
}

const firstName = (fullName) => fullName.split(" ")[0];
const emailOf = (name) => `${name.toLowerCase().replace(/[^a-z ]/g, "").trim().replace(/\s+/g, ".")}@example.com`;
const addMinutes = (date, minutes) => new Date(date.getTime() + minutes * 60000);

function progressNote(rng, fraction) {
  const jitter = rng() < 0.3 ? -1 : 0;
  const levels = [
    "Needs full physical and verbal prompting; achieved 1/5 trials",
    "Needs partial prompting; achieved 2/5 trials",
    "Needs partial prompting; achieved 3/5 trials",
    "Minimal verbal prompting; achieved 4/5 trials",
    "Achieved independently in 5/5 trials",
  ];
  const level = Math.max(0, Math.min(levels.length - 1, Math.floor(fraction * levels.length) + jitter));
  return levels[level];
}

function assessmentResult(rng, testKey, client) {
  const r = (lo, hi) => lo + Math.floor(rng() * (hi - lo + 1));
  switch (testKey) {
    case "wisc": {
      const [vci, vsi, fri, wmi, psi] = [r(92, 108), r(94, 110), r(90, 106), r(76, 86), r(74, 85)];
      const fsiq = Math.round((vci + vsi + fri + wmi + psi) / 5);
      return `Full Scale IQ ${fsiq} (Average range). Verbal Comprehension ${vci}, Visual Spatial ${vsi}, Fluid Reasoning ${fri}, Working Memory ${wmi}, Processing Speed ${psi}. Relative weaknesses in working memory and processing speed are consistent with the reported reading and spelling difficulties (specific learning difficulty in reading). Recommendation: remedial teaching twice a week, extra time and reading support for tests at school.`;
    }
    case "ados":
      return `Module ${client.age < 5 ? 1 : 2} administered. Comparison score ${r(6, 8)}: moderate level of autism spectrum-related symptoms. Reduced eye contact, limited joint attention and repetitive play with spinning objects observed; responds to name inconsistently. Recommendation: ABA-based behaviour therapy and speech therapy, visual schedules at home and school, parent coaching.`;
    case "conners":
      return `Parent and teacher forms. Inattention T=${r(68, 78)} (very elevated), Hyperactivity/Impulsivity T=${r(64, 74)} (elevated), Executive Functioning T=${r(62, 70)} (elevated). Profile is consistent with ADHD, combined presentation. Recommendation: behaviour therapy, social skills group, preferential seating and movement breaks in class; review with paediatrician.`;
    case "vineland": {
      const [com, dls, soc] = [r(80, 92), r(72, 84), r(76, 88)];
      return `Adaptive Behavior Composite ${Math.round((com + dls + soc) / 3)} (moderately low). Communication ${com}, Daily Living Skills ${dls}, Socialization ${soc}. Sensory profile shows over-responsivity to auditory and tactile input, which limits participation in group activities. Recommendation: sensory integration therapy, occupational therapy for fine-motor skills and a home sensory diet.`;
    }
    case "denver":
      return `Denver II: ${r(2, 3)} cautions and ${r(1, 2)} delay recorded in the language and fine-motor sectors; gross motor and personal-social within the expected range for age. Recommendation: speech therapy and occupational therapy, parent home programme, re-screen in 3 months.`;
    case "cpm":
      return `Raw score ${r(22, 28)}, ${r(50, 75)}th percentile (Grade III - intellectually average). Non-verbal reasoning is age-appropriate, so difficulties are not cognitive in origin. Clinical interview and observation indicate separation anxiety and difficulty adjusting after relocation. Recommendation: play therapy weekly, consistent drop-off routine and close coordination with the class teacher.`;
    default:
      return "Assessment completed. See clinical notes for details.";
  }
}

// ---------------------------------------------------------------- scheduling

function createScheduler(cal) {
  const busy = new Map(); // "offset|slot" -> { pics:Set, rooms:Set }
  const cell = (offset, slot) => {
    const key = `${offset}|${slot}`;
    if (!busy.has(key)) busy.set(key, { pics: new Set(), rooms: new Set() });
    return busy.get(key);
  };

  // Finds the first weekday on/after `offset` where the PIC and a room are free.
  return function place(offset, picId, preferredSlot) {
    for (let d = offset; d < offset + 30; d++) {
      const { weekday } = cal.dayInfo(d);
      if (weekday === 0 || weekday === 6) continue;
      for (let i = 0; i < SLOTS.length; i++) {
        const slot = SLOTS[(preferredSlot + i) % SLOTS.length];
        const c = cell(d, slot);
        if (c.pics.has(picId)) continue;
        const room = ROOMS.find((r) => !c.rooms.has(r));
        if (!room) continue;
        c.pics.add(picId);
        c.rooms.add(room);
        return { offset: d, slot, room };
      }
    }
    throw new Error(`No free slot for PIC ${picId} near day ${offset}`);
  };
}

// ---------------------------------------------------------------------- seed

async function nextIdFrom(queryInterface, table, transaction) {
  const [row] = await queryInterface.sequelize.query(`SELECT COALESCE(MAX(id), 0)::int AS max FROM "${table}"`, { type: "SELECT", transaction });
  let id = row.max;
  return () => ++id;
}

async function buildData(queryInterface, transaction) {
  const rng = mulberry32(20261124);
  const cal = buildCalendar();
  const place = createScheduler(cal);
  const now = new Date();
  const hashed = await bcrypt.hash(PASSWORD, 10);
  const ts = (date) => ({ created_at: date, updated_at: date });
  const ids = {};
  for (const t of ["schools", "employees", "pic_availabilities", "test_types", "treatment_types", "clients", "client_details", "appointments", "client_assessments", "treatment_plans", "treatment_programs", "targeted_behaviors", "treatment_sessions"]) {
    ids[t] = await nextIdFrom(queryInterface, t, transaction);
  }

  const data = { schools: [], employees: [], pic_availabilities: [], test_types: [], treatment_types: [], clients: [], client_details: [], appointments: [], client_assessments: [], treatment_plans: [], treatment_programs: [], targeted_behaviors: [], treatment_sessions: [] };
  const setup = cal.at(-120, "08:00");

  // Schools, staff and availability.
  const schoolId = {};
  for (const s of SCHOOLS) {
    schoolId[s.key] = ids.schools();
    data.schools.push({ id: schoolId[s.key], name: s.name, address: s.address, phone_number: s.phone, email: s.email, pic_full_name: s.pic[0], pic_phone_number: s.pic[1], pic_email: s.pic[2], password: hashed, is_active: true, ...ts(setup) });
  }

  const emp = {};
  for (const e of EMPLOYEES) {
    const id = ids.employees();
    emp[e.key] = { ...e, id };
    data.employees.push({ id, role_id: e.role, full_name: e.name, phone_number: e.phone, email: e.email, password: hashed, is_active: true, school_id: e.school ? schoolId[e.school] : null, ...ts(setup) });
    if (e.days) {
      data.pic_availabilities.push({ id: ids.pic_availabilities(), employee_id: id, available_days: e.days, available_start_time: e.hours[0], available_end_time: e.hours[1], ...ts(setup) });
    }
  }

  const testId = {};
  for (const [key, t] of Object.entries(TEST_TYPES)) {
    testId[key] = ids.test_types();
    data.test_types.push({ id: testId[key], name: t.name, description: t.description, is_active: true, ...ts(setup) });
  }
  const treatmentId = {};
  for (const [key, t] of Object.entries(TREATMENTS)) {
    treatmentId[key] = ids.treatment_types();
    data.treatment_types.push({ id: treatmentId[key], name: t.name, description: t.description, is_active: true, ...ts(setup) });
  }

  const appointment = (offset, picKey, clientId, type, title, duration, preferredSlot) => {
    const pic = emp[picKey];
    const spot = place(offset, pic.id, preferredSlot);
    const start = cal.at(spot.offset, spot.slot);
    const row = {
      id: ids.appointments(), pic_id: pic.id, pic_type: ROLE_NAME[pic.role], client_id: clientId,
      title: title.slice(0, 64), appointment_type: type, appointment_date: cal.at(spot.offset),
      booking_time_start: start, booking_time_end: addMinutes(start, duration), room_id: spot.room,
      is_confirmed: spot.offset < 0 || rng() < 0.75, ...ts(cal.at(Math.min(spot.offset, 0) - 5, "10:00")),
    };
    data.appointments.push(row);
    return { ...row, offset: spot.offset };
  };

  // Clients and their journeys.
  CLIENTS.forEach(([fullName, gender, age, schoolKey, className, nationality, concernKey, guardian, relationship, guardianNationality], i) => {
    const concern = CONCERNS[concernKey];
    const psychologist = PSYCHOLOGISTS[i % PSYCHOLOGISTS.length];
    const first = firstName(fullName);
    const slot = i % SLOTS.length;

    // Intake day: long ago for clients in treatment, recent for those mid-assessment, upcoming for new ones.
    const intake = i < IN_TREATMENT ? -75 + i * 2 : i < IN_ASSESSMENT ? -24 + (i - IN_TREATMENT) * 3 : 1 + (i - IN_ASSESSMENT) * 3;

    const clientId = ids.clients();
    const dob = cal.at(-(age * 365 + Math.floor(rng() * 300) + 30));
    const created = cal.at(Math.min(intake, 0) - 4, "11:00");
    const address = STREETS[i % STREETS.length];
    data.clients.push({
      id: clientId, uuid: crypto.randomUUID(), school_id: schoolKey ? schoolId[schoolKey] : null, full_name: fullName, age, gender,
      date_of_birth: dob, nationality, class_name: className, branch_origin: "Jakarta Selatan", problem: concern.problem,
      guardian_name: guardian, guardian_email: emailOf(guardian), guardian_phone: `+628${String(1100000000 + Math.floor(rng() * 899999999))}`,
      guardian_nationality: guardianNationality || nationality, guardian_relationship: relationship, address, password: hashed,
      is_active: true, allow_share_data: i % 7 !== 3, intake_form_link: null, ...ts(created),
    });

    const siblings = 1 + Math.floor(rng() * 3);
    const order = 1 + Math.floor(rng() * siblings);
    const guardianGender = ["Mother", "Grand Mother", "Aunt"].includes(relationship) ? "Female" : "Male";
    const otherParent = guardianGender === "Female" ? "Male" : "Female";
    data.client_details.push({
      id: ids.client_details(), client_id: clientId, place_of_birth: CITIES[i % CITIES.length], religion: RELIGIONS[i % RELIGIONS.length],
      child_birth_order: `${order} of ${siblings}`, home_address: address,
      previous_ongoing_activity: age >= 6 ? "Swimming lessons on weekends, Kumon after school" : "Playgroup three mornings a week",
      major_reason_concerns: concern.problem,
      previous_psychological_details: i % 4 === 1 ? "Assessed at another clinic last year; report provided by parents." : "No previous psychological assessment.",
      programs_expectations: "Clear diagnosis, a structured therapy plan and practical strategies we can use at home and school.",
      social_abilities: ["Plays alongside peers but rarely together", "Friendly with adults, shy with peers", "Prefers to play alone"][i % 3],
      relationship_abilities: ["Close to mother and siblings", "Attached to grandparents", "Warm with family, anxious with strangers"][i % 3],
      health_abilities: ["Generally healthy", "Mild asthma, controlled", "Picky eater; healthy otherwise"][i % 3],
      math_abilities: age >= 6 ? ["Counts to 100, adds within 20", "Struggles with word problems", "At grade level"][i % 3] : "Counts to 10 with support",
      how_heard_about_us: HEARD[i % HEARD.length],
      institutions_data: JSON.stringify(schoolKey ? [{ institutionName: SCHOOLS.find((s) => s.key === schoolKey).name, activity: "Formal schooling", age: `${Math.max(3, age - 2)} years`, duration: `${Math.min(age - 2, 3)} years` }] : [{ institutionName: "Rumah Pintar Playgroup", activity: "Playgroup", age: `${Math.max(2, age - 1)} years`, duration: "1 year" }]),
      guardians_data: JSON.stringify([
        { guardianName: guardian, gender: guardianGender, placeOfBirth: CITIES[(i + 3) % CITIES.length], dateOfBirth: `${1980 + (i % 12)}-0${1 + (i % 9)}-1${i % 9}`, education: EDUCATION[i % EDUCATION.length] },
        { guardianName: `${guardianGender === "Female" ? "Bapak" : "Ibu"} ${guardian.split(" ").slice(-1)[0]}`, gender: otherParent, placeOfBirth: CITIES[(i + 5) % CITIES.length], dateOfBirth: `${1979 + (i % 11)}-1${i % 3}-0${1 + (i % 8)}`, education: EDUCATION[(i + 1) % EDUCATION.length] },
      ]),
      ...ts(created),
    });

    // A few clients bring an outside report from a previous clinic.
    if (i % 4 === 1 && i < IN_ASSESSMENT) {
      data.client_assessments.push({
        id: ids.client_assessments(), appointment_id: null, psychologist_id: emp[psychologist].id, client_id: clientId, test_type_id: testId[concern.test],
        result: `External report (previous clinic): ${assessmentResult(rng, concern.test, { age: age - 1 })}`,
        assessment_date: cal.at(intake - 180), is_in_center_assessment: false, ...ts(created),
      });
    }

    // 1) Intake consultation, 2) assessment, 3) feedback consultation.
    const consult = appointment(intake, psychologist, clientId, "Consultation", `Initial Consultation - ${first}`, 60, slot);
    if (i >= IN_ASSESSMENT) return;

    const test = TEST_TYPES[concern.test];
    const assess = appointment(consult.offset + 7, psychologist, clientId, "Assessment", `${test.short} Assessment - ${first}`, 60, slot + 1);
    if (assess.offset < 0) {
      data.client_assessments.push({
        id: ids.client_assessments(), appointment_id: assess.id, psychologist_id: emp[psychologist].id, client_id: clientId, test_type_id: testId[concern.test],
        result: assessmentResult(rng, concern.test, { age }), assessment_date: assess.booking_time_start, is_in_center_assessment: true,
        ...ts(addMinutes(assess.booking_time_end, 60 * 24)),
      });
    }

    const feedback = appointment(assess.offset + 7, psychologist, clientId, "Consultation", `Assessment Feedback - ${first}`, 60, slot);
    if (i >= IN_TREATMENT) return;

    // 4) Treatment plan agreed at the feedback session.
    const planId = ids.treatment_plans();
    data.treatment_plans.push({
      id: planId, client_id: clientId, psychologist_id: emp[psychologist].id,
      present_problem: `${concern.problem} ${test.short} results discussed with parents at feedback session.`,
      consult_date: feedback.booking_time_start, parent_plan: concern.parentPlan, ...ts(feedback.booking_time_end),
    });

    // 5) Weekly therapy per program, with progress notes for sessions already held.
    concern.treatments.forEach((tKey, p) => {
      const treatment = TREATMENTS[tKey];
      const therapist = treatment.therapists[i % treatment.therapists.length];
      const frequency = [12, 16, 24][(i + p) % 3];
      const duration = tKey === "social" || tKey === "remedial" ? 60 : 45;
      const programId = ids.treatment_programs();
      data.treatment_programs.push({
        id: programId, treatment_plan_id: planId, treatment_type_id: treatmentId[tKey], therapist_id: emp[therapist].id,
        aim_of_treatment: treatment.aim, session_frequency: frequency, session_duration: duration, ...ts(feedback.booking_time_end),
      });
      const [targetBehavior, currentAbility, shortTermTarget, mediaTools] = treatment.target;
      data.targeted_behaviors.push({
        id: ids.targeted_behaviors(), treatment_plan_id: planId, target_behavior: targetBehavior, current_ability: currentAbility,
        short_term_target: shortTermTarget, media_tools: mediaTools, ...ts(feedback.booking_time_end),
      });

      let day = feedback.offset + 4 + p * 2;
      for (let session = 1; session <= frequency && day <= 21; session++) {
        const appt = appointment(day, therapist, clientId, "Treatment", `${first}'s Therapy - ${treatment.name} - Session ${session}`, duration, slot + 2 + p);
        if (appt.booking_time_end < now) {
          const fraction = session / frequency;
          data.treatment_sessions.push({
            id: ids.treatment_sessions(), treatment_plan_id: planId, treatment_program_id: programId, appointment_id: appt.id, client_id: clientId,
            current_session: session, short_term_goals: treatment.goals, activities: treatment.activities,
            progress: treatment.goals.map(() => progressNote(rng, fraction)), ...ts(appt.booking_time_end),
          });
        }
        day = appt.offset + 7;
      }
    });
  });

  return data;
}

const INSERT_ORDER = ["schools", "employees", "pic_availabilities", "test_types", "treatment_types", "clients", "client_details", "appointments", "client_assessments", "treatment_plans", "treatment_programs", "targeted_behaviors", "treatment_sessions"];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const dryRun = process.env.SEED_DRY_RUN === "1";
    const transaction = await queryInterface.sequelize.transaction();
    try {
      const data = await buildData(queryInterface, transaction);
      for (const table of INSERT_ORDER) {
        if (data[table].length) await queryInterface.bulkInsert(table, data[table], { transaction });
        console.log(`  ${table}: ${data[table].length}`);
      }
      if (dryRun) {
        await transaction.rollback();
        console.log("SEED_DRY_RUN=1: rolled back, nothing was saved.");
        return;
      }
      // Explicit ids were inserted, so move each id sequence past them.
      for (const table of INSERT_ORDER) {
        await queryInterface.sequelize.query(`SELECT setval(pg_get_serial_sequence('"${table}"', 'id'), (SELECT COALESCE(MAX(id), 1) FROM "${table}"))`, { transaction });
      }
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    const { Op } = Sequelize;
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // Deleting clients cascades to their details, appointments, assessments, plans, programs, targets and sessions.
      const guardianEmails = CLIENTS.map((c) => emailOf(c[7]));
      await queryInterface.bulkDelete("clients", { guardian_email: { [Op.in]: guardianEmails } }, { transaction });
      // Deleting employees cascades to their availability.
      await queryInterface.bulkDelete("employees", { email: { [Op.in]: EMPLOYEES.map((e) => e.email) } }, { transaction });
      await queryInterface.bulkDelete("schools", { name: { [Op.in]: SCHOOLS.map((s) => s.name) } }, { transaction });
      await queryInterface.bulkDelete("test_types", { name: { [Op.in]: Object.values(TEST_TYPES).map((t) => t.name) } }, { transaction });
      await queryInterface.bulkDelete("treatment_types", { name: { [Op.in]: Object.values(TREATMENTS).map((t) => t.name) } }, { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
