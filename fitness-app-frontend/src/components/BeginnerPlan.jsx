import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Grid2,
  Tabs,
  Tab,
  Stack,
  Divider,
  Paper,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  IconButton,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControlLabel,
  Switch,
  TextField,
  MenuItem
} from '@mui/material';
import { addActivity } from '../services/api';

// Crisp inline SVG diagrams for exercise postures with color-coded muscle highlights
const ExerciseSvg = ({ type }) => {
  const primaryColor = "#f97316";   // Orange: Primary muscle worked
  const secondaryColor = "#8b5cf6"; // Purple: Secondary/Stabilizer muscle
  const bodyColor = "#3b82f6";      // Blue: Neutral body frame
  const accentColor = "#10b981";    // Green: Ground/Direction arrow

  switch (type) {
    case 'squat':
      return (
        <svg viewBox="0 0 200 200" width="100%" height="180" style={{ background: '#f8fafc', borderRadius: 12 }}>
          {/* Ground */}
          <line x1="20" y1="180" x2="180" y2="180" stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round" />
          {/* Head */}
          <circle cx="95" cy="50" r="14" fill={bodyColor} />
          {/* Torso */}
          <line x1="95" y1="64" x2="85" y2="110" stroke={secondaryColor} strokeWidth="12" strokeLinecap="round" />
          {/* Core label dot */}
          <circle cx="88" cy="90" r="5" fill={secondaryColor} />
          {/* Arms reaching forward for counter-balance */}
          <line x1="93" y1="75" x2="140" y2="75" stroke={bodyColor} strokeWidth="8" strokeLinecap="round" />
          {/* Thighs (Quads & Glutes - PRIMARY) */}
          <line x1="85" y1="110" x2="135" y2="125" stroke={primaryColor} strokeWidth="14" strokeLinecap="round" />
          {/* Lower Legs (Calves) */}
          <line x1="135" y1="125" x2="125" y2="178" stroke={bodyColor} strokeWidth="10" strokeLinecap="round" />
          {/* Feet */}
          <line x1="115" y1="178" x2="145" y2="178" stroke="#1e293b" strokeWidth="6" strokeLinecap="round" />
          {/* Down & Up movement arrow */}
          <path d="M 50 85 L 50 135 M 45 125 L 50 135 L 55 125" stroke={accentColor} strokeWidth="3" fill="none" />
          <text x="35" y="75" fill="#64748b" fontSize="10" fontWeight="bold">SINK HIPS</text>
        </svg>
      );
    case 'pushup':
    case 'wall-pushup':
    case 'incline-pushup':
      return (
        <svg viewBox="0 0 200 200" width="100%" height="180" style={{ background: '#f8fafc', borderRadius: 12 }}>
          {/* Wall or Incline Bar */}
          <line x1="165" y1="20" x2="165" y2="180" stroke="#94a3b8" strokeWidth="8" strokeLinecap="round" />
          {/* Ground */}
          <line x1="20" y1="180" x2="180" y2="180" stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round" />
          {/* Head */}
          <circle cx="130" cy="55" r="13" fill={bodyColor} />
          {/* Torso & Legs straight line (Core) */}
          <line x1="125" y1="68" x2="60" y2="175" stroke={secondaryColor} strokeWidth="12" strokeLinecap="round" />
          {/* Chest & Triceps pushing (PRIMARY) */}
          <line x1="120" y1="78" x2="165" y2="85" stroke={primaryColor} strokeWidth="10" strokeLinecap="round" />
          {/* Feet */}
          <line x1="50" y1="178" x2="68" y2="178" stroke="#1e293b" strokeWidth="6" strokeLinecap="round" />
          {/* Arrow */}
          <path d="M 115 110 L 140 95 M 130 95 L 140 95 L 138 105" stroke={accentColor} strokeWidth="3" fill="none" />
          <text x="75" y="45" fill="#64748b" fontSize="10" fontWeight="bold">PUSH AWAY</text>
        </svg>
      );
    case 'bridge':
      return (
        <svg viewBox="0 0 200 200" width="100%" height="180" style={{ background: '#f8fafc', borderRadius: 12 }}>
          {/* Floor Mat */}
          <line x1="15" y1="160" x2="185" y2="160" stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round" />
          {/* Head & Upper Back resting on mat */}
          <circle cx="45" cy="148" r="13" fill={bodyColor} />
          {/* Torso bridge angled up (PRIMARY GLUTES & HAMSTRINGS) */}
          <line x1="55" y1="148" x2="105" y2="110" stroke={secondaryColor} strokeWidth="12" strokeLinecap="round" />
          {/* Glutes & Hips elevated */}
          <circle cx="105" cy="110" r="9" fill={primaryColor} />
          {/* Thighs */}
          <line x1="105" y1="110" x2="145" y2="125" stroke={primaryColor} strokeWidth="13" strokeLinecap="round" />
          {/* Calves down to feet */}
          <line x1="145" y1="125" x2="150" y2="160" stroke={bodyColor} strokeWidth="10" strokeLinecap="round" />
          {/* Arms flat on ground */}
          <line x1="55" y1="156" x2="105" y2="156" stroke="#94a3b8" strokeWidth="7" strokeLinecap="round" />
          {/* Lift arrow */}
          <path d="M 105 140 L 105 100 M 100 110 L 105 100 L 110 110" stroke={accentColor} strokeWidth="3" fill="none" />
          <text x="80" y="85" fill="#64748b" fontSize="10" fontWeight="bold">SQUEEZE GLUTES</text>
        </svg>
      );
    case 'bird-dog':
    case 'cat-cow':
      return (
        <svg viewBox="0 0 200 200" width="100%" height="180" style={{ background: '#f8fafc', borderRadius: 12 }}>
          {/* Mat */}
          <line x1="15" y1="165" x2="185" y2="165" stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round" />
          {/* Head */}
          <circle cx="145" cy="85" r="12" fill={bodyColor} />
          {/* Spine / Torso (PRIMARY CORE STABILIZER) */}
          <line x1="70" y1="100" x2="135" y2="100" stroke={primaryColor} strokeWidth="12" strokeLinecap="round" />
          {/* Left Arm Supporting */}
          <line x1="130" y1="100" x2="130" y2="165" stroke={bodyColor} strokeWidth="8" strokeLinecap="round" />
          {/* Right Arm Extended (PRIMARY DELTOID) */}
          <line x1="130" y1="100" x2="180" y2="90" stroke={secondaryColor} strokeWidth="8" strokeLinecap="round" />
          {/* Right Knee Supporting */}
          <line x1="75" y1="100" x2="75" y2="165" stroke={bodyColor} strokeWidth="9" strokeLinecap="round" />
          {/* Left Leg Extended straight back (GLUTES) */}
          <line x1="70" y1="100" x2="20" y2="95" stroke={primaryColor} strokeWidth="10" strokeLinecap="round" />
          <text x="50" y="65" fill="#64748b" fontSize="10" fontWeight="bold">NEUTRAL SPINE & BALANCE</text>
        </svg>
      );
    case 'lunge':
    case 'reverse-lunge':
      return (
        <svg viewBox="0 0 200 200" width="100%" height="180" style={{ background: '#f8fafc', borderRadius: 12 }}>
          {/* Ground */}
          <line x1="15" y1="180" x2="185" y2="180" stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round" />
          {/* Head */}
          <circle cx="100" cy="45" r="13" fill={bodyColor} />
          {/* Torso Upright */}
          <line x1="100" y1="58" x2="100" y2="105" stroke={secondaryColor} strokeWidth="12" strokeLinecap="round" />
          {/* Hands on hips */}
          <path d="M 100 70 L 115 85 L 102 95" stroke={bodyColor} strokeWidth="6" fill="none" strokeLinecap="round" />
          {/* Front Thigh (Quads & Glutes 90 degrees - PRIMARY) */}
          <line x1="100" y1="105" x2="135" y2="125" stroke={primaryColor} strokeWidth="13" strokeLinecap="round" />
          {/* Front Shin vertical */}
          <line x1="135" y1="125" x2="135" y2="178" stroke={bodyColor} strokeWidth="9" strokeLinecap="round" />
          {/* Back Thigh extending down */}
          <line x1="100" y1="105" x2="70" y2="135" stroke={primaryColor} strokeWidth="12" strokeLinecap="round" />
          {/* Back Shin hovering */}
          <line x1="70" y1="135" x2="65" y2="175" stroke={bodyColor} strokeWidth="8" strokeLinecap="round" />
          <text x="60" y="30" fill="#64748b" fontSize="10" fontWeight="bold">90° KNEE ANGLE</text>
        </svg>
      );
    case 'calf-raise':
      return (
        <svg viewBox="0 0 200 200" width="100%" height="180" style={{ background: '#f8fafc', borderRadius: 12 }}>
          {/* Ground */}
          <line x1="20" y1="180" x2="180" y2="180" stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round" />
          {/* Head */}
          <circle cx="100" cy="40" r="13" fill={bodyColor} />
          {/* Torso straight */}
          <line x1="100" y1="53" x2="100" y2="110" stroke={bodyColor} strokeWidth="12" strokeLinecap="round" />
          {/* Legs straight */}
          <line x1="100" y1="110" x2="100" y2="150" stroke={bodyColor} strokeWidth="11" strokeLinecap="round" />
          {/* Calves elevated onto balls of feet (PRIMARY) */}
          <line x1="100" y1="140" x2="100" y2="170" stroke={primaryColor} strokeWidth="15" strokeLinecap="round" />
          {/* Feet on tiptoes */}
          <line x1="100" y1="170" x2="115" y2="178" stroke="#1e293b" strokeWidth="7" strokeLinecap="round" />
          {/* Up arrow */}
          <path d="M 130 165 L 130 135 M 125 145 L 130 135 L 135 145" stroke={accentColor} strokeWidth="3" fill="none" />
          <text x="55" y="25" fill="#64748b" fontSize="10" fontWeight="bold">LIFT HEELS HIGH</text>
        </svg>
      );
    case 'plank':
    case 'dead-bug':
    case 'side-plank':
      return (
        <svg viewBox="0 0 200 200" width="100%" height="180" style={{ background: '#f8fafc', borderRadius: 12 }}>
          {/* Floor */}
          <line x1="15" y1="165" x2="185" y2="165" stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round" />
          {/* Head */}
          <circle cx="160" cy="115" r="12" fill={bodyColor} />
          {/* Forearm support */}
          <line x1="150" y1="130" x2="150" y2="165" stroke={bodyColor} strokeWidth="8" strokeLinecap="round" />
          <line x1="150" y1="165" x2="170" y2="165" stroke={bodyColor} strokeWidth="7" strokeLinecap="round" />
          {/* Straight Plank Line (PRIMARY TRANSVERSE ABDOMINIS & CORE) */}
          <line x1="150" y1="125" x2="45" y2="148" stroke={primaryColor} strokeWidth="14" strokeLinecap="round" />
          {/* Toes on ground */}
          <line x1="45" y1="148" x2="38" y2="165" stroke="#1e293b" strokeWidth="7" strokeLinecap="round" />
          <text x="40" y="90" fill="#64748b" fontSize="10" fontWeight="bold">STRAIGHT BODY LINE (NO SAGGING)</text>
        </svg>
      );
    case 'cardio':
    case 'walk':
    case 'step-jack':
    case 'stretch':
    default:
      return (
        <svg viewBox="0 0 200 200" width="100%" height="180" style={{ background: '#f8fafc', borderRadius: 12 }}>
          {/* Ground */}
          <line x1="15" y1="180" x2="185" y2="180" stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round" />
          {/* Head */}
          <circle cx="100" cy="42" r="14" fill={bodyColor} />
          {/* Heart / Aerobic Center (PRIMARY CARDIO) */}
          <circle cx="100" cy="80" r="10" fill={primaryColor} />
          {/* Torso */}
          <line x1="100" y1="56" x2="100" y2="110" stroke={secondaryColor} strokeWidth="12" strokeLinecap="round" />
          {/* Dynamic Arms */}
          <line x1="100" y1="70" x2="135" y2="55" stroke={bodyColor} strokeWidth="8" strokeLinecap="round" />
          <line x1="100" y1="70" x2="65" y2="90" stroke={bodyColor} strokeWidth="8" strokeLinecap="round" />
          {/* Legs in stride */}
          <line x1="100" y1="110" x2="130" y2="175" stroke={primaryColor} strokeWidth="10" strokeLinecap="round" />
          <line x1="100" y1="110" x2="70" y2="175" stroke={primaryColor} strokeWidth="10" strokeLinecap="round" />
          <text x="50" y="25" fill="#64748b" fontSize="10" fontWeight="bold">FULL BODY FLOW & ENDURANCE</text>
        </svg>
      );
  }
};

