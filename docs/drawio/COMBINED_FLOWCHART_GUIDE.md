# How to Create the Combined System Flowchart

This guide explains how to create the COMPLETE_SYSTEM_DETAILED.drawio flowchart showing all three user types on ONE page.

## Overview

The combined flowchart shows:
- **Guest Flow** (left column, purple) - 8 features
- **Host Flow** (middle column, orange) - 14 features
- **Admin Flow** (right column, red) - 13 features
- **Shared Systems** (bottom section, green) - 5 systems
- **Cross-user interactions** (connecting arrows)

**Canvas Size:** 3000 x 2200 pixels
**Total Nodes:** ~110
**Estimated Time:** 60-90 minutes

## Layout Strategy

### 3-Column Layout

```
┌────────────────────────────────────────────────────────────────┐
│                    COMPLETE SMARTSTAY SYSTEM                    │
├──────────────────┬──────────────────┬──────────────────────────┤
│  GUEST FLOW      │  HOST FLOW       │  ADMIN FLOW              │
│  (Purple)        │  (Orange)        │  (Red)                   │
│  x: 100-900      │  x: 1000-2000    │  x: 2100-2900            │
│                  │                  │                          │
│  START           │  START           │  START                   │
│    ↓             │    ↓             │    ↓                     │
│  Landing         │  Landing         │  Admin Login             │
│    ↓             │    ↓             │    ↓                     │
│  Browse ←────────┼─ List Units      │  Monitor All             │
│    ↓             │    ↓             │    ↓                     │
│  Book ──────────→│  Receive ───────→│  View Bookings           │
│    ↓             │    ↓             │    ↓                     │
│  Pay ───────────→│  Get Paid ──────→│  Track Revenue           │
│    ↓             │    ↓             │    ↓                     │
│  Review ─────────→│  View Review ───→│  Moderate                │
│    ↓             │    ↓             │    ↓                     │
│  Dashboard       │  Dashboard       │  Dashboard               │
│  (8 features)    │  (14 features)   │  (13 features)           │
│    ↓             │    ↓             │    ↓                     │
│  LOGOUT          │  LOGOUT          │  LOGOUT                  │
├──────────────────┴──────────────────┴──────────────────────────┤
│  SHARED SYSTEMS (Green) - y: 1800-2100                         │
│  [Messaging] [Booking Lifecycle] [Payment] [Review] [Chatbot]  │
└─────────────────────────────────────────────────────────────────┘
```

## Quick Start (90 minutes)

### Step 1: Setup (5 min)
1. Open Draw.io → https://app.diagrams.net/
2. Create blank diagram
3. Set canvas: 3000 x 2200
4. Enable grid

### Step 2: Guest Column (20 min)
- Add simplified Guest flow (30 nodes)
- Position: x: 100-900
- Show all 8 main features
- Add key sub-processes

### Step 3: Host Column (25 min)
- Add simplified Host flow (35 nodes)
- Position: x: 1000-2000
- Show all 14 main features
- Add key sub-processes

### Step 4: Admin Column (25 min)
- Add simplified Admin flow (35 nodes)
- Position: x: 2100-2900
- Show all 13 main features
- Add key sub-processes

### Step 5: Shared Systems (10 min)
- Add 5 shared system boxes
- Position: y: 1800-2100
- Connect to all user types

### Step 6: Cross-User Connections (10 min)
- Add interaction arrows
- Use dashed lines for monitoring
- Label all connections

### Step 7: Final Touches (5 min)
- Add legend
- Align elements
- Save and export

## Detailed Instructions

See `FLOWCHART_CREATION_GUIDE.md` Section 4 for:
- Complete node list for combined view
- Exact positions for all elements
- Connection specifications
- Validation checklist

## Tips

- **Simplify** - Show main features, not all sub-processes
- **Space** - Use horizontal space efficiently
- **Connect** - Show all cross-user interactions
- **Test** - Zoom to 50% to check readability
- **Export** - High resolution PNG for presentations

## Result

A comprehensive system overview showing:
- All user types and their complete journeys
- All 35 features across the platform
- All cross-user interactions
- Shared systems and connections
- Professional, presentation-ready layout

---

**For complete step-by-step instructions, see `FLOWCHART_CREATION_GUIDE.md` Section 4**
