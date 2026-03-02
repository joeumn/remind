# RE:MIND - Quick Start Guide 🚀

## Welcome to Your Simplified Reminder App!

RE:MIND is now a clean, fast, and simple event management system. No complexity, just what you need.

## 🎯 Quick Access

- **Homepage**: http://localhost:3000
- **Dashboard**: http://localhost:3000/dashboard (Main app)
- **Schedule**: http://localhost:3000/schedule
- **Settings**: http://localhost:3000/settings
- **Alerts**: http://localhost:3000/alerts
- **Pricing**: http://localhost:3000/pricing

## 📋 Main Features

### Dashboard (Your Main Hub)

#### Add an Event
1. Click the blue **"Add Event"** button
2. Fill in:
   - **Title**: What is this event? (required)
   - **Date**: When is it?
   - **Time**: What time?
   - **Category**: Court, Work, Family, Personal, or Recovery
   - **Priority**: Urgent, High, Medium, or Low
3. Click **"Add Event"** to save

#### Manage Events
- **Complete**: Click the checkbox to mark as done
- **Delete**: Click the "×" to remove
- **View**: Events are organized into:
  - **Urgent Events** (red alert at top)
  - **Today** (happening today)
  - **Upcoming** (next 7+ days)
  - **Completed** (done items)

### Categories & Colors

| Category | Color | Use For |
|----------|-------|---------|
| Court | Red | Legal deadlines, hearings |
| Work | Blue | Meetings, projects |
| Family | Green | Family events, birthdays |
| Personal | Purple | Personal appointments |
| Recovery | Yellow | Self-care, wellness |

### Priority Levels

| Priority | Border Color | When to Use |
|----------|--------------|-------------|
| Urgent | Red | Must do ASAP |
| High | Orange | Important, soon |
| Medium | Yellow | Normal importance |
| Low | Green | Can wait if needed |

## 💾 Data Storage

- All events are saved in your browser's localStorage
- Data persists across page refreshes
- Data is local to your device (not synced yet)
- **Tip**: Don't clear browser data or you'll lose events!

## 🎨 Sample Events Included

On first load, you'll see 3 sample events:
1. **Court Hearing** (Urgent, 2 days away)
2. **Client Meeting** (High, today)
3. **Family Dinner** (Medium, tomorrow)

Feel free to delete these and add your own!

## 🔄 Current Limitations (MVP)

These features are planned but not yet active:
- ❌ Multi-device sync
- ❌ User accounts/login
- ❌ Email notifications
- ❌ SMS reminders
- ❌ Recurring events
- ❌ Event editing (can delete and re-add for now)
- ❌ Search functionality
- ❌ Export/import

## ✅ What Works Perfectly

- ✅ Add unlimited events
- ✅ Mark events complete
- ✅ Delete events
- ✅ Color-coded categories
- ✅ Priority indicators
- ✅ Automatic date sorting
- ✅ Urgent event alerts
- ✅ Fast, responsive UI
- ✅ Mobile-friendly design
- ✅ Data persistence

## 🚀 Pro Tips

1. **Use Categories Wisely**: Stick to one category per event type for easy scanning
2. **Mark Urgent Carefully**: Only use "Urgent" for truly critical items
3. **Complete Events Daily**: Check off finished items to keep your list clean
4. **Plan Ahead**: Add events as soon as you know about them
5. **Check Daily**: Make it a habit to review your dashboard each morning

## 🐛 Troubleshooting

### Events disappeared?
- Check if browser data was cleared
- Try adding a new event to test

### App won't load?
- Check the terminal for errors
- Try: `cd /workspaces/remind && npm run dev`
- Refresh browser at http://localhost:3000

### Modal won't close?
- Click "Cancel" button or click outside the modal

### Can't add event?
- Make sure you filled in the Title field
- Check that date format is valid

## 📞 Need Help?

This is a simplified MVP. For issues:
1. Check this guide
2. Review MVP_COMPLETE.md for technical details
3. Check browser console for errors (F12)

## 🎯 Next Version Features

In future updates:
- User authentication
- Cloud sync
- Email/SMS reminders
- Recurring events
- Event editing
- Advanced search
- Calendar view
- Mobile app
- Team sharing

---

**Enjoy your simplified reminder system! 🎉**

Keep it simple. Stay on track. Never miss what matters.
