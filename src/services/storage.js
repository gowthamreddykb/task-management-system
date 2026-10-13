import {
  DEMO_USER,
  DEMO_PROFILE,
  SECONDARY_USER,
  INITIAL_CATEGORIES,
  INITIAL_TASKS,
  INITIAL_NOTIFICATIONS,
  INITIAL_ACTIVITY_LOGS
} from "../data/initialData";
const STORAGE_KEYS = {
  CURRENT_USER: "taskflow_current_user_v1",
  USERS: "taskflow_users_v1",
  PROFILES: "taskflow_profiles_v1",
  CATEGORIES: "taskflow_categories_v1",
  TASKS: "taskflow_tasks_v1",
  NOTIFICATIONS: "taskflow_notifications_v1",
  REMINDERS: "taskflow_reminders_v1",
  ACTIVITY_LOGS: "taskflow_activity_v1",
  SENT_EMAILS: "taskflow_sent_emails_v1",
  THEME: "taskflow_theme_v1"
};
class StorageService {
  listeners = [];
  constructor() {
    this.initData();
  }
  initData() {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([DEMO_USER, SECONDARY_USER]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PROFILES)) {
      localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify([DEMO_PROFILE]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(DEMO_USER));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.TASKS)) {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(INITIAL_TASKS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ACTIVITY_LOGS)) {
      localStorage.setItem(STORAGE_KEYS.ACTIVITY_LOGS, JSON.stringify(INITIAL_ACTIVITY_LOGS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SENT_EMAILS)) {
      localStorage.setItem(STORAGE_KEYS.SENT_EMAILS, JSON.stringify([
        {
          id: "email_001",
          recipient_email: DEMO_USER.email,
          recipient_name: `${DEMO_USER.first_name} ${DEMO_USER.last_name}`,
          task_id: "task_002",
          task_title: "Configure Celery & Redis for 24h Deadline Email Reminders",
          subject: "[TaskFlow Alert] Deadline Reminder: Configure Celery & Redis for 24h Deadline Email Reminders",
          body_html: `<div style="font-family: sans-serif; color: #1e293b; padding: 20px;">
            <h2 style="color: #4f46e5;">TaskFlow Deadline Reminder</h2>
            <p>Hi Alex,</p>
            <p>Your task <strong>Configure Celery & Redis for 24h Deadline Email Reminders</strong> is due in approximately 24 hours.</p>
            <p><strong>Priority:</strong> HIGH<br><strong>Status:</strong> TODO</p>
            <p>Please log in to your TaskFlow dashboard to update your progress.</p>
            <hr style="border: 1px solid #e2e8f0; margin: 20px 0;">
            <p style="font-size: 12px; color: #64748b;">TaskFlow Notification Service (SMTP / Celery Beat Dispatcher)</p>
          </div>`,
          sent_at: new Date(Date.now() - 4 * 36e5).toISOString(),
          status: "DELIVERED",
          trigger_reason: "24H_DEADLINE_APPROACHING"
        }
      ]));
    }
  }
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }
  notify() {
    this.listeners.forEach((l) => l());
  }
  // --- User & Profile ---
  getCurrentUser() {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return raw ? JSON.parse(raw) : DEMO_USER;
  }
  setCurrentUser(user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    this.notify();
  }
  getUsers() {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    return raw ? JSON.parse(raw) : [DEMO_USER];
  }
  getProfile(userId) {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILES);
    const profiles = raw ? JSON.parse(raw) : [DEMO_PROFILE];
    let profile = profiles.find((p) => p.user_id === userId);
    if (!profile) {
      profile = {
        id: `prof_${userId}`,
        user_id: userId,
        theme: "system",
        timezone: "UTC",
        role: "Team Member",
        email_notifications_enabled: true,
        reminder_hours_before: 24,
        created_at: (/* @__PURE__ */ new Date()).toISOString(),
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      };
      profiles.push(profile);
      localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles));
    }
    return profile;
  }
  updateProfile(updated) {
    const user = this.getCurrentUser();
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILES);
    const profiles = raw ? JSON.parse(raw) : [];
    const index = profiles.findIndex((p) => p.user_id === user.id);
    if (index >= 0) {
      profiles[index] = { ...profiles[index], ...updated, updated_at: (/* @__PURE__ */ new Date()).toISOString() };
    } else {
      profiles.push({
        ...this.getProfile(user.id),
        ...updated,
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      });
    }
    localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles));
    this.notify();
  }
  updateCurrentUser(details) {
    const user = this.getCurrentUser();
    const updated = { ...user, ...details };
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(updated));
    const users = this.getUsers().map((u) => u.id === user.id ? updated : u);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    this.notify();
  }
  // --- Categories ---
  getCategories() {
    const user = this.getCurrentUser();
    const raw = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    const all = raw ? JSON.parse(raw) : [];
    return all.filter((c) => c.user_id === user.id);
  }
  addCategory(cat) {
    const user = this.getCurrentUser();
    const raw = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    const all = raw ? JSON.parse(raw) : [];
    const newCat = {
      ...cat,
      id: `cat_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      user_id: user.id,
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    all.push(newCat);
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(all));
    this.logActivity("CREATED", `Created new category "${newCat.name}"`);
    this.notify();
    return newCat;
  }
  updateCategory(id, updates) {
    const user = this.getCurrentUser();
    const raw = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    const all = raw ? JSON.parse(raw) : [];
    const index = all.findIndex((c) => c.id === id && c.user_id === user.id);
    if (index >= 0) {
      all[index] = { ...all[index], ...updates };
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(all));
      this.logActivity("UPDATED", `Updated category "${all[index].name}"`);
      this.notify();
    }
  }
  deleteCategory(id) {
    const user = this.getCurrentUser();
    const raw = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    let all = raw ? JSON.parse(raw) : [];
    const target = all.find((c) => c.id === id && c.user_id === user.id);
    if (target) {
      all = all.filter((c) => c.id !== id);
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(all));
      const tasksRaw = localStorage.getItem(STORAGE_KEYS.TASKS);
      if (tasksRaw) {
        const tasks = JSON.parse(tasksRaw);
        const updatedTasks = tasks.map((t) => t.category_id === id ? { ...t, category_id: void 0 } : t);
        localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(updatedTasks));
      }
      this.logActivity("DELETED", `Deleted category "${target.name}"`);
      this.notify();
    }
  }
  // --- Tasks ---
  getTasks() {
    const user = this.getCurrentUser();
    const raw = localStorage.getItem(STORAGE_KEYS.TASKS);
    const all = raw ? JSON.parse(raw) : [];
    return all.filter((t) => t.user_id === user.id);
  }
  getTask(id) {
    const user = this.getCurrentUser();
    return this.getTasks().find((t) => t.id === id && t.user_id === user.id);
  }
  addTask(taskData) {
    const user = this.getCurrentUser();
    const raw = localStorage.getItem(STORAGE_KEYS.TASKS);
    const all = raw ? JSON.parse(raw) : [];
    const nowIso = (/* @__PURE__ */ new Date()).toISOString();
    const newTask = {
      ...taskData,
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      user_id: user.id,
      created_at: nowIso,
      updated_at: nowIso,
      completed_at: taskData.status === "COMPLETED" ? nowIso : void 0
    };
    all.push(newTask);
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(all));
    this.logActivity("CREATED", `Created task "${newTask.title}"`, newTask.id, newTask.title);
    this.notify();
    return newTask;
  }
  updateTask(id, updates) {
    const user = this.getCurrentUser();
    const raw = localStorage.getItem(STORAGE_KEYS.TASKS);
    const all = raw ? JSON.parse(raw) : [];
    const index = all.findIndex((t) => t.id === id && t.user_id === user.id);
    if (index >= 0) {
      const prev = all[index];
      const nowIso = (/* @__PURE__ */ new Date()).toISOString();
      const isNewlyCompleted = updates.status === "COMPLETED" && prev.status !== "COMPLETED";
      const isReopened = updates.status && updates.status !== "COMPLETED" && prev.status === "COMPLETED";
      const updatedTask = {
        ...prev,
        ...updates,
        updated_at: nowIso,
        completed_at: isNewlyCompleted ? nowIso : isReopened ? void 0 : prev.completed_at
      };
      all[index] = updatedTask;
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(all));
      if (updates.status && updates.status !== prev.status) {
        this.logActivity("STATUS_CHANGED", `Changed status from ${prev.status} to ${updates.status}`, id, updatedTask.title);
        if (updates.status === "COMPLETED") {
          this.addNotification({
            task_id: id,
            title: "Task Completed",
            message: `"${updatedTask.title}" has been marked as Completed.`,
            notification_type: "TASK_COMPLETED"
          });
        }
      } else {
        this.logActivity("UPDATED", `Updated task details`, id, updatedTask.title);
      }
      this.notify();
      return updatedTask;
    }
    return null;
  }
  updateTaskStatus(id, status) {
    const task = this.updateTask(id, { status });
    return !!task;
  }
  deleteTask(id) {
    const user = this.getCurrentUser();
    const raw = localStorage.getItem(STORAGE_KEYS.TASKS);
    let all = raw ? JSON.parse(raw) : [];
    const target = all.find((t) => t.id === id && t.user_id === user.id);
    if (target) {
      all = all.filter((t) => t.id !== id);
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(all));
      this.logActivity("DELETED", `Deleted task "${target.title}"`, id, target.title);
      this.notify();
      return true;
    }
    return false;
  }
  // --- Filtering & Sorting ---
  filterTasks(filters) {
    let tasks = this.getTasks();
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      tasks = tasks.filter(
        (t) => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
      );
    }
    if (filters.status !== "ALL") {
      tasks = tasks.filter((t) => t.status === filters.status);
    }
    if (filters.category_id !== "ALL") {
      tasks = tasks.filter((t) => t.category_id === filters.category_id);
    }
    if (filters.priority !== "ALL") {
      tasks = tasks.filter((t) => t.priority === filters.priority);
    }
    const now = /* @__PURE__ */ new Date();
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    const nextWeekEnd = new Date(now.getTime() + 7 * 864e5);
    if (filters.date_filter === "OVERDUE") {
      tasks = tasks.filter((t) => t.status !== "COMPLETED" && new Date(t.due_date) < now);
    } else if (filters.date_filter === "TODAY") {
      tasks = tasks.filter((t) => {
        const d = new Date(t.due_date);
        return d >= new Date(now.getFullYear(), now.getMonth(), now.getDate()) && d <= todayEnd;
      });
    } else if (filters.date_filter === "UPCOMING_WEEK") {
      tasks = tasks.filter((t) => {
        const d = new Date(t.due_date);
        return d >= now && d <= nextWeekEnd && t.status !== "COMPLETED";
      });
    } else if (filters.date_filter === "COMPLETED") {
      tasks = tasks.filter((t) => t.status === "COMPLETED");
    }
    const priorityWeight = {
      URGENT: 4,
      HIGH: 3,
      MEDIUM: 2,
      LOW: 1
    };
    tasks.sort((a, b) => {
      switch (filters.sort_by) {
        case "due_date_asc":
          return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
        case "due_date_desc":
          return new Date(b.due_date).getTime() - new Date(a.due_date).getTime();
        case "priority_desc":
          return priorityWeight[b.priority] - priorityWeight[a.priority];
        case "created_at_desc":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "title_asc":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
    return tasks;
  }
  // --- Statistics & Aggregations ---
  getStatistics() {
    const tasks = this.getTasks();
    const now = /* @__PURE__ */ new Date();
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === "COMPLETED").length;
    const inProgress = tasks.filter((t) => t.status === "IN_PROGRESS").length;
    const todo = tasks.filter((t) => t.status === "TODO").length;
    const overdue = tasks.filter((t) => t.status !== "COMPLETED" && new Date(t.due_date) < now).length;
    const completionRate = total > 0 ? Math.round(completed / total * 100) : 0;
    const next48h = new Date(now.getTime() + 48 * 36e5);
    const upcomingTasks = tasks.filter((t) => t.status !== "COMPLETED" && new Date(t.due_date) >= now && new Date(t.due_date) <= next48h).sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());
    return {
      total,
      completed,
      inProgress,
      todo,
      overdue,
      completionRate,
      upcomingTasks
    };
  }
  // --- Notifications & Email Reminders ---
  getNotifications() {
    const user = this.getCurrentUser();
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    const all = raw ? JSON.parse(raw) : [];
    return all.filter((n) => n.user_id === user.id).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }
  getUnreadNotificationCount() {
    return this.getNotifications().filter((n) => !n.is_read).length;
  }
  addNotification(data) {
    const user = this.getCurrentUser();
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    const all = raw ? JSON.parse(raw) : [];
    const notif = {
      ...data,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      user_id: user.id,
      is_read: false,
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    all.unshift(notif);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(all));
    this.notify();
  }
  markNotificationAsRead(id) {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (!raw) return;
    const all = JSON.parse(raw);
    const index = all.findIndex((n) => n.id === id);
    if (index >= 0) {
      all[index].is_read = true;
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(all));
      this.notify();
    }
  }
  markAllNotificationsAsRead() {
    const user = this.getCurrentUser();
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (!raw) return;
    const all = JSON.parse(raw);
    all.forEach((n) => {
      if (n.user_id === user.id) n.is_read = true;
    });
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(all));
    this.notify();
  }
  clearAllNotifications() {
    const user = this.getCurrentUser();
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (!raw) return;
    const all = JSON.parse(raw);
    const remaining = all.filter((n) => n.user_id !== user.id);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(remaining));
    this.notify();
  }
  // --- Email Reminder Dispatcher Simulation ---
  getSentEmails() {
    const raw = localStorage.getItem(STORAGE_KEYS.SENT_EMAILS);
    return raw ? JSON.parse(raw) : [];
  }
  checkAndDispatchDeadlineReminders() {
    const user = this.getCurrentUser();
    const profile = this.getProfile(user.id);
    if (!profile.email_notifications_enabled) {
      return { dispatchedCount: 0, reminders: [] };
    }
    const tasks = this.getTasks();
    const now = /* @__PURE__ */ new Date();
    const reminderHours = profile.reminder_hours_before || 24;
    const horizonMs = reminderHours * 36e5;
    const sentEmails = this.getSentEmails();
    const dispatched = [];
    tasks.forEach((task) => {
      if (task.status === "COMPLETED") return;
      const dueDate = new Date(task.due_date);
      const diffMs = dueDate.getTime() - now.getTime();
      const alreadySent = sentEmails.some(
        (e) => e.task_id === task.id && (/* @__PURE__ */ new Date()).getTime() - new Date(e.sent_at).getTime() < 24 * 36e5
      );
      if (diffMs > 0 && diffMs <= horizonMs && !alreadySent) {
        const hoursLeft = Math.max(1, Math.round(diffMs / 36e5));
        const email = {
          id: `email_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          recipient_email: user.email,
          recipient_name: `${user.first_name} ${user.last_name}`,
          task_id: task.id,
          task_title: task.title,
          subject: `[TaskFlow Alert] Due in ${hoursLeft}h: ${task.title}`,
          body_html: `
            <div style="font-family: Arial, sans-serif; background-color: #f8fafc; padding: 24px; border-radius: 8px;">
              <div style="background-color: #ffffff; padding: 24px; border-radius: 8px; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                <div style="display: flex; align-items: center; margin-bottom: 16px;">
                  <span style="background-color: #4f46e5; color: white; padding: 6px 12px; border-radius: 6px; font-weight: bold; font-size: 14px;">TaskFlow</span>
                  <span style="color: #64748b; margin-left: 12px; font-size: 13px;">Automated Deadline Alert</span>
                </div>
                <h2 style="color: #0f172a; margin-top: 0;">Task Deadline Approaching!</h2>
                <p style="color: #334155; font-size: 15px;">Hello <strong>${user.first_name}</strong>,</p>
                <p style="color: #334155; font-size: 14px;">This is an automated notification from TaskFlow background scheduler (Celery / Django Management Command).</p>
                
                <div style="background-color: #f1f5f9; border-left: 4px solid #6366f1; padding: 16px; margin: 16px 0; border-radius: 0 6px 6px 0;">
                  <h3 style="margin: 0 0 8px 0; color: #1e293b;">${task.title}</h3>
                  <p style="margin: 0 0 8px 0; color: #475569; font-size: 14px;">${task.description || "No description provided."}</p>
                  <div style="font-size: 13px; color: #334155;">
                    <div><strong>Priority:</strong> <span style="color: ${task.priority === "URGENT" ? "#dc2626" : task.priority === "HIGH" ? "#ea580c" : "#4f46e5"}; font-weight: bold;">${task.priority}</span></div>
                    <div><strong>Status:</strong> ${task.status}</div>
                    <div><strong>Due Date:</strong> ${dueDate.toLocaleString()} (in ~${hoursLeft} hours)</div>
                  </div>
                </div>

                <p style="color: #64748b; font-size: 13px;">Please complete or update this task before the deadline expires.</p>
                <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;">
                <p style="font-size: 11px; color: #94a3b8; margin: 0;">Sent via TaskFlow Django Email Backend (SMTP: ${user.email})</p>
              </div>
            </div>
          `,
          sent_at: (/* @__PURE__ */ new Date()).toISOString(),
          status: "DELIVERED",
          trigger_reason: "24H_DEADLINE_APPROACHING"
        };
        sentEmails.unshift(email);
        dispatched.push(email);
        this.addNotification({
          task_id: task.id,
          title: `Upcoming Deadline (${hoursLeft}h left)`,
          message: `Task "${task.title}" is due soon. Reminder email sent to ${user.email}.`,
          notification_type: "DEADLINE_WARNING"
        });
        this.logActivity("REMINDER_SENT", `Automated deadline email reminder sent to ${user.email}`, task.id, task.title);
      }
    });
    if (dispatched.length > 0) {
      localStorage.setItem(STORAGE_KEYS.SENT_EMAILS, JSON.stringify(sentEmails));
      this.notify();
    }
    return { dispatchedCount: dispatched.length, reminders: dispatched };
  }
  // --- Activity Log ---
  getActivityLogs() {
    const user = this.getCurrentUser();
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVITY_LOGS);
    const all = raw ? JSON.parse(raw) : [];
    return all.filter((a) => a.user_id === user.id).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
  logActivity(action, details, taskId, taskTitle) {
    const user = this.getCurrentUser();
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVITY_LOGS);
    const all = raw ? JSON.parse(raw) : [];
    const log = {
      id: `act_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      user_id: user.id,
      task_id: taskId,
      task_title: taskTitle,
      action,
      details,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
    all.unshift(log);
    if (all.length > 100) all.length = 100;
    localStorage.setItem(STORAGE_KEYS.ACTIVITY_LOGS, JSON.stringify(all));
  }
  // --- Reset to Demo Data ---
  resetToDemoData() {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([DEMO_USER, SECONDARY_USER]));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(DEMO_USER));
    localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify([DEMO_PROFILE]));
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(INITIAL_TASKS));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
    localStorage.setItem(STORAGE_KEYS.ACTIVITY_LOGS, JSON.stringify(INITIAL_ACTIVITY_LOGS));
    localStorage.removeItem(STORAGE_KEYS.SENT_EMAILS);
    this.initData();
    this.notify();
  }
}
export const storageService = new StorageService();
