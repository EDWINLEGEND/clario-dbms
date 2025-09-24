import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-client';

interface OfflineAction {
  id: string;
  type: 'create' | 'update' | 'delete';
  entity: 'project' | 'video' | 'user';
  data: any;
  timestamp: number;
  retryCount: number;
}

interface OfflineState {
  isOnline: boolean;
  pendingActions: OfflineAction[];
  lastSyncTime: number | null;
}

const OFFLINE_STORAGE_KEY = 'clario_offline_data';
const MAX_RETRY_COUNT = 3;

export function useOfflineSync() {
  const queryClient = useQueryClient();
  const [offlineState, setOfflineState] = useState<OfflineState>({
    isOnline: navigator.onLine,
    pendingActions: [],
    lastSyncTime: null,
  });

  // Load offline data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(OFFLINE_STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setOfflineState(prev => ({
          ...prev,
          pendingActions: parsed.pendingActions || [],
          lastSyncTime: parsed.lastSyncTime || null,
        }));
      } catch (error) {
        console.error('Failed to load offline data:', error);
      }
    }
  }, []);

  // Save offline data to localStorage whenever it changes
  useEffect(() => {
    const dataToSave = {
      pendingActions: offlineState.pendingActions,
      lastSyncTime: offlineState.lastSyncTime,
    };
    localStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify(dataToSave));
  }, [offlineState.pendingActions, offlineState.lastSyncTime]);

  // Listen for online/offline events
  useEffect(() => {
    const handleOnline = () => {
      setOfflineState(prev => ({ ...prev, isOnline: true }));
      syncPendingActions();
    };

    const handleOffline = () => {
      setOfflineState(prev => ({ ...prev, isOnline: false }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Queue an action for offline execution
  const queueOfflineAction = (action: Omit<OfflineAction, 'id' | 'timestamp' | 'retryCount'>) => {
    const newAction: OfflineAction = {
      ...action,
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      retryCount: 0,
    };

    setOfflineState(prev => ({
      ...prev,
      pendingActions: [...prev.pendingActions, newAction],
    }));

    // If online, try to sync immediately
    if (offlineState.isOnline) {
      syncPendingActions();
    }
  };

  // Sync pending actions when back online
  const syncPendingActions = async () => {
    if (!offlineState.isOnline || offlineState.pendingActions.length === 0) {
      return;
    }

    const actionsToSync = [...offlineState.pendingActions];
    const successfulActions: string[] = [];
    const failedActions: OfflineAction[] = [];

    for (const action of actionsToSync) {
      try {
        await executeOfflineAction(action);
        successfulActions.push(action.id);
      } catch (error) {
        console.error('Failed to sync offline action:', error);
        
        if (action.retryCount < MAX_RETRY_COUNT) {
          failedActions.push({
            ...action,
            retryCount: action.retryCount + 1,
          });
        } else {
          console.error('Max retry count reached for action:', action);
        }
      }
    }

    // Update pending actions (remove successful, update failed)
    setOfflineState(prev => ({
      ...prev,
      pendingActions: failedActions,
      lastSyncTime: Date.now(),
    }));

    // Invalidate relevant queries after successful sync
    if (successfulActions.length > 0) {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.videos.all() });
    }
  };

  // Execute a single offline action
  const executeOfflineAction = async (action: OfflineAction) => {
    // This would integrate with your actual API client
    // For now, we'll simulate the API calls
    
    switch (action.entity) {
      case 'project':
        if (action.type === 'create') {
          // await apiClient.createProject(action.data);
          console.log('Syncing create project:', action.data);
        } else if (action.type === 'update') {
          // await apiClient.updateProject(action.data.id, action.data);
          console.log('Syncing update project:', action.data);
        } else if (action.type === 'delete') {
          // await apiClient.deleteProject(action.data.id);
          console.log('Syncing delete project:', action.data.id);
        }
        break;
        
      case 'video':
        // Similar implementation for video actions
        console.log('Syncing video action:', action);
        break;
        
      case 'user':
        // Similar implementation for user actions
        console.log('Syncing user action:', action);
        break;
        
      default:
        throw new Error(`Unknown entity type: ${action.entity}`);
    }
  };

  // Get offline-capable data with fallback to cache
  const getOfflineData = <T>(queryKey: readonly unknown[]): T | null => {
    const cachedData = queryClient.getQueryData<T>(queryKey);
    
    if (cachedData) {
      return cachedData;
    }

    // Try to get from offline storage
    const offlineKey = `offline_${queryKey.join('_')}`;
    const offlineData = localStorage.getItem(offlineKey);
    
    if (offlineData) {
      try {
        return JSON.parse(offlineData);
      } catch (error) {
        console.error('Failed to parse offline data:', error);
      }
    }

    return null;
  };

  // Store data for offline access
  const storeOfflineData = <T>(queryKey: readonly unknown[], data: T) => {
    const offlineKey = `offline_${queryKey.join('_')}`;
    localStorage.setItem(offlineKey, JSON.stringify(data));
  };

  // Clear offline data
  const clearOfflineData = () => {
    setOfflineState(prev => ({
      ...prev,
      pendingActions: [],
      lastSyncTime: null,
    }));
    
    // Clear offline data from localStorage
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('offline_') || key === OFFLINE_STORAGE_KEY) {
        localStorage.removeItem(key);
      }
    });
  };

  // Get sync status
  const getSyncStatus = () => ({
    isOnline: offlineState.isOnline,
    hasPendingActions: offlineState.pendingActions.length > 0,
    pendingCount: offlineState.pendingActions.length,
    lastSyncTime: offlineState.lastSyncTime,
    canSync: offlineState.isOnline && offlineState.pendingActions.length > 0,
  });

  return {
    // State
    isOnline: offlineState.isOnline,
    pendingActions: offlineState.pendingActions,
    lastSyncTime: offlineState.lastSyncTime,
    
    // Actions
    queueOfflineAction,
    syncPendingActions,
    getOfflineData,
    storeOfflineData,
    clearOfflineData,
    getSyncStatus,
    
    // Utilities
    isOfflineCapable: true,
  };
}

// Hook for offline-first mutations
export function useOfflineMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: {
    entity: 'project' | 'video' | 'user';
    type: 'create' | 'update' | 'delete';
    onSuccess?: (data: TData, variables: TVariables) => void;
    onError?: (error: Error, variables: TVariables) => void;
  }
) {
  const { isOnline, queueOfflineAction } = useOfflineSync();
  const [isLoading, setIsLoading] = useState(false);

  const mutate = async (variables: TVariables) => {
    setIsLoading(true);
    
    try {
      if (isOnline) {
        // Execute immediately if online
        const result = await mutationFn(variables);
        options?.onSuccess?.(result, variables);
        return result;
      } else {
        // Queue for later if offline
        queueOfflineAction({
          type: options?.type || 'update',
          entity: options?.entity || 'project',
          data: variables,
        });
        
        // Simulate success for optimistic updates
        options?.onSuccess?.(variables as unknown as TData, variables);
        return variables as unknown as TData;
      }
    } catch (error) {
      options?.onError?.(error as Error, variables);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    mutate,
    isLoading,
    isOnline,
  };
}