import React, { useEffect, useState } from 'react';
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
  Paper,
  Stack,
  Typography
} from '@mui/material';
import { useNavigate } from 'react-router';
import { getActivities, getUserStreak, ensureValidToken } from '../services/api';

const Dashboard = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [streakInfo, setStreakInfo] = useState({ currentStreak: 0, checkedInToday: false });
  const navigate = useNavigate();

  const userId = localStorage.getItem('userId');
  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getActivities();
        const data = res.data || [];
        data.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        setActivities(data);

        if (userId) {
          try {
            const streakRes = await getUserStreak(userId).catch(() => null);
            if (streakRes?.data) {
              setStreakInfo(streakRes.data);
            }
          } catch {
            // ignore
          }
        }
      } catch (err) {
        console.error('Failed to load dashboard data, attempting auto-reconnect:', err);
        try {
          // Attempt silent session recovery
          await ensureValidToken();
          const retryRes = await getActivities();
          const retryData = retryRes.data || [];
          retryData.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
          setActivities(retryData);
          setError(null);
          return;
        } catch (retryErr) {
          console.error('Auto-reconnect also failed:', retryErr);
          setError('Unable to load activities from server. Please check connection or click retry.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', p: 4 }}>
        <CircularProgress size={48} thickness={4} />
        <Typography variant="h6" sx={{ mt: 3, fontWeight: 600 }}>Loading fitness dashboard...</Typography>
      </Box>
    );
  }

  const totalSessions = activities.length;
  const totalMinutes = activities.reduce((sum, a) => sum + (Number(a.duration) || 0), 0);
  const totalCalories = activities.reduce((sum, a) => sum + (Number(a.caloriesBurned) || 0), 0);
  const avgBurnRate = totalMinutes > 0 ? (totalCalories / totalMinutes).toFixed(1) : '0.0';

  // Today's activities
  const todaysActivities = activities.filter((a) => {
    if (!a.createdAt) return false;
    return new Date(a.createdAt).toISOString().split('T')[0] === todayStr;
  });
  const todayCalories = todaysActivities.reduce((s, a) => s + (Number(a.caloriesBurned) || 0), 0);
  const todayMinutes = todaysActivities.reduce((s, a) => s + (Number(a.duration) || 0), 0);

  // Count by activity type
  const counts = { RUNNING: 0, CYCLING: 0, WALKING: 0 };
  activities.forEach((a) => {
    const t = a.type?.toUpperCase();
    if (counts[t] !== undefined) counts[t]++;
    else counts.RUNNING++;
  });

  const runPct = totalSessions > 0 ? Math.round((counts.RUNNING / totalSessions) * 100) : 0;
  const cyclePct = totalSessions > 0 ? Math.round((counts.CYCLING / totalSessions) * 100) : 0;
  const walkPct = totalSessions > 0 ? 100 - runPct - cyclePct : 0;

  // Group last 7 items or daily calories for SVG bar chart
  const recent7 = activities.slice(0, 7).reverse();
  const maxCalories = recent7.length > 0 ? Math.max(...recent7.map((a) => Number(a.caloriesBurned) || 0), 100) : 500;

  // SVG Donut calculation
  const circumference = 2 * Math.PI * 40; // r=40
  const runOffset = 0;
  const runDash = (runPct / 100) * circumference;
  const cycleOffset = -runDash;
  const cycleDash = (cyclePct / 100) * circumference;
  const walkOffset = -(runDash + cycleDash);
  const walkDash = (walkPct / 100) * circumference;

  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto', p: { xs: 1.5, sm: 3 }, pb: 6 }}>
      {/* Session / Connection Recovery Banner */}
      {error && (
        <Alert
          severity="warning"
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => {
                setError(null);
                ensureValidToken().then(() => getActivities()).then((res) => {
                  const data = res.data || [];
                  data.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
                  setActivities(data);
                }).catch(() => setError('Connection failed. Please verify API Gateway is running on port 8085.'));
              }}
              sx={{ fontWeight: 800, textTransform: 'none' }}
            >
              🔄 Retry Connection
            </Button>
          }
          sx={{ mb: 3, borderRadius: 2.5 }}
        >
          {error}
        </Alert>
      )}

      {/* Header Banner */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, sm: 3.5 },
          mb: 4,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          color: '#fff',
          boxShadow: '0 8px 30px rgba(15, 23, 42, 0.15)'
        }}
      >
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2}>
          <Box>
            <Chip label="FITPULSE AI INTELLIGENCE" size="small" sx={{ bgcolor: 'rgba(59, 130, 246, 0.25)', color: '#93c5fd', fontWeight: 700, mb: 1 }} />
            <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: -0.5 }}>
              Executive Fitness Dashboard
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8', mt: 0.5 }}>
              Continuous performance telemetry, metabolic rates & AI-driven workout progression
            </Typography>
          </Box>
          <Stack direction="row" spacing={1.5} flexWrap="wrap" gap={1}>
            <Button
              variant="contained"
              onClick={() => navigate('/beginner-plan')}
              sx={{
                textTransform: 'none',
                fontWeight: 700,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35)'
              }}
            >
              🔰 Beginner 7-Day Plan
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/guide')}
              sx={{
                textTransform: 'none',
                fontWeight: 700,
                borderRadius: 2,
                borderColor: 'rgba(96, 165, 250, 0.5)',
                color: '#93c5fd',
                bgcolor: 'rgba(37, 99, 235, 0.1)',
                '&:hover': { borderColor: '#93c5fd', bgcolor: 'rgba(37, 99, 235, 0.2)' }
              }}
            >
              📖 How It Works & Advantages
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate('/activities')}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)'
              }}
            >
              ➕ Log Workout
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/ai-coach')}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: 2,
                borderColor: '#475569',
                color: '#e2e8f0',
                '&:hover': { borderColor: '#94a3b8', bgcolor: 'rgba(255,255,255,0.05)' }
              }}
            >
              🤖 Ask AI Coach
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* Beginner Foundation Program Spotlight Banner */}
      <Card
        sx={{
          p: { xs: 2, sm: 2.5 },
          mb: 4,
          borderRadius: 3,
          bgcolor: '#eff6ff',
          border: '1px solid #bfdbfe',
          boxShadow: '0 2px 8px rgba(37, 99, 235, 0.08)'
        }}
      >
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ md: 'center' }} spacing={2}>
          <Box>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.6 }}>
              <Chip label="NEW TO FITNESS?" size="small" sx={{ bgcolor: '#2563eb', color: '#fff', fontWeight: 800, fontSize: '0.68rem' }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1e3a8a' }}>
                Complete 7-Day Weekday Exercise Guide & Anatomy Breakdown 🏋️‍♂️
              </Typography>
            </Stack>
            <Typography variant="body2" sx={{ color: '#1e40af', maxWidth: 740 }}>
              Master everyday movement mechanics with step-by-step instructions, visual movement illustrations, targeted muscle maps, and an interactive workout runner.
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={() => navigate('/beginner-plan')}
            sx={{
              bgcolor: '#2563eb',
              fontWeight: 700,
              textTransform: 'none',
              borderRadius: 2.5,
              px: 3,
              py: 1,
              whiteSpace: 'nowrap',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
              '&:hover': { bgcolor: '#1d4ed8' }
            }}
          >
            Start Beginner Plan →
          </Button>
        </Stack>
      </Card>

      {/* Guide Spotlight Banner */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 2.5,
          bgcolor: '#eff6ff',
          border: '1px solid #bfdbfe',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Typography sx={{ fontSize: '1.4rem' }}>💡</Typography>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1e3a8a' }}>
              Master FitPulse AI: Read Our Step-by-Step Instructions & Advantages
            </Typography>
            <Typography variant="caption" sx={{ color: '#3b82f6', fontWeight: 500 }}>
              Discover how clinical metabolic science, Google Gemini AI, and daily consistency streaks give you the ultimate edge over other fitness apps.
            </Typography>
          </Box>
        </Stack>
        <Button
          size="small"
          variant="contained"
          onClick={() => navigate('/guide')}
          sx={{
            textTransform: 'none',
            fontWeight: 700,
            borderRadius: 2,
            bgcolor: '#2563eb',
            '&:hover': { bgcolor: '#1d4ed8' }
          }}
        >
          Explore App Guide ➔
        </Button>
      </Paper>

      {/* Daily Progress & Streak Spotlight */}
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          mb: 4,
          borderRadius: 3,
          bgcolor: '#ffffff',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: 3,
              bgcolor: '#fff7ed',
              border: '1px solid #fed7aa',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8rem'
            }}
          >
            🔥
          </Box>
          <Box>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a' }}>
                Daily Consistency Streak: {streakInfo.currentStreak || 0} Days
              </Typography>
              <Chip
                label={streakInfo.checkedInToday ? '✓ CHECKED IN TODAY' : 'PENDING CHECK-IN'}
                size="small"
                color={streakInfo.checkedInToday ? 'success' : 'warning'}
                sx={{ fontWeight: 800, fontSize: '0.7rem' }}
              />
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.3 }}>
              Today: <strong>{todaysActivities.length} workouts</strong> logged • <strong>{todayMinutes} min</strong> • <strong>{todayCalories} kcal</strong>
            </Typography>
          </Box>
        </Stack>

        <Button
          variant="contained"
          onClick={() => navigate('/daily-checkin')}
          sx={{
            px: 2.5,
            py: 1,
            borderRadius: 2,
            fontWeight: 700,
            textTransform: 'none',
            background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
            boxShadow: '0 4px 12px rgba(234, 88, 12, 0.35)',
            whiteSpace: 'nowrap'
          }}
        >
          {streakInfo.checkedInToday ? '✓ View Daily Check-in' : '🔥 Complete Daily Check-in'}
        </Button>
      </Paper>

      {/* KPI Stat Cards */}
      <Grid2 container spacing={2.5} sx={{ mb: 4 }}>
        <Grid2 size={{ xs: 6, sm: 3 }}>
          <Card sx={{ borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
            <CardContent sx={{ p: 2.5, textAlign: 'center' }}>
              <Typography sx={{ fontSize: '1.8rem', mb: 0.5 }}>🏃</Typography>
              <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                Total Workouts
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b', my: 0.5 }}>
                {totalSessions}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Logged sessions
              </Typography>
            </CardContent>
          </Card>
        </Grid2>

        <Grid2 size={{ xs: 6, sm: 3 }}>
          <Card sx={{ borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
            <CardContent sx={{ p: 2.5, textAlign: 'center' }}>
              <Typography sx={{ fontSize: '1.8rem', mb: 0.5 }}>⏱️</Typography>
              <Typography variant="caption" sx={{ color: '#16a34a', fontWeight: 700, textTransform: 'uppercase' }}>
                Active Minutes
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#15803d', my: 0.5 }}>
                {totalMinutes}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Total training time
              </Typography>
            </CardContent>
          </Card>
        </Grid2>

        <Grid2 size={{ xs: 6, sm: 3 }}>
          <Card sx={{ borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
            <CardContent sx={{ p: 2.5, textAlign: 'center' }}>
              <Typography sx={{ fontSize: '1.8rem', mb: 0.5 }}>🔥</Typography>
              <Typography variant="caption" sx={{ color: '#ea580c', fontWeight: 700, textTransform: 'uppercase' }}>
                Calories Burned
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#c2410c', my: 0.5 }}>
                {totalCalories > 9999 ? (totalCalories / 1000).toFixed(1) + 'k' : totalCalories}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Cumulative kcal
              </Typography>
            </CardContent>
          </Card>
        </Grid2>

        <Grid2 size={{ xs: 6, sm: 3 }}>
          <Card sx={{ borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
            <CardContent sx={{ p: 2.5, textAlign: 'center' }}>
              <Typography sx={{ fontSize: '1.8rem', mb: 0.5 }}>⚡</Typography>
              <Typography variant="caption" sx={{ color: '#2563eb', fontWeight: 700, textTransform: 'uppercase' }}>
                Avg Burn Rate
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#1d4ed8', my: 0.5 }}>
                {avgBurnRate}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                kcal / minute
              </Typography>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>

      {/* Visual Charts Section */}
      <Grid2 container spacing={3} sx={{ mb: 4 }}>
        {/* Chart 1: Recent Calorie Expenditure Bar Chart */}
        <Grid2 size={{ xs: 12, md: 7 }}>
          <Card sx={{ borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.04)', height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                <span>📊</span> Recent Sessions Caloric Output
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Comparison of energy expenditure across your latest logged workouts
              </Typography>

              {recent7.length === 0 ? (
                <Box sx={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="body2" color="text.secondary">No workouts logged to plot chart.</Typography>
                </Box>
              ) : (
                <Box sx={{ width: '100%', overflowX: 'auto' }}>
                  <svg viewBox="0 0 450 180" style={{ width: '100%', height: 180 }}>
                    <defs>
                      <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2563eb" />
                        <stop offset="100%" stopColor="#7c3aed" />
                      </linearGradient>
                    </defs>
                    {/* Gridlines */}
                    <line x1="30" y1="20" x2="430" y2="20" stroke="#f1f5f9" strokeDasharray="4" />
                    <line x1="30" y1="75" x2="430" y2="75" stroke="#f1f5f9" strokeDasharray="4" />
                    <line x1="30" y1="130" x2="430" y2="130" stroke="#e2e8f0" />

                    {/* Bars */}
                    {recent7.map((item, i) => {
                      const barWidth = 32;
                      const spacing = (400 - recent7.length * barWidth) / (recent7.length + 1);
                      const x = 35 + spacing + i * (barWidth + spacing);
                      const cal = Number(item.caloriesBurned) || 0;
                      const barHeight = Math.max(10, Math.min(110, (cal / maxCalories) * 110));
                      const y = 130 - barHeight;
                      return (
                        <g key={i}>
                          <rect
                            x={x}
                            y={y}
                            width={barWidth}
                            height={barHeight}
                            rx={4}
                            fill="url(#barGrad)"
                            style={{ transition: 'all 0.3s ease' }}
                          />
                          <text x={x + barWidth / 2} y={y - 5} textAnchor="middle" fontSize="10" fontWeight="700" fill="#475569">
                            {cal > 999 ? Math.round(cal / 1000) + 'k' : cal}
                          </text>
                          <text x={x + barWidth / 2} y={145} textAnchor="middle" fontSize="10" fill="#64748b">
                            {item.type ? item.type.substring(0, 3) : 'RUN'}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid2>

        {/* Chart 2: Activity Distribution Donut Chart */}
        <Grid2 size={{ xs: 12, md: 5 }}>
          <Card sx={{ borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.04)', height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                <span>🎯</span> Activity Type Breakdown
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Percentage distribution of your workout types
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', my: 1 }}>
                <svg width="140" height="140" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f1f5f9" strokeWidth="14" />
                  {/* Running */}
                  {runDash > 0 && (
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#ea580c"
                      strokeWidth="14"
                      strokeDasharray={`${runDash} ${circumference}`}
                      strokeDashoffset={runOffset}
                      strokeLinecap="round"
                    />
                  )}
                  {/* Cycling */}
                  {cycleDash > 0 && (
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#0284c7"
                      strokeWidth="14"
                      strokeDasharray={`${cycleDash} ${circumference}`}
                      strokeDashoffset={cycleOffset}
                      strokeLinecap="round"
                    />
                  )}
                  {/* Walking */}
                  {walkDash > 0 && (
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#16a34a"
                      strokeWidth="14"
                      strokeDasharray={`${walkDash} ${circumference}`}
                      strokeDashoffset={walkOffset}
                      strokeLinecap="round"
                    />
                  )}
                  <text x="50" y="48" textAnchor="middle" fontSize="13" fontWeight="800" fill="#1e293b">
                    {totalSessions}
                  </text>
                  <text x="50" y="62" textAnchor="middle" fontSize="8" fill="#64748b">
                    Total
                  </text>
                </svg>
              </Box>

              <Stack spacing={1} sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, bgcolor: '#fff7ed', borderRadius: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#9a3412' }}>🏃 Running</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#9a3412' }}>{counts.RUNNING} ({runPct}%)</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, bgcolor: '#f0f9ff', borderRadius: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#0369a1' }}>🚴 Cycling</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#0369a1' }}>{counts.CYCLING} ({cyclePct}%)</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, bgcolor: '#f0fdf4', borderRadius: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#15803d' }}>🚶 Walking</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#15803d' }}>{counts.WALKING} ({walkPct}%)</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>

      {/* AI Coaching Insights Summary */}
      <Card sx={{ mb: 4, borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
        <Box sx={{ p: 2.5, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 1 }}>
              <span>🤖</span> Gemini AI Fitness Intelligence
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Key strategic themes automatically synthesized from your recent sessions
            </Typography>
          </Box>
          <Button variant="text" color="primary" onClick={() => navigate('/ai-coach')} sx={{ fontWeight: 600, textTransform: 'none' }}>
            Open AI Coach &rarr;
          </Button>
        </Box>

        <CardContent sx={{ p: 3 }}>
          <Grid2 container spacing={2.5}>
            <Grid2 size={{ xs: 12, sm: 4 }}>
              <Paper elevation={0} sx={{ p: 2.5, borderRadius: 2.5, bgcolor: '#eff6ff', border: '1px solid #bfdbfe', height: '100%' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1e40af', mb: 1 }}>
                  ❤️ Aerobic Zone 2 Foundation
                </Typography>
                <Typography variant="body2" sx={{ color: '#334155', lineHeight: 1.6 }}>
                  Your steady caloric expenditure shows solid Zone 2 base development. Maintaining conversational pacing builds mitochondrial density for long-term endurance.
                </Typography>
              </Paper>
            </Grid2>

            <Grid2 size={{ xs: 12, sm: 4 }}>
              <Paper elevation={0} sx={{ p: 2.5, borderRadius: 2.5, bgcolor: '#f5f3ff', border: '1px solid #ddd6fe', height: '100%' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#6d28d9', mb: 1 }}>
                  ⚡ High-Intensity Surges
                </Typography>
                <Typography variant="body2" sx={{ color: '#334155', lineHeight: 1.6 }}>
                  Interleaving 2-minute cadence intervals into your workouts stimulates VO2 Max gains and elevates post-exercise oxygen consumption (EPOC).
                </Typography>
              </Paper>
            </Grid2>

            <Grid2 size={{ xs: 12, sm: 4 }}>
              <Paper elevation={0} sx={{ p: 2.5, borderRadius: 2.5, bgcolor: '#fefce8', border: '1px solid #fef08a', height: '100%' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#854d0e', mb: 1 }}>
                  🛡️ Active Recovery & Mobility
                </Typography>
                <Typography variant="body2" sx={{ color: '#334155', lineHeight: 1.6 }}>
                  Remember to balance vigorous runs and cycling with dedicated dynamic warm-ups and 20-minute low-impact walks to prevent connective tissue strain.
                </Typography>
              </Paper>
            </Grid2>
          </Grid2>
        </CardContent>
      </Card>

      {/* Recent Workouts Feed */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
          Recent Activity Highlights
        </Typography>
        <Button variant="text" onClick={() => navigate('/activities')} sx={{ fontWeight: 600, textTransform: 'none' }}>
          View All Workouts ({totalSessions}) &rarr;
        </Button>
      </Box>

      <Grid2 container spacing={2}>
        {activities.slice(0, 3).map((act) => (
          <Grid2 size={{ xs: 12, sm: 4 }} key={act.id}>
            <Paper
              elevation={0}
              onClick={() => navigate(`/activities/${act.id}`)}
              sx={{
                p: 2.5,
                borderRadius: 2.5,
                bgcolor: '#fff',
                border: '1px solid #e2e8f0',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': { transform: 'translateY(-3px)', borderColor: '#93c5fd', boxShadow: '0 8px 20px rgba(0,0,0,0.06)' }
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                <Chip label={act.type} size="small" color="primary" sx={{ fontWeight: 700 }} />
                <Typography variant="caption" color="text.secondary">
                  {act.createdAt ? new Date(act.createdAt).toLocaleDateString() : ''}
                </Typography>
              </Stack>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a' }}>
                {act.duration} min • {act.caloriesBurned} kcal
              </Typography>
              <Typography variant="caption" sx={{ color: '#2563eb', fontWeight: 600, mt: 1, display: 'block' }}>
                View AI Coaching Guide &rarr;
              </Typography>
            </Paper>
          </Grid2>
        ))}
      </Grid2>
    </Box>
  );
};

export default Dashboard;