// Complete 7-Day Weekday Beginner Training Database
const WEEK_DAYS = [
  {
    dayNumber: 1,
    dayName: 'Monday',
    title: 'Full Body Activation & Posture Baseline',
    subtitle: 'Waking up the posterior chain, foundational squat mechanics, and spine stabilization',
    focusArea: 'Full Body & Core',
    estimatedMinutes: 20,
    estimatedCalories: 140,
    intensity: 'Gentle / Beginner',
    themeColor: '#2563eb',
    badge: 'Day 1 • Foundation',
    exercises: [
      {
        id: 'd1-e1',
        name: 'Bodyweight Box / Chair Squat',
        svgType: 'squat',
        targetMuscles: ['Quadriceps', 'Gluteus Maximus'],
        stabilizerMuscles: ['Core', 'Hamstrings', 'Calves'],
        repsSets: '3 Sets × 10 Reps',
        restTime: '45s rest',
        workSeconds: 35,
        whyItWorks: 'Squats engage the largest muscle groups in the human body, maximizing caloric burn while training functional knee and hip flexion necessary for everyday movement without back strain.',
        steps: [
          { step: 1, title: 'Starting Stance', desc: 'Stand tall with feet shoulder-width apart, toes pointing slightly outward (10-15 degrees). Keep hands clasped in front of your chest.' },
          { step: 2, title: 'Hip Hinge & Descent', desc: 'Inhale deeply. Push your hips back as if sitting down into an invisible chair. Keep your knees tracking directly over your middle toes.' },
          { step: 3, title: 'Depth Control', desc: 'Descend until your thighs are parallel to the ground (or until you tap a chair). Keep your chest upright and heels firmly planted.' },
          { step: 4, title: 'Power Drive & Exhale', desc: 'Exhale as you press through your entire foot (especially your heels) to return to standing. Squeeze your glutes at the top without hyperextending.' }
        ],
        commonMistakes: [
          'Knees collapsing inward: Push knees outwards in the direction of your pinky toes.',
          'Heels lifting off floor: Keep weight centered over midfoot and heels.',
          'Rounding the lower back: Keep chest proud and core braced.'
        ],
        modifications: {
          easier: 'Sit all the way down onto a sturdy dining chair, pause 1 second, then stand up.',
          harder: 'Slow down tempo: 3 seconds descent, 1 second pause at bottom.'
        }
      },
      {
        id: 'd1-e2',
        name: 'Incline / Wall Push-Ups',
        svgType: 'wall-pushup',
        targetMuscles: ['Pectoralis Major (Chest)', 'Triceps Brachii'],
        stabilizerMuscles: ['Anterior Deltoid (Shoulders)', 'Core Abdominals'],
        repsSets: '3 Sets × 8-10 Reps',
        restTime: '45s rest',
        workSeconds: 30,
        whyItWorks: 'Performing push-ups against a wall or counter removes excessive joint pressure on the wrists and lower back while building the exact pushing strength required for floor push-ups.',
        steps: [
          { step: 1, title: 'Wall Stance', desc: 'Face a sturdy wall roughly arm-length away. Place palms flat against the wall at shoulder height and shoulder-width apart.' },
          { step: 2, title: 'Full Body Alignment', desc: 'Step your feet back 2 feet. Tuck your tailbone and engage your core so your body forms a straight unbroken line from heels to crown.' },
          { step: 3, title: 'Controlled Lowering', desc: 'Inhale as you bend your elbows at a 45-degree angle (arrow shape, not T shape) until your nose or forehead gently touches the wall.' },
          { step: 4, title: 'Press to Lockout', desc: 'Exhale as you push the wall away through your palms, extending your arms back to the starting plank.' }
        ],
        commonMistakes: [
          'Flaring elbows out to 90 degrees: Creates shoulder impingement. Keep elbows angled at 45 degrees.',
          'Sagging hips: Squeeze your glutes and tighten your belly button to spine.'
        ],
        modifications: {
          easier: 'Step closer to the wall for a more upright angle.',
          harder: 'Use a lower surface like a kitchen counter or sofa armrest.'
        }
      },
      {
        id: 'd1-e3',
        name: 'Supine Glute Bridges',
        svgType: 'bridge',
        targetMuscles: ['Gluteus Maximus', 'Hamstrings'],
        stabilizerMuscles: ['Lower Back (Erector Spinae)', 'Transverse Abdominis'],
        repsSets: '3 Sets × 12 Reps',
        restTime: '40s rest',
        workSeconds: 30,
        whyItWorks: 'Counters the negative effects of prolonged sitting by activating dormant glute muscles, improving pelvic stability and eliminating lower back fatigue.',
        steps: [
          { step: 1, title: 'Mat Setup', desc: 'Lie flat on your back with your knees bent and feet flat on the floor, about hip-width apart and 6 inches from your glutes.' },
          { step: 2, title: 'Arm Placement', desc: 'Rest your arms flat by your sides with palms pressing lightly into the floor for support.' },
          { step: 3, title: 'Hip Drive', desc: 'Exhale, drive through your heels, and lift your hips toward the ceiling until knees, hips, and shoulders form a straight ramp.' },
          { step: 4, title: 'Peak Contraction', desc: 'Hold for 2 full seconds at the peak, actively squeezing your glutes tightly, then inhale as you slowly lower down.' }
        ],
        commonMistakes: [
          'Overarching lower back: Lift from the hips and glutes, not by bending your lumbar spine.',
          'Pushing through toes: Keep toes relaxed and drive all power through your heels.'
        ],
        modifications: {
          easier: 'Keep range of motion smaller, lifting hips halfway.',
          harder: 'Single leg glute bridge (extend one leg straight in the air).'
        }
      },
      {
        id: 'd1-e4',
        name: 'Quadruped Bird-Dog',
        svgType: 'bird-dog',
        targetMuscles: ['Erector Spinae', 'Gluteus Medius', 'Deltoids'],
        stabilizerMuscles: ['Rectus Abdominis', 'Obliques', 'Trapezius'],
        repsSets: '3 Sets × 8 Reps per side',
        restTime: '30s rest',
        workSeconds: 40,
        whyItWorks: 'One of the renowned "McGill Big 3" core exercises. Teaches rotational stability and cross-body coordination with near-zero spinal compression.',
        steps: [
          { step: 1, title: 'All-Fours Position', desc: 'Begin on hands and knees. Wrists stacked directly under shoulders, knees stacked directly under hips.' },
          { step: 2, title: 'Core Brace', desc: 'Maintain a neutral spine—imagine balancing a cup of water on your lower back.' },
          { step: 3, title: 'Simultaneous Reach', desc: 'Slowly reach your right arm straight forward and kick your left leg straight back until both are parallel to the floor.' },
          { step: 4, title: 'Hold & Return', desc: 'Hold for 2 seconds while breathing out, then return with control. Alternate to left arm and right leg.' }
        ],
        commonMistakes: [
          'Kicking leg too high: Do not arch back; kick straight back as if stamping a wall with your heel.',
          'Tilting pelvis: Keep both hip bones pointing squarely toward the floor.'
        ],
        modifications: {
          easier: 'Raise only one limb at a time (just arm, then just leg).',
          harder: 'Bring elbow to opposite knee underneath body between reps.'
        }
      }
    ]
  },
  {
    dayNumber: 2,
    dayName: 'Tuesday',
    title: 'Lower Body Foundations & Ankle Mobility',
    subtitle: 'Unilateral leg strength, balance development, and calf/achilles reinforcement',
    focusArea: 'Lower Body & Balance',
    estimatedMinutes: 22,
    estimatedCalories: 155,
    intensity: 'Moderate / Beginner',
    themeColor: '#7c3aed',
    badge: 'Day 2 • Lower Body',
    exercises: [
      {
        id: 'd2-e1',
        name: 'Alternating Reverse Lunges',
        svgType: 'reverse-lunge',
        targetMuscles: ['Quadriceps', 'Gluteus Maximus', 'Hamstrings'],
        stabilizerMuscles: ['Calves', 'Adductors', 'Deep Core'],
        repsSets: '3 Sets × 8 Reps per leg',
        restTime: '45s rest',
        workSeconds: 35,
        whyItWorks: 'Reverse lunges are far easier on beginner knees than forward lunges because your front shin remains vertical and deceleration stress is eliminated.',
        steps: [
          { step: 1, title: 'Tall Posture', desc: 'Stand tall with feet hip-width apart and hands on hips or holding onto a chair back for balance.' },
          { step: 2, title: 'Step Back', desc: 'Take a controlled step backward with your left foot, landing on the ball of the foot.' },
          { step: 3, title: 'Drop Down', desc: 'Bend both knees to 90 degrees until your back knee hovers 1-2 inches above the floor. Keep front knee over ankle.' },
          { step: 4, title: 'Return to Stand', desc: 'Drive through the front right heel to return to standing position. Switch legs.' }
        ],
        commonMistakes: [
          'Front knee sliding past toes: Keep shin vertical.',
          'Leaning torso forward: Keep ribs stacked directly over hips.'
        ],
        modifications: {
          easier: 'Hold onto a wall or doorframe for support.',
          harder: 'Perform walking lunges across a room.'
        }
      },
      {
        id: 'd2-e2',
        name: 'Standing Calf Raises with Peak Squeeze',
        svgType: 'calf-raise',
        targetMuscles: ['Gastrocnemius', 'Soleus (Calf complex)'],
        stabilizerMuscles: ['Anterior Tibialis', 'Foot Arch Musculature'],
        repsSets: '3 Sets × 15 Reps',
        restTime: '30s rest',
        workSeconds: 30,
        whyItWorks: 'Strong calves act as a secondary circulatory pump for venous blood return and protect ankles and knees during walking and stair climbing.',
        steps: [
          { step: 1, title: 'Stance', desc: 'Stand tall near a wall for fingertip balance. Feet pointing straight forward, hip-width apart.' },
          { step: 2, title: 'Elevation', desc: 'Press through the balls of both big toes and lift your heels as high as possible.' },
          { step: 3, title: 'Top Squeeze', desc: 'Pause for 1-2 seconds at the peak contraction, flexing your calf muscles.' },
          { step: 4, title: 'Controlled Descent', desc: 'Slowly lower your heels over 3 seconds back down to the floor.' }
        ],
        commonMistakes: [
          'Rolling ankles outward: Focus pressure evenly across big toe and second toe.',
          'Bouncing fast: Use slow 3-second eccentric lower.'
        ],
        modifications: {
          easier: 'Perform seated on a chair with hands resting on knees.',
          harder: 'Perform on the edge of a step for increased stretch range.'
        }
      },
      {
        id: 'd2-e3',
        name: 'Chair Step-Ups',
        svgType: 'squat',
        targetMuscles: ['Gluteus Maximus', 'Quadriceps'],
        stabilizerMuscles: ['Hamstrings', 'Core Stabilizers'],
        repsSets: '3 Sets × 8 Reps per leg',
        restTime: '45s rest',
        workSeconds: 35,
        whyItWorks: 'Directly mimics stair climbing, correcting muscle imbalances between your left and right leg with zero impact.',
        steps: [
          { step: 1, title: 'Setup', desc: 'Stand in front of a low sturdy step, aerobic box, or bottom staircase step.' },
          { step: 2, title: 'Step Up', desc: 'Place your entire right foot firmly onto the step, making sure no heel hangs off.' },
          { step: 3, title: 'Press Up', desc: 'Drive down through the right heel to stand tall on the step without pushing off with your bottom foot.' },
          { step: 4, title: 'Slow Step Down', desc: 'Step back down under control with the left foot first, maintaining knee alignment.' }
        ],
        commonMistakes: [
          'Springing off the back toe: Make the front leg do 100% of the work.',
          'Inward knee wobble: Keep the knee tracking outward.'
        ],
        modifications: {
          easier: 'Use a lower 4-inch to 6-inch step.',
          harder: 'Add a high knee drive at the top of the step.'
        }
      }
    ]
  },
  {
    dayNumber: 3,
    dayName: 'Wednesday',
    title: 'Active Recovery & Low-Impact Aerobics',
    subtitle: 'Flushing metabolic waste, boosting circulation, and spinal decompression',
    focusArea: 'Cardiovascular & Mobility',
    estimatedMinutes: 25,
    estimatedCalories: 130,
    intensity: 'Low / Restorative',
    themeColor: '#059669',
    badge: 'Day 3 • Active Recovery',
    exercises: [
      {
        id: 'd3-e1',
        name: 'Brisk Walking with Arm Swing Rhythm',
        svgType: 'walk',
        targetMuscles: ['Heart (Myocardium)', 'Calves', 'Quadriceps'],
        stabilizerMuscles: ['Posture Muscles', 'Core', 'Shoulders'],
        repsSets: '1 Continuous Block × 12 Minutes',
        restTime: 'N/A',
        workSeconds: 60,
        whyItWorks: 'Zone 1-2 aerobic conditioning that burns fat without producing central nervous system fatigue or muscle breakdown.',
        steps: [
          { step: 1, title: 'Posture Check', desc: 'Hold head high, shoulders relaxed down and back, chest open.' },
          { step: 2, title: 'Foot Strike', desc: 'Roll smoothly from heel to toe with each stride.' },
          { step: 3, title: 'Arm Action', desc: 'Bend elbows 90 degrees and swing arms gently forward and back in rhythm.' },
          { step: 4, title: 'Breathing Rhythm', desc: 'Breathe in for 3 strides, breathe out for 3 strides.' }
        ],
        commonMistakes: [
          'Looking down at feet: Causes neck strain. Look 15-20 feet forward.',
          'Overstriding: Keep strides natural and quick rather than excessively long.'
        ],
        modifications: {
          easier: 'Walk at a gentle strolling pace.',
          harder: 'Increase pace to power-walk tempo or add a slight incline.'
        }
      },
      {
        id: 'd3-e2',
        name: 'Standing Arm Circles & Torso Twists',
        svgType: 'cardio',
        targetMuscles: ['Rotator Cuff', 'Thoracic Spine', 'Obliques'],
        stabilizerMuscles: ['Scapular Stabilizers', 'Core'],
        repsSets: '2 Sets × 15 Circles each direction',
        restTime: '30s rest',
        workSeconds: 30,
        whyItWorks: 'Lubricates the glenohumeral shoulder joints and frees up rotational mobility throughout the mid-back (thoracic spine).',
        steps: [
          { step: 1, title: 'Arms Extended', desc: 'Stand tall with feet hip-width. Extend arms straight out to the sides at shoulder height, forming a T.' },
          { step: 2, title: 'Small Circles', desc: 'Make small golf-ball sized forward circles for 15 rotations.' },
          { step: 3, title: 'Reverse Circles', desc: 'Reverse direction and make backward circles for 15 rotations.' },
          { step: 4, title: 'Torso Twists', desc: 'Place hands on hips and gently rotate your upper torso side to side, keeping hips facing forward.' }
        ],
        commonMistakes: [
          'Shrugging shoulders into ears: Relax trapezius muscles down.',
          'Twisting knees: Keep movement strictly in mid-spine.'
        ],
        modifications: {
          easier: 'Perform seated comfortably in a chair.',
          harder: 'Hold light water bottles in hands.'
        }
      },
      {
        id: 'd3-e3',
        name: 'Cat-Cow Mobility Flow',
        svgType: 'cat-cow',
        targetMuscles: ['Spinal Extensors', 'Abdominals', 'Neck Flexors'],
        stabilizerMuscles: ['Serratus Anterior', 'Pelvic Floor'],
        repsSets: '2 Sets × 10 Breath Cycles',
        restTime: '30s rest',
        workSeconds: 35,
        whyItWorks: 'Gently articulates every vertebra of the spine from sacrum to skull, releasing tension from prolonged desk work.',
        steps: [
          { step: 1, title: 'Quadruped Setup', desc: 'Hands directly under shoulders, knees under hips on a cushioned mat.' },
          { step: 2, title: 'Cow Pose (Inhale)', desc: 'Inhale, drop your belly toward the mat, lift your chest and gaze gently upward.' },
          { step: 3, title: 'Cat Pose (Exhale)', desc: 'Exhale, round your spine up toward the ceiling, tuck your chin to chest and draw belly in.' },
          { step: 4, title: 'Fluid Rhythm', desc: 'Move smoothly between the two poses synchronized with your breath.' }
        ],
        commonMistakes: [
          'Jerking neck too aggressively: Keep neck movements smooth and gentle.',
          'Holding breath: Coordinate each arch and round with breathing.'
        ],
        modifications: {
          easier: 'Perform seated in a chair, arching and rounding spine with hands on thighs.',
          harder: 'Pause for 3 seconds in maximum Cat contraction.'
        }
      }
    ]
  },
  {
    dayNumber: 4,
    dayName: 'Thursday',
    title: 'Upper Body Push & Pull Mechanics',
    subtitle: 'Chest expansion, scapular retraction, and shoulder stability',
    focusArea: 'Upper Body & Posture',
    estimatedMinutes: 20,
    estimatedCalories: 135,
    intensity: 'Moderate / Beginner',
    themeColor: '#0284c7',
    badge: 'Day 4 • Upper Body',
    exercises: [
      {
        id: 'd4-e1',
        name: 'Doorframe / Towel Body Rows',
        svgType: 'incline-pushup',
        targetMuscles: ['Latissimus Dorsi (Back)', 'Rhomboids', 'Rear Deltoids'],
        stabilizerMuscles: ['Biceps Brachii', 'Core Abdominals'],
        repsSets: '3 Sets × 10 Reps',
        restTime: '45s rest',
        workSeconds: 30,
        whyItWorks: 'Directly counters "text neck" and rounded desk shoulders by pulling shoulder blades together and strengthening mid-back musculature.',
        steps: [
          { step: 1, title: 'Doorframe Grip', desc: 'Stand facing a sturdy open doorway. Grip the doorframe with both hands at chest height.' },
          { step: 2, title: 'Lean Back', desc: 'Walk your toes up to the door base and lean your upper body back until arms are straight.' },
          { step: 3, title: 'Row Movement', desc: 'Exhale and pull your chest toward the doorframe by driving your elbows back and squeezing shoulder blades.' },
          { step: 4, title: 'Controlled Release', desc: 'Inhale as you slowly lower your body back to the straight-arm starting position.' }
        ],
        commonMistakes: [
          'Shrugging shoulders up: Keep shoulder blades depressed down your back.',
          'Bending at hips: Keep body rigid in a moving plank.'
        ],
        modifications: {
          easier: 'Stand more upright with feet further from the door base.',
          harder: 'Step feet closer to door base to increase lean angle.'
        }
      },
      {
        id: 'd4-e2',
        name: 'Overhead Shoulder Press (Light Weight / Bottles)',
        svgType: 'cardio',
        targetMuscles: ['Anterior & Medial Deltoids (Shoulders)', 'Triceps'],
        stabilizerMuscles: ['Upper Trapezius', 'Core Stabilizers'],
        repsSets: '3 Sets × 10 Reps',
        restTime: '40s rest',
        workSeconds: 30,
        whyItWorks: 'Builds overhead lifting capability needed for household chores and strengthens the rotator cuff complex safely.',
        steps: [
          { step: 1, title: 'Starting Position', desc: 'Stand or sit tall. Hold two light dumbbells or full water bottles at ear height, elbows bent 90 degrees.' },
          { step: 2, title: 'Core Brace', desc: 'Squeeze glutes and engage abs so your lower back does not arch.' },
          { step: 3, title: 'Press Up', desc: 'Exhale and press the weights upward in a slight arc until arms are extended overhead.' },
          { step: 4, title: 'Controlled Return', desc: 'Inhale and slowly lower the weights over 2 seconds back to ear height.' }
        ],
        commonMistakes: [
          'Leaning back to push: Keep ribs pinned down.',
          'Flaring elbows backward: Keep elbows slightly forward in the scapular plane.'
        ],
        modifications: {
          easier: 'Perform without weights (empty hands focus on muscle contraction).',
          harder: 'Increase to 3-5 kg dumbbells.'
        }
      },
      {
        id: 'd4-e3',
        name: 'Modified Knee Plank Hold',
        svgType: 'plank',
        targetMuscles: ['Transverse Abdominis (Deep Core)', 'Rectus Abdominis'],
        stabilizerMuscles: ['Shoulders', 'Glutes', 'Serratus Anterior'],
        repsSets: '3 Sets × 20-30s Hold',
        restTime: '45s rest',
        workSeconds: 30,
        whyItWorks: 'Builds isometric endurance across your entire core cylinder without risking lower back strain or disc herniation.',
        steps: [
          { step: 1, title: 'Setup on Knees', desc: 'Lie face down. Place forearms on the floor with elbows directly under shoulders.' },
          { step: 2, title: 'Knee Pivot', desc: 'Keep knees on the floor. Lift hips so body forms a straight line from knees through hips to shoulders.' },
          { step: 3, title: 'Active Tension', desc: 'Pull belly button inward and squeeze glutes tight. Keep neck in line with spine looking down.' },
          { step: 4, title: 'Breathe Smoothly', desc: 'Take calm shallow breaths without letting hips drop or pike up.' }
        ],
        commonMistakes: [
          'Holding your breath: Keep steady rhythmic breathing.',
          'Hips sagging down: Immediately reset if you feel tension in your lower back.'
        ],
        modifications: {
          easier: 'Elevate forearms onto a couch or wall.',
          harder: 'Lift knees off floor into full standard toe plank.'
        }
      }
    ]
  },
  {
    dayNumber: 5,
    dayName: 'Friday',
    title: 'Core Stability & Pelvic Alignment',
    subtitle: 'Deep abdominal engagement, anti-rotation control, and hip abductor strengthening',
    focusArea: 'Core & Hip Stability',
    estimatedMinutes: 20,
    estimatedCalories: 125,
    intensity: 'Gentle / Focused',
    themeColor: '#d97706',
    badge: 'Day 5 • Core Alignment',
    exercises: [
      {
        id: 'd5-e1',
        name: 'The Dead Bug',
        svgType: 'bird-dog',
        targetMuscles: ['Transverse Abdominis', 'Rectus Abdominis', 'Obliques'],
        stabilizerMuscles: ['Hip Flexors', 'Shoulder Girdle'],
        repsSets: '3 Sets × 8 Reps per side',
        restTime: '40s rest',
        workSeconds: 35,
        whyItWorks: 'The ultimate beginner core builder because the floor provides tactile feedback ensuring your lower back remains safely flat.',
        steps: [
          { step: 1, title: 'Supine Position', desc: 'Lie flat on your back on a mat. Raise arms straight up toward ceiling over shoulders.' },
          { step: 2, title: 'Leg Tabletop', desc: 'Bend knees to 90 degrees with shins parallel to the floor (tabletop position).' },
          { step: 3, title: 'Spine Lock', desc: 'Flatten your lower back firmly against the floor—there should be zero gap under your lumbar spine.' },
          { step: 4, title: 'Opposite Extension', desc: 'Exhale as you slowly lower right arm overhead and left leg toward the floor, then return and switch.' }
        ],
        commonMistakes: [
          'Lower back arching off mat: Only lower your limbs as far as you can while keeping back glued down.',
          'Rushing through reps: Perform with slow 3-second cadence.'
        ],
        modifications: {
          easier: 'Keep arms stationary and only tap alternating heels to the floor.',
          harder: 'Straighten legs fully.'
        }
      },
      {
        id: 'd5-e2',
        name: 'Side-Lying Clamshells',
        svgType: 'bridge',
        targetMuscles: ['Gluteus Medius', 'Hip External Rotators'],
        stabilizerMuscles: ['Tensor Fasciae Latae', 'Deep Core'],
        repsSets: '3 Sets × 12 Reps per side',
        restTime: '30s rest',
        workSeconds: 30,
        whyItWorks: 'Specifically isolates the gluteus medius, which is responsible for stabilizing the pelvis and preventing runner knee pain.',
        steps: [
          { step: 1, title: 'Side Lie', desc: 'Lie on your right side with head supported by your right arm. Stack shoulders, hips, and feet.' },
          { step: 2, title: 'Knee Bend', desc: 'Bend knees to 45 degrees, keeping feet glued together.' },
          { step: 3, title: 'Clam Open', desc: 'Keep your feet touching as you lift your left knee as high as possible without rolling your pelvis backward.' },
          { step: 4, title: 'Peak Squeeze & Lower', desc: 'Squeeze the side of your hip for 1 second, then slowly lower. Complete reps and switch sides.' }
        ],
        commonMistakes: [
          'Rolling hips backward: Keep your top hip tilted slightly forward throughout.',
          'Separating the feet: Feet must stay anchored together.'
        ],
        modifications: {
          easier: 'Limit the opening range of motion.',
          harder: 'Loop a light mini-resistance band just above your knees.'
        }
      },
      {
        id: 'd5-e3',
        name: 'Side Plank on Knees',
        svgType: 'side-plank',
        targetMuscles: ['Internal & External Obliques', 'Quadratus Lumborum'],
        stabilizerMuscles: ['Gluteus Medius', 'Shoulder Rotators'],
        repsSets: '2 Sets × 20s Hold per side',
        restTime: '30s rest',
        workSeconds: 25,
        whyItWorks: 'Builds lateral core endurance and strengthens the quadratus lumborum to protect against asymmetric back pain.',
        steps: [
          { step: 1, title: 'Setup', desc: 'Lie on your side. Prop your torso up on your elbow directly below your shoulder. Bend knees to 90 degrees behind you.' },
          { step: 2, title: 'Lift Hips', desc: 'Lift hips off the floor until body forms a straight line from knees to head.' },
          { step: 3, title: 'Hold & Align', desc: 'Place top hand on hip. Keep chest open and do not let your top shoulder roll forward.' },
          { step: 4, title: 'Breathe', desc: 'Hold for 20 seconds while taking controlled breaths, then switch sides.' }
        ],
        commonMistakes: [
          'Elbow placed too far out: Place elbow directly under shoulder socket.',
          'Hips sagging down: Actively push the bottom hip upward.'
        ],
        modifications: {
          easier: 'Hold for 10-15 seconds per side.',
          harder: 'Straighten legs into full feet side plank.'
        }
      }
    ]
  },
  {
    dayNumber: 6,
    dayName: 'Saturday',
    title: 'Fun Low-Impact Cardio & Aerobic Stamina',
    subtitle: 'Joint-friendly fat burning, coordination agility, and heart rate elevation',
    focusArea: 'Cardio Stamina & Agility',
    estimatedMinutes: 25,
    estimatedCalories: 175,
    intensity: 'Moderate / Energizing',
    themeColor: '#ea580c',
    badge: 'Day 6 • Cardio Stamina',
    exercises: [
      {
        id: 'd6-e1',
        name: 'Step Jacks (Low-Impact Jumping Jacks)',
        svgType: 'step-jack',
        targetMuscles: ['Heart & Cardiovascular System', 'Calves', 'Deltoids'],
        stabilizerMuscles: ['Gluteus Medius', 'Core'],
        repsSets: '3 Sets × 45 Seconds',
        restTime: '30s rest',
        workSeconds: 45,
        whyItWorks: 'Delivers all the aerobic calorie burning benefits of jumping jacks with zero jumping impact on knees, hips, or ankles.',
        steps: [
          { step: 1, title: 'Start Stance', desc: 'Stand tall with feet together and arms resting at your sides.' },
          { step: 2, title: 'Step Right', desc: 'Step your right foot wide to the side while simultaneously sweeping both arms overhead.' },
          { step: 3, title: 'Step Back', desc: 'Step your right foot back to center as arms return to sides.' },
          { step: 4, title: 'Step Left', desc: 'Immediately step your left foot wide to the side while sweeping arms overhead. Continue alternating with a brisk rhythm.' }
        ],
        commonMistakes: [
          'Slouching: Keep spine tall and posture proud.',
          'Heavy stomping: Land softly on the ball of the stepping foot.'
        ],
        modifications: {
          easier: 'Raise arms only to shoulder height.',
          harder: 'Add a slight knee bend/squat on each lateral step.'
        }
      },
      {
        id: 'd6-e2',
        name: 'Shadow Boxing & Speed Punches',
        svgType: 'cardio',
        targetMuscles: ['Deltoids', 'Pectorals', 'Core Rotators'],
        stabilizerMuscles: ['Lats', 'Legs (Athletic Stance)'],
        repsSets: '3 Sets × 40 Seconds',
        restTime: '30s rest',
        workSeconds: 40,
        whyItWorks: 'Engages the upper body and rotational core musculature while ramping up heart rate in an engaging, stress-relieving format.',
        steps: [
          { step: 1, title: 'Boxing Stance', desc: 'Stand with feet staggered, knees soft and bouncy. Hands up guarding your chin.' },
          { step: 2, title: 'Jab (Lead Hand)', desc: 'Extend your front hand straight out with a quick punch, rotating your wrist so palm faces down.' },
          { step: 3, title: 'Cross (Rear Hand)', desc: 'Pivot off your back foot and throw your power cross, engaging your hips and core.' },
          { step: 4, title: 'Rhythmic Flow', desc: 'Snap punches back to chin quickly and keep a steady 1-2 rhythm.' }
        ],
        commonMistakes: [
          'Hyperextending elbows: Never lock elbows violently; keep a micro-bend at full extension.',
          'Feet flat: Stay light and agile on the balls of your feet.'
        ],
        modifications: {
          easier: 'Punch at a slower tempo while seated.',
          harder: 'Add bob and weave knee dips between punch combinations.'
        }
      },
      {
        id: 'd6-e3',
        name: 'High-Knee March in Place',
        svgType: 'cardio',
        targetMuscles: ['Hip Flexors (Psoas)', 'Rectus Abdominis', 'Calves'],
        stabilizerMuscles: ['Glutes', 'Postural Muscles'],
        repsSets: '3 Sets × 45 Seconds',
        restTime: '30s rest',
        workSeconds: 45,
        whyItWorks: 'Strengthens hip flexors and deep lower abdominals while elevating calorie burn without any landing shock.',
        steps: [
          { step: 1, title: 'Upright March', desc: 'Stand tall with core braced and hands ready at waist height.' },
          { step: 2, title: 'Knee Drive', desc: 'Drive your right knee up toward hip height while pumping your opposite left arm forward.' },
          { step: 3, title: 'Soft Landing', desc: 'Place right foot down softly and immediately drive left knee up with right arm forward.' },
          { step: 4, title: 'Pace Control', desc: 'Maintain a steady, energetic marching rhythm.' }
        ],
        commonMistakes: [
          'Leaning backward: Stay upright or slightly hinged forward.',
          'Stomping: Land lightly on midfoot.'
        ],
        modifications: {
          easier: 'Lift knees to 45 degrees instead of hip height.',
          harder: 'Add a gentle bounce or increase tempo to high knee jog.'
        }
      }
    ]
  },
  {
    dayNumber: 7,
    dayName: 'Sunday',
    title: 'Mindful Recovery, Full Body Flexibility & Decompression',
    subtitle: 'Cellular tissue repair, nervous system down-regulation, and deep fascia release',
    focusArea: 'Full Recovery & Flexibility',
    estimatedMinutes: 18,
    estimatedCalories: 75,
    intensity: 'Relaxing / Restorative',
    themeColor: '#475569',
    badge: 'Day 7 • Mindful Rest',
    exercises: [
      {
        id: 'd7-e1',
        name: 'Extended Child’s Pose (Balasana)',
        svgType: 'stretch',
        targetMuscles: ['Latissimus Dorsi', 'Spine Extensors', 'Hips'],
        stabilizerMuscles: ['Shoulder Girdle', 'Ankles'],
        repsSets: '3 Holds × 45 Seconds',
        restTime: '15s rest',
        workSeconds: 45,
        whyItWorks: 'Gently stretches the entire back and hips while stimulating the parasympathetic (rest & digest) nervous system.',
        steps: [
          { step: 1, title: 'Kneeling Mat', desc: 'Kneel on your mat. Bring big toes together and separate knees as wide as the mat.' },
          { step: 2, title: 'Hips to Heels', desc: 'Sit your hips back toward your heels.' },
          { step: 3, title: 'Walk Hands Out', desc: 'Walk your hands forward along the mat, lowering your chest between your thighs and resting your forehead gently on the ground.' },
          { step: 4, title: 'Deep Breathing', desc: 'Inhale through your nose into your ribcage; exhale slowly through your mouth, letting your chest melt into the floor.' }
        ],
        commonMistakes: [
          'Forcing hips down if knees hurt: Place a pillow or folded blanket under your knees or behind your thighs.',
          'Holding breath: Relax your jaw and breathe deeply.'
        ],
        modifications: {
          easier: 'Place a bolster or pillow beneath your chest for supported elevation.',
          harder: 'Walk hands gently to the right for 20s, then to the left for lateral lat stretch.'
        }
      },
      {
        id: 'd7-e2',
        name: 'Gentle Cobra / Sphinx Stretch',
        svgType: 'stretch',
        targetMuscles: ['Abdominals', 'Chest (Pectorals)'],
        stabilizerMuscles: ['Lower Back Extensors', 'Glutes'],
        repsSets: '3 Holds × 30 Seconds',
        restTime: '20s rest',
        workSeconds: 30,
        whyItWorks: 'Reverses forward hunched posture by opening up the chest, expanding lung capacity, and extending the thoracic spine.',
        steps: [
          { step: 1, title: 'Prone Position', desc: 'Lie flat on your stomach with legs extended straight behind you.' },
          { step: 2, title: 'Forearm Position', desc: 'Place forearms flat on the floor, elbows directly under your shoulders (Sphinx pose).' },
          { step: 3, title: 'Chest Lift', desc: 'Press through forearms and gently lift your chest and collarbones forward and up.' },
          { step: 4, title: 'Relaxed Shoulders', desc: 'Roll shoulders away from ears, gaze forward, and take slow belly breaths.' }
        ],
        commonMistakes: [
          'Cramping lower back: Do not push too high. Keep pubic bone grounded into mat.',
          'Craning neck backward: Keep gaze neutral and neck long.'
        ],
        modifications: {
          easier: 'Keep chest lower to the ground with hands wider.',
          harder: 'Press into palms to straighten arms into full Cobra stretch.'
        }
      },
      {
        id: 'd7-e3',
        name: 'Supine Figure-4 Piriformis Stretch',
        svgType: 'bridge',
        targetMuscles: ['Piriformis', 'Gluteus Medius', 'IT Band'],
        stabilizerMuscles: ['Lower Back', 'Hamstrings'],
        repsSets: '2 Holds × 40 Seconds per leg',
        restTime: '20s rest',
        workSeconds: 40,
        whyItWorks: 'Releases deep hip rotators and the piriformis muscle, preventing sciatic nerve irritation and maintaining hip joint health.',
        steps: [
          { step: 1, title: 'Lie Flat', desc: 'Lie on your back with knees bent and feet flat on the floor.' },
          { step: 2, title: 'Cross Ankle', desc: 'Cross your right ankle over your left knee, creating a "figure 4" shape.' },
          { step: 3, title: 'Draw Knee In', desc: 'Reach your hands around your left hamstring and gently pull your left knee toward your chest.' },
          { step: 4, title: 'Hold & Savor', desc: 'Feel a deep, relaxing stretch through your outer right hip and glute. Hold for 40 seconds, then switch.' }
        ],
        commonMistakes: [
          'Lifting shoulders/head off floor: Keep head rested on a pillow if needed.',
          'Twisting knee joint: Flex your right foot to protect the knee joint.'
        ],
        modifications: {
          easier: 'Keep left foot resting on the floor and gently press right knee away with hand.',
          harder: 'Gently extend left leg straight up while holding hamstring.'
        }
      }
    ]
  }
];

