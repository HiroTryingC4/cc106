# SmartStay Draw.io Flowcharts

This folder contains comprehensive flowchart documentation and creation guides for the SmartStay platform.

## Available Files

### Documentation
1. **FLOWCHART_CREATION_GUIDE.md** - Complete guide for creating detailed flowcharts
   - Node-by-node structures for all 4 flowcharts
   - Exact color codes and specifications
   - Step-by-step Draw.io instructions
   - Validation checklists

2. **FLOWCHARTS_STATUS.md** - Current status and next steps
   - What's completed
   - What needs to be done
   - Quick start guide
   - Tips and best practices

3. **HOW_TO_COMBINE_FLOWCHARTS.md** - Strategies for combining flows

### Flowcharts to Create

1. **GUEST_FLOW_DETAILED.drawio** - Complete guest user journey (55 nodes)
   - Landing page browsing with filters
   - Registration/Login flows
   - Complete booking process with payment
   - Reviews and ratings with categories
   - Messages with Host/Admin options
   - AI Recommendations
   - Profile management
   - All 8 guest features

2. **HOST_FLOW_DETAILED.drawio** - Complete host user journey (65 nodes)
   - Host registration/login
   - Verification process (Approved/Pending/Rejected)
   - Property management (add/edit/delete)
   - Booking management with calendar
   - Financial management (3 tabs: Overview, Expenses, Payroll)
   - Analytics and reports
   - AI pricing recommendations
   - Chatbot management
   - All 14 host features

3. **ADMIN_FLOW_DETAILED.drawio** - Complete admin user journey (70 nodes)
   - Secure admin login
   - User management (all roles)
   - Host verification review process
   - Platform monitoring
   - Security & fraud detection
   - Chatbot analytics
   - System management
   - Reports and analytics
   - All 13 admin features

4. **COMPLETE_SYSTEM_DETAILED.drawio** - All users on ONE page (110 nodes)
   - 3-column layout (Guest | Host | Admin)
   - Shared systems at bottom
   - Cross-user interactions
   - Complete system overview

## How to Create Flowcharts

### Step 1: Read the Creation Guide
Open `FLOWCHART_CREATION_GUIDE.md` for complete instructions including:
- Detailed node structures (every node listed)
- Exact color codes and specifications
- Step-by-step process
- Validation checklists

### Step 2: Open Draw.io
Choose one of these options:

**Option 1: Online (Recommended)**
1. Go to https://app.diagrams.net/
2. Click "Create New Diagram"
3. Choose "Blank Diagram"
4. Set canvas size (2000x1500 for individual, 3000x2200 for combined)

**Option 2: Desktop App**
1. Download from https://github.com/jgraph/drawio-desktop/releases
2. Install and open
3. Create new diagram

**Option 3: VS Code Extension**
1. Install "Draw.io Integration" extension
2. Create new .drawio file
3. Edit inline

### Step 3: Follow the Guide
1. Start with GUEST_FLOW_DETAILED (easiest, 55 nodes)
2. Use the node structure from the creation guide
3. Apply color coding consistently
4. Add decision diamonds where specified
5. Connect all flows with arrows
6. Save and export

## Exporting

From Draw.io, you can export to:
- **PNG** - For documentation and presentations
- **SVG** - For scalable vector graphics
- **PDF** - For printing and sharing
- **XML** - For version control and collaboration

## Color Coding

