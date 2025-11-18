import { allStudents, availableActivities, currentUser } from "@/data/mockData";
import { AvailableActivity, SDG_GOALS, EventFeedback } from "@/types";

// Get activities from localStorage if available, otherwise use default
export function getAvailableActivities(): AvailableActivity[] {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("sdg-admin-activities");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return availableActivities;
      }
    }
  }
  return availableActivities;
}

// Aggregate all student activities from registeredEvents and activities
function getAllStudentActivities(): Array<{
  studentId: string;
  activityId: string;
  title: string;
  category: "coursework" | "society" | "event";
  sdgGoals: number[];
  points: number;
  date: string;
  faculty: string;
}> {
  const allActivities: Array<{
    studentId: string;
    activityId: string;
    title: string;
    category: "coursework" | "society" | "event";
    sdgGoals: number[];
    points: number;
    date: string;
    faculty: string;
  }> = [];

  // Add current user's activities
  currentUser.activities.forEach((activity) => {
    allActivities.push({
      studentId: currentUser.id,
      activityId: activity.id,
      title: activity.title,
      category: activity.category,
      sdgGoals: activity.sdgGoals,
      points: activity.points,
      date: activity.date,
      faculty: currentUser.faculty,
    });
  });

  // Add current user's registered events
  if (currentUser.registeredEvents) {
    currentUser.registeredEvents.forEach((event) => {
      if (event.status === "attended") {
        allActivities.push({
          studentId: currentUser.id,
          activityId: event.activityId,
          title: event.title,
          category: "event",
          sdgGoals: event.sdgGoals,
          points: event.points,
          date: event.attendedDate || event.startDate,
          faculty: currentUser.faculty,
        });
      }
    });
  }

  // Add other students' activities (mock data - in real app would come from database)
  allStudents.forEach((student) => {
    if (student.activities && student.activities.length > 0) {
      student.activities.forEach((activity) => {
        allActivities.push({
          studentId: student.id,
          activityId: activity.id,
          title: activity.title,
          category: activity.category,
          sdgGoals: activity.sdgGoals,
          points: activity.points,
          date: activity.date,
          faculty: student.faculty,
        });
      });
    } else if (student.totalPoints > 0) {
      // Generate mock activities for students with points but no activities defined
      // This ensures faculty analytics show realistic data
      const numActivities = Math.floor(student.totalPoints / 250) || 1;
      const categories: ("coursework" | "society" | "event")[] = [
        "coursework",
        "society",
        "event",
      ];

      for (let i = 0; i < numActivities; i++) {
        const category = categories[i % categories.length];
        const pointsPerActivity = Math.floor(
          student.totalPoints / numActivities
        );
        const randomSDGs = [
          Math.floor(Math.random() * 17) + 1,
          Math.floor(Math.random() * 17) + 1,
        ].filter((v, i, a) => a.indexOf(v) === i); // Remove duplicates

        allActivities.push({
          studentId: student.id,
          activityId: `${student.id}-activity-${i}`,
          title: `Activity ${i + 1}`,
          category,
          sdgGoals: randomSDGs,
          points: pointsPerActivity,
          date: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
          faculty: student.faculty,
        });
      }
    }
  });

  return allActivities;
}

// Simple hash function for deterministic "random" numbers
function hash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

