'use client';

import { useState, useEffect } from 'react';
import type {
  Firestore,
  CollectionReference,
  Query,
  DocumentData,
} from 'firebase/firestore';
import { onSnapshot } from 'firebase/firestore';

export function useCollection<T extends DocumentData>(
  query: CollectionReference<T> | Query<T> | null
) {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!query) {
      setData([]);
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      query,
      (snapshot) => {
        const result: T[] = [];
        snapshot.forEach((doc) => {
          result.push({ ...doc.data(), id: doc.id });
        });
        setData(result);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [query]);

  return { data, loading, error };
}
