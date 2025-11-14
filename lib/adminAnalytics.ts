import { allStudents, availableActivities, currentUser } from "@/data/mockData";
import { Student, AvailableActivity, SDG_GOALS } from "@/types";

// Get activities from localStorage if available, otherwise use default
function getAvailableActivities(): AvailableActivity[] {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("sdg-admin-activities");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
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

// Get all registered events (including favorites)
function getAllRegisteredEvents(): Array<{
  studentId: string;
  eventId: string;
  activityId: string;
  title: string;
  status: "registered" | "attended" | "cancelled";
  registeredDate: string;
  attendedDate?: string;
  feedback?: any;
  faculty: string;
}> {
  const events: Array<{
    studentId: string;
    eventId: string;
    activityId: string;
    title: string;
    status: "registered" | "attended" | "cancelled";
    registeredDate: string;
    attendedDate?: string;
    feedback?: any;
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
        status: event.status,
        registeredDate: event.registeredDate,
        attendedDate: event.attendedDate,
        feedback: event.feedback,
        faculty: currentUser.faculty,
      });
    });
  }

  // Mock: Add some registered events for other students
  // In real app, this would come from database
  const mockStudentEvents = [
    {
      studentId: "user-2",
      activityId: "avail-2",
      title: "Water Conservation Workshop",
      status: "registered" as const,
      registeredDate: "2024-10-18",
      faculty: "Faculty of Engineering",
    },
    {
      studentId: "user-3",
      activityId: "avail-4",
      title: "Global Health & Wellbeing Seminar",
      status: "attended" as const,
      registeredDate: "2024-10-15",
      attendedDate: "2024-11-12",
      faculty: "Faculty of Science",
    },
    {
      studentId: "user-4",
      activityId: "avail-6",
      title: "Gender Equality in STEM Panel",
      status: "registered" as const,
      registeredDate: "2024-10-20",
      faculty: "Faculty of Arts, Design & Architecture",
    },
  ];

  mockStudentEvents.forEach((event) => {
    events.push({
      studentId: event.studentId,
      eventId: `event-${event.studentId}-${event.activityId}`,
      activityId: event.activityId,
      title: event.title,
      status: event.status,
      registeredDate: event.registeredDate,
      attendedDate: event.attendedDate,
      faculty: event.faculty,
    });
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

  // Mock: Add some favorites for other students
  favorites.set("avail-2", new Set(["user-1", "user-2", "user-5"]));
  favorites.set("avail-4", new Set(["user-1", "user-3", "user-7"]));
  favorites.set("avail-6", new Set(["user-1", "user-4", "user-6"]));

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
