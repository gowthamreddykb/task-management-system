import { useState } from "react";
import { Plus, Edit2, Trash2, Check, X, Palette, Layers } from "lucide-react";
import { storageService } from "../../services/storage";
const PRESET_COLORS = [
  "#6366f1",
  // Indigo
  "#8b5cf6",
  // Violet
  "#ec4899",
  // Pink
  "#f43f5e",
  // Rose
  "#f97316",
  // Orange
  "#eab308",
  // Amber/Yellow
  "#10b981",
  // Emerald
  "#06b6d4",
  // Cyan
  "#3b82f6",
  // Blue
  "#64748b"
  // Slate
];
export const CategoryManager = ({ categories, tasks }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#6366f1");
  const startCreate = () => {
    setIsCreating(true);
    setEditingId(null);
    setName("");
    setDescription("");
    setColor(PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)]);
  };
  const startEdit = (cat) => {
    setEditingId(cat.id);
    setIsCreating(false);
    setName(cat.name);
    setDescription(cat.description || "");
    setColor(cat.color);
  };
  const cancelForm = () => {
    setIsCreating(false);
    setEditingId(null);
    setName("");
    setDescription("");
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (editingId) {
      storageService.updateCategory(editingId, {
        name: name.trim(),
        description: description.trim(),
        color
      });
    } else {
      storageService.addCategory({
        name: name.trim(),
        description: description.trim(),
        color
      });
    }
    cancelForm();
  };
  const handleDelete = (id, name2) => {
    const count = tasks.filter((t) => t.category_id === id).length;
    const msg = count > 0 ? `Delete category "${name2}"? ${count} tasks currently associated with it will be unassigned.` : `Are you sure you want to delete category "${name2}"?`;
    if (confirm(msg)) {
      storageService.deleteCategory(id);
    }
  };
  return <div className="space-y-6">
      {
    /* Header */
  }
      <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Category Management
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Organize projects and workflows with color-coded tags and filters
              </p>
            </div>
          </div>
        </div>

        {!isCreating && !editingId && <button
    onClick={startCreate}
    className="h-8 px-3.5 bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer"
  >
            <Plus className="w-3.5 h-3.5 stroke-[2.2]" />
            <span>Add Category</span>
          </button>}
      </div>

      {
    /* Create / Edit Form Card */
  }
      {(isCreating || editingId) && <form
    onSubmit={handleSubmit}
    className="bg-white dark:bg-slate-900 rounded-2xl p-5 border-2 border-indigo-500/40 dark:border-indigo-500/50 shadow-md space-y-4 animate-in fade-in duration-150"
  >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Palette className="w-4 h-4 text-indigo-500" />
              {editingId ? "Edit Category" : "Create New Category"}
            </h3>
            <button
    type="button"
    onClick={cancelForm}
    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
  >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Category Name *
              </label>
              <input
    type="text"
    value={name}
    onChange={(e) => setName(e.target.value)}
    placeholder="e.g. Infrastructure, UI/UX, Sprint 3"
    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
    required
  />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Short Description
              </label>
              <input
    type="text"
    value={description}
    onChange={(e) => setDescription(e.target.value)}
    placeholder="Scope, objectives, or team label..."
    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
  />
            </div>
          </div>

          {
    /* Color Picker Swatches */
  }
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Category Color Accent
            </label>
            <div className="flex items-center gap-2.5 flex-wrap">
              {PRESET_COLORS.map((c) => <button
    type="button"
    key={c}
    onClick={() => setColor(c)}
    className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform hover:scale-110 cursor-pointer ${color === c ? "ring-2 ring-offset-2 ring-indigo-500 scale-105" : ""}`}
    style={{ backgroundColor: c }}
  >
                  {color === c && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                </button>)}

              <div className="flex items-center gap-1.5 ml-2">
                <input
    type="color"
    value={color}
    onChange={(e) => setColor(e.target.value)}
    className="w-7 h-7 rounded-lg border-0 cursor-pointer"
  />
                <span className="text-xs font-mono text-slate-500">{color}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
    type="button"
    onClick={cancelForm}
    className="px-3.5 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
  >
              Cancel
            </button>
            <button
    type="submit"
    className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer"
  >
              {editingId ? "Update Category" : "Save Category"}
            </button>
          </div>
        </form>}

      {
    /* Categories Grid */
  }
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => {
    const taskCount = tasks.filter((t) => t.category_id === cat.id).length;
    const completedCount = tasks.filter((t) => t.category_id === cat.id && t.status === "COMPLETED").length;
    const pct = taskCount > 0 ? Math.round(completedCount / taskCount * 100) : 0;
    return <div
      key={cat.id}
      className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-indigo-200 dark:hover:border-slate-700 transition-all flex flex-col justify-between"
    >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span
      className="w-3.5 h-3.5 rounded-full"
      style={{ backgroundColor: cat.color }}
    />
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      {cat.name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
      onClick={() => startEdit(cat)}
      className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-md transition-colors"
      title="Edit Category"
    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
      onClick={() => handleDelete(cat.id, cat.name)}
      className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 rounded-md transition-colors"
      title="Delete Category"
    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 min-h-[32px]">
                  {cat.description || "No description provided."}
                </p>
              </div>

              {
      /* Progress and task metrics */
    }
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">
                    {taskCount} {taskCount === 1 ? "task" : "tasks"} ({completedCount} done)
                  </span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    {pct}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
      className="h-full rounded-full transition-all duration-300"
      style={{
        width: `${pct}%`,
        backgroundColor: cat.color
      }}
    />
                </div>
              </div>
            </div>;
  })}
      </div>
    </div>;
};
