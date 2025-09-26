// /backend/src/services/youtubeService.js
import { YoutubeTranscript } from 'youtube-transcript';

/**
 * Fetches the full transcript for a given YouTube video ID
 * @param {string} videoId - The YouTube video ID
 * @returns {Promise<string|null>} - The combined transcript text or null if unavailable
 */
export async function getYouTubeTranscript(videoId) {
  try {
    const transcriptParts = await YoutubeTranscript.fetchTranscript(videoId);
    if (!transcriptParts || transcriptParts.length === 0) {
      return null; // No transcript available
    }
    // Combine all parts of the transcript into a single string
    return transcriptParts.map(part => part.text).join(' ');
  } catch (error) {
    console.error(`Could not fetch transcript for video ${videoId}:`, error.message);
    return null; // Video may have transcripts disabled
  }
}