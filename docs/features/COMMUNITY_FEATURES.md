# 🎉 Community Features - CampusConnect

## Overview
CampusConnect now includes comprehensive community features that enable participants and organizers to interact, share, and engage around events.

---

## 🗣️ Features

### 1. **Discussion Threads**
Open conversations where anyone can share thoughts, ideas, and updates about the event.

**Features:**
- ✅ Create discussion posts with messages
- ✅ Reply to discussions with comments
- ✅ Pin important discussions (organizers only)
- ✅ Delete your own posts or comments
- ✅ Real-time updates
- ✅ User role badges (Organizer/Participant)

**Use Cases:**
- Share event preparation tips
- Coordinate with other participants
- General event-related conversations
- Post-event feedback and reflections

---

### 2. **Q&A Section**
Dedicated space for participants to ask questions and get answers from organizers.

**Features:**
- ✅ Ask questions with title and details
- ✅ Organizer replies marked as "ANSWER"
- ✅ Questions marked as "ANSWERED" when organizer replies
- ✅ Pin important Q&A (organizers only)
- ✅ Thread-based conversations
- ✅ Visual indicators for answered questions

**Use Cases:**
- Ask about event logistics
- Clarify requirements or prerequisites
- Get organizer guidance
- Technical questions about the event

---

### 3. **Photo Gallery**
Community photo sharing for event memories and highlights.

**Features:**
- ✅ Upload photos (max 5MB)
- ✅ Add captions to photos
- ✅ Like photos (with heart icon)
- ✅ View photo details in modal
- ✅ Delete your own photos
- ✅ Organizers can delete any photo
- ✅ Grid layout with hover effects
- ✅ Real-time like counts

**Supported Formats:**
- JPG, PNG, GIF, WebP

**Use Cases:**
- Share event photos during/after event
- Document event highlights
- Community photo album
- Visual event memories

---

## 🎨 UI/UX Design

### Neo Brutalism Style
All community features follow the CampusConnect design language:
- **Bold borders** and **hard shadows**
- **Vibrant colors** for actions
- **Clear typography** with bold fonts
- **Smooth animations** with Framer Motion
- **Responsive design** for all devices

### Tab Navigation
Three tabs for easy navigation:
1. **Discussions** - General conversations
2. **Q&A** - Questions and answers
3. **Photos** - Event photo gallery

### Visual Indicators
- 🟣 **Purple badge** - Organizer
- 🔵 **Blue badge** - Participant
- 🟡 **Yellow highlight** - Pinned posts
- 🟢 **Green badge** - Answered questions
- ❤️ **Red heart** - Photo likes

---

## 🔐 Permissions

### All Users (Logged In)
- ✅ View all discussions, Q&A, and photos
- ✅ Create discussions and ask questions
- ✅ Reply to discussions and questions
- ✅ Upload photos with captions
- ✅ Like photos
- ✅ Delete their own content

### Organizers (Additional)
- ✅ Pin/unpin discussions and questions
- ✅ Mark replies as "ANSWER" for Q&A
- ✅ Delete any discussion, comment, or photo
- ✅ Moderate community content

### Guests (Not Logged In)
- ✅ View all content (read-only)
- ❌ Cannot post, comment, or upload

---

## 📊 Database Schema

### Discussions Table
```typescript
{
  eventId: Id<"events">
  userId: Id<"users">
  userName: string
  userRole: "organizer" | "participant"
  type: "discussion" | "question"
  title?: string  // For questions
  message: string
  isAnswered?: boolean  // For questions
  isPinned?: boolean
  createdAt: number
}
```

### Comments Table
```typescript
{
  discussionId: Id<"discussions">
  userId: Id<"users">
  userName: string
  userRole: "organizer" | "participant"
  message: string
  isAnswer?: boolean  // Mark organizer reply as answer
  createdAt: number
}
```

### Photos Table
```typescript
{
  eventId: Id<"events">
  uploadedByUserId: Id<"users">
  uploadedByName: string
  storageId: Id<"_storage">  // Convex file storage
  caption?: string
  uploadedAt: number
  likes: number
}
```

### Photo Likes Table
```typescript
{
  photoId: Id<"photos">
  userId: Id<"users">
  likedAt: number
}
```

---

## 🚀 API Functions

### Discussions API (`convex/discussions.ts`)
- `createDiscussion` - Create new discussion or question
- `getEventDiscussions` - Get all discussions for event (with type filter)
- `togglePin` - Pin/unpin discussion (organizers only)
- `deleteDiscussion` - Delete discussion and all comments
- `addComment` - Add comment to discussion
- `getDiscussionComments` - Get all comments for discussion
- `deleteComment` - Delete a comment

