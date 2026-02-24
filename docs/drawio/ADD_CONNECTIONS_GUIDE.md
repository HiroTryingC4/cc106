# How to Add Connecting Lines in Draw.io

Since the flowchart file is very large, here's how to add all the connecting lines/arrows in Draw.io:

## Quick Method (Automatic Connections)

### Step 1: Open the File
1. Go to https://app.diagrams.net/
2. Open `docs/drawio/SMARTSTAY_COMPLETE_SYSTEM.drawio`

### Step 2: Add Connections Automatically

Draw.io has a feature to automatically connect shapes. Here's how:

#### For Guest Flow:
1. Click on **g1** (START)
2. Hover over the blue connection points (small circles)
3. Click and drag to **g2** (Landing Page)
4. Release to create arrow

Repeat for all connections below:

## All Connections to Add

### Guest Flow Connections

```
g1 (START) → g2 (Landing Page)
g2 (Landing Page) → gd1 (Logged In?)

gd1 (Logged In?) → g3 (Browse Units) [No branch]
gd1 (Logged In?) → g4 (Search/Filter) [No branch]
gd1 (Logged In?) → g9 (View Details) [No branch]
gd1 (Logged In?) → g15 (AI Recs) [No branch]
gd1 (Logged In?) → g16 (FAQ) [No branch]
gd1 (Logged In?) → g17 (Register) [No branch]
gd1 (Logged In?) → g20 (Login) [No branch]

g4 (Search/Filter) → gd2 (Filter?)
gd2 (Filter?) → g5 (Location)
gd2 (Filter?) → g6 (Price)
gd2 (Filter?) → g7 (Amenities)
gd2 (Filter?) → g8 (Capacity)

g9 (View Details) → gd3 (View?)
gd3 (View?) → g10 (Gallery)
gd3 (View?) → g11 (Amenities)
gd3 (View?) → g12 (Map)
gd3 (View?) → g13 (Calendar)
gd3 (View?) → g14 (Chatbot)

g17 (Register) → g18 (Enter Details)
g18 (Enter Details) → g19 (Create Account)
g19 (Create Account) → g23 (GUEST DASHBOARD)

g20 (Login) → g21 (Credentials)
g21 (Credentials) → g22 (Authenticate)
g22 (Authenticate) → g23 (GUEST DASHBOARD)

g23 (GUEST DASHBOARD) → gd4 (Feature?)

gd4 (Feature?) → g24 (Dashboard)
gd4 (Feature?) → g25 (Browse)
gd4 (Feature?) → g26 (Create Booking)
gd4 (Feature?) → g34 (My Bookings)
gd4 (Feature?) → g40 (Checkout Photo)
gd4 (Feature?) → g44 (Reviews)
gd4 (Feature?) → g50 (Messages)
gd4 (Feature?) → g55 (AI Recs)
gd4 (Feature?) → g60 (Profile)

g26 (Create Booking) → g27 (Select Dates)
g27 (Select Dates) → g28 (Enter Info)
g28 (Enter Info) → g29 (Review)
g29 (Review) → g30 (Payment)
g30 (Payment) → gd5 (Success?)
gd5 (Success?) → g31 (Success ✓) [Yes]
gd5 (Success?) → g32 (Failed ✗) [No]
g31 (Success ✓) → g33 (Confirmed)

g34 (My Bookings) → g35 (View All)
g35 (View All) → g36 (Details)
g36 (Details) → gd6 (Action?)
gd6 (Action?) → g37 (Cancel)
gd6 (Action?) → g38 (Modify)
gd6 (Action?) → g39 (Contact)

g40 (Checkout Photo) → g41 (Upload)
g41 (Upload) → g42 (Verify)
g42 (Verify) → g43 (Complete ✓)

g44 (Reviews) → g45 (Rate 1-5)
g45 (Rate 1-5) → g46 (Write Review)
g46 (Write Review) → g47 (Cleanliness)
g47 (Cleanliness) → g48 (Accuracy)
g48 (Accuracy) → g49 (Submit ✓)

g50 (Messages) → g51 (View Conv)
g51 (View Conv) → gd7 (Action?)
gd7 (Action?) → g52 (Msg Host)
gd7 (Action?) → g53 (Msg Admin)
gd7 (Action?) → g54 (New Conv)

g55 (AI Recs) → g56 (View Sugg)
g56 (View Sugg) → gd8 (Based On?)
gd8 (Based On?) → g57 (Prefs)
gd8 (Based On?) → g58 (History)
gd8 (Based On?) → g59 (Similar)

g60 (Profile) → g61 (Update Info)
g61 (Update Info) → g62 (Change Pass)
g62 (Change Pass) → g63 (Preferences)
g63 (Preferences) → g64 (History)

gd4 (Feature?) → g65 (LOGOUT)
```

### Host Flow Connections

