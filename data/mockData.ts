import { Student, AvailableActivity, Reward } from "@/types";

export const currentUser: Student = {
  id: "user-1",
  name: "Sarah Chen",
  avatar:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
  faculty: "UNSW Business School",
  totalPoints: 2850,
  weeklyPoints: 450,
  monthlyPoints: 1200,
  followedUsers: ["user-2", "user-3", "user-5", "user-7", "user-10"],
  followers: ["user-4", "user-6", "user-8", "user-9", "user-11", "user-12"],
  activities: [
    {
      id: "act-1",
      title: "Sustainable Business Practices Course",
      category: "coursework",
      sdgGoals: [8, 12, 13],
      points: 500,
      date: "2024-09-15",
      description:
        "Completed coursework on sustainable business models and circular economy principles",
    },
    {
      id: "act-2",
      title: "Environmental Society President",
      category: "society",
      sdgGoals: [13, 14, 15],
      points: 800,
      date: "2024-08-20",
      description:
        "Led campus sustainability initiatives and organized weekly clean-up drives",
    },
    {
      id: "act-3",
      title: "Climate Action Summit",
      category: "event",
      sdgGoals: [13, 17],
      points: 300,
      date: "2024-10-05",
      description:
        "Attended and presented at the university climate action summit",
    },
    {
      id: "act-4",
      title: "Gender Equality Workshop Series",
      category: "event",
      sdgGoals: [5, 10],
      points: 250,
      date: "2024-09-28",
      description:
        "Participated in 5-week workshop series on gender equality and inclusion",
    },
    {
      id: "act-5",
      title: "Community Volunteering",
      category: "society",
      sdgGoals: [1, 2, 3],
      points: 400,
      date: "2024-10-12",
      description:
        "Volunteered at local food bank and community health programs",
    },
    {
      id: "act-6",
      title: "Renewable Energy Research Project",
      category: "coursework",
      sdgGoals: [7, 13],
      points: 600,
      date: "2024-10-18",
      description:
        "Research project on solar energy implementation in rural communities",
    },
  ],
  badges: [
    {
      id: "badge-1",
      name: "Climate Champion",
      description: "Complete 5 climate-related activities",
      icon: "🌍",
      color: "#3F7E44",
      earned: true,
      earnedDate: "2024-10-05",
      requirement: "5 climate activities",
    },
    {
      id: "badge-2",
      name: "First Steps",
      description: "Register for your first SDG activity",
      icon: "🎯",
      color: "#4C9F38",
      earned: true,
      earnedDate: "2024-08-20",
      requirement: "1 activity",
    },
    {
      id: "badge-3",
      name: "Point Collector",
      description: "Earn 2000+ SDG points",
      icon: "⭐",
      color: "#FCC30B",
      earned: true,
      earnedDate: "2024-09-28",
      requirement: "2000 points",
    },
    {
      id: "badge-4",
      name: "Diversity Advocate",
      description: "Participate in activities across all 17 SDGs",
      icon: "🌈",
      color: "#DD1367",
      earned: false,
      requirement: "All 17 SDGs",
    },
    {
      id: "badge-5",
      name: "Top 10",
      description: "Reach top 10 on the leaderboard",
      icon: "🏆",
      color: "#FD9D24",
      earned: true,
      earnedDate: "2024-10-12",
      requirement: "Top 10 rank",
    },
    {
      id: "badge-6",
      name: "Social Leader",
      description: "Join 3+ student societies",
      icon: "👥",
      color: "#A21942",
      earned: false,
      requirement: "3 societies",
    },
    {
      id: "badge-7",
      name: "Event Enthusiast",
      description: "Attend 10 SDG events",
      icon: "📅",
      color: "#56C02B",
      earned: false,
      requirement: "10 events",
    },
    {
      id: "badge-8",
      name: "Academic Excellence",
      description: "Complete 5 SDG coursework modules",
      icon: "📚",
      color: "#C5192D",
      earned: false,
      requirement: "5 courses",
    },
  ],
  registeredEvents: [
    {
      id: "user-event-1",
      activityId: "avail-2",
      title: "Water Conservation Workshop",
      category: "event",
      sdgGoals: [6, 14],
      points: 200,
      startDate: "2025-11-05",
      description:
        "Learn practical water conservation techniques and the importance of clean water access.",
      organizer: "Environmental Science Society",
      location: "Science Building Lab 2",
      imageUrl:
        "https://images.unsplash.com/photo-1660795308424-8ed1ccdef52a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXN0YWluYWJpbGl0eSUyMGVudmlyb25tZW50JTIwd29ya3Nob3B8ZW58MXx8fHwxNzYxMjA1NDk0fDA&ixlib=rb-4.1.0&q=80&w=1080",
      status: "registered",
      registeredDate: "2024-10-20",
    },
    {
      id: "user-event-2",
      activityId: "avail-4",
      title: "Global Health & Wellbeing Seminar",
      category: "event",
      sdgGoals: [3, 10],
      points: 300,
      startDate: "2025-11-12",
      description:
        "International speakers discuss global health challenges, healthcare access, and reducing health inequalities.",
      organizer: "Medical School",
      location: "Main Auditorium",
      imageUrl:
        "https://images.unsplash.com/photo-1759496434742-771c92e66103?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25mZXJlbmNlJTIwZXZlbnQlMjBwcmVzZW50YXRpb258ZW58MXx8fHwxNzYxMTg3NDU5fDA&ixlib=rb-4.1.0&q=80&w=1080",
      status: "registered",
      registeredDate: "2024-10-22",
    },
    {
      id: "user-event-3",
      activityId: "avail-6",
      title: "Gender Equality in STEM Panel",
      category: "event",
      sdgGoals: [5, 10, 4],
      points: 250,
      startDate: "2025-10-30",
      description: "Panel discussion featuring women leaders in STEM fields.",
      organizer: "Women in STEM Society",
      location: "Student Center Hall B",
      imageUrl:
        "https://images.unsplash.com/photo-1758270705518-b61b40527e76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwY29sbGFib3JhdGlvbiUyMHN0dWRlbnRzfGVufDF8fHx8MTc2MTIwNTQ5NHww&ixlib=rb-4.1.0&q=80&w=1080",
      status: "registered",
      registeredDate: "2024-10-15",
    },
    {
      id: "user-event-4",
      activityId: "avail-9",
      title: "Fair Trade & Ethical Consumption",
      category: "event",
      sdgGoals: [12, 8, 1],
      points: 200,
      startDate: "2025-11-08",
      description:
        "Interactive workshop on responsible consumption and fair trade practices.",
      organizer: "Business Ethics Club",
      location: "Business School Atrium",
      imageUrl:
        "https://images.unsplash.com/photo-1758270705518-b61b40527e76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwY29sbGFib3JhdGlvbiUyMHN0dWRlbnRzfGVufDF8fHx8MTc2MTIwNTQ5NHww&ixlib=rb-4.1.0&q=80&w=1080",
      status: "registered",
      registeredDate: "2024-10-25",
    },
    {
      id: "user-event-5",
      activityId: "past-1",
      title: "Climate Action Summit",
      category: "event",
      sdgGoals: [13, 17],
      points: 300,
      startDate: "2024-10-05",
      description:
        "University climate action summit with presentations and workshops.",
      organizer: "Environmental Society",
      location: "Main Conference Hall",
      imageUrl:
        "https://images.unsplash.com/photo-1759496434742-771c92e66103?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25mZXJlbmNlJTIwZXZlbnQlMjBwcmVzZW50YXRpb258ZW58MXx8fHwxNzYxMTg3NDU5fDA&ixlib=rb-4.1.0&q=80&w=1080",
      status: "attended",
      registeredDate: "2024-09-25",
      attendedDate: "2024-10-05",
      feedback: {
        overallRating: 5,
        contentRating: 5,
        organizationRating: 5,
        speakersRating: 5,
        venueRating: 4,
        likedMost:
          "The keynote speakers were incredibly inspiring and shared actionable insights on climate change mitigation.",
        improvements:
          "Could use better ventilation in the main hall during peak hours.",
        wouldRecommend: true,
        additionalComments:
          "Excellent event! The speakers were inspiring and I learned a lot about practical climate action steps. Would love to see more events like this.",
        submittedDate: "2024-10-06",
      },
    },
    {
      id: "user-event-6",
      activityId: "past-2",
      title: "Gender Equality Workshop Series",
      category: "event",
      sdgGoals: [5, 10],
      points: 250,
      startDate: "2024-09-28",
      description: "5-week workshop series on gender equality and inclusion.",
      organizer: "Diversity & Inclusion Office",
      location: "Student Center",
      imageUrl:
        "https://images.unsplash.com/photo-1758270705518-b61b40527e76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwY29sbGFib3JhdGlvbiUyMHN0dWRlbnRzfGVufDF8fHx8MTc2MTIwNTQ5NHww&ixlib=rb-4.1.0&q=80&w=1080",
      status: "attended",
      registeredDate: "2024-09-15",
      attendedDate: "2024-09-28",
      feedback: {
        overallRating: 4,
        contentRating: 5,
        organizationRating: 4,
        speakersRating: 4,
        venueRating: 4,
        likedMost:
          "The panel discussions were really engaging and I appreciated hearing diverse perspectives on gender equality.",
        improvements:
          "Would love to see more hands-on activities and case studies to complement the theoretical content.",
        wouldRecommend: true,
        additionalComments:
          "Very informative sessions with great discussion opportunities. Overall a valuable experience that has changed my perspective.",
        submittedDate: "2024-10-10",
      },
    },
    {
      id: "user-event-7",
      activityId: "past-3",
      title: "Sustainable Food Systems Forum",
      category: "event",
      sdgGoals: [2, 12, 13],
      points: 200,
      startDate: "2024-09-15",
      description: "Forum on sustainable agriculture and food security.",
      organizer: "Agriculture Department",
      location: "Science Building Auditorium",
      imageUrl:
        "https://images.unsplash.com/photo-1660795308424-8ed1ccdef52a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXN0YWluYWJpbGl0eSUyMGVudmlyb25tZW50JTIwd29ya3Nob3B8ZW58MXx8fHwxNzYxMjA1NDk0fDA&ixlib=rb-4.1.0&q=80&w=1080",
      status: "attended",
      registeredDate: "2024-09-01",
      attendedDate: "2024-09-15",
      feedback: {
        overallRating: 4,
        contentRating: 4,
        organizationRating: 4,
        speakersRating: 5,
        venueRating: 3,
        likedMost:
          "The expert panel discussion on regenerative agriculture was fascinating. Real-world case studies were particularly valuable.",
        improvements:
          "Could use better catering options - more sustainable food choices would align with the event theme.",
        wouldRecommend: true,
        additionalComments:
          "Great networking opportunity with agriculture professionals. Would love to see a follow-up event.",
        submittedDate: "2024-09-16",
      },
    },
    {
      id: "user-event-8",
      activityId: "past-4",
      title: "Renewable Energy Innovation Expo",
      category: "event",
      sdgGoals: [7, 9, 13],
      points: 250,
      startDate: "2024-10-20",
      description: "Exhibition showcasing innovative renewable energy solutions and technologies from local startups and research institutions.",
      organizer: "Engineering Faculty",
      location: "Engineering Building Exhibition Hall",
      imageUrl:
        "https://images.unsplash.com/photo-1759496434742-771c92e66103?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25mZXJlbmNlJTIwZXZlbnQlMjBwcmVzZW50YXRpb258ZW58MXx8fHwxNzYxMTg3NDU5fDA&ixlib=rb-4.1.0&q=80&w=1080",
      status: "attended",
      registeredDate: "2024-10-10",
      attendedDate: "2024-10-20",
      // No feedback - can be demoed for feedback feature
    },
  ],
  vouchers: [
    {
      id: "voucher-1",
      title: "20% Off Sustainable Products",
      description: "Discount at EcoStore for eco-friendly products",
      points: 500,
      qrCode: "SDGGO-ECO-2024-001",
      expiryDate: "2025-12-31",
      status: "active",
      merchantName: "Campus EcoStore",
      usageNote: "Show this QR code at checkout. Valid for one purchase.",
    },
    {
      id: "voucher-2",
      title: "Free Coffee at Green Café",
      description: "Complimentary beverage at participating locations",
      points: 200,
      qrCode: "SDGGO-CAFE-2024-002",
      expiryDate: "2025-11-15",
      status: "active",
      merchantName: "Green Café",
      usageNote: "Valid Monday-Friday, 8am-5pm. One per visit.",
    },
    {
      id: "voucher-3",
      title: "Campus Bookstore Voucher",
      description: "$10 off any purchase over $30",
      points: 300,
      qrCode: "SDGGO-BOOK-2024-003",
      expiryDate: "2025-11-05",
      status: "active",
      merchantName: "University Bookstore",
      usageNote: "Minimum purchase $30. Cannot combine with other offers.",
    },
    {
      id: "voucher-4",
      title: "Bike Share Monthly Pass",
      description: "Free month of campus bike sharing",
      points: 800,
      qrCode: "SDGGO-BIKE-2024-004",
      expiryDate: "2024-11-01",
      status: "used",
      usedDate: "2024-10-15",
      merchantName: "Campus Bike Share",
      usageNote: "Activate within 30 days of redemption.",
    },
    {
      id: "voucher-5",
      title: "Reusable Water Bottle",
      description: "Free branded SDGgo! water bottle",
      points: 400,
      qrCode: "SDGGO-BOTTLE-2024-005",
      expiryDate: "2024-10-25",
      status: "expired",
      merchantName: "Student Union",
      usageNote: "Collect from Student Union desk during office hours.",
    },
  ],
};

