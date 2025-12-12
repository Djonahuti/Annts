'use client';

import { useEffect, useState } from 'react';
import { callPHPBackend } from '@/lib/php-api';

export default function FaviconLoader() {
  const [faviconUrl, setFaviconUrl] = useState<string | undefined>(undefined);
  const [faviconType, setFaviconType] = useState<string | undefined>(undefined);

  useEffect(() => {
    const loadFavicon = async () => {
      try {
        const response = await callPHPBackend('/api/settings', { method: 'GET' });
        const settings = await response.json();

        if (settings?.logo_blk) {
          // Construct URL based on Multer's storage path (public/uploads)
          const url = `/uploads/${settings.logo_blk.split('/').pop()}`;
          setFaviconUrl(url);

          // Detect file extension and set MIME type
          if (settings.logo_blk.endsWith('.svg')) {
            setFaviconType('image/svg+xml');
          } else if (settings.logo_blk.endsWith('.jpg') || settings.logo_blk.endsWith('.jpeg')) {
            setFaviconType('image/jpeg');
          } else if (settings.logo_blk.endsWith('.png')) {
            setFaviconType('image/png');
          } else if (settings.logo_blk.endsWith('.ico')) {
            setFaviconType('image/x-icon');
          }
        }
      } catch (error) {
        console.error('Error fetching settings for favicon:', error);
      }
    };

    loadFavicon();
  }, []);

  if (!faviconUrl) return null;

  return (
    <link
      key="favicon"
      rel="icon"
      href={faviconUrl}
      {...(faviconType ? { type: faviconType } : {})}
    />
  );
}

