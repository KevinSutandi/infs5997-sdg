/**
 * PDF Report Generator
 * Generates a comprehensive business-focused PDF report of the SDG platform analytics
 */

interface PDFReportData {
  overview: {
    totalStudents: number;
    totalActivities: number;
    totalPoints: number;
    weeklyPoints: number;
    monthlyPoints: number;
    totalRegistered: number;
    totalAttended: number;
    averageEngagement: number;
    mostActiveFaculty: string;
  };
  sdgData: Array<{
    number: number;
    name: string;
    color: string;
    participants: number;
    totalPoints: number;
    percentOfTotal: number;
  }>;
  eventData: Array<{
    id: string;
    title: string;
    registered: number;
    attended: number;
    cancelled: number;
    attendanceRate: number;
    averageRating: number;
    favoriteCount: number;
  }>;
  facultyData: Array<{
    faculty: string;
    students: number;
    totalPoints: number;
    avgPointsPerStudent: number;
  }>;
  activityTypeBreakdown: {
    coursework: { count: number; totalPoints: number; avgPoints: number; participants: number };
    society: { count: number; totalPoints: number; avgPoints: number; participants: number };
    event: { count: number; totalPoints: number; avgPoints: number; participants: number };
  };
  engagementRate: number;
}

export async function generatePDFReport(data: PDFReportData): Promise<void> {
  // Dynamic import to avoid SSR issues
  const jsPDF = (await import('jspdf')).default;
  
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  let yPosition = margin;

  // Helper function to add a new page if needed
  const checkPageBreak = (requiredHeight: number) => {
    if (yPosition + requiredHeight > pageHeight - margin - 15) {
      doc.addPage();
      yPosition = margin;
    }
  };

  // Helper function to draw a section divider
  const addSectionDivider = () => {
    doc.setDrawColor(255, 230, 0); // UNSW amber
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 8;
  };

  // ========================================
  // COVER PAGE
  // ========================================
  doc.setFontSize(28);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.text('SDGgo! Platform', pageWidth / 2, 60, { align: 'center' });
  
  doc.setFontSize(22);
  doc.text('Analytics Report', pageWidth / 2, 70, { align: 'center' });
  
  // UNSW branding line
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(255, 230, 0); // UNSW amber
  doc.text('University of New South Wales', pageWidth / 2, 80, { align: 'center' });
  
  // Report date
  doc.setFontSize(11);
  doc.setTextColor(100, 100, 100);
  const reportDate = new Date().toLocaleDateString('en-AU', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric'
  });
  doc.text(`Report Generated: ${reportDate}`, pageWidth / 2, 100, { align: 'center' });
  
  // Reporting period
  doc.text('Reporting Period: Current Academic Session', pageWidth / 2, 108, { align: 'center' });
  
  // Confidentiality notice
  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  doc.text('Confidential - For Internal Use Only', pageWidth / 2, pageHeight - 20, { align: 'center' });

  // Start new page for content
  doc.addPage();
  yPosition = margin;

  // ========================================
  // EXECUTIVE SUMMARY
  // ========================================
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Executive Summary', margin, yPosition);
  yPosition += 10;
  addSectionDivider();

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  
  const summaryText = [
    `The SDGgo! platform is currently engaging ${data.overview.totalStudents.toLocaleString()} students across UNSW,`,
    `with a total of ${data.overview.totalActivities.toLocaleString()} activities recorded and ${data.overview.totalPoints.toLocaleString()} points awarded.`,
    '',
    `Key Highlights:`,
    `• ${data.facultyData[0]?.faculty || data.overview.mostActiveFaculty} leads in participation`,
    `• ${data.sdgData[0]?.name || 'Top SDG'} is the most engaged SDG goal`,
    `• Average student engagement: ${data.overview.averageEngagement.toFixed(1)} activities per student`,
    `• Event attendance rate: ${data.overview.totalRegistered > 0 ? ((data.overview.totalAttended / data.overview.totalRegistered) * 100).toFixed(1) : '0'}%`,
  ];

  summaryText.forEach(line => {
    checkPageBreak(6);
    if (line.startsWith('•')) {
      doc.setFont('helvetica', 'bold');
      doc.text(line, margin + 5, yPosition);
      doc.setFont('helvetica', 'normal');
    } else {
      doc.text(line, margin, yPosition);
    }
    yPosition += 5;
  });

  yPosition += 5;

  // ========================================
  // KEY PERFORMANCE INDICATORS
  // ========================================
  checkPageBreak(60);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Key Performance Indicators', margin, yPosition);
  yPosition += 8;
  addSectionDivider();

  // KPI Cards Layout
  const kpis = [
    {
      title: 'Student Participation',
      value: data.overview.totalStudents.toLocaleString(),
      subtitle: 'Active Students',
      icon: '👥'
    },
    {
      title: 'Total Impact',
      value: data.overview.totalPoints.toLocaleString(),
      subtitle: 'Points Awarded',
      icon: '⭐'
    },
    {
      title: 'Activity Volume',
      value: data.overview.totalActivities.toLocaleString(),
      subtitle: 'Total Activities',
      icon: '📊'
    },
    {
      title: 'Engagement Rate',
      value: `${data.engagementRate}%`,
      subtitle: 'Platform Engagement',
      icon: '📈'
    },
  ];

  doc.setFontSize(10);
  kpis.forEach((kpi, index) => {
    if (index % 2 === 0 && index > 0) {
      yPosition += 25;
      checkPageBreak(25);
    }
    
    const xPos = index % 2 === 0 ? margin : pageWidth / 2 + 5;
    const boxWidth = (pageWidth - 2 * margin - 10) / 2;
    
    // Draw box
    doc.setDrawColor(220, 220, 220);
    doc.setFillColor(250, 250, 250);
    doc.roundedRect(xPos, yPosition, boxWidth, 20, 2, 2, 'FD');
    
    // Content
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(kpi.icon + ' ' + kpi.title, xPos + 3, yPosition + 5);
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(kpi.value, xPos + 3, yPosition + 11);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text(kpi.subtitle, xPos + 3, yPosition + 16);
    doc.setFontSize(10);
  });

  yPosition += 30;

  // ========================================
  // POINTS DISTRIBUTION & TRENDS
  // ========================================
  checkPageBreak(40);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Points Distribution & Trends', margin, yPosition);
  yPosition += 8;
  addSectionDivider();

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  // Weekly and Monthly breakdown
  const pointsMetrics = [
    { label: 'Points This Week', value: data.overview.weeklyPoints.toLocaleString(), trend: 'weekly' },
    { label: 'Points This Month', value: data.overview.monthlyPoints.toLocaleString(), trend: 'monthly' },
    { label: 'Average Per Student', value: Math.round(data.overview.totalPoints / data.overview.totalStudents).toLocaleString(), trend: 'avg' },
    { label: 'Average Per Activity', value: Math.round(data.overview.totalPoints / data.overview.totalActivities).toLocaleString(), trend: 'avg-act' },
  ];

  pointsMetrics.forEach((metric, index) => {
    checkPageBreak(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(60, 60, 60);
    doc.text(`${metric.label}:`, margin, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text(metric.value, margin + 70, yPosition);
    yPosition += 7;
  });

  yPosition += 5;

  // ========================================
  // FACULTY PERFORMANCE ANALYSIS
  // ========================================
  checkPageBreak(50);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Faculty Performance Analysis', margin, yPosition);
  yPosition += 8;
  addSectionDivider();

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  doc.text('Comparative analysis of faculty participation and engagement levels:', margin, yPosition);
  yPosition += 8;

  // Sort faculties by total points
  const sortedFaculties = [...data.facultyData].sort((a, b) => b.totalPoints - a.totalPoints);

  // Table header
  doc.setFont('helvetica', 'bold');
  doc.setFillColor(240, 240, 240);
  doc.rect(margin, yPosition, pageWidth - 2 * margin, 8, 'F');
  doc.text('Faculty', margin + 2, yPosition + 5);
  doc.text('Students', margin + 70, yPosition + 5);
  doc.text('Total Points', margin + 100, yPosition + 5);
  doc.text('Avg/Student', margin + 140, yPosition + 5);
  yPosition += 10;

  doc.setFont('helvetica', 'normal');
  sortedFaculties.slice(0, 8).forEach((faculty, index) => {
    checkPageBreak(7);
    if (index % 2 === 0) {
      doc.setFillColor(250, 250, 250);
      doc.rect(margin, yPosition - 4, pageWidth - 2 * margin, 7, 'F');
    }
    
    doc.text(faculty.faculty, margin + 2, yPosition);
    doc.text(faculty.students.toString(), margin + 70, yPosition);
    doc.text(faculty.totalPoints.toLocaleString(), margin + 100, yPosition);
    doc.text(faculty.avgPointsPerStudent.toFixed(0), margin + 140, yPosition);
    yPosition += 7;
  });

  yPosition += 8;

  // Faculty insights
  const topFaculty = sortedFaculties[0];
  const avgPointsAllFaculties = data.facultyData.reduce((sum, f) => sum + f.avgPointsPerStudent, 0) / data.facultyData.length;
  
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  doc.setFont('helvetica', 'italic');
  doc.text(`Insight: ${topFaculty.faculty} leads with ${topFaculty.totalPoints.toLocaleString()} total points.`, margin, yPosition);
  yPosition += 5;
  doc.text(`Average points per student across all faculties: ${avgPointsAllFaculties.toFixed(0)}`, margin, yPosition);
  yPosition += 10;

  // ========================================
  // ACTIVITY TYPE EFFECTIVENESS
  // ========================================
  checkPageBreak(50);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Activity Type Effectiveness', margin, yPosition);
  yPosition += 8;
  addSectionDivider();

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  doc.text('Analysis of different activity types and their impact on student engagement:', margin, yPosition);
  yPosition += 10;

  const activityTypes = [
    { name: 'Coursework', data: data.activityTypeBreakdown.coursework, icon: '📚' },
    { name: 'Society Activities', data: data.activityTypeBreakdown.society, icon: '🤝' },
    { name: 'Events', data: data.activityTypeBreakdown.event, icon: '🎯' },
  ];

  activityTypes.forEach((type) => {
    checkPageBreak(22);
    
    // Type header with icon
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`${type.icon} ${type.name}`, margin, yPosition);
    yPosition += 7;

    // Metrics box
    doc.setDrawColor(220, 220, 220);
    doc.setFillColor(252, 252, 252);
    doc.roundedRect(margin + 5, yPosition, pageWidth - 2 * margin - 10, 15, 1, 1, 'FD');
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    
    doc.text(`Activities: ${type.data.count}`, margin + 8, yPosition + 4);
    doc.text(`Participants: ${type.data.participants}`, margin + 8, yPosition + 9);
    doc.text(`Total Points: ${type.data.totalPoints.toLocaleString()}`, margin + 8, yPosition + 14);
    
    doc.text(`Avg Points/Activity: ${type.data.avgPoints.toFixed(0)}`, margin + 80, yPosition + 4);
    const engagementRate = type.data.count > 0 ? ((type.data.participants / type.data.count) * 100).toFixed(0) : '0';
    doc.text(`Engagement Rate: ${engagementRate}%`, margin + 80, yPosition + 9);
    const pointsPerParticipant = type.data.participants > 0 ? (type.data.totalPoints / type.data.participants).toFixed(0) : '0';
    doc.text(`Avg Points/Participant: ${pointsPerParticipant}`, margin + 80, yPosition + 14);
    
    yPosition += 18;
  });

  yPosition += 5;

  // Activity type insights
  const mostEffective = activityTypes.reduce((max, type) => 
    type.data.totalPoints > max.data.totalPoints ? type : max
  );
  
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  doc.setFont('helvetica', 'italic');
  doc.text(`Insight: ${mostEffective.name} generate the highest total impact with ${mostEffective.data.totalPoints.toLocaleString()} points.`, margin, yPosition);
  yPosition += 10;

  // ========================================
  // SDG IMPACT ANALYSIS
  // ========================================
  checkPageBreak(50);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('SDG Impact Analysis', margin, yPosition);
  yPosition += 8;
  addSectionDivider();

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  doc.text('Top Sustainable Development Goals by student participation and points contribution:', margin, yPosition);
  yPosition += 10;

  // Top 8 SDGs
  data.sdgData.slice(0, 8).forEach((sdg, index) => {
    checkPageBreak(12);
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text(`${index + 1}. SDG ${sdg.number}: ${sdg.name}`, margin, yPosition);
    yPosition += 5;
    
    // Progress bar showing percentage
    const barWidth = pageWidth - 2 * margin - 70;
    const fillWidth = (sdg.percentOfTotal / 100) * barWidth;
    
    doc.setDrawColor(200, 200, 200);
    doc.setFillColor(240, 240, 240);
    doc.roundedRect(margin + 5, yPosition - 3, barWidth, 4, 1, 1, 'FD');
    
    doc.setFillColor(255, 230, 0); // UNSW amber
    doc.roundedRect(margin + 5, yPosition - 3, fillWidth, 4, 1, 1, 'F');
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    doc.text(`${sdg.participants} participants`, margin + 10, yPosition + 6);
    doc.text(`${sdg.totalPoints.toLocaleString()} pts (${sdg.percentOfTotal.toFixed(1)}%)`, margin + barWidth - 30, yPosition + 6);
    
    yPosition += 10;
  });

  yPosition += 5;

  // SDG coverage analysis
  const totalSDGs = 17;
  const coveredSDGs = new Set(data.sdgData.map(s => s.number)).size;
  const coveragePercent = ((coveredSDGs / totalSDGs) * 100).toFixed(0);
  
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  doc.setFont('helvetica', 'italic');
  doc.text(`SDG Coverage: ${coveredSDGs} out of ${totalSDGs} goals are actively engaged (${coveragePercent}%)`, margin, yPosition);
  yPosition += 5;
  
  const underrepresented = totalSDGs - coveredSDGs;
  if (underrepresented > 0) {
    doc.text(`Opportunity: ${underrepresented} SDG goal${underrepresented > 1 ? 's' : ''} have limited or no activities.`, margin, yPosition);
  }
  yPosition += 10;

  // ========================================
  // EVENT PERFORMANCE
  // ========================================
  checkPageBreak(50);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Event Performance Analysis', margin, yPosition);
  yPosition += 8;
  addSectionDivider();

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);

  // Overall event statistics
  const overallAttendanceRate = data.overview.totalRegistered > 0 
    ? ((data.overview.totalAttended / data.overview.totalRegistered) * 100).toFixed(1)
    : '0';
  const totalCancelled = data.eventData.reduce((sum, e) => sum + e.cancelled, 0);
  const cancellationRate = data.overview.totalRegistered > 0
    ? ((totalCancelled / data.overview.totalRegistered) * 100).toFixed(1)
    : '0';

  doc.text(`Total Registrations: ${data.overview.totalRegistered.toLocaleString()}`, margin, yPosition);
  yPosition += 6;
  doc.text(`Total Attendees: ${data.overview.totalAttended.toLocaleString()}`, margin, yPosition);
  yPosition += 6;
  doc.text(`Overall Attendance Rate: ${overallAttendanceRate}%`, margin, yPosition);
  yPosition += 6;
  doc.text(`Cancellation Rate: ${cancellationRate}%`, margin, yPosition);
  yPosition += 10;

  // Top performing events
  doc.setFont('helvetica', 'bold');
  doc.text('Top 5 Events by Attendance:', margin, yPosition);
  yPosition += 7;

  const topEvents = [...data.eventData]
    .sort((a, b) => b.attended - a.attended)
    .slice(0, 5);

  topEvents.forEach((event, index) => {
    checkPageBreak(15);
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`${index + 1}. ${event.title}`, margin + 5, yPosition);
    yPosition += 5;
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    
    const metrics = [
      `Registered: ${event.registered}`,
      `Attended: ${event.attended}`,
      `Rate: ${event.attendanceRate.toFixed(0)}%`
    ];
    
    if (event.averageRating > 0) {
      metrics.push(`Rating: ${event.averageRating.toFixed(1)}/5⭐`);
    }
    
    doc.text(metrics.join('  |  '), margin + 10, yPosition);
    yPosition += 7;
  });

  yPosition += 5;

  // Event insights
  const avgRating = data.eventData.filter(e => e.averageRating > 0).length > 0
    ? data.eventData.filter(e => e.averageRating > 0).reduce((sum, e) => sum + e.averageRating, 0) / 
      data.eventData.filter(e => e.averageRating > 0).length
    : 0;

  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  doc.setFont('helvetica', 'italic');
  doc.text(`Average Event Rating: ${avgRating > 0 ? avgRating.toFixed(1) + '/5' : 'N/A'}`, margin, yPosition);
  yPosition += 5;
  
  if (parseFloat(overallAttendanceRate) < 70) {
    doc.text(`Recommendation: Attendance rate is below optimal. Consider reminder notifications or incentives.`, margin, yPosition);
  } else {
    doc.text(`Strong attendance rate indicates effective event promotion and student interest.`, margin, yPosition);
  }
  yPosition += 10;

  // ========================================
  // STRATEGIC RECOMMENDATIONS
  // ========================================
  checkPageBreak(70);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Strategic Recommendations', margin, yPosition);
  yPosition += 8;
  addSectionDivider();

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);

  const recommendations = [
    {
      category: '🎯 Engagement Optimization',
      points: [
        `Current engagement rate is ${data.engagementRate}%. Target: 75%+ for optimal participation.`,
        `Focus on faculties with lower participation rates through targeted campaigns.`,
        `Implement gamification elements to boost recurring participation.`,
      ]
    },
    {
      category: '🌍 SDG Coverage',
      points: [
        `${underrepresented > 0 ? `Expand activities for ${underrepresented} underrepresented SDG goals.` : 'Excellent SDG coverage across all 17 goals.'}`,
        `Consider partnerships with organizations aligned with less-covered SDGs.`,
        `Highlight SDG impact in student communications to increase awareness.`,
      ]
    },
    {
      category: '📈 Growth Opportunities',
      points: [
        `Most effective activity type: ${mostEffective.name} - scale similar initiatives.`,
        `Low-performing faculties could benefit from peer-led initiatives.`,
        `Create faculty-specific challenges to drive competitive engagement.`,
      ]
    },
    {
      category: '✅ Event Management',
      points: [
        parseFloat(overallAttendanceRate) < 70 
          ? `Improve attendance rate from ${overallAttendanceRate}% through reminders and incentives.`
          : `Maintain strong ${overallAttendanceRate}% attendance rate through current practices.`,
        `Monitor cancellation patterns and address common barriers to attendance.`,
        `Leverage highly-rated events as templates for future activities.`,
      ]
    },
  ];

  recommendations.forEach((section) => {
    checkPageBreak(25);
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(section.category, margin, yPosition);
    yPosition += 6;
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(70, 70, 70);
    
    section.points.forEach((point) => {
      checkPageBreak(6);
      doc.text('•', margin + 5, yPosition);
      const lines = doc.splitTextToSize(point, pageWidth - 2 * margin - 15);
      doc.text(lines, margin + 10, yPosition);
      yPosition += lines.length * 5;
    });
    
    yPosition += 5;
  });

  // ========================================
  // CONCLUSION
  // ========================================
  checkPageBreak(40);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Conclusion', margin, yPosition);
  yPosition += 8;
  addSectionDivider();

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);

  const conclusionText = [
    `The SDGgo! platform demonstrates strong student engagement with ${data.overview.totalStudents.toLocaleString()} active participants`,
    `contributing to the UN Sustainable Development Goals. With ${data.overview.totalPoints.toLocaleString()} points awarded across`,
    `${data.overview.totalActivities.toLocaleString()} activities, the platform is making measurable impact.`,
    '',
    `Key strengths include ${topFaculty.faculty}'s leadership in participation, strong event attendance rates,`,
    `and comprehensive SDG coverage. Opportunities for growth lie in scaling successful ${mostEffective.name.toLowerCase()},`,
    `improving engagement in underperforming areas, and expanding coverage of underrepresented SDG goals.`,
    '',
    `Continued focus on these strategic priorities will enhance the platform's impact and support UNSW's`,
    `commitment to sustainable development and social responsibility.`,
  ];

  conclusionText.forEach(line => {
    checkPageBreak(6);
    doc.text(line, margin, yPosition);
    yPosition += 5;
  });

  // ========================================
  // FOOTER ON ALL PAGES
  // ========================================
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    
    // Page number
    doc.text(
      `Page ${i} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
    
    // Confidentiality notice
    doc.text(
      'UNSW SDGgo! Platform - Confidential Report',
      pageWidth / 2,
      pageHeight - 5,
      { align: 'center' }
    );
  }

  // Generate filename with timestamp
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `SDGgo-Analytics-Report-${timestamp}.pdf`;

  // Save the PDF
  doc.save(filename);
}
