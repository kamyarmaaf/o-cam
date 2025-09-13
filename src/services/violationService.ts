interface ViolationReport {
  studentId: string;
  studentName: string;
  examId: string;
  examTitle: string;
  timestamp: Date;
  violationType: 'multiple_faces' | 'no_face' | 'suspicious_activity' | 'face_mismatch';
  faceCount: number;
  screenshot?: string;
  violationNumber: number;
  additionalData?: any;
}

interface AdminNotification {
  id: string;
  type: 'violation' | 'ejection';
  studentId: string;
  studentName: string;
  examId: string;
  examTitle: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
  details: string;
  screenshot?: string;
  isRead: boolean;
}

class ViolationService {
  private violations: ViolationReport[] = [];
  private adminNotifications: AdminNotification[] = [];

  // Record a violation
  recordViolation(violationData: {
    studentId: string;
    studentName: string;
    examId: string;
    examTitle: string;
    faceCount: number;
    screenshot?: string;
    violationNumber: number;
  }): ViolationReport {
    const violation: ViolationReport = {
      ...violationData,
      timestamp: new Date(),
      violationType: 'multiple_faces'
    };

    this.violations.push(violation);

    // Create admin notification
    this.createAdminNotification(violation);

    // Log violation for debugging
    console.log('Violation recorded:', violation);

    return violation;
  }

  // Create admin notification
  private createAdminNotification(violation: ViolationReport): void {
    const notification: AdminNotification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: violation.violationNumber >= 3 ? 'ejection' : 'violation',
      studentId: violation.studentId,
      studentName: violation.studentName,
      examId: violation.examId,
      examTitle: violation.examTitle,
      timestamp: violation.timestamp,
      severity: this.getSeverityLevel(violation.violationNumber),
      details: this.generateViolationDetails(violation),
      screenshot: violation.screenshot,
      isRead: false
    };

    this.adminNotifications.push(notification);

    // In a real application, this would send to the server
    this.sendToAdmin(notification);
  }

  // Determine severity level based on violation number
  private getSeverityLevel(violationNumber: number): 'low' | 'medium' | 'high' | 'critical' {
    if (violationNumber >= 3) return 'critical';
    if (violationNumber === 2) return 'high';
    if (violationNumber === 1) return 'medium';
    return 'low';
  }

  // Generate violation details message
  private generateViolationDetails(violation: ViolationReport): string {
    const { faceCount, violationNumber, timestamp } = violation;
    
    if (violationNumber >= 3) {
      return `دانشجو پس از ${violationNumber} تخلف از آزمون حذف شد. آخرین تخلف: ${faceCount} چهره در تصویر شناسایی شد.`;
    }
    
    return `تخلف شماره ${violationNumber}: ${faceCount} چهره در تصویر شناسایی شد در تاریخ ${timestamp.toLocaleString('fa-IR')}.`;
  }

  // Send notification to admin (mock implementation)
  private sendToAdmin(notification: AdminNotification): void {
    // In a real application, this would be an API call
    console.log('Sending to admin:', notification);
    
    // Store in localStorage for demo purposes
    const existingNotifications = JSON.parse(localStorage.getItem('adminNotifications') || '[]');
    existingNotifications.push(notification);
    localStorage.setItem('adminNotifications', JSON.stringify(existingNotifications));

    // Trigger browser notification if permission granted
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`تخلف در آزمون - ${notification.studentName}`, {
        body: notification.details,
        icon: '/vite.svg',
        tag: `violation_${notification.studentId}`
      });
    }
  }

  // Eject student from exam
  ejectStudent(studentData: {
    studentId: string;
    studentName: string;
    examId: string;
    examTitle: string;
    totalViolations: number;
  }): void {
    const ejectionNotification: AdminNotification = {
      id: `ejection_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'ejection',
      studentId: studentData.studentId,
      studentName: studentData.studentName,
      examId: studentData.examId,
      examTitle: studentData.examTitle,
      timestamp: new Date(),
      severity: 'critical',
      details: `دانشجو ${studentData.studentName} به دلیل ${studentData.totalViolations} تخلف از آزمون ${studentData.examTitle} حذف شد.`,
      isRead: false
    };

    this.adminNotifications.push(ejectionNotification);
    this.sendToAdmin(ejectionNotification);

    console.log('Student ejected:', studentData);
  }

  // Get all violations for a student
  getStudentViolations(studentId: string): ViolationReport[] {
    return this.violations.filter(v => v.studentId === studentId);
  }

  // Get all violations for an exam
  getExamViolations(examId: string): ViolationReport[] {
    return this.violations.filter(v => v.examId === examId);
  }

  // Get admin notifications
  getAdminNotifications(): AdminNotification[] {
    return this.adminNotifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // Mark notification as read
  markNotificationAsRead(notificationId: string): void {
    const notification = this.adminNotifications.find(n => n.id === notificationId);
    if (notification) {
      notification.isRead = true;
    }
  }

  // Get unread notification count
  getUnreadNotificationCount(): number {
    return this.adminNotifications.filter(n => !n.isRead).length;
  }
}

// Export singleton instance
export const violationService = new ViolationService();

// Request notification permission on load
if ('Notification' in window && Notification.permission === 'default') {
  Notification.requestPermission();
}