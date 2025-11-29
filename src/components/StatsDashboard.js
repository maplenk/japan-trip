import React from 'react';

export default function StatsDashboard({ stats, darkMode }) {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '8px',
            marginBottom: '16px',
            backgroundColor: 'var(--card-bg)',
            padding: '12px',
            borderRadius: '8px',
            boxShadow: '0 1px 3px var(--card-shadow)'
        }}>
            <StatItem label="Days" value={stats.totalDays} icon="🗓️" />
            <div style={{ width: '1px', backgroundColor: 'var(--border-color)' }}></div>
            <StatItem label="Locs" value={stats.totalDestinations} icon="📍" />
            <div style={{ width: '1px', backgroundColor: 'var(--border-color)' }}></div>
            <StatItem label="Flights" value={stats.totalFlights} icon="✈️" />
            <div style={{ width: '1px', backgroundColor: 'var(--border-color)' }}></div>
            <StatItem label="Trains" value={stats.totalTrains} icon="🚄" />
        </div>
    );
}

function StatItem({ label, value, icon }) {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            flex: 1
        }}>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--text-primary)', lineHeight: '1' }}>
                <span style={{ fontSize: '14px', marginRight: '4px' }}>{icon}</span>
                {value}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px', fontWeight: '600' }}>{label}</div>
        </div>
    );
}
