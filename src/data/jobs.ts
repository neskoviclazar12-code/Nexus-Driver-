/**
 * Nexus Driver Solutions — job offers shown on the website.
 *
 * Source: carrier offer letters (Oct 2026).
 * Carrier names, contacts, MC/DOT numbers and exact yard addresses are left out on
 * purpose, so drivers apply through Nexus. The mapping of which job belongs to
 * which carrier is not stored anywhere in this code.
 *
 * To add a job: copy one object, give it a new unique `slug`, fill in the fields.
 * To remove a job: delete its object (or set `active: false`).
 */

export type Position =
  | "Company Driver"
  | "Team Driver"
  | "Independent Contractor"
  | "Lease to Rent"
  | "Lease to Purchase";

export type Division = "Dry Van" | "Reefer" | "Open Deck";

export interface Job {
  slug: string;
  active: boolean;
  title: string;            // job page H1
  carrierLabel: string;     // anonymous carrier description
  positions: Position[];
  divisions: Division[];
  route: string;            // e.g. "OTR · All 48 states"
  headline: string;         // main pay line on cards
  avgWeekly?: string;       // average weekly take-home/pay, only when the offer states it
  homeTime: string;
  truck: string;
  minExperience: string;
  summary: string;          // 1–2 sentence short description
  rates?: { label: string; value: string }[];
  sections: { title: string; items: string[] }[];
  datePosted: string;       // YYYY-MM-DD
  region: string;           // for structured data
}

