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
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

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
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
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
    
    setMessage('File berhasil didownload!');
    setTimeout(() => setMessage(''), 2000);
  };

  const handleCopyEmail = async (emailToCopy: string) => {
    try {
      await navigator.clipboard.writeText(emailToCopy);
      setCopiedEmail(emailToCopy);
      setMessage(`Email berhasil di-copy!`);
      
      // Reset copied state after animation
      setTimeout(() => setCopiedEmail(null), 1000);
      setTimeout(() => setMessage(''), 2000);
    } catch (error) {
      console.error('Failed to copy email:', error);
      setMessage('Gagal copy email');
      setTimeout(() => setMessage(''), 2000);
    }
  };

  const handleImportFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.txt')) {
      setMessage('Hanya file .txt yang diperbolehkan');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    try {
      setLoading(true);
      const text = await file.text();
      const emailLines = text.split('\n')
        .map(line => line.trim().toLowerCase())
        .filter(line => line && validateEmail(line));

      if (emailLines.length === 0) {
        setMessage('Tidak ada email valid ditemukan dalam file');
        setTimeout(() => setMessage(''), 3000);
        return;
      }

      let successCount = 0;
      let duplicateCount = 0;
      let errorCount = 0;

      for (const emailToImport of emailLines) {
        try {
          const response = await fetch('/api/emails', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: emailToImport }),
          });
          
          const result = await response.json();
          
          if (result.success) {
            successCount++;
          } else if (result.error?.includes('already exists')) {
            duplicateCount++;
          } else {
            errorCount++;
          }
        } catch (error) {
          errorCount++;
        }
      }

      await fetchEmails(); // Refresh the list
      
      let importMessage = `Import selesai: ${successCount} berhasil`;
      if (duplicateCount > 0) importMessage += `, ${duplicateCount} duplikat`;
      if (errorCount > 0) importMessage += `, ${errorCount} error`;
      
      setMessage(importMessage);
      setTimeout(() => setMessage(''), 5000);

    } catch (error) {
      console.error('Error importing file:', error);
      setMessage('Error membaca file');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setLoading(false);
      // Reset file input
      event.target.value = '';
    }
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 animate-fade-in">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg animate-bounce-slow">
              <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="mt-6 text-center text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              KAI
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Masukkan PIN untuk mengakses aplikasi
            </p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
            <form className="space-y-6" onSubmit={handlePinSubmit}>
              <div>
                <label htmlFor="pin" className="sr-only">PIN</label>
                <input
                  id="pin"
                  name="pin"
                  type="password"
                  required
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg tracking-widest font-mono transition-all duration-200 hover:shadow-md"
                  placeholder="••••••"
                  maxLength={6}
                />
              </div>

              {pinError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl animate-shake">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {pinError}
                  </div>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
                >
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <svg className="h-5 w-5 text-blue-300 group-hover:text-blue-200 transition-colors" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  Masuk
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Main Application (after authentication)
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              KAI
            </h1>
            <button
              onClick={handleLogout}
              className="group relative px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white font-medium rounded-xl shadow-lg hover:from-red-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 hover:shadow-xl"
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </span>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-600 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200 -z-10"></div>
            </button>
          </div>
          {!dbInitialized && (
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-xl animate-pulse">
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Menginisialisasi database...
              </div>
            </div>
          )}
        </div>

        {/* Add Email Form */}
        <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-6 mb-8 border border-white/20 animate-slide-up">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading || !dbInitialized}
                className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 transition-all duration-200 hover:shadow-md"
                placeholder="masukkan@email.com"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading || !dbInitialized}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:hover:scale-100"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Memproses...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Tambah Email
                </>
              )}
            </button>
          </form>

          {/* Success Animation */}
          {showSuccess && (
            <div className="mt-4 flex items-center justify-center animate-bounce">
              <div className="bg-green-100 rounded-full p-2">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          )}

          {/* Message */}
          {message && (
            <div className={`mt-4 p-4 rounded-xl animate-slide-down ${
              message.includes('berhasil') 
                ? 'bg-green-50 border border-green-200 text-green-800' 
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              <div className="flex items-center">
                {message.includes('berhasil') ? (
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                )}
                {message}
              </div>
            </div>
          )}
        </div>

        {/* Import Section - Always visible */}
        <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-6 border border-white/20 animate-slide-up mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Import & Export
            </h2>
            <div className="flex gap-2 flex-wrap">
              <label className="px-4 py-2 text-sm bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 cursor-pointer flex items-center gap-2 transition-all duration-200 transform hover:scale-105 shadow-md">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Import File
                <input
                  type="file"
                  accept=".txt"
                  onChange={handleImportFile}
                  disabled={loading}
                  className="hidden"
                />
              </label>
              {allEmails.length > 0 && (
                <button
                  onClick={handleExport}
                  disabled={loading}
                  className="px-4 py-2 text-sm bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 disabled:bg-gray-400 flex items-center gap-2 transition-all duration-200 transform hover:scale-105 shadow-md"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export ({allEmails.length})
                </button>
              )}
            </div>
          </div>

          {/* Import Info */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm text-blue-800 font-medium">Import File</p>
                <p className="text-sm text-blue-700">Upload file .txt dengan satu email per baris. Email duplikat akan dilewati secara otomatis.</p>
                <p className="text-xs text-blue-600 mt-1">Format: satu email per baris, contoh: user@example.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {allEmails.length === 0 && dbInitialized && (
          <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-8 border border-white/20 animate-slide-up text-center">
            <svg className="mx-auto h-16 w-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada email tersimpan</h3>
            <p className="text-gray-600 mb-4">Mulai dengan menambahkan email secara manual atau import dari file .txt</p>
            <div className="flex justify-center gap-4">
              <div className="text-sm text-gray-500">
                <span className="font-medium">Tips:</span> Gunakan tombol "Import File" di atas untuk menambahkan banyak email sekaligus
              </div>
            </div>
          </div>
        )}

        {/* Email List */}
        {allEmails.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-6 border border-white/20 animate-slide-up">
            {/* Header with Actions */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Daftar Email 
                <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  {searchQuery ? `${emails.length} dari ${allEmails.length}` : emails.length}
                </span>
              </h2>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={handleClearAll}
                  disabled={loading}
                  className="px-4 py-2 text-sm bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 disabled:bg-gray-400 flex items-center gap-2 transition-all duration-200 transform hover:scale-105 shadow-md"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Hapus Semua
                </button>
              </div>
            </div>

            {/* Search Box */}
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari email..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  disabled={loading}
                  className="w-full px-4 py-3 pl-12 pr-12 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 transition-all duration-200"
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-gray-100 rounded-r-xl transition-colors"
                  >
                    <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              {searchQuery && (
                <p className="mt-2 text-sm text-gray-600 animate-fade-in">
                  Menampilkan {emails.length} hasil untuk &quot;{searchQuery}&quot;
                  {emails.length === 0 && (
                    <span className="text-red-600"> - Tidak ada email yang ditemukan</span>
                  )}
                </p>
              )}
            </div>

            {/* Email List */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {emails.length > 0 ? (
                emails.map((emailItem, index) => (
                  <div 
                    key={emailItem.id} 
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200 animate-slide-up border border-gray-200 hover:shadow-md"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex flex-col flex-1">
                      <span className="text-sm font-medium text-gray-900">{emailItem.email}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(emailItem.created_at).toLocaleDateString('id-ID', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopyEmail(emailItem.email)}
                        disabled={loading}
                        className={`text-blue-600 hover:text-blue-800 text-sm font-medium disabled:text-gray-400 flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-blue-50 transition-all duration-200 ${
                          copiedEmail === emailItem.email ? 'animate-pulse bg-blue-100' : ''
                        }`}
                        title="Copy email"
                      >
                        {copiedEmail === emailItem.email ? (
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        )}
                        {copiedEmail === emailItem.email ? 'Copied!' : 'Copy'}
                      </button>
                      <button
                        onClick={() => handleDelete(emailItem.id)}
                        disabled={loading}
                        className="text-red-600 hover:text-red-800 text-sm font-medium disabled:text-gray-400 flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-red-50 transition-all duration-200"
                        title="Hapus email"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Hapus
                      </button>
                    </div>
                  </div>
                ))
              ) : searchQuery ? (
                <div className="text-center py-12 text-gray-500 animate-fade-in">
                  <svg className="mx-auto h-16 w-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <p className="text-lg font-medium">Tidak ada email yang cocok</p>
                  <p className="text-sm">dengan pencarian &quot;{searchQuery}&quot;</p>
                  <button
                    onClick={clearSearch}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Hapus pencarian
                  </button>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500 animate-fade-in">
                  <svg className="mx-auto h-16 w-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <p className="text-lg font-medium">Belum ada email tersimpan</p>
                  <p className="text-sm">Tambahkan email pertama Anda di atas</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-white rounded-2xl p-6 flex items-center space-x-4 shadow-2xl">
              <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-gray-700 font-medium">Memproses...</span>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slide-up {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes slide-down {
          from { 
            opacity: 0; 
            transform: translateY(-10px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes bounce-slow {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }
        
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 2s infinite;
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}