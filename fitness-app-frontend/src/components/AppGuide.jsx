import React, { useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid2,
  Paper,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Typography
} from '@mui/material';
import { useNavigate } from 'react-router';

const STEPS = [
  {
    step: 1,
    title: 'Secure Authentication & Account Setup',
    subtitle: 'Enterprise-grade Keycloak OAuth2 / OpenID Connect Single Sign-On',
    icon: '🔐',
    badge: 'Step 1 • Getting Started',
    badgeColor: '#2563eb',
    description:
      'Log in seamlessly using dual-mode authentication: 1-Click Fast Login, direct in-page credentials, or enterprise Keycloak single sign-on. Your account, credentials, and authentication tokens are securely managed across microservices.',
    instructions: [
      'Click "⚡ 1-Click Fast Login (testuser)" for instant access with pre-configured credentials (username: "testuser", password: "password123").',
      'Or enter your custom username/password directly into the in-page credentials form.',
      'Alternatively, click "Keycloak SSO Redirect" for full OAuth2 OpenID Connect Single Sign-On flow.',
      'Upon first sign-in, the API Gateway automatically provisions your profile in the User Microservice via reactive filter synchronization.'
    ],
    proTip: 'Keycloak runs in Docker on port 8181. A live status badge indicates whether Keycloak is online or offline, with instant demo access always available.'
  },
  {
    step: 2,
    title: 'Biometric Onboarding & Metabolic Baseline',
    subtitle: 'Calculate your exact BMR, TDEE, BMI, and Max Heart Rate zones',
    icon: '⚡',
    badge: 'Step 2 • Personalization',
    badgeColor: '#7c3aed',
    description:
      'The 3-step Onboarding Modal prompts you to input your physical attributes and fitness aspirations to customize the Gemini AI coaching model.',
    instructions: [
      'Enter your Age, Biological Gender, Height (cm), Current Weight (kg), and Target Weight (kg).',
      'Select your Primary Fitness Goal (e.g. Fat Loss, Endurance Conditioning, Muscle Building, Marathon Prep).',
      'Choose your Fitness Experience Level (Beginner, Intermediate, Advanced).',
      'Review your calculated BMR (Basal Metabolic Rate via Mifflin-St Jeor formula), TDEE (Total Daily Energy Expenditure), and BMI.',
      'Click "Complete Setup & Start" to activate your personalized AI recommendation profile.'
    ],
    proTip: 'You can update your biometrics anytime under the "Health Profile" tab as you lose weight or increase your fitness goals.'
  },
  {
    step: 3,
    title: 'Logging Workouts & Activity Telemetry',
    subtitle: 'Track running, cycling, walking, swimming & strength sessions',
    icon: '🏃',
    badge: 'Step 3 • Daily Training',
    badgeColor: '#059669',
    description:
      'Record your workout sessions with detailed telemetry including distance, duration, intensity levels, and calories burned.',
    instructions: [
      'Navigate to the "Workouts" tab and fill out the Activity Form.',
      'Select the exercise type (Running, Cycling, Walking, Swimming, Gym/HIIT).',
      'Enter duration (minutes), distance (km or miles), calories burned, and subjective exertion rating.',
      'Submit the workout: The Activity Service saves the record and publishes an event to RabbitMQ message broker for asynchronous processing.'
    ],
    proTip: 'All logged workouts automatically update your "Today\'s Progress" gauge on the dashboard in real time.'
  },
  {
    step: 4,
    title: 'Gemini AI Coaching & Smart Recommendations',
    subtitle: 'Deep-dive session evaluations, pacing advice & personalized plans',
    icon: '🤖',
    badge: 'Step 4 • AI Guidance',
    badgeColor: '#ea580c',
    description:
      'Every workout is analyzed by Google Gemini AI to deliver personalized coaching insights, recovery recommendations, and next workout suggestions.',
    instructions: [
      'Open any completed workout in the "Workouts" list or click into Activity Detail.',
      'View the instant AI Evaluation: pacing consistency, cardiovascular strain, and recovery suggestions.',
      'Visit the "AI Coach" tab to request customized multi-week training plans tailored to your specific biometrics and race/physique goals.'
    ],
    proTip: 'If your schedule changes, ask the AI Coach to adapt your weekly volume, adjust rest intervals, or program low-impact alternatives.'
  },
  {
    step: 5,
    title: 'Daily Progress & Consistency Streak Hub',
    subtitle: 'Log water intake, sleep hours, mood & maintain your streak',
    icon: '🔥',
    badge: 'Step 5 • Habit Tracking',
    badgeColor: '#dc2626',
    description:
      'Consistency is the #1 predictor of long-term fitness success. The Daily Check-in hub ensures you track total wellness beyond just workouts.',
    instructions: [
      'Navigate to the "Daily Check-in" tab each morning or evening.',
      'Track your Hydration: use the quick "+250 ml (Glass)" or "+500 ml (Bottle)" buttons towards your 2,500 ml goal.',
      'Log last night\'s Sleep duration with the interactive slider (4 to 12 hours).',
      'Select your Readiness & Mood (Energetic, Focused, Normal, Fatigued, Sore).',
      'Check off your Daily Habits: Healthy hydration, pre-workout warm-up, balanced nutrition, active recovery.',
      'Add training reflection notes and click "Complete Daily Check-in & Keep Streak" to increment your consecutive streak!'
    ],
    proTip: 'A single daily check-in locks in your consistency streak for the day. Check-ins are highlighted with the "✓ Checked In Today" badge.'
  },
  {
    step: 6,
    title: 'FitBot AI Companion & In-App Notification Center',
    subtitle: '24/7 conversational sports trainer & real-time workout alerts',
    icon: '💬',
    badge: 'Step 6 • Engagement & Alerts',
    badgeColor: '#0284c7',
    description:
      'FitBot AI is your pocket sports scientist. Accompanied by the In-App Notification Center, you never miss a training milestone.',
    instructions: [
      'Click the floating "💬 Chat with FitBot" button at the bottom-right corner of any screen.',
      'Ask any question: "What should I eat post-workout?", "Give me a 20-min HIIT circuit", or "How should I pace a 10K run?".',
      'Use interactive Quick Reply suggestions to explore workout and nutrition guidance.',
      'Check the Bell Icon (🔔) in the navigation header to view real-time unread workout summaries, streak milestones, and coaching tips.',
      'Click "Mark all as read" to manage your notification feed.'
    ],
    proTip: 'FitBot maintains conversation context and tailors its responses to your specific fitness level and daily check-in stats.'
  }
];

