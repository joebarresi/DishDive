import { useEffect, useRef } from 'react';
import { Video } from 'expo-av';
import { recordPostView } from '../services/views';
import { FIREBASE_AUTH } from '../../firebaseConfig';

interface UseRecordViewsProps {
  videoRef: React.RefObject<Video>;
  postId: string;
  isPlaying: boolean;
}

export const useRecordViews = ({ videoRef, postId, isPlaying }: UseRecordViewsProps) => {
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastRecordedCycleRef = useRef<number>(-1);
  const currentCycleStartRef = useRef<number>(0);

  useEffect(() => {
    if (isPlaying && FIREBASE_AUTH.currentUser && videoRef.current) {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }

      const checkVideoPosition = async () => {
        if (!videoRef.current || !isPlaying || !FIREBASE_AUTH.currentUser) {
          return;
        }

        try {
          const status = await videoRef.current.getStatusAsync();
          
          if (status && 'positionMillis' in status && status.positionMillis !== undefined) {
            const currentPosition = status.positionMillis;
            
            if (currentPosition < currentCycleStartRef.current - 1000) {
              currentCycleStartRef.current = currentPosition;
              lastRecordedCycleRef.current = -1;
            }
            
            const elapsedFromCycleStart = currentPosition - currentCycleStartRef.current;
            
            if (elapsedFromCycleStart >= 3000 && lastRecordedCycleRef.current !== currentCycleStartRef.current) {
              try {
                await recordPostView(postId, FIREBASE_AUTH.currentUser.uid);
                lastRecordedCycleRef.current = currentCycleStartRef.current;
              } catch (error) {
                console.error('Failed to record view:', error);
              }
            }
          }
        } catch (error) {
          console.error('Failed to get video status:', error);
        }
      };

      checkIntervalRef.current = setInterval(checkVideoPosition, 500);
    } else {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
        checkIntervalRef.current = null;
      }
      
      if (!isPlaying) {
        currentCycleStartRef.current = 0;
        lastRecordedCycleRef.current = -1;
      }
    }

    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
        checkIntervalRef.current = null;
      }
    };
  }, [isPlaying, postId, videoRef]);

  useEffect(() => {
    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, []);
};
