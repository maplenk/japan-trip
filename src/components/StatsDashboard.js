import React from 'react';

export default function StatsDashboard({ stats }) {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '8px',
            marginBottom: '16px',
            backgroundColor: 'white',
            padding: '12px',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
            <StatItem
                label="Days"
                value={stats.totalDays}
                icon="🗓️"
                color="#4ECDC4"
            />
            <div style={{ width: '1px', backgroundColor: '#E2E8F0' }}></div>
            <StatItem
                label="Locs"
                value={stats.totalDestinations}
                icon="📍"
                color="#FF6B6B"
            />
            <div style={{ width: '1px', backgroundColor: '#E2E8F0' }}></div>
            <StatItem
                label="Flights"
                value={stats.totalFlights}
                icon="✈️"
                color="#FFE66D"
            />
            <div style={{ width: '1px', backgroundColor: '#E2E8F0' }}></div>
            <StatItem
                label="Trains"
                value={stats.totalTrains}
                icon="🚄"
                color="#95E1D3"
            />
        </div>
    );
}

function StatItem({ label, value, icon, color }) {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            flex: 1
        }}>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#2D3748', lineHeight: '1' }}>
                <span style={{ fontSize: '14px', marginRight: '4px' }}>{icon}</span>
                {value}
            </div>
            <div style={{ fontSize: '10px', color: '#718096', marginTop: '2px', fontWeight: '600' }}>{label}</div>
        </div>
    );
}
