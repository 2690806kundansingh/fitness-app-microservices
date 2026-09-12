import React, { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  Grid2,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography
} from '@mui/material';
import { askAICoach, generateWorkoutPlan } from '../services/api';

const QUICK_QUESTIONS = [
  'How do I optimize Zone 2 aerobic training for fat loss?',
  'What should I eat 45 minutes before a vigorous morning run?',
  'How can I increase my cycling cadence to 85+ RPM without knee pain?',
  'What is the best active recovery protocol for sore leg muscles?'
];

const AICoach = () => {
  const [tabIndex, setTabIndex] = useState(0);

  // Q&A State
  const [question, setQuestion] = useState('');
  const [coachGoal, setCoachGoal] = useState('General Endurance');
  const [coachLevel, setCoachLevel] = useState('Intermediate');
  const [coachLoading, setCoachLoading] = useState(false);
  const [coachResponse, setCoachResponse] = useState(null);
  const [coachError, setCoachError] = useState(null);

  // Plan Generator State
  const [planGoal, setPlanGoal] = useState('Fat Loss & Aerobic Conditioning');
  const [planLevel, setPlanLevel] = useState('Intermediate');
  const [planDays, setPlanDays] = useState(4);
  const [planDuration, setPlanDuration] = useState(40);
  const [planLoading, setPlanLoading] = useState(false);
  const [planResponse, setPlanResponse] = useState(null);
  const [planError, setPlanError] = useState(null);

  const handleAskCoach = async (queryText) => {
    const q = queryText || question;
    if (!q.trim()) return;

    setCoachLoading(true);
    setCoachError(null);
    try {
      const res = await askAICoach({
        question: q,
        goal: coachGoal,
        fitnessLevel: coachLevel
      });
      setCoachResponse(res.data);
    } catch (err) {
      console.error('Failed to ask AI Coach:', err);
      setCoachError('Unable to connect to Gemini AI Coach. Please try again.');
    } finally {
      setCoachLoading(false);
    }
  };

  const handleGeneratePlan = async () => {
    setPlanLoading(true);
    setPlanError(null);
    try {
      const res = await generateWorkoutPlan({
        goal: planGoal,
        fitnessLevel: planLevel,
        daysPerWeek: planDays,
        sessionMinutes: planDuration
      });
      setPlanResponse(res.data);
    } catch (err) {
      console.error('Failed to generate workout plan:', err);
      setPlanError('Unable to generate workout plan. Please try again.');
    } finally {
      setPlanLoading(false);
    }
  };

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
        <Chip label="POWERED BY GEMINI 3.5 AI" size="small" sx={{ bgcolor: 'rgba(99, 102, 241, 0.25)', color: '#a5b4fc', fontWeight: 700, mb: 1 }} />
        <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: -0.5 }}>
          AI Fitness Coach & Training Director
        </Typography>
        <Typography variant="body2" sx={{ color: '#94a3b8', mt: 0.5 }}>
          Personalized training schedules, sports physiology advice & customized weekly workout progressions
        </Typography>
      </Paper>

      {/* Tabs */}
      <Paper elevation={0} sx={{ mb: 4, borderRadius: 2.5, border: '1px solid #e2e8f0' }}>
        <Tabs
          value={tabIndex}
          onChange={(e, val) => setTabIndex(val)}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          sx={{ '& .MuiTab-root': { fontWeight: 700, textTransform: 'none', fontSize: '0.95rem', py: 2 } }}
        >
          <Tab label="📅 Weekly Training Program Generator" />
          <Tab label="💬 Interactive AI Fitness Advisor (Q&A)" />
        </Tabs>
      </Paper>

      {/* TAB 0: Training Program Generator */}
      {tabIndex === 0 && (
        <Box>
          <Card sx={{ borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.04)', mb: 4 }}>
            <Box sx={{ p: 2.5, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                Design Your Weekly Program
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Specify your objectives and let Gemini AI create a balanced, scientifically periodized schedule
              </Typography>
            </Box>

            <CardContent sx={{ p: 3 }}>
              {planError && <Alert severity="error" sx={{ mb: 3 }}>{planError}</Alert>}

              <Grid2 container spacing={2.5}>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel id="plan-goal-label">Primary Training Goal</InputLabel>
                    <Select
                      labelId="plan-goal-label"
                      value={planGoal}
                      label="Primary Training Goal"
                      onChange={(e) => setPlanGoal(e.target.value)}
                      sx={{ borderRadius: 2 }}
                    >
                      <MenuItem value="Fat Loss & Aerobic Conditioning">🔥 Fat Loss & Aerobic Conditioning</MenuItem>
                      <MenuItem value="5K Running Prep & Endurance">🏃 5K Running Prep & Endurance</MenuItem>
                      <MenuItem value="10K Progression & Threshold">⚡ 10K Progression & Threshold</MenuItem>
                      <MenuItem value="Cycling Endurance & Cadence">🚴 Cycling Endurance & Cadence</MenuItem>
                      <MenuItem value="Cardiovascular Health & Stamina">❤️ Cardiovascular Health & Stamina</MenuItem>
                    </Select>
                  </FormControl>
                </Grid2>

                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel id="plan-level-label">Fitness Experience Level</InputLabel>
                    <Select
                      labelId="plan-level-label"
                      value={planLevel}
                      label="Fitness Experience Level"
                      onChange={(e) => setPlanLevel(e.target.value)}
                      sx={{ borderRadius: 2 }}
                    >
                      <MenuItem value="Beginner">Beginner (0-6 months regular training)</MenuItem>
                      <MenuItem value="Intermediate">Intermediate (6-24 months regular training)</MenuItem>
                      <MenuItem value="Advanced">Advanced (2+ years structured training)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid2>

                <Grid2 size={{ xs: 6, sm: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel id="plan-days-label">Workouts Per Week</InputLabel>
                    <Select
                      labelId="plan-days-label"
                      value={planDays}
                      label="Workouts Per Week"
                      onChange={(e) => setPlanDays(e.target.value)}
                      sx={{ borderRadius: 2 }}
                    >
                      <MenuItem value={3}>3 Days / Week (Balanced Recovery)</MenuItem>
                      <MenuItem value={4}>4 Days / Week (Optimal Progression)</MenuItem>
                      <MenuItem value={5}>5 Days / Week (High Volume Athlete)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid2>

                <Grid2 size={{ xs: 6, sm: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel id="plan-duration-label">Session Duration</InputLabel>
                    <Select
                      labelId="plan-duration-label"
                      value={planDuration}
                      label="Session Duration"
                      onChange={(e) => setPlanDuration(e.target.value)}
                      sx={{ borderRadius: 2 }}
                    >
                      <MenuItem value={30}>30 Minutes</MenuItem>
                      <MenuItem value={40}>40 Minutes</MenuItem>
                      <MenuItem value={45}>45 Minutes</MenuItem>
                      <MenuItem value={60}>60 Minutes</MenuItem>
                    </Select>
                  </FormControl>
                </Grid2>
              </Grid2>

              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  disabled={planLoading}
                  onClick={handleGeneratePlan}
                  sx={{
                    px: 3.5,
                    py: 1.2,
                    borderRadius: 2,
                    fontWeight: 700,
                    textTransform: 'none',
                    background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                    boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)'
                  }}
                >
                  {planLoading ? (
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CircularProgress size={20} color="inherit" />
                      <span>Generating Custom Program...</span>
                    </Stack>
                  ) : (
                    '⚡ Generate AI Training Program'
                  )}
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Render Generated Plan */}
          {planResponse && (
            <Card sx={{ borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: '0 6px 24px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
              <Box sx={{ p: 3, background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', color: '#fff' }}>
                <Chip label="CUSTOM TRAINING BLUEPRINT" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff', fontWeight: 700, mb: 1 }} />
                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                  {planResponse.planTitle || 'Your Customized Weekly Program'}
                </Typography>
                <Typography variant="body2" sx={{ color: '#e0e7ff', mt: 1, lineHeight: 1.6 }}>
                  {planResponse.overview}
                </Typography>
                {planResponse.targetHeartRateZones && (
                  <Paper elevation={0} sx={{ mt: 2, p: 1.5, bgcolor: 'rgba(255,255,255,0.12)', borderRadius: 2 }}>
                    <Typography variant="caption" sx={{ color: '#cbd5e1', fontWeight: 700, textTransform: 'uppercase' }}>
                      Target Heart Rate Focus
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600 }}>
                      {planResponse.targetHeartRateZones}
                    </Typography>
                  </Paper>
                )}
              </Box>

              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 2 }}>
                  Weekly Schedule Breakdown
                </Typography>

                <Grid2 container spacing={2}>
                  {planResponse.weeklySchedule &&
                    planResponse.weeklySchedule.map((day, idx) => (
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
                            flexDirection: 'column'
                          }}
                        >
                          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                            <Chip label={day.day || `Day ${idx + 1}`} size="small" color="primary" sx={{ fontWeight: 700 }} />
                            <Chip label={`${day.duration || 40} min`} size="small" variant="outlined" sx={{ fontWeight: 600 }} />
                          </Stack>

                          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a', my: 0.5 }}>
                            {day.focus}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#2563eb', fontWeight: 600, mb: 1 }}>
                            Activity: {day.activityType} • Intensity: {day.intensity}
                          </Typography>

                          <Divider sx={{ my: 1 }} />

                          <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700 }}>
                            WARM-UP:
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#334155', mb: 1, fontSize: '0.85rem' }}>
                            {day.warmup}
                          </Typography>

                          <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700 }}>
                            MAIN SET:
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#334155', mb: 1, fontSize: '0.85rem', flexGrow: 1 }}>
                            {day.mainSet}
                          </Typography>

                          <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700 }}>
                            COOL-DOWN:
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#334155', fontSize: '0.85rem' }}>
                            {day.cooldown}
                          </Typography>
                        </Paper>
                      </Grid2>
                    ))}
                </Grid2>

                {planResponse.progressionTips && planResponse.progressionTips.length > 0 && (
                  <Box sx={{ mt: 3, p: 2.5, bgcolor: '#eff6ff', borderRadius: 2.5, border: '1px solid #bfdbfe' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1e40af', mb: 1 }}>
                      💡 Periodization & Progression Rules:
                    </Typography>
                    <Stack spacing={0.5}>
                      {planResponse.progressionTips.map((tip, i) => (
                        <Typography key={i} variant="body2" sx={{ color: '#1e3a8a' }}>
                          • {tip}
                        </Typography>
                      ))}
                    </Stack>
                  </Box>
                )}
              </CardContent>
            </Card>
          )}
        </Box>
      )}

      {/* TAB 1: Q&A Advisor */}
      {tabIndex === 1 && (
        <Box>
          <Card sx={{ borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.04)', mb: 4 }}>
            <Box sx={{ p: 2.5, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                Ask Your Sports Science Coach
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Get evidence-based answers on pacing, heart rate zones, recovery, nutrition, and workout strategy
              </Typography>
            </Box>

            <CardContent sx={{ p: 3 }}>
              {/* Quick Inquiry Chips */}
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', mb: 1 }}>
                Quick Inquiries (Click to Ask):
              </Typography>
              <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 3 }}>
                {QUICK_QUESTIONS.map((q, idx) => (
                  <Chip
                    key={idx}
                    label={q}
                    clickable
                    onClick={() => {
                      setQuestion(q);
                      handleAskCoach(q);
                    }}
                    sx={{
                      borderRadius: 2,
                      fontWeight: 500,
                      bgcolor: '#f1f5f9',
                      '&:hover': { bgcolor: '#e2e8f0', color: '#2563eb' }
                    }}
                  />
                ))}
              </Stack>

              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Ask any question about your workouts, pacing strategy, heart rate zones, or nutrition..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />

              <Box sx={{ mt: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <Stack direction="row" spacing={2}>
                  <FormControl size="small" sx={{ minWidth: 160 }}>
                    <InputLabel id="coach-goal-select">Context Goal</InputLabel>
                    <Select
                      labelId="coach-goal-select"
                      value={coachGoal}
                      label="Context Goal"
                      onChange={(e) => setCoachGoal(e.target.value)}
                    >
                      <MenuItem value="Fat Loss">Fat Loss</MenuItem>
                      <MenuItem value="Aerobic Endurance">Aerobic Endurance</MenuItem>
                      <MenuItem value="Speed & Threshold">Speed & Threshold</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl size="small" sx={{ minWidth: 140 }}>
                    <InputLabel id="coach-level-select">Level</InputLabel>
                    <Select
                      labelId="coach-level-select"
                      value={coachLevel}
                      label="Level"
                      onChange={(e) => setCoachLevel(e.target.value)}
                    >
                      <MenuItem value="Beginner">Beginner</MenuItem>
                      <MenuItem value="Intermediate">Intermediate</MenuItem>
                      <MenuItem value="Advanced">Advanced</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>

                <Button
                  variant="contained"
                  disabled={coachLoading || !question.trim()}
                  onClick={() => handleAskCoach(question)}
                  sx={{
                    px: 3.5,
                    py: 1.1,
                    borderRadius: 2,
                    fontWeight: 700,
                    textTransform: 'none',
                    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)'
                  }}
                >
                  {coachLoading ? (
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CircularProgress size={20} color="inherit" />
                      <span>Consulting Gemini AI...</span>
                    </Stack>
                  ) : (
                    'Ask AI Coach'
                  )}
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Coach Response View */}
          {coachError && <Alert severity="error" sx={{ mb: 3 }}>{coachError}</Alert>}

          {coachResponse && (
            <Card sx={{ borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
              <Box sx={{ p: 2.5, bgcolor: '#f0fdf4', borderBottom: '1px solid #bbf7d0' }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Typography sx={{ fontSize: '1.8rem' }}>🧠</Typography>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#166534' }}>
                      Coach's Recommendation
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#15803d' }}>
                      {coachResponse.headline}
                    </Typography>
                  </Box>
                </Stack>
              </Box>

              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
                  Physiological Analysis & Breakdown
                </Typography>
                <Typography variant="body2" sx={{ color: '#334155', lineHeight: 1.7, mb: 3 }}>
                  {coachResponse.explanation}
                </Typography>

                {coachResponse.actionableTips && coachResponse.actionableTips.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#2563eb', mb: 1 }}>
                      🎯 Actionable Coaching Steps:
                    </Typography>
                    <Stack spacing={1}>
                      {coachResponse.actionableTips.map((tip, i) => (
                        <Paper key={i} elevation={0} sx={{ p: 1.5, bgcolor: '#f8fafc', borderLeft: '3px solid #2563eb' }}>
                          <Typography variant="body2" sx={{ color: '#334155' }}>
                            {tip}
                          </Typography>
                        </Paper>
                      ))}
                    </Stack>
                  </Box>
                )}

                <Grid2 container spacing={2}>
                  {coachResponse.recommendedWorkout && (
                    <Grid2 size={{ xs: 12, sm: 6 }}>
                      <Paper elevation={0} sx={{ p: 2, borderRadius: 2, bgcolor: '#f5f3ff', border: '1px solid #ddd6fe' }}>
                        <Typography variant="caption" sx={{ color: '#6d28d9', fontWeight: 700, textTransform: 'uppercase' }}>
                          ⚡ Recommended Practice Drill
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#4c1d95', mt: 0.5 }}>
                          {coachResponse.recommendedWorkout}
                        </Typography>
                      </Paper>
                    </Grid2>
                  )}

                  {coachResponse.nutritionOrRecoveryTip && (
                    <Grid2 size={{ xs: 12, sm: 6 }}>
                      <Paper elevation={0} sx={{ p: 2, borderRadius: 2, bgcolor: '#fff7ed', border: '1px solid #fed7aa' }}>
                        <Typography variant="caption" sx={{ color: '#c2410c', fontWeight: 700, textTransform: 'uppercase' }}>
                          🥗 Nutrition & Recovery Tip
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#9a3412', mt: 0.5 }}>
                          {coachResponse.nutritionOrRecoveryTip}
                        </Typography>
                      </Paper>
                    </Grid2>
                  )}
                </Grid2>
              </CardContent>
            </Card>
          )}
        </Box>
      )}
    </Box>
  );
};

export default AICoach;