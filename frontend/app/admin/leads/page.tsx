'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { leadsApi, Lead } from '@/lib/api';
import { Users, Check, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const currentYear = new Date().getFullYear();
const months = Array.from({ length: 12 }, (_, i) => ({ value: String(i + 1), label: new Date(2000, i).toLocaleString('default', { month: 'long' }) }));

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [filteredTotal, setFilteredTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [reviewedFilter, setReviewedFilter] = useState<'all' | 'reviewed' | 'not_reviewed'>('all');
  const [customMonth, setCustomMonth] = useState(String(new Date().getMonth() + 1));
  const [customYear, setCustomYear] = useState(String(currentYear));
  const [useCustom, setUseCustom] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const totalPages = Math.ceil(filteredTotal / limit) || 1;
  const startRow = filteredTotal === 0 ? 0 : (page - 1) * limit + 1;
  const endRow = Math.min(page * limit, filteredTotal);

  const loadLeads = useCallback(() => {
    setLoading(true);
    const params: Record<string, string> = {};
    if (filter === 'today') params.filter = 'today';
    else if (filter === 'week') params.filter = 'week';
    else if (filter === 'month') params.filter = 'month';
    else if (useCustom) {
      params.filter = 'custom';
      params.year = customYear;
      params.month = customMonth;
    }

    if (reviewedFilter === 'reviewed') params.reviewed = 'true';
    else if (reviewedFilter === 'not_reviewed') params.reviewed = 'false';

    params.page = String(page);
    params.limit = String(limit);

    leadsApi.get(params).then((res) => {
      setLeads(res.leads);
      setFilteredTotal(res.totalCount);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [filter, reviewedFilter, useCustom, customMonth, customYear, page, limit]);

  useEffect(() => {
    setPage(1);
  }, [filter, reviewedFilter, useCustom, customMonth, customYear]);

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  // Total leads count (overall, synced with analytics)
  useEffect(() => {
    leadsApi.getCount().then((c) => setTotalCount(c.totalCount));
  }, []);

  function handleMarkReviewed(id: string) {
    leadsApi.markReviewed(id).then(() => {
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, reviewed: true } : l)));
    });
  }

  function handleDelete(id: string) {
    if (!confirm('Delete this lead? This action cannot be undone.')) return;
    leadsApi.delete(id).then(() => {
      setLeads((prev) => prev.filter((l) => l.id !== id));
      setFilteredTotal((c) => Math.max(0, c - 1));
      setTotalCount((c) => Math.max(0, c - 1));
    }).catch(() => {});
  }

  const filterLabels = [
    { value: 'all' as const, label: 'All' },
    { value: 'today' as const, label: 'Today' },
    { value: 'week' as const, label: 'Last Week' },
    { value: 'month' as const, label: 'Last Month' },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Leads</h1>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-cinema-muted">Total Leads</CardTitle>
          <Users className="h-4 w-4 text-cinema-muted" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{loading ? '...' : totalCount}</div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-4 items-center">
        <span className="text-sm font-medium">Filter:</span>
        <div className="flex gap-2">
          {filterLabels.map((f) => (
            <Button
              key={f.value}
              variant={filter === f.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(f.value)}
            >
              {f.label}
            </Button>
          ))}
        </div>
        <div className="flex gap-2">
          <Button
            variant={useCustom ? 'default' : 'outline'}
            size="sm"
            onClick={() => setUseCustom(!useCustom)}
          >
            Custom
          </Button>
          {useCustom && (
            <>
              <Select value={customMonth} onValueChange={setCustomMonth}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((m) => (
                    <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={customYear} onValueChange={setCustomYear}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 5 }, (_, i) => currentYear - i).map((y) => (
                    <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </>
          )}
        </div>
        <span className="text-sm font-medium ml-4">Reviewed:</span>
        <div className="flex gap-2">
          <Button
            variant={reviewedFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setReviewedFilter('all')}
          >
            All
          </Button>
          <Button
            variant={reviewedFilter === 'reviewed' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setReviewedFilter('reviewed')}
          >
            Reviewed
          </Button>
          <Button
            variant={reviewedFilter === 'not_reviewed' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setReviewedFilter('not_reviewed')}
          >
            Not Reviewed
          </Button>
        </div>
      </div>

      <div className="rounded-lg border border-cinema overflow-hidden bg-cinema-card">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-cinema-dark">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-cinema-muted">Date</th>
                <th className="text-left p-4 text-sm font-medium text-cinema-muted">Name</th>
                <th className="text-left p-4 text-sm font-medium text-cinema-muted">Email</th>
                <th className="text-left p-4 text-sm font-medium text-cinema-muted">Phone</th>
                <th className="text-left p-4 text-sm font-medium text-cinema-muted">Company</th>
                <th className="text-left p-4 text-sm font-medium text-cinema-muted">Project Type</th>
                <th className="text-left p-4 text-sm font-medium text-cinema-muted">Message</th>
                <th className="text-left p-4 text-sm font-medium text-cinema-muted">Review</th>
                <th className="text-left p-4 text-sm font-medium text-cinema-muted">Delete</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={9} className="p-8 text-center text-cinema-muted">Loading...</td></tr>
              ) : leads.length === 0 ? (
                <tr><td colSpan={9} className="p-8 text-center text-cinema-muted">No leads found</td></tr>
              ) : (
                leads.map((lead) => (
                  <tr
                    key={lead.id}
                    className={cn(
                      'border-t border-cinema hover:bg-cinema-card/50',
                      lead.reviewed && 'bg-cinema-gold/5'
                    )}
                  >
                    <td className="p-4 text-sm">{new Date(lead.createdAt).toLocaleString()}</td>
                    <td className="p-4 text-sm">{lead.name}</td>
                    <td className="p-4 text-sm">{lead.email}</td>
                    <td className="p-4 text-sm">{lead.phone || '-'}</td>
                    <td className="p-4 text-sm">{lead.company || '-'}</td>
                    <td className="p-4 text-sm">{lead.projectType || '-'}</td>
                    <td className="p-4 text-sm max-w-[200px] truncate">{lead.message || '-'}</td>
                    <td className="p-4">
                      <Button
                        size="sm"
                        variant={lead.reviewed ? 'secondary' : 'default'}
                        onClick={() => !lead.reviewed && handleMarkReviewed(lead.id)}
                        disabled={lead.reviewed}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        {lead.reviewed ? 'Reviewed' : 'Review'}
                      </Button>
                    </td>
                    <td className="p-4">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(lead.id)}
                        title="Delete lead"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {!loading && leads.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-4 border-t border-cinema bg-cinema-dark/50">
            <div className="flex items-center gap-4 text-sm text-cinema-secondary">
              <span>
                Showing <span className="font-medium text-cinema-white">{startRow}</span> to <span className="font-medium text-cinema-white">{endRow}</span> of <span className="font-medium text-cinema-white">{filteredTotal}</span> leads
              </span>
              <div className="flex items-center gap-2">
                <span className="text-cinema-muted">Rows per page</span>
                <Select value={String(limit)} onValueChange={(v) => { setLimit(Number(v)); setPage(1); }}>
                  <SelectTrigger className="w-[70px] h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[5, 10, 15, 20, 25, 50].map((n) => (
                      <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-2 border-cinema text-cinema-secondary hover:bg-cinema-gold/20 hover:text-cinema-gold hover:border-cinema-gold/40"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-1 mx-2">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let p: number;
                  if (totalPages <= 5) p = i + 1;
                  else if (page <= 3) p = i + 1;
                  else if (page >= totalPages - 2) p = totalPages - 4 + i;
                  else p = page - 2 + i;
                  return (
                    <Button
                      key={p}
                      variant={page === p ? 'default' : 'outline'}
                      size="sm"
                      className={cn(
                        'h-8 w-8 p-0 text-sm',
                        page === p ? 'bg-cinema-gold text-cinema-black hover:bg-cinema-gold-hover' : 'border-cinema text-cinema-secondary hover:bg-cinema-gold/20 hover:text-cinema-gold hover:border-cinema-gold/40'
                      )}
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </Button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-2 border-cinema text-cinema-secondary hover:bg-cinema-gold/20 hover:text-cinema-gold hover:border-cinema-gold/40"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
