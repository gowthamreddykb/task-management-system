export const DEMO_USER = {
  id: "usr_intern_01",
  username: "alex_intern",
  email: "alex.rivera@internship.dev",
  first_name: "Alex",
  last_name: "Rivera",
  date_joined: "2026-09-15T09:00:00Z"
};
export const DEMO_PROFILE = {
  id: "prof_intern_01",
  user_id: "usr_intern_01",
  avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
  theme: "system",
  timezone: "America/New_York (UTC-5)",
  role: "Full-Stack Software Engineering Intern",
  bio: "Building scalable productivity tooling for the internship capstone project.",
  email_notifications_enabled: true,
  reminder_hours_before: 24,
  created_at: "2026-09-15T09:00:00Z",
  updated_at: "2026-10-01T12:00:00Z"
};
export const SECONDARY_USER = {
  id: "usr_mentor_02",
  username: "sarah_mentor",
  email: "sarah.chen@techcorp.com",
  first_name: "Sarah",
  last_name: "Chen",
  date_joined: "2026-08-01T09:00:00Z"
};
export const INITIAL_CATEGORIES = [
  {
    id: "cat_frontend",
    user_id: "usr_intern_01",
    name: "Frontend UI",
    description: "User interface components, responsive layout, Tailwind styles",
    color: "#6366f1",
    // Indigo
    icon: "Layout",
    created_at: "2026-09-16T10:00:00Z"
  },
  {
    id: "cat_backend",
    user_id: "usr_intern_01",
    name: "Backend API",
    description: "Django REST endpoints, views, forms, business logic",
    color: "#8b5cf6",
    // Violet
    icon: "Server",
    created_at: "2026-09-16T10:05:00Z"
  },
  {
    id: "cat_database",
    user_id: "usr_intern_01",
    name: "Database & Models",
    description: "MySQL schema migrations, indexing, constraints",
    color: "#06b6d4",
    // Cyan
    icon: "Database",
    created_at: "2026-09-16T10:10:00Z"
  },
  {
    id: "cat_testing",
    user_id: "usr_intern_01",
    name: "Testing & QA",
    description: "Django TestCase, assertions, client test runs",
    color: "#10b981",
    // Emerald
    icon: "CheckCircle2",
    created_at: "2026-09-16T10:15:00Z"
  },
  {
    id: "cat_security",
    user_id: "usr_intern_01",
    name: "Security & Auth",
    description: "CSRF, authentication cookies, permissions, ownership check",
    color: "#f59e0b",
    // Amber
    icon: "Shield",
    created_at: "2026-09-16T10:20:00Z"
  },
  {
    id: "cat_docs",
    user_id: "usr_intern_01",
    name: "Documentation",
    description: "Architecture diagrams, PDF reports, README instructions",
    color: "#ec4899",
    // Pink
    icon: "FileText",
    created_at: "2026-09-16T10:25:00Z"
  }
];
const now = /* @__PURE__ */ new Date();
const addDays = (days, hours = 0) => {
  const d = new Date(now.getTime() + days * 864e5 + hours * 36e5);
  return d.toISOString();
};
export const INITIAL_TASKS = [
  {
    id: "task_001",
    user_id: "usr_intern_01",
    title: "Implement Interactive Kanban Board with HTML5 Drag-and-Drop",
    description: "Allow tasks to be smoothly dragged between To Do, In Progress, and Completed columns with optimistic updates and immediate persistence.",
    category_id: "cat_frontend",
    status: "IN_PROGRESS",
    priority: "URGENT",
    start_date: addDays(-3),
    due_date: addDays(0, 5),
    // due today in 5 hours!
    created_at: addDays(-4),
    updated_at: addDays(-1)
  },
  {
    id: "task_002",
    user_id: "usr_intern_01",
    title: "Configure Celery & Redis for 24h Deadline Email Reminders",
    description: "Automate periodic task reminder checks that trigger SMTP emails 24 hours prior to due dates, with duplicate delivery safeguards.",
    category_id: "cat_backend",
    status: "TODO",
    priority: "HIGH",
    start_date: addDays(-1),
    due_date: addDays(1, 2),
    // due tomorrow (within 24-26h!)
    created_at: addDays(-2),
    updated_at: addDays(-2)
  },
  {
    id: "task_003",
    user_id: "usr_intern_01",
    title: "Generate Professional PDF Reports using ReportLab / jsPDF",
    description: "Build formatted task export with company header, category breakdown, statistics summary, and formatted table grid.",
    category_id: "cat_docs",
    status: "TODO",
    priority: "MEDIUM",
    start_date: addDays(0),
    due_date: addDays(3),
    created_at: addDays(-1),
    updated_at: addDays(-1)
  },
  {
    id: "task_004",
    user_id: "usr_intern_01",
    title: "Set Up MySQL Schema with Foreign Key Constraints & Indexes",
    description: "Define UserProfile, Category, Task, Reminder, and Notification models with clean deletion cascade policies and indexes on owner + status.",
    category_id: "cat_database",
    status: "COMPLETED",
    priority: "HIGH",
    start_date: addDays(-7),
    due_date: addDays(-3),
    completed_at: addDays(-3),
    created_at: addDays(-7),
    updated_at: addDays(-3)
  },
  {
    id: "task_005",
    user_id: "usr_intern_01",
    title: "Implement Django User Authentication & Session Security",
    description: "Provide user registration, login, logout, password change, CSRF protection, and strictly enforce task ownership isolation.",
    category_id: "cat_security",
    status: "COMPLETED",
    priority: "URGENT",
    start_date: addDays(-6),
    due_date: addDays(-2),
    completed_at: addDays(-2),
    created_at: addDays(-6),
    updated_at: addDays(-2)
  },
  {
    id: "task_006",
    user_id: "usr_intern_01",
    title: "Write Automated Test Suite for Task & Category CRUD Operations",
    description: "Add Django TestCase tests validating ownership security, invalid form inputs, Kanban status transitions, and export content.",
    category_id: "cat_testing",
    status: "IN_PROGRESS",
    priority: "HIGH",
    start_date: addDays(-2),
    due_date: addDays(2),
    created_at: addDays(-3),
    updated_at: addDays(0)
  },
  {
    id: "task_007",
    user_id: "usr_intern_01",
    title: "Design Chart.js Productivity Analytics Dashboard",
    description: "Integrate status doughnut chart, weekly completion velocity bar chart, and category distribution with responsive dark mode support.",
    category_id: "cat_frontend",
    status: "IN_PROGRESS",
    priority: "MEDIUM",
    start_date: addDays(-1),
    due_date: addDays(1, 8),
    created_at: addDays(-2),
    updated_at: addDays(0)
  },
  {
    id: "task_008",
    user_id: "usr_intern_01",
    title: "Review Overdue Task Notification Dispatcher",
    description: "Verify behavior when a task surpasses due date: update overdue badge, send alert to in-app notification center, and flag on dashboard.",
    category_id: "cat_backend",
    status: "TODO",
    priority: "LOW",
    start_date: addDays(-4),
    due_date: addDays(-1),
    // OVERDUE!
    created_at: addDays(-5),
    updated_at: addDays(-4)
  },
  {
    id: "task_009",
    user_id: "usr_intern_01",
    title: "Build CSV Data Export with RFC 4180 Escaping",
    description: "Allow filtered and full export of task lists with title, description, category, priority, status, created, updated, and due dates.",
    category_id: "cat_docs",
    status: "COMPLETED",
    priority: "MEDIUM",
    start_date: addDays(-4),
    due_date: addDays(-1),
    completed_at: addDays(-1),
    created_at: addDays(-4),
    updated_at: addDays(-1)
  }
];
export const INITIAL_NOTIFICATIONS = [
  {
    id: "notif_001",
    user_id: "usr_intern_01",
    task_id: "task_001",
    title: "Upcoming Deadline Alert (Today)",
    message: 'Task "Implement Interactive Kanban Board" is due today in 5 hours!',
    notification_type: "DEADLINE_WARNING",
    is_read: false,
    created_at: addDays(0, -2)
  },
  {
    id: "notif_002",
    user_id: "usr_intern_01",
    task_id: "task_002",
    title: "24-Hour Deadline Reminder Sent",
    message: 'An automated email reminder was dispatched for "Configure Celery & Redis".',
    notification_type: "DEADLINE_WARNING",
    is_read: false,
    created_at: addDays(0, -4)
  },
  {
    id: "notif_003",
    user_id: "usr_intern_01",
    task_id: "task_009",
    title: "Task Completed",
    message: 'Task "Build CSV Data Export" was marked as completed.',
    notification_type: "TASK_COMPLETED",
    is_read: true,
    created_at: addDays(-1)
  },
  {
    id: "notif_004",
    user_id: "usr_intern_01",
    title: "Welcome to TaskFlow",
    message: "Your internship productivity workspace has been initialized successfully.",
    notification_type: "SYSTEM",
    is_read: true,
    created_at: addDays(-7)
  }
];
export const INITIAL_ACTIVITY_LOGS = [
  {
    id: "act_001",
    user_id: "usr_intern_01",
    task_id: "task_001",
    task_title: "Implement Interactive Kanban Board with HTML5 Drag-and-Drop",
    action: "STATUS_CHANGED",
    details: "Moved from TODO to IN_PROGRESS",
    timestamp: addDays(-1, 2)
  },
  {
    id: "act_002",
    user_id: "usr_intern_01",
    task_id: "task_009",
    task_title: "Build CSV Data Export with RFC 4180 Escaping",
    action: "STATUS_CHANGED",
    details: "Marked as COMPLETED",
    timestamp: addDays(-1)
  },
  {
    id: "act_003",
    user_id: "usr_intern_01",
    task_id: "task_002",
    task_title: "Configure Celery & Redis for 24h Deadline Email Reminders",
    action: "REMINDER_SENT",
    details: "Simulated SMTP reminder email dispatched to alex.rivera@internship.dev",
    timestamp: addDays(0, -4)
  },
  {
    id: "act_004",
    user_id: "usr_intern_01",
    task_id: "task_006",
    task_title: "Write Automated Test Suite for Task & Category CRUD Operations",
    action: "CREATED",
    details: "Created new task in Testing & QA",
    timestamp: addDays(-3)
  }
];
