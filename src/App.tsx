import { useEffect, useState } from 'react';

interface HealthStatus {
  status: string;
  service: string;
  rbacEnforced: boolean;
  timestamp: string;
}

export default function App() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/health')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: HealthStatus) => {
        setHealth(data);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          আনো বাজার
        </h1>
        <p className="text-center text-gray-500 mb-6">AANO BAZAR</p>

        {loading && (
          <div className="text-center text-gray-500">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mb-3" />
            <p>সার্ভার স্ট্যাটাস যাচাই করা হচ্ছে...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-red-600 font-medium">সার্ভার সংযোগ ব্যর্থ</p>
            <p className="text-red-400 text-sm mt-1">{error}</p>
          </div>
        )}

        {health && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-block w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-emerald-700 font-medium">
                সার্ভার সক্রিয়
              </span>
            </div>
            <dl className="space-y-1 text-sm text-gray-600">
              <div className="flex justify-between">
                <dt>সার্ভিস:</dt>
                <dd className="font-medium">{health.service}</dd>
              </div>
              <div className="flex justify-between">
                <dt>RBAC:</dt>
                <dd className="font-medium">
                  {health.rbacEnforced ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                </dd>
              </div>
            </dl>
          </div>
        )}
      </div>
    </div>
  );
}