export const jobs: Job[] = [
  {
    slug: "otr-dry-van-company-driver-up-to-80-cpm",
    active: true,
    title: "OTR Dry Van Company Driver: Up to 80 CPM Solo, 90 CPM Team",
    carrierLabel: "Midwest dry van carrier",
    positions: ["Company Driver", "Team Driver"],
    divisions: ["Dry Van"],
    route: "OTR · Midwest, South & Southeast",
    headline: "Up to 80 CPM solo",
    avgWeekly: "$1,800–$2,500",
    homeTime: "3 weeks out / 1 week home",
    truck: "2021–2027 Volvo & Freightliner, automatic",
    minExperience: "3 years CDL-A / OTR",
    summary:
      "No-touch dry van freight with a $1,800 weekly guarantee and no escrow. Solo or team, 3 weeks out and a full week home.",
    rates: [
      { label: "Solo", value: "Up to $0.80 CPM" },
      { label: "Team", value: "Up to $0.90 CPM" },
      { label: "Weekly guarantee", value: "$1,800 (or $0.80 CPM if not met)" },
    ],
    sections: [
      { title: "Pay", items: ["Empty and loaded miles paid", "Detention paid, layover paid when on mileage", "Statement Wednesday, ACH the next Wednesday", "1099 position"] },
      { title: "Home time & routes", items: ["3 full weeks out, 1 week home", "Driver can take the truck home", "100% no-touch freight", "Night driving may be required"] },
      { title: "Truck", items: ["2021–2027 Volvo & Freightliner, automatic", "53' dry van, governed 68–70 mph", "Fridge and A/C (no microwave, no APU)", "Fuel cards and I-Pass provided"] },
      { title: "Requirements", items: ["3+ years CDL-A / OTR, age 21+", "Max 3 moving violations and 2 accidents in 3 years", "No DUI/DWI, no 15+ mph speeding, no felony", "DOT medical card valid 1+ year"] },
      { title: "Extras", items: ["No escrow", "Cash advances $200/week", "Clean inspection bonus $100–$300", "Pets and passengers 18+ allowed", "Orientation flight covered"] },
    ],
    datePosted: "2026-10-01",
    region: "US",
  },
  {
    slug: "otr-1099-driver-dry-van-reefer-open-deck-up-to-1-cpm",
    active: true,
    title: "OTR 1099 Driver: Dry Van, Reefer, Open Deck & Team, Up to $1 CPM",
    carrierLabel: "Illinois-based OTR carrier",
    positions: ["Independent Contractor", "Team Driver"],
    divisions: ["Dry Van", "Reefer", "Open Deck"],
    route: "OTR · All 48 states",
    headline: "Up to $1.00 CPM team",
    homeTime: "3+ weeks out, 1 day off per week on the road",
    truck: "2025–2026 Volvo & Freightliner",
    minExperience: "12 months OTR",
    summary:
      "$1,000 sign-on bonus, new 2025–2026 equipment and a 3,500-mile weekly minimum. Choose cents per mile or 30% of gross.",
    rates: [
      { label: "Dry Van", value: "Up to 75 CPM or 30% of gross" },
      { label: "Reefer", value: "Up to 78 CPM or 30% of gross" },
      { label: "Open Deck", value: "Up to 80 CPM or 30% of gross" },
      { label: "Team Dry Van", value: "Up to $1.00 CPM or 30% of gross" },
    ],
    sections: [
      { title: "Pay", items: ["$1,000 sign-on bonus", "3,500+ miles per week minimum", "Weekly pay: statement Tuesday, direct deposit Thursday", "Cash advance up to $200", "Detention $20/hr after 3 hours, layover from day 2"] },
      { title: "Home time", items: ["Minimum 3 weeks out (4 preferred)", "1 day off earned per week on the road", "45+ days out: up to $150 home-time reimbursement", "Keep the truck up to 5 days at home"] },
      { title: "Truck", items: ["2025–2026 Volvo & Freightliner and trailers", "Fridge, microwave, inverter, APU", "Forward-facing camera, governed 73 mph", "Swift ELD, Comdata fuel card with discount"] },
      { title: "Requirements", items: ["Valid CDL (no non-domicile / limited-term)", "12+ months OTR, willing to run all 48", "Max 2 violations in 12 months, max 1 accident in 12 months", "No felonies, DUI or SAP; no failed tests in 3 years"] },
      { title: "Costs to know", items: ["Escrow $1,250 (van) / $1,500 (open deck)", "Occupational insurance $179/month"] },
    ],
    datePosted: "2026-10-01",
    region: "IL",
  },
  {
    slug: "lease-to-rent-dry-van-reefer-open-deck-88-percent",
    active: true,
    title: "Lease to Rent: 88% of Gross, Dry Van, Reefer & Open Deck",
    carrierLabel: "Illinois-based OTR carrier",
    positions: ["Lease to Rent", "Lease to Purchase"],
    divisions: ["Dry Van", "Reefer", "Open Deck"],
    route: "OTR · All 48 states",
    headline: "88% of gross",
    homeTime: "3+ weeks out, 1 day off per week on the road",
    truck: "2025–2026 Volvo & Freightliner",
    minExperience: "12 months OTR",
    summary:
      "Keep 88% of the gross with no forced dispatch, a 3,500-mile weekly guarantee and a $1,000 sign-on bonus. Lease to purchase is also available.",
    rates: [
      { label: "Driver share", value: "88% of gross (12% dispatch)" },
      { label: "Truck payment", value: "$1,350/week" },
      { label: "Total fixed weekly charges", value: "$2,384/week (excl. dispatch fee)" },
    ],
    sections: [
      { title: "Why drivers pick it", items: ["$1,000 sign-on bonus", "3,500+ miles per week guaranteed", "All actual miles paid, address to address", "No forced dispatch: you choose your loads", "Lease to purchase available"] },
      { title: "Weekly costs", items: ["Truck $1,350 · Trailer & maintenance $390", "Liability & cargo $260 · Physical damage $200", "Equipment, IFTA, trip pak, NTL, admin & bank fees $184", "Escrow $2,500 · Occupational insurance $179/month"] },
      { title: "Truck", items: ["2025–2026 Volvo & Freightliner, fridge, microwave, inverter, APU", "On-site shop, free lunch during maintenance", "Free car parking and 24/7 drivers lounge"] },
      { title: "Requirements", items: ["Valid Class A CDL, 12+ months OTR", "Max 2 violations and 1 accident in 12 months", "No DUI, SAP or failed tests in 3 years"] },
    ],
    datePosted: "2026-10-01",
    region: "IL",
  },
  {
    slug: "otr-dry-van-company-driver-70-80-cpm-new-cascadia",
    active: true,
    title: "OTR Dry Van Company Driver: 70–80 CPM, 2025–2027 Cascadia",
    carrierLabel: "Chicago-area dry van carrier",
    positions: ["Company Driver", "Team Driver"],
    divisions: ["Dry Van"],
    route: "OTR · No West Coast",
    headline: "70–80 CPM solo",
    avgWeekly: "$2,000–$3,000",
    homeTime: "3 weeks out, 1 day home per week out",
    truck: "2025–2027 Freightliner Cascadia, automatic",
    minExperience: "2 years CDL-A",
    summary:
      "USPS and auto parts freight in new Cascadias. No escrow, Friday direct deposit, and cash advances up to $400.",
    rates: [
      { label: "Solo", value: "70–80 CPM" },
      { label: "Team", value: "Fixed pay $5,000–$5,600" },
    ],
    sections: [
      { title: "Pay", items: ["Direct deposit every Friday", "Empty and loaded miles paid", "Layover and detention paid", "1099 position"] },
      { title: "Home time & routes", items: ["3 weeks out (Florida routes 4 weeks)", "1 day home per week out", "No West Coast, 24/7 dispatch", "Driver can take the truck home"] },
      { title: "Truck", items: ["2025–2027 Cascadia, automatic, 53' dry van", "Governed 70/72 mph", "Fridge, A/C, APU, microwave on request", "Pilot fuel card and toll support"] },
      { title: "Requirements", items: ["2+ years CDL-A with dry van experience, age 23+", "Clean Clearinghouse, no DUI/DWI, no SAP", "Max 1 moving violation"] },
      { title: "Extras", items: ["No escrow", "Safety bonus $200–$300, referral bonus $1,000", "Orientation flight, hotel and Uber covered", "Small pets and riders 18+ allowed"] },
    ],
    datePosted: "2026-10-01",
    region: "IL",
  },
  {
    slug: "otr-dry-van-company-team-driver-up-to-83-cpm",
    active: true,
    title: "OTR Dry Van Company & Team Driver: Up to 83 CPM, Team to $1.05",
    carrierLabel: "Chicago-area dry van carrier",
    positions: ["Company Driver", "Team Driver"],
    divisions: ["Dry Van"],
    route: "OTR · All 48 states + USPS mail",
    headline: "Up to 83 CPM solo",
    homeTime: "4 weeks out / 1 week home",
    truck: "2021–2025 automatic trucks",
    minExperience: "Ask your recruiter",
    summary:
      "Empty and loaded miles paid, team pay that climbs to $1.05 per mile, and up to $15,000 in driver bonuses.",
    rates: [
      { label: "Solo", value: "76 CPM (Indianapolis) / 83 CPM (Jersey City)" },
      { label: "Team", value: "95 CPM → $1.00 after 3 mo → $1.05 after 6 mo" },
      { label: "Bonuses", value: "Up to $15,000" },
    ],
    sections: [
      { title: "Pay", items: ["Empty, loaded, layover and detention paid", "Statement Friday, direct deposit Tuesday", "1099 position, no contract"] },
      { title: "Bonuses", items: ["Sign-on $1,000 / $1,500 / $2,500 at 1, 3 & 6 months", "Safety $2,000/year, DOT inspection $300–$500", "Referral $1,500, quarterly performance bonus"] },
      { title: "Routes & home time", items: ["All 48 states + USPS mail loads", "99% no-touch freight, 24/7 dispatch (Spanish available)", "4 weeks out / 1 week home"] },
      { title: "Truck", items: ["Automatic 2021–2025, 53' dry van, governed 70 mph", "ELD, fridge, microwave, A/C", "Fuel card, iPass & PrePass, pets allowed"] },
      { title: "Costs to know", items: ["$1,000 deposit ($100/week over 10 weeks)", "$300 refundable tablet deposit", "No medical or benefits; flight, hotel & Uber covered"] },
    ],
    datePosted: "2026-10-01",
    region: "IL",
  },
  {
    slug: "lease-to-rent-dry-van-900-week-usps",
    active: true,
    title: "Lease to Rent Dry Van: $900/Week Truck, USPS Mail Loads",
    carrierLabel: "Chicago-area dry van carrier",
    positions: ["Lease to Rent"],
    divisions: ["Dry Van"],
    route: "OTR · All 48 states + USPS mail",
    headline: "$900/wk truck rent",
    homeTime: "4 weeks out / 1 week home",
    truck: "Fully equipped, ELD included",
    minExperience: "Ask your recruiter",
    summary:
      "A simple setup: $900 a week for the truck, a 22% per-load fee that covers trailer, insurance and ELD, plus USPS mail loads for extra miles.",
    rates: [
      { label: "Truck rent", value: "$900/week" },
      { label: "Maintenance", value: "$0.15 per mile" },
      { label: "Per-load fee", value: "22% (trailer, cargo & liability, occupational insurance, ELD, TripPak)" },
    ],
    sections: [
      { title: "Pay", items: ["Weekly pay: statement Friday, payday Tuesday", "First week held, cash advance available", "Fuel card + $0.10/gal weekly fuel rebate", "1099 independent contractor"] },
      { title: "Costs to know", items: ["Driver deposit $2,500 ($250/week over 10 weeks)", "Tablet deposit $300, refunded on return", "IFTA billed quarterly", "Pre-hire expenses (travel, background check) are on the driver"] },
      { title: "Truck", items: ["ELD, fridge, microwave, A/C", "Pet friendly, companion may ride along", "Tools and scales are the driver's responsibility"] },
    ],
    datePosted: "2026-10-01",
    region: "IL",
  },
  {
    slug: "otr-dry-van-company-driver-70-75-cpm",
    active: true,
    title: "OTR Dry Van Company Driver: 70–75 CPM, $2,500 Average Week",
    carrierLabel: "Indiana-based dry van carrier",
    positions: ["Company Driver"],
    divisions: ["Dry Van"],
    route: "OTR · Midwest, Texas & South",
    headline: "70–75 CPM solo",
    avgWeekly: "$2,500",
    homeTime: "3.5 weeks out / 1.5 weeks home",
    truck: "2022–2023 Freightliner Cascadia, automatic",
    minExperience: "2 years CDL-A",
    summary:
      "No-touch freight, a week and a half at home every run, and travel covered both ways. Dispatch speaks English and Serbian.",
    rates: [{ label: "Solo", value: "70–75 CPM (no team)" }],
    sections: [
      { title: "Pay", items: ["Empty and loaded miles paid", "Layover and detention paid", "Statement Tuesday, 1099 position", "Cash advances $1,000–$2,000"] },
      { title: "Home time & routes", items: ["3.5 weeks out / 1.5 weeks home", "100% no-touch freight, 24/7 dispatch", "Driver can take the truck home"] },
      { title: "Truck", items: ["2022–2023 Cascadia, automatic, governed 70 mph", "Fridge, microwave, A/C, ELD & GPS", "Fuel card: Love's, TA, PrePass", "Pets and riders allowed"] },
      { title: "Requirements", items: ["2+ years CDL-A with OTR and dry van experience, age 21+", "Max 2 moving violations / 1 accident in 2 years", "No DUI, SAP, failed tests or criminal history"] },
      { title: "Extras & costs", items: ["Flights to orientation and for home time, hotel, Uber covered", "Safety bonus $100–$300, referral $500", "Escrow $2,500, no contract"] },
    ],
    datePosted: "2026-10-01",
    region: "IN",
  },
  {
    slug: "otr-reefer-open-deck-dry-van-driver-up-to-90-cpm",
    active: true,
    title: "OTR Open Deck, Reefer & Dry Van Driver: Up to 90 CPM or 30% of Gross",
    carrierLabel: "Illinois-based OTR carrier",
    positions: ["Company Driver"],
    divisions: ["Open Deck", "Reefer", "Dry Van"],
    route: "OTR · All 48 states",
    headline: "Up to 90 CPM",
    avgWeekly: "$2,200–$3,000+",
    homeTime: "3 weeks out / 3 days home (or 4 / 4)",
    truck: "2022–2026 Freightliner Cascadia, automatic",
    minExperience: "8 months CDL-A",
    summary:
      "Open deck, reefer and dry van, all miles paid, with extra pay for stops, tarps, detention and layovers. Only 8 months of experience needed.",
    rates: [
      { label: "Open Deck (flatbed / stepdeck)", value: "Up to 90 CPM or 30% of gross" },
      { label: "Reefer", value: "Up to 82 CPM or 28% of gross" },
      { label: "Dry Van", value: "Up to 80 CPM or 28% of gross" },
    ],
    sections: [
      { title: "Pay", items: ["All miles paid, loaded and empty", "Weekly direct deposit", "Extra stop $50 · Tarp $50", "Detention $25/hr (3 hr min) · Layover $100/24 hrs"] },
      { title: "Home time", items: ["3 weeks out = 3 days home", "4 weeks out = 4 days home (reefer, FL/NA)", "Passengers 18+ and pets allowed"] },
      { title: "Truck", items: ["2022–2026 Cascadia, automatic, governed 68 mph", "APU, fridge, inverter, dual dash cameras", "Samsara ELD, Love's fuel card, I-Pass"] },
      { title: "Requirements", items: ["8+ months CDL-A, valid medical card, FEIN/EIN", "Max 1 at-fault accident and 3 moving violations in 3 years", "No SAP, DUI, criminal record or truck abandonment"] },
      { title: "Extras & costs", items: ["DOT inspection bonus $100–$500", "Referral $1,000–$1,500", "Flights, hotel and bus covered, rental car reimbursed", "Escrow $1,250 over 5 weeks, occupational insurance $179/month"] },
    ],
    datePosted: "2026-10-01",
    region: "IL",
  },
  {
    slug: "otr-dry-van-company-driver-75-cpm",
    active: true,
    title: "OTR Dry Van Company Driver: 75 CPM, No Downtown Deliveries",
    carrierLabel: "Chicago-area dry van carrier",
    positions: ["Company Driver"],
    divisions: ["Dry Van"],
    route: "OTR · Midwest, East Coast, South & Southeast",
    headline: "75 CPM",
    avgWeekly: "$2,200–$2,600",
    homeTime: "2 weeks out = 2 days off, 6 weeks = full week",
    truck: "2021–2024 Cascadia & Volvo, APU",
    minExperience: "Verifiable CDL-A experience",
    summary:
      "Dry van with no West Coast runs and no downtown pickups in Boston, NYC, NJ or Philadelphia. Paid weekly, and no LLC required.",
    rates: [{ label: "Dry Van", value: "75 CPM" }],
    sections: [
      { title: "Pay", items: ["3,000–3,500 average weekly miles", "Paid weekly, direct deposit Wednesday", "Cash advance up to $300/week", "Holiday bonus $100, loss day pay $150", "1099, personal or business account"] },
      { title: "Home time & routes", items: ["2 weeks out = 2 days off, 3 weeks = 3 days", "6 weeks out = a full week off", "No West Coast, avoids Florida (North FL OK)"] },
      { title: "Truck", items: ["2021–2024 Cascadia & Volvo", "APU, inverter, mini-fridge, microwave", "Forward-facing cameras only (no driver-facing)", "Pilot & Flying J fuel cards"] },
      { title: "Requirements", items: ["Verifiable CDL-A experience, clean recent record", "No DUI/DWI", "Clean Clearinghouse and pre-hire drug test"] },
      { title: "Orientation", items: ["1-day orientation Mon–Fri, includes road test", "Transportation and accommodation covered"] },
    ],
    datePosted: "2026-10-01",
    region: "IL",
  },
  {
    slug: "lease-to-purchase-dry-van-88-12",
    active: true,
    title: "Lease to Purchase Dry Van: 88/12 Split, $750/Week Truck",
    carrierLabel: "Dry van carrier",
    positions: ["Lease to Purchase"],
    divisions: ["Dry Van"],
    route: "Mostly short runs",
    headline: "88% / 12% split",
    homeTime: "3 weeks out / 3 days home",
    truck: "2022–2023 Cascadia / International ProStar",
    minExperience: "2 years CDL-A",
    summary:
      "Own your truck on an 88/12 split with a $750 weekly payment, mostly short runs and no forced dispatch. USPS freight opens up for drivers who perform.",
    rates: [
      { label: "Split", value: "88% driver / 12%" },
      { label: "Truck payment", value: "$750/week" },
      { label: "Average weekly miles", value: "3,500" },
    ],
    sections: [
      { title: "Pay", items: ["Weekly pay (Wednesday to Wednesday)", "1–2 weeks hold check, cash advance $150/week", "Detention and layover paid"] },
      { title: "Weekly costs", items: ["Insurance (AL & cargo) $350 · Trailer $300 · ELD $100", "Escrow $1,500 ($250/week)", "Bobtail $40/month, occupational accident $160/month", "IFTA approx. $250/quarter"] },
      { title: "Routes & home time", items: ["Mostly short runs, non-forced dispatch", "3 weeks out / 3 days home", "Driver can take the truck home"] },
      { title: "Requirements", items: ["2+ years CDL-A, age 21+, clean driving record", "No DUI/DWI, Clearinghouse required", "SAP drivers considered, ask your recruiter"] },
    ],
    datePosted: "2026-10-01",
    region: "US",
  },
];

/** Hero "featured" cards. Each points to a real job above. */
export const featured = [
  { slug: "otr-reefer-open-deck-dry-van-driver-up-to-90-cpm", head: "Reefer · Company Driver", rate: "Up to 82 CPM", meta: "OTR · 4 weeks out / 4 days home" },
  { slug: "otr-reefer-open-deck-dry-van-driver-up-to-90-cpm", head: "Open Deck · Company Driver", rate: "Up to 90 CPM", meta: "Flatbed / Stepdeck · 3 weeks out / 3 days home" },
  { slug: "otr-dry-van-company-team-driver-up-to-83-cpm", head: "Dry Van · Company Driver", rate: "Up to 83 CPM", meta: "All 48 + USPS loads · 4 weeks out / 1 week home" },
];

export const activeJobs = () => jobs.filter((j) => j.active);
export const jobBySlug = (slug: string) => jobs.find((j) => j.slug === slug);