export const allStudents: Student[] = [
  {
    id: "user-1",
    name: "Sarah Chen",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
    faculty: "UNSW Business School",
    totalPoints: 2850,
    weeklyPoints: 450,
    monthlyPoints: 1200,
    activities: [],
    rank: 1,
    badges: [
      {
        id: "badge-1",
        name: "Climate Champion",
        description: "Complete 5 climate-related activities",
        icon: "🌍",
        color: "#3F7E44",
        earned: true,
        earnedDate: "2024-10-05",
        requirement: "5 climate activities",
      },
      {
        id: "badge-3",
        name: "Point Collector",
        description: "Earn 2000+ SDG points",
        icon: "⭐",
        color: "#FCC30B",
        earned: true,
        earnedDate: "2024-09-28",
        requirement: "2000 points",
      },
      {
        id: "badge-5",
        name: "Top 10",
        description: "Reach top 10 on the leaderboard",
        icon: "🏆",
        color: "#FD9D24",
        earned: true,
        earnedDate: "2024-10-12",
        requirement: "Top 10 rank",
      },
    ],
  },
  {
    id: "user-2",
    name: "Marcus Johnson",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    faculty: "Faculty of Engineering",
    totalPoints: 2720,
    weeklyPoints: 380,
    monthlyPoints: 1150,
    activities: [],
    rank: 2,
    isFriend: true,
    badges: [
      {
        id: "badge-2",
        name: "First Steps",
        description: "Register for your first SDG activity",
        icon: "🎯",
        color: "#4C9F38",
        earned: true,
        earnedDate: "2024-08-20",
        requirement: "1 activity",
      },
      {
        id: "badge-3",
        name: "Point Collector",
        description: "Earn 2000+ SDG points",
        icon: "⭐",
        color: "#FCC30B",
        earned: true,
        earnedDate: "2024-09-15",
        requirement: "2000 points",
      },
    ],
  },
  {
    id: "user-3",
    name: "Aisha Patel",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
    faculty: "Faculty of Science",
    totalPoints: 2680,
    weeklyPoints: 420,
    monthlyPoints: 1100,
    activities: [],
    rank: 3,
    isFriend: true,
    badges: [
      {
        id: "badge-1",
        name: "Climate Champion",
        description: "Complete 5 climate-related activities",
        icon: "🌍",
        color: "#3F7E44",
        earned: true,
        earnedDate: "2024-09-20",
        requirement: "5 climate activities",
      },
      {
        id: "badge-5",
        name: "Top 10",
        description: "Reach top 10 on the leaderboard",
        icon: "🏆",
        color: "#FD9D24",
        earned: true,
        earnedDate: "2024-10-01",
        requirement: "Top 10 rank",
      },
    ],
  },
  {
    id: "user-4",
    name: "Carlos Rodriguez",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
    faculty: "Faculty of Arts, Design & Architecture",
    totalPoints: 2540,
    weeklyPoints: 350,
    monthlyPoints: 980,
    activities: [],
    rank: 4,
  },
  {
    id: "user-5",
    name: "Emma Wilson",
    avatar:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop",
    faculty: "Faculty of Arts, Design & Architecture",
    totalPoints: 2430,
    weeklyPoints: 310,
    monthlyPoints: 920,
    activities: [],
    rank: 5,
    isFriend: true,
    badges: [
      {
        id: "badge-2",
        name: "First Steps",
        description: "Register for your first SDG activity",
        icon: "🎯",
        color: "#4C9F38",
        earned: true,
        earnedDate: "2024-08-15",
        requirement: "1 activity",
      },
      {
        id: "badge-5",
        name: "Top 10",
        description: "Reach top 10 on the leaderboard",
        icon: "🏆",
        color: "#FD9D24",
        earned: true,
        earnedDate: "2024-09-25",
        requirement: "Top 10 rank",
      },
    ],
  },
  {
    id: "user-6",
    name: "Yuki Tanaka",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop",
    faculty: "Faculty of Engineering",
    totalPoints: 2380,
    weeklyPoints: 290,
    monthlyPoints: 880,
    activities: [],
    rank: 6,
    badges: [
      {
        id: "badge-1",
        name: "Climate Champion",
        description: "Complete 5 climate-related activities",
        icon: "🌍",
        color: "#3F7E44",
        earned: true,
        earnedDate: "2024-09-10",
        requirement: "5 climate activities",
      },
    ],
  },
  {
    id: "user-7",
    name: "David Kim",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop",
    faculty: "UNSW Business School",
    totalPoints: 2250,
    weeklyPoints: 275,
    monthlyPoints: 850,
    activities: [],
    rank: 7,
    isFriend: true,
  },
  {
    id: "user-8",
    name: "Sofia Martinez",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop",
    faculty: "Faculty of Medicine & Health",
    totalPoints: 2180,
    weeklyPoints: 260,
    monthlyPoints: 800,
    activities: [],
    rank: 8,
  },
  {
    id: "user-9",
    name: "James O'Connor",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
    faculty: "Faculty of Science",
    totalPoints: 2050,
    weeklyPoints: 240,
    monthlyPoints: 750,
    activities: [],
    rank: 9,
  },
  {
    id: "user-10",
    name: "Fatima Hassan",
    avatar:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&h=200&fit=crop",
    faculty: "Faculty of Arts, Design & Architecture",
    totalPoints: 1980,
    weeklyPoints: 220,
    monthlyPoints: 700,
    activities: [],
    rank: 10,
    isFriend: true,
  },
  {
    id: "user-11",
    name: "Lucas Silva",
    avatar:
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&h=200&fit=crop",
    faculty: "Faculty of Arts, Design & Architecture",
    totalPoints: 1920,
    weeklyPoints: 200,
    monthlyPoints: 650,
    activities: [],
    rank: 11,
  },
  {
    id: "user-12",
    name: "Nina Andersson",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop",
    faculty: "Faculty of Engineering",
    totalPoints: 1850,
    weeklyPoints: 180,
    monthlyPoints: 600,
    activities: [],
    rank: 12,
  },
];

