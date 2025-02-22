import { useState, useEffect } from 'react';
import { Trash, ArrowClockwise } from '@phosphor-icons/react';
import System from '@/models/system';
import showToast from '@/utils/toast';
import { formatDate } from '@/utils/directories';

export default function WatchedDocuments() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState({});

  useEffect(() => {
    fetchWatchedDocuments();
  }, []);

  const fetchWatchedDocuments = async () => {
    try {
      const response = await System.experimentalFeatures.liveSync.watchedDocuments();
      if (response.success) {
        setDocuments(response.documents);
      }
    } catch (error) {
      console.error('Failed to fetch watched documents:', error);
    }
  };

  const handleSyncNow = async (docId) => {
    try {
      setSyncing(prev => ({ ...prev, [docId]: true }));
      const response = await System.experimentalFeatures.liveSync.syncDocument(docId);
      if (response.success) {
        showToast('Document synced successfully', 'success');
        fetchWatchedDocuments(); // Refresh the list
      } else {
        showToast('Failed to sync document', 'error');
      }
    } catch (error) {
      showToast(`Error syncing document: ${error.message}`, 'error');
    } finally {
      setSyncing(prev => ({ ...prev, [docId]: false }));
    }
  };

  const handleRemove = async (docId) => {
    try {
      setLoading(true);
      const response = await System.experimentalFeatures.liveSync.unwatchDocument(docId);
      if (response.success) {
        showToast('Document removed from watch list', 'success');
        fetchWatchedDocuments();
      } else {
        showToast('Failed to remove document', 'error');
      }
    } catch (error) {
      showToast(`Error removing document: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full">
      <div className="flex flex-col w-full">
        <div className="flex flex-col gap-y-1">
          <div className="flex items-center gap-x-4">
            <p className="text-xl font-semibold text-white">Watched documents</p>
          </div>
          <p className="text-sm text-white/60">
            These are all the documents that are currently being watched in your instance.
            The content of these documents will be periodically synced.
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-y-2 pb-8">
          <div className="grid grid-cols-12 px-4 py-2 text-white/80 text-sm font-medium bg-theme-card-bg rounded-lg">
            <div className="col-span-4">DOCUMENT NAME</div>
            <div className="col-span-2">LAST SYNCED</div>
            <div className="col-span-3">TIME UNTIL NEXT REFRESH</div>
            <div className="col-span-2">CREATED ON</div>
            <div className="col-span-1"></div>
          </div>

          {documents.map((doc) => (
            <div key={doc.id} className="grid grid-cols-12 px-4 py-4 text-white/80 text-sm bg-theme-card-bg rounded-lg items-center">
              <div className="col-span-4 font-medium">{doc.name}</div>
              <div className="col-span-2">{doc.lastSynced || 'Never'}</div>
              <div className="col-span-3 flex items-center gap-x-2">
                <span>{formatDate(doc.nextSyncAt)}</span>
                <button
                  onClick={() => handleSyncNow(doc.id)}
                  disabled={syncing[doc.id]}
                  className="p-1 hover:bg-theme-hover rounded transition-all"
                  title="Sync now"
                >
                  <ArrowClockwise
                    size={16}
                    className={`${syncing[doc.id] ? 'animate-spin' : ''}`}
                  />
                </button>
              </div>
              <div className="col-span-2">{formatDate(doc.createdAt)}</div>
              <div className="col-span-1 flex justify-end">
                <button
                  onClick={() => handleRemove(doc.id)}
                  disabled={loading}
                  className="p-1 hover:bg-red-500/20 rounded transition-all"
                  title="Remove from watch list"
                >
                  <Trash size={16} className="text-red-500" />
                </button>
              </div>
            </div>
          ))}

          {documents.length === 0 && (
            <div className="text-white/60 text-sm text-center py-4">
              No documents are currently being watched.
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 