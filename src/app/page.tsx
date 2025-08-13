'use client';

import { useState, useEffect } from 'react';

interface EmailData {
  id: number;
  email: string;
  created_at: string;
}

export default function Home() {
  // PIN Authentication
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');
  const correctPin = '230299';

  // Email functionality
  const [email, setEmail] = useState('');
  const [emails, setEmails] = useState<EmailData[]>([]);
  const [allEmails, setAllEmails] = useState<EmailData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [dbInitialized, setDbInitialized] = useState(false);

  // Check if user is already authenticated (from localStorage)
  useEffect(() => {
    const authStatus = localStorage.getItem('emailCollectorAuth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Initialize database on component mount (only if authenticated)
  useEffect(() => {
    if (isAuthenticated) {
      initializeDatabase();
    }
  }, [isAuthenticated]);

  // Fetch emails after database is initialized
  useEffect(() => {
    if (dbInitialized) {
      fetchEmails();
    }
  }, [dbInitialized]);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (pin === correctPin) {
      setIsAuthenticated(true);
      localStorage.setItem('emailCollectorAuth', 'true');
      setPinError('');
      setPin('');
    } else {
      setPinError('PIN salah! Silakan coba lagi.');
      setPin('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('emailCollectorAuth');
    setPin('');
    setPinError('');
    // Reset all states
    setEmail('');
    setEmails([]);
    setAllEmails([]);
    setSearchQuery('');
    setMessage('');
    setDbInitialized(false);
  };

  const initializeDatabase = async () => {
    try {
      const response = await fetch('/api/init-db', {
        method: 'POST',
      });
      const result = await response.json();
      
      if (result.success) {
        setDbInitialized(true);
      } else {
        setMessage('Gagal menginisialisasi database');
      }
    } catch (error) {
      console.error('Database initialization error:', error);
      setMessage('Error koneksi database');
    }
  };

  const fetchEmails = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/emails');
      const result = await response.json();
      
      if (result.success) {
        setAllEmails(result.data);
        setEmails(result.data);
      } else {
        setMessage('Gagal memuat daftar email');
      }
    } catch (error) {
      console.error('Error fetching emails:', error);
      setMessage('Error memuat data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setEmails(allEmails);
      return;
    }

    // Simple client-side search
    const filteredEmails = allEmails.filter(emailItem =>
      emailItem.email.toLowerCase().includes(query.toLowerCase())
    );
    setEmails(filteredEmails);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setEmails(allEmails);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedEmail = email.trim().toLowerCase();
    
    if (!trimmedEmail) {
      setMessage('Email tidak boleh kosong');
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      setMessage('Format email tidak valid');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: trimmedEmail }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setEmail('');
        setMessage('Email berhasil ditambahkan!');
        await fetchEmails(); // Refresh the list
        if (searchQuery) {
          handleSearch(searchQuery); // Refresh search results
        }
      } else {
        setMessage(result.error || 'Gagal menambahkan email');
      }
    } catch (error) {
      console.error('Error adding email:', error);
      setMessage('Error menambahkan email');
    } finally {
      setLoading(false);
    }
    
    setTimeout(() => setMessage(''), 3000);
  };

  const handleDelete = async (emailId: number) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/emails/${emailId}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (result.success) {
        setMessage('Email berhasil dihapus');
        await fetchEmails(); // Refresh the list
        if (searchQuery) {
          handleSearch(searchQuery); // Refresh search results
        }
      } else {
        setMessage(result.error || 'Gagal menghapus email');
      }
    } catch (error) {
      console.error('Error deleting email:', error);
      setMessage('Error menghapus email');
    } finally {
      setLoading(false);
    }
    
    setTimeout(() => setMessage(''), 3000);
  };

  const handleExport = () => {
    const dataStr = emails.map(item => item.email).join('\n');
    const dataBlob = new Blob([dataStr], { type: 'text/plain' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    const filename = searchQuery 
      ? `email-list-search-${searchQuery.replace(/[^a-zA-Z0-9]/g, '_')}.txt`
      : 'email-list.txt';
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleClearAll = async () => {
    if (confirm('Apakah Anda yakin ingin menghapus semua email?')) {
      try {
        setLoading(true);
        const response = await fetch('/api/emails', {
          method: 'DELETE',
        });
        
        const result = await response.json();
        
        if (result.success) {
          setMessage('Semua email berhasil dihapus');
          await fetchEmails(); // Refresh the list
          clearSearch(); // Clear search when all emails deleted
        } else {
          setMessage(result.error || 'Gagal menghapus email');
        }
      } catch (error) {
        console.error('Error clearing emails:', error);
        setMessage('Error menghapus email');
      } finally {
        setLoading(false);
      }
      
      setTimeout(() => setMessage(''), 3000);
    }
  };

  // PIN Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
              Email Collector
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Masukkan PIN untuk mengakses aplikasi
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handlePinSubmit}>
            <div>
              <label htmlFor="pin" className="sr-only">
                PIN
              </label>
              <input
                id="pin"
                name="pin"
                type="password"
                required
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm text-center text-lg tracking-widest"
                placeholder="Masukkan PIN"
                maxLength={6}
              />
            </div>

            {pinError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {pinError}
              </div>
            )}

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg className="h-5 w-5 text-blue-500 group-hover:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </span>
                Masuk
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Main Application (after authentication)
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Email Collector
            </h1>
            <button
              onClick={handleLogout}
              className="text-sm text-red-600 hover:text-red-800 font-medium"
            >
              Logout
            </button>
          </div>
          {!dbInitialized && (
            <div className="mb-4 p-3 bg-yellow-100 text-yellow-700 rounded-md">
              Menginisialisasi database...
            </div>
          )}
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading || !dbInitialized}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                placeholder="masukkan@email.com"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading || !dbInitialized}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
            >
              {loading ? 'Memproses...' : 'Tambah Email'}
            </button>
          </form>

          {message && (
            <div className={`mt-4 p-3 rounded-md ${
              message.includes('berhasil') 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {message}
            </div>
          )}
        </div>

        {allEmails.length > 0 && (
          <div className="mt-8 bg-white shadow-md rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Daftar Email ({searchQuery ? `${emails.length} dari ${allEmails.length}` : emails.length})
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={handleExport}
                  disabled={loading}
                  className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
                >
                  Export
                </button>
                <button
                  onClick={handleClearAll}
                  disabled={loading}
                  className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400"
                >
                  Hapus Semua
                </button>
              </div>
            </div>

            {/* Search Box */}
            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari email..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  disabled={loading}
                  className="w-full px-3 py-2 pl-10 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <svg className="h-4 w-4 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              {searchQuery && (
                <p className="mt-2 text-sm text-gray-600">
                  Menampilkan {emails.length} hasil untuk "{searchQuery}"
                  {emails.length === 0 && (
                    <span className="text-red-600"> - Tidak ada email yang ditemukan</span>
                  )}
                </p>
              )}
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {emails.length > 0 ? (
                emails.map((emailItem) => (
                  <div key={emailItem.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-700">{emailItem.email}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(emailItem.created_at).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDelete(emailItem.id)}
                      disabled={loading}
                      className="text-red-600 hover:text-red-800 text-sm font-medium disabled:text-gray-400"
                    >
                      Hapus
                    </button>
                  </div>
                ))
              ) : searchQuery ? (
                <div className="text-center py-8 text-gray-500">
                  <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <p>Tidak ada email yang cocok dengan pencarian "{searchQuery}"</p>
                  <button
                    onClick={clearSearch}
                    className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Hapus pencarian
                  </button>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Belum ada email yang tersimpan</p>
                </div>
              )}
            </div>
          </div>
        )}

        {loading && (
          <div className="mt-4 text-center">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>
    </div>
  );
}