The flowcharts use consistent color coding (exact hex codes in creation guide):
- **Green** (#d5e8d4) - Start/Success states, Shared features
- **Blue** (#dae8fc) - Main pages and navigation
- **Yellow** (#fff2cc) - Decision diamonds (rhombus shapes)
- **Purple** (#e1d5e7) - Guest features and actions
- **Orange** (#ffe6cc) - Host features and actions
- **Red** (#f8cecc) - Admin features, End states, Errors

## Node Counts

- **Guest Flow:** 55 nodes (all 8 features with sub-processes)
- **Host Flow:** 65 nodes (all 14 features with sub-processes)
- **Admin Flow:** 70 nodes (all 13 features with sub-processes)
- **Combined Flow:** 110 nodes (all users + shared systems)

## Features Included

### Guest Features (8)
1. My Bookings
2. Create Booking (with payment flow)
3. Payment Processing (Success/Fail decisions)
4. Reviews & Ratings (multiple rating categories)
5. Messages (Host/Admin options)
6. AI Recommendations (based on preferences/history)
7. Profile Management
8. Checkout Photo Upload

### Host Features (14)
1. Verification Process (Approved/Pending/Rejected)
2. Property Management (add/edit/delete)
3. Bookings Management (calendar view)
4. Guest Management
5. Financial Management (3 tabs: Overview, Expenses, Payroll)
6. Analytics & Insights
7. Reports (Financial, Booking, Guest)
8. AI Pricing Recommendations
9. Chatbot Management
10. Reviews Management
11. Messages
12. Payroll Management
13. Expense Tracking
14. Response Templates

### Admin Features (13)
1. User Management (all roles)
2. Host Verification (review and approve/reject)
3. Property Management
4. Booking Management
5. Financial Management
6. Reviews Management
7. Chatbot Management
8. Chatbot Analytics (separate feature)
9. Security & Fraud Detection
10. Reports & Analytics
11. System Management
12. Activity Logs
13. Messages

## Customization

Feel free to:
- Modify colors and styles (use format strings from creation guide)
- Add more details to specific flows
- Create swimlane diagrams for cross-functional processes
- Add decision points and conditional flows
- Export in different formats for various use cases

## Quick Start

### Creating Your First Flowchart (Guest Flow)

1. **Open Draw.io** - Go to https://app.diagrams.net/
2. **Create Canvas** - 2000 x 1500 pixels
3. **Open Creation Guide** - `FLOWCHART_CREATION_GUIDE.md`
4. **Follow Guest Structure** - Add each node with specified colors
5. **Add Connections** - Connect nodes with arrows
6. **Add Decisions** - Use rhombus shapes for decision points
7. **Save** - As GUEST_FLOW_DETAILED.drawio
8. **Export** - As PNG/PDF for documentation

**Estimated time:** 30-45 minutes

### Tips for Success

1. **Use Grid Snap** - View → Grid for alignment
2. **Work in Sections** - Complete one feature at a time
3. **Group Related Nodes** - Select multiple → Right-click → Group
4. **Save Frequently** - Don't lose progress
5. **Test Readability** - Zoom to 50% to check overall flow
6. **Use Layers** - Separate main flow from sub-processes
7. **Follow Color Coding** - Consistency is key
8. **Add Labels** - Label decision branches (Yes/No, Success/Fail)

## Additional Resources

### In This Folder
- **FLOWCHART_CREATION_GUIDE.md** - Complete creation instructions with node structures
- **FLOWCHARTS_STATUS.md** - Current status and next steps
- **HOW_TO_COMBINE_FLOWCHARTS.md** - Strategies for combining flows

### In Parent Folder
- **docs/USER_FLOWCHARTS.md** - Comprehensive ASCII flowcharts (15 sections)
- **docs/ADMIN_FEATURES_COMPLETE.md** - Admin feature details
- **docs/ALL_HOST_FEATURES_COMPLETE.md** - Host feature details
- **docs/PHASE7_COMPLETE.md** - Guest feature details
- **docs/TEST_ACCOUNTS.md** - Test accounts for verification

## Support

### If You Need Help

1. **Check Creation Guide** - Most questions answered there
2. **Review ASCII Flowcharts** - See complete feature descriptions
3. **Start Simple** - Begin with Guest flow (easiest)
4. **Test Incrementally** - Save and test after each section
5. **Use Draw.io Help** - Built-in help and tutorials

### Common Issues

**Problem:** Shapes won't align
**Solution:** Enable grid snap (View → Grid)

**Problem:** Colors don't match
**Solution:** Use exact hex codes from creation guide

**Problem:** Too many nodes
**Solution:** Work in sections, use layers

**Problem:** Arrows disconnected
**Solution:** Use connectors, not just arrows

**Problem:** Can't see everything
**Solution:** Increase canvas size or zoom out

## Validation

Before considering a flowchart complete, check:

### Guest Flow
- [ ] All 8 features included
- [ ] Booking process shows all steps
- [ ] Payment has Success/Fail decision
- [ ] Reviews show rating categories
- [ ] Messages show Host/Admin options
- [ ] ~55 nodes total

### Host Flow
- [ ] All 14 features included
- [ ] Verification shows Approved/Pending/Rejected
- [ ] Financial has 3 tabs
- [ ] Reports show different types
- [ ] ~65 nodes total

### Admin Flow
- [ ] All 13 features included
- [ ] Security & Fraud Detection prominent
- [ ] Chatbot Analytics separate
- [ ] ~70 nodes total

### Combined Flow
- [ ] All three user types visible
- [ ] Cross-user connections shown
- [ ] Shared systems at bottom
- [ ] Readable at 50% zoom
- [ ] ~110 nodes total

## Notes

- All flowcharts follow the same structure and color coding
- Creation guide provides node-by-node instructions
- Each flowchart shows complete user journey with all features
- Decision points (rhombus shapes) show branching logic
- Sub-processes show detailed steps for each feature
- Combined flowchart shows all users and their interactions
- Files can be version controlled and merged
- Compatible with Draw.io version 21.0.0 and above
- Supports collaborative editing when using Draw.io cloud features

## Getting Started

1. **Read** `FLOWCHARTS_STATUS.md` for overview
2. **Study** `FLOWCHART_CREATION_GUIDE.md` for detailed instructions
3. **Start** with Guest flow (simplest)
4. **Progress** to Host and Admin flows
5. **Complete** with combined system view

**Total estimated time:** 3-4 hours for all 4 flowcharts

---

**Ready to create professional, comprehensive flowcharts for SmartStay!**
