'use client';

import { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { analyticsApi } from '@/lib/api';
import { Eye, Users, BarChart3, Filter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const AnalyticsChart = dynamic(
  () => import('./components/AnalyticsChart'),
  { ssr: false, loading: () => <div className="h-full min-h-[200px] w-full flex items-center justify-center text-cinema-muted animate-pulse">Loading chart...</div> }
);

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;
const months = Array.from({ length: 12 }, (_, i) => ({ value: String(i + 1), label: new Date(2000, i).toLocaleString('default', { month: 'long' }) }));
const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

type ChartType = 'leads' | 'visits';

export default function AdminAnalyticsPage() {
  const [filter, setFilter] = useState<'daywise' | 'monthwise'>('daywise');
  const [year, setYear] = useState(String(currentYear));
  const [month, setMonth] = useState(String(currentMonth));
  const [chartType, setChartType] = useState<ChartType>('leads');
  const [data, setData] = useState<{
    totalVisits: number;
    totalLeads: number;
    chartData: { leads: { label: string; count: number }[]; visits: { label: string; count: number }[] };
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const params: { filter: string; year?: number; month?: number } = { filter };
    params.year = parseInt(year);
    if (filter === 'daywise') params.month = parseInt(month);

    analyticsApi.get(params).then((res) => {
      if (!cancelled) {
        setData({
          totalVisits: res.totalVisits,
          totalLeads: res.totalLeads,
          chartData: res.chartData,
        });
        setLoading(false);
      }
    }).catch(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, [filter, year, month]);

  const leadsChartData = useMemo(() => ({
    labels: data?.chartData?.leads?.map((d) => d.label) || [],
    datasets: [
      { label: 'Total Leads', data: data?.chartData?.leads?.map((d) => d.count) || [], backgroundColor: 'rgba(200, 169, 106, 0.8)' },
    ],
  }), [data?.chartData?.leads]);

  const visitsChartData = useMemo(() => ({
    labels: data?.chartData?.visits?.map((d) => d.label) || [],
    datasets: [
      { label: 'Total Visits', data: data?.chartData?.visits?.map((d) => d.count) || [], backgroundColor: 'rgba(212, 175, 55, 0.8)' },
    ],
  }), [data?.chartData?.visits]);

  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: { top: 24, right: 8, bottom: 8, left: 8 },
    },
    animation: {
      duration: 450,
      easing: 'easeOutQuart',
    },
    animations: {
      numbers: {
        from: 0,
        duration: 450,
        easing: 'easeOutQuart',
      },
    },
    plugins: {
      legend: { display: false },
    },
    datasets: {
      bar: {
        barPercentage: 0.6,
        categoryPercentage: 0.75,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: filter === 'daywise'
            ? `Day of Month (${months.find((m) => m.value === month)?.label ?? ''})`
            : `Months (${year})`,
          color: '#BFBFBF',
          font: { size: 15, weight: '600' },
        },
        ticks: { color: '#BFBFBF', font: { size: 11 } },
        grid: { display: false },
      },
      y: {
        display: false,
        beginAtZero: true,
        grace: '8%',
      },
    },
  }), [filter, month, year]);

  const activeChartData = chartType === 'leads' ? leadsChartData : visitsChartData;

  return (
    <div className="space-y-4 h-[calc(100vh-6rem)] overflow-hidden flex flex-col">
      <h1 className="text-2xl font-bold shrink-0">Analytics</h1>

      <div className="grid gap-3 md:grid-cols-2 shrink-0">
        <Card className="py-2">
          <CardHeader className="flex flex-row items-center justify-between pb-1 pt-4 px-4">
            <CardTitle className="text-sm font-medium text-cinema-muted">Total Visits</CardTitle>
            <Eye className="h-4 w-4 text-cinema-muted" />
          </CardHeader>
          <CardContent className="px-4 pb-4 pt-0">
            <div className="text-xl font-bold">{loading ? '...' : data?.totalVisits ?? 0}</div>
          </CardContent>
        </Card>
        <Card className="py-2">
          <CardHeader className="flex flex-row items-center justify-between pb-1 pt-4 px-4">
            <CardTitle className="text-sm font-medium text-cinema-muted">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-cinema-muted" />
          </CardHeader>
          <CardContent className="px-4 pb-4 pt-0">
            <div className="text-xl font-bold">{loading ? '...' : data?.totalLeads ?? 0}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="flex-1 min-h-0 flex flex-col overflow-hidden">
        <CardHeader className="pb-2 pt-4 px-4 shrink-0">
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-cinema-muted" />
                Configuration
              </CardTitle>
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex rounded-lg border border-cinema p-0.5">
                  <button
                    type="button"
                    onClick={() => setFilter('daywise')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      filter === 'daywise' ? 'bg-cinema-gold text-cinema-black' : 'text-cinema-secondary hover:text-cinema-white'
                    }`}
                  >
                    Day Wise
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilter('monthwise')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      filter === 'monthwise' ? 'bg-cinema-gold text-cinema-black' : 'text-cinema-secondary hover:text-cinema-white'
                    }`}
                  >
                    Month Wise
                  </button>
                </div>
                <Select value={year} onValueChange={setYear}>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((y) => (
                      <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {filter === 'daywise' && (
                  <Select value={month} onValueChange={setMonth}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Month" />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((m) => (
                        <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0 px-4 pb-4 flex-1 min-h-0 flex flex-col">
          <div className="space-y-3 flex-1 min-h-0 flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shrink-0">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-cinema-gold" />
                Analytics Charts
              </h3>
              <div className="flex rounded-lg border border-cinema p-0.5 w-fit">
                <button
                  type="button"
                  onClick={() => setChartType('leads')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    chartType === 'leads' ? 'bg-cinema-gold text-cinema-black' : 'text-cinema-secondary hover:text-cinema-white'
                  }`}
                >
                  Total Leads
                </button>
                <button
                  type="button"
                  onClick={() => setChartType('visits')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    chartType === 'visits' ? 'bg-cinema-gold text-cinema-black' : 'text-cinema-secondary hover:text-cinema-white'
                  }`}
                >
                  Total Visits
                </button>
              </div>
            </div>
            <div className="min-h-0 flex-1 flex">
              {loading ? (
                <div className="h-full min-h-[200px] w-full flex items-center justify-center text-cinema-muted animate-pulse">Loading chart...</div>
              ) : (
                <AnalyticsChart data={activeChartData} options={chartOptions} />
              )}
            </div>
            <div className="border-t border-cinema pt-2 text-sm text-cinema-secondary shrink-0">
              {chartType === 'leads' && (
                <span>Total Leads: <span className="font-bold text-cinema-white">{(data?.chartData?.leads?.reduce((s, d) => s + d.count, 0) ?? 0).toLocaleString()}</span> {filter === 'monthwise' ? `(${year})` : `(${months.find((m) => m.value === month)?.label} ${year})`}</span>
              )}
              {chartType === 'visits' && (
                <span>Total Visits: <span className="font-bold text-cinema-white">{(data?.chartData?.visits?.reduce((s, d) => s + d.count, 0) ?? 0).toLocaleString()}</span> {filter === 'monthwise' ? `(${year})` : `(${months.find((m) => m.value === month)?.label} ${year})`}</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
