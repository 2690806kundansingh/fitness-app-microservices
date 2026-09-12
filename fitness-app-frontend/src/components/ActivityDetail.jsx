import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router';
import { getActivityById, getActivityRecommendation, regenerateActivityRecommendation } from '../services/api';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid2,
  LinearProgress,
  Paper,
  Stack,
  Typography
} from '@mui/material';

const getActivityIcon = (type) => {
  switch (type?.toUpperCase()) {
    case 'RUNNING':
      return '🏃';
    case 'CYCLING':
      return '🚴';
    case 'WALKING':
      return '🚶';
    default:
      return '⚡';
  }
};

const getSectionIcon = (title) => {
  const t = title.toLowerCase();
  if (t.includes('overall')) return '📊';
  if (t.includes('pace') || t.includes('speed') || t.includes('tempo')) return '⏱️';
  if (t.includes('heart') || t.includes('cardio')) return '❤️';
  if (t.includes('calor') || t.includes('energy') || t.includes('burn')) return '🔥';
  return '💡';
};

const parseAnalysisSections = (text) => {
  if (!text) return [];
  const regex = /(Overall|Pace|Heart Rate|Calories):\s*([\s\S]*?)(?=(Overall|Pace|Heart Rate|Calories):|$)/gi;
  const sections = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    sections.push({
      title: match[1].trim(),
      content: match[2].trim()
    });
  }
  return sections;
};

const splitColonItem = (item) => {
  if (!item) return { title: '', detail: '' };
  const colonIndex = item.indexOf(':');
  if (colonIndex !== -1) {
    return {
      title: item.substring(0, colonIndex).trim(),
      detail: item.substring(colonIndex + 1).trim()
    };
  }
  return { title: '', detail: item };
};

const ActivityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [activity, setActivity] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPolling, setIsPolling] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [error, setError] = useState(null);
  const [regenNotice, setRegenNotice] = useState(null);

  const pollIntervalRef = useRef(null);
  const pollAttemptsRef = useRef(0);

  const stopPolling = () => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
    setIsPolling(false);
  };

  const checkRecommendation = async () => {
    try {
      const res = await getActivityRecommendation(id);
      if (res.data && res.data.recommendation && !res.data.recommendation.includes('Unable to generate detailed analysis')) {
        setRecommendation(res.data);
        stopPolling();
        return true;
      }
    } catch {
      // Still generating
    }
    return false;
  };

  const startPolling = () => {
    stopPolling();
    setIsPolling(true);
    pollAttemptsRef.current = 0;

    pollIntervalRef.current = setInterval(async () => {
      pollAttemptsRef.current += 1;
      const found = await checkRecommendation();
      if (found || pollAttemptsRef.current >= 8) {
        stopPolling();
      }
    }, 2500);
  };

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        const actRes = await getActivityById(id);
        if (!isMounted) return;
        setActivity(actRes.data);

        // Fetch AI recommendation
        try {
          const recRes = await getActivityRecommendation(id);
          if (isMounted && recRes.data && recRes.data.recommendation && !recRes.data.recommendation.includes('Unable to generate detailed analysis')) {
            setRecommendation(recRes.data);
          } else {
            // Recommendation still processing or missing, start auto-polling
            startPolling();
          }
        } catch {
          startPolling();
        }
      } catch (err) {
        console.error('Failed to load activity details:', err);
        if (isMounted) {
          setError('Activity not found or failed to load. Please try again.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
      stopPolling();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    setRegenNotice(null);
    try {
      const res = await regenerateActivityRecommendation(id);
      if (res.data) {
        setRecommendation(res.data);
        setRegenNotice('AI recommendation refreshed successfully!');
        setTimeout(() => setRegenNotice(null), 5000);
      }
    } catch (err) {
      console.error('Failed to regenerate recommendation:', err);
      setRegenNotice('Failed to refresh AI recommendation. Please try again in a moment.');
    } finally {
      setIsRegenerating(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', p: 4 }}>
        <CircularProgress size={48} thickness={4} />
        <Typography variant="h6" sx={{ mt: 3, fontWeight: 600, color: 'text.primary' }}>
          Loading workout details...
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Retrieving activity metrics and AI coaching insights
        </Typography>
      </Box>
    );
  }

  if (error || !activity) {
    return (
      <Box sx={{ maxWidth: 850, mx: 'auto', p: { xs: 2, sm: 3 } }}>
        <Button variant="outlined" onClick={() => navigate('/activities')} sx={{ mb: 2, borderRadius: 2 }}>
          &larr; Back to Activities
        </Button>
        <Alert severity="error" sx={{ borderRadius: 2 }}>{error || 'Activity not found.'}</Alert>
      </Box>
    );
  }

  const burnRate = activity.duration > 0 ? (activity.caloriesBurned / activity.duration).toFixed(1) : 0;
  const parsedSections = recommendation ? parseAnalysisSections(recommendation.recommendation) : [];

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: { xs: 1.5, sm: 3 }, pb: 6 }}>
      {/* Top Action Bar */}
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'center' }} spacing={2} sx={{ mb: 3 }}>
        <Button
          variant="outlined"
          onClick={() => navigate('/activities')}
          sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 2 }}
        >
          &larr; Back to Workouts
        </Button>

        <Button
          variant="contained"
          onClick={handleRegenerate}
          disabled={isRegenerating || isPolling}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.25)',
            '&:hover': { background: 'linear-gradient(135deg, #1d4ed8 0%, #6d28d9 100%)' }
          }}
        >
          {isRegenerating ? (
            <Stack direction="row" spacing={1} alignItems="center">
              <CircularProgress size={18} color="inherit" />
              <span>Regenerating AI Coaching...</span>
            </Stack>
          ) : (
            '🔄 Refresh AI Guide'
          )}
        </Button>
      </Stack>

      {regenNotice && (
        <Alert severity={regenNotice.includes('Failed') ? 'error' : 'success'} sx={{ mb: 3, borderRadius: 2 }}>
          {regenNotice}
        </Alert>
      )}

      {/* Workout Overview Hero Card */}
      <Card sx={{ mb: 4, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <Box sx={{ p: { xs: 2.5, sm: 3 }, background: 'linear-gradient(135deg, #f8fafc 0%, #edf2f7 100%)', borderBottom: '1px solid #e2e8f0' }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={1}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Typography sx={{ fontSize: '2.4rem', lineHeight: 1 }}>{getActivityIcon(activity.type)}</Typography>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>
                  {activity.type} Workout
                </Typography>
                {activity.createdAt && (
                  <Typography variant="body2" color="text.secondary">
                    {new Date(activity.createdAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })} at {new Date(activity.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Typography>
                )}
              </Box>
            </Stack>
            <Chip label="Completed Session" color="success" size="small" sx={{ fontWeight: 600, mt: { xs: 1, sm: 0 } }} />
          </Stack>
        </Box>

        {/* Metrics Grid */}
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 6, sm: 4 }}>
              <Paper elevation={0} sx={{ p: 2, borderRadius: 2, bgcolor: '#f0fdf4', border: '1px solid #bbf7d0', textAlign: 'center' }}>
                <Typography variant="caption" sx={{ color: '#15803d', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  ⏱️ Duration
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#166534', my: 0.5 }}>
                  {activity.duration}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Minutes
                </Typography>
              </Paper>
            </Grid2>

            <Grid2 size={{ xs: 6, sm: 4 }}>
              <Paper elevation={0} sx={{ p: 2, borderRadius: 2, bgcolor: '#fff7ed', border: '1px solid #fed7aa', textAlign: 'center' }}>
                <Typography variant="caption" sx={{ color: '#c2410c', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  🔥 Calories Burned
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#9a3412', my: 0.5 }}>
                  {activity.caloriesBurned}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  kcal
                </Typography>
              </Paper>
            </Grid2>

            <Grid2 size={{ xs: 12, sm: 4 }}>
              <Paper elevation={0} sx={{ p: 2, borderRadius: 2, bgcolor: '#eff6ff', border: '1px solid #bfdbfe', textAlign: 'center' }}>
                <Typography variant="caption" sx={{ color: '#1d4ed8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  ⚡ Burn Intensity
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e40af', my: 0.5 }}>
                  {burnRate}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  kcal / minute
                </Typography>
              </Paper>
            </Grid2>
          </Grid2>
        </CardContent>
      </Card>

      {/* AI Guidance Section */}
      <Card sx={{ borderRadius: 3, boxShadow: '0 6px 24px rgba(0,0,0,0.07)', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        {/* Header */}
        <Box sx={{ p: { xs: 2.5, sm: 3 }, background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: '#fff' }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={1}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                🤖 AI Personalized Fitness Coaching
              </Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8', mt: 0.5 }}>
                Comprehensive performance analysis, actionable improvements & next workout plans
              </Typography>
            </Box>
            <Chip
              label="Gemini 3.5 AI"
              size="small"
              sx={{
                bgcolor: 'rgba(99, 102, 241, 0.25)',
                color: '#a5b4fc',
                fontWeight: 600,
                border: '1px solid rgba(165, 180, 252, 0.4)',
                mt: { xs: 1, sm: 0 }
              }}
            />
          </Stack>
        </Box>

        <CardContent sx={{ p: { xs: 2, sm: 3.5 } }}>
          {/* Polling / Processing State */}
          {isPolling && !recommendation && (
            <Paper elevation={0} sx={{ p: 4, borderRadius: 2.5, bgcolor: '#f8fafc', border: '1px dashed #cbd5e1', textAlign: 'center' }}>
              <CircularProgress size={36} sx={{ color: '#2563eb', mb: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                AI Coach is analyzing your workout...
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 500, mx: 'auto', mt: 1, mb: 2 }}>
                Evaluating pacing dynamics, cardiovascular load, and generating customized fitness recommendations.
              </Typography>
              <Box sx={{ width: '80%', maxWidth: 360, mx: 'auto' }}>
                <LinearProgress sx={{ borderRadius: 2, height: 6 }} />
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.5 }}>
                Auto-updating momentarily...
              </Typography>
            </Paper>
          )}

          {/* Missing / Timeout Alert */}
          {!isPolling && !recommendation && (
            <Alert
              severity="info"
              action={
                <Button color="primary" size="small" variant="contained" onClick={handleRegenerate} disabled={isRegenerating}>
                  Generate Now
                </Button>
              }
              sx={{ borderRadius: 2 }}
            >
              AI Recommendation is being prepared. Click <strong>Generate Now</strong> to request personalized insights immediately.
            </Alert>
          )}

          {/* Full AI Recommendation Content */}
          {recommendation && (
            <Stack spacing={4}>
              {/* 1. Performance Analysis Section */}
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  📋 Performance Analysis Breakdown
                </Typography>

                {parsedSections.length > 0 ? (
                  <Grid2 container spacing={2}>
                    {parsedSections.map((sec, idx) => (
                      <Grid2 size={{ xs: 12, sm: 6 }} key={idx}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2.5,
                            borderRadius: 2.5,
                            bgcolor: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            transition: 'all 0.2s',
                            '&:hover': { borderColor: '#cbd5e1', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }
                          }}
                        >
                          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#2563eb', display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <span>{getSectionIcon(sec.title)}</span> {sec.title} Analysis
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#334155', lineHeight: 1.65, flexGrow: 1 }}>
                            {sec.content}
                          </Typography>
                        </Paper>
                      </Grid2>
                    ))}
                  </Grid2>
                ) : (
                  <Paper elevation={0} sx={{ p: 2.5, borderRadius: 2, bgcolor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-line', lineHeight: 1.7, color: '#334155' }}>
                      {recommendation.recommendation}
                    </Typography>
                  </Paper>
                )}
              </Box>

              <Divider sx={{ borderColor: '#e2e8f0' }} />

              {/* 2. Targeted Improvements Section */}
              {recommendation.improvements && recommendation.improvements.length > 0 && (
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    🎯 Targeted Performance Improvements
                  </Typography>

                  <Stack spacing={2}>
                    {recommendation.improvements.map((item, index) => {
                      const { title, detail } = splitColonItem(item);
                      return (
                        <Paper
                          key={index}
                          elevation={0}
                          sx={{
                            p: 2,
                            borderRadius: 2.5,
                            bgcolor: '#fff',
                            border: '1px solid #e2e8f0',
                            borderLeft: '4px solid #2563eb',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                          }}
                        >
                          {title ? (
                            <>
                              <Chip
                                label={title}
                                size="small"
                                color="primary"
                                variant="outlined"
                                sx={{ fontWeight: 700, mb: 1, borderRadius: 1.5 }}
                              />
                              <Typography variant="body2" sx={{ color: '#334155', lineHeight: 1.6 }}>
                                {detail}
                              </Typography>
                            </>
                          ) : (
                            <Typography variant="body2" sx={{ color: '#334155', lineHeight: 1.6 }}>
                              • {item}
                            </Typography>
                          )}
                        </Paper>
                      );
                    })}
                  </Stack>
                </Box>
              )}

              {/* 3. Next Workout Suggestions Section */}
              {recommendation.suggestions && recommendation.suggestions.length > 0 && (
                <Box>
                  <Divider sx={{ borderColor: '#e2e8f0', mb: 3 }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    💡 Recommended Next Workouts & Progression
                  </Typography>

                  <Grid2 container spacing={2}>
                    {recommendation.suggestions.map((item, index) => {
                      const { title, detail } = splitColonItem(item);
                      return (
                        <Grid2 size={{ xs: 12, sm: 6 }} key={index}>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 2.5,
                              borderRadius: 2.5,
                              bgcolor: '#f5f3ff',
                              border: '1px solid #ddd6fe',
                              height: '100%',
                              display: 'flex',
                              flexDirection: 'column'
                            }}
                          >
                            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#6d28d9', display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <span>⚡</span> {title || `Workout Option ${index + 1}`}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#4b5563', lineHeight: 1.6, flexGrow: 1 }}>
                              {detail || item}
                            </Typography>
                          </Paper>
                        </Grid2>
                      );
                    })}
                  </Grid2>
                </Box>
              )}

              {/* 4. Safety & Recovery Guidelines Section */}
              {recommendation.safety && recommendation.safety.length > 0 && (
                <Box>
                  <Divider sx={{ borderColor: '#e2e8f0', mb: 3 }} />
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2.5,
                      borderRadius: 2.5,
                      bgcolor: '#fefce8',
                      border: '1px solid #fef08a'
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#854d0e', display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                      🛡️ Safety, Mobility & Recovery Guidelines
                    </Typography>
                    <Stack spacing={1.2}>
                      {recommendation.safety.map((safetyItem, index) => (
                        <Typography key={index} variant="body2" sx={{ color: '#713f12', lineHeight: 1.55, display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                          <span style={{ color: '#ca8a04', fontWeight: 'bold' }}>✓</span>
                          <span>{safetyItem}</span>
                        </Typography>
                      ))}
                    </Stack>
                  </Paper>
                </Box>
              )}
            </Stack>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ActivityDetail;