### Photos API (`convex/photos.ts`)
- `generateUploadUrl` - Get URL for photo upload
- `uploadPhoto` - Save photo metadata after upload
- `getEventPhotos` - Get all photos for event
- `getPhotoUrl` - Get URL for viewing photo
- `toggleLike` - Like/unlike a photo
- `hasLiked` - Check if user liked a photo
- `deletePhoto` - Delete photo and all likes

---

## 🎯 User Flows

### Starting a Discussion
1. Navigate to event detail page
2. Click "Community" section
3. Select "Discussions" tab
4. Click "Start Discussion" button
5. Write message (max 1000 characters)
6. Click "Post"

### Asking a Question
1. Navigate to event detail page
2. Click "Community" section
3. Select "Q&A" tab
4. Click "Ask Question" button
5. Enter question title
6. Add details (max 1000 characters)
7. Click "Post"
8. Wait for organizer to answer

### Uploading a Photo
1. Navigate to event detail page
2. Click "Community" section
3. Select "Photos" tab
4. Add optional caption
5. Click "Choose Image"
6. Select image file (max 5MB)
7. Photo uploads automatically

### Replying to Discussion
1. Click on any discussion/question
2. Comments section expands
3. Type reply in text box
4. Click send button
5. Reply appears instantly

---

## 💡 Best Practices

### For Participants
- ✅ Be respectful in discussions
- ✅ Ask clear, specific questions
- ✅ Share relevant photos only
- ✅ Give credit when sharing others' content
- ✅ Use appropriate captions

### For Organizers
- ✅ Pin important announcements
- ✅ Answer questions promptly
- ✅ Mark helpful replies as "ANSWER"
- ✅ Moderate inappropriate content
- ✅ Encourage community engagement
- ✅ Share official event photos

---

## 🔧 Technical Details

### File Storage
- Uses **Convex File Storage** for photos
- Automatic CDN distribution
- Secure upload URLs
- Efficient image delivery

### Real-time Updates
- All data updates in real-time
- No page refresh needed
- Optimistic UI updates
- Automatic synchronization

### Performance
- Lazy loading for comments
- Efficient query indexing
- Image optimization
- Pagination-ready architecture

---

## 🎨 Components

### `EventCommunity.tsx`
Main container component with tab navigation and content switching.

### `DiscussionThread.tsx`
Individual discussion/question card with comments section.

### `PhotoGallery.tsx`
Photo grid with upload, like, and delete functionality.

### `PhotoCard`
Individual photo card in grid layout.

### `PhotoModal`
Full-screen photo viewer with details.

### `CreateDiscussionDialog`
Modal for creating new discussions or questions.

---

## 📱 Responsive Design

### Mobile (< 768px)
- Single column layout
- Touch-optimized buttons
- Stacked photo grid (2 columns)
- Full-width modals

### Tablet (768px - 1024px)
- Two-column photo grid
- Optimized spacing
- Touch-friendly interactions

### Desktop (> 1024px)
- Four-column photo grid
- Hover effects enabled
- Optimal reading width
- Side-by-side layouts

---

## 🚦 Status Indicators

### Discussion Status
- **Pinned** - Yellow border and badge
- **Regular** - Standard styling

### Question Status
- **Unanswered** - No special indicator
- **Answered** - Green "ANSWERED" badge

### Photo Status
- **Liked by you** - Red filled heart
- **Not liked** - Outline heart
- **Like count** - Number next to heart

---

## 🎓 Example Use Cases

### Workshop Event
- **Discussions**: Share learning resources, tips
- **Q&A**: Ask about prerequisites, tools needed
- **Photos**: Share project screenshots, final work

### Sports Event
- **Discussions**: Team coordination, practice schedules
- **Q&A**: Rules clarification, equipment questions
- **Photos**: Action shots, team photos, highlights

### Cultural Event
- **Discussions**: Performance ideas, collaboration
- **Q&A**: Costume requirements, timing questions
- **Photos**: Rehearsal photos, performance shots

### Technical Event
- **Discussions**: Tech stack discussions, project ideas
- **Q&A**: Technical doubts, setup help
- **Photos**: Demo screenshots, team coding sessions

---

## 🔮 Future Enhancements

Potential features for future versions:
- 📹 Video uploads
- 🔔 Notification system for replies
- 🏷️ Hashtags and tagging
- 🔍 Search within discussions
- 📊 Analytics for engagement
- 🎖️ Badges for active contributors
- 💬 Direct messaging
- 📎 File attachments
- 🌐 Share to social media
- ⭐ Featured discussions

---

## 📞 Support

For issues or questions about community features:
1. Check this documentation
2. Ask in the event Q&A section
3. Contact event organizers
4. Report bugs to system admin

---

**Built with ❤️ for CampusConnect**
*Bringing campus communities together, one event at a time.*
