import React, { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  CircularProgress,
  Divider,
  FormControlLabel,
  FormGroup,
  Grid2,
  LinearProgress,
  Paper,
  Slider,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import {
  getActivities,
  getDailyProgress,
  getDailyProgressHistory,
  getUserProfile,
  getUserStreak,
  saveDailyCheckin
} from '../services/api';

const DEFAULT_HABITS = [
  'Drink at least 2L of water',
  'Complete 30+ minutes of physical activity',
  '5-10 min dynamic stretching or foam rolling',
  'Consume balanced post-workout protein',
  '7+ hours restful restorative sleep'
];

const MOODS = [
  { label: 'High Energy', emoji: '⚡', color: '#16a34a' },
  { label: 'Good & Steady', emoji: '😊', color: '#2563eb' },
  { label: 'Moderate', emoji: '😐', color: '#ea580c' },
  { label: 'Fatigued / Rest', emoji: '😴', color: '#64748b' }
];

const DailyCheckIn = ({ userId }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // Profile targets
  const [calorieTarget, setCalorieTarget] = useState(2200);
  const [minuteTarget, setMinuteTarget] = useState(45);

  // Today's activities
  const [todayCalories, setTodayCalories] = useState(0);
  const [todayMinutes, setTodayMinutes] = useState(0);
  const [todayWorkoutCount, setTodayWorkoutCount] = useState(0);

  // Daily Checkin State
  const [waterMl, setWaterMl] = useState(1500);
  const [sleepHours, setSleepHours] = useState(7.0);
  const [weight, setWeight] = useState('');
  const [mood, setMood] = useState('Good & Steady');
  const [notes, setNotes] = useState('');
  const [completedTasks, setCompletedTasks] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);

  // Streak state
  const [streakInfo, setStreakInfo] = useState({ currentStreak: 0, longestStreak: 0, checkedInToday: false });
  const [, setHistory] = useState([]);

  const todayStr = new Date().toISOString().split('T')[0];

  const loadData = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      // Fetch user profile targets
      const profilePromise = getUserProfile(userId).catch(() => null);
      // Fetch today's activities
      const activitiesPromise = getActivities().catch(() => ({ data: [] }));
      // Fetch today's checkin
      const progressPromise = getDailyProgress(userId, todayStr).catch(() => null);
      // Fetch streak
      const streakPromise = getUserStreak(userId).catch(() => ({ data: { currentStreak: 0, longestStreak: 0 } }));
      // Fetch history
      const historyPromise = getDailyProgressHistory(userId, 7).catch(() => ({ data: [] }));

      const [profRes, actRes, progRes, streakRes, histRes] = await Promise.all([
        profilePromise,
        activitiesPromise,
        progressPromise,
        streakPromise,
        historyPromise
      ]);

      if (profRes?.data) {
        setCalorieTarget(profRes.data.dailyCalorieTarget || 2200);
        setMinuteTarget(profRes.data.dailyActiveMinutesTarget || 45);
      }

      // Calculate today's workout activity stats
      const allActs = actRes?.data || [];
      const todaysActs = allActs.filter((a) => {
        if (!a.createdAt) return false;
        const actDate = new Date(a.createdAt).toISOString().split('T')[0];
        return actDate === todayStr;
      });

      const totCal = todaysActs.reduce((s, a) => s + (Number(a.caloriesBurned) || 0), 0);
      const totMin = todaysActs.reduce((s, a) => s + (Number(a.duration) || 0), 0);
      setTodayCalories(totCal);
      setTodayMinutes(totMin);
      setTodayWorkoutCount(todaysActs.length);

      // Populate daily progress if exists
      if (progRes?.data) {
        const d = progRes.data;
        setWaterMl(d.waterMl || 0);
        setSleepHours(d.sleepHours || 7.0);
        if (d.weight) setWeight(d.weight);
        if (d.mood) setMood(d.mood);
        if (d.notes) setNotes(d.notes);
        if (d.completedTasks && Array.isArray(d.completedTasks)) {
          setCompletedTasks(d.completedTasks);
        }
        setIsCompleted(Boolean(d.isCompleted));
      }

      if (streakRes?.data) {
        setStreakInfo(streakRes.data);
      }

      if (histRes?.data) {
        setHistory(histRes.data);
      }
    } catch (err) {
      console.error('Failed to load daily checkin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const handleToggleHabit = (habit) => {
    setCompletedTasks((prev) =>
      prev.includes(habit) ? prev.filter((h) => h !== habit) : [...prev, habit]
    );
  };

  const handleAddWater = (ml) => {
    setWaterMl((prev) => Math.max(0, prev + ml));
  };

  const handleSubmitCheckin = async () => {
    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);
    try {
      const payload = {
        date: todayStr,
        waterMl: Number(waterMl),
        sleepHours: Number(sleepHours),
        weight: weight ? Number(weight) : null,
        mood,
        notes,
        completedTasks,
        isCompleted: true
      };

      await saveDailyCheckin(userId, payload);
      setIsCompleted(true);
      setSuccessMsg('🎉 Awesome work! Your daily check-in is complete and your streak is updated!');

      // Refresh streak
      const sRes = await getUserStreak(userId);
      if (sRes?.data) setStreakInfo(sRes.data);
    } catch (err) {
      console.error('Failed to save daily checkin:', err);
      setErrorMsg('Failed to save daily check-in. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress size={44} />
      </Box>
    );
  }

  const calProgress = Math.min(100, Math.round((todayCalories / calorieTarget) * 100));
  const minProgress = Math.min(100, Math.round((todayMinutes / minuteTarget) * 100));
  const waterProgress = Math.min(100, Math.round((waterMl / 2500) * 100));

  return (
    <Box sx={{ maxWidth: 1050, mx: 'auto', p: { xs: 1.5, sm: 3 }, pb: 6 }}>
      {/* Header Banner with Streak */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, sm: 3.5 },
          mb: 4,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
          color: '#fff',
          boxShadow: '0 8px 30px rgba(15, 23, 42, 0.2)'
        }}
      >
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2}>
          <Box>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
              <Chip
                label={`🔥 ${streakInfo.currentStreak || 0}-DAY STREAK`}
                size="small"
                sx={{ bgcolor: '#ea580c', color: '#fff', fontWeight: 800, fontSize: '0.75rem' }}
              />
              {isCompleted && (
                <Chip
                  label="✓ CHECKED IN TODAY"
                  size="small"
                  sx={{ bgcolor: '#16a34a', color: '#fff', fontWeight: 800, fontSize: '0.75rem' }}
                />
              )}
            </Stack>
            <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: -0.5 }}>
              Daily Progress & Wellness Check-in
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8', mt: 0.5 }}>
              Track daily habits, hydration, sleep, energy levels & keep your consistency streak blazing
            </Typography>
          </Box>

          <Paper elevation={0} sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.08)', borderRadius: 2.5, textAlign: 'center', minWidth: 140 }}>
            <Typography variant="caption" sx={{ color: '#cbd5e1', fontWeight: 700, textTransform: 'uppercase' }}>
              Consistency Score
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#f59e0b', my: 0.5 }}>
              {streakInfo.totalCheckins || 0}
            </Typography>
            <Typography variant="caption" sx={{ color: '#94a3b8' }}>
              Total Check-ins Logged
            </Typography>
          </Paper>
        </Stack>
      </Paper>

      {successMsg && <Alert severity="success" sx={{ mb: 3 }}>{successMsg}</Alert>}
      {errorMsg && <Alert severity="error" sx={{ mb: 3 }}>{errorMsg}</Alert>}

      {/* Today's Target Gauges */}
      <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 2 }}>
        Today's Activity Progress vs Daily Targets
      </Typography>

      <Grid2 container spacing={2.5} sx={{ mb: 4 }}>
        {/* Workouts Today */}
        <Grid2 size={{ xs: 12, sm: 4 }}>
          <Card sx={{ borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="caption" sx={{ color: '#2563eb', fontWeight: 700, textTransform: 'uppercase' }}>
                🏃 Sessions Logged Today
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, color: '#0f172a', my: 0.5 }}>
                {todayWorkoutCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {todayWorkoutCount > 0 ? `${todayMinutes} active minutes tracked today` : 'No workout logged yet today'}
              </Typography>
            </CardContent>
          </Card>
        </Grid2>

        {/* Calories Burned Today */}
        <Grid2 size={{ xs: 12, sm: 4 }}>
          <Card sx={{ borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="caption" sx={{ color: '#ea580c', fontWeight: 700, textTransform: 'uppercase' }}>
                  🔥 Today's Calorie Burn
                </Typography>
                <Chip label={`${calProgress}%`} size="small" sx={{ fontWeight: 700 }} />
              </Stack>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#c2410c', my: 1 }}>
                {todayCalories} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#64748b' }}>/ {calorieTarget} kcal</span>
              </Typography>
              <LinearProgress
                variant="determinate"
                value={calProgress}
                sx={{ height: 7, borderRadius: 3, bgcolor: '#ffedd5', '& .MuiLinearProgress-bar': { bgcolor: '#ea580c' } }}
              />
            </CardContent>
          </Card>
        </Grid2>

        {/* Active Minutes Today */}
        <Grid2 size={{ xs: 12, sm: 4 }}>
          <Card sx={{ borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="caption" sx={{ color: '#16a34a', fontWeight: 700, textTransform: 'uppercase' }}>
                  ⏱️ Active Exercise Time
                </Typography>
                <Chip label={`${minProgress}%`} size="small" sx={{ fontWeight: 700 }} />
              </Stack>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#15803d', my: 1 }}>
                {todayMinutes} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#64748b' }}>/ {minuteTarget} min</span>
              </Typography>
              <LinearProgress
                variant="determinate"
                value={minProgress}
                sx={{ height: 7, borderRadius: 3, bgcolor: '#dcfce7', '& .MuiLinearProgress-bar': { bgcolor: '#16a34a' } }}
              />
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>

      {/* Wellness Inputs & Habit Checklist */}
      <Grid2 container spacing={3} sx={{ mb: 4 }}>
        {/* Left Column: Hydration & Sleep & Mood */}
        <Grid2 size={{ xs: 12, md: 6 }}>
          <Card sx={{ borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.04)', height: '100%' }}>
            <Box sx={{ p: 2.5, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1e293b' }}>
                💧 Hydration & Sleep Telemetry
              </Typography>
            </Box>

            <CardContent sx={{ p: 3 }}>
              <Stack spacing={3}>
                {/* Water tracker */}
                <Box>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#0369a1' }}>
                      Water Intake: {waterMl} ml
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Target: 2,500 ml
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={waterProgress}
                    sx={{ height: 8, borderRadius: 4, bgcolor: '#e0f2fe', '& .MuiLinearProgress-bar': { bgcolor: '#0284c7' }, mb: 1.5 }}
                  />
                  <Stack direction="row" spacing={1}>
                    <Button size="small" variant="outlined" onClick={() => handleAddWater(250)} sx={{ borderRadius: 2, textTransform: 'none' }}>
                      +250 ml (Glass)
                    </Button>
                    <Button size="small" variant="outlined" onClick={() => handleAddWater(500)} sx={{ borderRadius: 2, textTransform: 'none' }}>
                      +500 ml (Bottle)
                    </Button>
                    <Button size="small" color="error" onClick={() => setWaterMl(0)} sx={{ borderRadius: 2, textTransform: 'none' }}>
                      Reset
                    </Button>
                  </Stack>
                </Box>

                <Divider />

                {/* Sleep tracker */}
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#4338ca', mb: 1 }}>
                    🛌 Last Night's Sleep: {sleepHours} hours
                  </Typography>
                  <Slider
                    value={sleepHours}
                    min={4.0}
                    max={12.0}
                    step={0.5}
                    onChange={(e, val) => setSleepHours(val)}
                    valueLabelDisplay="auto"
                    marks={[
                      { value: 4, label: '4h' },
                      { value: 7, label: '7h' },
                      { value: 8, label: '8h' },
                      { value: 12, label: '12h' }
                    ]}
                  />
                </Box>

                <Divider />

                {/* Energy & Mood */}
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#334155', mb: 1.5 }}>
                    😊 Today's Energy & Readiness:
                  </Typography>
                  <Stack direction="row" flexWrap="wrap" gap={1}>
                    {MOODS.map((m) => (
                      <Chip
                        key={m.label}
                        label={`${m.emoji} ${m.label}`}
                        clickable
                        onClick={() => setMood(m.label)}
                        color={mood === m.label ? 'primary' : 'default'}
                        variant={mood === m.label ? 'filled' : 'outlined'}
                        sx={{ fontWeight: 700, borderRadius: 2 }}
                      />
                    ))}
                  </Stack>
                </Box>

                {/* Optional Today's Weight */}
                <TextField
                  label="Today's Morning Weigh-in (Optional)"
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="e.g. 71.8"
                  size="small"
                  slotProps={{ input: { endAdornment: <Typography variant="caption" sx={{ color: '#64748b' }}>kg</Typography> } }}
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid2>

        {/* Right Column: Daily Habits Checklist */}
        <Grid2 size={{ xs: 12, md: 6 }}>
          <Card sx={{ borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.04)', height: '100%' }}>
            <Box sx={{ p: 2.5, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1e293b' }}>
                ✅ Daily Habits & Reflections
              </Typography>
            </Box>

            <CardContent sx={{ p: 3 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Check off your core daily wellness non-negotiables:
              </Typography>

              <FormGroup sx={{ mb: 3 }}>
                {DEFAULT_HABITS.map((habit, idx) => {
                  const isChecked = completedTasks.includes(habit);
                  return (
                    <Paper
                      key={idx}
                      elevation={0}
                      sx={{
                        p: 1.2,
                        mb: 1,
                        borderRadius: 2,
                        bgcolor: isChecked ? '#f0fdf4' : '#f8fafc',
                        border: isChecked ? '1px solid #bbf7d0' : '1px solid #e2e8f0',
                        transition: 'all 0.2s'
                      }}
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={isChecked}
                            onChange={() => handleToggleHabit(habit)}
                            color="success"
                          />
                        }
                        label={
                          <Typography variant="body2" sx={{ fontWeight: isChecked ? 700 : 500, color: isChecked ? '#166534' : '#334155' }}>
                            {habit}
                          </Typography>
                        }
                      />
                    </Paper>
                  );
                })}
              </FormGroup>

              <TextField
                fullWidth
                multiline
                rows={2}
                label="Daily Training Notes & Wins"
                placeholder="How did your workout feel? Any soreness, breakthrough pacing, or notes for your coach?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                sx={{ mb: 3 }}
              />

              <Button
                variant="contained"
                fullWidth
                disabled={saving}
                onClick={handleSubmitCheckin}
                sx={{
                  py: 1.3,
                  borderRadius: 2.5,
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  textTransform: 'none',
                  background: isCompleted
                    ? 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)'
                    : 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)'
                }}
              >
                {saving ? (
                  <CircularProgress size={20} color="inherit" />
                ) : isCompleted ? (
                  '✓ Update Daily Check-in & Keep Streak'
                ) : (
                  '🔥 Complete Daily Check-in & Keep Streak'
                )}
              </Button>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default DailyCheckIn;
