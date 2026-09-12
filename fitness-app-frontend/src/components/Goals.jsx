import React, { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid2,
  LinearProgress,
  Paper,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { getActivities } from '../services/api';

const BADGES_CONFIG = [
  {
    id: 'first_workout',
    title: 'First Step',
    icon: '🥇',
    description: 'Log your first workout session to begin your fitness journey',
    check: (acts) => acts.length >= 1,
    progress: (acts) => Math.min(100, (acts.length / 1) * 100)
  },
  {
    id: 'calorie_500',
    title: 'Calorie Crusher',
    icon: '🔥',
    description: 'Burn 500 cumulative calories across your training sessions',
    check: (acts) => acts.reduce((s, a) => s + (Number(a.caloriesBurned) || 0), 0) >= 500,
    progress: (acts) => {
      const total = acts.reduce((s, a) => s + (Number(a.caloriesBurned) || 0), 0);
      return Math.min(100, Math.round((total / 500) * 100));
    }
  },
  {
    id: 'calorie_1500',
    title: 'High Octane',
    icon: '⚡',
    description: 'Burn over 1,500 total calories with consistent dedication',
    check: (acts) => acts.reduce((s, a) => s + (Number(a.caloriesBurned) || 0), 0) >= 1500,
    progress: (acts) => {
      const total = acts.reduce((s, a) => s + (Number(a.caloriesBurned) || 0), 0);
      return Math.min(100, Math.round((total / 1500) * 100));
    }
  },
  {
    id: 'duration_40',
    title: 'Endurance Warrior',
    icon: '⏱️',
    description: 'Complete a single endurance session lasting 40 minutes or more',
    check: (acts) => acts.some((a) => (Number(a.duration) || 0) >= 40),
    progress: (acts) => {
      const maxDur = acts.length > 0 ? Math.max(...acts.map((a) => Number(a.duration) || 0)) : 0;
      return Math.min(100, Math.round((maxDur / 40) * 100));
    }
  },
  {
    id: 'multi_sport',
    title: 'Multi-Sport Athlete',
    icon: '🏃‍♂️',
    description: 'Log workouts across 2 or more distinct activity types',
    check: (acts) => new Set(acts.map((a) => a.type?.toUpperCase())).size >= 2,
    progress: (acts) => {
      const unique = new Set(acts.map((a) => a.type?.toUpperCase())).size;
      return Math.min(100, Math.round((unique / 2) * 100));
    }
  },
  {
    id: 'consistency_5',
    title: 'Consistency Champion',
    icon: '🌟',
    description: 'Log 5 or more total workout sessions into your tracker',
    check: (acts) => acts.length >= 5,
    progress: (acts) => Math.min(100, Math.round((acts.length / 5) * 100))
  }
];

const Goals = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Targets state (persisted to localStorage)
  const [targetCalories, setTargetCalories] = useState(() => Number(localStorage.getItem('target_cal')) || 2500);
  const [targetMinutes, setTargetMinutes] = useState(() => Number(localStorage.getItem('target_min')) || 150);
  const [targetWorkouts, setTargetWorkouts] = useState(() => Number(localStorage.getItem('target_workouts')) || 4);

  // Edit modal
  const [openModal, setOpenModal] = useState(false);
  const [editCal, setEditCal] = useState(targetCalories);
  const [editMin, setEditMin] = useState(targetMinutes);
  const [editWorkouts, setEditWorkouts] = useState(targetWorkouts);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await getActivities();
        setActivities(res.data || []);
      } catch (err) {
        console.error('Failed to load activities for goals:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  const handleSaveTargets = () => {
    setTargetCalories(editCal);
    setTargetMinutes(editMin);
    setTargetWorkouts(editWorkouts);
    localStorage.setItem('target_cal', editCal);
    localStorage.setItem('target_min', editMin);
    localStorage.setItem('target_workouts', editWorkouts);
    setOpenModal(false);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <CircularProgress size={48} />
      </Box>
    );
  }

  // Calculate actuals
  const currentCalories = activities.reduce((sum, a) => sum + (Number(a.caloriesBurned) || 0), 0);
  const currentMinutes = activities.reduce((sum, a) => sum + (Number(a.duration) || 0), 0);
  const currentWorkouts = activities.length;

  const calProgress = Math.min(100, Math.round((currentCalories / targetCalories) * 100));
  const minProgress = Math.min(100, Math.round((currentMinutes / targetMinutes) * 100));
  const workoutProgress = Math.min(100, Math.round((currentWorkouts / targetWorkouts) * 100));

  const unlockedCount = BADGES_CONFIG.filter((b) => b.check(activities)).length;

  return (
    <Box sx={{ maxWidth: 1050, mx: 'auto', p: { xs: 1.5, sm: 3 }, pb: 6 }}>
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
            <Chip label="PERSONAL TARGETS & ACHIEVEMENTS" size="small" sx={{ bgcolor: 'rgba(234, 88, 12, 0.25)', color: '#fdba74', fontWeight: 700, mb: 1 }} />
            <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: -0.5 }}>
              Goal Tracking & Trophies
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8', mt: 0.5 }}>
              Set customized weekly benchmarks, track progress dials, and unlock milestone badges
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={() => setOpenModal(true)}
            sx={{
              borderRadius: 2,
              fontWeight: 700,
              textTransform: 'none',
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)'
            }}
          >
            ⚙️ Edit Targets
          </Button>
        </Stack>
      </Paper>

      {/* Target Progress Cards */}
      <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 2 }}>
        Weekly Target Progress
      </Typography>

      <Grid2 container spacing={2.5} sx={{ mb: 4 }}>
        {/* Calorie Goal Card */}
        <Grid2 size={{ xs: 12, sm: 4 }}>
          <Card sx={{ borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#c2410c' }}>
                  🔥 Calorie Target
                </Typography>
                <Chip label={`${calProgress}%`} size="small" color={calProgress >= 100 ? 'success' : 'default'} sx={{ fontWeight: 700 }} />
              </Stack>

              <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', my: 1 }}>
                {currentCalories.toLocaleString()} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#64748b' }}>/ {targetCalories.toLocaleString()} kcal</span>
              </Typography>

              <LinearProgress
                variant="determinate"
                value={calProgress}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: '#ffedd5',
                  '& .MuiLinearProgress-bar': { bgcolor: '#ea580c', borderRadius: 4 }
                }}
              />

              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                {calProgress >= 100 ? '🎉 Goal Achieved!' : `${Math.max(0, targetCalories - currentCalories).toLocaleString()} kcal remaining`}
              </Typography>
            </CardContent>
          </Card>
        </Grid2>

        {/* Active Minutes Card */}
        <Grid2 size={{ xs: 12, sm: 4 }}>
          <Card sx={{ borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#15803d' }}>
                  ⏱️ Active Minutes Target
                </Typography>
                <Chip label={`${minProgress}%`} size="small" color={minProgress >= 100 ? 'success' : 'default'} sx={{ fontWeight: 700 }} />
              </Stack>

              <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', my: 1 }}>
                {currentMinutes} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#64748b' }}>/ {targetMinutes} min</span>
              </Typography>

              <LinearProgress
                variant="determinate"
                value={minProgress}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: '#dcfce7',
                  '& .MuiLinearProgress-bar': { bgcolor: '#16a34a', borderRadius: 4 }
                }}
              />

              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                {minProgress >= 100 ? '🎉 WHO Cardio Met!' : `${Math.max(0, targetMinutes - currentMinutes)} min remaining`}
              </Typography>
            </CardContent>
          </Card>
        </Grid2>

        {/* Workout Frequency Card */}
        <Grid2 size={{ xs: 12, sm: 4 }}>
          <Card sx={{ borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1d4ed8' }}>
                  🏃 Sessions Target
                </Typography>
                <Chip label={`${workoutProgress}%`} size="small" color={workoutProgress >= 100 ? 'success' : 'default'} sx={{ fontWeight: 700 }} />
              </Stack>

              <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', my: 1 }}>
                {currentWorkouts} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#64748b' }}>/ {targetWorkouts} sessions</span>
              </Typography>

              <LinearProgress
                variant="determinate"
                value={workoutProgress}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: '#dbeafe',
                  '& .MuiLinearProgress-bar': { bgcolor: '#2563eb', borderRadius: 4 }
                }}
              />

              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                {workoutProgress >= 100 ? '🎉 Streak Master!' : `${Math.max(0, targetWorkouts - currentWorkouts)} workouts remaining`}
              </Typography>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>

      {/* Trophy / Milestone Badges */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
          Trophy Cabinet & Badges
        </Typography>
        <Chip label={`${unlockedCount} / ${BADGES_CONFIG.length} Unlocked`} color="primary" sx={{ fontWeight: 700 }} />
      </Box>

      <Grid2 container spacing={2.5}>
        {BADGES_CONFIG.map((badge) => {
          const isUnlocked = badge.check(activities);
          const pct = badge.progress(activities);
          return (
            <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={badge.id}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  border: isUnlocked ? '2px solid #f59e0b' : '1px solid #e2e8f0',
                  bgcolor: isUnlocked ? '#fffbeb' : '#f8fafc',
                  boxShadow: isUnlocked ? '0 6px 20px rgba(245, 158, 11, 0.15)' : 'none',
                  opacity: isUnlocked ? 1 : 0.75,
                  transition: 'all 0.25s ease'
                }}
              >
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: 2.5,
                      bgcolor: isUnlocked ? '#fef3c7' : '#e2e8f0',
                      border: isUnlocked ? '1px solid #fde68a' : '1px solid #cbd5e1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.8rem',
                      filter: isUnlocked ? 'none' : 'grayscale(100%)'
                    }}
                  >
                    {badge.icon}
                  </Box>

                  <Box sx={{ flexGrow: 1 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: isUnlocked ? '#92400e' : '#334155' }}>
                        {badge.title}
                      </Typography>
                      {isUnlocked && <Chip label="UNLOCKED" size="small" color="warning" sx={{ fontSize: '0.65rem', fontWeight: 800, height: 20 }} />}
                    </Stack>

                    <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.8rem', mt: 0.5, mb: 1.5, lineHeight: 1.4 }}>
                      {badge.description}
                    </Typography>

                    <LinearProgress
                      variant="determinate"
                      value={pct}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        bgcolor: isUnlocked ? '#fde68a' : '#e2e8f0',
                        '& .MuiLinearProgress-bar': { bgcolor: isUnlocked ? '#d97706' : '#94a3b8' }
                      }}
                    />
                    <Typography variant="caption" sx={{ color: isUnlocked ? '#b45309' : '#64748b', fontWeight: 600, display: 'block', mt: 0.5 }}>
                      {isUnlocked ? 'Completed' : `${pct}% completed`}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Grid2>
          );
        })}
      </Grid2>

      {/* Target Customization Dialog */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Customize Weekly Targets</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Update your personal weekly targets to dynamically align your progress gauges.
          </Typography>
          <TextField
            fullWidth
            label="Weekly Calorie Target (kcal)"
            type="number"
            value={editCal}
            onChange={(e) => setEditCal(Number(e.target.value))}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Weekly Active Minutes Target"
            type="number"
            value={editMin}
            onChange={(e) => setEditMin(Number(e.target.value))}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Weekly Workouts Target"
            type="number"
            value={editWorkouts}
            onChange={(e) => setEditWorkouts(Number(e.target.value))}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveTargets}>
            Save Targets
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Goals;