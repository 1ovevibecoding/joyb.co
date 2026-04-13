## 🎯 Admin Dashboard - Visual Layout Guide

### **Desktop View (Full Layout)**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ LOGO  Dashboard       Welcome back, Admin               🔔  ⚙️   [AD]      │  ← Header
└─────────────────────────────────────────────────────────────────────────────┘
┌──────────────┬───────────────────────────────────────────────────────────────┐
│              │                                                               │
│  Dashboard   │  ┌─────────────────────────────────────────────────────────┐ │
│  Events      │  │ STATS CARDS (4 columns)                                │ │
│  Users       │  │ ┌─────────────┬─────────────┬─────────────┬──────────┐ │ │
│  Finance     │  │ │Total Users  │  Revenue    │Total Orders│Avg Resp  │ │ │
│  Reports     │  │ │ 12,428      │ $54,320     │   1,852     │   2.3s   │ │ │
│  Settings    │  │ │  +4.2% ↑    │  +8.5% ↑    │  +2.1% ↑    │  -0.3s ↓ │ │ │
│              │  │ └─────────────┴─────────────┴─────────────┴──────────┘ │ │
│  [👁️ Toggle]│  └─────────────────────────────────────────────────────────┘ │
│              │  ┌──────────────────────────────┬──────────────────────────┐ │
│              │  │  Revenue Overview            │  User Growth (7 Days)    │ │
│              │  │ (Line Chart)                 │ (Bar Chart)              │ │
│              │  │  Revenue $54K ┐              │  Users    ┃              │ │
│              │  │  Profit  $34K │ ┌─┐          │         ┃ ┃ ┃            │ │
│              │  │               │ │├┤          │       ┃ ┃ ┃ ┃ ┃          │ │
│              │  │               │ │├┤          │     ┃ ┃ ┃ ┃ ┃ ┃          │ │
│              │  │               └─┘            │   ┃ ┃ ┃ ┃ ┃ ┃ ┃          │ │
│              │  └──────────────────────────────┴──────────────────────────┘ │
│              │  ┌────────────────────┬───────────────────────────────────┐ │
│              │  │ Order Status       │ Recent Activity                  │ │
│              │  │ (Donut Chart)      │ • New user registered 2 min ago  │ │
│              │  │    ◯  45 Completed │ • Order #1001 completed 15 min  │ │
│              │  │    ◯  28 Process   │ • New event created 1 hour ago  │ │
│              │  │    ◯  18 Pending   │ • System maintenance 3 hours    │ │
│              │  │    ◯   9 Cancelled │ • Payment received $5,234 5hrs  │ │
│              │  └────────────────────┴───────────────────────────────────┘ │
│              │  ┌─────────────────────────────────────────────────────────┐ │
│              │  │ Recent Orders                                           │ │
│              │  ├─────────┬──────────────┬────────┬──────────┬───────────┤ │
│              │  │ Order   │ Customer     │Amount  │ Status   │ Date      │ │
│              │  ├─────────┼──────────────┼────────┼──────────┼───────────┤ │
│              │  │ #1001   │ Sarah J.     │$487.23 │ Completed│ 2024-04-02│ │
│              │  │ #1002   │ Michael C.   │$892.50 │ Processing│2024-04-02│ │
│              │  │ #1003   │ Emma W.      │$345.67 │ Completed│ 2024-04-01│ │
│              │  │ #1004   │ James B.     │$721.89 │ Pending  │ 2024-04-01│ │
│              │  │ #1005   │ Lisa A.      │$567.34 │ Completed│ 2024-03-31│ │
│              │  └─────────┴──────────────┴────────┴──────────┴───────────┘ │
│              │                                                               │
└──────────────┴───────────────────────────────────────────────────────────────┘
                ← Sidebar (w-64)  →
                                  ← Main Content (scrollable) →
```

---

### **Tablet View (Adjusted Layout)**

```
┌────────────────────────────────────────────────────────────┐
│ Dashboard          🔔 ⚙️ [AD]                              │
└────────────────────────────────────────────────────────────┘
┌─────────────┬───────────────────────────────────────────────┐
│             │ STATS (2 columns)                             │
│ Dashboard   │ ┌──────────────────┬──────────────────────┐  │
│ Events      │ │ Total Users      │ Revenue              │  │
│ Users       │ │ 12,428 +4.2%     │ $54,320 +8.5%        │  │
│ Finance     │ └──────────────────┴──────────────────────┘  │
│ Reports     │ ┌──────────────────┬──────────────────────┐  │
│ Settings    │ │ Total Orders     │ Avg Response         │  │
│             │ │ 1,852 +2.1%      │ 2.3s -0.3s           │  │
│ [👁]        │ └──────────────────┴──────────────────────┘  │
│             │                                               │
│             │ Charts (1 column)                            │
│             │ Revenue | Growth                             │
│             │ ────────────────────────────────             │
│             │ Orders  | Activity                           │
│             │ ────────────────────────────────             │
│             │ Recent Orders Table                          │
│             │ ────────────────────────────────             │
└─────────────┴───────────────────────────────────────────────┘
```

---

### **Mobile View (Collapsed)**

```
┌──────────────────────────────┐
│☰ Dashboard      🔔 ⚙️ [AD]  │
└──────────────────────────────┘
┌──────────────────────────────┐
│                              │
│ STATS (1 column - stacked)   │
│ ┌────────────────────────┐   │
│ │ Total Users: 12,428    │   │
│ │ +4.2% ↑                │   │
│ └────────────────────────┘   │
│ ┌────────────────────────┐   │
│ │ Revenue: $54,320       │   │
│ │ +8.5% ↑                │   │
│ └────────────────────────┘   │
│ ┌────────────────────────┐   │
│ │ Total Orders: 1,852    │   │
│ │ +2.1% ↑                │   │
│ └────────────────────────┘   │
│ ┌────────────────────────┐   │
│ │ Avg Response: 2.3s     │   │
│ │ -0.3s ↓                │   │
│ └────────────────────────┘   │
│                              │
│ Charts (scrollable)          │
│ Revenue | Users | Orders... │
│                              │
│ Recent Activity              │
│ • New user 2 min ago        │
│ • Order completed 15 min    │
│ ...                         │
│                              │
│ Recent Orders               │
│ (horizontal scroll table)   │
└──────────────────────────────┘

