# 📖 Japan Trip Map - User Guide

## 🎯 Quick Start

1. **Open the application** at http://localhost:3000
2. **Explore the map** - See all 9 destinations marked with numbered circles
3. **Use the sidebar** - Browse destinations, search, and navigate
4. **Click destinations** - Either on the map or in the sidebar
5. **Export your itinerary** - Download or print for offline use

---

## 🗺️ Main Interface Overview

### **Header Section**
- **Title:** "🗾 Japan Trip Itinerary Map"
- **Summary:** November 30 - December 28 | 28 Days | 9 Destinations

### **Sidebar Panel (Left)**
- **Width:** 380px
- **Toggle Button:** ◀/▶ (center-left edge)
- **Sections:**
  1. Trip Statistics Dashboard
  2. Search Bar
  3. View Mode Toggle
  4. Destination List
  5. Export/Print Buttons

### **Map Area (Center/Right)**
- Interactive Leaflet map
- 9 numbered markers
- Color-coded by type
- Connecting route lines
- Zoom and pan controls

### **Footer Section**
- Usage instructions
- Quick tips

---

## 📊 Using the Trip Statistics Dashboard

**Location:** Top of sidebar

**What You'll See:**
- **28** Total Days
- **9** Destinations
- **5** ✈️ Flights
- **4** 🚄 Trains

**Purpose:** Quick overview of your entire trip at a glance

---

## 🔍 Search & Filter

**How to Search:**
1. Click in the search box
2. Type your query (e.g., "Sapporo", "temple", "Airbnb")
3. Results update instantly
4. Clear the box to see all destinations

**What You Can Search:**
- Destination names (e.g., "Tokyo", "Kyoto")
- Activities (e.g., "temple", "beach", "castle")
- Dates (e.g., "Dec 5", "Nov 30")
- Accommodation (e.g., "Airbnb", "Hotel")

**Tips:**
- Search is case-insensitive
- Partial matches work (e.g., "Sap" finds "Sapporo")
- Multiple words search all fields

---

## 📋 View Modes

### **List View** (Default)

**Features:**
- Detailed cards for each destination
- Shows all information at a glance
- Easy to scan and compare
- Best for detailed planning

**Card Contents:**
- Numbered badge (1-9)
- Destination name
- Dates and duration
- Accommodation type
- Top activities preview

**Interactions:**
- Click card to navigate to map location
- Hover to see border color change
- Selected card has teal border

### **Timeline View**

**Features:**
- Chronological visualization
- Vertical timeline with connecting line
- Color-coded dots
- Compact design
- Best for seeing trip flow

**Visual Elements:**
- Gradient timeline line (red → teal → yellow)
- Colored dots at each destination
- Compact cards with essential info
- Shows trip progression clearly

**How to Switch:**
- Click "📋 List View" button
- Click "📅 Timeline" button
- Current mode is highlighted in teal

---

## 🎯 Interactive Destination Cards

### **Clicking a Destination**

**What Happens:**
1. Card border turns teal
2. Background becomes light green
3. Map smoothly pans to location (1.5s animation)
4. Map zooms to level 10 (detailed view)
5. Marker popup opens automatically
6. Shows full destination details

### **Card Information**

**List View Shows:**
- 📅 Dates and duration
- 🏨 Accommodation
- 🎯 Activities (top 2-3)
- Color indicator

**Timeline View Shows:**
- Destination number and name
- Dates and duration
- Compact format

### **Visual Feedback**

**Hover State:**
- Border changes to destination color
- Subtle shadow increase
- Smooth transition

