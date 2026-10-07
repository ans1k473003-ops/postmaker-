/**
 * Utility to extract representative keyframes from a video in the browser.
 * This sends real visual frames to Gemini for true content understanding.
 */

export interface ExtractedFrame {
  timestamp: number;
  base64Data: string;
  mimeType: string;
  previewUrl: string;
}

export async function extractVideoKeyframes(
  videoFile: File,
  frameCount: number = 4
): Promise<ExtractedFrame[]> {
  return new Promise((resolve) => {
    const videoUrl = URL.createObjectURL(videoFile);
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;
    video.src = videoUrl;

    const frames: ExtractedFrame[] = [];
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const cleanUp = () => {
      URL.revokeObjectURL(videoUrl);
      video.remove();
      canvas.remove();
    };

    video.onloadedmetadata = async () => {
      const duration = video.duration || 1;
      // Calculate timestamps (e.g. 15%, 40%, 65%, 85%)
      const timestamps: number[] = [];
      const step = duration / (frameCount + 1);
      for (let i = 1; i <= frameCount; i++) {
        timestamps.push(Math.min(duration - 0.1, Math.max(0.1, step * i)));
      }

      // Max dimension for AI analysis
      const maxDim = 800;
      let width = video.videoWidth || 640;
      let height = video.videoHeight || 360;

      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      canvas.width = width;
      canvas.height = height;

      try {
        for (const time of timestamps) {
          await seekVideo(video, time);
          if (ctx) {
            ctx.drawImage(video, 0, 0, width, height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
            const base64Data = dataUrl.split(',')[1];
            frames.push({
              timestamp: Math.round(time * 10) / 10,
              base64Data,
              mimeType: 'image/jpeg',
              previewUrl: dataUrl,
            });
          }
        }
      } catch (err) {
        console.warn('Could not extract all video frames:', err);
      } finally {
        cleanUp();
        resolve(frames);
      }
    };

    video.onerror = () => {
      console.warn('Video failed to load for frame extraction');
      cleanUp();
      resolve([]);
    };
  });
}

function seekVideo(video: HTMLVideoElement, time: number): Promise<void> {
  return new Promise((resolve) => {
    const onSeeked = () => {
      video.removeEventListener('seeked', onSeeked);
      resolve();
    };
    video.addEventListener('seeked', onSeeked);
    video.currentTime = time;
  });
}

export function fileToBase64(file: File): Promise<{ base64Data: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const [header, data] = result.split(',');
      const mimeType = header.match(/:(.*?);/)?.[1] || file.type || 'image/jpeg';
      resolve({ base64Data: data, mimeType });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
