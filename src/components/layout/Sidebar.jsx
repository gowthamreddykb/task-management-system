import {
  LayoutDashboard,
  Kanban,
  ListTodo,
  Layers,
  FileDown,
  Plus,
  Mail,
  X,
  Compass,
  CheckCircle2
} from "lucide-react";

export const Sidebar = ({
  activeTab,
  onSelectTab,
  isOpen,
  onCloseMobile,
  categories,
  tasks,
  onOpenCreateModal,
  onOpenEmailSimulator
}) => {
  const pendingCount = tasks.filter((t) => t.status !== "COMPLETED").length;

  const handleNav = (tab) => {
    onSelectTab(tab);
    onCloseMobile();
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "kanban", label: "Kanban Board", icon: Kanban },
    { id: "tasks", label: "Tasks", icon: ListTodo, count: pendingCount },
    { id: "categories", label: "Categories", icon: Layers, count: categories.length },
    { id: "reports", label: "Export & PDF Reports", icon: FileDown }
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      <div
        onClick={onCloseMobile}
        className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs transition-opacity"
      />

      {/* Slide-over Drawer */}
      <aside className="fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col justify-between animate-in slide-in-from-left duration-200">
        <div className="p-4 space-y-6 overflow-y-auto flex-1">
          {/* Header with Close */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-blue-500/20">
                <Compass className="w-4 h-4 stroke-[2.2]" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                  TaskFlow
                </span>
                <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400">
                  Trip & Task Planner
                </span>
              </div>
            </div>
            <button
              onClick={onCloseMobile}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Create Button */}
          <button
            onClick={() => {
              onOpenCreateModal();
              onCloseMobile();
            }}
            className="w-full h-10 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Task</span>
          </button>

          {/* Navigation Links */}
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Navigation
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400"}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== undefined && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isActive
                          ? "bg-blue-200 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Categories Quick Filter */}
          <div className="space-y-1 pt-2">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Trip Categories
            </p>
            <div className="space-y-0.5">
              {categories.slice(0, 5).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleNav("categories")}
                  className="w-full flex items-center justify-between px-3.5 py-2 rounded-lg text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: cat.color || "#3b82f6" }}
                    />
                    <span className="truncate max-w-[140px]">{cat.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">{cat.task_count || 0}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer: Email Simulator / System */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-2 bg-slate-50/50 dark:bg-slate-900/50">
          <button
            onClick={() => {
              onOpenEmailSimulator();
              onCloseMobile();
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors shadow-xs"
          >
            <Mail className="w-3.5 h-3.5 text-blue-600" />
            <span>Notification & Email Log</span>
          </button>
          <div className="flex items-center justify-between px-2 text-[10px] text-slate-400">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" /> System Online
            </span>
            <span>TaskFlow v1.0</span>
          </div>
        </div>
      </aside>
    </>
  );
};
