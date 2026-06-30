'use client';

import React, { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    google?: any;
  }
}

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

/**
 * Renders the official Google Sign-In button via Google Identity Services.
 * On success returns the ID token to the parent via onCredential.
 * If NEXT_PUBLIC_GOOGLE_CLIENT_ID is not configured, renders nothing.
 */
export function GoogleButton({ onCredential, onError }: { onCredential: (idToken: string) => void; onError?: (msg: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!CLIENT_ID) return;
    const id = 'google-gsi';
    function init() {
      if (!window.google || !ref.current || initialized.current) return;
      initialized.current = true;
      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: (resp: any) => {
          if (resp?.credential) onCredential(resp.credential);
          else onError?.('Не удалось получить токен Google');
        },
      });
      window.google.accounts.id.renderButton(ref.current, {
        theme: 'filled_black', size: 'large', width: 320, text: 'continue_with', shape: 'pill', locale: 'ru',
      });
      setReady(true);
    }
    if (document.getElementById(id)) { init(); return; }
    const s = document.createElement('script');
    s.src = 'https://accounts.google.com/gsi/client';
    s.async = true; s.defer = true; s.id = id;
    s.onload = init;
    document.body.appendChild(s);
    return () => { initialized.current = false; };
  }, [onCredential, onError]);

  if (!CLIENT_ID) {
    return (
      <p className="text-xs text-text-muted text-center">
        Вход через Google скоро будет доступен
      </p>
    );
  }

  return (
    <div className="flex justify-center">
      <div ref={ref} />
      {!ready && <div className="h-11 w-[320px] rounded-full bg-white/[0.04] animate-pulse" />}
    </div>
  );
}
