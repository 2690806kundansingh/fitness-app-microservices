import React, { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  CircularProgress,
  Grid2,
  Paper,
  Stack,
  Typography
} from '@mui/material';
import { useNavigate } from 'react-router';
import { getActivities, ensureValidToken } from '../services/api';

const getActivityMeta = (type) => {
  switch (type?.toUpperCase()) {
    case 'RUNNING':
      return { icon: '🏃', color: '#ea580c', bg: '#fff7ed', border: '#ffedd5' };
    case 'CYCLING':
      return { icon: '🚴', color: '#0284c7', bg: '#f0f9ff', border: '#e0f2fe' };
    case 'WALKING':
      return { icon: '🚶', color: '#16a34a', bg: '#f0fdf4', border: '#dcfce7' };
    default:
      return { icon: '⚡', color: '#7c3aed', bg: '#f5f3ff', border: '#ede9fe' };
  }
};

const ActivityList = ({ refreshTrigger }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchActivities = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getActivities();
      const list = response.data || [];
      // Sort newest first
      list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      setActivities(list);
    } catch (err) {
      console.error('Failed to fetch activities, attempting auto-reconnect:', err);
      try {
        await ensureValidToken();
        const retryRes = await getActivities();
        const retryList = retryRes.data || [];
        retryList.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        setActivities(retryList);
        setError(null);
        return;
      } catch (retryErr) {
        console.error('Auto-reconnect also failed:', retryErr);
        setError('Unable to load activities. Please check your connection or click Retry.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [refreshTrigger]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 6 }}>
        <CircularProgress size={40} thickness={4} />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Loading your activities...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert
        severity="warning"
        action={
          <Button
            color="inherit"
            size="small"
            onClick={fetchActivities}
            sx={{ fontWeight: 800, textTransform: 'none' }}
          >
            🔄 Retry Connection
          </Button>
        }
        sx={{ my: 3, borderRadius: 2.5 }}
      >
        {error}
      </Alert>
    );
  }

  if (activities.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 5,
          borderRadius: 3,
          border: '1px dashed #cbd5e1',
          bgcolor: '#f8fafc',
          textAlign: 'center',
          my: 3
        }}
      >
        <Typography sx={{ fontSize: '3rem', mb: 1 }}>🏃‍♂️</Typography>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
          No workouts logged yet
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 450, mx: 'auto', mt: 1 }}>
          Use the form above to log your first running, cycling, or walking session and receive instant AI coaching!
        </Typography>
      </Paper>
    );
  }

  const totalCalories = activities.reduce((sum, a) => sum + (Number(a.caloriesBurned) || 0), 0);
  const totalMinutes = activities.reduce((sum, a) => sum + (Number(a.duration) || 0), 0);

  return (
    <Box sx={{ mt: 2 }}>
      {/* Overview Stats Bar */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 2.5 },
          mb: 3,
          borderRadius: 3,
          bgcolor: '#fff',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
        }}
      >
        <Grid2 container spacing={2} alignItems="center">
          <Grid2 size={{ xs: 12, sm: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
              Your Workout History
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {activities.length} total recorded {activities.length === 1 ? 'session' : 'sessions'}
            </Typography>
          </Grid2>

          <Grid2 size={{ xs: 6, sm: 4 }}>
            <Box sx={{ borderLeft: { xs: 'none', sm: '2px solid #e2e8f0' }, pl: { xs: 0, sm: 2.5 } }}>
              <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
                ⏱️ Total Active Time
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#0f172a' }}>
                {totalMinutes} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#64748b' }}>mins</span>
              </Typography>
            </Box>
          </Grid2>

          <Grid2 size={{ xs: 6, sm: 4 }}>
            <Box sx={{ borderLeft: { xs: 'none', sm: '2px solid #e2e8f0' }, pl: { xs: 0, sm: 2.5 } }}>
              <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
                🔥 Total Calories
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#0f172a' }}>
                {totalCalories.toLocaleString()} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#64748b' }}>kcal</span>
              </Typography>
            </Box>
          </Grid2>
        </Grid2>
      </Paper>

      {/* Activity Cards Grid */}
      <Grid2 container spacing={2.5}>
        {activities.map((activity) => {
          const meta = getActivityMeta(activity.type);
          const burnRate = activity.duration > 0 ? (activity.caloriesBurned / activity.duration).toFixed(1) : 0;
          return (
            <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={activity.id}>
              <Card
                sx={{
                  borderRadius: 3,
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
                  transition: 'all 0.25s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 10px 24px rgba(0,0,0,0.09)',
                    borderColor: '#93c5fd'
                  }
                }}
              >
                <CardActionArea onClick={() => navigate(`/activities/${activity.id}`)} sx={{ p: 0 }}>
                  {/* Card Header with Activity Type */}
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: meta.bg,
                      borderBottom: `1px solid ${meta.border}`,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography sx={{ fontSize: '1.5rem', lineHeight: 1 }}>{meta.icon}</Typography>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: meta.color }}>
                        {activity.type}
                      </Typography>
                    </Stack>
                    <Chip label="Details &rarr;" size="small" variant="outlined" sx={{ fontWeight: 600, fontSize: '0.75rem', borderColor: meta.border, color: meta.color }} />
                  </Box>

                  <CardContent sx={{ p: 2 }}>
                    <Grid2 container spacing={1.5} sx={{ mb: 1.5 }}>
                      <Grid2 size={{ xs: 6 }}>
                        <Typography variant="caption" color="text.secondary">
                          Duration
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                          ⏱️ {activity.duration} <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#64748b' }}>min</span>
                        </Typography>
                      </Grid2>

                      <Grid2 size={{ xs: 6 }}>
                        <Typography variant="caption" color="text.secondary">
                          Calories
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                          🔥 {activity.caloriesBurned} <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#64748b' }}>kcal</span>
                        </Typography>
                      </Grid2>
                    </Grid2>

                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ pt: 1, borderTop: '1px solid #f1f5f9' }}>
                      <Typography variant="caption" color="text.secondary">
                        ⚡ {burnRate} kcal/min
                      </Typography>
                      {activity.createdAt && (
                        <Typography variant="caption" color="text.secondary">
                          {new Date(activity.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </Typography>
                      )}
                    </Stack>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid2>
          );
        })}
      </Grid2>
    </Box>
  );
};

export default ActivityList;