const COMPARISONS = [
  {
    feature: 'AI Coaching & Workout Generation',
    fitPulse: 'Google Gemini Generative AI dynamically creates personalized workouts, pacing strategies & nutrition tips based on your live biometrics.',
    others: 'Pre-recorded static videos or generic template workouts with no real-time adaptation.',
    advantage: 'Truly personalized to your body, energy levels & target goals'
  },
  {
    feature: 'Metabolic & Biometric Engine',
    fitPulse: 'Clinical Mifflin-St Jeor equation calculates exact BMR, TDEE maintenance calories, BMI, and Karvonen heart rate zones.',
    others: 'Oversimplified estimations or fixed generic 2,000 kcal recommendations for all users.',
    advantage: 'Scientifically accurate caloric targets and heart rate pacing'
  },
  {
    feature: 'Holistic Daily Wellness & Streaks',
    fitPulse: 'All-in-one check-in tracking hydration (+250ml/500ml quick add), sleep telemetry, mood/readiness, habit checklists & streaks.',
    others: 'Segmented across multiple apps (one for water, one for sleep, another for workouts).',
    advantage: 'Single unified dashboard for comprehensive physical and mental wellness'
  },
  {
    feature: 'Interactive FitBot Companion',
    fitPulse: '24/7 conversational sports science assistant with instant follow-ups, workout builders, and nutritional advice.',
    others: 'No conversational intelligence; static FAQ pages or paid human coaching delays.',
    advantage: 'Instant, expert-level feedback whenever you need motivation or workout tweaks'
  },
  {
    feature: 'Enterprise Architecture & Reliability',
    fitPulse: 'Spring Cloud Microservices (Eureka, Gateway, Config Server, RabbitMQ, PostgreSQL, MongoDB, React).',
    others: 'Monolithic servers prone to outages, vendor lock-in, and delayed synchronization.',
    advantage: 'High availability, resilient microservices, and zero single-point-of-failure'
  },
  {
    feature: 'Data Security & Authentication',
    fitPulse: 'Keycloak OAuth2 / OpenID Connect enterprise identity provider with JWT token encryption.',
    others: 'Proprietary login systems vulnerable to data leaks and third-party advertising tracking.',
    advantage: 'Bank-grade enterprise security and strict user privacy isolation'
  }
];

