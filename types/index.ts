export interface PointsBreakdown {
  timeCommitment: number; // Hours * 15 points per hour
  difficulty: number; // 1-5 scale * 5 points per level
  sdgImpact: number; // Always 0 - SDG count no longer contributes to points
  total: number;
  explanation?: string; // Optional custom explanation
}

export interface SDGActivity {
  id: string;
  title: string;
  category: "coursework" | "society" | "event";
  sdgGoals: number[];
  points: number;
  date: string;
  description: string;
  pointsBreakdown?: PointsBreakdown;
}

export interface AvailableActivity {
  id: string;
  title: string;
  category: "coursework" | "society" | "event";
  sdgGoals: number[];
  points: number;
  startDate: string;
  endDate?: string;
  description: string;
  organizer: string;
  location: string;
  capacity?: number;
  enrolled?: number;
  imageUrl?: string;
  pointsBreakdown?: PointsBreakdown;
}

export interface Student {
  id: string;
  name: string;
  avatar: string;
  faculty: string;
  totalPoints: number;
  weeklyPoints?: number;
  monthlyPoints?: number;
  activities: SDGActivity[];
  rank?: number;
  badges?: Badge[];
  vouchers?: Voucher[];
  isFriend?: boolean;
  followedUsers?: string[]; // Users this person is following
  followers?: string[]; // Users who follow this person
  registeredEvents?: UserEvent[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  earned: boolean;
  earnedDate?: string;
  requirement: string;
}

export interface Voucher {
  id: string;
  title: string;
  description: string;
  points: number;
  qrCode: string;
  expiryDate: string;
  status: "active" | "used" | "expired";
  usedDate?: string;
  merchantName: string;
  usageNote: string;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  category: "discount" | "food" | "merchandise" | "experience";
  pointsRequired: number;
  stock: number;
  expiryDate: string;
  imageUrl: string;
  merchantName: string;
  usageNote: string;
}

export interface EventFeedback {
  overallRating: number;
  contentRating: number;
  organizationRating: number;
  speakersRating: number;
  venueRating: number;
  likedMost: string;
  improvements: string;
  wouldRecommend: boolean;
  additionalComments: string;
  submittedDate: string;
}

export interface UserEvent {
  id: string;
  activityId: string;
  title: string;
  category: "event";
  sdgGoals: number[];
  points: number;
  startDate: string;
  description: string;
  organizer: string;
  location: string;
  imageUrl?: string;
  status: "registered" | "attended" | "cancelled";
  registeredDate: string;
  attendedDate?: string;
  feedback?: EventFeedback;
}

export const SDG_GOALS = [
  {
    number: 1,
    name: "No Poverty",
    color: "#E5243B",
    textColor: "white" as const,
  },
  {
    number: 2,
    name: "Zero Hunger",
    color: "#DDA63A",
    textColor: "white" as const,
  },
  {
    number: 3,
    name: "Good Health and Well-being",
    color: "#4C9F38",
    textColor: "white" as const,
  },
  {
    number: 4,
    name: "Quality Education",
    color: "#C5192D",
    textColor: "white" as const,
  },
  {
    number: 5,
    name: "Gender Equality",
    color: "#FF3A21",
    textColor: "white" as const,
  },
  {
    number: 6,
    name: "Clean Water and Sanitation",
    color: "#26BDE2",
    textColor: "white" as const,
  },
  {
    number: 7,
    name: "Affordable and Clean Energy",
    color: "#FCC30B",
    textColor: "black" as const,
  },
  {
    number: 8,
    name: "Decent Work and Economic Growth",
    color: "#A21942",
    textColor: "white" as const,
  },
  {
    number: 9,
    name: "Industry, Innovation and Infrastructure",
    color: "#FD6925",
    textColor: "white" as const,
  },
  {
    number: 10,
    name: "Reduced Inequalities",
    color: "#DD1367",
    textColor: "white" as const,
  },
  {
    number: 11,
    name: "Sustainable Cities and Communities",
    color: "#FD9D24",
    textColor: "white" as const,
  },
  {
    number: 12,
    name: "Responsible Consumption and Production",
    color: "#BF8B2E",
    textColor: "white" as const,
  },
  {
    number: 13,
    name: "Climate Action",
    color: "#3F7E44",
    textColor: "white" as const,
  },
  {
    number: 14,
    name: "Life Below Water",
    color: "#0A97D9",
    textColor: "white" as const,
  },
  {
    number: 15,
    name: "Life on Land",
    color: "#56C02B",
    textColor: "white" as const,
  },
  {
    number: 16,
    name: "Peace, Justice and Strong Institutions",
    color: "#00689D",
    textColor: "white" as const,
  },
  {
    number: 17,
    name: "Partnerships for the Goals",
    color: "#19486A",
    textColor: "white" as const,
  },
];