export default function BeginnerPlan() {
  const [selectedDay, setSelectedDay] = useState(0);
  const [filterFocus, setFilterFocus] = useState('All');
  const [workoutRunnerOpen, setWorkoutRunnerOpen] = useState(false);
  const [activeExerciseIndex, setActiveExerciseIndex] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(30);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [completedExercises, setCompletedExercises] = useState({});
  const [loggingStatus, setLoggingStatus] = useState(null); // 'saving', 'success', 'error'
  const timerRef = useRef(null);

  // 🎙️ UNIQUE FEATURE 1: AI Voice Audio Coach (Web Speech API)
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  // 🥁 UNIQUE FEATURE 2: Real-time Cadence Metronome (Web Audio API)
  const [metronomeBpm, setMetronomeBpm] = useState(0); // 0 = off, 60, 100, 120
  const metronomeRef = useRef(null);
  const audioCtxRef = useRef(null);

  // 🏆 UNIQUE FEATURE 3: Shareable Workout Achievement Certificate (Canvas)
  const [certificateModalOpen, setCertificateModalOpen] = useState(false);
  const canvasRef = useRef(null);

  // 🧮 UNIQUE FEATURE 4: Nutrition Macro & Target Heart Rate Zones Tool
  const [calculatorModalOpen, setCalculatorModalOpen] = useState(false);
  const [userWeight, setUserWeight] = useState(70);
  const [userAge, setUserAge] = useState(25);
  const [userGoal, setUserGoal] = useState('fat_loss'); // 'fat_loss', 'muscle', 'maintenance'

  const currentDayData = WEEK_DAYS[selectedDay];

  // Voice AI Coaching Announcements
  const speakCue = (text) => {
    if (!voiceEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.02;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch {
      // Audio speech synthesis not permitted or unavailable
    }
  };

  // Metronome tick generator via Web Audio API
  const playMetronomeTick = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1000, ctx.currentTime);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch {
      // Audio context restricted
    }
  };

  useEffect(() => {
    if (metronomeBpm > 0 && isTimerRunning) {
      const intervalMs = (60 / metronomeBpm) * 1000;
      metronomeRef.current = setInterval(playMetronomeTick, intervalMs);
    } else {
      clearInterval(metronomeRef.current);
    }
    return () => clearInterval(metronomeRef.current);
  }, [metronomeBpm, isTimerRunning]);

  // Filter exercises if focus filter is applied
  const filteredExercises = currentDayData.exercises.filter((ex) => {
    if (filterFocus === 'All') return true;
    if (filterFocus === 'Core') return ex.targetMuscles.some(m => m.toLowerCase().includes('core') || m.toLowerCase().includes('abdominis') || m.toLowerCase().includes('spine'));
    if (filterFocus === 'Legs') return ex.targetMuscles.some(m => m.toLowerCase().includes('quad') || m.toLowerCase().includes('glute') || m.toLowerCase().includes('hamstring') || m.toLowerCase().includes('calf'));
    if (filterFocus === 'Upper') return ex.targetMuscles.some(m => m.toLowerCase().includes('chest') || m.toLowerCase().includes('back') || m.toLowerCase().includes('deltoid') || m.toLowerCase().includes('tricep'));
    if (filterFocus === 'Cardio') return ex.targetMuscles.some(m => m.toLowerCase().includes('heart') || m.toLowerCase().includes('cardio') || m.toLowerCase().includes('flow'));
    return true;
  });

  // Sound chime via Web Audio API for timer completion
  const playChime = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.5);
    } catch {
      // Audio not permitted or not supported
    }
  };

  // Timer logic for Guided Workout Runner with Voice AI cues
  useEffect(() => {
    if (isTimerRunning && timerSeconds > 0) {
      const totalWork = currentDayData.exercises[activeExerciseIndex]?.workSeconds || 30;
      const halfway = Math.floor(totalWork / 2);

      if (timerSeconds === halfway && halfway > 5) {
        speakCue('Halfway mark! Keep your core tight and maintain steady breathing.');
      } else if (timerSeconds === 3) {
        speakCue('Three');
      } else if (timerSeconds === 2) {
        speakCue('Two');
      } else if (timerSeconds === 1) {
        speakCue('One');
      }

      timerRef.current = setTimeout(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (isTimerRunning && timerSeconds === 0) {
      setIsTimerRunning(false);
      playChime();
      speakCue('Set complete! Excellent work. Rest or proceed to next exercise.');
    }
    return () => clearTimeout(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTimerRunning, timerSeconds]);

  const handleStartGuidedWorkout = () => {
    setActiveExerciseIndex(0);
    const firstEx = currentDayData.exercises[0];
    setTimerSeconds(firstEx.workSeconds || 30);
    setIsTimerRunning(true);
    setWorkoutRunnerOpen(true);
    speakCue(`Starting ${firstEx.name}. ${firstEx.steps[0]?.desc || ''}`);
  };

  const handleNextExercise = () => {
    const nextIdx = activeExerciseIndex + 1;
    // Mark current as completed
    const curId = currentDayData.exercises[activeExerciseIndex]?.id;
    if (curId) {
      setCompletedExercises((prev) => ({ ...prev, [curId]: true }));
    }

    if (nextIdx < currentDayData.exercises.length) {
      setActiveExerciseIndex(nextIdx);
      const nextEx = currentDayData.exercises[nextIdx];
      setTimerSeconds(nextEx.workSeconds || 30);
      setIsTimerRunning(true);
      speakCue(`Next exercise: ${nextEx.name}. ${nextEx.steps[0]?.desc || ''}`);
    } else {
      setIsTimerRunning(false);
      speakCue(`Congratulations! You completed all exercises for ${currentDayData.dayName}!`);
      // Auto log completion
      handleLogWorkoutToProfile();
    }
  };

  const handlePrevExercise = () => {
    if (activeExerciseIndex > 0) {
      const prevIdx = activeExerciseIndex - 1;
      setActiveExerciseIndex(prevIdx);
      const prevEx = currentDayData.exercises[prevIdx];
      setTimerSeconds(prevEx.workSeconds || 30);
      setIsTimerRunning(false);
      speakCue(`Returned to ${prevEx.name}.`);
    }
  };

  // 1-Click Workout Logger directly to backend microservices
  const handleLogWorkoutToProfile = async () => {
    setLoggingStatus('saving');
    try {
      const activityTypeMap = {
        0: 'WEIGHT_TRAINING', // Day 1: Full body
        1: 'WEIGHT_TRAINING', // Day 2: Lower body
        2: 'WALKING',         // Day 3: Active recovery walk
        3: 'WEIGHT_TRAINING', // Day 4: Upper body
        4: 'WEIGHT_TRAINING', // Day 5: Core
        5: 'CARDIO',          // Day 6: Aerobic stamina
        6: 'STRETCHING'       // Day 7: Flexibility & recovery
      };

      const activityPayload = {
        type: activityTypeMap[selectedDay] || 'WALKING',
        duration: currentDayData.estimatedMinutes,
        caloriesBurned: currentDayData.estimatedCalories,
        additionalMetrics: {
          workoutTitle: `${currentDayData.dayName}: ${currentDayData.title}`,
          focusArea: currentDayData.focusArea,
          intensity: currentDayData.intensity,
          completedDay: currentDayData.dayNumber,
          notes: 'Completed full beginner guided training session with posture adherence.'
        }
      };
      await addActivity(activityPayload);
      setLoggingStatus('success');
      // Mark all exercises of current day completed
      const markAll = {};
      currentDayData.exercises.forEach(ex => {
        markAll[ex.id] = true;
      });
      setCompletedExercises(prev => ({ ...prev, ...markAll }));
    } catch (err) {
      console.error('Error logging workout activity:', err);
      setLoggingStatus('error');
    }
  };

  // Certificate generator using HTML5 Canvas
  const generateCertificate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = 1200;
    canvas.height = 800;

    // Background Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 1200, 800);
    bgGrad.addColorStop(0, '#0f172a');
    bgGrad.addColorStop(0.5, '#1e293b');
    bgGrad.addColorStop(1, '#0f172a');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1200, 800);

    // Gold Outer Border
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 14;
    ctx.strokeRect(30, 30, 1140, 740);

    // Cyan Inner Accent Border
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.strokeRect(50, 50, 1100, 700);

    // Header Branding
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 24px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('⚡ FITPULSE AI HEALTH & ATHLETICS', 600, 120);

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 44px sans-serif';
    ctx.fillText('OFFICIAL WORKOUT COMPLETION CERTIFICATE', 600, 185);

    // Subtitle
    ctx.fillStyle = '#94a3b8';
    ctx.font = '20px sans-serif';
    ctx.fillText('This official credential recognizes dedicated training and form adherence in:', 600, 230);

    // Workout Name
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText(`Day ${currentDayData.dayNumber}: ${currentDayData.title}`, 600, 300);

    // Focus Area & Intensity
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText(`Focus: ${currentDayData.focusArea}  •  Intensity: ${currentDayData.intensity}`, 600, 345);

    // Stats Grid Box
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.fillRect(200, 390, 800, 130);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.strokeRect(200, 390, 800, 130);

    // Stats Items
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 32px sans-serif';
    ctx.fillText(`⏱️ ${currentDayData.estimatedMinutes} MIN`, 330, 450);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '16px sans-serif';
    ctx.fillText('TRAINING DURATION', 330, 485);

    ctx.fillStyle = '#f97316';
    ctx.font = 'bold 32px sans-serif';
    ctx.fillText(`🔥 ${currentDayData.estimatedCalories} KCAL`, 600, 450);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '16px sans-serif';
    ctx.fillText('ESTIMATED BURN', 600, 485);

    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 32px sans-serif';
    ctx.fillText(`🎯 ${currentDayData.exercises.length} MOVES`, 870, 450);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '16px sans-serif';
    ctx.fillText('DRILLS COMPLETED', 870, 485);

    // Date & Signature
    const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '18px sans-serif';
    ctx.fillText(`Issued: ${today}`, 350, 610);
    ctx.fillText('Verified: FitPulse AI Microservice Engine', 850, 610);

    // Gold Medal Seal
    ctx.beginPath();
    ctx.arc(600, 630, 45, 0, Math.PI * 2);
    ctx.fillStyle = '#f59e0b';
    ctx.fill();
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 30px sans-serif';
    ctx.fillText('★', 600, 642);
  };

  const handleOpenCertificateModal = () => {
    setCertificateModalOpen(true);
    setTimeout(generateCertificate, 150);
  };

  const handleDownloadCertificate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `FitPulse_Certificate_${currentDayData.dayName}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <Box sx={{ width: '100%', pb: 6 }}>
      {/* Top Hero Banner */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, sm: 4 },
          borderRadius: 3.5,
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          color: '#ffffff',
          mb: 3.5,
          boxShadow: '0 10px 30px rgba(15, 23, 42, 0.15)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
            <Chip
              label="BEGINNER FOUNDATION PROGRAM"
              size="small"
              sx={{ bgcolor: '#2563eb', color: '#fff', fontWeight: 800, fontSize: '0.72rem', letterSpacing: 0.5 }}
            />
            <Chip
              label="7-DAY PROGRESSION"
              size="small"
              variant="outlined"
              sx={{ color: '#93c5fd', borderColor: '#3b82f6', fontWeight: 700, fontSize: '0.72rem' }}
            />
          </Stack>

          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, letterSpacing: -0.5 }}>
            Beginner’s Complete Weekday Exercise Guide 🏋️‍♂️
          </Typography>

          <Typography variant="body1" sx={{ color: '#cbd5e1', maxWidth: 780, lineHeight: 1.6, mb: 3 }}>
            New to fitness or resuming training after a break? Follow our day-by-day structured weekly schedule.
            Every movement includes step-by-step posture instructions, visual diagrams, targeted muscle maps,
            form checklists, and common mistakes to avoid.
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }} flexWrap="wrap" sx={{ gap: 1.5 }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleStartGuidedWorkout}
              sx={{
                bgcolor: '#2563eb',
                color: '#fff',
                fontWeight: 700,
                textTransform: 'none',
                borderRadius: 2.5,
                px: 3,
                py: 1.2,
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
                '&:hover': { bgcolor: '#1d4ed8' }
              }}
            >
              ▶️ Start Guided Workout ({currentDayData.dayName})
            </Button>

            <Button
              variant="outlined"
              size="large"
              onClick={handleLogWorkoutToProfile}
              disabled={loggingStatus === 'saving'}
              sx={{
                borderColor: '#38bdf8',
                color: '#38bdf8',
                fontWeight: 700,
                textTransform: 'none',
                borderRadius: 2.5,
                px: 2.5,
                py: 1.2,
                '&:hover': { borderColor: '#7dd3fc', bgcolor: 'rgba(56, 189, 248, 0.1)' }
              }}
            >
              {loggingStatus === 'saving' ? 'Logging to Profile...' : '✅ Complete & Log Workout'}
            </Button>

            <Button
              variant="contained"
              size="large"
              onClick={handleOpenCertificateModal}
              sx={{
                bgcolor: '#f59e0b',
                color: '#0f172a',
                fontWeight: 800,
                textTransform: 'none',
                borderRadius: 2.5,
                px: 2.5,
                py: 1.2,
                boxShadow: '0 4px 14px rgba(245, 158, 11, 0.3)',
                '&:hover': { bgcolor: '#d97706' }
              }}
            >
              🏆 Milestone Certificate
            </Button>

            <Button
              variant="outlined"
              size="large"
              onClick={() => setCalculatorModalOpen(true)}
              sx={{
                borderColor: '#a855f7',
                color: '#d8b4fe',
                fontWeight: 700,
                textTransform: 'none',
                borderRadius: 2.5,
                px: 2.5,
                py: 1.2,
                '&:hover': { borderColor: '#c084fc', bgcolor: 'rgba(168, 85, 247, 0.1)' }
              }}
            >
              🧮 Macro & HR Zones
            </Button>
          </Stack>

          {loggingStatus === 'success' && (
            <Alert severity="success" sx={{ mt: 2.5, borderRadius: 2, maxWidth: 650 }}>
              🎉 <strong>Workout Logged!</strong> Day {currentDayData.dayNumber} ({currentDayData.dayName}) has been added to your fitness activities and synchronized with your AI Coach dashboard!
            </Alert>
          )}
          {loggingStatus === 'error' && (
            <Alert severity="warning" sx={{ mt: 2.5, borderRadius: 2, maxWidth: 650 }}>
              Could not reach the backend activity service directly. Ensure your API Gateway is running on port 8085.
            </Alert>
          )}
        </Box>
      </Paper>

      {/* 7-Day Weekday Tab Selector */}
      <Card sx={{ borderRadius: 3, mb: 3.5, border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <Tabs
          value={selectedDay}
          onChange={(e, val) => {
            setSelectedDay(val);
            setLoggingStatus(null);
          }}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            px: 2,
            pt: 1,
            '& .MuiTab-root': {
              fontWeight: 700,
              textTransform: 'none',
              fontSize: '0.92rem',
              py: 1.6,
              borderRadius: 2,
              mr: 1
            }
          }}
        >
          {WEEK_DAYS.map((day, idx) => (
            <Tab
              key={day.dayNumber}
              label={
                <Stack direction="row" spacing={1} alignItems="center">
                  <span>{day.dayName.substring(0, 3)}</span>
                  <Chip
                    label={`Day ${day.dayNumber}`}
                    size="small"
                    sx={{
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      bgcolor: selectedDay === idx ? day.themeColor : '#f1f5f9',
                      color: selectedDay === idx ? '#fff' : '#64748b'
                    }}
                  />
                </Stack>
              }
            />
          ))}
        </Tabs>
      </Card>

      {/* Selected Day Overview & Metrics Card */}
      <Card sx={{ borderRadius: 3.5, mb: 3.5, border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
        <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ md: 'center' }} spacing={2} sx={{ mb: 2 }}>
            <Box>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                <Chip
                  label={currentDayData.badge}
                  size="small"
                  sx={{ bgcolor: `${currentDayData.themeColor}15`, color: currentDayData.themeColor, fontWeight: 800 }}
                />
                <Chip
                  label={currentDayData.focusArea}
                  size="small"
                  variant="outlined"
                  sx={{ fontWeight: 700, color: '#475569' }}
                />
              </Stack>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', mb: 0.5 }}>
                {currentDayData.dayName}: {currentDayData.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {currentDayData.subtitle}
              </Typography>
            </Box>

            {/* Quick Metrics */}
            <Stack direction="row" spacing={2} sx={{ bgcolor: '#f8fafc', p: 1.8, borderRadius: 2.5, border: '1px solid #e2e8f0' }}>
              <Box sx={{ textAlign: 'center', minWidth: 70 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                  TIME
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>
                  {currentDayData.estimatedMinutes}m
                </Typography>
              </Box>
              <Divider orientation="vertical" flexItem />
              <Box sx={{ textAlign: 'center', minWidth: 70 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                  EST. BURN
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#ea580c' }}>
                  ~{currentDayData.estimatedCalories} kcal
                </Typography>
              </Box>
              <Divider orientation="vertical" flexItem />
              <Box sx={{ textAlign: 'center', minWidth: 80 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                  INTENSITY
                </Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#059669', mt: 0.5 }}>
                  {currentDayData.intensity}
                </Typography>
              </Box>
            </Stack>
          </Stack>

          {/* Muscle Focus Filter Buttons */}
          <Divider sx={{ my: 2 }} />
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', mr: 1 }}>
              FILTER MUSCLE GROUP:
            </Typography>
            {['All', 'Legs', 'Upper', 'Core', 'Cardio'].map((cat) => (
              <Chip
                key={cat}
                label={cat}
                clickable
                onClick={() => setFilterFocus(cat)}
                size="small"
                variant={filterFocus === cat ? 'filled' : 'outlined'}
                sx={{
                  fontWeight: 700,
                  bgcolor: filterFocus === cat ? '#2563eb' : 'transparent',
                  color: filterFocus === cat ? '#fff' : '#475569',
                  borderColor: '#cbd5e1'
                }}
              />
            ))}
          </Stack>
        </CardContent>
      </Card>

      {/* Exercises Detailed Cards Grid */}
      <Grid2 container spacing={3.5}>
        {filteredExercises.map((exercise, idx) => {
          const isDone = completedExercises[exercise.id];
          return (
            <Grid2 size={{ xs: 12 }} key={exercise.id}>
              <Card
                sx={{
                  borderRadius: 3.5,
                  border: isDone ? '2px solid #10b981' : '1px solid #e2e8f0',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                  overflow: 'hidden',
                  transition: 'all 0.2s ease',
                  '&:hover': { boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }
                }}
              >
                <Grid2 container>
                  {/* Left Column: Visual SVG Diagram & Anatomy Badges */}
                  <Grid2 size={{ xs: 12, md: 4.5 }} sx={{ bgcolor: '#f8fafc', p: 3, borderRight: { md: '1px solid #e2e8f0' } }}>
                    <Stack spacing={2}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Chip
                          label={`Exercise ${idx + 1} of ${currentDayData.exercises.length}`}
                          size="small"
                          sx={{ fontWeight: 800, bgcolor: '#e2e8f0', color: '#334155' }}
                        />
                        {isDone ? (
                          <Chip label="Completed ✓" size="small" color="success" sx={{ fontWeight: 800 }} />
                        ) : (
                          <Chip label={exercise.repsSets} size="small" variant="outlined" sx={{ fontWeight: 700 }} />
                        )}
                      </Box>

                      {/* Visual Posture Diagram */}
                      <Box sx={{ p: 1, bgcolor: '#ffffff', borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}>
                        <ExerciseSvg type={exercise.svgType} />
                      </Box>

                      {/* Targeted Muscle Breakdown */}
                      <Box>
                        <Typography variant="caption" sx={{ fontWeight: 800, color: '#f97316', letterSpacing: 0.5, display: 'block', mb: 0.8 }}>
                          🎯 PRIMARY TARGET MUSCLES (WHAT IT WORKS):
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 0.8, mb: 1.5 }}>
                          {exercise.targetMuscles.map((muscle) => (
                            <Chip
                              key={muscle}
                              label={muscle}
                              size="small"
                              sx={{ bgcolor: '#ffedd5', color: '#c2410c', fontWeight: 700, fontSize: '0.75rem' }}
                            />
                          ))}
                        </Stack>

                        <Typography variant="caption" sx={{ fontWeight: 800, color: '#8b5cf6', letterSpacing: 0.5, display: 'block', mb: 0.8 }}>
                          🛡️ STABILIZER & SECONDARY MUSCLES:
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 0.8 }}>
                          {exercise.stabilizerMuscles.map((muscle) => (
                            <Chip
                              key={muscle}
                              label={muscle}
                              size="small"
                              sx={{ bgcolor: '#f3e8ff', color: '#6b21a8', fontWeight: 700, fontSize: '0.75rem' }}
                            />
                          ))}
                        </Stack>
                      </Box>

                      <Box sx={{ p: 1.5, bgcolor: '#eff6ff', borderRadius: 2, border: '1px solid #bfdbfe' }}>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: '#1e40af', display: 'block' }}>
                          💡 Why It’s Ideal for Beginners:
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#1e3a8a', lineHeight: 1.4 }}>
                          {exercise.whyItWorks}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid2>

                  {/* Right Column: Step-by-Step Instructions & Form Checklist */}
                  <Grid2 size={{ xs: 12, md: 7.5 }} sx={{ p: { xs: 2.5, sm: 3.5 } }}>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', mb: 1 }}>
                      {exercise.name}
                    </Typography>

                    <Stack direction="row" spacing={2} sx={{ mb: 2.5 }}>
                      <Chip label={`Rest: ${exercise.restTime}`} size="small" variant="outlined" sx={{ fontWeight: 600 }} />
                      <Chip label={`Pace: Controlled (3s cadence)`} size="small" variant="outlined" sx={{ fontWeight: 600 }} />
                    </Stack>

                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#334155', mb: 1.5 }}>
                      📋 Step-by-Step Execution Guide:
                    </Typography>

                    <Stack spacing={1.8} sx={{ mb: 3 }}>
                      {exercise.steps.map((s) => (
                        <Box
                          key={s.step}
                          sx={{
                            display: 'flex',
                            gap: 1.8,
                            p: 1.5,
                            borderRadius: 2.5,
                            bgcolor: '#f8fafc',
                            border: '1px solid #f1f5f9'
                          }}
                        >
                          <Box
                            sx={{
                              width: 28,
                              height: 28,
                              borderRadius: '50%',
                              bgcolor: '#2563eb',
                              color: '#fff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 800,
                              fontSize: '0.8rem',
                              flexShrink: 0
                            }}
                          >
                            {s.step}
                          </Box>
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.88rem' }}>
                              {s.title}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#475569', lineHeight: 1.5, fontSize: '0.84rem' }}>
                              {s.desc}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Stack>

                    {/* Common Mistakes & Fixes Accordion */}
                    <Accordion
                      elevation={0}
                      sx={{
                        border: '1px solid #fee2e2',
                        bgcolor: '#fff5f5',
                        borderRadius: '12px !important',
                        mb: 2,
                        '&:before': { display: 'none' }
                      }}
                    >
                      <AccordionSummary expandIcon={<span>▼</span>}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#b91c1c' }}>
                          ⚠️ Common Beginner Mistakes & How to Fix Them
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails sx={{ pt: 0 }}>
                        <Stack spacing={1}>
                          {exercise.commonMistakes.map((err, i) => (
                            <Typography key={i} variant="body2" sx={{ color: '#7f1d1d', fontSize: '0.82rem' }}>
                              • {err}
                            </Typography>
                          ))}
                        </Stack>
                      </AccordionDetails>
                    </Accordion>

                    {/* Modifications (Easier vs Harder) */}
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        bgcolor: '#f8fafc',
                        borderRadius: 2.5,
                        border: '1px solid #e2e8f0',
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        gap: 2
                      }}
                    >
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="caption" sx={{ fontWeight: 800, color: '#059669', display: 'block', mb: 0.5 }}>
                          🟢 EASIER REGRESSION:
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#334155', fontSize: '0.82rem' }}>
                          {exercise.modifications.easier}
                        </Typography>
                      </Box>
                      <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="caption" sx={{ fontWeight: 800, color: '#2563eb', display: 'block', mb: 0.5 }}>
                          🔵 HARDER PROGRESSION:
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#334155', fontSize: '0.82rem' }}>
                          {exercise.modifications.harder}
                        </Typography>
                      </Box>
                    </Paper>

                    {/* Mark Done Button */}
                    <Box sx={{ mt: 2.5, textAlign: 'right' }}>
                      <Button
                        variant={isDone ? 'outlined' : 'contained'}
                        color={isDone ? 'success' : 'primary'}
                        size="small"
                        onClick={() => {
                          setCompletedExercises((prev) => ({
                            ...prev,
                            [exercise.id]: !prev[exercise.id]
                          }));
                        }}
                        sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
                      >
                        {isDone ? '✓ Completed (Click to Reset)' : 'Mark Exercise Complete'}
                      </Button>
                    </Box>
                  </Grid2>
                </Grid2>
              </Card>
            </Grid2>
          );
        })}
      </Grid2>

      {/* Interactive Guided Workout Runner Modal */}
      <Dialog
        open={workoutRunnerOpen}
        onClose={() => {
          setIsTimerRunning(false);
          setWorkoutRunnerOpen(false);
        }}
        maxWidth="md"
        fullWidth
        slotProps={{
          paper: {
            sx: { borderRadius: 4, overflow: 'hidden' }
          }
        }}
      >
        {currentDayData.exercises[activeExerciseIndex] && (
          <>
            <DialogTitle
              sx={{
                bgcolor: '#0f172a',
                color: '#fff',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                py: 2
              }}
            >
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  Guided Workout Runner • {currentDayData.dayName}
                </Typography>
                <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                  Exercise {activeExerciseIndex + 1} of {currentDayData.exercises.length}
                </Typography>
              </Box>
              <IconButton
                onClick={() => {
                  setIsTimerRunning(false);
                  setWorkoutRunnerOpen(false);
                }}
                sx={{ color: '#fff' }}
              >
                ✕
              </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: { xs: 2.5, sm: 4 } }}>
              {/* Progress Bar */}
              <LinearProgress
                variant="determinate"
                value={((activeExerciseIndex + 1) / currentDayData.exercises.length) * 100}
                sx={{ height: 8, borderRadius: 4, mb: 3 }}
              />

              {/* Audio Coach & Metronome Pacer Toolbar */}
              <Paper
                elevation={0}
                sx={{
                  p: 1.5,
                  mb: 3,
                  bgcolor: '#f1f5f9',
                  borderRadius: 2.5,
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 1.5
                }}
              >
                <FormControlLabel
                  control={
                    <Switch
                      checked={voiceEnabled}
                      onChange={(e) => setVoiceEnabled(e.target.checked)}
                      color="primary"
                      size="small"
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b' }}>
                      🎙️ Voice Coach: {voiceEnabled ? 'ON' : 'OFF'}
                    </Typography>
                  }
                />

                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b' }}>
                    🥁 METRONOME:
                  </Typography>
                  {[0, 60, 100, 120].map((bpm) => (
                    <Chip
                      key={bpm}
                      label={bpm === 0 ? 'Mute' : `${bpm} BPM`}
                      size="small"
                      clickable
                      color={metronomeBpm === bpm ? 'primary' : 'default'}
                      variant={metronomeBpm === bpm ? 'filled' : 'outlined'}
                      onClick={() => setMetronomeBpm(bpm)}
                      sx={{ fontWeight: 700, fontSize: '0.75rem' }}
                    />
                  ))}
                </Stack>
              </Paper>

              <Grid2 container spacing={3} alignItems="center">
                {/* SVG Visual */}
                <Grid2 size={{ xs: 12, sm: 5 }}>
                  <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 3, border: '1px solid #e2e8f0', textAlign: 'center' }}>
                    <ExerciseSvg type={currentDayData.exercises[activeExerciseIndex].svgType} />
                  </Box>
                </Grid2>

                {/* Timer & Controls */}
                <Grid2 size={{ xs: 12, sm: 7 }}>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', mb: 1 }}>
                    {currentDayData.exercises[activeExerciseIndex].name}
                  </Typography>

                  <Chip
                    label={currentDayData.exercises[activeExerciseIndex].repsSets}
                    size="small"
                    sx={{ fontWeight: 700, bgcolor: '#eff6ff', color: '#2563eb', mb: 2 }}
                  />

                  {/* Big Timer Circle */}
                  <Box
                    sx={{
                      width: 130,
                      height: 130,
                      borderRadius: '50%',
                      border: '6px solid',
                      borderColor: timerSeconds > 5 ? '#2563eb' : '#ef4444',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      my: 2,
                      mx: 'auto'
                    }}
                  >
                    <Typography variant="h3" sx={{ fontWeight: 900, color: '#0f172a' }}>
                      {timerSeconds}
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b' }}>
                      SECONDS
                    </Typography>
                  </Box>

                  <Stack direction="row" spacing={1.5} justifyContent="center">
                    <Button
                      variant="contained"
                      onClick={() => setIsTimerRunning(!isTimerRunning)}
                      sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700, px: 3 }}
                    >
                      {isTimerRunning ? '⏸️ Pause' : '▶️ Resume Timer'}
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => setTimerSeconds(currentDayData.exercises[activeExerciseIndex].workSeconds || 30)}
                      sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
                    >
                      🔄 Reset
                    </Button>
                  </Stack>
                </Grid2>
              </Grid2>

              <Divider sx={{ my: 3 }} />

              {/* Form cues checklist */}
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#334155', mb: 1 }}>
                🎯 Form Cues for Current Step:
              </Typography>
              <Stack spacing={1}>
                {currentDayData.exercises[activeExerciseIndex].steps.slice(0, 3).map((s) => (
                  <Typography key={s.step} variant="body2" sx={{ color: '#475569' }}>
                    <strong>Step {s.step} ({s.title}):</strong> {s.desc}
                  </Typography>
                ))}
              </Stack>
            </DialogContent>

            <DialogActions sx={{ p: 3, bgcolor: '#f8fafc', borderTop: '1px solid #e2e8f0', justifyContent: 'space-between' }}>
              <Button
                onClick={handlePrevExercise}
                disabled={activeExerciseIndex === 0}
                sx={{ textTransform: 'none', fontWeight: 700 }}
              >
                ← Previous
              </Button>

              <Button
                variant="contained"
                onClick={handleNextExercise}
                sx={{
                  bgcolor: '#2563eb',
                  textTransform: 'none',
                  fontWeight: 700,
                  px: 3,
                  borderRadius: 2
                }}
              >
                {activeExerciseIndex === currentDayData.exercises.length - 1 ? 'Finish & Log Workout 🎉' : 'Next Exercise →'}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* UNIQUE FEATURE 3: Official Achievement Certificate Modal */}
      <Dialog
        open={certificateModalOpen}
        onClose={() => setCertificateModalOpen(false)}
        maxWidth="md"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: 4,
              overflow: 'hidden',
              bgcolor: '#0f172a',
              border: '1px solid #334155'
            }
          }
        }}
      >
        <DialogTitle
          sx={{
            bgcolor: '#0f172a',
            color: '#fff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            py: 2
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              🏆 Official FitPulse Workout Milestone Certificate
            </Typography>
            <Typography variant="caption" sx={{ color: '#94a3b8' }}>
              Download or share your verified workout completion credential
            </Typography>
          </Box>
          <IconButton onClick={() => setCertificateModalOpen(false)} sx={{ color: '#94a3b8', '&:hover': { color: '#fff' } }}>
            ✕
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: { xs: 2, sm: 3 }, textAlign: 'center', bgcolor: '#0b0f17' }}>
          <Box sx={{ overflowX: 'auto', display: 'flex', justifyContent: 'center', py: 1 }}>
            <canvas
              ref={canvasRef}
              style={{
                width: '100%',
                maxWidth: 680,
                height: 'auto',
                borderRadius: 12,
                boxShadow: '0 20px 50px rgba(0,0,0,0.7)',
                border: '1px solid #1e293b'
              }}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2.5, bgcolor: '#0f172a', borderTop: '1px solid #1e293b', justifyContent: 'space-between' }}>
          <Button
            onClick={() => setCertificateModalOpen(false)}
            sx={{ color: '#94a3b8', textTransform: 'none', fontWeight: 700 }}
          >
            Close
          </Button>

          <Button
            variant="contained"
            onClick={handleDownloadCertificate}
            sx={{
              bgcolor: '#f59e0b',
              color: '#0f172a',
              fontWeight: 800,
              textTransform: 'none',
              borderRadius: 2.5,
              px: 3,
              boxShadow: '0 4px 14px rgba(245, 158, 11, 0.4)',
              '&:hover': { bgcolor: '#d97706' }
            }}
          >
            📥 Download Certificate Image (PNG)
          </Button>
        </DialogActions>
      </Dialog>

      {/* UNIQUE FEATURE 4: Interactive Beginner Macro & Target Heart Rate Zones Modal */}
      <Dialog
        open={calculatorModalOpen}
        onClose={() => setCalculatorModalOpen(false)}
        maxWidth="md"
        fullWidth
        slotProps={{
          paper: {
            sx: { borderRadius: 4, p: { xs: 1, sm: 2 } }
          }
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', pb: 1 }}>
          <Box>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
              <Chip label="BIOMETRIC ENGINE" size="small" sx={{ bgcolor: '#eff6ff', color: '#2563eb', fontWeight: 800, fontSize: '0.72rem' }} />
              <Chip label="PERSONALIZED" size="small" variant="outlined" sx={{ fontWeight: 700, fontSize: '0.72rem' }} />
            </Stack>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a' }}>
              🧮 Beginner Macro & Heart Rate Zone Calculator
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Calculate exact daily calories, protein targets, and optimal cardiovascular training zones.
            </Typography>
          </Box>
          <IconButton onClick={() => setCalculatorModalOpen(false)}>✕</IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          {/* Biometrics Inputs */}
          <Grid2 container spacing={2.5} sx={{ mb: 3.5, mt: 0.5 }}>
            <Grid2 size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                label="Body Weight (kg)"
                type="number"
                value={userWeight}
                onChange={(e) => setUserWeight(Math.max(30, Number(e.target.value) || 0))}
                slotProps={{ htmlInput: { min: 30, max: 250 } }}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                label="Age (years)"
                type="number"
                value={userAge}
                onChange={(e) => setUserAge(Math.max(12, Number(e.target.value) || 0))}
                slotProps={{ htmlInput: { min: 12, max: 100 } }}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                select
                label="Primary Goal"
                value={userGoal}
                onChange={(e) => setUserGoal(e.target.value)}
              >
                <MenuItem value="fat_loss">🔥 Fat Loss & Toning</MenuItem>
                <MenuItem value="muscle">💪 Lean Muscle Gain</MenuItem>
                <MenuItem value="maintenance">⚖️ Maintenance & Stamina</MenuItem>
              </TextField>
            </Grid2>
          </Grid2>

          {(() => {
            const baseMultiplier = userGoal === 'fat_loss' ? 1.35 : userGoal === 'muscle' ? 1.45 : 1.4;
            const deficitOrSurplus = userGoal === 'fat_loss' ? -400 : userGoal === 'muscle' ? 250 : 0;
            const targetCalories = Math.round(userWeight * 22 * baseMultiplier + deficitOrSurplus);

            const proteinMultiplier = userGoal === 'fat_loss' ? 2.0 : userGoal === 'muscle' ? 2.2 : 1.8;
            const proteinGrams = Math.round(userWeight * proteinMultiplier);
            const fatGrams = Math.round(userWeight * 0.85);
            const carbGrams = Math.max(50, Math.round((targetCalories - (proteinGrams * 4 + fatGrams * 9)) / 4));

            const maxHr = 220 - userAge;
            const hrZones = [
              { zone: 1, name: 'Active Recovery & Warm-up', range: `${Math.round(maxHr * 0.50)} - ${Math.round(maxHr * 0.60)} BPM`, color: '#64748b', desc: 'Easy warm-up and post-workout cool-down.' },
              { zone: 2, name: 'Optimal Fat Burn Engine', range: `${Math.round(maxHr * 0.60)} - ${Math.round(maxHr * 0.70)} BPM`, color: '#10b981', desc: 'Primary zone for walking, steady cardio, and burning fat.', highlight: true },
              { zone: 3, name: 'Aerobic Cardiovascular', range: `${Math.round(maxHr * 0.70)} - ${Math.round(maxHr * 0.80)} BPM`, color: '#0284c7', desc: 'Builds stamina, lung capacity, and heart endurance.' },
              { zone: 4, name: 'Anaerobic Threshold', range: `${Math.round(maxHr * 0.80)} - ${Math.round(maxHr * 0.90)} BPM`, color: '#f59e0b', desc: 'High intensity interval training (HIIT) & muscle endurance.' },
              { zone: 5, name: 'Peak VO2 Max Effort', range: `${Math.round(maxHr * 0.90)} - ${maxHr} BPM`, color: '#ef4444', desc: 'All-out sprint effort; sustainable only for short intervals.' }
            ];

            return (
              <Stack spacing={3}>
                {/* Calories Target Card */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                    color: '#fff',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <Box>
                    <Typography variant="overline" sx={{ color: '#38bdf8', fontWeight: 800, letterSpacing: 1 }}>
                      DAILY TARGET INTAKE
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 900 }}>
                      {targetCalories.toLocaleString()} <span style={{ fontSize: '1rem', fontWeight: 500, color: '#94a3b8' }}>kcal / day</span>
                    </Typography>
                  </Box>
                  <Chip
                    label={userGoal === 'fat_loss' ? 'Moderate Deficit (-400 kcal)' : userGoal === 'muscle' ? 'Lean Surplus (+250 kcal)' : 'Maintenance Balance'}
                    sx={{ bgcolor: userGoal === 'fat_loss' ? '#ef4444' : userGoal === 'muscle' ? '#10b981' : '#3b82f6', color: '#fff', fontWeight: 800 }}
                  />
                </Paper>

                {/* Macro Split Grid */}
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#334155', mb: 1.5 }}>
                    🥗 Daily Macronutrient Split:
                  </Typography>
                  <Grid2 container spacing={2}>
                    <Grid2 size={{ xs: 12, sm: 4 }}>
                      <Card sx={{ p: 2, borderRadius: 3, border: '1px solid #fed7aa', bgcolor: '#fffaf5' }}>
                        <Typography variant="caption" sx={{ fontWeight: 800, color: '#c2410c' }}>🥩 PROTEIN</Typography>
                        <Typography variant="h5" sx={{ fontWeight: 900, color: '#9a3412', my: 0.5 }}>{proteinGrams}g</Typography>
                        <Typography variant="caption" sx={{ color: '#7c2d12' }}>{proteinGrams * 4} kcal • Muscle repair</Typography>
                      </Card>
                    </Grid2>
                    <Grid2 size={{ xs: 12, sm: 4 }}>
                      <Card sx={{ p: 2, borderRadius: 3, border: '1px solid #bbf7d0', bgcolor: '#f0fdf4' }}>
                        <Typography variant="caption" sx={{ fontWeight: 800, color: '#15803d' }}>🥑 HEALTHY FATS</Typography>
                        <Typography variant="h5" sx={{ fontWeight: 900, color: '#166534', my: 0.5 }}>{fatGrams}g</Typography>
                        <Typography variant="caption" sx={{ color: '#14532d' }}>{fatGrams * 9} kcal • Hormones & joints</Typography>
                      </Card>
                    </Grid2>
                    <Grid2 size={{ xs: 12, sm: 4 }}>
                      <Card sx={{ p: 2, borderRadius: 3, border: '1px solid #bfdbfe', bgcolor: '#eff6ff' }}>
                        <Typography variant="caption" sx={{ fontWeight: 800, color: '#1d4ed8' }}>🍚 CARBOHYDRATES</Typography>
                        <Typography variant="h5" sx={{ fontWeight: 900, color: '#1e40af', my: 0.5 }}>{carbGrams}g</Typography>
                        <Typography variant="caption" sx={{ color: '#1e3a8a' }}>{carbGrams * 4} kcal • Training energy</Typography>
                      </Card>
                    </Grid2>
                  </Grid2>
                </Box>

                {/* Heart Rate Zones */}
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#334155', mb: 1.5 }}>
                    ❤️ Cardiovascular Target Heart Rate Zones (Max HR: {maxHr} BPM):
                  </Typography>
                  <Stack spacing={1.2}>
                    {hrZones.map((z) => (
                      <Paper
                        key={z.zone}
                        elevation={0}
                        sx={{
                          p: 1.5,
                          borderRadius: 2.5,
                          border: z.highlight ? `2px solid ${z.color}` : '1px solid #e2e8f0',
                          bgcolor: z.highlight ? '#f0fdf4' : '#f8fafc',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <Box>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Chip label={`Zone ${z.zone}`} size="small" sx={{ bgcolor: z.color, color: '#fff', fontWeight: 800, fontSize: '0.7rem' }} />
                            <Typography variant="body2" sx={{ fontWeight: 800, color: '#0f172a' }}>
                              {z.name}
                            </Typography>
                          </Stack>
                          <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mt: 0.3 }}>
                            {z.desc}
                          </Typography>
                        </Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 900, color: z.color }}>
                          {z.range}
                        </Typography>
                      </Paper>
                    ))}
                  </Stack>
                </Box>
              </Stack>
            );
          })()}
        </DialogContent>

        <DialogActions sx={{ p: 2.5, borderTop: '1px solid #e2e8f0' }}>
          <Button onClick={() => setCalculatorModalOpen(false)} variant="contained" sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}>
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
