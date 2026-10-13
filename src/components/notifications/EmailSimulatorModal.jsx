import { useState } from "react";
import { Mail, CheckCircle2, X, Terminal, ShieldCheck, RefreshCw } from "lucide-react";
import { storageService } from "../../services/storage";
export const EmailSimulatorModal = ({ isOpen, onClose }) => {
  const [selectedEmail, setSelectedEmail] = useState(null);
  const sentEmails = storageService.getSentEmails();
  if (!isOpen) return null;
  const currentEmail = selectedEmail || sentEmails[0] || null;
  const handleTriggerSweep = () => {
    storageService.checkAndDispatchDeadlineReminders();
  };
  return <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
    className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]"
    onClick={(e) => e.stopPropagation()}
  >
        {
    /* Header */
  }
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 rounded-lg">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Automated SMTP Email Dispatch Logs
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  SMTP Live
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Automated 24h deadline reminder notifications and dispatch logs
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
    onClick={handleTriggerSweep}
    className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
    title="Run Celery check command"
  >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Run Scheduler Sweep</span>
            </button>
            <button
    onClick={onClose}
    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
  >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {
    /* 2-Column Layout: Sent Emails List vs Selected Email HTML Preview */
  }
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800">
          {
    /* Email List Left Column (4 cols) */
  }
          <div className="md:col-span-5 overflow-y-auto p-3 space-y-2 max-h-[600px]">
            <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Dispatched Emails ({sentEmails.length})</span>
              <span className="text-[10px] text-emerald-500">Duplicate Shield Active</span>
            </div>

            {sentEmails.length === 0 ? <div className="p-8 text-center text-xs text-slate-400">
                No reminder emails dispatched yet. Click "Run Scheduler Sweep" to evaluate deadline horizons.
              </div> : sentEmails.map((mail) => <div
    key={mail.id}
    onClick={() => setSelectedEmail(mail)}
    className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${currentEmail?.id === mail.id ? "bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-400 dark:border-indigo-600 shadow-2xs" : "bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 hover:border-slate-300"}`}
  >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[200px]">
                      {mail.recipient_email}
                    </span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5">
                      <CheckCircle2 className="w-3 h-3" />
                      {mail.status}
                    </span>
                  </div>
                  <p className="font-medium text-slate-700 dark:text-slate-300 truncate mb-1">
                    {mail.subject}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>Task: {mail.task_title.slice(0, 24)}...</span>
                    <span>{new Date(mail.sent_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                </div>)}
          </div>

          {
    /* Email Preview Right Column (7 cols) */
  }
          <div className="md:col-span-7 flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-950/50 p-4">
            {currentEmail ? <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
                {
    /* SMTP Envelope Header */
  }
                <div className="p-4 bg-slate-100/70 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-xs space-y-1.5 font-mono">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-bold uppercase w-16">Subject:</span>
                    <span className="font-semibold text-slate-900 dark:text-white font-sans text-xs">
                      {currentEmail.subject}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-bold uppercase w-16">To:</span>
                    <span className="text-slate-700 dark:text-slate-300">
                      {currentEmail.recipient_name} &lt;{currentEmail.recipient_email}&gt;
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-bold uppercase w-16">From:</span>
                    <span className="text-slate-700 dark:text-slate-300">
                      TaskFlow Alerts &lt;notifications@taskflow.dev&gt;
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-bold uppercase w-16">Sent:</span>
                    <span className="text-slate-700 dark:text-slate-300">
                      {new Date(currentEmail.sent_at).toLocaleString()}
                    </span>
                  </div>
                </div>

                {
    /* HTML Body Render */
  }
                <div className="flex-1 p-5 overflow-y-auto">
                  <div
    className="prose dark:prose-invert max-w-none text-xs"
    dangerouslySetInnerHTML={{ __html: currentEmail.body_html }}
  />
                </div>
              </div> : <div className="flex-1 flex items-center justify-center text-xs text-slate-400">
                Select an email from the list to preview content
              </div>}
          </div>
        </div>

        {
    /* Footer info */
  }
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-mono text-[11px]">
              Active Provider: Secure Automated SMTP Email Engine
            </span>
          </div>
          <button
    onClick={onClose}
    className="px-4 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 rounded-lg text-slate-800 dark:text-slate-200 font-medium cursor-pointer"
  >
            Close
          </button>
        </div>
      </div>
    </div>;
};
