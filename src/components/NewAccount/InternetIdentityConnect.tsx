'use client';

import { useInternetIdentity } from '@/hooks/useInternetIdentity';

export default function InternetIdentityConnect() {
  const { isAuthenticated, principal, login, logout, loading } = useInternetIdentity();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  if (isAuthenticated && principal) {
    return (
      <div className="space-y-4 p-4 border rounded-lg bg-green-50 dark:bg-green-900/20">
        <div className="flex items-center justify-between gap-5">
          <div>
            <h3 className="font-semibold text-green-800 dark:text-green-300">
              Connected to Internet Identity
            </h3>
            <p className="text-sm text-green-600 dark:text-green-500 font-mono">
              {principal}
            </p>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Disconnect
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="text-center">
        <h3 className="font-semibold mb-2">Connect Internet Identity</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Connect your Internet Identity to create ICP wallets
        </p>
        <button
          onClick={login}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Connect Internet Identity
        </button>
      </div>
    </div>
  );
}
