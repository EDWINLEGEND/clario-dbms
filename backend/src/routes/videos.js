import { Router } from "express";
import { google } from "googleapis";
import { config } from "../config/env.js";
import { prisma } from "../config/prisma.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// Initialize YouTube API client
const youtube = google.youtube({
  version: 'v3',
  auth: config.youtubeApiKey
});

// GET /videos - Search videos with compatibility scoring (Protected Route)
router.get("/", requireAuth, async (req, res) => {
  try {
    const { search_query } = req.query;
    
    // Extract user's learning type ID from authenticated user
    const userLearningTypeId = req.user.lt; // JWT payload uses 'lt' for learningTypeId
    
    // Validate search query
    if (!search_query || search_query.trim() === '') {
      return res.status(400).json({
        error: 'Search query is required',
        query: '',
        items: [],
        metrics: {
          total: 0,
          avgCompatibility: 0
        }
      });
    }

    // Check if YouTube API key is configured
    if (!config.youtubeApiKey) {
      return res.status(500).json({
        error: 'YouTube API key not configured',
        query: search_query,
        items: [],
        metrics: {
          total: 0,
          avgCompatibility: 0
        }
      });
    }

    // Call YouTube Data API
    const response = await youtube.search.list({
      part: 'snippet',
      q: search_query,
      type: 'video',
      maxResults: 12,
      order: 'relevance',
      safeSearch: 'moderate',
      videoEmbeddable: 'true'
    });

    // Format the initial response from YouTube
    const formattedVideos = response.data.items.map(item => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnailUrl: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt
    }));

    // Calculate compatibility scores for each video using Promise.all for parallel queries
    const videosWithScores = await Promise.all(
      formattedVideos.map(async (video) => {
        let compatibilityScore = 0;
        
        // Only calculate score if user has a learning type
        if (userLearningTypeId) {
          try {
            // Query VideoTag table for matching tags
            const matchingTags = await prisma.videoTag.findMany({
              where: {
                videoId: parseInt(video.videoId), // Assuming videoId is stored as integer
                learningTypeId: userLearningTypeId
              }
            });
            
            // Sum the scores of all matching tags
            compatibilityScore = matchingTags.reduce((sum, tag) => sum + tag.score, 0);
          } catch (dbError) {
            console.error(`Error calculating compatibility for video ${video.videoId}:`, dbError);
            // If database query fails, default to 0 score
            compatibilityScore = 0;
          }
        }
        
        return {
          ...video,
          compatibilityScore
        };
      })
    );

    // Sort videos by compatibility score in descending order (highest first)
    const sortedVideos = videosWithScores.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

    // Calculate metrics
    const totalVideos = sortedVideos.length;
    const avgCompatibility = totalVideos > 0 
      ? sortedVideos.reduce((sum, video) => sum + video.compatibilityScore, 0) / totalVideos 
      : 0;

    const metrics = {
      total: totalVideos,
      avgCompatibility: Math.round(avgCompatibility * 100) / 100 // Round to 2 decimal places
    };

    res.json({
      query: search_query,
      items: sortedVideos,
      metrics
    });

  } catch (error) {
    console.error('YouTube API Error:', error);
    
    // Handle specific YouTube API errors
    if (error.code === 403) {
      return res.status(500).json({
        error: 'YouTube API quota exceeded or access denied',
        query: req.query.search_query || '',
        items: [],
        metrics: { total: 0, avgCompatibility: 0 }
      });
    }

    if (error.code === 400) {
      return res.status(400).json({
        error: 'Invalid search parameters',
        query: req.query.search_query || '',
        items: [],
        metrics: { total: 0, avgCompatibility: 0 }
      });
    }

    // Generic server error
    res.status(500).json({
      error: 'Internal server error while searching videos',
      query: req.query.search_query || '',
      items: [],
      metrics: { total: 0, avgCompatibility: 0 }
    });
  }
});

// GET /videos/:id - Get video details with transcript and tags
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate video ID
    if (!id || id.trim() === '') {
      return res.status(400).json({
        error: 'Video ID is required'
      });
    }

    // Check if YouTube API key is configured
    if (!config.youtubeApiKey) {
      return res.status(500).json({
        error: 'YouTube API key not configured'
      });
    }

    // Get video details from YouTube API
    const response = await youtube.videos.list({
      part: 'snippet,statistics,contentDetails',
      id: id
    });

    if (!response.data.items || response.data.items.length === 0) {
      return res.status(404).json({
        error: 'Video not found'
      });
    }

    const video = response.data.items[0];
    
    res.json({
      videoId: id,
      title: video.snippet.title,
      description: video.snippet.description,
      thumbnailUrl: video.snippet.thumbnails.high?.url || video.snippet.thumbnails.default?.url,
      channelTitle: video.snippet.channelTitle,
      publishedAt: video.snippet.publishedAt,
      duration: video.contentDetails.duration,
      viewCount: video.statistics.viewCount,
      likeCount: video.statistics.likeCount,
      transcript: null, // Placeholder - transcript extraction would require additional implementation
      tags: video.snippet.tags || []
    });

  } catch (error) {
    console.error('YouTube API Error:', error);
    
    if (error.code === 403) {
      return res.status(500).json({
        error: 'YouTube API quota exceeded or access denied'
      });
    }

    if (error.code === 400) {
      return res.status(400).json({
        error: 'Invalid video ID'
      });
    }

    res.status(500).json({
      error: 'Internal server error while fetching video details'
    });
  }
});

export default router;