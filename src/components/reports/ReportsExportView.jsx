import { useState } from "react";
import {
  FileDown,
  FileSpreadsheet,
  FileText,
  Eye
} from "lucide-react";
import { ExportService } from "../../services/exportService";
import { storageService } from "../../services/storage";
export const ReportsExportView = ({ tasks, categories }) => {
  const [reportTitle, setReportTitle] = useState("TaskFlow Executive Productivity Report");
  const [filterCategory, setFilterCategory] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterPriority, setFilterPriority] = useState("ALL");
  const [filterDate, setFilterDate] = useState("ALL");
  const [isExporting, setIsExporting] = useState(false);
  const categoryMap = /* @__PURE__ */ new Map();
  categories.forEach((c) => categoryMap.set(c.id, c));
  const currentFilteredTasks = storageService.filterTasks({
    search: "",
    status: filterStatus,
    category_id: filterCategory,
    priority: filterPriority,
    date_filter: filterDate,
    sort_by: "due_date_asc"
  });
  const handleExportCSV = (allTasks = false) => {
    setIsExporting(true);
    setTimeout(() => {
      const dataToExport = allTasks ? tasks : currentFilteredTasks;
      const filename = allTasks ? `taskflow_all_tasks_${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv` : `taskflow_filtered_tasks_${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`;
      ExportService.exportToCSV(dataToExport, categories, filename);
      setIsExporting(false);
    }, 200);
  };
  const handleExportPDF = () => {
    setIsExporting(true);
    setTimeout(() => {
      ExportService.exportToPDF(
        currentFilteredTasks,
        categories,
        {
          status: filterStatus,
          category_id: filterCategory,
          priority: filterPriority,
          date_filter: filterDate
        },
        reportTitle
      );
      setIsExporting(false);
    }, 300);
  };
  const total = currentFilteredTasks.length;
  const completed = currentFilteredTasks.filter((t) => t.status === "COMPLETED").length;
  const inProgress = currentFilteredTasks.filter((t) => t.status === "IN_PROGRESS").length;
  const todo = currentFilteredTasks.filter((t) => t.status === "TODO").length;
  const completionRate = total > 0 ? Math.round(completed / total * 100) : 0;
  return <div className="space-y-6">
      {
    /* Top Banner */
  }
      <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg">
              <FileDown className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Export & Reports
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Generate standards-compliant CSV files and formatted PDF reports
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <button
    onClick={() => handleExportCSV(false)}
    disabled={isExporting || total === 0}
    className="flex-1 md:flex-initial h-8 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750 text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
  >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Export CSV</span>
          </button>

          <button
    onClick={handleExportPDF}
    disabled={isExporting || total === 0}
    className="flex-1 md:flex-initial h-8 px-3.5 bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
  >
            <FileText className="w-3.5 h-3.5" />
            <span>Export PDF Report</span>
          </button>
        </div>
      </div>

      {
    /* Configuration & Filter Panel */
  }
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Configure Report Parameters & Scope
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Custom Report Document Title
            </label>
            <input
    type="text"
    value={reportTitle}
    onChange={(e) => setReportTitle(e.target.value)}
    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
  />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Category
              </label>
              <select
    value={filterCategory}
    onChange={(e) => setFilterCategory(e.target.value)}
    className="w-full p-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
  >
                <option value="ALL">All Categories</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Status
              </label>
              <select
    value={filterStatus}
    onChange={(e) => setFilterStatus(e.target.value)}
    className="w-full p-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
  >
                <option value="ALL">All Statuses</option>
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Priority
              </label>
              <select
    value={filterPriority}
    onChange={(e) => setFilterPriority(e.target.value)}
    className="w-full p-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
  >
                <option value="ALL">All Priorities</option>
                <option value="URGENT">Urgent</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Date Horizon
              </label>
              <select
    value={filterDate}
    onChange={(e) => setFilterDate(e.target.value)}
    className="w-full p-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
  >
                <option value="ALL">All Horizons</option>
                <option value="OVERDUE">Overdue Only</option>
                <option value="TODAY">Due Today</option>
                <option value="UPCOMING_WEEK">Next 7 Days</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {
    /* Live Aggregates Summary Strip */
  }
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
          <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
            <span className="text-[11px] text-slate-500 block">Matching Tasks</span>
            <span className="text-lg font-bold text-slate-900 dark:text-white">{total}</span>
          </div>
          <div className="p-2.5 bg-amber-50 dark:bg-amber-950/30 rounded-xl">
            <span className="text-[11px] text-amber-700 dark:text-amber-400 block">Pending To-Do</span>
            <span className="text-lg font-bold text-amber-700 dark:text-amber-300">{todo}</span>
          </div>
          <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl">
            <span className="text-[11px] text-indigo-700 dark:text-indigo-400 block">In Progress</span>
            <span className="text-lg font-bold text-indigo-700 dark:text-indigo-300">{inProgress}</span>
          </div>
          <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl">
            <span className="text-[11px] text-emerald-700 dark:text-emerald-400 block">Completed</span>
            <span className="text-lg font-bold text-emerald-700 dark:text-emerald-300">{completed}</span>
          </div>
          <div className="p-2.5 bg-violet-50 dark:bg-violet-950/30 rounded-xl col-span-2 sm:col-span-1">
            <span className="text-[11px] text-violet-700 dark:text-violet-400 block">Completion Rate</span>
            <span className="text-lg font-bold text-violet-700 dark:text-violet-300">{completionRate}%</span>
          </div>
        </div>
      </div>

      {
    /* Live Report Preview Grid */
  }
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-indigo-500" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Live Export Data Preview ({currentFilteredTasks.length} records)
            </h4>
          </div>

          <button
    onClick={() => handleExportCSV(true)}
    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium cursor-pointer"
  >
            Download Full Database CSV ({tasks.length} total)
          </button>
        </div>

        <div className="overflow-x-auto max-h-[400px]">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-800/80 sticky top-0 border-b border-slate-200 dark:border-slate-700 text-slate-500 font-semibold">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3">Task Title</th>
                <th className="p-3">Category</th>
                <th className="p-3">Priority</th>
                <th className="p-3">Status</th>
                <th className="p-3">Due Date</th>
                <th className="p-3">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {currentFilteredTasks.map((t, idx) => {
    const cat = t.category_id ? categoryMap.get(t.category_id) : void 0;
    return <tr key={t.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="p-3 font-mono text-[11px] text-slate-400">{idx + 1}</td>
                    <td className="p-3 font-semibold text-slate-900 dark:text-white max-w-xs truncate">{t.title}</td>
                    <td className="p-3">
                      {cat ? <span
      className="px-2 py-0.5 rounded text-[11px] font-medium"
      style={{ backgroundColor: `${cat.color}15`, color: cat.color }}
    >
                          {cat.name}
                        </span> : <span className="text-slate-400 italic">None</span>}
                    </td>
                    <td className="p-3 font-semibold text-[11px]">{t.priority}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${t.status === "COMPLETED" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" : t.status === "IN_PROGRESS" ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300" : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"}`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="p-3 text-[11px]">{new Date(t.due_date).toLocaleDateString()}</td>
                    <td className="p-3 text-[11px] text-slate-400">{new Date(t.created_at).toLocaleDateString()}</td>
                  </tr>;
  })}
            </tbody>
          </table>
        </div>
      </div>
    </div>;
};
