import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { isRTLLanguage } from '@/utils/rtl';

/**
 * Custom hook to manage RTL (Right-to-Left) layout based on current language
 * Automatically sets the document direction when language changes
 * 
 * @returns {Object} - Object containing current direction and language info
 */
export function useRTL() {
    const { i18n } = useTranslation();
    const currentLanguage = i18n.language || 'en';
    const isRTL = isRTLLanguage(currentLanguage);
    const direction = isRTL ? 'rtl' : 'ltr';

    useEffect(() => {
        // Set the direction attribute on the document root element
        document.documentElement.dir = direction;

        // Optional: Set a data attribute for CSS styling purposes
        document.documentElement.setAttribute('data-direction', direction);

        // Cleanup function (though direction should persist)
        return () => {
            // No cleanup needed - direction should remain set
        };
    }, [direction]);

    return {
        direction,
        isRTL,
        language: currentLanguage,
    };
}
