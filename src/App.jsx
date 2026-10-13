import { useState, useEffect } from "react";
import { Navbar } from "./components/layout/Navbar";
import { Sidebar } from "./components/layout/Sidebar";
import { DashboardView } from "./components/dashboard/DashboardView";
import { KanbanBoard } from "./components/kanban/KanbanBoard";
import { TaskList } from "./components/tasks/TaskList";
import { TaskModal } from "./components/tasks/TaskModal";
import { TaskDetailModal } from "./components/tasks/TaskDetailModal";
import { CategoryManager } from "./components/categories/CategoryManager";
import { NotificationDrawer } from "./components/notifications/NotificationDrawer";
import { EmailSimulatorModal } from "./components/notifications/EmailSimulatorModal";
import { ReportsExportView } from "./components/reports/ReportsExportView";
import { UserProfileModal } from "./components/accounts/UserProfileModal";
import { AuthView } from "./components/accounts/AuthView";
import { storageService } from "./services/storage";
import { Trash2 } from "lucide-react";
export default function App() {
  const [currentUser, setCurrentUser] = useState(storageService.getCurrentUser());
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("taskflow_auth_state") === "true";
  });
  const [profile, setProfile] = useState(storageService.getProfile(currentUser?.id || "default"));
  const [tasks, setTasks] = useState(storageService.getTasks());
  const [categories, setCategories] = useState(storageService.getCategories());
  const [notifications, setNotifications] = useState(storageService.getNotifications());
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("taskflow_theme_pref");
    if (saved === "dark") return true;
    if (saved === "light") return false;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskModalDefaultStatus, setTaskModalDefaultStatus] = useState("TODO");
  const [selectedTaskDetail, setSelectedTaskDetail] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isEmailSimulatorOpen, setIsEmailSimulatorOpen] = useState(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  useEffect(() => {
    const unsubscribe = storageService.subscribe(() => {
      const u = storageService.getCurrentUser();
      setCurrentUser(u);
      setProfile(storageService.getProfile(u.id));
      setTasks(storageService.getTasks());
      setCategories(storageService.getCategories());
      setNotifications(storageService.getNotifications());
    });
    return unsubscribe;
  }, []);
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("taskflow_theme_pref", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("taskflow_theme_pref", "light");
    }
  }, [isDark]);
  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };
  const handleThemeChangeFromProfile = (pref) => {
    if (pref === "dark") setIsDark(true);
    else if (pref === "light") setIsDark(false);
    else setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
  };
  const handleOpenCreateTask = (defaultStatus = "TODO") => {
    setEditingTask(null);
    setTaskModalDefaultStatus(defaultStatus);
    setIsTaskModalOpen(true);
  };
  const handleOpenEditTask = (task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };
  const handleSaveTask = (taskData) => {
    if (editingTask) {
      storageService.updateTask(editingTask.id, taskData);
    } else {
      storageService.addTask(taskData);
    }
    setIsTaskModalOpen(false);
    setEditingTask(null);
  };
  const handleConfirmDeleteTask = () => {
    if (taskToDelete) {
      storageService.deleteTask(taskToDelete.id);
      setTaskToDelete(null);
      if (selectedTaskDetail?.id === taskToDelete.id) {
        setSelectedTaskDetail(null);
      }
    }
  };

  const handleLoginSuccess = (user) => {
    if (user) {
      storageService.setCurrentUser(user);
      setCurrentUser(user);
      setProfile(storageService.getProfile(user.id));
    }
    setIsAuthenticated(true);
    localStorage.setItem("taskflow_auth_state", "true");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("taskflow_auth_state");
  };

  if (!isAuthenticated) {
    return <AuthView onLoginSuccess={handleLoginSuccess} />;
  }

  const unreadNotificationCount = notifications.filter((n) => !n.is_read).length;
  return <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] transition-colors">
      {
    /* Top Navbar */
  }
      <Navbar
    activeTab={activeTab}
    onSelectTab={setActiveTab}
    isDark={isDark}
    onToggleTheme={toggleTheme}
    unreadCount={unreadNotificationCount}
    onOpenNotifications={() => setIsNotificationDrawerOpen(true)}
    currentUser={currentUser}
    onOpenProfile={() => setIsProfileModalOpen(true)}
    isSidebarOpen={isSidebarOpen}
    onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
    onOpenCreateModal={() => handleOpenCreateTask("TODO")}
    onLogout={handleLogout}
  />

      {
    /* Main Content Area */
  }
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
    activeTab={activeTab}
    onSelectTab={setActiveTab}
    isOpen={isSidebarOpen}
    onCloseMobile={() => setIsSidebarOpen(false)}
    categories={categories}
    tasks={tasks}
    onOpenCreateModal={() => handleOpenCreateTask("TODO")}
    onOpenEmailSimulator={() => setIsEmailSimulatorOpen(true)}
  />

        {
    /* Central Content Area - full spacious width on laptops without sidebar */
  }
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {activeTab === "dashboard" && <DashboardView
    tasks={tasks}
    categories={categories}
    isDark={isDark}
    onOpenCreateModal={() => handleOpenCreateTask("TODO")}
    onSelectTask={setSelectedTaskDetail}
    onNavigateTab={setActiveTab}
    onOpenEmailSimulator={() => setIsEmailSimulatorOpen(true)}
  />}

          {activeTab === "kanban" && <KanbanBoard
    tasks={tasks}
    categories={categories}
    onOpenCreateModal={handleOpenCreateTask}
    onSelectTask={setSelectedTaskDetail}
    onEditTask={handleOpenEditTask}
    onDeleteTask={setTaskToDelete}
  />}

          {activeTab === "tasks" && <TaskList
    tasks={tasks}
    categories={categories}
    onOpenCreateModal={() => handleOpenCreateTask("TODO")}
    onSelectTask={setSelectedTaskDetail}
    onEditTask={handleOpenEditTask}
    onDeleteTask={setTaskToDelete}
  />}

          {activeTab === "categories" && <CategoryManager
    categories={categories}
    tasks={tasks}
  />}

          {activeTab === "reports" && <ReportsExportView
    tasks={tasks}
    categories={categories}
  />}
        </main>
      </div>

      {
    /* Task Creation / Editing Modal */
  }
      <TaskModal
    isOpen={isTaskModalOpen}
    onClose={() => {
      setIsTaskModalOpen(false);
      setEditingTask(null);
    }}
    onSubmit={handleSaveTask}
    initialTask={editingTask}
    categories={categories}
    defaultStatus={taskModalDefaultStatus}
  />

      {
    /* Task Details Modal */
  }
      <TaskDetailModal
    task={selectedTaskDetail}
    categories={categories}
    isOpen={!!selectedTaskDetail}
    onClose={() => setSelectedTaskDetail(null)}
    onEdit={handleOpenEditTask}
    onDelete={setTaskToDelete}
  />

      {
    /* In-App Notifications Drawer */
  }
      <NotificationDrawer
    isOpen={isNotificationDrawerOpen}
    onClose={() => setIsNotificationDrawerOpen(false)}
    notifications={notifications}
    onOpenEmailSimulator={() => {
      setIsNotificationDrawerOpen(false);
      setIsEmailSimulatorOpen(true);
    }}
  />

      {
    /* Django Email SMTP Simulator Modal */
  }
      <EmailSimulatorModal
    isOpen={isEmailSimulatorOpen}
    onClose={() => setIsEmailSimulatorOpen(false)}
  />

      {
    /* User Account / Profile Modal */
  }
      <UserProfileModal
    isOpen={isProfileModalOpen}
    onClose={() => setIsProfileModalOpen(false)}
    currentUser={currentUser}
    profile={profile}
    onThemeChange={handleThemeChangeFromProfile}
  />

      {
    /* Delete Confirmation Modal */
  }
      {taskToDelete && <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 rounded-xl">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Confirm Task Deletion
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200/60 dark:border-slate-700">
              Are you sure you want to delete <strong className="text-slate-900 dark:text-white">"{taskToDelete.title}"</strong>? All associated notifications and reminder history will be removed.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
    onClick={() => setTaskToDelete(null)}
    className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
  >
                Cancel
              </button>
              <button
    onClick={handleConfirmDeleteTask}
    className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 active:scale-95 rounded-xl shadow-xs transition-all cursor-pointer"
  >
                Delete Task
              </button>
            </div>
          </div>
        </div>}
    </div>;
}