// Get all registered events (including favorites)
export function getAllRegisteredEvents(): Array<{
  studentId: string;
  eventId: string;
  activityId: string;
  title: string;
  organizer: string;
  sdgGoals: number[];
  status: "registered" | "attended" | "cancelled";
  registeredDate: string;
  attendedDate?: string;
  feedback?: EventFeedback;
  faculty: string;
}> {
  const events: Array<{
    studentId: string;
    eventId: string;
    activityId: string;
    title: string;
    organizer: string;
    sdgGoals: number[];
    status: "registered" | "attended" | "cancelled";
    registeredDate: string;
    attendedDate?: string;
    feedback?: EventFeedback;
    faculty: string;
  }> = [];

  // Add current user's registered events
  if (currentUser.registeredEvents) {
    currentUser.registeredEvents.forEach((event) => {
      events.push({
        studentId: currentUser.id,
        eventId: event.id,
        activityId: event.activityId,
        title: event.title,
        organizer: event.organizer,
        sdgGoals: event.sdgGoals,
        status: event.status,
        registeredDate: event.registeredDate,
        attendedDate: event.attendedDate,
        feedback: event.feedback,
        faculty: currentUser.faculty,
      });
    });
  }

  // Mock: Generate impressive numbers for admin dashboard demo
  // In real app, this would come from database
  const activities = getAvailableActivities();
  const eventActivities = activities.filter((a) => a.category === "event");

  // Track which events currentUser has already registered for to avoid duplicates
  const currentUserEventIds = new Set(
    currentUser.registeredEvents?.map((e) => e.activityId) || []
  );

  // Generate mock registrations/attendances for each event
  eventActivities.forEach((activity) => {
    // Skip if currentUser already registered (to avoid duplicates)
    if (currentUserEventIds.has(activity.id)) {
      return;
    }

    // Generate deterministic but impressive registration numbers based on capacity
    const seed = hash(activity.id);
    const baseRegistrations = activity.capacity
      ? Math.floor(activity.capacity * (0.65 + (seed % 30) / 100)) // 65-95% of capacity
      : Math.floor(30 + (seed % 70)); // 30-100 registrations for unlimited capacity

    // Generate attendance rate (75-92% for good events)
    const attendanceRate = 0.75 + (seed % 17) / 100;

    // Ensure we have enough students to generate unique registrations
    const studentIds = allStudents.map((s) => s.id);
    // Deterministic shuffle based on seed
    const shuffledStudents = [...studentIds].sort((a, b) => {
      const hashA = hash(activity.id + a);
      const hashB = hash(activity.id + b);
      return hashA - hashB;
    });

    // Limit registrations to available students (reuse if needed but keep unique per event)
    const maxRegistrations = Math.min(
      baseRegistrations,
      shuffledStudents.length * 2
    ); // Allow some reuse
    const registeredCount = maxRegistrations;
    const attendedCount = Math.floor(registeredCount * attendanceRate); // Ensure attended <= registered

    // Create registrations
    for (let i = 0; i < maxRegistrations; i++) {
      const studentId = shuffledStudents[i % shuffledStudents.length];
      const student =
        allStudents.find((s) => s.id === studentId) || currentUser;
      const isAttended = i < attendedCount;
      const daysAgo = 5 + ((seed + i) % 55); // 5-60 days ago
      const registeredDate = new Date(
        Date.now() - daysAgo * 24 * 60 * 60 * 1000
      )
        .toISOString()
        .split("T")[0];

      const eventData: (typeof events)[0] = {
        studentId,
        eventId: `event-${studentId}-${activity.id}-${i}`,
        activityId: activity.id,
        title: activity.title,
        organizer: activity.organizer,
        sdgGoals: activity.sdgGoals,
        status: isAttended ? ("attended" as const) : ("registered" as const),
        registeredDate,
        attendedDate: isAttended
          ? new Date(
              new Date(registeredDate).getTime() +
                (((seed + i) % 14) + 1) * 24 * 60 * 60 * 1000
            )
              .toISOString()
              .split("T")[0]
          : undefined,
        faculty: student.faculty,
        // Add feedback for attended events (70% chance, with good ratings)
        feedback:
          isAttended && (seed + i) % 10 < 7
            ? {
                overallRating: 3.5 + ((seed + i) % 15) / 10, // 3.5-5.0 rating
                contentRating: 3.5 + ((seed + i + 1) % 15) / 10,
                organizationRating: 3.5 + ((seed + i + 2) % 15) / 10,
                speakersRating: 3.5 + ((seed + i + 3) % 15) / 10,
                venueRating: 3.0 + ((seed + i + 4) % 20) / 10,
                likedMost: "Great event! Very informative and well-organized.",
                improvements:
                  (seed + i) % 10 < 3
                    ? "Could use better time management."
                    : "",
                wouldRecommend: (seed + i) % 10 < 8, // 80% recommend
                additionalComments:
                  (seed + i) % 2 === 0 ? "Would definitely attend again!" : "",
                submittedDate: new Date(
                  Date.now() - (((seed + i) % 30) + 1) * 24 * 60 * 60 * 1000
                )
                  .toISOString()
                  .split("T")[0],
              }
            : undefined,
      };

      events.push(eventData);
    }
  });

  return events;
}

