import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
export const CategoryDistributionChart = ({ tasks, categories, isDark = false }) => {
  const canvasRef = useRef(null);
  const chartInstanceRef = useRef(null);
  useEffect(() => {
    if (!canvasRef.current) return;
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    const catCounts = categories.map((cat) => {
      const count = tasks.filter((t) => t.category_id === cat.id).length;
      return {
        name: cat.name,
        color: cat.color,
        count
      };
    });
    const uncategorizedCount = tasks.filter((t) => !t.category_id).length;
    if (uncategorizedCount > 0) {
      catCounts.push({
        name: "Uncategorized",
        color: "#94a3b8",
        count: uncategorizedCount
      });
    }
    const textColor = isDark ? "#94a3b8" : "#64748b";
    const gridColor = isDark ? "#334155" : "#f1f5f9";
    chartInstanceRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: catCounts.map((c) => c.name),
        datasets: [
          {
            label: "Task Count",
            data: catCounts.map((c) => c.count),
            backgroundColor: catCounts.map((c) => c.color),
            borderRadius: 6
          }
        ]
      },
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => ` ${context.raw} tasks in this category`
            }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              color: textColor
            },
            grid: { color: gridColor }
          },
          y: {
            ticks: {
              color: textColor,
              font: { family: "Plus Jakarta Sans", size: 11 }
            },
            grid: { display: false }
          }
        }
      }
    });
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [tasks, categories, isDark]);
  return <div className="w-full h-64">
      <canvas ref={canvasRef} />
    </div>;
};