When hamburger clicked ☰:
┌──────────────────────────────┐
│☰ Dashboard      🔔 ⚙️ [AD]  │ ← Header
├──────────────────────────────┤
│ Dashboard  ✓                 │ ← Sidebar overlay
│ Events                       │
│ Users                        │
│ Finance                      │
│ Reports                      │
│ Settings                     │
│                              │
│ Main content (faded)         │ ← Backdrop
└──────────────────────────────┘
```

---

### **Color System**

| Element | Color | Usage |
|---------|-------|-------|
| **Primary** | #3b82f6 (Blue) | Active nav, primary buttons |
| **Success** | #10b981 (Green) | Completed orders, positive trends |
| **Warning** | #f59e0b (Yellow) | Pending orders, warnings |
| **Error** | #ef4444 (Red) | Cancelled orders, errors |
| **Neutral** | #6b7280 (Gray) | Text, borders, inactive elements |
| **Background** | #ffffff (White) | Cards, main background |
| **Dark BG** | #1f2937 (Dark Gray) | Dark mode background |

---

### **Component Sizes**

| Component | Size | Usage |
|-----------|------|-------|
| **Sidebar** | w-64 (full) / w-20 (collapsed) | Navigation |
| **Icon** | 20-24px | Navigation, buttons |
| **Header** | h-16 | Top bar |
| **Card Padding** | p-6 | Chart/stats cards |
| **Border Radius** | rounded-lg | Cards, buttons |
| **Gap** | gap-6 | Grid spacing |

---

### **State Badges**

```
┌──────────────────────────────────┐
│ Status Badges                    │
├──────────────────────────────────┤
│ ✓ Completed   → Green background │
│ ⟳ Processing  → Blue background  │
│ ⏳ Pending     → Yellow background│
│ ✕ Cancelled   → Red background   │
└──────────────────────────────────┘
```

---

### **Typography Hierarchy**

```
Page Title (h1)
└─ 3xl, bold, #1f2937 (dark) / #ffffff (light)

Section Heading (h3)
└─ lg, semibold, #111827 (dark) / #f3f4f6 (light)

Body Text (p)
└─ sm/base, normal, #6b7280 (gray)

Metric Value
└─ 2xl, bold, primary color

Metric Label
└─ sm, medium, gray-600

Small Text / Caption
└─ xs, normal, gray-500
```

---

### **Spacing System**

```
Section Gap:        gap-8 (32px)
Card Padding:       p-6 (24px)
Icon Padding:       p-3 (12px)
Column Gap:         gap-6 (24px)
Item Spacing:       space-y-4 (16px)
Text Gap:           mt-1 (4px), mt-4 (16px)
```

---

### **Hover States**

```
Sidebar Items:
└─ Default: bg-gray-50
└─ Hover: bg-gray-100 (light) / bg-gray-700 (dark)
└─ Active: bg-blue-50 + text-blue-600 (light)
       or bg-blue-900/20 + text-blue-400 (dark)

Cards:
└─ Default: border-gray-200, bg-white
└─ Hover: shadow-md, border-gray-300

Table Rows:
└─ Hover: bg-gray-50 (light) / bg-gray-700/50 (dark)

Buttons:
└─ Hover: brightness increase, shadow

Charts:
└─ Hover: show tooltip with values
```

---

### **Transitions**

```
Sidebar: transition-all duration-300 (expand/collapse)
Button: transition-colors (hover effects)
Hover: transition-all (smooth effects)
Modal: transition ease-out duration-200 (fade in)
```

---

### **Dark Mode Support**

All components have dark mode variants:
- `bg-white` → `dark:bg-gray-800`
- `text-gray-900` → `dark:text-white`
- `border-gray-200` → `dark:border-gray-700`
- `bg-gray-50` → `dark:bg-gray-900/20`

---

## 🎨 Inspiration: Metis Dashboard

This design follows Metis Dashboard principles:
- ✅ Clean, minimal design
- ✅ Professional color palette
- ✅ Proper spacing and alignment
- ✅ Interactive charts
- ✅ Responsive layout
- ✅ Dark mode support
- ✅ No unnecessary decorations
- ✅ Icons instead of emojis