// Get favorites from localStorage (mock - in real app would be from database)
function getFavorites(): Map<string, Set<string>> {
  const favorites = new Map<string, Set<string>>();

  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("sdg-favorite-events");
    if (stored) {
      const favoriteIds = new Set(JSON.parse(stored));
      favoriteIds.forEach((activityId) => {
        favorites.set(activityId as string, new Set([currentUser.id]));
      });
    }
  }

  // Mock: Generate impressive favorite counts for admin dashboard
  const activities = getAvailableActivities();
  const eventActivities = activities.filter((a) => a.category === "event");
  const allStudentIds = allStudents.map((s) => s.id).concat([currentUser.id]);

  eventActivities.forEach((activity) => {
    // Generate deterministic favorite count (8-35% of students favoriting popular events)
    const seed = hash(activity.id);
    const favoriteCount = Math.floor(
      allStudentIds.length * (0.08 + (seed % 27) / 100)
    );
    // Deterministic shuffle
    const shuffledStudents = [...allStudentIds].sort((a, b) => {
      const hashA = hash(activity.id + a);
      const hashB = hash(activity.id + b);
      return hashA - hashB;
    });
    const favoriteSet = new Set(shuffledStudents.slice(0, favoriteCount));

    // Merge with existing favorites from localStorage
    const existing = favorites.get(activity.id) || new Set();
    favoriteSet.forEach((id) => existing.add(id));
    favorites.set(activity.id, existing);
  });

  return favorites;
}

// Analytics Functions

export function getSDGAnalytics() {
  const activities = getAllStudentActivities();
  const sdgStats = new Map<
    number,
    {
      number: number;
      name: string;
      color: string;
      participants: number;
      totalPoints: number;
      activityCount: number;
      facultyBreakdown: Map<string, number>;
    }
  >();

  SDG_GOALS.forEach((sdg) => {
    sdgStats.set(sdg.number, {
      number: sdg.number,
      name: sdg.name,
      color: sdg.color,
      participants: 0,
      totalPoints: 0,
      activityCount: 0,
      facultyBreakdown: new Map(),
    });
  });

  // Count activities by SDG
  activities.forEach((activity) => {
    activity.sdgGoals.forEach((sdgNum) => {
      const stat = sdgStats.get(sdgNum);
      if (stat) {
        stat.participants++;
        stat.totalPoints += activity.points;
        stat.activityCount++;

        const facultyCount = stat.facultyBreakdown.get(activity.faculty) || 0;
        stat.facultyBreakdown.set(activity.faculty, facultyCount + 1);
      }
    });
  });

  // Count unique activities per SDG from availableActivities
  const availableActivitiesList = getAvailableActivities();
  availableActivitiesList.forEach((activity) => {
    activity.sdgGoals.forEach((sdgNum) => {
      const stat = sdgStats.get(sdgNum);
      if (stat) {
        stat.activityCount++;
      }
    });
  });

  return Array.from(sdgStats.values()).sort(
    (a, b) => b.participants - a.participants
  );
}

export function getEventAnalytics() {
  const events = getAllRegisteredEvents();
  const favorites = getFavorites();
  const eventStats = new Map<
    string,
    {
      id: string;
      title: string;
      registered: number;
      attended: number;
      cancelled: number;
      attendanceRate: number;
      averageRating: number;
      favoriteCount: number;
      capacity?: number;
      enrolled?: number;
      organizer: string;
      sdgGoals: number[];
    }
  >();

  // Initialize from availableActivities
  const activities = getAvailableActivities();
  activities.forEach((activity) => {
    if (activity.category === "event") {
      eventStats.set(activity.id, {
        id: activity.id,
        title: activity.title,
        registered: 0,
        attended: 0,
        cancelled: 0,
        attendanceRate: 0,
        averageRating: 0,
        favoriteCount: favorites.get(activity.id)?.size || 0,
        capacity: activity.capacity,
        enrolled: activity.enrolled,
        organizer: activity.organizer,
        sdgGoals: activity.sdgGoals,
      });
    }
  });

  // Aggregate event registrations
  const eventRatings: Map<string, number[]> = new Map();

  events.forEach((event) => {
    // If event doesn't exist in stats yet, add it (for past events not in availableActivities)
    if (!eventStats.has(event.activityId)) {
      eventStats.set(event.activityId, {
        id: event.activityId,
        title: event.title,
        registered: 0,
        attended: 0,
        cancelled: 0,
        attendanceRate: 0,
        averageRating: 0,
        favoriteCount: favorites.get(event.activityId)?.size || 0,
        organizer: event.organizer,
        sdgGoals: event.sdgGoals,
      });
    }

    const stat = eventStats.get(event.activityId);
    if (stat) {
      if (event.status === "registered") stat.registered++;
      if (event.status === "attended") {
        stat.attended++;
        if (event.feedback?.overallRating) {
          const ratings = eventRatings.get(event.activityId) || [];
          ratings.push(event.feedback.overallRating);
          eventRatings.set(event.activityId, ratings);
        }
      }
      if (event.status === "cancelled") stat.cancelled++;
    }
  });

  // Calculate attendance rates and average ratings
  eventStats.forEach((stat, id) => {
    if (stat.registered > 0) {
      stat.attendanceRate = (stat.attended / stat.registered) * 100;
    }
    const ratings = eventRatings.get(id);
    if (ratings && ratings.length > 0) {
      stat.averageRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;
    }
  });

  return Array.from(eventStats.values());
}

