import { useState } from 'react';
import { useFetch } from './useFetch';
import { useAuth } from './useAuth';

export function useProofs() {
  const { user } = useAuth();
  const { data: serverProofs, loading, error } = useFetch('http://localhost:5000/api/proofs');
  const [localProofs, setLocalProofs] = useState(null);

  const proofs = localProofs ?? (serverProofs || []);

  const myIncomingRequests = proofs.filter(
    (p) => user && p.toUserId === user.id && p.status === 'pending'
  );

  const requestProof = (toUserId, habitTitle = 'Daily Habits') => {
    if (!user) return;
    const body = {
      fromUserId: user.id,
      fromUserName: user.nickname || user.name || 'Friend',
      toUserId,
      habitTitle,
    };

    fetch('http://localhost:5000/api/proofs/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((created) => {
        setLocalProofs((prev) => [...(prev ?? (serverProofs || [])), created]);
      })
      .catch(() => {});
  };

  const respondProof = (requestId, proofText) => {
    fetch('http://localhost:5000/api/proofs/respond', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestId, proofText, status: 'approved' }),
    })
      .then((res) => res.json())
      .then((updated) => {
        setLocalProofs((prev) =>
          (prev ?? (serverProofs || [])).map((p) => (p.id === updated.id ? updated : p))
        );
      })
      .catch(() => {});
  };

  return {
    proofs,
    myIncomingRequests,
    loading,
    error,
    requestProof,
    respondProof,
  };
}
