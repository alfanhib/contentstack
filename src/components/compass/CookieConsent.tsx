'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import type { ConsentModal } from '@/lib/contentstack';

interface CookieConsentProps {
  consentModal?: ConsentModal;
}

const CONSENT_KEY = 'cookie-consent';

// Check consent on initial render (client-side only)
function getInitialShowBanner(): boolean {
  if (typeof window === 'undefined') return false;
  const consent = localStorage.getItem(CONSENT_KEY);
  return !consent;
}

export function CookieConsent({ consentModal }: CookieConsentProps) {
  const [showBanner, setShowBanner] = useState(getInitialShowBanner);

  const handleConsent = useCallback((action: 'optIn' | 'optOut') => {
    localStorage.setItem(CONSENT_KEY, action);
    setShowBanner(false);
    
    // You can add analytics tracking here based on the action
    if (action === 'optIn') {
      console.log('[Cookie Consent] User accepted cookies');
    } else {
      console.log('[Cookie Consent] User rejected cookies');
    }
  }, []);

  if (!showBanner || !consentModal) return null;

  const { heading, content, icon, consent_actions } = consentModal;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white shadow-2xl border-t border-slate-200">
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Icon */}
          {icon?.url && (
            <div className="flex-shrink-0">
              <Image
                src={icon.url}
                alt="Cookie"
                width={48}
                height={48}
                className="w-12 h-12"
              />
            </div>
          )}

          {/* Content */}
          <div className="flex-1">
            {heading && (
              <h3 className="font-semibold text-slate-900 mb-1">{heading}</h3>
            )}
            {content && (
              <p className="text-sm text-slate-600">{content}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 w-full sm:w-auto">
            {consent_actions?.map((action) => {
              const isAccept = action.action === 'optIn';
              
              return (
                <button
                  key={action._metadata?.uid || action.label}
                  onClick={() => handleConsent(action.action)}
                  className={`flex-1 sm:flex-none px-4 py-2 text-sm font-medium rounded-lg transition ${
                    isAccept
                      ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {action.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
