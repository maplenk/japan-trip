import React, { useState, useEffect } from 'react';
import { fetchWeather } from '../services/weatherService';

export default function TripEditor({ location, onSave, onCancel, onDelete }) {
  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    duration: '',
    accommodation: '', // Legacy field, kept for backward compat or summary
    transport: '', // Legacy field
    activities: '', // Legacy field
    type: 'stay',
    color: '#4ECDC4',
    transportDetails: [],
    accommodationDetails: [],
    dailyItinerary: {},
    dailyWeather: {}
  });

  useEffect(() => {
    if (location) {
      setFormData({
        ...location,
        activities: Array.isArray(location.activities) ? location.activities.join(', ') : location.activities,
        transportDetails: location.transportDetails || [],
        accommodationDetails: location.accommodationDetails || [],
        dailyItinerary: location.dailyItinerary || {},
        dailyWeather: location.dailyWeather || {}
      });
    }
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedLocation = {
      ...formData,
      activities: formData.activities.split(',').map(a => a.trim()).filter(a => a)
    };
    onSave(updatedLocation);
  };

  // --- Helper components for lists ---

  const AddTransport = () => {
    const [newItem, setNewItem] = useState({ type: 'Train', name: '', date: formData.startDate, departureTime: '', arrivalTime: '', bookingRef: '', link: '' });

    const add = () => {
      setFormData(prev => ({
        ...prev,
        transportDetails: [...prev.transportDetails, newItem]
      }));
      setNewItem({ type: 'Train', name: '', date: formData.startDate, departureTime: '', arrivalTime: '', bookingRef: '', link: '' });
    };

    return (
      <div style={subFormStyle}>
        <h4 style={{ marginTop: 0 }}>Add Transport</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <input placeholder="Type (e.g. Train)" value={newItem.type} onChange={e => setNewItem({ ...newItem, type: e.target.value })} style={inputStyle} />
          <input placeholder="Name (e.g. Shinkansen)" value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} style={inputStyle} />
          <input type="date" value={newItem.date} onChange={e => setNewItem({ ...newItem, date: e.target.value })} style={inputStyle} />
          <input placeholder="Ref #" value={newItem.bookingRef} onChange={e => setNewItem({ ...newItem, bookingRef: e.target.value })} style={inputStyle} />
          <input type="time" placeholder="Dep" value={newItem.departureTime} onChange={e => setNewItem({ ...newItem, departureTime: e.target.value })} style={inputStyle} />
          <input type="time" placeholder="Arr" value={newItem.arrivalTime} onChange={e => setNewItem({ ...newItem, arrivalTime: e.target.value })} style={inputStyle} />
          <input placeholder="Link / PDF URL" value={newItem.link} onChange={e => setNewItem({ ...newItem, link: e.target.value })} style={{ ...inputStyle, gridColumn: '1 / -1' }} />
        </div>
        <button type="button" onClick={add} style={{ ...buttonStyle, marginTop: '8px', width: '100%', backgroundColor: '#4ECDC4', color: 'white' }}>Add Transport</button>
      </div>
    );
  };

  const AddAccommodation = () => {
    const [newItem, setNewItem] = useState({ name: '', address: '', bookingRef: '', link: '' });

    const add = () => {
      setFormData(prev => ({
        ...prev,
        accommodationDetails: [...prev.accommodationDetails, newItem]
      }));
      setNewItem({ name: '', address: '', bookingRef: '', link: '' });
    };

    return (
      <div style={subFormStyle}>
        <h4 style={{ marginTop: 0 }}>Add Accommodation</h4>
        <div style={{ display: 'grid', gap: '8px' }}>
          <input placeholder="Hotel Name" value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} style={inputStyle} />
          <input placeholder="Address" value={newItem.address} onChange={e => setNewItem({ ...newItem, address: e.target.value })} style={inputStyle} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <input placeholder="Booking Ref" value={newItem.bookingRef} onChange={e => setNewItem({ ...newItem, bookingRef: e.target.value })} style={inputStyle} />
            <input placeholder="Link / PDF URL" value={newItem.link} onChange={e => setNewItem({ ...newItem, link: e.target.value })} style={inputStyle} />
          </div>
        </div>
        <button type="button" onClick={add} style={{ ...buttonStyle, marginTop: '8px', width: '100%', backgroundColor: '#4ECDC4', color: 'white' }}>Add Accommodation</button>
      </div>
    );
  };

  const DailyPlanner = () => {
    const [selectedDate, setSelectedDate] = useState(formData.startDate);
    const [note, setNote] = useState('');
    const [weather, setWeather] = useState('');
    const [loadingWeather, setLoadingWeather] = useState(false);

    // Load existing weather when date changes
    useEffect(() => {
      // This is a simplified way to handle weather state in this local component
      // Ideally weather should be part of the dailyItinerary object structure or a separate object
      // For now, let's assume dailyItinerary stores notes array, we might need to refactor dailyItinerary to store object { notes: [], weather: '' }
      // OR we can store weather as a special note prefix or separate state.
      // Let's refactor dailyItinerary to be { date: { notes: [], weather: '' } } ?
      // No, that would break existing structure.
      // Let's add a separate 'dailyWeather' object to formData?
      // Or just append weather to the date key in a new object?
      // Let's stick to the plan: "Update DailyPlanner... to include Weather input"
      // We need to store it. Let's add `dailyWeather` to formData.
    }, [selectedDate]);

    const addNote = () => {
      if (!selectedDate || !note) return;
      setFormData(prev => {
        const currentNotes = prev.dailyItinerary[selectedDate] || [];
        return {
          ...prev,
          dailyItinerary: {
            ...prev.dailyItinerary,
            [selectedDate]: [...currentNotes, note]
          }
        };
      });
      setNote('');
    };

    const saveWeather = () => {
      if (!selectedDate) return;
      setFormData(prev => ({
        ...prev,
        dailyWeather: {
          ...prev.dailyWeather,
          [selectedDate]: weather
        }
      }));
    };

    const handleAutoFetch = async () => {
      if (!selectedDate || !location.coords) return;
      setLoadingWeather(true);
      const result = await fetchWeather(location.coords[0], location.coords[1], selectedDate);
      setWeather(result);
      setLoadingWeather(false);
    };

    return (
      <div style={subFormStyle}>
        <h4 style={{ marginTop: 0 }}>Daily Plans</h4>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Date</label>
            <input type="date" value={selectedDate} onChange={e => {
              setSelectedDate(e.target.value);
              setWeather(formData.dailyWeather?.[e.target.value] || '');
            }} style={inputStyle} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Weather</label>
            <div style={{ display: 'flex', gap: '4px' }}>
              <input placeholder="e.g. ☀️ 20°C" value={weather} onChange={e => setWeather(e.target.value)} style={inputStyle} />
              <button type="button" onClick={handleAutoFetch} disabled={loadingWeather} style={{ ...buttonStyle, padding: '8px', backgroundColor: '#4ECDC4', color: 'white' }}>
                {loadingWeather ? '...' : 'Auto'}
              </button>
              <button type="button" onClick={saveWeather} style={{ ...buttonStyle, padding: '8px', backgroundColor: '#FF6B6B', color: 'white' }}>Save</button>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <input placeholder="Activity or Note" value={note} onChange={e => setNote(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
          <button type="button" onClick={addNote} style={{ ...buttonStyle, backgroundColor: '#2C3E50', color: 'white' }}>Add Note</button>
        </div>

        <div style={{ marginTop: '12px' }}>
          {Object.entries(formData.dailyItinerary).map(([date, notes]) => (
            <div key={date} style={{ marginBottom: '8px', padding: '8px', backgroundColor: 'white', borderRadius: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <strong>{date}:</strong>
                {formData.dailyWeather?.[date] && <span style={{ fontSize: '12px', backgroundColor: '#E6FFFA', padding: '2px 6px', borderRadius: '4px', color: '#2C7A7B' }}>{formData.dailyWeather[date]}</span>}
              </div>
              <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
                {notes.map((n, i) => <li key={i}>{n}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        width: '90%',
        maxWidth: '600px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
      }}>
        {/* Header */}
        <div style={{ padding: '20px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '20px', color: '#1a202c' }}>
            {location ? 'Edit Destination' : 'Add Destination'}
          </h2>
          <button onClick={onCancel} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#718096' }}>×</button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #E2E8F0' }}>
          {['General', 'Transport', 'Accommodation', 'Daily Plan'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              style={{
                flex: 1,
                padding: '12px',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab.toLowerCase() ? '2px solid #4ECDC4' : '2px solid transparent',
                color: activeTab === tab.toLowerCase() ? '#4ECDC4' : '#718096',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {activeTab === 'general' && (
              <>
                <div>
                  <label style={labelStyle}>Destination Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} style={inputStyle} required />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={labelStyle}>Start Date</label>
                    <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} style={inputStyle} required />
                  </div>
                  <div>
                    <label style={labelStyle}>End Date</label>
                    <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} style={inputStyle} required />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Type</label>
                  <select name="type" value={formData.type} onChange={handleChange} style={inputStyle}>
                    <option value="stay">Stay</option>
                    <option value="transit">Transit</option>
                    <option value="daytrip">Day Trip</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Color</label>
                  <input type="color" name="color" value={formData.color} onChange={handleChange} style={{ ...inputStyle, height: '42px', padding: '4px' }} />
                </div>

                <div style={{ marginTop: '16px', borderTop: '1px solid #E2E8F0', paddingTop: '16px' }}>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#2D3748' }}>Summary Details</h4>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={labelStyle}>Activities (comma separated)</label>
                    <textarea name="activities" value={formData.activities} onChange={handleChange} style={{ ...inputStyle, height: '60px', fontFamily: 'inherit' }} />
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={labelStyle}>Transport Summary</label>
                    <input type="text" name="transport" value={formData.transport} onChange={handleChange} style={inputStyle} placeholder="e.g. JR / Subway" />
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={labelStyle}>Accommodation Summary</label>
                    <input type="text" name="accommodation" value={formData.accommodation} onChange={handleChange} style={inputStyle} placeholder="e.g. Hotel Name" />
                  </div>
                </div>
              </>
            )}

            {activeTab === 'transport' && (
              <>
                <AddTransport />
                <div style={{ marginTop: '16px' }}>
                  <h4 style={{ margin: '0 0 8px 0' }}>Current Transport</h4>
                  {formData.transportDetails.map((t, i) => (
                    <div key={i} style={itemStyle}>
                      <strong>{t.type}</strong>: {t.name} ({t.date})
                    </div>
                  ))}
                </div>
              </>
            )}

            {activeTab === 'accommodation' && (
              <>
                <AddAccommodation />
                <div style={{ marginTop: '16px' }}>
                  <h4 style={{ margin: '0 0 8px 0' }}>Current Accommodation</h4>
                  {formData.accommodationDetails.map((a, i) => (
                    <div key={i} style={itemStyle}>
                      <strong>{a.name}</strong>: {a.address}
                    </div>
                  ))}
                </div>
              </>
            )}

            {activeTab === 'daily plan' && (
              <DailyPlanner />
            )}

          </form>
        </div>

        {/* Footer */}
        <div style={{ padding: '20px', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          {location && (
            <button type="button" onClick={() => onDelete(location.id)} style={{ ...buttonStyle, backgroundColor: '#FC8181', color: 'white', marginRight: 'auto' }}>
              Delete
            </button>
          )}
          <button type="button" onClick={onCancel} style={{ ...buttonStyle, backgroundColor: '#EDF2F7', color: '#4A5568' }}>
            Cancel
          </button>
          <button onClick={handleSubmit} style={{ ...buttonStyle, backgroundColor: '#4ECDC4', color: 'white' }}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

const labelStyle = {
  display: 'block',
  marginBottom: '6px',
  fontSize: '12px',
  fontWeight: '600',
  color: '#4A5568',
  textTransform: 'uppercase',
  letterSpacing: '0.5px'
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  borderRadius: '6px',
  border: '1px solid #E2E8F0',
  fontSize: '14px',
  outline: 'none',
  transition: 'border-color 0.2s'
};

const buttonStyle = {
  padding: '10px 20px',
  borderRadius: '6px',
  border: 'none',
  fontSize: '14px',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'opacity 0.2s'
};

const subFormStyle = {
  backgroundColor: '#F7FAFC',
  padding: '16px',
  borderRadius: '8px',
  border: '1px solid #E2E8F0'
};

const itemStyle = {
  backgroundColor: 'white',
  padding: '8px 12px',
  borderRadius: '6px',
  border: '1px solid #E2E8F0',
  marginBottom: '4px',
  fontSize: '13px'
};
