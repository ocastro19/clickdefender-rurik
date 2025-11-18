import { useEffect, useState } from 'react';

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const offline = localStorage.getItem('offlineUser');
    setUser(offline ? JSON.parse(offline) : null);
    setLoading(false);
  }, []);

  const signOut = async () => {
    localStorage.removeItem('offlineUser');
    setUser(null);
  };

  return { user, loading, signOut };
}
