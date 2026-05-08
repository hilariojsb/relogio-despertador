'use client';

import { useEffect, useState } from 'react';
import { rotationBucketForInterval } from '@/components/blog-landing/featured-rotation';

/**
 * Bucket alinhado ao HTML inicial (prop do servidor/build), depois sincronizado com o relógio
 * do cliente e reagendado a cada `intervalMs` — sem depender de backend.
 */
export function useRotationTimeBucket(initialBucket: number, intervalMs: number): number {
  const [bucket, setBucket] = useState(initialBucket);

  useEffect(() => {
    setBucket((prev) => {
      const next = rotationBucketForInterval(Date.now(), intervalMs);
      return prev !== next ? next : prev;
    });

    let timeoutId: ReturnType<typeof setTimeout>;

    const scheduleNext = () => {
      clearTimeout(timeoutId);
      const msRaw = intervalMs - (Date.now() % intervalMs);
      const ms = msRaw <= 0 ? intervalMs : msRaw;
      timeoutId = setTimeout(() => {
        setBucket(rotationBucketForInterval(Date.now(), intervalMs));
        scheduleNext();
      }, ms);
    };

    scheduleNext();
    return () => clearTimeout(timeoutId);
  }, [intervalMs]);

  return bucket;
}
