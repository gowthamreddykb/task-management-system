import { useState } from "react";
import confetti from "canvas-confetti";
import {
  Plus,
  MoreVertical,
  Calendar,
  AlertCircle,
  Clock,
  CheckCircle2,
  ArrowRight,
  GripVertical,
  Filter,
  Kanban
} from "lucide-react";
import { storageService } from "../../services/storage";
const COLUMNS = [
  {
    id: "TODO",
    title: "To Do",
    color: "text-slate-700 dark:text-slate-300",
    bgColor: "bg-slate-100/70 dark:bg-slate-800/50",
    borderColor: "border-slate-200 dark:border-slate-700/80",
    badgeBg: "bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300"
  },
  {
    id: "IN_PROGRESS",
    title: "In Progress",
    color: "text-blue-700 dark:text-blue-300",
    bgColor: "bg-blue-50/30 dark:bg-blue-950/15",
    borderColor: "border-blue-200 dark:border-blue-800/60",
    badgeBg: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
  },
  {
    id: "COMPLETED",
    title: "Completed",
    color: "text-emerald-700 dark:text-emerald-300",
    bgColor: "bg-emerald-50/30 dark:bg-emerald-950/15",
    borderColor: "border-emerald-200 dark:border-emerald-800/60",
    badgeBg: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
  }
];
const PRIORITY_BADGES = {
  LOW: { label: "Low", className: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700" },
  MEDIUM: { label: "Medium", className: "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800" },
  HIGH: { label: "High", className: "bg-orange-50 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300 border border-orange-200 dark:border-orange-800" },
  URGENT: { label: "Urgent", className: "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800 font-semibold" }
};
export const KanbanBoard = ({
  tasks,
  categories,
  onOpenCreateModal,
  onSelectTask,
  onEditTask,
  onDeleteTask
}) => {
  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);
  const [activeMenuTaskId, setActiveMenuTaskId] = useState(null);
  const [filterCategory, setFilterCategory] = useState("ALL");
  const categoryMap = /* @__PURE__ */ new Map();
  categories.forEach((c) => categoryMap.set(c.id, c));
  const filteredTasks = filterCategory === "ALL" ? tasks : tasks.filter((t) => t.category_id === filterCategory);
  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData("text/plain", taskId);
    e.dataTransfer.effectAllowed = "move";
    setDraggedTaskId(taskId);
  };
  const handleDragOver = (e, status) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverColumn !== status) {
      setDragOverColumn(status);
    }
  };
  const handleDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverColumn(null);
    }
  };
  const triggerCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#6366f1", "#10b981", "#f59e0b", "#8b5cf6"]
    });
  };
  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain") || draggedTaskId;
    setDragOverColumn(null);
    setDraggedTaskId(null);
    if (!taskId) return;
    const task = tasks.find((t) => t.id === taskId);
    if (task && task.status !== targetStatus) {
      storageService.updateTaskStatus(taskId, targetStatus);
      if (targetStatus === "COMPLETED") {
        triggerCelebration();
      }
    }
  };
  const handleMoveStatus = (taskId, targetStatus) => {
    setActiveMenuTaskId(null);
    storageService.updateTaskStatus(taskId, targetStatus);
    if (targetStatus === "COMPLETED") {
      triggerCelebration();
    }
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
    /* Kanban Sub-Header & Controls */
  }
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white dark:bg-[#0f2924] p-4 rounded-2xl border border-[#e8e4dc] dark:border-emerald-950 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#064e43] text-emerald-200 shadow-xs">
            <Kanban className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              My Trips Kanban Board
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-[#064e43] dark:text-emerald-300">
                Interactive
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Drag cards across lifecycle stages to update trip progress
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {/* Quick Category Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-transparent border-none focus:outline-none text-xs font-semibold cursor-pointer"
            >
              <option value="ALL">All Destinations ({tasks.length})</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({tasks.filter((t) => t.category_id === c.id).length})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => onOpenCreateModal("TODO")}
            className="h-9 px-4 bg-[#e76f51] hover:bg-[#d85e40] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer ml-auto sm:ml-0 active:scale-95 transition-all"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.8]" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {
    /* 3 Columns Grid */
  }
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {COLUMNS.map((col) => {
    const colTasks = filteredTasks.filter((t) => t.status === col.id);
    const isTarget = dragOverColumn === col.id;
    return <div
      key={col.id}
      onDragOver={(e) => handleDragOver(e, col.id)}
      onDragLeave={handleDragLeave}
      onDrop={(e) => handleDrop(e, col.id)}
      className={`flex flex-col rounded-xl border min-h-[560px] bg-slate-50/50 dark:bg-slate-900/40 ${isTarget ? "border-blue-500 dark:border-blue-500 ring-1 ring-blue-500/20 bg-blue-50/20 dark:bg-blue-950/20" : "border-slate-200 dark:border-slate-800"}`}
    >
              {
      /* Column Header */
    }
              <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${col.id === "TODO" ? "bg-amber-500" : col.id === "IN_PROGRESS" ? "bg-blue-500" : "bg-emerald-500"}`} />
                  <h3 className="font-semibold text-xs text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    {col.title}
                  </h3>
                  <span className={`text-[11px] font-mono px-1.5 py-0.5 rounded font-semibold tabular-nums ${col.badgeBg}`}>
                    {colTasks.length}
                  </span>
                </div>

                <button
      onClick={() => onOpenCreateModal(col.id)}
      title={`Add task to ${col.title}`}
      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
    >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {
      /* Tasks List in Column */
    }
              <div className="flex-1 p-2.5 space-y-2.5 overflow-y-auto max-h-[750px]">
                {colTasks.length === 0 ? <div className={`h-28 rounded-lg border border-dashed flex flex-col items-center justify-center p-3 text-center ${isTarget ? "border-blue-400 bg-blue-50/30 dark:bg-blue-950/20 text-blue-600" : "border-slate-200 dark:border-slate-800 text-slate-400"}`}>
                    <p className="text-xs">No tasks in {col.title}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Drag card here or click +</p>
                  </div> : colTasks.map((task) => {
      const cat = task.category_id ? categoryMap.get(task.category_id) : void 0;
      const overdue = isOverdue(task);
      const dueSoon = isDueSoon(task);
      const isDragging = draggedTaskId === task.id;
      return <div
        key={task.id}
        draggable
        onDragStart={(e) => handleDragStart(e, task.id)}
        onDragEnd={() => setDraggedTaskId(null)}
        className={`group relative bg-white dark:bg-slate-800/90 rounded-lg p-3 border shadow-xs cursor-grab active:cursor-grabbing ${isDragging ? "opacity-40 border-dashed border-slate-400 dark:border-slate-600" : "border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600"}`}
      >
                        {
        /* Drag Handle & Category / Priority Top Row */
      }
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-slate-300 dark:text-slate-600 group-hover:text-slate-400 transition-colors">
                              <GripVertical className="w-3.5 h-3.5" />
                            </span>

                            {cat ? <span
        className="text-[11px] font-semibold px-2 py-0.5 rounded-md"
        style={{
          backgroundColor: `${cat.color}15`,
          color: cat.color,
          borderColor: `${cat.color}40`,
          borderWidth: "1px"
        }}
      >
                                {cat.name}
                              </span> : <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                                General
                              </span>}

                            <span className={`text-[10px] px-1.5 py-0.5 rounded ${PRIORITY_BADGES[task.priority].className}`}>
                              {PRIORITY_BADGES[task.priority].label}
                            </span>
                          </div>

                          {
        /* Quick Actions Dropdown */
      }
                          <div className="relative">
                            <button
        onClick={(e) => {
          e.stopPropagation();
          setActiveMenuTaskId(activeMenuTaskId === task.id ? null : task.id);
        }}
        className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        title="Task actions"
      >
                              <MoreVertical className="w-3.5 h-3.5" />
                            </button>

                            {activeMenuTaskId === task.id && <div
        onClick={(e) => e.stopPropagation()}
        className="absolute right-0 top-6 z-30 w-44 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 text-xs text-slate-700 dark:text-slate-200 animate-in fade-in zoom-in-95 duration-100"
      >
                                <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-700">
                                  Move Status
                                </div>
                                {COLUMNS.filter((c) => c.id !== task.status).map((targetCol) => <button
        key={targetCol.id}
        onClick={() => handleMoveStatus(task.id, targetCol.id)}
        className="w-full text-left px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-700/60 flex items-center justify-between"
      >
                                    <span>Move to {targetCol.title}</span>
                                    <ArrowRight className="w-3 h-3 text-slate-400" />
                                  </button>)}
                                <div className="border-t border-slate-100 dark:border-slate-700 my-1" />
                                <button
        onClick={() => {
          setActiveMenuTaskId(null);
          onEditTask(task);
        }}
        className="w-full text-left px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-700/60"
      >
                                  Edit Details
                                </button>
                                <button
        onClick={() => {
          setActiveMenuTaskId(null);
          onDeleteTask(task);
        }}
        className="w-full text-left px-3 py-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400"
      >
                                  Delete Task
                                </button>
                              </div>}
                          </div>
                        </div>

                        {
        /* Title */
      }
                        <h4
        onClick={() => onSelectTask(task)}
        className={`font-semibold text-sm leading-snug cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors ${task.status === "COMPLETED" ? "line-through text-slate-500 dark:text-slate-400" : "text-slate-900 dark:text-slate-100"}`}
      >
                          {task.title}
                        </h4>

                        {
        /* Description Preview */
      }
                        {task.description && <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
                            {task.description}
                          </p>}

                        {
        /* Due Date & Badges Footer */
      }
                        <div className="flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-700/60 text-[11px]">
                          <div className="flex items-center gap-1.5">
                            {overdue ? <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400 font-semibold" title="Overdue task!">
                                <AlertCircle className="w-3.5 h-3.5" />
                                <span>{new Date(task.due_date).toLocaleDateString(void 0, { month: "short", day: "numeric" })}</span>
                              </span> : dueSoon ? <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium" title="Due in 24 hours">
                                <Clock className="w-3.5 h-3.5" />
                                <span>Due soon</span>
                              </span> : <span className="flex items-center gap-1 text-slate-400 dark:text-slate-500">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>{new Date(task.due_date).toLocaleDateString(void 0, { month: "short", day: "numeric" })}</span>
                              </span>}
                          </div>

                          {
        /* Quick Accessible Status Toggle */
      }
                          <div className="flex items-center gap-1">
                            {task.status !== "COMPLETED" ? <button
        onClick={() => handleMoveStatus(task.id, "COMPLETED")}
        title="Mark Complete"
        className="p-1 rounded hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
      >
                                <CheckCircle2 className="w-4 h-4" />
                              </button> : <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 text-[11px] font-medium">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Done
                              </span>}
                          </div>
                        </div>
                      </div>;
    })}
              </div>
            </div>;
  })}
      </div>
    </div>;
};
