import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export const TaskStatusChart = ({ tasks, todo, inProgress, completed, isDark = false }) => {
  const canvasRef = useRef(null);
  const chartInstanceRef = useRef(null);

  // Safely compute counts from either explicit props or the tasks array
  const finalTodo = typeof todo === "number"
    ? todo
    : (Array.isArray(tasks) ? tasks.filter((t) => t.status === "TODO").length : 0);

  const finalInProgress = typeof inProgress === "number"
    ? inProgress
    : (Array.isArray(tasks) ? tasks.filter((t) => t.status === "IN_PROGRESS").length : 0);

  const finalCompleted = typeof completed === "number"
    ? completed
    : (Array.isArray(tasks) ? tasks.filter((t) => t.status === "COMPLETED").length : 0);

  const total = finalTodo + finalInProgress + finalCompleted;

  useEffect(() => {
    if (!canvasRef.current) return;
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    const textColor = isDark ? "#cbd5e1" : "#475569";
    const borderColor = isDark ? "#1e293b" : "#ffffff";
    const data = total === 0 ? [1] : [finalTodo, finalInProgress, finalCompleted];
    const labels = total === 0 ? ["No Tasks"] : ["To Do", "In Progress", "Completed"];
    const bgColors = total === 0
      ? [isDark ? "#1b3f3a" : "#e8e4dc"]
      : ["#f59e0b", "#0284c7", "#10b981"];

    chartInstanceRef.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels,
        datasets: [
          {
            data,
            backgroundColor: bgColors,
            borderColor,
            borderWidth: 2,
            hoverOffset: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              color: textColor,
              font: {
                family: "Plus Jakarta Sans, sans-serif",
                size: 12
              },
              padding: 16,
              usePointStyle: true,
              pointStyle: "circle"
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                if (total === 0) return " No tasks registered";
                const val = context.raw;
                const pct = total > 0 ? Math.round((val / total) * 100) : 0;
                return ` ${context.label}: ${val} (${pct}%)`;
              }
            }
          }
        },
        cutout: "72%"
      }
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [finalTodo, finalInProgress, finalCompleted, total, isDark]);

  return (
    <div className="relative w-full h-64 flex items-center justify-center">
      <canvas ref={canvasRef} />
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-6">
        <span className="text-3xl font-bold text-slate-800 dark:text-slate-100">
          {total}
        </span>
        <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">
          Total Tasks
        </span>
      </div>
    </div>
  );
};
