'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

const barLabelPlugin = {
  id: 'barLabel',
  afterDatasetsDraw(chart: { ctx: CanvasRenderingContext2D; data: { datasets: { data: (string | number | null)[] }[] }; getDatasetMeta: (i: number) => { data: { x: number; y: number }[] } }) {
    const { ctx, data } = chart;
    if (!data.datasets[0]?.data) return;
    chart.data.datasets.forEach((dataset, i) => {
      const meta = chart.getDatasetMeta(i);
      meta.data.forEach((bar, idx) => {
        const value = dataset.data[idx];
        if (value == null || Number(value) === 0) return;
        ctx.save();
        ctx.font = '600 12px sans-serif';
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'center';
        ctx.fillText(String(value), bar.x, bar.y - 8);
        ctx.restore();
      });
    });
  },
};

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, barLabelPlugin);

interface AnalyticsChartProps {
  data: { labels: string[]; datasets: { label: string; data: number[]; backgroundColor: string }[] };
  options: Record<string, unknown>;
}

export default function AnalyticsChart({ data, options }: AnalyticsChartProps) {
  return (
    <div className="h-full min-h-[200px] w-full">
      <Bar data={data} options={options} />
    </div>
  );
}
