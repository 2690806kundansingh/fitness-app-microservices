import React, { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid2,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography
} from '@mui/material';
import { updateUserProfile } from '../services/api';

const STEPS = ['Biometrics', 'Fitness Goals', 'Review & Confirm'];

const OnboardingModal = ({ open, onClose, userId, onProfileSaved, initialEmail = '' }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form State
  const [age, setAge] = useState(26);
  const [gender, setGender] = useState('male');
  const [height, setHeight] = useState(175);
  const [weight, setWeight] = useState(72);
  const [targetWeight, setTargetWeight] = useState(68);
  const [fitnessGoal, setFitnessGoal] = useState('Fat Loss & Aerobic Conditioning');
  const [fitnessLevel, setFitnessLevel] = useState('Beginner');
  const [dailyCalorieTarget, setDailyCalorieTarget] = useState(2200);
  const [dailyActiveMinutesTarget, setDailyActiveMinutesTarget] = useState(40);
  const [bio, setBio] = useState('Excited to start my fitness transformation with FitPulse AI!');

  // Calculations
  const heightM = height / 100;
  const bmi = heightM > 0 ? (weight / (heightM * heightM)).toFixed(1) : 0;
  const bmr = Math.round(
    gender === 'female'
      ? 10 * weight + 6.25 * height - 5 * age - 161
      : 10 * weight + 6.25 * height - 5 * age + 5
  );
  const tdee = Math.round(bmr * 1.55);

  const handleNext = () => {
    if (activeStep < STEPS.length - 1) {
      setActiveStep((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        age: Number(age),
        gender,
        height: Number(height),
        weight: Number(weight),
        targetWeight: Number(targetWeight),
        fitnessGoal,
        fitnessLevel,
        dailyCalorieTarget: Number(dailyCalorieTarget),
        dailyStepTarget: 10000,
        dailyActiveMinutesTarget: Number(dailyActiveMinutesTarget),
        bio
      };

      const res = await updateUserProfile(userId, payload);
      if (onProfileSaved) {
        onProfileSaved(res.data);
      }
      onClose();
    } catch (err) {
      console.error('Failed to complete onboarding:', err);
      const serverMsg = err.response?.data?.message || err.response?.data?.error;
      const status = err.response?.status;
      if (status === 404) {
        setError('User service profile endpoint returned 404. Please restart User Service so the new endpoints take effect.');
      } else if (serverMsg) {
        setError(`Unable to save profile (${serverMsg}). Please check and try again.`);
      } else {
        setError('Unable to save your profile. Please ensure User Service (port 8081) is restarted and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        // Prevent accidental dismiss on backdrop click during initial setup
        if (reason === 'backdropClick') return;
        onClose();
      }}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3.5,
            p: { xs: 1, sm: 2 },
            boxShadow: '0 20px 60px rgba(15, 23, 42, 0.25)'
          }
        }
      }}
    >
      <DialogTitle sx={{ pb: 1, pt: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
            }}
          >
            ⚡
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a' }}>
              Welcome to FitPulse AI!
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {initialEmail
                ? `Customizing training & recommendations for ${initialEmail}`
                : "Let's customize your profile for personalized AI training & recommendations."}
            </Typography>
          </Box>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ pt: 2.5 }}>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3.5 }}>
          {STEPS.map((label) => (
            <Step key={label}>
              <StepLabel sx={{ '& .MuiStepLabel-label': { fontWeight: 700, fontSize: '0.85rem' } }}>
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && <Alert severity="error" sx={{ mb: 2.5 }}>{error}</Alert>}

        {/* STEP 0: Biometrics */}
        {activeStep === 0 && (
          <Stack spacing={2.5}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#334155' }}>
              Enter your basic physical measurements:
            </Typography>

            <Grid2 container spacing={2}>
              <Grid2 size={{ xs: 6 }}>
                <TextField
                  fullWidth
                  label="Age"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  slotProps={{ input: { endAdornment: <InputAdornment position="end">yrs</InputAdornment> } }}
                />
              </Grid2>
              <Grid2 size={{ xs: 6 }}>
                <FormControl fullWidth>
                  <InputLabel id="gender-select-label">Biological Gender</InputLabel>
                  <Select
                    labelId="gender-select-label"
                    value={gender}
                    label="Biological Gender"
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Other / Non-binary</MenuItem>
                  </Select>
                </FormControl>
              </Grid2>
              <Grid2 size={{ xs: 6 }}>
                <TextField
                  fullWidth
                  label="Height"
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  slotProps={{ input: { endAdornment: <InputAdornment position="end">cm</InputAdornment> } }}
                />
              </Grid2>
              <Grid2 size={{ xs: 6 }}>
                <TextField
                  fullWidth
                  label="Current Weight"
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  slotProps={{ input: { endAdornment: <InputAdornment position="end">kg</InputAdornment> } }}
                />
              </Grid2>
              <Grid2 size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Target Weight Goal"
                  type="number"
                  value={targetWeight}
                  onChange={(e) => setTargetWeight(e.target.value)}
                  slotProps={{ input: { endAdornment: <InputAdornment position="end">kg</InputAdornment> } }}
                  helperText="Your ideal target weight to guide workout recommendations"
                />
              </Grid2>
            </Grid2>
          </Stack>
        )}

        {/* STEP 1: Fitness Goals */}
        {activeStep === 1 && (
          <Stack spacing={2.5}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#334155' }}>
              Define your training aspirations and target levels:
            </Typography>

            <FormControl fullWidth>
              <InputLabel id="goal-select-label">Primary Fitness Goal</InputLabel>
              <Select
                labelId="goal-select-label"
                value={fitnessGoal}
                label="Primary Fitness Goal"
                onChange={(e) => setFitnessGoal(e.target.value)}
              >
                <MenuItem value="Fat Loss & Aerobic Conditioning">🔥 Fat Loss & Aerobic Conditioning</MenuItem>
                <MenuItem value="Endurance & Cardiovascular Stamina">🏃 Endurance & Cardiovascular Stamina</MenuItem>
                <MenuItem value="Muscle Building & Strength">💪 Muscle Building & Strength</MenuItem>
                <MenuItem value="Marathon / 10K Running Prep">⚡ Marathon / 10K Running Prep</MenuItem>
                <MenuItem value="General Health & Mobility">❤️ General Health & Mobility</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel id="level-select-label">Fitness Experience Level</InputLabel>
              <Select
                labelId="level-select-label"
                value={fitnessLevel}
                label="Fitness Experience Level"
                onChange={(e) => setFitnessLevel(e.target.value)}
              >
                <MenuItem value="Beginner">Beginner (Starting fresh or returning after hiatus)</MenuItem>
                <MenuItem value="Intermediate">Intermediate (Consistent training 6+ months)</MenuItem>
                <MenuItem value="Advanced">Advanced (Dedicated structured athlete 2+ years)</MenuItem>
              </Select>
            </FormControl>

            <Grid2 container spacing={2}>
              <Grid2 size={{ xs: 6 }}>
                <TextField
                  fullWidth
                  label="Daily Calorie Burn Target"
                  type="number"
                  value={dailyCalorieTarget}
                  onChange={(e) => setDailyCalorieTarget(e.target.value)}
                  slotProps={{ input: { endAdornment: <InputAdornment position="end">kcal</InputAdornment> } }}
                />
              </Grid2>
              <Grid2 size={{ xs: 6 }}>
                <TextField
                  fullWidth
                  label="Daily Active Minutes Target"
                  type="number"
                  value={dailyActiveMinutesTarget}
                  onChange={(e) => setDailyActiveMinutesTarget(e.target.value)}
                  slotProps={{ input: { endAdornment: <InputAdornment position="end">min</InputAdornment> } }}
                />
              </Grid2>
            </Grid2>

            <TextField
              fullWidth
              multiline
              rows={2}
              label="Bio / Fitness Motto"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </Stack>
        )}

        {/* STEP 2: Review & Confirm */}
        {activeStep === 2 && (
          <Stack spacing={2.5}>
            <Paper elevation={0} sx={{ p: 2.5, bgcolor: '#f8fafc', borderRadius: 2.5, border: '1px solid #e2e8f0' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a', mb: 1.5 }}>
                Your Personalized Metabolic Baseline:
              </Typography>

              <Grid2 container spacing={2} sx={{ mb: 2 }}>
                <Grid2 size={{ xs: 4 }}>
                  <Paper elevation={0} sx={{ p: 1.5, textAlign: 'center', bgcolor: '#eff6ff', borderRadius: 2 }}>
                    <Typography variant="caption" sx={{ color: '#1e40af', fontWeight: 700 }}>BMI</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#1d4ed8' }}>{bmi}</Typography>
                  </Paper>
                </Grid2>
                <Grid2 size={{ xs: 4 }}>
                  <Paper elevation={0} sx={{ p: 1.5, textAlign: 'center', bgcolor: '#f5f3ff', borderRadius: 2 }}>
                    <Typography variant="caption" sx={{ color: '#6d28d9', fontWeight: 700 }}>BMR</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#7c3aed' }}>{bmr}</Typography>
                  </Paper>
                </Grid2>
                <Grid2 size={{ xs: 4 }}>
                  <Paper elevation={0} sx={{ p: 1.5, textAlign: 'center', bgcolor: '#f0fdf4', borderRadius: 2 }}>
                    <Typography variant="caption" sx={{ color: '#166534', fontWeight: 700 }}>TDEE</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#15803d' }}>{tdee}</Typography>
                  </Paper>
                </Grid2>
              </Grid2>

              <Stack spacing={1}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Primary Goal:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{fitnessGoal}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Target Level:</Typography>
                  <Chip label={fitnessLevel} size="small" color="primary" sx={{ fontWeight: 700 }} />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Target Weight:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{targetWeight} kg (from {weight} kg)</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Daily Targets:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{dailyCalorieTarget} kcal • {dailyActiveMinutesTarget} min</Typography>
                </Box>
              </Stack>
            </Paper>

            <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', display: 'block' }}>
              Your profile can be edited at any time in the <strong>Health Profile</strong> tab.
            </Typography>
          </Stack>
        )}

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            disabled={activeStep === 0 || loading}
            onClick={handleBack}
            sx={{ fontWeight: 600, textTransform: 'none' }}
          >
            Back
          </Button>

          <Button
            variant="contained"
            disabled={loading}
            onClick={handleNext}
            sx={{
              px: 3.5,
              py: 1,
              borderRadius: 2,
              fontWeight: 700,
              textTransform: 'none',
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)'
            }}
          >
            {loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : activeStep === STEPS.length - 1 ? (
              '🚀 Complete Setup & Start'
            ) : (
              'Next Step &rarr;'
            )}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingModal;
