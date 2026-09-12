import React, { useEffect, useState } from 'react';
import {
  Badge,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Popover,
  Stack,
  Typography
} from '@mui/material';
import { useNavigate } from 'react-router';
import {
  deleteNotification,
  getNotifications,
  getUnreadNotificationCount,
  markAllNotificationsRead,
  markNotificationRead
} from '../services/api';

const getNotificationIcon = (type) => {
  switch (type) {
    case 'WORKOUT_LOGGED':
      return '🏃';
    case 'BOT_TIP':
      return '🤖';
    case 'STREAK_ACHIEVED':
      return '🔥';
    case 'DAILY_REMINDER':
      return '⏰';
    case 'GOAL_MILESTONE':
      return '🏆';
    default:
      return '🔔';
  }
};

const formatTimeAgo = (dateStr) => {
  if (!dateStr) return '';
  const now = new Date();
  const date = new Date(dateStr);
  const diffSec = Math.floor((now - date) / 1000);

  if (diffSec < 60) return 'Just now';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  return `${Math.floor(diffSec / 86400)}d ago`;
};

const NotificationCenter = ({ userId }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchUnread = async () => {
    if (!userId) return;
    try {
      const res = await getUnreadNotificationCount(userId);
      setUnreadCount(res.data?.unreadCount || 0);
    } catch {
      // ignore
    }
  };

  const fetchAll = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await getNotifications(userId);
      setNotifications(res.data || []);
      fetchUnread();
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnread();
    const interval = setInterval(fetchUnread, 15000); // Polling every 15s for updates
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
    fetchAll();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead(userId);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all read:', err);
    }
  };

  const handleItemClick = async (item) => {
    if (!item.read) {
      try {
        await markNotificationRead(item.id);
        setNotifications((prev) =>
          prev.map((n) => (n.id === item.id ? { ...n, read: true } : n))
        );
        setUnreadCount((c) => Math.max(0, c - 1));
      } catch {
        // ignore
      }
    }
    if (item.link) {
      navigate(item.link);
      handleClose();
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      fetchUnread();
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          color: '#475569',
          bgcolor: open ? '#eff6ff' : 'transparent',
          '&:hover': { bgcolor: '#f1f5f9', color: '#1d4ed8' }
        }}
        title="Notifications"
      >
        <Badge badgeContent={unreadCount} color="error" max={99}>
          <span style={{ fontSize: '1.25rem' }}>🔔</span>
        </Badge>
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: {
              width: 380,
              maxHeight: 500,
              borderRadius: 3,
              boxShadow: '0 12px 40px rgba(15, 23, 42, 0.18)',
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }
          }
        }}
      >
        {/* Header */}
        <Box sx={{ p: 2, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a' }}>
                Notifications
              </Typography>
              {unreadCount > 0 && (
                <Chip label={`${unreadCount} new`} size="small" color="primary" sx={{ fontWeight: 700, height: 20 }} />
              )}
            </Stack>

            {unreadCount > 0 && (
              <Button
                size="small"
                onClick={handleMarkAllRead}
                sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.75rem' }}
              >
                Mark all read
              </Button>
            )}
          </Stack>
        </Box>

        {/* List */}
        <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
          {loading ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <CircularProgress size={28} />
            </Box>
          ) : notifications.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                🎉 You're all caught up! No notifications yet.
              </Typography>
            </Box>
          ) : (
            <List disablePadding>
              {notifications.map((item) => (
                <ListItem
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  sx={{
                    p: 1.8,
                    cursor: 'pointer',
                    borderBottom: '1px solid #f1f5f9',
                    bgcolor: item.read ? 'transparent' : '#f0f9ff',
                    '&:hover': { bgcolor: '#f8fafc' },
                    alignItems: 'flex-start'
                  }}
                  secondaryAction={
                    <IconButton size="small" edge="end" onClick={(e) => handleDelete(e, item.id)} sx={{ color: '#94a3b8' }}>
                      ✕
                    </IconButton>
                  }
                >
                  <Box sx={{ fontSize: '1.4rem', mr: 1.5, mt: 0.2 }}>
                    {getNotificationIcon(item.type)}
                  </Box>

                  <ListItemText
                    primary={
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="subtitle2" sx={{ fontWeight: item.read ? 600 : 800, color: '#1e293b' }}>
                          {item.title}
                        </Typography>
                        {!item.read && (
                          <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#2563eb' }} />
                        )}
                      </Stack>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.82rem', mt: 0.3, lineHeight: 1.4 }}>
                          {item.message}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mt: 0.5 }}>
                          {formatTimeAgo(item.createdAt)}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Popover>
    </>
  );
};

export default NotificationCenter;
