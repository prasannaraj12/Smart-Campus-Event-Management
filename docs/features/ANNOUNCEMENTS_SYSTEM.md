# 📢 Announcements System - Complete Guide

## 🔑 Core Principle

**Announcements are department-wise and may optionally be linked to a specific event.**

---

## 🎯 Two Types of Announcements

### Type A: Event-Specific Announcement
- **Purpose**: Updates about a particular event
- **Examples**:
  - "Venue changed to Main Auditorium"
  - "Event postponed to next week"
  - "Reporting time: 9:00 AM sharp"
- **Linked to**: One specific event (`eventId` is set)
- **Displayed on**: Event detail page only

### Type B: General Announcement
- **Purpose**: Department-wide or overall information
- **Examples**:
  - "Registrations closing soon for all workshops"
  - "Department fest schedule released"
  - "Volunteers required for upcoming events"
- **Linked to**: Department only (`eventId` is null)
- **Displayed on**: Landing page only

---

## 🗄️ Single Data Model

```typescript
announcements {
  _id: Id<"announcements">
  title: string
  message: string
  department: string
  eventId?: Id<"events">        // null = general, set = event-specific
  priority: "normal" | "important"
  createdByOrganizerId: Id<"users">
  createdAt: number
}
```

### Type Detection Logic
```typescript
if (eventId === null) {
  // General announcement → Show on landing page
} else {
  // Event-specific → Show on event detail page
}
```

---

## 📍 Display Rules

### Landing Page (Main Dashboard)
- ✅ Shows: **ONLY general announcements** (eventId = null)
- ✅ Filtered by: Selected department
- ✅ Limit: Latest 5 announcements
- ❌ Does NOT show: Event-specific announcements

### Event Detail Page
- ✅ Shows: **ONLY event-specific announcements** (eventId = currentEventId)
- ✅ Relevant to: Current event only
- ❌ Does NOT show: General announcements

### Organizer Dashboard
- ✅ Can create: Both types
- ✅ Can view: All their announcements
- ✅ Can delete: Their own announcements

---

## 🎨 User Interface

### Landing Page
```
┌─────────────────────────────────┐
│  Department Filter              │
│  [All] [CSE] [ECE] [MECH]      │
├─────────────────────────────────┤
│  📢 Announcements               │
│                                 │
│  ┌───────────────────────────┐ │
│  │ 📢 Important Update       │ │
│  │ Registrations closing...  │ │
│  │ 📍 CSE  🕒 Dec 10        │ │
│  └───────────────────────────┘ │
│                                 │
│  ┌───────────────────────────┐ │
│  │ 📢 Fest Schedule Released │ │
│  │ Check the new schedule... │ │
│  │ 📍 All  🕒 Dec 9         │ │
│  └───────────────────────────┘ │
└─────────────────────────────────┘
```

### Event Detail Page
```
┌─────────────────────────────────┐
│  Event: Mini Hackathon          │
├─────────────────────────────────┤
│  📢 Event Announcements         │
│                                 │
│  ┌───────────────────────────┐ │
│  │ ⚠️ IMPORTANT              │ │
│  │ Venue Changed             │ │
│  │ New venue: Main Auditorium│ │
│  │ 📍 CSE  🕒 Dec 10        │ │
│  │ [Event-Specific]          │ │
│  └───────────────────────────┘ │
└─────────────────────────────────┘
```

### Organizer Create Form
```
┌─────────────────────────────────┐
│  Create Announcement            │
├─────────────────────────────────┤
│  Title: [________________]      │
│  Message: [______________]      │
│  Department: [CSE ▼]            │
│  Priority: [Normal ▼]           │
│  Link to Event (Optional):      │
│  [General Announcement ▼]       │
│  └─ Mini Hackathon             │
│  └─ Tech Workshop              │
│                                 │
│  📢 General: Will show on       │
│     landing page                │
│                                 │
│  [Create Announcement]          │
└─────────────────────────────────┘
```

---

## 🔄 Complete Flow

### Creating General Announcement
```
Organizer clicks "Create Announcement"
→ Fills title, message, department
→ Leaves "Link to Event" as "General"
→ Clicks "Create"
→ Announcement appears on landing page
→ Filtered by department
```

### Creating Event-Specific Announcement
```
Organizer clicks "Create Announcement"
→ Fills title, message, department
→ Selects event from dropdown
→ Clicks "Create"
→ Announcement appears on that event's detail page
→ Only visible to event viewers
```

