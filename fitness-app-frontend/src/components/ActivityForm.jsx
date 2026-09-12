import React, { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  Grid2,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { addActivity } from '../services/api';

const ActivityForm = ({ onActivityAdded, onActivitiesAdded }) => {
  const [activity, setActivity] = useState({
    type: 'RUNNING',
    duration: '',
    caloriesBurned: '',
    additionalMetrics: {}
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!activity.duration || !activity.caloriesBurned) {
      setError('Please provide duration and calories burned.');
      return;
    }

    if (Number(activity.duration) <= 0 || Number(activity.caloriesBurned) <= 0) {
      setError('Duration and calories burned must be greater than 0.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await addActivity({
        type: activity.type,
        duration: Number(activity.duration),
        caloriesBurned: Number(activity.caloriesBurned),
        additionalMetrics: activity.additionalMetrics || {}
      });
      setSuccess(true);
      setActivity({ type: 'RUNNING', duration: '', caloriesBurned: '', additionalMetrics: {} });

      if (typeof onActivityAdded === 'function') {
        onActivityAdded();
      }
      if (typeof onActivitiesAdded === 'function') {
        onActivitiesAdded();
      }

      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to add activity:', err);
      setError(err?.response?.data?.message || err?.message || 'Failed to add activity. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ mb: 4, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
      <Box sx={{ p: { xs: 2, sm: 2.5 }, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 1 }}>
          <span>➕</span> Log New Workout
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Record your workout session to instantly receive personalized AI coaching insights
        </Typography>
      </Box>

      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Box component="form" onSubmit={handleSubmit}>
          {error && (
            <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2.5, borderRadius: 2 }} onClose={() => setSuccess(false)}>
              Workout logged successfully! Your AI coach is analyzing your session.
            </Alert>
          )}

          <Grid2 container spacing={2.5}>
            <Grid2 size={{ xs: 12, sm: 4 }}>
              <FormControl fullWidth>
                <InputLabel id="activity-type-label">Activity Type</InputLabel>
                <Select
                  labelId="activity-type-label"
                  value={activity.type}
                  label="Activity Type"
                  onChange={(e) => setActivity({ ...activity, type: e.target.value })}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="RUNNING">🏃 Running</MenuItem>
                  <MenuItem value="CYCLING">🚴 Cycling</MenuItem>
                  <MenuItem value="WALKING">🚶 Walking</MenuItem>
                </Select>
              </FormControl>
            </Grid2>

            <Grid2 size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                label="Duration"
                type="number"
                placeholder="e.g. 30"
                value={activity.duration}
                onChange={(e) => setActivity({ ...activity, duration: e.target.value })}
                required
                slotProps={{
                  input: {
                    endAdornment: <InputAdornment position="end">min</InputAdornment>,
                    inputProps: { min: 1, max: 1440 }
                  }
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid2>

            <Grid2 size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                label="Calories Burned"
                type="number"
                placeholder="e.g. 250"
                value={activity.caloriesBurned}
                onChange={(e) => setActivity({ ...activity, caloriesBurned: e.target.value })}
                required
                slotProps={{
                  input: {
                    endAdornment: <InputAdornment position="end">kcal</InputAdornment>,
                    inputProps: { min: 1, max: 50000 }
                  }
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid2>
          </Grid2>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                width: { xs: '100%', sm: 'auto' },
                px: 3.5,
                py: 1.2,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.95rem',
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.25)',
                '&:hover': { background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)' }
              }}
            >
              {loading ? (
                <Stack direction="row" spacing={1} alignItems="center">
                  <CircularProgress size={20} color="inherit" />
                  <span>Logging Workout...</span>
                </Stack>
              ) : (
                'Add Workout & Get AI Guide'
              )}
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ActivityForm;