```
h1 (START) → h2 (Landing Page)
h2 (Landing Page) → hd1 (Register/Login?)

hd1 (Register/Login?) → h3 (Register) [Register]
hd1 (Register/Login?) → h6 (Login) [Login]

h3 (Register) → h4 (Details)
h4 (Details) → h5 (Create)
h5 (Create) → h9 (HOST DASHBOARD)

h6 (Login) → h7 (Credentials)
h7 (Credentials) → h8 (Authenticate)
h8 (Authenticate) → h9 (HOST DASHBOARD)

h9 (HOST DASHBOARD) → hd2 (Feature?)

hd2 (Feature?) → h10 (Dashboard)
hd2 (Feature?) → h11 (Verification)
hd2 (Feature?) → h17 (Properties)
hd2 (Feature?) → h22 (Bookings)
hd2 (Feature?) → h25 (Guests)
hd2 (Feature?) → h28 (Financial)
hd2 (Feature?) → h32 (Analytics)
hd2 (Feature?) → h35 (Reports)
hd2 (Feature?) → h39 (AI Pricing)
hd2 (Feature?) → h43 (Chatbot Mgmt)
hd2 (Feature?) → h47 (Reviews)
hd2 (Feature?) → h50 (Messages)
hd2 (Feature?) → h53 (Templates)

h11 (Verification) → h12 (Submit Docs)
h12 (Submit Docs) → h13 (ID/Owner/Permits)
h13 (ID/Owner/Permits) → hd3 (Status?)
hd3 (Status?) → h14 (Approved ✓)
hd3 (Status?) → h15 (Pending ⏳)
hd3 (Status?) → h16 (Rejected ✗)

h17 (Properties) → hd4 (Action?)
hd4 (Action?) → h18 (View)
hd4 (Action?) → h19 (Add)
hd4 (Action?) → h20 (Edit)
hd4 (Action?) → h21 (Delete)

h22 (Bookings) → h23 (View/Calendar)
h23 (View/Calendar) → h24 (Approve/Reject)

h25 (Guests) → h26 (View/Details)
h26 (View/Details) → h27 (Message)

h28 (Financial) → h29 (Tab1: Overview)
h28 (Financial) → h30 (Tab2: Expenses)
h28 (Financial) → h31 (Tab3: Payroll)

h32 (Analytics) → h33 (Revenue/Trends)
h33 (Revenue/Trends) → h34 (Occupancy)

h35 (Reports) → h36 (Financial)
h36 (Financial) → h37 (Booking/Guest)
h37 (Booking/Guest) → h38 (Export)

h39 (AI Pricing) → h40 (Analysis)
h40 (Analysis) → h41 (Market/Seasonal)
h41 (Market/Seasonal) → h42 (Apply)

h43 (Chatbot Mgmt) → h44 (Configure)
h44 (Configure) → h45 (Templates/FAQ)
h45 (Templates/FAQ) → h46 (Logs)

h47 (Reviews) → h48 (View/Respond)
h48 (View/Respond) → h49 (Trends)

h50 (Messages) → h51 (View Conv)
h51 (View Conv) → h52 (Msg Guests/Admin)

h53 (Templates) → h54 (Create/Edit/Use)

hd2 (Feature?) → h55 (LOGOUT)
```

### Admin Flow Connections