const ADVANTAGES = [
  {
    title: 'Adaptive Gemini AI Intelligence',
    icon: '🧠',
    color: '#2563eb',
    summary: 'No two bodies are identical. FitPulse AI crafts custom advice tailored to your exact recovery status, recent fatigue, and targets.'
  },
  {
    title: 'Clinically Proven Formulas',
    icon: '📐',
    color: '#7c3aed',
    summary: 'Built on Mifflin-St Jeor metabolic math and Karvonen cardiovascular formulas for precision calorie targets and heart rate training.'
  },
  {
    title: 'Asynchronous Event Pipeline',
    icon: '⚡',
    color: '#059669',
    summary: 'RabbitMQ event bus decouples workout logging from AI processing, ensuring instantaneous UI responsiveness without lag.'
  },
  {
    title: 'Dual-Database Polyglot Persistence',
    icon: '🗄️',
    color: '#d97706',
    summary: 'PostgreSQL for relational biometric integrity and MongoDB for lightning-fast conversation history and notification streaming.'
  },
  {
    title: 'Behavioral Consistency Streaks',
    icon: '🔥',
    color: '#ea580c',
    summary: 'Gamified streak counter reinforces positive habit loops for hydration, sleep, exercise, and mental readiness.'
  },
  {
    title: '24/7 FitBot Assistant at Your Fingertips',
    icon: '💬',
    color: '#0284c7',
    summary: 'Floating companion ready on every screen to answer sports nutrition questions, adjust routines, and keep you inspired.'
  }
];

const FAQS = [
  {
    q: 'How does FitPulse AI calculate my daily calorie and metabolic burn targets?',
    a: 'FitPulse AI uses the gold-standard Mifflin-St Jeor equation: BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) + 5 (for males) or -161 (for females). Your Total Daily Energy Expenditure (TDEE) is then calculated using physical activity multipliers to establish your maintenance, surplus, or deficit targets.'
  },
  {
    q: 'What makes FitPulse AI different from standard fitness trackers like Strava or MyFitnessPal?',
    a: 'Traditional apps merely log historical data. FitPulse AI combines historical logging with Google Gemini AI generative coaching, an interactive 24/7 sports nutritionist chatbot (FitBot), holistic daily wellness telemetry (sleep, hydration, mood), and an enterprise microservice architecture for supreme reliability.'
  },
  {
    q: 'How does the Daily Consistency Streak work?',
    a: 'Every day that you complete your daily check-in (logging hydration, sleep, mood, and wellness habits), your current streak increments by 1. If you miss a day, the system gives you a 24-hour grace window to log your previous day before resetting the active streak count.'
  },
  {
    q: 'Can I use FitBot AI without logging a workout?',
    a: 'Yes! FitBot is accessible from any screen via the floating bottom-right chat widget. You can ask for quick stretch routines, nutrition advice, macro breakdowns, or motivational boosts at any time.'
  },
  {
    q: 'How is my private health and biometric data secured?',
    a: 'All authentication and token management is handled by Keycloak OAuth2 / OpenID Connect. Requests are validated via encrypted JWT tokens through the Spring Cloud API Gateway, and user biometrics are stored in isolated databases with no third-party ad tracking.'
  }
];

