import React, { useEffect, useRef, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Fab,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { clearBotChat, getBotChatHistory, sendBotMessage } from '../services/api';

const QUICK_PROMPTS = [
  'How is my daily progress today?',
  'Suggest a 25 min aerobic workout',
  'What should I eat after training?',
  'How can I recover from sore legs?'
];

const FitBotChat = ({ userId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && userId) {
      loadChatHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, userId]);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const loadChatHistory = async () => {
    try {
      const res = await getBotChatHistory(userId);
      setMessages(res.data || []);
    } catch (err) {
      console.error('Failed to load bot chat history:', err);
    }
  };

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim() || loading) return;

    const userMsg = {
      id: 'temp-' + Date.now(),
      sender: 'USER',
      message: text,
      timestamp: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const res = await sendBotMessage({
        userId,
        message: text,
        contextGoal: 'General Health & Fitness',
        fitnessLevel: 'Intermediate'
      });

      const botMsg = {
        id: res.data.id || 'bot-' + Date.now(),
        sender: 'BOT',
        message: res.data.reply,
        quickReplies: res.data.quickReplies || [],
        timestamp: res.data.timestamp || new Date().toISOString()
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('FitBot chat failed:', err);
      const errMsg = {
        id: 'err-' + Date.now(),
        sender: 'BOT',
        message: "I'm having a little trouble connecting right now, but remember to stay hydrated and keep consistent! Please try asking again in a moment.",
        quickReplies: ['Try again', 'Check today progress'],
        timestamp: new Date().toISOString()
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = async () => {
    try {
      await clearBotChat(userId);
      setMessages([]);
      loadChatHistory();
    } catch (err) {
      console.error('Failed to clear chat:', err);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <Fab
          variant="extended"
          color="primary"
          onClick={() => setIsOpen(true)}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1200,
            fontWeight: 800,
            textTransform: 'none',
            px: 2.5,
            py: 1.5,
            background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
            boxShadow: '0 8px 24px rgba(37, 99, 235, 0.4)',
            '&:hover': {
              background: 'linear-gradient(135deg, #1d4ed8 0%, #6d28d9 100%)',
              transform: 'scale(1.03)'
            },
            transition: 'all 0.2s ease'
          }}
        >
          <span style={{ fontSize: '1.3rem', marginRight: 8 }}>💬</span>
          Chat with FitBot
        </Fab>
      )}

      {/* Floating Chat Modal / Window */}
      {isOpen && (
        <Paper
          elevation={12}
          sx={{
            position: 'fixed',
            bottom: { xs: 0, sm: 24 },
            right: { xs: 0, sm: 24 },
            width: { xs: '100vw', sm: 400 },
            height: { xs: '90vh', sm: 580 },
            borderRadius: { xs: '20px 20px 0 0', sm: 4 },
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1300,
            overflow: 'hidden',
            border: '1px solid #e2e8f0',
            boxShadow: '0 20px 50px rgba(15, 23, 42, 0.25)'
          }}
        >
          {/* Header */}
          <Box
            sx={{
              p: 2,
              background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
              color: '#fff',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Avatar sx={{ bgcolor: '#2563eb', width: 38, height: 38, fontSize: '1.2rem', fontWeight: 800 }}>
                🤖
              </Avatar>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                  FitBot AI Companion
                </Typography>
                <Stack direction="row" spacing={0.8} alignItems="center">
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#22c55e' }} />
                  <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                    Active • Sports Science Coach
                  </Typography>
                </Stack>
              </Box>
            </Stack>

            <Stack direction="row" spacing={0.5}>
              <IconButton size="small" onClick={handleClearChat} title="Clear conversation" sx={{ color: '#94a3b8', '&:hover': { color: '#fff' } }}>
                🗑️
              </IconButton>
              <IconButton size="small" onClick={() => setIsOpen(false)} title="Close" sx={{ color: '#94a3b8', '&:hover': { color: '#fff' } }}>
                ✕
              </IconButton>
            </Stack>
          </Box>

          {/* Quick inquiries bar */}
          <Box sx={{ p: 1.2, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0', overflowX: 'auto', whiteSpace: 'nowrap' }}>
            <Stack direction="row" spacing={1}>
              {QUICK_PROMPTS.map((prompt, idx) => (
                <Chip
                  key={idx}
                  label={prompt}
                  size="small"
                  clickable
                  onClick={() => handleSendMessage(prompt)}
                  sx={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    bgcolor: '#fff',
                    border: '1px solid #cbd5e1',
                    '&:hover': { bgcolor: '#eff6ff', borderColor: '#93c5fd' }
                  }}
                />
              ))}
            </Stack>
          </Box>

          {/* Messages Area */}
          <Box sx={{ flexGrow: 1, p: 2, overflowY: 'auto', bgcolor: '#f8fafc' }}>
            <Stack spacing={2}>
              {messages.map((m, idx) => {
                const isUser = m.sender === 'USER';
                return (
                  <Box
                    key={m.id || idx}
                    sx={{
                      display: 'flex',
                      justifyContent: isUser ? 'flex-end' : 'flex-start',
                      mb: 1
                    }}
                  >
                    <Box sx={{ maxWidth: '85%' }}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 1.8,
                          borderRadius: 3,
                          borderTopRightRadius: isUser ? 0 : 3,
                          borderTopLeftRadius: !isUser ? 0 : 3,
                          bgcolor: isUser ? '#2563eb' : '#ffffff',
                          color: isUser ? '#ffffff' : '#1e293b',
                          border: isUser ? 'none' : '1px solid #e2e8f0',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                          whiteSpace: 'pre-wrap',
                          fontSize: '0.88rem',
                          lineHeight: 1.5
                        }}
                      >
                        {m.message}
                      </Paper>

                      {/* Quick Replies below bot message */}
                      {!isUser && m.quickReplies && m.quickReplies.length > 0 && (
                        <Stack direction="row" flexWrap="wrap" gap={0.8} sx={{ mt: 1 }}>
                          {m.quickReplies.map((qr, i) => (
                            <Chip
                              key={i}
                              label={qr}
                              size="small"
                              clickable
                              onClick={() => handleSendMessage(qr)}
                              sx={{
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                bgcolor: '#eff6ff',
                                color: '#2563eb',
                                borderColor: '#bfdbfe',
                                '&:hover': { bgcolor: '#dbeafe' }
                              }}
                            />
                          ))}
                        </Stack>
                      )}

                      <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mt: 0.4, textAlign: isUser ? 'right' : 'left' }}>
                        {m.timestamp ? new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </Typography>
                    </Box>
                  </Box>
                );
              })}

              {/* Typing indicator */}
              {loading && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1 }}>
                  <Avatar sx={{ bgcolor: '#2563eb', width: 24, height: 24, fontSize: '0.75rem' }}>🤖</Avatar>
                  <Paper elevation={0} sx={{ p: 1.2, px: 2, bgcolor: '#fff', borderRadius: 3, border: '1px solid #e2e8f0' }}>
                    <Stack direction="row" spacing={0.8} alignItems="center">
                      <CircularProgress size={14} />
                      <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>FitBot is analyzing...</Typography>
                    </Stack>
                  </Paper>
                </Box>
              )}

              <div ref={messagesEndRef} />
            </Stack>
          </Box>

          {/* Input Area */}
          <Box sx={{ p: 1.5, bgcolor: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <TextField
                fullWidth
                size="small"
                placeholder="Ask FitBot anything about fitness..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2.5,
                    bgcolor: '#f8fafc'
                  }
                }}
              />
              <Button
                variant="contained"
                disabled={loading || !inputText.trim()}
                onClick={() => handleSendMessage()}
                sx={{
                  minWidth: 44,
                  width: 44,
                  height: 40,
                  borderRadius: 2.5,
                  p: 0,
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)'
                }}
              >
                ➤
              </Button>
            </Stack>
          </Box>
        </Paper>
      )}
    </>
  );
};

export default FitBotChat;
