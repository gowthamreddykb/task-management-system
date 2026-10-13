import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  ListTodo,
  Calendar,
  ArrowRight,
  Plus,
  Activity,
  RefreshCw,
  Compass,
  MapPin,
  Sparkles,
  TrendingUp,
  FolderHeart,
  ChevronRight
} from "lucide-react";
import { storageService } from "../../services/storage";
import { TaskStatusChart } from "../charts/TaskStatusChart";
import { WeeklyCompletionChart } from "../charts/WeeklyCompletionChart";
import { CategoryDistributionChart } from "../charts/CategoryDistributionChart";
import { ProductivityTrendChart } from "../charts/ProductivityTrendChart";

export const DashboardView = ({
  tasks = [],
  categories = [],
  isDark = false,
  onOpenCreateModal,
  onSelectTask,
  onNavigateTab,
  onOpenEmailSimulator
}) => {
  const currentUser = storageService.getCurrentUser();
  const activityLogs = storageService.getActivityLogs().slice(0, 6);
  const now = new Date();

  // Robust metrics computation
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "COMPLETED").length;
  const inProgressTasks = tasks.filter((t) => t.status === "IN_PROGRESS").length;
  const todoTasks = tasks.filter((t) => t.status === "TODO").length;
  const pendingTasks = tasks.filter((t) => t.status !== "COMPLETED").length;
  const urgentTasks = tasks.filter(
    (t) => t.priority === "URGENT" && t.status !== "COMPLETED"
  ).length;
  const overdueTasks = tasks.filter((t) => {
    if (t.status === "COMPLETED" || !t.due_date) return false;
    const time = new Date(t.due_date).getTime();
    return !isNaN(time) && time < now.getTime();
  }).length;
  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const handleSweepReminders = () => {
    const res = storageService.checkAndDispatchDeadlineReminders();
    if (res.dispatchedCount > 0) {
      alert(`Trip Planner Service: Dispatched ${res.dispatchedCount} deadline notification(s) to your inbox.`);
    } else {
      alert("Trip Planner Service: Evaluated all tasks. No approaching deadlines require dispatch at this time.");
    }
  };

  // Up to 5 upcoming deadlines with valid dates
  const upcomingTasks = tasks
    .filter((t) => {
      if (t.status === "COMPLETED" || !t.due_date) return false;
      const time = new Date(t.due_date).getTime();
      return !isNaN(time);
    })
    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
    .slice(0, 5);

  const statCards = [
    {
      title: "Total Tasks",
      value: totalTasks,
      subtitle: `${pendingTasks} pending items`,
      icon: ListTodo,
      color: "from-blue-500 to-indigo-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/40",
      textColor: "text-blue-600 dark:text-blue-400",
      borderColor: "border-blue-100 dark:border-blue-900/40"
    },
    {
      title: "Completed",
      value: completedTasks,
      subtitle: `${completionRate}% completion rate`,
      icon: CheckCircle2,
      color: "from-emerald-500 to-teal-600",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/40",
      textColor: "text-emerald-600 dark:text-emerald-400",
      borderColor: "border-emerald-100 dark:border-emerald-900/40"
    },
    {
      title: "In Progress",
      value: inProgressTasks,
      subtitle: "Active & in motion",
      icon: Clock,
      color: "from-amber-500 to-orange-600",
      bgColor: "bg-amber-50 dark:bg-amber-950/40",
      textColor: "text-amber-600 dark:text-amber-400",
      borderColor: "border-amber-100 dark:border-amber-900/40"
    },
    {
      title: "Urgent Attention",
      value: urgentTasks,
      subtitle: `${overdueTasks} overdue items`,
      icon: AlertTriangle,
      color: "from-rose-500 to-pink-600",
      bgColor: "bg-rose-50 dark:bg-rose-950/40",
      textColor: "text-rose-600 dark:text-rose-400",
      borderColor: "border-rose-100 dark:border-rose-900/40"
    },
    {
      title: "Efficiency Score",
      value: `${completionRate}%`,
      subtitle: "Weekly velocity trend",
      icon: TrendingUp,
      color: "from-violet-500 to-purple-600",
      bgColor: "bg-violet-50 dark:bg-violet-950/40",
      textColor: "text-violet-600 dark:text-violet-400",
      borderColor: "border-violet-100 dark:border-violet-900/40"
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200 text-slate-800 dark:text-slate-100">
      {/* 1. Hero Banner: Friendly Trip Planner Welcome */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white p-7 sm:p-9 shadow-lg shadow-indigo-500/10 border border-blue-500/20">
        {/* Glow & background patterns */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-white/10 to-transparent pointer-events-none" />
        <div className="absolute -right-10 -bottom-10 w-56 h-56 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute -left-12 -top-12 w-48 h-48 rounded-full bg-indigo-400/20 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-semibold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Trip & Task Planner Hub</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Welcome back, {currentUser?.first_name || "Explorer"}! ✈️
            </h1>
            <p className="text-sm sm:text-base text-blue-100/90 font-normal leading-relaxed">
              Organize your travel itineraries, manage deliverables, and stay ahead of deadlines effortlessly.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-blue-100">
              <span className="flex items-center gap-1.5 bg-black/15 px-3 py-1.5 rounded-xl backdrop-blur-xs">
                <Calendar className="w-3.5 h-3.5 text-blue-200" />
                {now.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", year: "numeric" })}
              </span>
              <span className="flex items-center gap-1.5 bg-black/15 px-3 py-1.5 rounded-xl backdrop-blur-xs">
                <Compass className="w-3.5 h-3.5 text-blue-200" />
                {categories.length} Categories Active
              </span>
              <span className="flex items-center gap-1.5 bg-black/15 px-3 py-1.5 rounded-xl backdrop-blur-xs">
                <Activity className="w-3.5 h-3.5 text-blue-200" />
                {pendingTasks} Tasks in Progress
              </span>
            </div>
          </div>

          {/* Quick Action CTA Buttons */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full lg:w-auto">
            <button
              onClick={onOpenCreateModal}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 h-11 px-5 bg-white hover:bg-slate-50 text-blue-700 font-bold text-xs sm:text-sm rounded-2xl shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Plan New Task</span>
            </button>
            <button
              onClick={() => onNavigateTab("kanban")}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 h-11 px-4.5 bg-white/15 hover:bg-white/25 border border-white/25 text-white font-semibold text-xs sm:text-sm rounded-2xl backdrop-blur-sm transition-all"
            >
              <span>Kanban Board</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={handleSweepReminders}
              title="Trigger notification deadline evaluation"
              className="p-3 bg-white/15 hover:bg-white/25 border border-white/25 text-white rounded-2xl backdrop-blur-sm transition-all"
              aria-label="Evaluate notifications"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Cheerful 5 KPI Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border ${card.borderColor} shadow-xs hover:shadow-md transition-all flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">
                  {card.title}
                </span>
                <div className={`w-8 h-8 rounded-xl ${card.bgColor} ${card.textColor} flex items-center justify-center`}>
                  <Icon className="w-4 h-4 stroke-[2.2]" />
                </div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {card.value}
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                  {card.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Destination & Project Categories */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <FolderHeart className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Trip Categories & Project Hubs
              </h2>
              <p className="text-xs text-slate-500">
                Organized workspaces for destinations, packing, logistics, and planning
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab("categories")}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1 group"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          {categories.slice(0, 4).map((cat) => {
            const catTasks = tasks.filter(
              (t) => (t.category_id || t.category) === cat.id
            );
            const total = catTasks.length;
            const done = catTasks.filter((t) => t.status === "COMPLETED").length;
            const pct = total > 0 ? Math.round((done / total) * 100) : 0;

            return (
              <div
                key={cat.id}
                onClick={() => onNavigateTab("categories")}
                className="group p-4 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800/80 transition-all cursor-pointer shadow-2xs hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-3.5 h-3.5 rounded-lg shadow-xs"
                      style={{ backgroundColor: cat.color || "#3b82f6" }}
                    />
                    <span className="font-bold text-sm text-slate-800 dark:text-slate-100 truncate group-hover:text-blue-600 transition-colors">
                      {cat.name}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400 bg-white dark:bg-slate-900 px-2 py-0.5 rounded-full border border-slate-100 dark:border-slate-800">
                    {total} tasks
                  </span>
                </div>

                <p className="text-xs text-slate-500 line-clamp-1 mb-3">
                  {cat.description || "General trip management & itinerary"}
                </p>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Progress</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">{pct}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: cat.color || "#3b82f6"
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Analytics & Interactive Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Task Status Breakdown
              </h3>
              <p className="text-xs text-slate-400">Distribution across Kanban columns</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              {totalTasks} Total
            </span>
          </div>
          <div className="h-64 flex items-center justify-center">
            <TaskStatusChart
              tasks={tasks}
              todo={todoTasks}
              inProgress={inProgressTasks}
              completed={completedTasks}
              isDark={isDark}
            />
          </div>
        </div>

        {/* Weekly Velocity */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Weekly Completion Velocity
              </h3>
              <p className="text-xs text-slate-400">Tasks marked completed in last 7 days</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              {completedTasks} Done
            </span>
          </div>
          <div className="h-64 flex items-center justify-center">
            <WeeklyCompletionChart tasks={tasks} isDark={isDark} />
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Category Distribution
              </h3>
              <p className="text-xs text-slate-400">Workload across trip projects</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              {categories.length} Hubs
            </span>
          </div>
          <div className="h-64 flex items-center justify-center">
            <CategoryDistributionChart tasks={tasks} categories={categories} isDark={isDark} />
          </div>
        </div>

        {/* Productivity Trend */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Productivity Trend
              </h3>
              <p className="text-xs text-slate-400">Created vs Completed trajectory</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              Active Trend
            </span>
          </div>
          <div className="h-64 flex items-center justify-center">
            <ProductivityTrendChart tasks={tasks} isDark={isDark} />
          </div>
        </div>
      </div>

      {/* 5. Approaching Deadlines & Activity Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Approaching Deadlines (Itinerary style) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-rose-500" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Approaching Deadlines & Itinerary
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab("tasks")}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              See all
            </button>
          </div>

          <div className="space-y-2.5">
            {upcomingTasks.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No approaching deadlines on your itinerary. You are all set!
              </div>
            ) : (
              upcomingTasks.map((t) => {
                const dueDate = new Date(t.due_date);
                const diffTime = dueDate.getTime() - now.getTime();
                const diffDays = isNaN(diffTime)
                  ? 0
                  : Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                const isOverdue = diffDays < 0;
                const isUrgent = diffDays <= 1;

                return (
                  <div
                    key={t.id}
                    onClick={() => onSelectTask(t)}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 hover:bg-slate-100/70 dark:hover:bg-slate-800 transition-all cursor-pointer border border-slate-100 dark:border-slate-800/70"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                          t.priority === "URGENT"
                            ? "bg-rose-500 animate-pulse"
                            : t.priority === "HIGH"
                            ? "bg-amber-500"
                            : "bg-blue-500"
                        }`}
                      />
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                          {t.title}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate">
                          Due: {dueDate.toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                          isOverdue
                            ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                            : isUrgent
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                            : "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                        }`}
                      >
                        {isOverdue ? `${Math.abs(diffDays)}d overdue` : diffDays === 0 ? "Due today" : `${diffDays}d left`}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Activity Stream */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-500" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Recent Planner Activity
              </h3>
            </div>
            <button
              onClick={onOpenEmailSimulator}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
            >
              Email & System Logs
            </button>
          </div>

          <div className="space-y-3">
            {activityLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/70"
              >
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    {log.description}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} • {log.user}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
