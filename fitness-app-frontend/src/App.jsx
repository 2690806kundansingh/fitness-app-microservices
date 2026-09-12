import React, { useContext, useEffect, useState } from 'react';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  Container,
  createTheme,
  CssBaseline,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  ThemeProvider,
  Toolbar,
  Typography,
  TextField,
  Alert,
  CircularProgress,
  Divider
} from '@mui/material';
import { AuthContext } from 'react-oauth2-code-pkce';
import { useDispatch } from 'react-redux';
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router';
import { setCredentials } from './store/authSlice';
import ActivityForm from './components/ActivityForm';
import ActivityList from './components/ActivityList';
import ActivityDetail from './components/ActivityDetail';
import Dashboard from './components/Dashboard';
import AICoach from './components/AICoach';
import Goals from './components/Goals';
import Profile from './components/Profile';
import DailyCheckIn from './components/DailyCheckIn';
import OnboardingModal from './components/OnboardingModal';
import FitBotChat from './components/FitBotChat';
import NotificationCenter from './components/NotificationCenter';
import AppGuide from './components/AppGuide';
import BeginnerPlan from './components/BeginnerPlan';
import {
  getUserProfile,
  checkKeycloakHealth,
  loginWithKeycloakDirect,
  ensureValidToken,
  decodeJwt,
  createDemoUserSession
} from './services/api';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2563eb',
      dark: '#1d4ed8',
      light: '#60a5fa'
    },
    secondary: {
      main: '#7c3aed',
      dark: '#6d28d9',
      light: '#a78bfa'
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff'
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b'
    }
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  shape: {
    borderRadius: 12
  }
});

const ActivitiesPage = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleActivityAdded = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <ActivityForm onActivityAdded={handleActivityAdded} />
      <ActivityList refreshTrigger={refreshTrigger} />
    </Box>
  );
};

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', icon: '📊' },
  { label: 'Beginner Plan', path: '/beginner-plan', icon: '🔰' },
  { label: 'Workouts', path: '/activities', icon: '🏃' },
  { label: 'AI Coach', path: '/ai-coach', icon: '🤖' },
  { label: 'Daily Check-in', path: '/daily-checkin', icon: '🔥' },
  { label: 'Goals', path: '/goals', icon: '🎯' },
  { label: 'Health Profile', path: '/profile', icon: '👤' },
  { label: 'User Guide', path: '/guide', icon: '📖' }
];

const NavigationHeader = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const userName = user?.preferred_username || user?.name || user?.email || 'User';
  const userId = user?.sub || localStorage.getItem('userId');

  // Mobile menu anchor
  const [anchorEl, setAnchorEl] = useState(null);
  const handleOpenMenu = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        color: '#1e293b'
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between', py: 1 }}>
          {/* Logo */}
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
            onClick={() => navigate('/dashboard')}
            sx={{ cursor: 'pointer' }}
          >
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: 2.5,
                background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '1.25rem',
                fontWeight: 'bold',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
              }}
            >
              ⚡
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: -0.5, lineHeight: 1.1 }}>
                FitPulse <span style={{ color: '#2563eb' }}>AI</span>
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.7rem', display: { xs: 'none', sm: 'block' } }}>
                Enterprise Fitness Platform
              </Typography>
            </Box>
          </Stack>

          {/* Desktop Navigation Links */}
          <Stack direction="row" spacing={1} sx={{ display: { xs: 'none', md: 'flex' } }}>
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  sx={{
                    px: 1.8,
                    py: 0.8,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? '#2563eb' : '#475569',
                    bgcolor: isActive ? '#eff6ff' : 'transparent',
                    '&:hover': { bgcolor: '#f1f5f9', color: '#1d4ed8' }
                  }}
                >
                  <span style={{ marginRight: 6 }}>{item.icon}</span>
                  {item.label}
                </Button>
              );
            })}
          </Stack>

          {/* User Controls */}
          <Stack direction="row" spacing={1.5} alignItems="center">
            {/* Notification Center */}
            <NotificationCenter userId={userId} />

            {/* Mobile Menu Button */}
            <IconButton
              onClick={handleOpenMenu}
              sx={{ display: { xs: 'flex', md: 'none' }, color: '#1e293b' }}
            >
              ☰
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleCloseMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {NAV_ITEMS.map((item) => (
                <MenuItem
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    handleCloseMenu();
                  }}
                  selected={location.pathname.startsWith(item.path)}
                >
                  <span style={{ marginRight: 10 }}>{item.icon}</span>
                  {item.label}
                </MenuItem>
              ))}
            </Menu>

            <Chip
              avatar={<Avatar sx={{ bgcolor: '#2563eb', color: '#fff', width: 26, height: 26, fontSize: '0.8rem' }}>{userName.charAt(0).toUpperCase()}</Avatar>}
              label={userName}
              variant="outlined"
              size="small"
              onClick={() => navigate('/profile')}
              sx={{
                fontWeight: 600,
                borderColor: '#e2e8f0',
                cursor: 'pointer',
                display: { xs: 'none', sm: 'flex' },
                '&:hover': { bgcolor: '#f8fafc' }
              }}
            />

            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={onLogout}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                px: 2
              }}
            >
              Log Out
            </Button>
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

