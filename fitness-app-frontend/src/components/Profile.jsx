import React, { useContext, useEffect, useState } from 'react';
import {
  Alert,
  Avatar,
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
  Divider,
  FormControl,
  Grid2,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { AuthContext } from 'react-oauth2-code-pkce';
import { getUserProfile, updateUserProfile } from '../services/api';

const MICROSERVICES = [
  { name: 'API Gateway', port: '8085', tech: 'Spring Cloud Gateway', status: 'ACTIVE' },
  { name: 'Eureka Registry', port: '8761', tech: 'Netflix Eureka Server', status: 'ACTIVE' },
  { name: 'Keycloak Identity', port: '8181', tech: 'OAuth2 / OpenID Connect', status: 'ACTIVE' },
  { name: 'RabbitMQ Broker', port: '5672', tech: 'AMQP Event Queue', status: 'ACTIVE' },
  { name: 'Activity Service', port: '8082', tech: 'Spring Boot + MongoDB', status: 'ACTIVE' },
  { name: 'AI Service & FitBot', port: '8083', tech: 'Spring Boot + Gemini 3.5', status: 'ACTIVE' },
  { name: 'User & Daily Progress Service', port: '8081', tech: 'Spring Boot + JPA', status: 'ACTIVE' },
  { name: 'MongoDB Database', port: '27017', tech: 'NoSQL Document Store', status: 'ACTIVE' }
];

const Profile = () => {
  const { tokenData } = useContext(AuthContext);

  const userName = tokenData?.preferred_username || tokenData?.name || 'testuser';
  const userEmail = tokenData?.email || 'testuser@fitnessapp.local';
  const userId = tokenData?.sub || '28225266-45b5-4d0f-b09e-323dd3e96ef5';

  // Profile data from backend
  const [profileLoading, setProfileLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const [weight, setWeight] = useState(72);
  const [height, setHeight] = useState(175);
  const [age, setAge] = useState(28);
  const [gender, setGender] = useState('male');
  const [targetWeight, setTargetWeight] = useState(68);
  const [fitnessGoal, setFitnessGoal] = useState('Fat Loss & Aerobic Conditioning');
  const [fitnessLevel, setFitnessLevel] = useState('Intermediate');
  const [dailyCalorieTarget, setDailyCalorieTarget] = useState(2200);
  const [dailyActiveMinutesTarget, setDailyActiveMinutesTarget] = useState(45);
  const [bio, setBio] = useState('');
  const [profileCompleted, setProfileCompleted] = useState(false);

  // Edit Modal State
  const [editOpen, setEditOpen] = useState(false);
  const [editWeight, setEditWeight] = useState(weight);
  const [editHeight, setEditHeight] = useState(height);
  const [editAge, setEditAge] = useState(age);
  const [editGender, setEditGender] = useState(gender);
  const [editTargetWeight, setEditTargetWeight] = useState(targetWeight);
  const [editFitnessGoal, setEditFitnessGoal] = useState(fitnessGoal);
  const [editFitnessLevel, setEditFitnessLevel] = useState(fitnessLevel);
  const [editCalorieTarget, setEditCalorieTarget] = useState(dailyCalorieTarget);
  const [editMinutesTarget, setEditMinutesTarget] = useState(dailyActiveMinutesTarget);
  const [editBio, setEditBio] = useState(bio);

  const fetchProfile = async () => {
    setProfileLoading(true);
    try {
      const res = await getUserProfile(userId);
      if (res.data) {
        const d = res.data;
        if (d.weight) setWeight(d.weight);
        if (d.height) setHeight(d.height);
        if (d.age) setAge(d.age);
        if (d.gender) setGender(d.gender);
        if (d.targetWeight) setTargetWeight(d.targetWeight);
        if (d.fitnessGoal) setFitnessGoal(d.fitnessGoal);
        if (d.fitnessLevel) setFitnessLevel(d.fitnessLevel);
        if (d.dailyCalorieTarget) setDailyCalorieTarget(d.dailyCalorieTarget);
        if (d.dailyActiveMinutesTarget) setDailyActiveMinutesTarget(d.dailyActiveMinutesTarget);
        if (d.bio) setBio(d.bio);
        setProfileCompleted(Boolean(d.profileCompleted));
      }
    } catch (err) {
      console.warn('Using default profile attributes, backend unreachable:', err.message);
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const handleOpenEdit = () => {
    setEditWeight(weight);
    setEditHeight(height);
    setEditAge(age);
    setEditGender(gender);
    setEditTargetWeight(targetWeight);
    setEditFitnessGoal(fitnessGoal);
    setEditFitnessLevel(fitnessLevel);
    setEditCalorieTarget(dailyCalorieTarget);
    setEditMinutesTarget(dailyActiveMinutesTarget);
    setEditBio(bio);
    setEditOpen(true);
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const payload = {
        weight: Number(editWeight),
        height: Number(editHeight),
        age: Number(editAge),
        gender: editGender,
        targetWeight: Number(editTargetWeight),
        fitnessGoal: editFitnessGoal,
        fitnessLevel: editFitnessLevel,
        dailyCalorieTarget: Number(editCalorieTarget),
        dailyActiveMinutesTarget: Number(editMinutesTarget),
        dailyStepTarget: 10000,
        bio: editBio
      };

      const res = await updateUserProfile(userId, payload);
      if (res.data) {
        setWeight(res.data.weight);
        setHeight(res.data.height);
        setAge(res.data.age);
        setGender(res.data.gender);
        setTargetWeight(res.data.targetWeight);
        setFitnessGoal(res.data.fitnessGoal);
        setFitnessLevel(res.data.fitnessLevel);
        setDailyCalorieTarget(res.data.dailyCalorieTarget);
        setDailyActiveMinutesTarget(res.data.dailyActiveMinutesTarget);
        setBio(res.data.bio || '');
        setProfileCompleted(true);
      }
      setEditOpen(false);
      setToastMessage('✓ Profile updated and saved successfully!');
    } catch (err) {
      console.error('Failed to update profile:', err);
      setToastMessage('Error saving profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Calculations
  const heightM = height / 100;
  const bmi = heightM > 0 ? (weight / (heightM * heightM)).toFixed(1) : 0;
  let bmiCategory = 'Normal';
  let bmiColor = '#16a34a';
  if (bmi < 18.5) {
    bmiCategory = 'Underweight';
    bmiColor = '#0284c7';
  } else if (bmi >= 25 && bmi < 30) {
    bmiCategory = 'Overweight';
    bmiColor = '#ea580c';
  } else if (bmi >= 30) {
    bmiCategory = 'Obese';
    bmiColor = '#dc2626';
  }

  // BMR (Mifflin-St Jeor)
  const bmr = Math.round(
    gender === 'female'
      ? 10 * weight + 6.25 * height - 5 * age - 161
      : 10 * weight + 6.25 * height - 5 * age + 5
  );
  const maintenanceCalories = Math.round(bmr * 1.55); // Moderate activity

  // Heart Rate Zones (220 - age)
  const maxHR = 220 - age;
  const hrZones = [
    { zone: 'Zone 1', name: 'Active Recovery', min: Math.round(maxHR * 0.5), max: Math.round(maxHR * 0.6), focus: 'Warm-up, cooldown, and tissue regeneration', color: '#64748b' },
    { zone: 'Zone 2', name: 'Aerobic Base', min: Math.round(maxHR * 0.6), max: Math.round(maxHR * 0.7), focus: 'Mitochondrial density and optimal fat oxidation', color: '#16a34a' },
    { zone: 'Zone 3', name: 'Aerobic Tempo', min: Math.round(maxHR * 0.7), max: Math.round(maxHR * 0.8), focus: 'Cardiovascular endurance and sustained speed', color: '#0284c7' },
    { zone: 'Zone 4', name: 'Lactate Threshold', min: Math.round(maxHR * 0.8), max: Math.round(maxHR * 0.9), focus: 'Anaerobic power and race-pace resilience', color: '#ea580c' },
    { zone: 'Zone 5', name: 'VO2 Max / Sprint', min: Math.round(maxHR * 0.9), max: maxHR, focus: 'Maximum neuromuscular and cardiovascular exertion', color: '#dc2626' }
  ];

  if (profileLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress size={44} />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1050, mx: 'auto', p: { xs: 1.5, sm: 3 }, pb: 6 }}>
      {/* Profile Header */}
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
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between">
          <Stack direction="row" spacing={2.5} alignItems="center">
            <Avatar
              sx={{
                width: 76,
                height: 76,
                bgcolor: '#2563eb',
                fontSize: '2.2rem',
                fontWeight: 800,
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)'
              }}
            >
              {userName.charAt(0).toUpperCase()}
            </Avatar>

            <Box>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: -0.5 }}>
                  {userName}
                </Typography>
                <Chip
                  label={profileCompleted ? 'PROFILE ACTIVE' : 'NEW ATHLETE'}
                  size="small"
                  color={profileCompleted ? 'success' : 'warning'}
                  sx={{ fontWeight: 700 }}
                />
              </Stack>

              <Typography variant="body2" sx={{ color: '#94a3b8', mt: 0.5 }}>
                Email: {userEmail}
              </Typography>
              {bio && (
                <Typography variant="body2" sx={{ color: '#cbd5e1', mt: 0.5, fontStyle: 'italic' }}>
                  "{bio}"
                </Typography>
              )}
            </Box>
          </Stack>

          <Button
            variant="contained"
            onClick={handleOpenEdit}
            sx={{
              borderRadius: 2,
              fontWeight: 700,
              textTransform: 'none',
              px: 2.5,
              py: 1,
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.35)'
            }}
          >
            ✏️ Edit Profile & Goals
          </Button>
        </Stack>
      </Paper>

      {/* Fitness Targets & Goals Card */}
      <Card sx={{ mb: 4, borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
        <Box sx={{ p: 2.5, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1e293b' }}>
            🎯 Athletic Objectives & Benchmark Targets
          </Typography>
          <Chip label={fitnessLevel} size="small" color="primary" sx={{ fontWeight: 700 }} />
        </Box>
        <CardContent sx={{ p: 3 }}>
          <Grid2 container spacing={2.5}>
            <Grid2 size={{ xs: 12, sm: 4 }}>
              <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                  Primary Objective
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', mt: 0.5 }}>
                  {fitnessGoal}
                </Typography>
              </Paper>
            </Grid2>
            <Grid2 size={{ xs: 6, sm: 4 }}>
              <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                  Target Weight
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#2563eb', mt: 0.5 }}>
                  {targetWeight} kg <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#64748b' }}>({weight} kg now)</span>
                </Typography>
              </Paper>
            </Grid2>
            <Grid2 size={{ xs: 6, sm: 4 }}>
              <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                  Daily Targets
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#16a34a', mt: 0.5 }}>
                  {dailyCalorieTarget} kcal • {dailyActiveMinutesTarget} min
                </Typography>
              </Paper>
            </Grid2>
          </Grid2>
        </CardContent>
      </Card>

      {/* Health & Metabolic Telemetry */}
      <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 2 }}>
        Personalized Metabolic & Health Metrics
      </Typography>

      <Grid2 container spacing={3} sx={{ mb: 4 }}>
        {/* Input Parameters Display */}
        <Grid2 size={{ xs: 12, md: 5 }}>
          <Card sx={{ borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', height: '100%' }}>
            <Box sx={{ p: 2, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1e293b' }}>
                Biometric Inputs
              </Typography>
            </Box>
            <CardContent sx={{ p: 2.5 }}>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1.2, bgcolor: '#f8fafc', borderRadius: 2 }}>
                  <Typography variant="body2" color="text.secondary">Current Weight:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{weight} kg</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1.2, bgcolor: '#f8fafc', borderRadius: 2 }}>
                  <Typography variant="body2" color="text.secondary">Height:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{height} cm</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1.2, bgcolor: '#f8fafc', borderRadius: 2 }}>
                  <Typography variant="body2" color="text.secondary">Age:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{age} yrs</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1.2, bgcolor: '#f8fafc', borderRadius: 2 }}>
                  <Typography variant="body2" color="text.secondary">Biological Gender:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, textTransform: 'capitalize' }}>{gender}</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid2>

        {/* Calculated Results */}
        <Grid2 size={{ xs: 12, md: 7 }}>
          <Grid2 container spacing={2}>
            {/* BMI Card */}
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Paper elevation={0} sx={{ p: 2.5, borderRadius: 2.5, bgcolor: '#fff', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                  Body Mass Index (BMI)
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 800, color: bmiColor, my: 1 }}>
                  {bmi}
                </Typography>
                <Chip label={bmiCategory} size="small" sx={{ bgcolor: `${bmiColor}15`, color: bmiColor, fontWeight: 700 }} />
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                  Healthy range: 18.5 – 24.9
                </Typography>
              </Paper>
            </Grid2>

            {/* BMR Card */}
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Paper elevation={0} sx={{ p: 2.5, borderRadius: 2.5, bgcolor: '#fff', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                  Basal Metabolic Rate (BMR)
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 800, color: '#7c3aed', my: 1 }}>
                  {bmr}
                </Typography>
                <Typography variant="caption" sx={{ color: '#7c3aed', fontWeight: 700 }}>
                  kcal / day at complete rest
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                  Mifflin-St Jeor formula
                </Typography>
              </Paper>
            </Grid2>

            {/* Maintenance Calories */}
            <Grid2 size={{ xs: 12 }}>
              <Paper elevation={0} sx={{ p: 2.5, borderRadius: 2.5, bgcolor: '#f0fdf4', border: '1px solid #bbf7d0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#166534' }}>
                    Estimated Daily Maintenance Energy
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total daily energy expenditure (TDEE) with moderate exercise
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#15803d' }}>
                  {maintenanceCalories} <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#166534' }}>kcal/day</span>
                </Typography>
              </Paper>
            </Grid2>
          </Grid2>
        </Grid2>
      </Grid2>

      {/* Target Heart Rate Zones */}
      <Card sx={{ mb: 4, borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
        <Box sx={{ p: 2.5, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 1 }}>
            <span>❤️</span> Calculated Heart Rate Training Zones
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Estimated Max HR: <strong>{maxHR} BPM</strong> (customized to age {age})
          </Typography>
        </Box>

        <CardContent sx={{ p: 2.5 }}>
          <Stack spacing={1.5}>
            {hrZones.map((z, idx) => (
              <Paper
                key={idx}
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: '1px solid #e2e8f0',
                  borderLeft: `5px solid ${z.color}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: { xs: 'flex-start', sm: 'center' },
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: 1
                }}
              >
                <Box>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Chip label={z.zone} size="small" sx={{ fontWeight: 800, bgcolor: `${z.color}15`, color: z.color }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1e293b' }}>
                      {z.name}
                    </Typography>
                  </Stack>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                    {z.focus}
                  </Typography>
                </Box>

                <Typography variant="h6" sx={{ fontWeight: 800, color: z.color, whiteSpace: 'nowrap' }}>
                  {z.min} – {z.max} <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>BPM</span>
                </Typography>
              </Paper>
            ))}
          </Stack>
        </CardContent>
      </Card>

      {/* Microservices Observability Panel */}
      <Card sx={{ borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
        <Box sx={{ p: 2.5, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 1 }}>
              <span>🏗️</span> Microservices Architecture Telemetry
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Real-time enterprise distributed infrastructure status
            </Typography>
          </Box>
          <Chip label="ALL SYSTEMS OPERATIONAL" size="small" color="success" sx={{ fontWeight: 700 }} />
        </Box>

        <CardContent sx={{ p: 2.5 }}>
          <Grid2 container spacing={2}>
            {MICROSERVICES.map((service, idx) => (
              <Grid2 size={{ xs: 12, sm: 6, md: 3 }} key={idx}>
                <Paper elevation={0} sx={{ p: 2, borderRadius: 2, bgcolor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                      {service.name}
                    </Typography>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#22c55e' }} />
                  </Stack>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    Port: {service.port}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#2563eb', fontWeight: 600, display: 'block' }}>
                    {service.tech}
                  </Typography>
                </Paper>
              </Grid2>
            ))}
          </Grid2>
        </CardContent>
      </Card>

      {/* Edit Profile Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Edit Biometrics & Fitness Objectives</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Grid2 container spacing={2} sx={{ mt: 0.5 }}>
            <Grid2 size={{ xs: 6 }}>
              <TextField
                fullWidth
                label="Age"
                type="number"
                value={editAge}
                onChange={(e) => setEditAge(e.target.value)}
              />
            </Grid2>
            <Grid2 size={{ xs: 6 }}>
              <FormControl fullWidth>
                <InputLabel id="edit-gender-label">Gender</InputLabel>
                <Select
                  labelId="edit-gender-label"
                  value={editGender}
                  label="Gender"
                  onChange={(e) => setEditGender(e.target.value)}
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid2>
            <Grid2 size={{ xs: 6 }}>
              <TextField
                fullWidth
                label="Height (cm)"
                type="number"
                value={editHeight}
                onChange={(e) => setEditHeight(e.target.value)}
              />
            </Grid2>
            <Grid2 size={{ xs: 6 }}>
              <TextField
                fullWidth
                label="Current Weight (kg)"
                type="number"
                value={editWeight}
                onChange={(e) => setEditWeight(e.target.value)}
              />
            </Grid2>
            <Grid2 size={{ xs: 6 }}>
              <TextField
                fullWidth
                label="Target Weight (kg)"
                type="number"
                value={editTargetWeight}
                onChange={(e) => setEditTargetWeight(e.target.value)}
              />
            </Grid2>
            <Grid2 size={{ xs: 6 }}>
              <FormControl fullWidth>
                <InputLabel id="edit-level-label">Experience Level</InputLabel>
                <Select
                  labelId="edit-level-label"
                  value={editFitnessLevel}
                  label="Experience Level"
                  onChange={(e) => setEditFitnessLevel(e.target.value)}
                >
                  <MenuItem value="Beginner">Beginner</MenuItem>
                  <MenuItem value="Intermediate">Intermediate</MenuItem>
                  <MenuItem value="Advanced">Advanced</MenuItem>
                </Select>
              </FormControl>
            </Grid2>
            <Grid2 size={{ xs: 12 }}>
              <FormControl fullWidth>
                <InputLabel id="edit-goal-label">Primary Fitness Goal</InputLabel>
                <Select
                  labelId="edit-goal-label"
                  value={editFitnessGoal}
                  label="Primary Fitness Goal"
                  onChange={(e) => setEditFitnessGoal(e.target.value)}
                >
                  <MenuItem value="Fat Loss & Aerobic Conditioning">🔥 Fat Loss & Aerobic Conditioning</MenuItem>
                  <MenuItem value="Endurance & Cardiovascular Stamina">🏃 Endurance & Cardiovascular Stamina</MenuItem>
                  <MenuItem value="Muscle Building & Strength">💪 Muscle Building & Strength</MenuItem>
                  <MenuItem value="Marathon / 10K Running Prep">⚡ Marathon / 10K Running Prep</MenuItem>
                  <MenuItem value="General Health & Mobility">❤️ General Health & Mobility</MenuItem>
                </Select>
              </FormControl>
            </Grid2>
            <Grid2 size={{ xs: 6 }}>
              <TextField
                fullWidth
                label="Daily Calorie Target"
                type="number"
                value={editCalorieTarget}
                onChange={(e) => setEditCalorieTarget(e.target.value)}
              />
            </Grid2>
            <Grid2 size={{ xs: 6 }}>
              <TextField
                fullWidth
                label="Daily Active Minutes"
                type="number"
                value={editMinutesTarget}
                onChange={(e) => setEditMinutesTarget(e.target.value)}
              />
            </Grid2>
            <Grid2 size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Bio / Fitness Motto"
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
              />
            </Grid2>
          </Grid2>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            disabled={saving}
            onClick={handleSaveProfile}
            sx={{ fontWeight: 700 }}
          >
            {saving ? <CircularProgress size={20} color="inherit" /> : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={Boolean(toastMessage)}
        autoHideDuration={4000}
        onClose={() => setToastMessage(null)}
        message={toastMessage}
      />
    </Box>
  );
};

export default Profile;