const AppGuide = ({ onStartClick }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const navigate = useNavigate();

  const handleStart = () => {
    if (onStartClick) {
      onStartClick();
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, sm: 5 }, pb: 8 }}>
      {/* Hero Banner */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 5 },
          mb: 4,
          borderRadius: 3.5,
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, #2563eb 100%)',
          color: '#fff',
          boxShadow: '0 20px 50px rgba(15, 23, 42, 0.25)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ maxWidth: 780, position: 'relative', zIndex: 1 }}>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
            <Chip
              label="COMPLETE USER MANUAL & SYSTEM GUIDE"
              size="small"
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.15)',
                color: '#93c5fd',
                fontWeight: 800,
                fontSize: '0.75rem',
                letterSpacing: 0.8,
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            />
            <Chip
              label="VERSION 2.0 AI-POWERED"
              size="small"
              sx={{ bgcolor: '#16a34a', color: '#fff', fontWeight: 800, fontSize: '0.7rem' }}
            />
          </Stack>

          <Typography
            variant="h3"
            sx={{
              fontWeight: 900,
              letterSpacing: -1,
              lineHeight: 1.15,
              mb: 2,
              fontSize: { xs: '2rem', sm: '2.8rem' }
            }}
          >
            How FitPulse <span style={{ color: '#60a5fa' }}>AI</span> Works & Why It Outperforms Traditional Apps
          </Typography>

          <Typography variant="body1" sx={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: 1.7, mb: 3 }}>
            Welcome to the future of intelligent athletic conditioning. FitPulse AI combines clinical sports
            science equations with Google Gemini generative intelligence, microservices scalability, and holistic
            habit tracking. Read the complete guide below to master every feature.
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Button
              variant="contained"
              size="large"
              onClick={handleStart}
              sx={{
                bgcolor: '#2563eb',
                px: 4,
                py: 1.2,
                borderRadius: 2.5,
                fontWeight: 800,
                textTransform: 'none',
                boxShadow: '0 4px 16px rgba(37, 99, 235, 0.4)',
                '&:hover': { bgcolor: '#1d4ed8' }
              }}
            >
              🚀 Launch Application Dashboard
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => setTabIndex(1)}
              sx={{
                color: '#fff',
                borderColor: 'rgba(255, 255, 255, 0.4)',
                px: 3,
                borderRadius: 2.5,
                fontWeight: 700,
                textTransform: 'none',
                '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255, 255, 255, 0.08)' }
              }}
            >
              ⚡ Compare with Other Apps
            </Button>
          </Stack>
        </Box>
      </Paper>

      {/* Navigation Tabs */}
      <Paper elevation={0} sx={{ borderRadius: 3, mb: 4, bgcolor: '#ffffff', border: '1px solid #e2e8f0' }}>
        <Tabs
          value={tabIndex}
          onChange={(e, val) => setTabIndex(val)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            px: 2,
            '& .MuiTab-root': {
              fontWeight: 700,
              fontSize: '0.95rem',
              py: 2,
              textTransform: 'none'
            }
          }}
        >
          <Tab label="📖 Step-by-Step User Instructions" />
          <Tab label="⚖️ Advantages vs Traditional Apps" />
          <Tab label="🌟 Architectural & Scientific Features" />
          <Tab label="❓ Frequently Asked Questions" />
        </Tabs>
      </Paper>

      {/* TAB 0: Step-by-Step Instructions */}
      {tabIndex === 0 && (
        <Stack spacing={3.5}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', mb: 0.5 }}>
              Step-by-Step Guide: How to Use FitPulse AI
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Follow these 6 structured steps to optimize your daily training, track habits, and leverage AI coaching.
            </Typography>
          </Box>

          <Grid2 container spacing={3}>
            {STEPS.map((step) => (
              <Grid2 size={{ xs: 12 }} key={step.step}>
                <Card
                  sx={{
                    borderRadius: 3.5,
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                    overflow: 'hidden',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      boxShadow: '0 10px 30px rgba(0,0,0,0.07)',
                      borderColor: '#cbd5e1'
                    }
                  }}
                >
                  <Box
                    sx={{
                      p: { xs: 2, sm: 2.5 },
                      bgcolor: '#f8fafc',
                      borderBottom: '1px solid #e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: 1.5
                    }}
                  >
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: 2.5,
                          bgcolor: '#eff6ff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.4rem'
                        }}
                      >
                        {step.icon}
                      </Box>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>
                          {step.title}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                          {step.subtitle}
                        </Typography>
                      </Box>
                    </Stack>

                    <Chip
                      label={step.badge}
                      size="small"
                      sx={{
                        fontWeight: 800,
                        bgcolor: step.badgeColor,
                        color: '#fff',
                        fontSize: '0.75rem'
                      }}
                    />
                  </Box>

                  <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
                    <Typography variant="body2" sx={{ color: '#334155', mb: 2.5, lineHeight: 1.7, fontSize: '0.95rem' }}>
                      {step.description}
                    </Typography>

                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1e293b', mb: 1.5 }}>
                      Actionable Instructions:
                    </Typography>

                    <Stack spacing={1.2} sx={{ mb: 3 }}>
                      {step.instructions.map((inst, idx) => (
                        <Box
                          key={idx}
                          sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 1.5,
                            p: 1.2,
                            borderRadius: 2,
                            bgcolor: '#f8fafc'
                          }}
                        >
                          <Box
                            sx={{
                              width: 22,
                              height: 22,
                              borderRadius: '50%',
                              bgcolor: '#2563eb',
                              color: '#fff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.75rem',
                              fontWeight: 800,
                              flexShrink: 0,
                              mt: 0.2
                            }}
                          >
                            {idx + 1}
                          </Box>
                          <Typography variant="body2" sx={{ color: '#334155', fontWeight: 500 }}>
                            {inst}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>

                    <Paper
                      elevation={0}
                      sx={{
                        p: 1.8,
                        borderRadius: 2.5,
                        bgcolor: '#fefce8',
                        border: '1px solid #fef08a',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5
                      }}
                    >
                      <Typography sx={{ fontSize: '1.2rem' }}>💡</Typography>
                      <Typography variant="caption" sx={{ color: '#854d0e', fontWeight: 700, lineHeight: 1.5 }}>
                        <strong>PRO TIP:</strong> {step.proTip}
                      </Typography>
                    </Paper>
                  </CardContent>
                </Card>
              </Grid2>
            ))}
          </Grid2>
        </Stack>
      )}

      {/* TAB 1: Advantages vs Other Apps */}
      {tabIndex === 1 && (
        <Stack spacing={4}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', mb: 0.5 }}>
              Feature Comparison: FitPulse AI vs Traditional Fitness Apps
            </Typography>
            <Typography variant="body2" color="text.secondary">
              See why leading athletes and fitness enthusiasts choose FitPulse AI over legacy tracking tools.
            </Typography>
          </Box>

          <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3.5, border: '1px solid #e2e8f0' }}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead sx={{ bgcolor: '#0f172a' }}>
                <TableRow>
                  <TableCell sx={{ color: '#fff', fontWeight: 800, width: '22%' }}>Capability / Feature</TableCell>
                  <TableCell sx={{ color: '#60a5fa', fontWeight: 800, width: '32%' }}>⚡ FitPulse AI (Our Platform)</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 800, width: '26%' }}>📱 Traditional Fitness Apps</TableCell>
                  <TableCell sx={{ color: '#34d399', fontWeight: 800, width: '20%' }}>Key Advantage</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {COMPARISONS.map((row, idx) => (
                  <TableRow
                    key={row.feature}
                    sx={{
                      bgcolor: idx % 2 === 0 ? '#ffffff' : '#f8fafc',
                      '&:hover': { bgcolor: '#f1f5f9' }
                    }}
                  >
                    <TableCell sx={{ fontWeight: 700, color: '#1e293b' }}>
                      {row.feature}
                    </TableCell>
                    <TableCell sx={{ color: '#1d4ed8', fontWeight: 600, fontSize: '0.9rem', lineHeight: 1.6 }}>
                      {row.fitPulse}
                    </TableCell>
                    <TableCell sx={{ color: '#64748b', fontSize: '0.85rem', lineHeight: 1.6 }}>
                      {row.others}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={row.advantage}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          bgcolor: '#ecfdf5',
                          color: '#065f46',
                          border: '1px solid #a7f3d0',
                          fontSize: '0.75rem',
                          height: 'auto',
                          py: 0.5,
                          whiteSpace: 'normal',
                          textAlign: 'left'
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Key Advantages Grid */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', mb: 2 }}>
              The 6 Core Superpowers of FitPulse AI
            </Typography>

            <Grid2 container spacing={2.5}>
              {ADVANTAGES.map((adv) => (
                <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={adv.title}>
                  <Card
                    sx={{
                      height: '100%',
                      borderRadius: 3,
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                      transition: 'transform 0.2s',
                      '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 2.5,
                          bgcolor: '#f1f5f9',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.6rem',
                          mb: 2
                        }}
                      >
                        {adv.icon}
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', mb: 1, fontSize: '1.05rem' }}>
                        {adv.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                        {adv.summary}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid2>
              ))}
            </Grid2>
          </Box>
        </Stack>
      )}

      {/* TAB 2: Architectural & Scientific Features */}
      {tabIndex === 2 && (
        <Stack spacing={4}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', mb: 0.5 }}>
              Scientific Foundations & Enterprise Microservices
            </Typography>
            <Typography variant="body2" color="text.secondary">
              A deep dive into the engineering, sports telemetry calculations, and distributed systems backing FitPulse AI.
            </Typography>
          </Box>

          <Grid2 container spacing={3}>
            {/* Scientific Formulas */}
            <Grid2 size={{ xs: 12, md: 6 }}>
              <Card sx={{ borderRadius: 3.5, border: '1px solid #e2e8f0', height: '100%' }}>
                <Box sx={{ p: 2.5, bgcolor: '#eff6ff', borderBottom: '1px solid #dbeafe' }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e40af' }}>
                    📐 Clinical Sports Science Engine
                  </Typography>
                </Box>
                <CardContent sx={{ p: 3 }}>
                  <Stack spacing={2.5}>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a' }}>
                        1. Mifflin-St Jeor Equation (BMR)
                      </Typography>
                      <Typography variant="caption" sx={{ display: 'block', color: '#64748b', mb: 0.5 }}>
                        Accurate within 10% of indirect calorimetry:
                      </Typography>
                      <Paper elevation={0} sx={{ p: 1.5, bgcolor: '#f8fafc', borderRadius: 2, fontFamily: 'monospace', fontSize: '0.85rem' }}>
                        Male: 10×wt(kg) + 6.25×ht(cm) - 5×age + 5<br />
                        Female: 10×wt(kg) + 6.25×ht(cm) - 5×age - 161
                      </Paper>
                    </Box>

                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a' }}>
                        2. Total Daily Energy Expenditure (TDEE)
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.9rem' }}>
                        Multiplies your BMR by your physical activity baseline (1.55x intermediate multiplier) to identify the precise maintenance caloric envelope before accounting for training sessions.
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a' }}>
                        3. Karvonen Cardiovascular Reserve (HR Max)
                      </Typography>
                      <Paper elevation={0} sx={{ p: 1.5, bgcolor: '#f8fafc', borderRadius: 2, fontFamily: 'monospace', fontSize: '0.85rem' }}>
                        Max Heart Rate = 220 - Age (years)
                      </Paper>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.9rem', mt: 0.5 }}>
                        Used by Gemini AI to assess workout intensity zones: Zone 2 Aerobic Base (60-70% Max HR) vs Zone 4 Lactate Threshold (80-90% Max HR).
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid2>

            {/* Microservices Architecture */}
            <Grid2 size={{ xs: 12, md: 6 }}>
              <Card sx={{ borderRadius: 3.5, border: '1px solid #e2e8f0', height: '100%' }}>
                <Box sx={{ p: 2.5, bgcolor: '#f5f3ff', borderBottom: '1px solid #ede9fe' }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#6d28d9' }}>
                    🏗️ Distributed Microservices Architecture
                  </Typography>
                </Box>
                <CardContent sx={{ p: 3 }}>
                  <Stack spacing={2}>
                    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1e293b' }}>
                        🌐 Spring Cloud API Gateway (Port 8085)
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Single entry point routing requests, executing reactive Keycloak authentication sync, and enforcing rate limiting.
                      </Typography>
                    </Box>

                    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1e293b' }}>
                        👤 User Microservice (Port 8081)
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        PostgreSQL-backed JPA service managing user credentials, biometrics, daily progress check-ins, and streak calculation.
                      </Typography>
                    </Box>

                    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1e293b' }}>
                        🏃 Activity Microservice (Port 8082)
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        High-throughput workout logger that publishes asynchronous event payloads to RabbitMQ.
                      </Typography>
                    </Box>

                    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1e293b' }}>
                        🤖 AI & Notification Microservice (Port 8083)
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        MongoDB-backed service executing Google Gemini AI generation, FitBot conversational chat, and in-app notification dispatch.
                      </Typography>
                    </Box>

                    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1e293b' }}>
                        🔍 Eureka Discovery & Config Server (8761 / 8888)
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Dynamic service registry enabling client-side load balancing and centralized cloud configuration.
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid2>
          </Grid2>
        </Stack>
      )}

      {/* TAB 3: FAQs */}
      {tabIndex === 3 && (
        <Stack spacing={3}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', mb: 0.5 }}>
              Frequently Asked Questions (FAQ)
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Everything you need to know about using FitPulse AI effectively.
            </Typography>
          </Box>

          <Stack spacing={1.5}>
            {FAQS.map((faq, idx) => (
              <Accordion
                key={idx}
                elevation={0}
                sx={{
                  borderRadius: 2.5,
                  border: '1px solid #e2e8f0',
                  '&:before': { display: 'none' },
                  overflow: 'hidden'
                }}
              >
                <AccordionSummary sx={{ bgcolor: '#f8fafc', fontWeight: 700, color: '#0f172a' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                    ❓ {faq.q}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 3, bgcolor: '#ffffff' }}>
                  <Typography variant="body2" sx={{ color: '#334155', lineHeight: 1.7, fontSize: '0.95rem' }}>
                    {faq.a}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Stack>
        </Stack>
      )}

      {/* Bottom Launch Callout */}
      <Paper
        elevation={0}
        sx={{
          mt: 6,
          p: 4,
          borderRadius: 3.5,
          bgcolor: '#eff6ff',
          border: '1px solid #bfdbfe',
          textAlign: 'center'
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 800, color: '#1e3a8a', mb: 1 }}>
          Ready to Transform Your Fitness Journey?
        </Typography>
        <Typography variant="body2" sx={{ color: '#3b82f6', maxWidth: 600, mx: 'auto', mb: 3 }}>
          Put your biometrics into action, maintain your daily consistency streak, and consult FitBot AI for personalized sports training.
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={handleStart}
          sx={{
            px: 4,
            py: 1.2,
            borderRadius: 2.5,
            fontWeight: 800,
            textTransform: 'none',
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            boxShadow: '0 4px 16px rgba(37, 99, 235, 0.35)'
          }}
        >
          🚀 Go to Fitness Dashboard
        </Button>
      </Paper>
    </Container>
  );
};

export default AppGuide;
