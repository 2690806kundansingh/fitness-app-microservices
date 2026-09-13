import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Button,
  TextField,
  Typography,
  Chip,
  Stack,
  Alert,
  CircularProgress,
  Divider,
  Paper,
  IconButton
} from '@mui/material';
import {
  getGatewayUrl,
  setGatewayUrl,
  testGatewayConnection,
  getConnectionStatus,
  syncPendingActivities,
  getPendingSyncCount
} from '../services/api';

const GatewayConnectionModal = ({ open, onClose }) => {
  const [currentUrl, setCurrentUrl] = useState('');
  const [inputUrl, setInputUrl] = useState('');
  const [status, setStatus] = useState('checking');
  const [latency, setLatency] = useState(null);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState(null);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    if (open) {
      const active = getGatewayUrl();
      setCurrentUrl(active);
      setInputUrl(active);
      setStatus(getConnectionStatus());
      setPendingCount(getPendingSyncCount());
      setTestResult(null);
      setSyncResult(null);
    }
  }, [open]);

  const handleTestAndSave = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const target = inputUrl.trim();
      const res = await testGatewayConnection(target);
      if (res.success) {
        setGatewayUrl(target);
        setCurrentUrl(target);
        setStatus('connected');
        setLatency(res.latency);
        setTestResult({
          severity: 'success',
          message: `Connected successfully! Latency: ${res.latency}ms. Saved as active gateway.`
        });
      } else {
        setTestResult({
          severity: 'error',
          message: `Connection failed: ${res.error || 'Host unreachable'}. You can still use the app in Resilient Offline Mode.`
        });
      }
    } catch (err) {
      setTestResult({
        severity: 'error',
        message: `Failed to connect: ${err.message}`
      });
    } finally {
      setTesting(false);
    }
  };

  const handleResetDefault = () => {
    setGatewayUrl('');
    const def = getGatewayUrl();
    setCurrentUrl(def);
    setInputUrl(def);
    setTestResult({
      severity: 'info',
      message: 'Reset to default gateway URL (http://localhost:8085/api).'
    });
  };

  const handleSyncPending = async () => {
    setSyncing(true);
    setSyncResult(null);
    try {
      const res = await syncPendingActivities();
      setPendingCount(getPendingSyncCount());
      setSyncResult({
        severity: 'success',
        message: `Successfully synchronized ${res.synced} offline workout(s) to API Gateway!`
      });
    } catch (err) {
      setSyncResult({
        severity: 'error',
        message: `Sync failed: ${err.message}`
      });
    } finally {
      setSyncing(false);
    }
  };

  const isConnected = status === 'connected';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
      <DialogTitle sx={{ pb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              bgcolor: isConnected ? '#ecfdf5' : '#fffbeb',
              color: isConnected ? '#059669' : '#d97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem',
              fontWeight: 'bold'
            }}
          >
            {isConnected ? '🟢' : '⚡'}
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
              API Gateway & Tunnel Control
            </Typography>
            <Typography variant="caption" color="text.secondary">
              MNC Resilient Network Management
            </Typography>
          </Box>
        </Stack>
        <Chip
          label={isConnected ? 'CONNECTED' : 'RESILIENT OFFLINE'}
          color={isConnected ? 'success' : 'warning'}
          size="small"
          sx={{ fontWeight: 700, fontSize: '0.75rem' }}
        />
      </DialogTitle>

      <DialogContent dividers sx={{ py: 2.5 }}>
        {/* Status Card */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            mb: 3,
            borderRadius: 2.5,
            border: '1px solid',
            borderColor: isConnected ? '#a7f3d0' : '#fde68a',
            bgcolor: isConnected ? '#f0fdf4' : '#fffbeb'
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: isConnected ? '#065f46' : '#92400e', mb: 0.5 }}>
            {isConnected ? '✓ Backend Microservices Online' : '⚡ Resilient Offline Engine Active'}
          </Typography>
          <Typography variant="body2" sx={{ color: isConnected ? '#047857' : '#b45309', fontSize: '0.85rem' }}>
            {isConnected
              ? `Connected to API Gateway. Latency: ${latency ? `${latency}ms` : 'Healthy'}. Workouts sync directly to MongoDB.`
              : 'The backend microservices or tunnel are not reachable from this network. The app is running smoothly in Local Storage mode with synthetic AI sports science coaching.'}
          </Typography>
          <Typography variant="caption" sx={{ display: 'block', mt: 1, fontFamily: 'monospace', color: '#475569', wordBreak: 'break-all' }}>
            Active Endpoint: {currentUrl}
          </Typography>
        </Paper>

        {/* Offline Sync Section if items exist */}
        {pendingCount > 0 && (
          <Alert
            severity="info"
            sx={{ mb: 2.5, borderRadius: 2 }}
            action={
              <Button
                color="inherit"
                size="small"
                onClick={handleSyncPending}
                disabled={syncing || !isConnected}
                sx={{ fontWeight: 700 }}
              >
                {syncing ? 'Syncing...' : 'Sync Now'}
              </Button>
            }
          >
            <strong>{pendingCount}</strong> workout(s) saved locally pending upload to server.
          </Alert>
        )}

        {syncResult && (
          <Alert severity={syncResult.severity} sx={{ mb: 2.5, borderRadius: 2 }} onClose={() => setSyncResult(null)}>
            {syncResult.message}
          </Alert>
        )}

        {/* Endpoint Input */}
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: '#1e293b' }}>
          Configure API Gateway or Cloudflare Tunnel URL:
        </Typography>
        <TextField
          fullWidth
          size="small"
          placeholder="e.g. https://my-tunnel.trycloudflare.com/api"
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          sx={{ mb: 1.5 }}
          helperText="Enter your live Cloudflare Tunnel URL or cloud gateway URL"
        />

        {testResult && (
          <Alert severity={testResult.severity} sx={{ mb: 2, borderRadius: 2 }} onClose={() => setTestResult(null)}>
            {testResult.message}
          </Alert>
        )}

        <Stack direction="row" spacing={1.5}>
          <Button
            variant="contained"
            onClick={handleTestAndSave}
            disabled={testing}
            sx={{
              textTransform: 'none',
              fontWeight: 700,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)'
            }}
          >
            {testing ? <CircularProgress size={20} color="inherit" /> : 'Test & Save Endpoint'}
          </Button>
          <Button
            variant="outlined"
            onClick={handleResetDefault}
            disabled={testing}
            sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
          >
            Reset Default
          </Button>
        </Stack>

        <Divider sx={{ my: 3 }} />

        {/* Mobile / Localhost Tunnel Guide */}
        <Box sx={{ bgcolor: '#f8fafc', p: 2, borderRadius: 2, border: '1px solid #e2e8f0' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1e293b', mb: 0.5 }}>
            📱 How to connect local backend to mobile:
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
            1. Double-click <code>start-tunnel.bat</code> on your computer.
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
            2. Copy the generated URL (e.g. <code>https://xxx.trycloudflare.com</code>).
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
            3. Paste it in the box above and click "Test & Save", or open <code>https://fitness-app-microservices-xi34.vercel.app?api=https://xxx.trycloudflare.com</code> on your mobile browser!
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} sx={{ fontWeight: 600, textTransform: 'none' }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GatewayConnectionModal;
