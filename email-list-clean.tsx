            {/* Email List */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {emails.length > 0 ? (
                emails.map((emailItem, index) => (
                  <div
                    key={emailItem.id}
                    className="p-5 bg-white rounded-xl hover:bg-gray-50 transition-all duration-200 animate-slide-up border border-gray-200 hover:shadow-lg"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {editingEmail === emailItem.id ? (
                      // Edit Mode
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                              type="email"
                              value={editForm.email}
                              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Email address"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input
                              type="text"
                              value={editForm.password}
                              onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Password (optional)"
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => saveEdit(emailItem.id)}
                            disabled={loading}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 flex items-center gap-2 transition-all duration-200"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Simpan
                          </button>
                          <button
                            onClick={cancelEdit}
                            disabled={loading}
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-400 flex items-center gap-2 transition-all duration-200"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Batal
                          </button>
                        </div>
                      </div>
                    ) : (
                      // View Mode - Clean and Information-Focused
                      <div>
                        {/* Main Content */}
                        <div className="space-y-3 mb-4">
                          {/* Email */}
                          <div>
                            <div className="text-lg font-semibold text-gray-900 break-all">
                              {emailItem.email}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {new Date(emailItem.created_at).toLocaleDateString('id-ID', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </div>
                          
                          {/* Password */}
                          {emailItem.password && (
                            <div className="flex items-center gap-3">
                              <span className="text-sm text-gray-600 font-medium">Password:</span>
                              <div className="flex items-center gap-2">
                                <span className="text-base font-mono text-purple-700 bg-purple-50 px-3 py-1.5 rounded-md">
                                  {showPassword[emailItem.id] ? emailItem.password : '••••••••'}
                                </span>
                                <button
                                  onClick={() => togglePasswordVisibility(emailItem.id)}
                                  className="p-1.5 rounded-md hover:bg-purple-50 transition-colors"
                                  title={showPassword[emailItem.id] ? "Sembunyikan password" : "Lihat password"}
                                >
                                  {showPassword[emailItem.id] ? (
                                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464M9.878 9.878a3 3 0 00-.007 4.243m4.242-4.242L15.536 15.536M14.122 14.122a3 3 0 01-4.243-.007m4.243.007l1.414 1.414M14.122 14.122l-4.243-4.243" />
                                    </svg>
                                  ) : (
                                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                  )}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Action Buttons - Subtle and Clean */}
                        <div className="flex items-center justify-end gap-1 pt-3 border-t border-gray-200">
                          <button
                            onClick={() => handleCopyEmail(emailItem.email, emailItem.id)}
                            disabled={loading}
                            className={`text-xs text-gray-500 hover:text-blue-600 disabled:text-gray-300 flex items-center gap-1 px-2 py-1 rounded hover:bg-blue-50 transition-all duration-200 ${copiedEmail === emailItem.id ? 'bg-blue-100 text-blue-600' : ''}`}
                            title="Copy email"
                          >
                            {copiedEmail === emailItem.id ? (
                              <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            )}
                            Email
                          </button>
                          {emailItem.password && (
                            <button
                              onClick={() => handleCopyPassword(emailItem.password!, emailItem.id)}
                              disabled={loading}
                              className={`text-xs text-gray-500 hover:text-purple-600 disabled:text-gray-300 flex items-center gap-1 px-2 py-1 rounded hover:bg-purple-50 transition-all duration-200 ${copiedPassword === emailItem.id ? 'bg-purple-100 text-purple-600' : ''}`}
                              title="Copy password"
                            >
                              {copiedPassword === emailItem.id ? (
                                <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              ) : (
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1721 9z" />
                                </svg>
                              )}
                              Pass
                            </button>
                          )}
                          <button
                            onClick={() => startEdit(emailItem)}
                            disabled={loading}
                            className="text-xs text-gray-500 hover:text-orange-600 disabled:text-gray-300 flex items-center gap-1 px-2 py-1 rounded hover:bg-orange-50 transition-all duration-200"
                            title="Edit email"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(emailItem.id)}
                            disabled={loading}
                            className="text-xs text-gray-500 hover:text-red-600 disabled:text-gray-300 flex items-center gap-1 px-2 py-1 rounded hover:bg-red-50 transition-all duration-200"
                            title="Hapus email"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Hapus
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : searchQuery ? (
                <div className="text-center py-12 text-gray-500 animate-fade-in">
                  <svg className="mx-auto h-16 w-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <p className="text-lg font-medium">Tidak ada data yang cocok</p>
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