**Selected State:**
- Teal border (#4ECDC4)
- Light green background (#E8F8F5)
- Enhanced shadow

---

## 🗺️ Map Interactions

### **Markers**
- **Numbered circles** (1-9) in chronological order
- **Color-coded:**
  - 🔴 Red: Transit points
  - 🔵 Teal: Main stays
  - 🟡 Yellow: Day trips

### **Clicking Markers**
- Opens detailed popup
- Shows all destination information
- Includes activities, transport, accommodation

### **Route Lines**
- Dashed lines connecting destinations
- Alternating colors (red/teal)
- Shows travel path

### **Map Controls**
- **Zoom:** Scroll wheel or +/- buttons
- **Pan:** Click and drag
- **Reset:** Refresh page

---

## 📥 Export & Print

### **Export Button** 📥

**What It Does:**
- Downloads complete itinerary as text file
- Filename: `japan-trip-itinerary.txt`

**File Contents:**
- Trip overview and statistics
- All 9 destinations with full details
- Activities, transport, accommodation
- Formatted for easy reading

**How to Use:**
1. Click "📥 Export" button
2. File downloads automatically
3. Open in any text editor
4. Share via email or messaging

### **Print Button** 🖨️

**What It Does:**
- Opens browser print dialog
- Prints current page view

**How to Use:**
1. Click "🖨️ Print" button
2. Select printer or "Save as PDF"
3. Adjust print settings
4. Print or save

**Tips:**
- Close sidebar for map-only print
- Use landscape orientation for best results
- Save as PDF for digital copy

---

## 🎨 Color Guide

### **Destination Types**
- **🔴 Red (#FF6B6B):** Transit points (Tokyo arrival)
- **🔵 Teal (#4ECDC4):** Main stays (Sapporo, Fukuoka, etc.)
- **🟡 Yellow (#FFE66D):** Day trips (Yufuin)

### **UI Elements**
- **Dark Blue (#2C3E50):** Headers, primary buttons
- **Teal (#4ECDC4):** Accents, selected states
- **Light Gray (#F8F9FA):** Backgrounds
- **White (#FFFFFF):** Cards, sidebar

---

## 📱 Mobile Usage

### **Responsive Features**
- Sidebar becomes overlay on mobile
- Full-width when open
- Touch-friendly buttons
- Optimized spacing

### **Mobile Tips**
- Tap toggle button to show/hide sidebar
- Swipe to pan map
- Pinch to zoom
- Tap markers for popups

---

## ⌨️ Keyboard Shortcuts

**Coming Soon:**
- `Esc` - Close sidebar
- `Space` - Toggle sidebar
- `1-9` - Jump to destination
- `/` - Focus search

---

## 💡 Pro Tips

1. **Quick Navigation:** Click sidebar items instead of searching on map
2. **Compare Destinations:** Use List View to see all details side-by-side
3. **See Journey Flow:** Switch to Timeline View for chronological overview
4. **Find Specific Info:** Use search to filter by activity type
5. **Offline Access:** Export itinerary before traveling
6. **Share with Others:** Print or export to share trip details
7. **Plan Activities:** Click destinations to see full activity lists
8. **Check Transport:** View arrival transport in popups
9. **Verify Dates:** Use search to find destinations by date
10. **Save Space:** Collapse sidebar for full map view

---

## 🐛 Troubleshooting

### **Sidebar Won't Open**
- Click the toggle button (◀/▶)
- Refresh the page
- Check browser console for errors

### **Search Not Working**
- Clear search box and try again
- Check spelling
- Try partial words

### **Map Not Loading**
- Check internet connection
- Refresh the page
- Clear browser cache

### **Popup Won't Open**
- Click marker directly
- Try clicking sidebar item instead
- Refresh the page

### **Export Not Downloading**
- Check browser download settings
- Allow downloads from localhost
- Try different browser

---

## 🎓 Learning Path

### **Beginner**
1. Explore the map by clicking markers
2. Open and close the sidebar
3. Click a few destination cards
4. Try the search feature

### **Intermediate**
5. Switch between List and Timeline views
6. Search for specific activities
7. Export the itinerary
8. Print a copy

### **Advanced**
9. Use search to plan daily activities
10. Compare destinations in List View
11. Visualize journey in Timeline View
12. Create custom filtered views

---

## 📞 Support & Feedback

**Questions?** Check the documentation files:
- `SIDEBAR_FEATURES.md` - Feature details
- `ENHANCEMENT_IDEAS.md` - Future features
- `IMPLEMENTATION_SUMMARY.md` - Technical details

**Suggestions?** We'd love to hear your ideas for improvements!

---

## 🎉 Enjoy Your Trip!

This tool is designed to make your Japan trip planning easier and more enjoyable. Explore, plan, and get excited about your adventure!

**Happy Travels! 🗾✈️🎌**

---

**Version:** 2.0  
**Last Updated:** 2025-11-09