export const availableActivities: AvailableActivity[] = [
  {
    id: "avail-1",
    title: "Climate Change Economics",
    category: "coursework",
    sdgGoals: [13, 8, 9],
    points: 600,
    startDate: "2025-01-15",
    endDate: "2025-05-20",
    description:
      "Explore the economic impacts of climate change and sustainable solutions. This course covers carbon pricing, green finance, and the transition to a low-carbon economy.",
    organizer: "Economics Department",
    location: "Building A, Room 305",
    capacity: 40,
    enrolled: 32,
    imageUrl:
      "https://images.unsplash.com/photo-1515073838964-4d4d56a58b21?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwY2xhc3Nyb29tJTIwbGVhcm5pbmd8ZW58MXx8fHwxNzYxMjA1NDkzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    pointsBreakdown: {
      timeCommitment: 600, // 40 hours * 15 = 600 points
      difficulty: 25, // Level 5 * 5 = 25 points
      sdgImpact: 0, // SDG count no longer contributes
      total: 625,
      explanation:
        "This is a full semester coursework with high academic rigor, covering complex economic theories and practical applications in climate finance.",
    },
  },
  {
    id: "avail-2",
    title: "Water Conservation Workshop",
    category: "event",
    sdgGoals: [6, 14],
    points: 200,
    startDate: "2025-11-05",
    description:
      "Learn practical water conservation techniques and the importance of clean water access. Hands-on workshop with local environmental experts.",
    organizer: "Environmental Science Society",
    location: "Science Building Lab 2",
    capacity: 30,
    enrolled: 18,
    imageUrl:
      "https://images.unsplash.com/photo-1660795308424-8ed1ccdef52a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXN0YWluYWJpbGl0eSUyMGVudmlyb25tZW50JTIwd29ya3Nob3B8ZW58MXx8fHwxNzYxMjA1NDk0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    pointsBreakdown: {
      timeCommitment: 45, // 3 hours * 15 = 45 points
      difficulty: 10, // Level 2 * 5 = 10 points
      sdgImpact: 0, // SDG count no longer contributes
      total: 55,
      explanation:
        "Hands-on practical workshop with expert facilitators. Great introduction to water sustainability.",
    },
  },
  {
    id: "avail-3",
    title: "Community Food Bank Volunteer Program",
    category: "society",
    sdgGoals: [1, 2, 3],
    points: 450,
    startDate: "2025-10-25",
    endDate: "2026-03-25",
    description:
      "Join our semester-long volunteer program at local food banks. Help distribute food, organize drives, and support vulnerable communities.",
    organizer: "Social Impact Society",
    location: "Various Community Locations",
    capacity: 50,
    enrolled: 38,
    imageUrl:
      "https://images.unsplash.com/photo-1751666526244-40239a251eae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2b2x1bnRlZXIlMjBjb21tdW5pdHklMjBzZXJ2aWNlfGVufDF8fHx8MTc2MTE5ODE4Nnww&ixlib=rb-4.1.0&q=80&w=1080",
    pointsBreakdown: {
      timeCommitment: 300, // 20 hours * 15 = 300 points
      difficulty: 15, // Level 3 * 5 = 15 points
      sdgImpact: 0, // SDG count no longer contributes
      total: 315,
      explanation:
        "Long-term commitment with meaningful community impact. Involves physical work and consistent time dedication throughout the semester.",
    },
  },
  {
    id: "avail-4",
    title: "Global Health & Wellbeing Seminar",
    category: "event",
    sdgGoals: [3, 10],
    points: 300,
    startDate: "2025-11-12",
    description:
      "International speakers discuss global health challenges, healthcare access, and reducing health inequalities worldwide.",
    organizer: "Medical School",
    location: "Main Auditorium",
    capacity: 200,
    enrolled: 145,
    imageUrl:
      "https://images.unsplash.com/photo-1759496434742-771c92e66103?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25mZXJlbmNlJTIwZXZlbnQlMjBwcmVzZW50YXRpb258ZW58MXx8fHwxNzYxMTg3NDU5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    pointsBreakdown: {
      timeCommitment: 60, // 4 hours * 15 = 60 points
      difficulty: 10, // Level 2 * 5 = 10 points
      sdgImpact: 0, // SDG count no longer contributes
      total: 70,
      explanation:
        "Full-day seminar featuring renowned international speakers. Includes networking opportunities with health professionals.",
    },
  },
  {
    id: "avail-5",
    title: "Renewable Energy Innovation Lab",
    category: "coursework",
    sdgGoals: [7, 13, 9],
    points: 700,
    startDate: "2025-01-20",
    endDate: "2025-05-30",
    description:
      "Hands-on course developing renewable energy solutions. Work on real projects with solar, wind, and emerging energy technologies.",
    organizer: "Engineering Department",
    location: "Engineering Lab Complex",
    capacity: 25,
    enrolled: 24,
    imageUrl:
      "https://images.unsplash.com/photo-1628206554160-63e8c921e398?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZW5ld2FibGUlMjBlbmVyZ3klMjBzb2xhcnxlbnwxfHx8fDE3NjExMzQ2ODV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    pointsBreakdown: {
      timeCommitment: 750, // 50 hours * 15 = 750 points
      difficulty: 25, // Level 5 * 5 = 25 points
      sdgImpact: 0, // SDG count no longer contributes
      total: 775,
      explanation:
        "Intensive hands-on engineering coursework requiring significant lab time, technical skills, and real project development. High academic rigor with industry applications.",
    },
  },
  {
    id: "avail-6",
    title: "Gender Equality in STEM Panel",
    category: "event",
    sdgGoals: [5, 10, 4],
    points: 250,
    startDate: "2025-10-30",
    description:
      "Panel discussion featuring women leaders in STEM fields. Networking session and mentorship opportunities included.",
    organizer: "Women in STEM Society",
    location: "Student Center Hall B",
    capacity: 100,
    enrolled: 67,
    imageUrl:
      "https://images.unsplash.com/photo-1758270705518-b61b40527e76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwY29sbGFib3JhdGlvbiUyMHN0dWRlbnRzfGVufDF8fHx8MTc2MTIwNTQ5NHww&ixlib=rb-4.1.0&q=80&w=1080",
    pointsBreakdown: {
      timeCommitment: 37.5, // 2.5 hours * 15 = 37.5 points
      difficulty: 5, // Level 1 * 5 = 5 points
      sdgImpact: 0, // SDG count no longer contributes
      total: 42.5,
      explanation:
        "Evening panel with Q&A and networking. Great opportunity to connect with industry leaders and mentors in STEM.",
    },
  },
  {
    id: "avail-7",
    title: "Sustainable Urban Planning",
    category: "coursework",
    sdgGoals: [11, 9, 13],
    points: 550,
    startDate: "2025-01-10",
    endDate: "2025-05-15",
    description:
      "Design sustainable cities of the future. Course covers urban resilience, green infrastructure, and inclusive communities.",
    organizer: "Architecture Department",
    location: "Design Studio 1",
    capacity: 35,
    enrolled: 28,
    imageUrl:
      "https://images.unsplash.com/photo-1515073838964-4d4d56a58b21?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwY2xhc3Nyb29tJTIwbGVhcm5pbmd8ZW58MXx8fHwxNzYxMjA1NDkzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    pointsBreakdown: {
      timeCommitment: 525, // 35 hours * 15 = 525 points
      difficulty: 20, // Level 4 * 5 = 20 points
      sdgImpact: 0, // SDG count no longer contributes
      total: 545,
      explanation:
        "Studio-based course with design projects, site analysis, and presentations. Requires creativity, technical skills, and collaborative work.",
    },
  },
  {
    id: "avail-8",
    title: "Ocean Conservation Initiative",
    category: "society",
    sdgGoals: [14, 13, 15],
    points: 500,
    startDate: "2025-10-28",
    endDate: "2026-04-28",
    description:
      "Join beach cleanups, marine research projects, and advocacy campaigns to protect ocean ecosystems.",
    organizer: "Marine Biology Society",
    location: "Coastal Field Sites",
    capacity: 40,
    enrolled: 31,
    imageUrl:
      "https://images.unsplash.com/photo-1660795308424-8ed1ccdef52a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXN0YWluYWJpbGl0eSUyMGVudmlyb25tZW50JTIwd29ya3Nob3B8ZW58MXx8fHwxNzYxMjA1NDk0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    pointsBreakdown: {
      timeCommitment: 375, // 25 hours * 15 = 375 points
      difficulty: 15, // Level 3 * 5 = 15 points
      sdgImpact: 0, // SDG count no longer contributes
      total: 390,
      explanation:
        "Semester-long field program involving beach cleanups, data collection, and marine research. Includes travel to coastal sites and hands-on conservation work.",
    },
  },
  {
    id: "avail-9",
    title: "Fair Trade & Ethical Consumption",
    category: "event",
    sdgGoals: [12, 8, 1],
    points: 200,
    startDate: "2025-11-08",
    description:
      "Interactive workshop on responsible consumption, fair trade practices, and ethical shopping choices.",
    organizer: "Business Ethics Club",
    location: "Business School Atrium",
    capacity: 60,
    enrolled: 42,
    imageUrl:
      "https://images.unsplash.com/photo-1758270705518-b61b40527e76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwY29sbGFib3JhdGlvbiUyMHN0dWRlbnRzfGVufDF8fHx8MTc2MTIwNTQ5NHww&ixlib=rb-4.1.0&q=80&w=1080",
    pointsBreakdown: {
      timeCommitment: 30, // 2 hours * 15 = 30 points
      difficulty: 5, // Level 1 * 5 = 5 points
      sdgImpact: 0, // SDG count no longer contributes
      total: 35,
      explanation:
        "Interactive workshop with group activities and discussions. Learn practical skills for making ethical consumer choices in daily life.",
    },
  },
  {
    id: "avail-10",
    title: "Social Entrepreneurship Incubator",
    category: "society",
    sdgGoals: [8, 9, 17],
    points: 600,
    startDate: "2025-11-01",
    endDate: "2026-05-01",
    description:
      "Develop your social enterprise idea with mentorship, funding opportunities, and partnerships with local organizations.",
    organizer: "Entrepreneurship Center",
    location: "Innovation Hub",
    capacity: 20,
    enrolled: 16,
    imageUrl:
      "https://images.unsplash.com/photo-1758270705518-b61b40527e76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwY29sbGFib3JhdGlvbiUyMHN0dWRlbnRzfGVufDF8fHx8MTc2MTIwNTQ5NHww&ixlib=rb-4.1.0&q=80&w=1080",
    pointsBreakdown: {
      timeCommitment: 450, // 30 hours * 15 = 450 points
      difficulty: 20, // Level 4 * 5 = 20 points
      sdgImpact: 0, // SDG count no longer contributes
      total: 470,
      explanation:
        "Semester-long incubator program with mentorship sessions, pitch competitions, and real business development. Requires initiative, creativity, and business planning skills.",
    },
  },
  {
    id: "avail-11",
    title: "Biodiversity & Ecosystem Protection",
    category: "coursework",
    sdgGoals: [15, 14, 13],
    points: 650,
    startDate: "2025-01-18",
    endDate: "2025-05-25",
    description:
      "Study biodiversity conservation, habitat restoration, and ecosystem services. Includes field trips to local nature reserves.",
    organizer: "Biology Department",
    location: "Science Building & Field Sites",
    capacity: 30,
    enrolled: 26,
    imageUrl:
      "https://images.unsplash.com/photo-1660795308424-8ed1ccdef52a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXN0YWluYWJpbGl0eSUyMGVudmlyb25tZW50JTIwd29ya3Nob3B8ZW58MXx8fHwxNzYxMjA1NDk0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    pointsBreakdown: {
      timeCommitment: 675, // 45 hours * 15 = 675 points
      difficulty: 20, // Level 4 * 5 = 20 points
      sdgImpact: 0, // SDG count no longer contributes
      total: 695,
      explanation:
        "Comprehensive biology course with field research components. Includes multiple field trips, lab work, species identification, and ecosystem assessment projects.",
    },
  },
  {
    id: "avail-12",
    title: "Peacebuilding & Conflict Resolution",
    category: "event",
    sdgGoals: [16, 10, 17],
    points: 280,
    startDate: "2025-11-15",
    description:
      "Two-day intensive workshop on conflict resolution, mediation skills, and building peaceful communities.",
    organizer: "Political Science Department",
    location: "Conference Center",
    capacity: 50,
    enrolled: 35,
    imageUrl:
      "https://images.unsplash.com/photo-1759496434742-771c92e66103?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25mZXJlbmNlJTIwZXZlbnQlMjBwcmVzZW50YXRpb258ZW58MXx8fHwxNzYxMTg3NDU5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    pointsBreakdown: {
      timeCommitment: 180, // 12 hours * 15 = 180 points
      difficulty: 15, // Level 3 * 5 = 15 points
      sdgImpact: 0, // SDG count no longer contributes
      total: 195,
      explanation:
        "Two-day intensive workshop with role-playing exercises, case studies, and practical mediation training. Develop valuable conflict resolution and communication skills.",
    },
  },
];

