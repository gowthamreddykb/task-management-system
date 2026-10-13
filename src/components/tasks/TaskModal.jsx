import { useState, useEffect } from "react";
import { X, AlertCircle, Bell, Check, CheckSquare } from "lucide-react";
export const TaskModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialTask,
  categories,
  defaultStatus = "TODO"
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [status, setStatus] = useState("TODO");
  const [priority, setPriority] = useState("MEDIUM");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [enableReminder, setEnableReminder] = useState(true);
  const [errors, setErrors] = useState({});
  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setDescription(initialTask.description || "");
      setCategoryId(initialTask.category_id || "");
      setStatus(initialTask.status);
      setPriority(initialTask.priority);
      setStartDate(initialTask.start_date ? initialTask.start_date.slice(0, 16) : "");
      setDueDate(initialTask.due_date ? initialTask.due_date.slice(0, 16) : "");
    } else {
      setTitle("");
      setDescription("");
      setCategoryId(categories[0]?.id || "");
      setStatus(defaultStatus);
      setPriority("MEDIUM");
      const now = /* @__PURE__ */ new Date();
      setStartDate(now.toISOString().slice(0, 16));
      const tomorrow = new Date(now.getTime() + 864e5);
      tomorrow.setHours(18, 0, 0, 0);
      setDueDate(tomorrow.toISOString().slice(0, 16));
    }
    setErrors({});
  }, [initialTask, isOpen, defaultStatus, categories]);
  if (!isOpen) return null;
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = "Task title is required.";
    } else if (title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters.";
    }
    if (!dueDate) {
      newErrors.dueDate = "Due date is required.";
    }
    if (startDate && dueDate && new Date(dueDate) < new Date(startDate)) {
      newErrors.dueDate = "Due date cannot be earlier than start date.";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      category_id: categoryId || void 0,
      status,
      priority,
      start_date: startDate ? new Date(startDate).toISOString() : void 0,
      due_date: new Date(dueDate).toISOString()
    });
    onClose();
  };
  return <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
    className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]"
    onClick={(e) => e.stopPropagation()}
  >
        {
    /* Header */
  }
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg">
              <CheckSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {initialTask ? "Edit Task" : "Create New Task"}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {initialTask ? "Update task attributes and schedule" : "Add a new trackable item to your workspace"}
              </p>
            </div>
          </div>
          <button
    onClick={onClose}
    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
  >
            <X className="w-5 h-5" />
          </button>
        </div>

        {
    /* Form Body */
  }
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {
    /* Title */
  }
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Task Title <span className="text-rose-500">*</span>
            </label>
            <input
    type="text"
    value={title}
    onChange={(e) => setTitle(e.target.value)}
    placeholder="e.g. Integrate Celery Redis task queue for notifications"
    className={`w-full px-3.5 py-2 text-sm rounded-lg border bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${errors.title ? "border-rose-300 dark:border-rose-700 focus:ring-rose-200 dark:focus:ring-rose-900" : "border-slate-300 dark:border-slate-700 focus:border-indigo-500 focus:ring-indigo-100 dark:focus:ring-indigo-950"}`}
  />
            {errors.title && <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.title}
              </p>}
          </div>

          {
    /* Description */
  }
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Description / Notes
            </label>
            <textarea
    rows={3}
    value={description}
    onChange={(e) => setDescription(e.target.value)}
    placeholder="Provide implementation details, acceptance criteria, or links..."
    className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:border-indigo-500 focus:ring-indigo-100 dark:focus:ring-indigo-950 transition-all resize-none"
  />
          </div>

          {
    /* Category & Priority Grid */
  }
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Category Tag
              </label>
              <div className="relative">
                <select
    value={categoryId}
    onChange={(e) => setCategoryId(e.target.value)}
    className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:border-indigo-500 focus:ring-indigo-100 dark:focus:ring-indigo-950 cursor-pointer"
  >
                  <option value="">No Category (General)</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>
                      {c.name}
                    </option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Priority Level
              </label>
              <select
    value={priority}
    onChange={(e) => setPriority(e.target.value)}
    className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:border-indigo-500 focus:ring-indigo-100 dark:focus:ring-indigo-950 cursor-pointer"
  >
                <option value="LOW">Low Priority</option>
                <option value="MEDIUM">Medium Priority</option>
                <option value="HIGH">High Priority</option>
                <option value="URGENT">Urgent (Critical)</option>
              </select>
            </div>
          </div>

          {
    /* Status & Start Date */
  }
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Workflow Status
              </label>
              <select
    value={status}
    onChange={(e) => setStatus(e.target.value)}
    className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:border-indigo-500 focus:ring-indigo-100 dark:focus:ring-indigo-950 cursor-pointer"
  >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Start Date (Optional)
              </label>
              <input
    type="datetime-local"
    value={startDate}
    onChange={(e) => setStartDate(e.target.value)}
    className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:border-indigo-500 focus:ring-indigo-100 dark:focus:ring-indigo-950"
  />
            </div>
          </div>

          {
    /* Due Date & Reminder */
  }
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Due Date & Time <span className="text-rose-500">*</span>
            </label>
            <input
    type="datetime-local"
    value={dueDate}
    onChange={(e) => setDueDate(e.target.value)}
    className={`w-full px-3.5 py-2 text-sm rounded-lg border bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${errors.dueDate ? "border-rose-300 dark:border-rose-700 focus:ring-rose-200" : "border-slate-300 dark:border-slate-700 focus:border-indigo-500 focus:ring-indigo-100 dark:focus:ring-indigo-950"}`}
  />
            {errors.dueDate && <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.dueDate}
              </p>}
          </div>

          {
    /* Reminder Toggle */
  }
          <div className="p-3 bg-indigo-50/60 dark:bg-indigo-950/30 rounded-xl border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Bell className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <div>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  24-Hour Email Deadline Reminder
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Automated email alert delivered 24 hours prior to deadline
                </p>
              </div>
            </div>
            <input
    type="checkbox"
    checked={enableReminder}
    onChange={(e) => setEnableReminder(e.target.checked)}
    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
  />
          </div>

          {
    /* Action Footer */
  }
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
    type="button"
    onClick={onClose}
    className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
  >
              Cancel
            </button>
            <button
    type="submit"
    className="h-9 px-5 text-xs font-bold text-white bg-[#e76f51] hover:bg-[#d85e40] rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
  >
              <Check className="w-3.5 h-3.5 stroke-[2.2]" />
              <span>{initialTask ? "Save Changes" : "Create Task"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>;
};
