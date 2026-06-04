'use client';

import React, { useState, useEffect } from 'react';
import { listPendingVerifications, updateVerificationStatus } from '../../lib/supabase/verification_admin';

export const VerificationAdminDashboard = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setIsLoading(true);
    try {
      const data = await listPendingVerifications();
      setRequests(data || []);
    } catch (error) {
      console.error('Failed to load verification requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (requestId: string, status: 'approved' | 'rejected') => {
    setProcessingId(requestId);
    const notes = status === 'rejected' ? prompt('Reason for rejection:') || 'Documentation incomplete' : undefined;
    
    try {
      await updateVerificationStatus(requestId, status, notes);
      setRequests(requests.filter(r => r.id !== requestId));
    } catch (error) {
      alert('Action failed: ' + (error as Error).message);
    } finally {
      setProcessingId(null);
    }
  };

  if (isLoading) return <div className="text-white p-8">Loading verification requests...</div>;

  return (
    <div className="bg-gray-900 p-8 rounded-2xl border border-pink-500/20 text-white">
      <h2 className="text-3xl font-bold mb-8">Verification Workbench</h2>
      
      {requests.length === 0 ? (
        <p className="text-gray-500">No pending verification requests.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400 text-sm">
                <th className="pb-4 font-medium">Business Name</th>
                <th className="pb-4 font-medium">Target Tier</th>
                <th className="pb-4 font-medium">Documents</th>
                <th className="pb-4 font-medium">Extra Info</th>
                <th className="pb-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {requests.map((req) => (
                <tr key={req.id} className="group">
                  <td className="py-6">
                    <div className="font-bold">{req.seeker?.business_name || 'Individual Seeker'}</div>
                    <div className="text-xs text-gray-500">{req.seeker_id}</div>
                  </td>
                  <td className="py-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      req.tier === 'corporate' ? 'bg-purple-900/50 text-purple-400' : 'bg-blue-900/50 text-blue-400'
                    }`}>
                      {req.tier.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-6">
                    <div className="flex gap-2">
                      {req.document_urls?.map((url: string, i: number) => (
                        <a 
                          key={i} 
                          href={url} 
                          target="_blank" 
                          rel="noreferrer"
                          className="w-10 h-10 bg-gray-800 rounded flex items-center justify-center hover:bg-pink-600 transition"
                        >
                          📄
                        </a>
                      ))}
                    </div>
                  </td>
                  <td className="py-6">
                    {req.business_email && <div className="text-sm">{req.business_email}</div>}
                    {req.linkedin_profile && (
                      <a href={req.linkedin_profile} target="_blank" rel="noreferrer" className="text-xs text-pink-500 hover:underline">
                        LinkedIn Profile
                      </a>
                    )}
                  </td>
                  <td className="py-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleAction(req.id, 'rejected')}
                        disabled={!!processingId}
                        className="px-4 py-2 bg-gray-800 hover:bg-red-900/50 text-red-500 rounded-lg text-sm font-bold transition"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleAction(req.id, 'approved')}
                        disabled={!!processingId}
                        className="px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-lg text-sm font-bold shadow-lg transition"
                      >
                        {processingId === req.id ? 'Processing...' : 'Approve'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
