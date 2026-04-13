## 🚀 Quick Start Guide - Admin Dashboard

### Những Thay Đổi Được Thực Hiện

#### 1. **AdminLayout Component** (Mới)
File: `src/components/AdminLayout.jsx`

Một layout wrapper tái sử dụng chuẩn Bootstrap Admin Template:
- ✅ Header sticky (logo, title, user menu, logout)
- ✅ Sidebar responsive (hamburger on mobile)
- ✅ Stats cards grid
- ✅ Main content scrollable
- ✅ Overlay backdrop cho mobile

**Sử dụng:**
```jsx
<AdminLayout
  title="Dashboard"
  modules={modules}
  activeModule={activeModule}
  onModuleChange={setActiveModule}
  stats={statCards}
>
  {children}
</AdminLayout>
```

#### 2. **AdminDashboard.jsx** (Cải Thiện)
File: `src/pages/AdminDashboard.jsx`

**Cải thiện chính:**
- ✅ Bây giờ sử dụng AdminLayout component
- ✅ Filter tabs hiển thị số lượng status
- ✅ Search tích hợp với filter
- ✅ EventItem component (reusable)
- ✅ Status-based styling (Approved/Pending/Rejected)
- ✅ Responsive layout (mobile/tablet/desktop)
- ✅ Clear visual hierarchy
- ✅ Consistent color system

**Improvements:**
- 📊 Stats cards: Badges động không còn lỗi Tailwind
- 🔍 Search: Tìm kiếm across tên, organizer, địa điểm
- 📋 Filter: Tabs hiển thị pending count
- 🎨 Design: Consistent spacing, borders, shadows
- ⚡ Performance: Optimized filtering logic

---

### Key Features

#### **Event Management**
```
Filter Tabs: All | Pending | Approved | Rejected
Search Bar: Find by event name, organizer, location

Event List:
├── Thumbnail
├── Title + Meta (organizer, date, location)
├── Status Badge
└── Action Buttons (Approve/Reject/Undo)
```

#### **User Management**
```
Search: Find by name/email
Table:
├── User Avatar
├── Name
├── Email
├── Role
└── Action (Ban)
```

#### **Organizers**
```
Card Grid:
├── Avatar
├── Name
├── Email
└── Verified Badge
```

#### **Status Styling**
```jsx
const statusStyle = {
  approved: { bg: 'bg-green-50 dark:bg-green-500/10', border: 'border-green-200' },
  pending_approval: { bg: 'bg-yellow-50 dark:bg-yellow-500/10', border: 'border-yellow-200' },
  rejected: { bg: 'bg-red-50 dark:bg-red-500/10', border: 'border-red-200' },
  draft: { bg: 'bg-gray-50 dark:bg-gray-500/10', border: 'border-gray-200' }
}
```

---

### Design Principles Applied

#### 1. **Layout Architecture**
- Fixed header + Left sidebar + Main content
- Sticky positioning for navigation
- Responsive: Mobile (burger menu) → Desktop (full sidebar)

#### 2. **Visual Hierarchy**
- Primary: Bold, large (titles, values)
- Secondary: Normal, medium (meta, descriptions)
- Tertiary: Small, muted (hints, dates)

#### 3. **Color System**
- Status colors: Green (approved), Yellow (pending), Red (rejected), Gray (draft)
- Consistent opacity: /10 for dark, /100 for light
- Dark mode: Full support with proper contrast

#### 4. **Spacing**
- Uniform: p-4, p-6, gap-3, gap-4
- Mobile first: Responsive padding adjustments
- Consistency across components

#### 5. **Interactions**
- Hover: Border + shadow change
- Active: Background + text color change
- Loading: Spinner animation
- Empty state: Icon + message

---

### How to Extend

#### **Add New Module**
```jsx
// 1. Add to MODULES array
const MODULES = [
  { id: 'events', label: 'Sự kiện', icon: '📋', badge: 0 },
  { id: 'newModule', label: 'New', icon: '🆕' }, // New!
];

// 2. Create render function
const renderNewModule = () => {
  return <div>{/* Your content */}</div>;
};

// 3. Add to switch statement
case 'newModule':
  return renderNewModule();
```

#### **Add New Stats Card**
```jsx
const statCards = [
  {
    label: 'New Metric',
    value: 123,
    subtitle: 'Description',
    icon: '📊',
    badgeClass: 'bg-[color]-100 dark:bg-[color]-500/10 text-[color]-600 dark:text-[color]-400'
  }
];
```

#### **Reuse AdminLayout for Other Pages**
```jsx
// pages/EventAnalytics.jsx
const EventAnalytics = () => {
  return (
    <AdminLayout
      title="Event Analytics"
      subtitle="View event performance"
      modules={analytics_modules}
      // ... other props
    >
      {/* Your analytics content */}
    </AdminLayout>
  );
};
```

---

### Testing Checklist

- [ ] Desktop view: Full layout visible
- [ ] Tablet: Sidebar collapsible
- [ ] Mobile: Hamburger menu works
- [ ] Dark mode: All colors correct
- [ ] Filter tabs: Click works, count updates
- [ ] Search: Filters event list in real-time
- [ ] Approve/Reject: Status updates
- [ ] User list: Table displays correctly
- [ ] Responsive images: No overflow
- [ ] Buttons: All clickable, colors correct

---

### Common Issues & Fixes

**Issue:** Sidebar not visible on mobile
**Fix:** Click hamburger button, check overlay

**Issue:** Filter not working
**Fix:** Check `filterStatus` state, ensure status values match

**Issue:** Colors not showing dark mode
**Fix:** Check `dark:` prefixes in classes

**Issue:** Stats cards broken
**Fix:** Ensure `statCards` array format with all required fields

---

### Next Phase Recommendations

1. 🗂️ Create separate pages for each module (Finance, Tickets, System)
2. 📊 Add dashboard charts (Chart.js, Recharts)
3. 🔔 Real-time notifications (Websocket)
4. 📄 Pagination for large lists
5. 📤 Bulk actions (approve multiple)
6. 💾 Export to CSV/PDF

---

**Version:** 1.0  
**Last Updated:** April 2026  
**Status:** Ready for Production  