```
a1 (START) → a2 (Admin Login)
a2 (Admin Login) → a3 (Authenticate)
a3 (Authenticate) → a4 (ADMIN DASHBOARD)
a4 (ADMIN DASHBOARD) → ad1 (Feature?)

ad1 (Feature?) → a5 (Dashboard)
ad1 (Feature?) → a6 (Users)
ad1 (Feature?) → a11 (Verification)
ad1 (Feature?) → a16 (Properties)
ad1 (Feature?) → a19 (Bookings)
ad1 (Feature?) → a22 (Financial)
ad1 (Feature?) → a26 (Reviews)
ad1 (Feature?) → a29 (Chatbot Mgmt)
ad1 (Feature?) → a32 (Chatbot Analytics)
ad1 (Feature?) → a36 (Security)
ad1 (Feature?) → a41 (Reports)
ad1 (Feature?) → a46 (System)
ad1 (Feature?) → a51 (Activity Logs)
ad1 (Feature?) → a56 (Messages)

a6 (Users) → ad2 (Action?)
ad2 (Action?) → a7 (View)
ad2 (Action?) → a8 (Add)
ad2 (Action?) → a9 (Edit)
ad2 (Action?) → a10 (Suspend)

a11 (Verification) → a12 (View Requests)
a12 (View Requests) → a13 (Review Docs)
a13 (Review Docs) → ad3 (Approve?)
ad3 (Approve?) → a14 (Yes ✓)
ad3 (Approve?) → a15 (No ✗)

a16 (Properties) → a17 (View/Edit)
a17 (View/Edit) → a18 (Approve/Suspend)

a19 (Bookings) → a20 (View/Modify)
a20 (View/Modify) → a21 (Resolve Disputes)

a22 (Financial) → a23 (Revenue)
a23 (Revenue) → a24 (Transactions)
a24 (Transactions) → a25 (Commission)

a26 (Reviews) → a27 (View/Moderate)
a27 (View/Moderate) → a28 (Flag/Delete)

a29 (Chatbot Mgmt) → a30 (Global Settings)
a30 (Global Settings) → a31 (Templates/FAQ)

a32 (Chatbot Analytics) → a33 (Conversations)
a33 (Conversations) → a34 (Accuracy)
a34 (Accuracy) → a35 (Satisfaction)

a36 (Security) → a37 (Fraud Alerts)
a37 (Fraud Alerts) → a38 (Suspicious/Failed)
a38 (Suspicious/Failed) → a39 (Security Logs)
a39 (Security Logs) → a40 (IP Blocking)

a41 (Reports) → a42 (Platform Reports)
a42 (Platform Reports) → a43 (User/Booking/Rev)
a43 (User/Booking/Rev) → a44 (Data Viz)
a44 (Data Viz) → a45 (Export PDF/CSV)

a46 (System) → a47 (Settings/Config)
a47 (Settings/Config) → a48 (Email Templates)
a48 (Email Templates) → a49 (Notifications)
a49 (Notifications) → a50 (Backup)

a51 (Activity Logs) → a52 (User Activity)
a52 (User Activity) → a53 (System/Error)
a53 (System/Error) → a54 (Security Logs)
a54 (Security Logs) → a55 (Export)

a56 (Messages) → a57 (View All)
a57 (View All) → a58 (Message Users)
a58 (Message Users) → a59 (Broadcast)

ad1 (Feature?) → a60 (LOGOUT)
```

### Cross-User Connections (Dashed Lines)

```
g3 (Guest Browse) ⇢ h17 (Host Properties) [dashed]
g26 (Guest Create Booking) ⇢ h22 (Host Bookings) [dashed]
g30 (Guest Payment) ⇢ h28 (Host Financial) [dashed]
g44 (Guest Reviews) ⇢ h47 (Host Reviews) [dashed]
h11 (Host Verification) ⇢ a11 (Admin Verification) [dashed]
g50 (Guest Messages) ⇢ s1 (Messaging System) [dashed]
h50 (Host Messages) ⇢ s1 (Messaging System) [dashed]
a56 (Admin Messages) ⇢ s1 (Messaging System) [dashed]
g26 (Guest Booking) ⇢ s2 (Booking Lifecycle) [dashed]
h22 (Host Bookings) ⇢ s2 (Booking Lifecycle) [dashed]
a19 (Admin Bookings) ⇢ s2 (Booking Lifecycle) [dashed]
g30 (Guest Payment) ⇢ s3 (Payment System) [dashed]
h28 (Host Financial) ⇢ s3 (Payment System) [dashed]
a22 (Admin Financial) ⇢ s3 (Payment System) [dashed]
g44 (Guest Reviews) ⇢ s4 (Review System) [dashed]
h47 (Host Reviews) ⇢ s4 (Review System) [dashed]
a26 (Admin Reviews) ⇢ s4 (Review System) [dashed]
g14 (Guest Chatbot) ⇢ s5 (AI Chatbot) [dashed]
h43 (Host Chatbot) ⇢ s5 (AI Chatbot) [dashed]
a29 (Admin Chatbot) ⇢ s5 (AI Chatbot) [dashed]
```

## Easy Method in Draw.io

### Step 1: Select Source Node
Click on the node you want to connect FROM

### Step 2: Drag Connection
1. Hover over the node until you see blue dots (connection points)
2. Click and drag from one of the blue dots
3. Drag to the target node
4. Release when you see the target node highlighted

### Step 3: Style the Arrow
- **Solid arrows** (main flow): Default style
- **Dashed arrows** (cross-user): Right-click arrow → Edit Style → Add `dashed=1;`

### Step 4: Add Labels
- Double-click on arrow to add text
- For decisions, add "Yes", "No", "Register", "Login", etc.

## Bulk Connection Method

1. **Select multiple nodes**: Hold Ctrl and click nodes
2. **Right-click** → Arrange → Insert → Edge
3. This connects selected nodes in order

## Tips

- **Zoom out** to see the whole diagram (Ctrl + Mouse Wheel)
- **Use waypoints** to route arrows around nodes (click and drag arrow)
- **Align arrows** using the alignment tools
- **Group related connections** for easier management
- **Save frequently** as you add connections

## Result

After adding all connections, you'll have:
- ✅ All nodes connected in proper flow
- ✅ Decision branches clearly marked
- ✅ Cross-user interactions shown with dashed lines
- ✅ Complete system flow visible
- ✅ Professional, readable flowchart

---

**Note:** This is a lot of connections! Take your time and work section by section. Start with Guest Flow, then Host, then Admin, then add cross-user connections last.

