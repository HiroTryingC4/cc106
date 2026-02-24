# Draw.io Connections - Quick Reference

## How to Add Connections in Draw.io

Since the flowchart file is very large with 200+ nodes, here's the quickest way to add all connections:

### Method 1: Manual Connection (Recommended)

**In Draw.io:**

1. **Open** `docs/drawio/SMARTSTAY_COMPLETE_SYSTEM.drawio`
2. **Click** on a source node (e.g., "START")
3. **Hover** over the node - you'll see small blue circles appear
4. **Click and drag** from a blue circle to the target node
5. **Release** when the target node is highlighted
6. **Repeat** for all connections

### Method 2: Use Connection Tool

1. Click the **Connector tool** in the toolbar (looks like an arrow)
2. Click the source node
3. Click the target node
4. Connection is created automatically

### Method 3: Quick Connect

1. **Select a node**
2. **Hover** over it
3. **Click the arrow** that appears on the side
4. **Drag** to target node

## Connection Summary

### Total Connections Needed:
- **Guest Flow:** ~50 connections
- **Host Flow:** ~45 connections
- **Admin Flow:** ~50 connections
- **Cross-User:** ~15 dashed connections
- **Total:** ~160 connections

## Priority Connections (Do These First)

### Main Flow (Solid Lines):

1. **START → Landing → Decision → Dashboard → Features → LOGOUT**
   - This creates the main spine of each user flow

2. **Feature → Sub-features**
   - Connect each main feature to its sub-processes

3. **Decision → Options**
   - Connect each yellow diamond to its branches

### Cross-User Flow (Dashed Lines):

4. **Guest ⇢ Host ⇢ Admin**
   - Show how actions flow between users

5. **All → Shared Systems**
   - Connect features to shared systems at bottom

## Visual Guide

```
Main Flow (Solid):
START ──→ Landing ──→ ◆ Decision ──→ Dashboard ──→ Features ──→ LOGOUT
                      │
                      ├──→ Option 1
                      ├──→ Option 2
                      └──→ Option 3

Cross-User (Dashed):
Guest ─ ─ ─→ Host ─ ─ ─→ Admin
  │            │            │
  └─ ─ ─ ─ ─ ─ ┴─ ─ ─ ─ ─ ─┘
              │
         Shared System
```

## Arrow Styles

### Solid Arrow (Main Flow)
- **Style:** Default
- **Width:** 2px
- **Color:** Black
- **Use for:** Sequential steps within same user type

### Dashed Arrow (Cross-User)
- **Style:** Dashed
- **Width:** 2px  
- **Color:** Gray or Black
- **Use for:** Interactions between different user types

**To make dashed:**
1. Right-click arrow
2. Edit Style
3. Add: `dashed=1;`

## Connection Labels

Add labels to decision branches:
- "Yes" / "No"
- "Register" / "Login"
- "Success" / "Failed"
- "Approved" / "Rejected"

**To add label:**
1. Double-click on arrow
2. Type text
3. Press Enter

## Time Estimate

- **Guest Flow connections:** 15 minutes
- **Host Flow connections:** 15 minutes
- **Admin Flow connections:** 15 minutes
- **Cross-user connections:** 10 minutes
- **Styling & labels:** 10 minutes
- **Total:** ~65 minutes

## Tips for Speed

1. **Work top to bottom** - Start at START, work down
2. **Use keyboard shortcuts:**
   - Ctrl+D: Duplicate
   - Ctrl+Z: Undo
   - Ctrl+Y: Redo
3. **Zoom to fit** - View → Fit Page
4. **Save often** - Ctrl+S
5. **Use layers** - Separate main flow from cross-user connections

## Verification Checklist

After adding connections, verify:
- [ ] Every node (except START/LOGOUT) has at least one incoming arrow
- [ ] Every node (except LOGOUT) has at least one outgoing arrow
- [ ] All decision diamonds have multiple outgoing arrows
- [ ] Cross-user connections are dashed
- [ ] Main flow connections are solid
- [ ] Important branches are labeled
- [ ] No overlapping arrows (use waypoints to route around)

## Result

A fully connected flowchart showing:
✅ Complete user journeys
✅ All decision paths
✅ Cross-user interactions
✅ System integration points
✅ Professional, readable diagram

---

**See `ADD_CONNECTIONS_GUIDE.md` for the complete list of all connections to add!**