const LoginPage = ({ onLogin, onDirectLogin }) => {
  const [showGuide, setShowGuide] = useState(false);
  const [username, setUsername] = useState('testuser');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [keycloakStatus, setKeycloakStatus] = useState('checking'); // 'checking' | 'online' | 'offline'

  useEffect(() => {
    let mounted = true;
    checkKeycloakHealth().then((res) => {
      if (mounted) {
        setKeycloakStatus(res.online ? 'online' : 'offline');
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const handleDirectCredentialSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    try {
      const data = await loginWithKeycloakDirect(username, password);
      if (data && data.access_token) {
        const decoded = decodeJwt(data.access_token);
        const user = {
          sub: decoded?.sub || 'd8b1ab4e-f241-4bcf-8352-0d2fcbda134c',
          preferred_username: decoded?.preferred_username || username,
          email: decoded?.email || `${username}@fitness.com`,
          name: decoded?.name || username
        };
        onDirectLogin(data.access_token, user, data.refresh_token);
      } else {
        setErrorMessage('Failed to obtain token from Keycloak.');
      }
    } catch (err) {
      console.error('Direct login error:', err);
      if (err.response?.status === 401 || err.response?.data?.error === 'invalid_grant') {
        setErrorMessage('Invalid credentials. Default test user is "testuser" / "password123".');
      } else if (err.code === 'ERR_NETWORK' || !err.response) {
        setErrorMessage('Keycloak service (Port 8181) is not responding. Use 1-Click Demo Mode below to continue!');
        setKeycloakStatus('offline');
      } else {
        setErrorMessage(err.response?.data?.error_description || err.message || 'Login failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickTestLogin = async () => {
    setUsername('testuser');
    setPassword('password123');
    setLoading(true);
    setErrorMessage('');
    try {
      const data = await loginWithKeycloakDirect('testuser', 'password123');
      if (data && data.access_token) {
        const decoded = decodeJwt(data.access_token);
        const user = {
          sub: decoded?.sub || 'd8b1ab4e-f241-4bcf-8352-0d2fcbda134c',
          preferred_username: decoded?.preferred_username || 'testuser',
          email: decoded?.email || 'testuser@fitness.com',
          name: decoded?.name || 'Test Athlete'
        };
        onDirectLogin(data.access_token, user, data.refresh_token);
        return;
      }
    } catch (err) {
      console.warn('Keycloak direct login failed, activating instant session:', err);
    }
    // Instant fallback demo session
    const demo = createDemoUserSession('testuser', 'testuser@fitness.com');
    onDirectLogin(demo.token, demo.user);
    setLoading(false);
  };

  const handleDemoBypass = () => {
    const demo = createDemoUserSession('testuser', 'testuser@fitness.com');
    onDirectLogin(demo.token, demo.user);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f8fafc',
        p: { xs: 2, sm: 3 }
      }}
    >
      <Card
        sx={{
          maxWidth: 540,
          width: '100%',
          p: { xs: 3, sm: 4 },
          borderRadius: 4,
          boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
          border: '1px solid #e2e8f0',
          textAlign: 'center'
        }}
      >
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: '2rem',
            fontWeight: 'bold',
            mx: 'auto',
            mb: 2,
            boxShadow: '0 6px 20px rgba(37, 99, 235, 0.35)'
          }}
        >
          ⚡
        </Box>

        <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 2 }}>
          <Chip
            label="AI-POWERED FITNESS PLATFORM"
            size="small"
            sx={{
              fontWeight: 700,
              fontSize: '0.7rem',
              bgcolor: '#eff6ff',
              color: '#2563eb',
              letterSpacing: 0.5
            }}
          />
          {keycloakStatus === 'checking' && (
            <Chip label="Checking SSO..." size="small" variant="outlined" sx={{ fontSize: '0.7rem' }} />
          )}
          {keycloakStatus === 'online' && (
            <Chip
              label="🟢 Keycloak SSO: Online"
              size="small"
              sx={{ bgcolor: '#dcfce7', color: '#166534', fontWeight: 700, fontSize: '0.7rem' }}
            />
          )}
          {keycloakStatus === 'offline' && (
            <Chip
              label="🔴 Keycloak: Offline (Use 1-Click Login)"
              size="small"
              sx={{ bgcolor: '#fee2e2', color: '#991b1b', fontWeight: 700, fontSize: '0.7rem' }}
            />
          )}
        </Stack>

        <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b', mb: 1, letterSpacing: -0.5 }}>
          Welcome to FitPulse AI
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, lineHeight: 1.5 }}>
          Track workouts, access the 7-day beginner exercise guide, and receive real-time Gemini AI coaching.
        </Typography>

        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2, textAlign: 'left', fontSize: '0.85rem' }}>
            {errorMessage}
          </Alert>
        )}

        {/* 1-Click Instant Login Hero Button */}
        <Button
          variant="contained"
          fullWidth
          size="large"
          onClick={handleQuickTestLogin}
          disabled={loading}
          sx={{
            py: 1.4,
            borderRadius: 2.5,
            fontSize: '1rem',
            fontWeight: 800,
            textTransform: 'none',
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            boxShadow: '0 4px 16px rgba(37, 99, 235, 0.35)',
            mb: 2.5,
            '&:hover': { background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)' }
          }}
        >
          {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : '⚡ 1-Click Fast Login (testuser)'}
        </Button>

        <Divider sx={{ my: 2 }}>
          <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700 }}>
            OR SIGN IN WITH CREDENTIALS
          </Typography>
        </Divider>

        {/* Direct In-Page Credentials Form */}
        <Box component="form" onSubmit={handleDirectCredentialSubmit} sx={{ textAlign: 'left', mb: 2 }}>
          <TextField
            label="Username or Email"
            fullWidth
            size="small"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ mb: 1.8 }}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            size="small"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Button
            type="submit"
            variant="outlined"
            fullWidth
            disabled={loading}
            sx={{
              py: 1,
              borderRadius: 2,
              fontWeight: 700,
              textTransform: 'none',
              borderColor: '#2563eb',
              color: '#2563eb',
              '&:hover': { bgcolor: '#eff6ff', borderColor: '#1d4ed8' }
            }}
          >
            Sign In with Entered Credentials
          </Button>
        </Box>

        <Divider sx={{ my: 2 }}>
          <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700 }}>
            ALTERNATIVE OPTIONS
          </Typography>
        </Divider>

        {/* SSO Redirect & Demo Access */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mb: 2.5 }}>
          <Button
            variant="outlined"
            fullWidth
            size="small"
            onClick={onLogin}
            sx={{
              py: 1,
              borderRadius: 2,
              fontWeight: 700,
              textTransform: 'none',
              color: '#475569',
              borderColor: '#cbd5e1'
            }}
          >
            🌐 Keycloak SSO Redirect
          </Button>

          <Button
            variant="outlined"
            fullWidth
            size="small"
            onClick={handleDemoBypass}
            sx={{
              py: 1,
              borderRadius: 2,
              fontWeight: 700,
              textTransform: 'none',
              color: '#059669',
              borderColor: '#a7f3d0',
              bgcolor: '#f0fdf4'
            }}
          >
            🚀 Demo Access (Offline)
          </Button>
        </Stack>

        {/* Pre-configured Account Notice */}
        <Box sx={{ p: 1.8, bgcolor: '#f8fafc', borderRadius: 2.5, border: '1px solid #e2e8f0', textAlign: 'left', mb: 2.5 }}>
          <Typography variant="caption" sx={{ fontWeight: 800, color: '#334155', display: 'block', mb: 0.5 }}>
            🔑 Pre-Configured Test Credentials:
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
            • Username: <strong>testuser</strong> &nbsp;|&nbsp; Password: <strong>password123</strong>
          </Typography>
          <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.72rem', display: 'block', mt: 0.5 }}>
            Keycloak container running on port 8181. Direct grant & PKCE are both supported.
          </Typography>
        </Box>

        <Button
          variant="text"
          fullWidth
          size="small"
          onClick={() => setShowGuide(true)}
          sx={{
            fontWeight: 700,
            textTransform: 'none',
            color: '#2563eb'
          }}
        >
          📖 Explore How It Works & Advantages (User Guide)
        </Button>
      </Card>

      {/* Public Visitor User Guide Dialog */}
      <Dialog
        open={showGuide}
        onClose={() => setShowGuide(false)}
        maxWidth="lg"
        fullWidth
        scroll="paper"
        slotProps={{
          paper: {
            sx: {
              borderRadius: 3.5,
              maxHeight: '90vh'
            }
          }
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1, borderBottom: '1px solid #e2e8f0' }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>
              ⚡ FitPulse AI • System Guide & Advantages
            </Typography>
          </Stack>
          <Button onClick={() => setShowGuide(false)} sx={{ fontWeight: 700, textTransform: 'none' }}>
            ✕ Close
          </Button>
        </DialogTitle>
        <DialogContent sx={{ p: { xs: 1, sm: 3 } }}>
          <AppGuide
            onStartClick={() => {
              setShowGuide(false);
              handleQuickTestLogin();
            }}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

function App() {
  const { token, tokenData, logIn, logOut } = useContext(AuthContext);
  const dispatch = useDispatch();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [directToken, setDirectToken] = useState(() => localStorage.getItem('token'));
  const [directUser, setDirectUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const activeToken = token || directToken;
  const activeUser = tokenData || directUser;

  const handleDirectLogin = (newToken, newUser, newRefreshToken) => {
    localStorage.setItem('token', newToken);
    if (newRefreshToken) {
      localStorage.setItem('refreshToken', newRefreshToken);
    }
    if (newUser) {
      localStorage.setItem('user', JSON.stringify(newUser));
      if (newUser.sub) localStorage.setItem('userId', newUser.sub);
    }
    setDirectToken(newToken);
    setDirectUser(newUser);
    dispatch(setCredentials({ token: newToken, user: newUser }));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    sessionStorage.clear();
    setDirectToken(null);
    setDirectUser(null);
    if (token) {
      logOut();
    }
  };

  useEffect(() => {
    // Proactively validate the local token on mount
    ensureValidToken().then((freshToken) => {
      if (freshToken && freshToken !== directToken) {
        setDirectToken(freshToken);
        const payload = decodeJwt(freshToken);
        if (payload?.sub) {
          localStorage.setItem('userId', payload.sub);
        }
      }
    }).catch(() => {});
  }, [directToken]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      if (tokenData?.sub) {
        localStorage.setItem('userId', tokenData.sub);
        // Check if user has completed profile setup
        getUserProfile(tokenData.sub)
          .then((res) => {
            if (res.data && res.data.profileCompleted === false) {
              setShowOnboarding(true);
            }
          })
          .catch(() => {
            // If user doesn't exist yet in user service, prompt onboarding
            setShowOnboarding(true);
          });
      }
      dispatch(setCredentials({ token, user: tokenData }));
    } else if (directToken && directUser) {
      dispatch(setCredentials({ token: directToken, user: directUser }));
    }
  }, [token, tokenData, directToken, directUser, dispatch]);

  const currentUserId = activeUser?.sub || localStorage.getItem('userId');

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        {!activeToken ? (
          <LoginPage onLogin={logIn} onDirectLogin={handleDirectLogin} />
        ) : (
          <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
            <NavigationHeader user={activeUser} onLogout={handleLogout} />
            <Container maxWidth="lg" sx={{ py: { xs: 2.5, sm: 4 }, px: { xs: 1.5, sm: 3 }, flexGrow: 1 }}>
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/beginner-plan" element={<BeginnerPlan />} />
                <Route path="/activities" element={<ActivitiesPage />} />
                <Route path="/activities/:id" element={<ActivityDetail />} />
                <Route path="/ai-coach" element={<AICoach />} />
                <Route path="/daily-checkin" element={<DailyCheckIn userId={currentUserId} />} />
                <Route path="/goals" element={<Goals />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/guide" element={<AppGuide />} />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </Container>

            {/* Floating FitBot Assistant Widget */}
            <FitBotChat userId={currentUserId} />

            {/* New User Profile Onboarding Modal */}
            <OnboardingModal
              open={showOnboarding}
              onClose={() => setShowOnboarding(false)}
              userId={currentUserId}
              onProfileSaved={() => setShowOnboarding(false)}
              initialEmail={activeUser?.email}
            />
          </Box>
        )}
      </Router>
    </ThemeProvider>
  );
}

export default App;