### Viewing as Participant
```
Landing Page:
→ Select department filter
→ See general announcements for that department
→ No event-specific announcements shown

Event Detail Page:
→ View event details
→ See announcements specific to this event
→ No general announcements shown
```

---

## 🎯 Priority Levels

### Normal Priority
- Yellow background
- 📢 Megaphone icon
- Standard display

### Important Priority
- Red background
- ⚠️ Alert icon
- "IMPORTANT" badge
- More prominent display

---

## 🔐 Access Control

### Organizers Can:
- ✅ Create general announcements
- ✅ Create event-specific announcements (for their events only)
- ✅ Delete their own announcements
- ✅ View all their announcements

### Participants Can:
- ✅ View general announcements (landing page)
- ✅ View event-specific announcements (event page)
- ❌ Cannot create announcements
- ❌ Cannot delete announcements

---

## 📊 Database Queries

### Get General Announcements
```typescript
getGeneralAnnouncements({ department: "CSE" })
// Returns announcements where eventId is null
// Filtered by department
// Latest 5 only
```

### Get Event Announcements
```typescript
getEventAnnouncements({ eventId: "event123" })
// Returns announcements where eventId = "event123"
// All announcements for that event
```

### Get Organizer's Announcements
```typescript
getOrganizerAnnouncements({ organizerId: "org123" })
// Returns all announcements created by organizer
// Both general and event-specific
```

---

## 🎨 Visual Design

### Announcement Card
```
┌─────────────────────────────────┐
│ [Icon] Title            [Delete]│
│        [IMPORTANT badge]         │
│                                  │
│ Message text here...             │
│                                  │
│ 📍 Department  🕒 Date           │
│ [Event-Specific badge]           │
└─────────────────────────────────┘
```

### Color Coding
- **Normal**: Yellow background (`bg-yellow-100`)
- **Important**: Red background (`bg-red-100`)
- **Event-Specific**: Blue badge
- **General**: No special badge

---

## 🧪 Testing Checklist

### Test General Announcement
- [ ] Create announcement without event
- [ ] Appears on landing page
- [ ] Filtered by department
- [ ] Does NOT appear on event pages
- [ ] Can be deleted by creator

### Test Event-Specific Announcement
- [ ] Create announcement with event selected
- [ ] Appears on that event's detail page
- [ ] Does NOT appear on landing page
- [ ] Does NOT appear on other events
- [ ] Can be deleted by creator

### Test Department Filtering
- [ ] Create announcements for different departments
- [ ] Filter by department on landing page
- [ ] Only relevant announcements shown
- [ ] "All" shows all departments

### Test Priority
- [ ] Create normal priority announcement
- [ ] Create important priority announcement
- [ ] Important shows red background
- [ ] Important shows alert icon
- [ ] Important shows "IMPORTANT" badge

---

## 📝 API Reference

### Mutations

**createAnnouncement**
```typescript
createAnnouncement({
  title: string,
  message: string,
  department: string,
  eventId?: Id<"events">,
  priority: "normal" | "important",
  organizerId: Id<"users">
})
```

**deleteAnnouncement**
```typescript
deleteAnnouncement({
  announcementId: Id<"announcements">,
  organizerId: Id<"users">
})
```

### Queries

**getGeneralAnnouncements**
```typescript
getGeneralAnnouncements({
  department?: string
})
// Returns: Announcement[] (max 5, latest first)
```

**getEventAnnouncements**
```typescript
getEventAnnouncements({
  eventId: Id<"events">
})
// Returns: Announcement[]
```

**getOrganizerAnnouncements**
```typescript
getOrganizerAnnouncements({
  organizerId: Id<"users">
})
// Returns: Announcement[]
```

---

## ✨ Benefits

1. **Clean UX**: Right information in the right place
2. **No Clutter**: Event announcements don't spam landing page
3. **Scalable**: Works for any number of departments/events
4. **Easy to Explain**: Simple mental model for judges
5. **Real-World**: Matches actual campus workflows
6. **Zero Conflicts**: Clear separation of concerns

---

## 🎉 Summary

The announcement system provides:
- ✅ Two types: General and Event-specific
- ✅ Single unified data model
- ✅ Smart display logic (right place, right time)
- ✅ Department filtering
- ✅ Priority levels
- ✅ Organizer-only creation
- ✅ Clean, professional UI

**Perfect for campus event management!** 🚀
