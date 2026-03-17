// Health Insurance Scheme Data for Indian Gig Workers
export interface InsuranceScheme {
  id: string;
  name: string;
  fullName: string;
  type: "health" | "life" | "accident";
  coverage: string;
  premium: string;
  eligibility: string;
  maxIncomeMonthly: number; // INR — used for eligibility check
  benefits: string[];
  applyUrl: string;
  govTag: string;
  emoji: string;
}

export const INSURANCE_SCHEMES: InsuranceScheme[] = [
  {
    id: "pmjay",
    name: "PM-JAY",
    fullName: "Pradhan Mantri Jan Arogya Yojana",
    type: "health",
    coverage: "₹5 Lakh / year",
    premium: "Free (Government funded)",
    eligibility: "Low-income families from SECC database",
    maxIncomeMonthly: 15000,
    benefits: [
      "₹5 lakh cashless hospital cover per family per year",
      "Covers 1,500+ medical procedures",
      "Valid at 25,000+ empanelled hospitals",
      "No cap on family size",
    ],
    applyUrl: "https://pmjay.gov.in",
    govTag: "Central Government",
    emoji: "🏥",
  },
  {
    id: "pmsby",
    name: "PMSBY",
    fullName: "Pradhan Mantri Suraksha Bima Yojana",
    type: "accident",
    coverage: "₹2 Lakh (accidental death)",
    premium: "₹20 / year",
    eligibility: "Age 18–70, bank account holder",
    maxIncomeMonthly: 999999,
    benefits: [
      "₹2 lakh for accidental death or full disability",
      "₹1 lakh for partial disability",
      "Annual premium just ₹20",
      "Auto-debit from linked bank account",
    ],
    applyUrl: "https://www.jansuraksha.gov.in",
    govTag: "Central Government",
    emoji: "🛡️",
  },
  {
    id: "pmjjby",
    name: "PMJJBY",
    fullName: "Pradhan Mantri Jeevan Jyoti Bima Yojana",
    type: "life",
    coverage: "₹2 Lakh (life cover)",
    premium: "₹436 / year",
    eligibility: "Age 18–50, bank account holder",
    maxIncomeMonthly: 999999,
    benefits: [
      "₹2 lakh life insurance cover",
      "Covers death from any cause",
      "Annual premium ₹436 via auto-debit",
      "Renewable every year",
    ],
    applyUrl: "https://www.jansuraksha.gov.in",
    govTag: "Central Government",
    emoji: "❤️",
  },
  {
    id: "esic",
    name: "ESIC",
    fullName: "Employees' State Insurance Corporation",
    type: "health",
    coverage: "Medical + sickness + maternity",
    premium: "1.75% of wages (employer pays more)",
    eligibility: "Monthly wages ≤ ₹21,000",
    maxIncomeMonthly: 21000,
    benefits: [
      "Free medical treatment at ESIC hospitals",
      "Sickness benefit: 70% wages for 91 days/year",
      "Maternity benefit: 100% wages for 26 weeks",
      "Disablement and dependant benefits",
    ],
    applyUrl: "https://www.esic.in",
    govTag: "Ministry of Labour",
    emoji: "🏨",
  },
  {
    id: "abyss",
    name: "Ayushman CAPF",
    fullName: "Ayushman Bharat Health Scheme for Gig Workers",
    type: "health",
    coverage: "₹5 Lakh / year",
    premium: "Free for eligible gig workers",
    eligibility: "Registered gig workers with platform companies",
    maxIncomeMonthly: 30000,
    benefits: [
      "₹5 lakh cashless health cover",
      "Covers pre-existing conditions after 1 year",
      "Works at both public and private hospitals",
      "Includes mental health coverage",
    ],
    applyUrl: "https://pmjay.gov.in/scheme/gig-workers",
    govTag: "Central Government",
    emoji: "🤝",
  },
];
