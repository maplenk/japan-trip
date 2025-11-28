import { MapContainer, TileLayer, Polyline, Marker, Popup, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './responsive.css';
import html2canvas from 'html2canvas';
import { useState, useRef, useEffect } from 'react';
import TripEditor from './components/TripEditor';
import StatsDashboard from './components/StatsDashboard';
import DayByDayView from './components/DayByDayView';
import { fetchWeather } from './services/weatherService';

// Fix for default marker icons in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Google Drive folder with all trip documents
const GOOGLE_DRIVE_FOLDER_URL = 'https://drive.google.com/drive/folders/1DoyM_lWfvlYCr2LlXLcTRi4DwJycrRVp';

// Component to handle map interactions from sidebar
function MapController({ center, zoom, shouldFly }) {
  const map = useMap();

  useEffect(() => {
    if (shouldFly && center) {
      map.flyTo(center, zoom || 8, {
        duration: 1.5
      });
    }
  }, [map, center, zoom, shouldFly]);

  return null;
}

const INITIAL_LOCATIONS = [
  {
    id: 1,
    name: 'Tokyo (Start)',
    coords: [35.6764, 139.6500],
    startDate: '2025-11-30',
    endDate: '2025-11-30',
    dates: 'Nov 30',
    duration: '1 day (transit)',
    activities: ['Arrive in Tokyo', 'Transfer to domestic terminal'],
    transport: 'ANA NH838 (05:55) + NH59 (10:00)',
    accommodation: 'Transit only',
    type: 'transit',
    color: '#FF6B6B',
    transportDetails: [
      { type: 'Flight', name: 'ANA NH838', date: '2025-11-30', departureTime: '05:55', arrivalTime: '08:00', bookingRef: '', link: 'https://www.ana.co.jp/en/jp/' },
      { type: 'Flight', name: 'ANA NH59', date: '2025-11-30', departureTime: '10:00', arrivalTime: '11:35', bookingRef: '' }
    ],
    accommodationDetails: [],
    dailyItinerary: {
      '2025-11-30': ['Arrive in Tokyo', 'Transfer to domestic terminal']
    },
    dailyWeather: {
      '2025-11-30': '☁️ Cloudy 12°C'
    }
  },
  {
    id: 2,
    name: 'Sapporo',
    coords: [43.0618, 141.3545],
    startDate: '2025-11-30',
    endDate: '2025-12-05',
    dates: 'Nov 30 - Dec 5',
    duration: '5 nights',
    activities: ['Visit Otaru', 'Klook Tour', 'Hill of Buddha', 'Chill in Sapporo', 'Odori Park', 'Clock Tower', 'Checkout at 10 AM', 'Transfer to domestic terminal', 'Departure at 2:25 PM'],
    transport: 'Local JR + Bus',
    accommodation: 'Hotel (Booking.com)',
    type: 'stay',
    color: '#4ECDC4',
    transportDetails: [],
    accommodationDetails: [
      { name: 'JR Inn Sapporo Kita 2 Jo', address: '060-0002 Hokkaido, Sapporo, Chuo-ku Kita 2Jo Nishi 2-8-1', bookingRef: 'Booking.com', link: 'https://www.booking.com' }
    ],
    dailyItinerary: {
      '2025-12-01': ['Visit Otaru'],
      '2025-12-02': ['Klook Tour'],
      '2025-12-03': ['Hill of Buddha'],
      '2025-12-04': ['Chill in Sapporo', 'Odori Park', 'Clock Tower'],
      '2025-12-05': ['Checkout at 10 AM', 'Transfer to domestic terminal', 'Departure at 2:25 PM']
    },
    dailyWeather: {
      '2025-12-01': '❄️ Snowy -2°C',
      '2025-12-02': '❄️ Heavy Snow -4°C'
    }
  },
  {
    id: 3,
    name: 'Fukuoka',
    coords: [33.5904, 130.4017],
    startDate: '2025-12-05',
    endDate: '2025-12-10',
    dates: 'Dec 5 - Dec 10',
    duration: '5 nights',
    activities: ['Klook Tour', 'Dazaifu', 'Nanzoin', 'Explore Fukuoka city', 'Checkout at 8 AM', 'Transfer to Hakata Station', 'Train to Yufuin'],
    transport: 'Subway / JR / Nishitetsu',
    arrivalTransport: 'ANA NH290 (14:25 → 17:05)',
    type: 'stay',
    color: '#4ECDC4',
    transportDetails: [
      { type: 'Flight', name: 'ANA NH290', date: '2025-12-05', departureTime: '14:25', arrivalTime: '17:05', bookingRef: '' }
    ],
    accommodationDetails: [
      { name: 'APA Hotel & Resort Hakata Ekihigashi', address: '1-18-1 Hakataekihigashi, Hakata-ku', bookingRef: 'Agoda' }
    ],
    dailyItinerary: {
      '2025-12-06': ['Klook Tour'],
      '2025-12-07': ['Dazaifu'],
      '2025-12-08': ['Nanzoin'],
      '2025-12-09': ['Explore Fukuoka city'],
      '2025-12-10': ['Checkout at 8 AM', 'Transfer to Hakata Station', 'Train to Yufuin']
    }
  },
  {
    id: 4,
    name: 'Yufuin',
    coords: [33.2667, 131.3667],
    startDate: '2025-12-10',
    endDate: '2025-12-10',
    dates: 'Dec 10',
    duration: 'Day trip',
    activities: ['Scenic train journey', 'Hot springs town visit'],
    transport: 'Yufuin no Mori (09:17 → 11:36)',
    accommodation: 'Day trip from Hakata',
    type: 'daytrip',
    color: '#FFE66D',
    transportDetails: [
      { type: 'Train', name: 'Yufuin no Mori', date: '2025-12-10', departureTime: '09:17', arrivalTime: '11:36', bookingRef: 'Klook' }
    ],
    accommodationDetails: [],
    dailyItinerary: {}
  },
  {
    id: 5,
    name: 'Beppu',
    coords: [33.2742, 131.4912],
    startDate: '2025-12-10',
    endDate: '2025-12-12',
    dates: 'Dec 10 - Dec 12',
    duration: '2 nights',
    activities: ['Hells of Beppu', 'Checkout at 6 AM', 'Transfer to Beppu Station', 'Train to Hakata'],
    transport: 'Local Bus / Onsen visits',
    arrivalTransport: 'Yufu 3 (14:42 → 15:31)',
    accommodation: 'Airbnb',
    type: 'stay',
    color: '#4ECDC4',
    transportDetails: [
      { type: 'Train', name: 'Yufu 3', date: '2025-12-10', departureTime: '14:42', arrivalTime: '15:31', bookingRef: 'Klook' },
      { type: 'Train', name: 'Sonic 8', date: '2025-12-12', departureTime: '07:22', arrivalTime: '09:40', bookingRef: 'Kyushu Rail' },
    ],
    accommodationDetails: [
      { name: 'Mitomi SPA', address: '874-0037, 大分県, 別府市, Kannawa, 大観山町4組', bookingRef: 'Airbnb' }
    ],
    dailyItinerary: {
      '2025-12-11': ['Hells of Beppu'],
      '2025-12-12': ['Checkout at 6 AM', 'Transfer to Beppu Station', 'Train to Hakata']
    }
  },
  {
    id: 6,
    name: 'Okinawa',
    coords: [26.2124, 127.6809],
    startDate: '2025-12-12',
    endDate: '2025-12-16',
    dates: 'Dec 12 - Dec 16',
    duration: '4 nights',
    activities: ['Explore Okinawa', 'Checkout at 8 AM', 'Transfer to Okinawa Airport', 'Departure at 12:05 PM'],
    transport: 'Car rental + Yui Rail',
    arrivalTransport: 'Sonic 8 (07:22 → 09:40) + Solaseed Air 6J101 (13:00 → 14:55)',
    accommodation: 'Airbnb',
    type: 'stay',
    color: '#4ECDC4',
    transportDetails: [
      { type: 'Flight', name: 'Solaseed Air 6J101', date: '2025-12-12', departureTime: '13:00', arrivalTime: '14:55', bookingRef: '' }
    ],
    accommodationDetails: [
      { name: 'Okinawa Airbnb', address: '1-chōme-14-10 Izumizaki, Naha, Okinawa 900-0021', bookingRef: 'Airbnb' }
    ],
    dailyItinerary: {
      '2025-12-13': ['Explore Okinawa'],
      '2025-12-14': ['Explore Okinawa'],
      '2025-12-15': ['Explore Okinawa'],
      '2025-12-16': ['Checkout at 8 AM', 'Transfer to Okinawa Airport', 'Departure at 12:05 PM']
    }
  },
  {
    id: 7,
    name: 'Osaka',
    coords: [34.6937, 135.5023],
    startDate: '2025-12-16',
    endDate: '2025-12-19',
    dates: 'Dec 16 - Dec 19',
    duration: '3 nights',
    activities: ['Cafe Hopping', 'Explore Dotonbori', 'Shinsaibashi', 'Checkout at 8 AM', 'Transfer to Osaka Namba', 'Train to Kyoto at 09:10 AM'],
    transport: 'JR / Metro / Kintetsu',
    arrivalTransport: 'Jetstar GK350 (12:05 → 14:05)',
    accommodation: 'Airbnb',
    type: 'stay',
    color: '#4ECDC4',
    transportDetails: [
      { type: 'Flight', name: 'Jetstar GK350', date: '2025-12-16', departureTime: '12:05', arrivalTime: '14:05', bookingRef: '' }
    ],
    accommodationDetails: [
      { name: 'Osaka Airbnb', address: '2-chōme-2-12 Higashishinsaibashi, Chuo Ward, Osaka, 542-0083', bookingRef: 'Airbnb' }
    ],
    dailyItinerary: {
      '2025-12-17': ['Cafe Hopping', 'Explore Dotonbori'],
      '2025-12-18': ['Shinsaibashi'],
      '2025-12-19': ['Checkout at 8 AM', 'Transfer to Osaka Namba', 'Train to Kyoto at 09:10 AM']
    }
  },
  {
    id: 8,
    name: 'Kyoto',
    coords: [35.0116, 135.7681],
    startDate: '2025-12-19',
    endDate: '2025-12-23',
    dates: 'Dec 19 - Dec 23',
    duration: '4 nights',
    activities: ['Explore Kyoto', 'Uji', 'Checkout at 10 AM', 'Transfer to Kyoto Station', 'Shinkansen to Tokyo'],
    transport: 'JR / Subway / Bus',
    transportDetails: [
      { type: 'Train', name: 'Aoyonishi', date: '2025-12-19', departureTime: '09:10', arrivalTime: '10:40', bookingRef: 'Kintetsu Rail' }
    ],
    accommodation: 'Hotel (Booking.com)',
    type: 'stay',
    color: '#4ECDC4',
    accommodationDetails: [
      { name: 'Carta Hotel', address: 'Gion District', bookingRef: 'Booking' }
    ],
    dailyItinerary: {
      '2025-12-19': ['Explore Kyoto'],
      '2025-12-20': ['Uji'],
      '2025-12-21': ['Explore Kyoto'],
      '2025-12-22': ['Explore Kyoto'],
      '2025-12-23': ['Checkout at 10 AM', 'Transfer to Kyoto Station', 'Shinkansen to Tokyo']
    }
  },
  {
    id: 9,
    name: 'Tokyo (End)',
    coords: [35.6764, 139.6500],
    startDate: '2025-12-23',
    endDate: '2025-12-28',
    dates: 'Dec 23 - Dec 28',
    duration: '5 nights',
    activities: ['Checkin and rest', 'Kamakura day trip', 'Explore Shibuya', 'Explore Shinjuku', 'Explore Akihabara', 'Checkout at 6 AM', 'Transfer to Airport', 'Flight to Delhi'],
    transport: 'JR + Subway',
    arrivalTransport: 'Shinkansen Nozomi (~2h30m)',
    accommodation: 'Airbnb',
    type: 'stay',
    color: '#4ECDC4',
    transportDetails: [
      { type: 'Train', name: 'Shinkansen Nozomi', date: '2025-12-23', departureTime: '10:00', arrivalTime: '12:30', bookingRef: '' }
    ],
    accommodationDetails: [
      { name: 'Tokyo Airbnb', address: 'Shinjuku', bookingRef: 'AB-000111' }
    ],
    dailyItinerary: {
      '2025-12-23': ['Checkin and rest'],
      '2025-12-24': ['Kamakura day trip'],
      '2025-12-25': ['Explore Shibuya'],
      '2025-12-26': ['Explore Shinjuku'],
      '2025-12-27': ['Explore Akihabara'],
      '2025-12-28': ['Checkout at 6 AM', 'Transfer to Airport', 'Flight to Delhi']
    }
  }
];

export default function JapanTripMap() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list', 'timeline', 'daily'
  const [mapCenter, setMapCenter] = useState(null);
  const [mapZoom, setMapZoom] = useState(5);
  const [shouldFlyToLocation, setShouldFlyToLocation] = useState(false);
  const [locations, setLocations] = useState(INITIAL_LOCATIONS);
  const [isEditing, setIsEditing] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);

  const markerRefs = useRef({});
  const mapRef = useRef(null); // Ref for the MapContainer

  // Check if running locally (allow editing only on localhost)
  const isLocalhost = window.location.hostname === 'localhost' ||
                      window.location.hostname === '127.0.0.1' ||
                      window.location.hostname === '';

  // Calculate trip statistics
  const tripStats = {
    totalDays: 28,
    totalDestinations: locations.length,
    totalFlights: locations.reduce((acc, loc) => acc + (loc.transportDetails?.filter(t => t.type === 'Flight').length || 0), 0),
    totalTrains: locations.reduce((acc, loc) => acc + (loc.transportDetails?.filter(t => t.type === 'Train').length || 0), 0),
    totalStays: locations.filter(l => l.type === 'stay').length,
    totalDayTrips: locations.filter(l => l.type === 'daytrip').length
  };

  // Filter locations based on search query
  const filteredLocations = locations.filter(loc => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();

    // Helper to check if any object in an array matches
    const hasMatch = (arr, keys) => arr && arr.some(item => keys.some(key => item[key] && item[key].toLowerCase().includes(query)));

    // Helper to check daily itinerary
    const hasDailyMatch = (daily) => daily && Object.values(daily).some(notes => notes.some(note => note.toLowerCase().includes(query)));

    return (
      loc.name.toLowerCase().includes(query) ||
      loc.activities.some(a => a.toLowerCase().includes(query)) ||
      loc.dates.toLowerCase().includes(query) ||
      loc.accommodation.toLowerCase().includes(query) ||
      (loc.transport && loc.transport.toLowerCase().includes(query)) ||
      hasMatch(loc.transportDetails, ['name', 'type', 'bookingRef']) ||
      hasMatch(loc.accommodationDetails, ['name', 'address', 'bookingRef']) ||
      hasDailyMatch(loc.dailyItinerary)
    );
  });

  // Handle destination click from sidebar
  const handleDestinationClick = (location) => {
    setSelectedDestination(location.id);
    setMapCenter(location.coords);
    setMapZoom(10);
    setShouldFlyToLocation(true);

    // Reset fly flag after animation
    setTimeout(() => {
      setShouldFlyToLocation(false);
      // Open the marker popup
      if (markerRefs.current[location.id]) {
        markerRefs.current[location.id].openPopup();
      }
    }, 1600);
  };

  const handleEditLocation = (location) => {
    setEditingLocation(location);
    setIsEditing(true);
  };

  const handleSaveLocation = (updatedLocation) => {
    if (updatedLocation.id) {
      setLocations(prev => prev.map(loc => loc.id === updatedLocation.id ? updatedLocation : loc));
    } else {
      // New location
      setLocations(prev => [...prev, { ...updatedLocation, id: Date.now(), coords: [35.6764, 139.6500] }]); // Default to Tokyo coords for new
    }
    setIsEditing(false);
    setEditingLocation(null);
  };

  const handleDeleteLocation = (id) => {
    if (window.confirm('Are you sure you want to delete this destination?')) {
      setLocations(prev => prev.filter(loc => loc.id !== id));
      setIsEditing(false);
      setEditingLocation(null);
    }
  };

  // Export itinerary as text
  const handleExportItinerary = () => {
    let itinerary = '🗾 JAPAN TRIP ITINERARY\n';
    itinerary += '='.repeat(50) + '\n\n';
    itinerary += `Trip Duration: November 30 - December 28 (${tripStats.totalDays} days)\n`;
    itinerary += `Total Destinations: ${tripStats.totalDestinations}\n`;
    itinerary += `Flights: ${tripStats.totalFlights} | Trains: ${tripStats.totalTrains}\n\n`;
    itinerary += '='.repeat(50) + '\n\n';

    locations.forEach((loc, idx) => {
      itinerary += `${idx + 1}. ${loc.name.toUpperCase()}\n`;
      itinerary += `   📅 ${loc.dates} (${loc.duration})\n`;

      // Detailed Transport
      if (loc.transportDetails && loc.transportDetails.length > 0) {
        itinerary += `   🚄 Transport Details:\n`;
        loc.transportDetails.forEach(t => {
          itinerary += `      - ${t.type}: ${t.name} (${t.date} | ${t.departureTime} -> ${t.arrivalTime}) ${t.bookingRef ? `[Ref: ${t.bookingRef}]` : ''}\n`;
        });
      } else if (loc.transport) {
        itinerary += `   🚌 Transport: ${loc.transport}\n`;
      }

      // Detailed Accommodation
      if (loc.accommodationDetails && loc.accommodationDetails.length > 0) {
        itinerary += `   🏨 Accommodation Details:\n`;
        loc.accommodationDetails.forEach(a => {
          itinerary += `      - ${a.name} (${a.address}) ${a.bookingRef ? `[Ref: ${a.bookingRef}]` : ''}\n`;
        });
      } else if (loc.accommodation) {
        itinerary += `   🏨 Accommodation: ${loc.accommodation}\n`;
      }

      // Daily Itinerary
      if (loc.dailyItinerary && Object.keys(loc.dailyItinerary).length > 0) {
        itinerary += `   📝 Daily Plan:\n`;
        Object.entries(loc.dailyItinerary).sort().forEach(([date, notes]) => {
          itinerary += `      [${date}]:\n`;
          notes.forEach(note => {
            itinerary += `        • ${note}\n`;
          });
        });
      } else {
        itinerary += `   🎯 Activities:\n`;
        loc.activities.forEach(activity => {
          itinerary += `      • ${activity}\n`;
        });
      }

      itinerary += '\n' + '-'.repeat(30) + '\n\n';
    });

    const blob = new Blob([itinerary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Japan_Trip_Itinerary.txt';
    link.click();
  };

  const handleExportImage = async () => {
    // Try to find either the daily view or list view
    let element = document.getElementById('itinerary-list-view');
    let filename = 'Japan_Trip_Daily_View.png';

    if (!element) {
      element = document.getElementById('itinerary-list-container');
      filename = 'Japan_Trip_List_View.png';
    }

    if (!element) {
      alert('Unable to find content to export. Please try again.');
      return;
    }

    try {
      // Store original styles
      const originalOverflow = element.style.overflow;
      const originalMaxHeight = element.style.maxHeight;
      const originalHeight = element.style.height;

      // Temporarily remove scroll constraints to capture all content
      element.style.overflow = 'visible';
      element.style.maxHeight = 'none';
      element.style.height = 'auto';

      const canvas = await html2canvas(element, {
        scale: 2, // Higher quality
        useCORS: true,
        backgroundColor: '#f8f9fa',
        windowHeight: element.scrollHeight,
        height: element.scrollHeight
      });

      // Restore original styles
      element.style.overflow = originalOverflow;
      element.style.maxHeight = originalMaxHeight;
      element.style.height = originalHeight;

      const link = document.createElement('a');
      link.download = filename;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Export failed:', err);
      alert('Failed to export image.');
    }
  };

  // Print itinerary
  const handlePrintItinerary = () => {
    window.print();
  };

  // Create custom icons for different location types
  const createCustomIcon = (type, number) => {
    const colors = {
      transit: '#FF6B6B',
      stay: '#4ECDC4',
      daytrip: '#FFE66D'
    };

    const color = colors[type] || '#95E1D3';

    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          background-color: ${color};
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 14px;
          color: #333;
        ">
          ${number}
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      popupAnchor: [0, -18]
    });
  };

  // Travel route in chronological order
  const route = locations.map(loc => loc.coords);

  // Create route segments with different colors for visual variety
  const routeSegments = [];
  for (let i = 0; i < route.length - 1; i++) {
    routeSegments.push({
      positions: [route[i], route[i + 1]],
      color: i % 2 === 0 ? '#FF6B6B' : '#4ECDC4'
    });
  }

  // Auto-fetch weather for all locations on page load
  useEffect(() => {
    const fetchAllWeather = async () => {
      setWeatherLoading(true);
      const today = new Date().toISOString().split('T')[0];

      const updatedLocations = await Promise.all(
        locations.map(async (loc) => {
          // Only fetch if weather for today doesn't exist
          if (!loc.dailyWeather || !loc.dailyWeather[today]) {
            try {
              const weather = await fetchWeather(loc.coords[0], loc.coords[1], today);
              return {
                ...loc,
                dailyWeather: {
                  ...loc.dailyWeather,
                  [today]: weather
                }
              };
            } catch (err) {
              console.error(`Failed to fetch weather for ${loc.name}:`, err);
              return loc;
            }
          }
          return loc;
        })
      );

      setLocations(updatedLocations);
      setWeatherLoading(false);
    };

    fetchAllWeather();
  }, []); // Run once on mount

  return (
    <div style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div className="app-header" style={{
        backgroundColor: '#2C3E50',
        color: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        position: 'relative',
        zIndex: 1002
      }}>
        <div className="header-spacer"></div>
        <div className="header-title">
          <h1>🗾 Japan Trip Itinerary Map</h1>
          <p style={{ opacity: 0.9 }}>
            Nov 30 - Dec 28 | 28 Days | {locations.length} Destinations
          </p>
        </div>
        <div className="header-buttons">
          <a
            href={GOOGLE_DRIVE_FOLDER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="header-btn"
            style={{ backgroundColor: '#FFE66D', color: '#2C3E50' }}
          >
            📁 Docs
          </a>
          {isLocalhost && (
            <button
              onClick={() => {
                setEditingLocation(null);
                setIsEditing(true);
              }}
              className="header-btn"
              style={{ backgroundColor: '#4ECDC4', color: 'white' }}
            >
              + Add
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area with Sidebar and Map */}
      <div style={{ flex: 1, display: 'flex', position: 'relative', overflow: 'hidden' }}>

        {/* Collapsible Sidebar */}
        <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          {/* Sidebar Content */}
          <div style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            paddingTop: '70px'
          }}>

            {/* Trip Statistics with Close Button */}
            <div style={{
              backgroundColor: '#F7FAFC',
              padding: '15px 20px',
              borderBottom: '1px solid #E2E8F0'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#2D3748' }}>
                  📊 Trip Overview
                </h2>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="sidebar-close-btn"
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    color: '#666',
                    padding: '4px 8px',
                    lineHeight: 1
                  }}
                >
                  ×
                </button>
              </div>
              <StatsDashboard stats={tripStats} />
            </div>

            {/* Search and View Toggle */}
            <div style={{ padding: '15px', borderBottom: '1px solid #E0E0E0', backgroundColor: '#FFFFFF' }}>
              <input
                type="text"
                placeholder="🔍 Search destinations, activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '2px solid #E0E0E0',
                  borderRadius: '6px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  marginBottom: '10px'
                }}
                onFocus={(e) => e.target.style.borderColor = '#4ECDC4'}
                onBlur={(e) => e.target.style.borderColor = '#E0E0E0'}
              />

              {/* View Mode Toggle */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setViewMode('list')}
                  style={{
                    flex: 1,
                    padding: '8px',
                    backgroundColor: viewMode === 'list' ? '#4ECDC4' : '#E0E0E0',
                    color: viewMode === 'list' ? 'white' : '#666',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  📋 List
                </button>
                <button
                  onClick={() => setViewMode('daily')}
                  style={{
                    flex: 1,
                    padding: '8px',
                    backgroundColor: viewMode === 'daily' ? '#4ECDC4' : '#E0E0E0',
                    color: viewMode === 'daily' ? 'white' : '#666',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  🗓️ Daily
                </button>
              </div>
            </div>

            {/* Destinations List */}
            <div id="itinerary-list-container" style={{
              flex: 1,
              overflowY: 'auto',
              padding: '10px',
              backgroundColor: '#F7FAFC'
            }}>
              {viewMode === 'list' ? (
                // List View
                filteredLocations.map((loc) => (
                  <div
                    key={loc.id}
                    onClick={() => handleDestinationClick(loc)}
                    style={{
                      backgroundColor: selectedDestination === loc.id ? '#E8F8F5' : 'white',
                      border: `2px solid ${selectedDestination === loc.id ? loc.color : 'transparent'}`,
                      borderRadius: '12px',
                      padding: '16px',
                      marginBottom: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                      position: 'relative'
                    }}
                  >
                    {isLocalhost && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditLocation(loc);
                        }}
                        style={{
                          position: 'absolute',
                          top: '10px',
                          right: '10px',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '16px',
                          opacity: 0.5
                        }}
                      >
                        ✏️
                      </button>
                    )}

                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      {/* Number Badge */}
                      <div style={{
                        backgroundColor: loc.color,
                        color: '#333',
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: '14px',
                        flexShrink: 0,
                        border: '2px solid white',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                      }}>
                        {locations.indexOf(loc) + 1}
                      </div>

                      {/* Content */}
                      <div style={{ flex: 1 }}>
                        <h3 style={{
                          margin: '0 0 6px 0',
                          fontSize: '16px',
                          fontWeight: 'bold',
                          color: '#2C3E50'
                        }}>
                          {loc.name}
                        </h3>
                        <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
                          <div style={{ marginBottom: '4px' }}>
                            <strong>📅</strong> {loc.dates} • {loc.duration}
                          </div>
                          <div style={{ marginBottom: '4px' }}>
                            <strong>🏨</strong> {loc.accommodation}
                          </div>
                        </div>
                        <div style={{
                          fontSize: '12px',
                          color: '#555',
                          backgroundColor: '#F8F9FA',
                          padding: '8px',
                          borderRadius: '4px',
                          borderLeft: `3px solid ${loc.color}`
                        }}>
                          <strong>🎯 Activities:</strong> {loc.activities.slice(0, 2).join(', ')}
                          {loc.activities.length > 2 && '...'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                // Daily View
                <DayByDayView locations={filteredLocations} onEditLocation={isLocalhost ? handleEditLocation : null} />
              )}
            </div>

            {/* Export/Print Buttons */}
            <div style={{ padding: '20px', borderTop: '1px solid #eee', textAlign: 'center', display: 'flex', gap: '10px' }}>
              <button onClick={handleExportItinerary} style={{
                flex: 1,
                padding: '10px',
                backgroundColor: '#2C3E50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}>
                Export Text
              </button>
              <button onClick={handleExportImage} style={{
                flex: 1,
                padding: '10px',
                backgroundColor: '#4ECDC4',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}>
                Export Image
              </button>
              <button
                onClick={handlePrintItinerary}
                style={{
                  flex: 1,
                  padding: '10px',
                  backgroundColor: '#2C3E50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#1A252F'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#2C3E50'}
              >
                🖨️ Print
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Toggle Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`sidebar-toggle ${sidebarOpen ? 'sidebar-open' : ''}`}
        >
          {sidebarOpen ? '◀' : '▶'}
        </button>

        {/* Map Container */}
        <div style={{ flex: 1, position: 'relative' }}>
          <MapContainer
            center={[36.2048, 138.2529]}
            zoom={5}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={true}
          >
            <MapController center={mapCenter} zoom={mapZoom} shouldFly={shouldFlyToLocation} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Route segments with alternating colors */}
            {routeSegments.map((segment, idx) => (
              <Polyline
                key={idx}
                positions={segment.positions}
                color={segment.color}
                weight={3}
                opacity={0.7}
                dashArray="10, 5"
              />
            ))}

            {/* Markers for each location */}
            {locations.map((loc, idx) => (
              <Marker
                key={loc.id}
                position={loc.coords}
                icon={createCustomIcon(loc.type, idx + 1)}
                ref={(ref) => {
                  if (ref) {
                    markerRefs.current[loc.id] = ref;
                  }
                }}
              >
                <Popup maxWidth={300} minWidth={250}>
                  <div style={{ padding: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `2px solid ${loc.color}`, paddingBottom: '5px', marginBottom: '10px' }}>
                      <h3 style={{
                        margin: 0,
                        color: loc.color,
                        fontSize: '18px',
                        fontWeight: 'bold',
                      }}>
                        {idx + 1}. {loc.name}
                      </h3>
                      {isLocalhost && (
                        <button
                          onClick={() => handleEditLocation(loc)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '16px'
                          }}
                        >
                          ✏️
                        </button>
                      )}
                    </div>

                    <div style={{ marginBottom: '8px' }}>
                      <strong>📅 Dates:</strong> {loc.dates}
                      <br />
                      <strong>🛏️ Duration:</strong> {loc.duration}
                    </div>

                    {loc.arrivalTransport && (
                      <div style={{ marginBottom: '8px' }}>
                        <strong>✈️ Arrival:</strong>
                        <div style={{ fontSize: '13px', marginLeft: '20px', color: '#555' }}>
                          {loc.arrivalTransport}
                        </div>
                      </div>
                    )}

                    <div style={{ marginBottom: '8px' }}>
                      <strong>🚌 Local Transport:</strong>
                      <div style={{ fontSize: '13px', marginLeft: '20px', color: '#555' }}>
                        {loc.transport}
                      </div>
                    </div>

                    <div style={{ marginBottom: '8px' }}>
                      <strong>🎯 Activities:</strong>
                      <ul style={{ margin: '5px 0', paddingLeft: '20px', fontSize: '13px' }}>
                        {loc.activities.map((activity, i) => (
                          <li key={i} style={{ color: '#555', marginBottom: '3px' }}>{activity}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <strong>🏨 Accommodation:</strong>
                      <div style={{ fontSize: '13px', marginLeft: '20px', color: '#555' }}>
                        {loc.accommodation}
                      </div>
                    </div>
                  </div>
                </Popup>

                <Tooltip direction="top" offset={[0, -10]} opacity={0.9}>
                  <strong>{loc.name}</strong>
                  <br />
                  {loc.dates}
                </Tooltip>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      {/* Footer with trip summary */}
      <div className="app-footer" style={{
        backgroundColor: '#34495E',
        color: 'white'
      }}>
        <p style={{ margin: 0 }}>
          Tap markers or list items for details | Use ▶ to toggle sidebar
        </p>
      </div>

      {isEditing && (
        <TripEditor
          location={editingLocation}
          onSave={handleSaveLocation}
          onCancel={() => {
            setIsEditing(false);
            setEditingLocation(null);
          }}
          onDelete={handleDeleteLocation}
        />
      )}
    </div>
  );
}