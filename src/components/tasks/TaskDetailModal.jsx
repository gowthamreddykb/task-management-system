import {
  X,
  Calendar,
  Clock,
  CheckCircle2,
  Trash2,
  Edit3,
  Mail,
  ShieldCheck
} from "lucide-react";
import { storageService } from "../../services/storage";
const PRIORITY_THEMES = {
  LOW: { label: "Low", badge: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300" },
  MEDIUM: { label: "Medium", badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" },
  HIGH: { label: "High", badge: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300" },
  URGENT: { label: "Urgent", badge: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 font-bold" }
};
export const TaskDetailModal = ({
  task,
  categories,
  isOpen,
  onClose,
  onEdit,
  onDelete
}) => {
  if (!isOpen || !task) return null;
  const category = categories.find((c) => c.id === task.category_id);
  const now = /* @__PURE__ */ new Date();
  const dueDate = new Date(task.due_date);
  const isOverdue = task.status !== "COMPLETED" && dueDate.getTime() < now.getTime();
  const sentEmails = storageService.getSentEmails().filter((e) => e.task_id === task.id);
  const activityLogs = storageService.getActivityLogs().filter((a) => a.task_id === task.id);
  const handleStatusChange = (newStatus) => {
    storageService.updateTaskStatus(task.id, newStatus);
    onClose();
  };
  return <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
    className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]"
    onClick={(e) => e.stopPropagation()}
  >
        {
    /* Top Header */
  }
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              {task.id}
            </span>
            {category && <span
    className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
    style={{
      backgroundColor: `${category.color}15`,
      color: category.color,
      borderColor: `${category.color}40`,
      borderWidth: "1px"
    }}
  >
                {category.name}
              </span>}
            <span className={`text-xs px-2.5 py-0.5 rounded-full ${PRIORITY_THEMES[task.priority].badge}`}>
              {PRIORITY_THEMES[task.priority].label} Priority
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
    onClick={() => {
      onClose();
      onEdit(task);
    }}
    className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-colors"
    title="Edit Task"
  >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
    onClick={() => {
      onClose();
      onDelete(task);
    }}
    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors"
    title="Delete Task"
  >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
    onClick={onClose}
    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
  >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {
    /* Content Body */
  }
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {
    /* Title & Status */
  }
          <div>
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-snug">
                {task.title}
              </h2>
            </div>
            {task.description ? <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-800">
                {task.description}
              </p> : <p className="mt-2 text-xs italic text-slate-400">No additional description provided.</p>}
          </div>

          {
    /* Quick Status Workflow Action */
  }
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Current Workflow State
              </span>
              <div className="flex items-center gap-2 mt-1">
                {task.status === "COMPLETED" ? <span className="flex items-center gap-1.5 text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    Completed
                  </span> : task.status === "IN_PROGRESS" ? <span className="flex items-center gap-1.5 text-sm font-bold text-indigo-600 dark:text-indigo-400">
                    <Clock className="w-4 h-4" />
                    In Progress
                  </span> : <span className="flex items-center gap-1.5 text-sm font-bold text-amber-600 dark:text-amber-400">
                    <Clock className="w-4 h-4" />
                    To Do
                  </span>}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Transition:</span>
              {["TODO", "IN_PROGRESS", "COMPLETED"].filter((s) => s !== task.status).map((s) => <button
    key={s}
    onClick={() => handleStatusChange(s)}
    className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors shadow-2xs cursor-pointer"
  >
                    Set to {s === "TODO" ? "To Do" : s === "IN_PROGRESS" ? "In Progress" : "Completed"}
                  </button>)}
            </div>
          </div>

          {
    /* Metadata Grid */
  }
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] font-medium text-slate-400 block mb-1">Due Date</span>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                <span>{new Date(task.due_date).toLocaleDateString()}</span>
              </div>
              {isOverdue && <span className="inline-block mt-1 text-[10px] text-rose-600 dark:text-rose-400 font-semibold">
                  Overdue
                </span>}
            </div>

            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] font-medium text-slate-400 block mb-1">Start Date</span>
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                {task.start_date ? new Date(task.start_date).toLocaleDateString() : "Immediate"}
              </span>
            </div>

            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] font-medium text-slate-400 block mb-1">Created At</span>
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                {new Date(task.created_at).toLocaleDateString()}
              </span>
            </div>

            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] font-medium text-slate-400 block mb-1">Ownership</span>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Isolated User
              </span>
            </div>
          </div>

          {
    /* Email Reminders & Notifications for this task */
  }
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-indigo-500" />
              Automated Deadline Reminders ({sentEmails.length})
            </h4>

            {sentEmails.length === 0 ? <div className="p-3.5 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-xs text-slate-400 text-center">
                No email reminders dispatched yet. Reminders trigger automatically 24h before deadline via Celery / Management command.
              </div> : sentEmails.map((email) => <div key={email.id} className="p-3 bg-indigo-50/50 dark:bg-slate-800/80 rounded-xl border border-indigo-100 dark:border-indigo-900/40 text-xs space-y-1">
                  <div className="flex items-center justify-between text-indigo-700 dark:text-indigo-400 font-semibold">
                    <span>{email.subject}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                      {email.status}
                    </span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                    Recipient: {email.recipient_email} | Sent at: {new Date(email.sent_at).toLocaleString()}
                  </p>
                </div>)}
          </div>

          {
    /* Audit Activity Trail */
  }
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-400" />
              Activity History
            </h4>

            {activityLogs.length === 0 ? <p className="text-xs text-slate-400">No activity logged for this item.</p> : <div className="space-y-2 border-l-2 border-slate-200 dark:border-slate-800 ml-2 pl-3">
                {activityLogs.map((act) => <div key={act.id} className="text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{act.details}</span>
                    <span className="text-[10px] text-slate-400 ml-2">{new Date(act.timestamp).toLocaleString()}</span>
                  </div>)}
              </div>}
          </div>
        </div>

        {
    /* Footer */
  }
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-end">
          <button
    onClick={onClose}
    className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
  >
            Close
          </button>
        </div>
      </div>
    </div>;
};
