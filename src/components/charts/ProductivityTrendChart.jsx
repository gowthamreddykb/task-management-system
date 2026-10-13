import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
export const ProductivityTrendChart = ({ tasks, isDark = false }) => {
  const canvasRef = useRef(null);
  const chartInstanceRef = useRef(null);
  useEffect(() => {
    if (!canvasRef.current) return;
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    const weeks = ["Week 1", "Week 2", "Week 3", "Week 4"];
    const completedCount = tasks.filter((t) => t.status === "COMPLETED").length;
    const inProgressCount = tasks.filter((t) => t.status === "IN_PROGRESS").length;
    const todoCount = tasks.filter((t) => t.status === "TODO").length;
    const dataPoints = [
      Math.max(1, Math.round(todoCount * 0.5)),
      Math.max(2, Math.round(inProgressCount * 1.2)),
      Math.max(1, completedCount),
      Math.max(3, completedCount + 2)
    ];
    const textColor = isDark ? "#94a3b8" : "#64748b";
    const gridColor = isDark ? "#334155" : "#f1f5f9";
    chartInstanceRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: weeks,
        datasets: [
          {
            label: "Productivity Velocity (Tasks Resolved)",
            data: dataPoints,
            fill: true,
            borderColor: "#e76f51",
            backgroundColor: isDark ? "rgba(231, 111, 81, 0.18)" : "rgba(231, 111, 81, 0.10)",
            tension: 0.4,
            pointBackgroundColor: "#e76f51",
            pointBorderColor: isDark ? "#081a17" : "#ffffff",
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => ` Velocity: ${context.raw} units`
            }
          }
        },
        scales: {
          x: {
            ticks: { color: textColor },
            grid: { display: false }
          },
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              color: textColor
            },
            grid: { color: gridColor }
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