export function getFacultyAnalytics() {
  const activities = getAllStudentActivities();
  const facultyStats = new Map<
    string,
    {
      faculty: string;
      totalStudents: number;
      totalPoints: number;
      averagePoints: number;
      totalActivities: number;
      averageActivities: number;
      sdgParticipation: Map<number, number>;
    }
  >();

  // Initialize with all students
  allStudents.forEach((student) => {
    if (!facultyStats.has(student.faculty)) {
      facultyStats.set(student.faculty, {
        faculty: student.faculty,
        totalStudents: 0,
        totalPoints: 0,
        averagePoints: 0,
        totalActivities: 0,
        averageActivities: 0,
        sdgParticipation: new Map(),
      });
    }
  });

  // Add current user's faculty
  if (!facultyStats.has(currentUser.faculty)) {
    facultyStats.set(currentUser.faculty, {
      faculty: currentUser.faculty,
      totalStudents: 0,
      totalPoints: 0,
      averagePoints: 0,
      totalActivities: 0,
      averageActivities: 0,
      sdgParticipation: new Map(),
    });
  }

  // Count students per faculty
  const studentsByFaculty = new Map<string, Set<string>>();
  allStudents.forEach((student) => {
    const set = studentsByFaculty.get(student.faculty) || new Set();
    set.add(student.id);
    studentsByFaculty.set(student.faculty, set);
  });

  const currentUserSet =
    studentsByFaculty.get(currentUser.faculty) || new Set();
  currentUserSet.add(currentUser.id);
  studentsByFaculty.set(currentUser.faculty, currentUserSet);

  studentsByFaculty.forEach((studentIds, faculty) => {
    const stat = facultyStats.get(faculty);
    if (stat) {
      stat.totalStudents = studentIds.size;
    }
  });

  // Aggregate activities by faculty
  activities.forEach((activity) => {
    const stat = facultyStats.get(activity.faculty);
    if (stat) {
      stat.totalPoints += activity.points;
      stat.totalActivities++;

      activity.sdgGoals.forEach((sdgNum) => {
        const count = stat.sdgParticipation.get(sdgNum) || 0;
        stat.sdgParticipation.set(sdgNum, count + 1);
      });
    }
  });

  // Calculate averages
  facultyStats.forEach((stat) => {
    if (stat.totalStudents > 0) {
      stat.averagePoints = stat.totalPoints / stat.totalStudents;
      stat.averageActivities = stat.totalActivities / stat.totalStudents;
    }
  });

  return Array.from(facultyStats.values()).sort(
    (a, b) => b.totalPoints - a.totalPoints
  );
}

export function getDashboardOverview() {
  const activities = getAllStudentActivities();
  const events = getAllRegisteredEvents();
  const facultyStats = getFacultyAnalytics();

  const totalStudents = allStudents.length + 1; // +1 for currentUser
  const totalActivities = getAvailableActivities().length;
  const totalPoints = activities.reduce((sum, a) => sum + a.points, 0);
  const weeklyPoints =
    allStudents.reduce((sum, s) => sum + (s.weeklyPoints || 0), 0) +
    (currentUser.weeklyPoints || 0);
  const monthlyPoints =
    allStudents.reduce((sum, s) => sum + (s.monthlyPoints || 0), 0) +
    (currentUser.monthlyPoints || 0);

  const totalRegistered = events.filter(
    (e) => e.status === "registered"
  ).length;
  const totalAttended = events.filter((e) => e.status === "attended").length;
  const averageEngagement = activities.length / totalStudents;

  const mostActiveFaculty = facultyStats[0]?.faculty || "N/A";
  const topSDGs = getSDGAnalytics()
    .slice(0, 3)
    .map((s) => s.name);

  return {
    totalStudents,
    totalActivities,
    totalPoints,
    weeklyPoints,
    monthlyPoints,
    totalRegistered,
    totalAttended,
    averageEngagement: Math.round(averageEngagement * 10) / 10,
    mostActiveFaculty,
    topSDGs,
  };
}

