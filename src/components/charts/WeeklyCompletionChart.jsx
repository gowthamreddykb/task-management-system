import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
export const WeeklyCompletionChart = ({ tasks, isDark = false }) => {
  const canvasRef = useRef(null);
  const chartInstanceRef = useRef(null);
  useEffect(() => {
    if (!canvasRef.current) return;
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const now = /* @__PURE__ */ new Date();
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 864e5);
      const dayName = days[d.getDay()];
      const dateStr = d.toISOString().slice(0, 10);
      last7Days.push({ label: dayName, dateStr, count: 0 });
    }
    tasks.forEach((t) => {
      if (t.status === "COMPLETED" && t.completed_at) {
        const cDate = t.completed_at.slice(0, 10);
        const match = last7Days.find((d) => d.dateStr === cDate);
        if (match) match.count++;
      }
    });
    const textColor = isDark ? "#94a3b8" : "#64748b";
    const gridColor = isDark ? "#334155" : "#f1f5f9";
    chartInstanceRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: last7Days.map((d) => d.label),
        datasets: [
          {
            label: "Completed Tasks",
            data: last7Days.map((d) => d.count),
            backgroundColor: "rgba(6, 78, 67, 0.85)",
            hoverBackgroundColor: "rgba(6, 78, 67, 1)",
            borderRadius: 6,
            borderSkipped: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              title: (items) => {
                const idx = items[0].dataIndex;
                return `${last7Days[idx].label} (${last7Days[idx].dateStr})`;
              },
              label: (context) => ` Tasks Completed: ${context.raw}`
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: textColor, font: { family: "Plus Jakarta Sans" } }
          },
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              color: textColor,
              font: { family: "Plus Jakarta Sans" }
            },
            grid: {
              color: gridColor
            }
          }
        }
      }
    });
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [tasks, isDark]);
  return <div className="w-full h-64">
      <canvas ref={canvasRef} />
    </div>;
};
