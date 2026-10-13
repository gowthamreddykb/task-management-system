import { useState } from "react";
import {
  User as UserIcon,
  X,
  Check,
  Moon,
  Sun,
  Monitor
} from "lucide-react";
import { storageService } from "../../services/storage";
export const UserProfileModal = ({
  isOpen,
  onClose,
  currentUser,
  profile,
  onThemeChange
}) => {
  const [firstName, setFirstName] = useState(currentUser.first_name);
  const [lastName, setLastName] = useState(currentUser.last_name);
  const [email, setEmail] = useState(currentUser.email);
  const [role, setRole] = useState(profile.role);
  const [bio, setBio] = useState(profile.bio || "");
  const [emailEnabled, setEmailEnabled] = useState(profile.email_notifications_enabled);
  const [reminderHours, setReminderHours] = useState(profile.reminder_hours_before || 24);
  const [selectedTheme, setSelectedTheme] = useState(profile.theme);
  const [savedSuccess, setSavedSuccess] = useState(false);
  if (!isOpen) return null;
  const handleSubmit = (e) => {
    e.preventDefault();
    storageService.updateCurrentUser({
      first_name: firstName,
      last_name: lastName,
      email
    });
    storageService.updateProfile({
      role,
      bio,
      email_notifications_enabled: emailEnabled,
      reminder_hours_before: Number(reminderHours),
      theme: selectedTheme
    });
    onThemeChange(selectedTheme);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1e3);
  };
  return <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
    className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]"
    onClick={(e) => e.stopPropagation()}
  >
        {
    /* Header */
  }
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm overflow-hidden">
              {currentUser.first_name[0]}{currentUser.last_name[0]}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Account & User Profile
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  @{currentUser.username}
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Manage your user details, preferences, and session settings
              </p>
            </div>
          </div>

          <button
    onClick={onClose}
    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
  >
            <X className="w-5 h-5" />
          </button>
        </div>

        {
    /* Form Body */
  }
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {
    /* Single User Profile Notice */
  }
          <div className="p-3 bg-slate-100 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Personal Single-User Workspace
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-500">
              Active User: {currentUser.username}
            </span>
          </div>

          {
    /* Name Row */
  }
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                First Name
              </label>
              <input
    type="text"
    value={firstName}
    onChange={(e) => setFirstName(e.target.value)}
    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
  />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Last Name
              </label>
              <input
    type="text"
    value={lastName}
    onChange={(e) => setLastName(e.target.value)}
    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
  />
            </div>
          </div>

          {
    /* Email */
  }
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Email Address (For Deadline Reminders)
            </label>
            <input
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
  />
          </div>

          {
    /* Role & Bio */
  }
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Designation / Role
              </label>
              <input
    type="text"
    value={role}
    onChange={(e) => setRole(e.target.value)}
    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
  />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Lead Time for Reminders (Hours)
              </label>
              <select
    value={reminderHours}
    onChange={(e) => setReminderHours(Number(e.target.value))}
    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white cursor-pointer"
  >
                <option value={12}>12 Hours Before Due Date</option>
                <option value={24}>24 Hours Before Due Date (Standard)</option>
                <option value={48}>48 Hours Before Due Date</option>
              </select>
            </div>
          </div>

          {
    /* Email notifications toggle */
  }
          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
            <div>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                Enable Automated Deadline Reminders
              </span>
              <span className="text-[11px] text-slate-500">
                Dispatches background email alerts prior to approaching task deadlines
              </span>
            </div>
            <input
    type="checkbox"
    checked={emailEnabled}
    onChange={(e) => setEmailEnabled(e.target.checked)}
    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
  />
          </div>

          {
    /* Theme Preference */
  }
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Interface Theme Preference
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
    type="button"
    onClick={() => setSelectedTheme("light")}
    className={`py-2 px-3 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer ${selectedTheme === "light" ? "border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300" : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"}`}
  >
                <Sun className="w-3.5 h-3.5" />
                <span>Light</span>
              </button>
              <button
    type="button"
    onClick={() => setSelectedTheme("dark")}
    className={`py-2 px-3 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer ${selectedTheme === "dark" ? "border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300" : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"}`}
  >
                <Moon className="w-3.5 h-3.5" />
                <span>Dark</span>
              </button>
              <button
    type="button"
    onClick={() => setSelectedTheme("system")}
    className={`py-2 px-3 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer ${selectedTheme === "system" ? "border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300" : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"}`}
  >
                <Monitor className="w-3.5 h-3.5" />
                <span>System</span>
              </button>
            </div>
          </div>

          {
    /* Action buttons */
  }
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <button
    type="button"
    onClick={() => {
      if (confirm("Reset database to demo seed data?")) {
        storageService.resetToDemoData();
        onClose();
        window.location.reload();
      }
    }}
    className="text-xs text-rose-600 hover:underline cursor-pointer"
  >
              Reset to Demo Seed Data
            </button>

            <div className="flex items-center gap-2">
              <button
    type="button"
    onClick={onClose}
    className="px-3.5 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
  >
                Cancel
              </button>
              <button
    type="submit"
    className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
  >
                {savedSuccess ? <Check className="w-4 h-4 text-white" /> : null}
                <span>{savedSuccess ? "Saved!" : "Save Profile"}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>;
};