export function getActivityTypeAnalytics() {
  const activities = getAllStudentActivities();

  const typeStats: {
    coursework: {
      count: number;
      totalPoints: number;
      avgPoints: number;
      participants: Set<string>;
    };
    society: {
      count: number;
      totalPoints: number;
      avgPoints: number;
      participants: Set<string>;
    };
    event: {
      count: number;
      totalPoints: number;
      avgPoints: number;
      participants: Set<string>;
    };
  } = {
    coursework: {
      count: 0,
      totalPoints: 0,
      avgPoints: 0,
      participants: new Set<string>(),
    },
    society: {
      count: 0,
      totalPoints: 0,
      avgPoints: 0,
      participants: new Set<string>(),
    },
    event: {
      count: 0,
      totalPoints: 0,
      avgPoints: 0,
      participants: new Set<string>(),
    },
  };

  activities.forEach((activity) => {
    const type = activity.category;
    if (type in typeStats) {
      typeStats[type].count++;
      typeStats[type].totalPoints += activity.points;
      typeStats[type].participants.add(activity.studentId);
    }
  });

  // Calculate averages and convert Set to count
  return {
    coursework: {
      count: typeStats.coursework.count,
      totalPoints: typeStats.coursework.totalPoints,
      avgPoints:
        typeStats.coursework.count > 0
          ? typeStats.coursework.totalPoints / typeStats.coursework.count
          : 0,
      participants: typeStats.coursework.participants.size,
    },
    society: {
      count: typeStats.society.count,
      totalPoints: typeStats.society.totalPoints,
      avgPoints:
        typeStats.society.count > 0
          ? typeStats.society.totalPoints / typeStats.society.count
          : 0,
      participants: typeStats.society.participants.size,
    },
    event: {
      count: typeStats.event.count,
      totalPoints: typeStats.event.totalPoints,
      avgPoints:
        typeStats.event.count > 0
          ? typeStats.event.totalPoints / typeStats.event.count
          : 0,
      participants: typeStats.event.participants.size,
    },
  };
}

/**
 * Generate mock redemption analytics for rewards
 * In a real app, this would query redemption data from the database
 */
export interface RewardRedemptionStats {
  rewardId: string;
  title: string;
  category: string;
  pointsRequired: number;
  initialStock: number;
  currentStock: number;
  redemptions: number;
  redemptionRate: number; // percentage of initial stock redeemed
  totalPointsRedeemed: number;
  stockTurnoverRate: number; // redemptions / initialStock
}

export function getRewardRedemptionAnalytics(
  rewards: Array<{
    id: string;
    stock: number;
    pointsRequired: number;
    category: string;
    title: string;
  }>
): RewardRedemptionStats[] {
  // Generate deterministic mock redemption data
  const stats: RewardRedemptionStats[] = rewards.map((reward) => {
    // Use hash function for deterministic "random" numbers
    const seed = hash(reward.id);

    // Assume initial stock was higher (current stock + redemptions)
    // Generate redemptions based on reward popularity (deterministic)
    const popularityFactor = (seed % 100) / 100; // 0-1

    // Initial stock estimate: current stock + some redemptions
    // More popular rewards have higher initial stock and more redemptions
    const baseInitialStock = reward.stock + Math.floor(10 + (seed % 90)); // 10-100 additional
    const initialStock = Math.max(baseInitialStock, reward.stock + 5);

    // Redemptions: popular rewards (high popularityFactor) get more redemptions
    // Range: 5-85% of initial stock redeemed
    const redemptionPercentage = 0.05 + popularityFactor * 0.8;
    const redemptions = Math.floor(initialStock * redemptionPercentage);

    // Ensure redemptions don't exceed what's possible
    const maxPossibleRedemptions = initialStock - reward.stock;
    const actualRedemptions = Math.min(redemptions, maxPossibleRedemptions);

    // Calculate metrics
    const redemptionRate =
      initialStock > 0 ? (actualRedemptions / initialStock) * 100 : 0;
    const totalPointsRedeemed = actualRedemptions * reward.pointsRequired;
    const stockTurnoverRate =
      initialStock > 0 ? actualRedemptions / initialStock : 0;

    return {
      rewardId: reward.id,
      title: reward.title,
      category: reward.category,
      pointsRequired: reward.pointsRequired,
      initialStock,
      currentStock: reward.stock,
      redemptions: actualRedemptions,
      redemptionRate: Math.round(redemptionRate * 10) / 10, // Round to 1 decimal
      totalPointsRedeemed,
      stockTurnoverRate: Math.round(stockTurnoverRate * 1000) / 1000, // Round to 3 decimals
    };
  });

  return stats;
}
