import React, { useState } from 'react';

export default function DayByDayView({ locations, onEditLocation, onMoveActivity, darkMode }) {
    const [movingItem, setMovingItem] = useState(null); // { locId, fromDate, activityIndex, activity }
    // Helper to generate date range
    const getDaysArray = (start, end) => {
        const arr = [];
        for (let dt = new Date(start); dt <= new Date(end); dt.setDate(dt.getDate() + 1)) {
            arr.push(new Date(dt));
        }
        return arr;
    };

    // Find min and max dates from locations
    const allDates = locations.flatMap(l => [new Date(l.startDate), new Date(l.endDate)]);
    const minDate = new Date(Math.min.apply(null, allDates));
    const maxDate = new Date(Math.max.apply(null, allDates));

    // Generate full trip timeline
    const tripDays = getDaysArray(minDate, maxDate);

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    };

    const isSameDay = (d1, d2) => {
        return d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate();
    };

    return (
        <div id="itinerary-list-view" style={{
            padding: '20px',
            maxWidth: '800px',
            margin: '0 auto',
            backgroundColor: 'var(--bg-secondary)'
        }}>
            <h2 style={{ textAlign: 'center', color: 'var(--text-primary)', marginBottom: '30px' }}>
                Japan Trip 2025 🇯🇵
            </h2>
            {tripDays.map((day, index) => {
                // Find location(s) for this day
                const dayLocations = locations.filter(loc => {
                    const start = new Date(loc.startDate);
                    const end = new Date(loc.endDate);
                    return day >= start && day <= end;
                });

                return (
                    <div key={index} style={{
                        marginBottom: '24px',
                        backgroundColor: 'var(--card-bg)',
                        borderRadius: '12px',
                        boxShadow: '0 2px 8px var(--card-shadow)',
                        overflow: 'hidden'
                    }}>
                        {/* Date Header */}
                        <div style={{
                            backgroundColor: 'var(--header-bg)',
                            color: 'white',
                            padding: '12px 20px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>
                                    {formatDate(day)}
                                </h3>
                                {/* Weather Display */}
                                {dayLocations.map(loc => loc.dailyWeather && loc.dailyWeather[day.toISOString().split('T')[0]] && (
                                    <span key={loc.id} style={{ fontSize: '13px', backgroundColor: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '12px' }}>
                                        {loc.dailyWeather[day.toISOString().split('T')[0]]}
                                    </span>
                                ))}
                            </div>
                            <span style={{ fontSize: '12px', opacity: 0.8 }}>Day {index + 1}</span>
                        </div>

                        {/* Day Content */}
                        <div style={{ padding: '20px' }}>
                            {dayLocations.length === 0 ? (
                                <div style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No location set for this day</div>
                            ) : (
                                dayLocations.map(loc => (
                                    <div key={loc.id} style={{ marginBottom: '16px', borderLeft: `4px solid ${loc.color}`, paddingLeft: '16px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                            <h4 style={{ margin: 0, color: 'var(--text-primary)' }}>{loc.name}</h4>
                                            {onEditLocation && (
                                                <button
                                                    onClick={() => onEditLocation(loc)}
                                                    style={{
                                                        background: 'none',
                                                        border: 'none',
                                                        color: '#4ECDC4',
                                                        cursor: 'pointer',
                                                        fontSize: '12px',
                                                        fontWeight: '600'
                                                    }}
                                                >
                                                    EDIT
                                                </button>
                                            )}
                                        </div>

                                        {/* Transport for this day */}
                                        {loc.transportDetails && loc.transportDetails.length > 0 ? (
                                            loc.transportDetails.map((trans, i) => {
                                                const transDate = new Date(trans.date);
                                                if (isSameDay(transDate, day)) {
                                                    return (
                                                        <div key={i} style={itemStyle}>
                                                            <span style={{ marginRight: '8px' }}>
                                                                {trans.type === 'Flight' ? '✈️' : '🚄'}
                                                            </span>
                                                            <div style={{ flex: 1 }}>
                                                                <div style={{ fontWeight: '500' }}>{trans.type}: {trans.name}</div>
                                                                <div style={{ fontSize: '12px', color: '#718096' }}>
                                                                    {trans.departureTime} → {trans.arrivalTime}
                                                                    {trans.bookingRef && ` | Ref: ${trans.bookingRef}`}
                                                                </div>
                                                            </div>
                                                            {trans.link && (
                                                                <a href={trans.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', fontSize: '18px' }} title="View Booking/Ticket">
                                                                    📄
                                                                </a>
                                                            )}
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            })
                                        ) : (
                                            // Fallback: Show legacy transport string on the start date
                                            isSameDay(new Date(loc.startDate), day) && loc.transport && (
                                                <div style={itemStyle}>
                                                    <span style={{ marginRight: '8px' }}>🚌</span>
                                                    <div>
                                                        <div style={{ fontWeight: '500' }}>Transport</div>
                                                        <div style={{ fontSize: '12px', color: '#718096' }}>{loc.transport}</div>
                                                    </div>
                                                </div>
                                            )
                                        )}

                                        {/* Accommodation (only show on check-in or if it's a stay) */}
                                        {loc.accommodationDetails && loc.accommodationDetails.length > 0 ? (
                                            loc.accommodationDetails.map((acc, i) => {
                                                return (
                                                    <div key={i} style={itemStyle}>
                                                        <span style={{ marginRight: '8px' }}>🏨</span>
                                                        <div style={{ flex: 1 }}>
                                                            <div style={{ fontWeight: '500' }}>{acc.name}</div>
                                                            <div style={{ fontSize: '12px', color: '#718096' }}>
                                                                {acc.address}
                                                                {acc.bookingRef && ` | Ref: ${acc.bookingRef}`}
                                                            </div>
                                                        </div>
                                                        {acc.link && (
                                                            <a href={acc.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', fontSize: '18px' }} title="View Booking">
                                                                📄
                                                            </a>
                                                        )}
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            // Fallback: Show legacy accommodation string on every day
                                            loc.accommodation && (
                                                <div style={itemStyle}>
                                                    <span style={{ marginRight: '8px' }}>🛏️</span>
                                                    <div>
                                                        <div style={{ fontWeight: '500' }}>Accommodation</div>
                                                        <div style={{ fontSize: '12px', color: '#718096' }}>{loc.accommodation}</div>
                                                    </div>
                                                </div>
                                            )
                                        )}

                                        {/* Daily Notes/Activities */}
                                        {loc.dailyItinerary && loc.dailyItinerary[day.toISOString().split('T')[0]] && (
                                            <div style={{ marginTop: '12px' }}>
                                                <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '4px' }}>ACTIVITIES & NOTES</div>
                                                {loc.dailyItinerary[day.toISOString().split('T')[0]].map((note, i) => {
                                                    const dateStr = day.toISOString().split('T')[0];
                                                    const isMoving = movingItem && movingItem.locId === loc.id && movingItem.fromDate === dateStr && movingItem.activityIndex === i;

                                                    return (
                                                        <div key={i} style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            marginBottom: '4px',
                                                            fontSize: '14px',
                                                            backgroundColor: isMoving ? 'var(--bg-tertiary)' : 'transparent',
                                                            padding: '4px 6px',
                                                            borderRadius: '4px',
                                                            gap: '8px'
                                                        }}>
                                                            <span style={{ color: '#4ECDC4' }}>•</span>
                                                            <span style={{ flex: 1 }}>{note}</span>
                                                            {onMoveActivity && (
                                                                <button
                                                                    onClick={() => {
                                                                        if (isMoving) {
                                                                            setMovingItem(null);
                                                                        } else {
                                                                            setMovingItem({ locId: loc.id, fromDate: dateStr, activityIndex: i, activity: note });
                                                                        }
                                                                    }}
                                                                    style={{
                                                                        background: isMoving ? '#FF6B6B' : 'var(--bg-tertiary)',
                                                                        border: 'none',
                                                                        borderRadius: '4px',
                                                                        padding: '2px 6px',
                                                                        cursor: 'pointer',
                                                                        fontSize: '11px',
                                                                        color: isMoving ? 'white' : 'var(--text-muted)'
                                                                    }}
                                                                    title={isMoving ? 'Cancel move' : 'Move to another day'}
                                                                >
                                                                    {isMoving ? '✕' : '↔️'}
                                                                </button>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        {/* Move target indicator */}
                                        {movingItem && movingItem.locId === loc.id && movingItem.fromDate !== day.toISOString().split('T')[0] && (
                                            <button
                                                onClick={() => {
                                                    onMoveActivity(
                                                        loc.id,
                                                        movingItem.fromDate,
                                                        day.toISOString().split('T')[0],
                                                        movingItem.activityIndex,
                                                        movingItem.activity
                                                    );
                                                    setMovingItem(null);
                                                }}
                                                style={{
                                                    width: '100%',
                                                    marginTop: '8px',
                                                    padding: '8px',
                                                    backgroundColor: '#4ECDC4',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer',
                                                    fontSize: '12px',
                                                    fontWeight: '600'
                                                }}
                                            >
                                                📥 Move "{movingItem.activity}" here
                                            </button>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

const itemStyle = {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'var(--bg-secondary)',
    padding: '8px',
    borderRadius: '6px',
    marginBottom: '8px',
    fontSize: '14px',
    color: 'var(--text-primary)'
};
