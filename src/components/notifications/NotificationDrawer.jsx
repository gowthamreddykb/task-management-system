import {
  Bell,
  Check,
  Trash2,
  Mail,
  Send
} from "lucide-react";
import { storageService } from "../../services/storage";
export const NotificationDrawer = ({
  isOpen,
  onClose,
  notifications,
  onOpenEmailSimulator
}) => {
  if (!isOpen) return null;
  const unreadCount = notifications.filter((n) => !n.is_read).length;
  const handleMarkAllRead = () => {
    storageService.markAllNotificationsAsRead();
  };
  const handleClearAll = () => {
    storageService.clearAllNotifications();
  };
  const handleCheckReminders = () => {
    const res = storageService.checkAndDispatchDeadlineReminders();
    if (res.dispatchedCount > 0) {
      alert(`Notification Service: ${res.dispatchedCount} deadline reminder email(s) dispatched!`);
    } else {
      alert("Notification Service: All tasks evaluated. No upcoming tasks within the deadline window needing reminders.");
    }
  };
  return <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/40 backdrop-blur-2xs animate-in fade-in duration-150">
      <div
    className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col"
    onClick={(e) => e.stopPropagation()}
  >
        {
    /* Drawer Header */
  }
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/60 dark:bg-slate-900/60">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-lg">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                Notification Center
                {unreadCount > 0 && <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-bold">
                    {unreadCount} new
                  </span>}
              </h3>
            </div>
          </div>

          <button
    onClick={onClose}
    className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
  >
            Close
          </button>
        </div>

        {
    /* Quick Dispatch Action Bar */
  }
        <div className="p-3 bg-indigo-50/40 dark:bg-indigo-950/20 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <button
    onClick={handleCheckReminders}
    className="flex items-center gap-1.5 px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors cursor-pointer text-[11px]"
    title="Scan database for 24h deadlines"
  >
            <Send className="w-3 h-3" />
            <span>Check 24h Deadlines Now</span>
          </button>

          <button
    onClick={onOpenEmailSimulator}
    className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline font-medium text-[11px] cursor-pointer"
  >
            <Mail className="w-3.5 h-3.5" />
            <span>SMTP Outbox</span>
          </button>
        </div>

        {
    /* Notification Items List */
  }
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 p-2">
          {notifications.length === 0 ? <div className="py-12 text-center text-slate-400 text-xs">
              <Bell className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2 opacity-50" />
              No notifications yet.
            </div> : notifications.map((n) => <div
    key={n.id}
    onClick={() => storageService.markNotificationAsRead(n.id)}
    className={`p-3 rounded-xl transition-colors cursor-pointer space-y-1 ${!n.is_read ? "bg-indigo-50/50 dark:bg-indigo-950/20 border-l-2 border-indigo-500" : "hover:bg-slate-50 dark:hover:bg-slate-800/40"}`}
  >
                <div className="flex items-start justify-between gap-2">
                  <span className={`text-xs font-semibold ${!n.is_read ? "text-indigo-950 dark:text-indigo-200" : "text-slate-700 dark:text-slate-300"}`}>
                    {n.title}
                  </span>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap">
                    {new Date(n.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {n.message}
                </p>
              </div>)}
        </div>

        {
    /* Drawer Bottom Controls */
  }
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between text-xs">
          <button
    onClick={handleMarkAllRead}
    disabled={unreadCount === 0}
    className="flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-indigo-600 disabled:opacity-40 cursor-pointer"
  >
            <Check className="w-3.5 h-3.5" />
            <span>Mark all read</span>
          </button>

          <button
    onClick={handleClearAll}
    disabled={notifications.length === 0}
    className="flex items-center gap-1 text-rose-600 dark:text-rose-400 hover:underline disabled:opacity-40 cursor-pointer"
  >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear list</span>
          </button>
        </div>
      </div>
    </div>;
};