export const rewardsCatalog: Reward[] = [
  // Discounts
  {
    id: "reward-1",
    title: "20% Off Campus EcoStore",
    description:
      "Get 20% discount on all sustainable and eco-friendly products",
    category: "discount",
    pointsRequired: 500,
    stock: 25,
    expiryDate: "2026-03-31",
    imageUrl:
      "https://images.unsplash.com/photo-1644370644949-b175294cbceb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaG9wcGluZyUyMGRpc2NvdW50JTIwY2FyZHxlbnwxfHx8fDE3NjE4MDM5OTN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    merchantName: "Campus EcoStore",
    usageNote:
      "Show this voucher at checkout. Valid for one purchase. Cannot be combined with other offers.",
  },
  {
    id: "reward-2",
    title: "$15 Off Campus Bookstore",
    description: "Discount voucher for any purchase over $50",
    category: "discount",
    pointsRequired: 400,
    stock: 40,
    expiryDate: "2026-02-28",
    imageUrl:
      "https://images.unsplash.com/photo-1577627444534-b38e16c9d796?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rc3RvcmUlMjBnaWZ0JTIwY2FyZHxlbnwxfHx8fDE3NjE4MDM5OTV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    merchantName: "University Bookstore",
    usageNote:
      "Minimum purchase $50 required. Valid on textbooks, stationery, and merchandise.",
  },
  {
    id: "reward-3",
    title: "30% Off Sustainable Fashion",
    description: "Exclusive discount at local sustainable clothing stores",
    category: "discount",
    pointsRequired: 600,
    stock: 15,
    expiryDate: "2026-01-31",
    imageUrl:
      "https://images.unsplash.com/photo-1759630752912-5eebdaf9d68c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob29kaWUlMjBzdXN0YWluYWJsZSUyMGNsb3RoaW5nfGVufDF8fHx8MTc2MTgwMzk5OHww&ixlib=rb-4.1.0&q=80&w=1080",
    merchantName: "Green Threads",
    usageNote:
      "Valid on regular-priced items only. One voucher per transaction.",
  },

  // Food & Beverage
  {
    id: "reward-4",
    title: "Free Coffee at Green Café",
    description: "Complimentary beverage of your choice at Green Café",
    category: "food",
    pointsRequired: 200,
    stock: 50,
    expiryDate: "2025-12-31",
    imageUrl:
      "https://images.unsplash.com/photo-1586712746746-bb725ae6f6c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBzaG9wJTIwdm91Y2hlcnxlbnwxfHx8fDE3NjE4MDM5OTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    merchantName: "Green Café",
    usageNote:
      "Valid Monday-Friday, 8am-5pm. Includes all hot and cold beverages.",
  },
  {
    id: "reward-5",
    title: "$10 Lunch Voucher",
    description: "Discount on sustainable lunch options at campus restaurants",
    category: "food",
    pointsRequired: 300,
    stock: 30,
    expiryDate: "2026-01-15",
    imageUrl:
      "https://images.unsplash.com/photo-1730463527882-efcad72b9d7a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwZGluaW5nJTIwdm91Y2hlcnxlbnwxfHx8fDE3NjE4MDM5OTR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    merchantName: "Campus Dining",
    usageNote:
      "Valid at participating restaurants. Minimum spend $15 required.",
  },
  {
    id: "reward-6",
    title: "Free Smoothie Bowl",
    description: "Complimentary acai or protein smoothie bowl",
    category: "food",
    pointsRequired: 250,
    stock: 20,
    expiryDate: "2025-11-30",
    imageUrl:
      "https://images.unsplash.com/photo-1586712746746-bb725ae6f6c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBzaG9wJTIwdm91Y2hlcnxlbnwxfHx8fDE3NjE4MDM5OTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    merchantName: "Healthy Bowl Co.",
    usageNote: "Choose any signature bowl. Toppings included.",
  },

  // Merchandise
  {
    id: "reward-7",
    title: "SDGgo! Reusable Water Bottle",
    description: "Limited edition branded stainless steel water bottle",
    category: "merchandise",
    pointsRequired: 400,
    stock: 12,
    expiryDate: "2026-06-30",
    imageUrl:
      "https://images.unsplash.com/photo-1556814086-bd749c2ceabd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXRlciUyMGJvdHRsZSUyMHN1c3RhaW5hYmxlfGVufDF8fHx8MTc2MTgwMzk5NHww&ixlib=rb-4.1.0&q=80&w=1080",
    merchantName: "Student Union",
    usageNote: "Collect from Student Union desk. Limited stock available.",
  },
  {
    id: "reward-8",
    title: "Eco-Friendly Tote Bag",
    description: "Organic cotton tote bag with SDG logo",
    category: "merchandise",
    pointsRequired: 350,
    stock: 8,
    expiryDate: "2026-05-31",
    imageUrl:
      "https://images.unsplash.com/photo-1758708536099-9f46dc81fffc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlY28lMjBmcmllbmRseSUyMHRvdGUlMjBiYWd8ZW58MXx8fHwxNzYxNzc3NjQzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    merchantName: "Student Union",
    usageNote: "Available in multiple colors. While stocks last.",
  },
  {
    id: "reward-9",
    title: "Sustainable Hoodie",
    description: "Premium eco-friendly hoodie from recycled materials",
    category: "merchandise",
    pointsRequired: 800,
    stock: 5,
    expiryDate: "2026-04-30",
    imageUrl:
      "https://images.unsplash.com/photo-1759630752912-5eebdaf9d68c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob29kaWUlMjBzdXN0YWluYWJsZSUyMGNsb3RoaW5nfGVufDF8fHx8MTc2MTgwMzk5OHww&ixlib=rb-4.1.0&q=80&w=1080",
    merchantName: "Green Campus Apparel",
    usageNote: "Select size upon collection. Exchange available within 7 days.",
  },

  // Experiences
  {
    id: "reward-10",
    title: "Yoga Class Pass (5 Sessions)",
    description: "Five complimentary yoga classes at campus wellness center",
    category: "experience",
    pointsRequired: 700,
    stock: 10,
    expiryDate: "2026-03-31",
    imageUrl:
      "https://images.unsplash.com/photo-1588286840104-8957b019727f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2dhJTIwZml0bmVzcyUyMGNsYXNzfGVufDF8fHx8MTc2MTczMDAyMnww&ixlib=rb-4.1.0&q=80&w=1080",
    merchantName: "Campus Wellness Center",
    usageNote:
      "Book in advance. Valid for any regular class. Expires 90 days after redemption.",
  },
  {
    id: "reward-11",
    title: "Museum Entry Pass",
    description: "Free admission to local art and history museums",
    category: "experience",
    pointsRequired: 500,
    stock: 20,
    expiryDate: "2026-02-28",
    imageUrl:
      "https://images.unsplash.com/photo-1747918157024-a1e1c77336fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNldW0lMjBhcnQlMjBnYWxsZXJ5fGVufDF8fHx8MTc2MTc0NTk3M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    merchantName: "City Cultural Alliance",
    usageNote: "Valid for one person. Present voucher at museum entrance.",
  },
  {
    id: "reward-12",
    title: "Bike Share Monthly Pass",
    description: "Free month of unlimited campus bike sharing",
    category: "experience",
    pointsRequired: 800,
    stock: 15,
    expiryDate: "2026-01-31",
    imageUrl:
      "https://images.unsplash.com/photo-1724571816980-e8023cb6ade2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaWtlJTIwcmVudGFsJTIwb3V0ZG9vcnxlbnwxfHx8fDE3NjE4MDM5OTh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    merchantName: "Campus Bike Share",
    usageNote:
      "Activate within 30 days of redemption. Unlimited 60-minute rides.",
  },
  {
    id: "reward-13",
    title: "Concert Tickets",
    description: "Two tickets to upcoming campus sustainability concert",
    category: "experience",
    pointsRequired: 1000,
    stock: 3,
    expiryDate: "2025-12-15",
    imageUrl:
      "https://images.unsplash.com/photo-1652018440238-1aeb20a803a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25jZXJ0JTIwdGlja2V0cyUyMGV4cGVyaWVuY2V8ZW58MXx8fHwxNzYxODAzOTkzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    merchantName: "Student Events Committee",
    usageNote:
      "Two tickets included. E-tickets sent via email after redemption.",
  },
  {
    id: "reward-14",
    title: "Spa & Wellness Package",
    description: "Relaxing massage and wellness treatment session",
    category: "experience",
    pointsRequired: 1200,
    stock: 6,
    expiryDate: "2026-04-30",
    imageUrl:
      "https://images.unsplash.com/photo-1757689314932-bec6e9c39e51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGElMjB3ZWxsbmVzcyUyMG1hc3NhZ2V8ZW58MXx8fHwxNzYxODAzOTk4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    merchantName: "Zen Wellness Spa",
    usageNote:
      "Appointment required. 60-minute session included. Valid weekdays only.",
  },
];
