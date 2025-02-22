import { useState, useEffect } from 'react';
import System from '@/models/system';
import showToast from '@/utils/toast';

export default function LiveSyncToggle() {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkStatus() {
      try {
        const response = await System.experimentalFeatures.liveSync.status();
        setEnabled(response.enabled);
      } catch (error) {
        console.error('Failed to check live sync status:', error);
      } finally {
        setLoading(false);
      }
    }
    checkStatus();
  }, []);

  const handleToggle = async (e) => {
    if (loading) return;
    
    try {
      setLoading(true);
      const newStatus = e.target.checked;
      const response = await System.experimentalFeatures.liveSync.toggle(newStatus);
      
      if (response.success) {
        setEnabled(newStatus);
        showToast(
          `Live document sync ${newStatus ? 'enabled' : 'disabled'}`,
          'success'
        );
      } else {
        throw new Error(response.error || 'Failed to update status');
      }
    } catch (error) {
      showToast(`Failed to update status: ${error.message}`, 'error');
      // Revert the checkbox state on error
      setEnabled(!e.target.checked);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between py-4">
      <div>
        <label className="text-white text-sm font-medium">Live Document Sync</label>
        <p className="text-white/60 text-xs">
          Enable automatic syncing of watched documents
        </p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={enabled}
          onChange={handleToggle}
          disabled={loading}
          aria-label="Toggle live document sync"
        />
        <div 
          className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        ></div>
      </label>
    </div>
  );
} 