'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authApi.login(username, password);
      if (typeof window !== 'undefined') {
        localStorage.setItem('eneme_admin_token', res.token);
        localStorage.setItem('eneme_admin_user', JSON.stringify(res.user));
      }
      router.push('/admin');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-cinema-black flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-b from-cinema-dark/50 to-cinema-black" />
      <Card className="relative w-full max-w-md border-cinema bg-cinema-card shadow-[0_0_60px_rgba(200,169,106,0.08)]">
        <CardHeader>
          <CardTitle className="text-2xl font-display text-cinema-white">Admin Login</CardTitle>
          <CardDescription className="text-cinema-secondary">Enter your credentials to access the ENEMME Admin Panel</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <p className="text-sm text-red-400 bg-red-500/10 p-3 rounded-lg border border-red-500/30">{error}</p>
            )}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-cinema-secondary">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="user@111"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-cinema-secondary">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <Button type="submit" className="w-full bg-cinema-gold text-cinema-black hover:bg-cinema-gold-hover hover:shadow-[0_0_24px_rgba(200,169,106,0.4)]" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
