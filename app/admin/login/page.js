'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Login() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  async function submit(e) {
    e.preventDefault();
    const r = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) });
    if (!r.ok) return setErr('پاس ورڈ غلط ہے');
    router.push('/admin');
    router.refresh();
  }
  return (
    <form onSubmit={submit} className="max-w-xs mx-auto mt-24 p-4 space-y-3">
      <h1 className="font-bold text-lg text-center">🔐 ایڈمن لاگ ان</h1>
      <input type="password" className="input" placeholder="پاس ورڈ" value={password} onChange={(e) => setPassword(e.target.value)} />
      {err && <p className="text-red-600 text-sm">{err}</p>}
      <button className="btn w-full">لاگ ان</button>
    </form>
  );
}
