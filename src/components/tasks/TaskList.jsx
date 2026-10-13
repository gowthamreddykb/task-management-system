import { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Calendar,
  AlertCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Edit3,
  Trash2,
  Eye,
  Check
} from "lucide-react";
import { storageService } from "../../services/storage";
const ITEMS_PER_PAGE = 8;
export const TaskList = ({
  tasks,
  categories,
  onOpenCreateModal,
  onSelectTask,
  onEditTask,
  onDeleteTask
}) => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [dateFilter, setDateFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("due_date_asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const categoryMap = useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    categories.forEach((c) => map.set(c.id, c));
    return map;
  }, [categories]);
  const filteredTasks = useMemo(() => {
    return storageService.filterTasks({
      search,
      status: statusFilter,
      category_id: categoryFilter,
      priority: priorityFilter,
      date_filter: dateFilter,
      sort_by: sortBy
    });
  }, [search, statusFilter, categoryFilter, priorityFilter, dateFilter, sortBy, tasks]);
  const totalPages = Math.max(1, Math.ceil(filteredTasks.length / ITEMS_PER_PAGE));
  const paginatedTasks = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTasks.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredTasks, currentPage]);
  const handleToggleComplete = (task) => {
    const newStatus = task.status === "COMPLETED" ? "TODO" : "COMPLETED";
    storageService.updateTaskStatus(task.id, newStatus);
  };
  const isOverdue = (task) => {
    return task.status !== "COMPLETED" && new Date(task.due_date).getTime() < Date.now();
  };
  const isDueSoon = (task) => {
    if (task.status === "COMPLETED") return false;
    const diff = new Date(task.due_date).getTime() - Date.now();
    return diff > 0 && diff <= 24 * 36e5;
  };
  return <div className="space-y-4">
      {
    /* Search and Filters Bar */
  }
      <div className="bg-white dark:bg-[#0f2924] rounded-2xl p-4 border border-[#e8e4dc] dark:border-emerald-950 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {
    /* Search Input */
  }
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
    type="text"
    value={search}
    onChange={(e) => {
      setSearch(e.target.value);
      setCurrentPage(1);
    }}
    placeholder="Search destinations, tasks, activities..."
    className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-[#e8e4dc] dark:border-emerald-800 bg-[#FAF8F5] dark:bg-[#091815] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#064e43]/20 focus:border-[#064e43]"
  />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenCreateModal}
              className="h-9 px-4 bg-[#e76f51] hover:bg-[#d85e40] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap active:scale-95 transition-all"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.8]" />
              <span>Create Task</span>
            </button>
          </div>
        </div>

        {
    /* Filter Badges Row */
  }
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          {
    /* Status */
  }
          <div>
            <select
    value={statusFilter}
    onChange={(e) => {
      setStatusFilter(e.target.value);
      setCurrentPage(1);
    }}
    className="w-full py-1.5 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium focus:outline-none focus:border-indigo-500 cursor-pointer"
  >
              <option value="ALL">All Statuses</option>
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          {
    /* Category */
  }
          <div>
            <select
    value={categoryFilter}
    onChange={(e) => {
      setCategoryFilter(e.target.value);
      setCurrentPage(1);
    }}
    className="w-full py-1.5 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium focus:outline-none focus:border-indigo-500 cursor-pointer"
  >
              <option value="ALL">All Categories</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          {
    /* Priority */
  }
          <div>
            <select
    value={priorityFilter}
    onChange={(e) => {
      setPriorityFilter(e.target.value);
      setCurrentPage(1);
    }}
    className="w-full py-1.5 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium focus:outline-none focus:border-indigo-500 cursor-pointer"
  >
              <option value="ALL">All Priorities</option>
              <option value="URGENT">Urgent</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>

          {
    /* Date Filter */
  }
          <div>
            <select
    value={dateFilter}
    onChange={(e) => {
      setDateFilter(e.target.value);
      setCurrentPage(1);
    }}
    className="w-full py-1.5 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium focus:outline-none focus:border-indigo-500 cursor-pointer"
  >
              <option value="ALL">All Deadlines</option>
              <option value="OVERDUE">Overdue Tasks</option>
              <option value="TODAY">Due Today</option>
              <option value="UPCOMING_WEEK">Upcoming Week</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          {
    /* Sort By */
  }
          <div className="col-span-2 sm:col-span-1">
            <select
    value={sortBy}
    onChange={(e) => setSortBy(e.target.value)}
    className="w-full py-1.5 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium focus:outline-none focus:border-indigo-500 cursor-pointer"
  >
              <option value="due_date_asc">Sort: Due Date (Earliest)</option>
              <option value="due_date_desc">Sort: Due Date (Latest)</option>
              <option value="priority_desc">Sort: Priority (Highest)</option>
              <option value="created_at_desc">Sort: Newest Created</option>
              <option value="title_asc">Sort: Alphabetical (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {
    /* Task Count & Active Filters Indicator */
  }
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
        <span>
          Showing <strong>{filteredTasks.length}</strong> {filteredTasks.length === 1 ? "task" : "tasks"}
          {(search || statusFilter !== "ALL" || categoryFilter !== "ALL" || priorityFilter !== "ALL" || dateFilter !== "ALL") && " (Filtered)"}
        </span>
        {(search || statusFilter !== "ALL" || categoryFilter !== "ALL" || priorityFilter !== "ALL" || dateFilter !== "ALL") && <button
    onClick={() => {
      setSearch("");
      setStatusFilter("ALL");
      setCategoryFilter("ALL");
      setPriorityFilter("ALL");
      setDateFilter("ALL");
    }}
    className="text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer font-medium"
  >
            Clear all filters
          </button>}
      </div>

      {
    /* Table / Card List */
  }
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        {paginatedTasks.length === 0 ? <div className="py-16 text-center px-4">
            <AlertCircle className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">No tasks match your criteria</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Try adjusting your search keywords, status filters, or create a brand new task.
            </p>
            <button
    onClick={onOpenCreateModal}
    className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition-colors"
  >
              Create New Task
            </button>
          </div> : <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {paginatedTasks.map((task) => {
    const cat = task.category_id ? categoryMap.get(task.category_id) : void 0;
    const overdue = isOverdue(task);
    const dueSoon = isDueSoon(task);
    return <div
      key={task.id}
      className={`p-4 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors flex items-start sm:items-center justify-between gap-4 ${task.status === "COMPLETED" ? "opacity-75" : ""}`}
    >
                  {
      /* Left: Checkbox + Title + Metadata */
    }
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <button
      onClick={() => handleToggleComplete(task)}
      className={`mt-1 sm:mt-0 w-5 h-5 rounded-md flex items-center justify-center border transition-all cursor-pointer ${task.status === "COMPLETED" ? "bg-emerald-600 border-emerald-600 text-white" : "border-slate-300 dark:border-slate-600 hover:border-indigo-500"}`}
      title={task.status === "COMPLETED" ? "Mark Incomplete" : "Mark Complete"}
    >
                      {task.status === "COMPLETED" && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span
      onClick={() => onSelectTask(task)}
      className={`font-semibold text-sm cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 truncate ${task.status === "COMPLETED" ? "line-through text-slate-400 dark:text-slate-500" : "text-slate-900 dark:text-white"}`}
    >
                          {task.title}
                        </span>

                        {
      /* Priority Badge */
    }
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${task.priority === "URGENT" ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400" : task.priority === "HIGH" ? "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400" : task.priority === "MEDIUM" ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"}`}>
                          {task.priority}
                        </span>

                        {
      /* Category */
    }
                        {cat && <span
      className="text-[11px] font-medium px-2 py-0.5 rounded-md"
      style={{
        backgroundColor: `${cat.color}15`,
        color: cat.color
      }}
    >
                            {cat.name}
                          </span>}
                      </div>

                      {task.description && <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xl">
                          {task.description}
                        </p>}

                      {
      /* Timestamps & Deadline row */
    }
                      <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>
                        </div>

                        {overdue && <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400 font-semibold">
                            <AlertCircle className="w-3 h-3" />
                            Overdue
                          </span>}

                        {dueSoon && <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold">
                            <Clock className="w-3 h-3" />
                            Due in 24h
                          </span>}

                        <span className="hidden md:inline">
                          Created {new Date(task.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {
      /* Right: Status pill + Actions Menu */
    }
                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap ${task.status === "COMPLETED" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300" : task.status === "IN_PROGRESS" ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300" : "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300"}`}>
                      {task.status === "COMPLETED" ? "Completed" : task.status === "IN_PROGRESS" ? "In Progress" : "To Do"}
                    </span>

                    <div className="relative">
                      <button
      onClick={() => setActiveMenuId(activeMenuId === task.id ? null : task.id)}
      className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
    >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {activeMenuId === task.id && <div
      onClick={(e) => e.stopPropagation()}
      className="absolute right-0 top-7 z-30 w-36 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1 text-xs animate-in fade-in duration-100"
    >
                          <button
      onClick={() => {
        setActiveMenuId(null);
        onSelectTask(task);
      }}
      className="w-full text-left px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-700/60 flex items-center gap-2 text-slate-700 dark:text-slate-300"
    >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View Details</span>
                          </button>
                          <button
      onClick={() => {
        setActiveMenuId(null);
        onEditTask(task);
      }}
      className="w-full text-left px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-700/60 flex items-center gap-2 text-slate-700 dark:text-slate-300"
    >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
      onClick={() => {
        setActiveMenuId(null);
        onDeleteTask(task);
      }}
      className="w-full text-left px-3 py-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 text-rose-600 dark:text-rose-400"
    >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>}
                    </div>
                  </div>
                </div>;
  })}
          </div>}

        {
    /* Pagination Footer */
  }
        {totalPages > 1 && <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between text-xs text-slate-500">
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center gap-1.5">
              <button
    disabled={currentPage <= 1}
    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-white dark:hover:bg-slate-800 cursor-pointer"
  >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
    disabled={currentPage >= totalPages}
    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-white dark:hover:bg-slate-800 cursor-pointer"
  >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>}
      </div>
    </div>;
};
