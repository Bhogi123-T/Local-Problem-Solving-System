// Global State
let map;
let markers = [];
let allComplaints = [];
let activeFilter = 'all';
let activeType = null;
const API_URL = '/api';

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initMap();
    fetchComplaints();

    // Realtime polling every 15 seconds
    setInterval(() => {
        fetchComplaints(true); // silent refresh
    }, 15000);

    // Form submission
    document.getElementById('report-form').addEventListener('submit', handleFormSubmit);

    // Geolocation button (form)
    document.getElementById('btn-get-location').addEventListener('click', getUserLocation);

    // Locate-me button on map
    document.getElementById('btn-map-locate').addEventListener('click', locateMeOnMap);

    // Close modal
    document.querySelector('.close-modal').addEventListener('click', () => {
        document.getElementById('insight-modal').classList.add('hidden');
    });

    // Map Filter Buttons
    document.querySelectorAll('.map-filter-btn[data-filter]').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.map-filter-btn[data-filter]').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeFilter = btn.getAttribute('data-filter');
            activeType = null;
            document.querySelectorAll('.map-filter-btn[data-type]').forEach(b => b.classList.remove('active'));
            applyMapFilter();
        });
    });

    document.querySelectorAll('.map-filter-btn[data-type]').forEach(btn => {
        btn.addEventListener('click', () => {
            const wasActive = btn.classList.contains('active');
            document.querySelectorAll('.map-filter-btn[data-type]').forEach(b => b.classList.remove('active'));
            if (!wasActive) {
                btn.classList.add('active');
                activeType = btn.getAttribute('data-type');
            } else {
                activeType = null;
            }
            applyMapFilter();
        });
    });
});

// Navigation Logic
function initNavigation() {
    const links = document.querySelectorAll('.nav-links li');
    const views = document.querySelectorAll('.view-section');

    links.forEach(link => {
        link.addEventListener('click', () => {
            links.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            const targetId = link.getAttribute('data-target');
            views.forEach(view => view.classList.remove('active'));
            document.getElementById(targetId).classList.add('active');

            // Invalidate map size when switching to map
            if (targetId === 'map-view' && map) {
                setTimeout(() => { map.invalidateSize(); }, 150);
            }
        });
    });
}

// Map Initialization
function initMap() {
    map = L.map('map', { zoomControl: true }).setView([11.0168, 76.9558], 13);

    // ── Google Tile Layers ────────────────────────────────────
    const googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        attribution: 'Map data &copy; <a href="https://www.google.com/maps">Google</a>'
    });

    const googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        attribution: 'Map data &copy; <a href="https://www.google.com/maps">Google</a>'
    });

    const googleHybrid = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        attribution: 'Map data &copy; <a href="https://www.google.com/maps">Google</a>'
    });

    const googleTerrain = L.tileLayer('http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        attribution: 'Map data &copy; <a href="https://www.google.com/maps">Google</a>'
    });

    // ── Default: Google Streets (not dark) ───────────────────
    googleStreets.addTo(map);

    // ── Layer switcher ────────────────────────────────────────
    L.control.layers({
        '🗺️ Google Maps (Street)': googleStreets,
        '🛰️ Google Satellite':     googleSat,
        '🛰️ Google Hybrid':        googleHybrid,
        '⛰️ Google Terrain':       googleTerrain
    }, {}, { position: 'topright', collapsed: false }).addTo(map);
}

// Fetch complaints
async function fetchComplaints(silent = false) {
    try {
        const response = await fetch(`${API_URL}/complaints`);
        const complaints = await response.json();
        allComplaints = complaints;

        updateDashboard(complaints);
        updateMap(complaints);
        updateLastUpdated();
    } catch (error) {
        console.error('Error fetching complaints:', error);
        if (!silent) {
            document.getElementById('complaints-list').innerHTML = `
                <div class="error-state" style="color: var(--urgent); padding: 20px; text-align: center;">
                    <i class="fa-solid fa-triangle-exclamation"></i> Failed to load data. Is the backend running?
                </div>
            `;
        }
    }
}

function updateLastUpdated() {
    const el = document.getElementById('map-last-updated');
    if (el) el.textContent = 'Updated ' + new Date().toLocaleTimeString();
}

// Apply filter to map
function applyMapFilter() {
    let filtered = allComplaints;

    if (activeFilter === 'resolved') {
        filtered = filtered.filter(c => c.resolved);
    } else if (activeFilter !== 'all') {
        filtered = filtered.filter(c => c.priority === activeFilter && !c.resolved);
    }

    if (activeType) {
        filtered = filtered.filter(c => c.type === activeType);
    }

    renderMapMarkers(filtered);
}

// Update Dashboard UI
function updateDashboard(complaints) {
    document.getElementById('stat-total').textContent = complaints.length;

    const urgentCount = complaints.filter(c => c.priority === 'urgent' && !c.resolved).length;
    document.getElementById('stat-urgent').textContent = urgentCount;

    const resolvedCount = complaints.filter(c => c.resolved).length;
    document.getElementById('stat-resolved').textContent = resolvedCount;

    const listEl = document.getElementById('complaints-list');
    listEl.innerHTML = '';

    if (complaints.length === 0) {
        listEl.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 20px;">No complaints reported yet.</p>';
        return;
    }

    const sorted = [...complaints].sort((a, b) => {
        if (a.resolved !== b.resolved) return a.resolved ? 1 : -1;
        const pMap = { urgent: 3, medium: 2, low: 1 };
        if (pMap[a.priority] !== pMap[b.priority]) return pMap[b.priority] - pMap[a.priority];
        return new Date(b.created_at) - new Date(a.created_at);
    });

    sorted.forEach(c => {
        const timeAgo = getTimeAgo(new Date(c.created_at));
        const ticketId = 'CA-' + new Date(c.created_at).getFullYear() + '-' + c.id.substring(0, 4).toUpperCase();

        let slaText = '', slaColor = '';
        const createdTime = new Date(c.created_at).getTime();
        const now = new Date().getTime();

        if (!c.resolved) {
            let deadlineHours = 720;
            if (c.priority === 'urgent') deadlineHours = 24;
            if (c.priority === 'medium') deadlineHours = 168;

            const elapsed = (now - createdTime) / (1000 * 60 * 60);
            const remaining = deadlineHours - elapsed;

            if (remaining < 0) { slaText = 'OVERDUE by ' + Math.abs(Math.floor(remaining)) + 'h'; slaColor = 'var(--urgent)'; }
            else if (remaining < 12) { slaText = 'DUE SOON (' + Math.floor(remaining) + 'h left)'; slaColor = 'var(--warning)'; }
            else { slaText = 'ON TIME (' + Math.floor(remaining / 24) + 'd left)'; slaColor = 'var(--success)'; }
        } else {
            slaText = 'RESOLVED'; slaColor = 'var(--success)';
        }

        const card = document.createElement('div');
        card.className = 'complaint-card glass-panel';
        if (c.resolved) card.style.opacity = '0.6';
        card.style.flexDirection = 'column';
        card.style.gap = '15px';

        card.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                <div class="complaint-main">
                    <div class="complaint-header">
                        <span class="badge" style="background:#222; border:1px solid #444; color:#fff"><i class="fa-solid fa-ticket"></i> ${ticketId}</span>
                        <span class="badge ${c.resolved ? 'badge-low' : 'badge-' + c.priority}">
                            ${c.resolved ? 'Resolved' : c.priority}
                        </span>
                        <span class="badge badge-type"><i class="fa-solid fa-tag"></i> ${c.type}</span>
                        <span class="badge" style="border: 1px solid ${slaColor}; color:${slaColor}"><i class="fa-solid fa-clock-rotate-left"></i> ${slaText}</span>
                    </div>
                    <h3 class="complaint-title">${c.title}</h3>
                    <div class="complaint-meta">
                        <span><i class="fa-solid fa-location-dot"></i> ${c.location}</span>
                        <span><i class="fa-regular fa-clock"></i> ${timeAgo}</span>
                    </div>
                </div>
                <div class="complaint-actions">
                    <button class="btn-upvote" onclick="upvote('${c.id}')" title="+2 Points for verified upvote!">
                        <i class="fa-solid fa-arrow-up"></i>
                        <span id="votes-${c.id}">${c.upvotes || 1}</span>
                    </button>
                </div>
            </div>
            <!-- Timeline -->
            <div style="display:flex; justify-content:space-between; align-items:center; background: rgba(255,255,255,0.05); padding: 10px 20px; border-radius: 8px; font-size: 0.8rem; color: #a3a3a3; position:relative;">
                <div style="position:absolute; top:20px; left:40px; right:40px; height:2px; background:#444; z-index:1;"></div>
                <div style="display:flex; flex-direction:column; align-items:center; gap:5px; z-index:2;">
                    <div style="width:20px; height:20px; border-radius:10px; background:var(--primary); box-shadow:0 0 10px var(--primary);"></div>
                    <span>Submitted</span>
                </div>
                <div style="display:flex; flex-direction:column; align-items:center; gap:5px; z-index:2;">
                    <div style="width:20px; height:20px; border-radius:10px; background:${c.priority === 'urgent' ? 'var(--primary)' : '#444'};"></div>
                    <span style="${c.priority === 'urgent' ? 'color:white' : ''}">Assigned</span>
                </div>
                <div style="display:flex; flex-direction:column; align-items:center; gap:5px; z-index:2;">
                    <div style="width:20px; height:20px; border-radius:10px; background:${c.resolved ? 'var(--primary)' : '#444'};"></div>
                    <span style="${c.resolved ? 'color:white' : ''}">${c.resolved ? 'Resolved ✅' : 'In Progress'}</span>
                </div>
            </div>
            <div class="complaint-ai-insight">
                <i class="fa-solid fa-robot" style="color: var(--primary);"></i>
                <strong>AI Assignment:</strong> Route to ${c.department}. Estimated time: ${c.estimated_time || 'N/A'}.
            </div>
        `;
        listEl.appendChild(card);
    });
}

// Update Map Markers
function updateMap(complaints) {
    renderMapMarkers(complaints);

    // Center on latest
    if (complaints.length > 0 && complaints[0].lat) {
        map.setView([complaints[0].lat, complaints[0].lng], 13);
    }
}

function renderMapMarkers(complaints) {
    markers.forEach(m => map.removeLayer(m));
    markers = [];

    complaints.forEach(c => {
        if (!c.lat || !c.lng) return;

        let color = '#58a6ff';
        if (c.priority === 'urgent') color = '#f85149';
        if (c.priority === 'medium') color = '#d29922';
        if (c.resolved) color = '#2ea043';

        const isUrgent = c.priority === 'urgent' && !c.resolved;
        const pulse = isUrgent
            ? `<span style="position:absolute;top:-6px;left:-6px;width:32px;height:32px;border-radius:50%;background:${color};opacity:0.3;animation:mapPulse 1.5s infinite;"></span>`
            : '';

        const iconHtml = `
            <div style="position:relative;width:20px;height:20px;">
                ${pulse}
                <span style="
                    background:${color}; width:20px; height:20px;
                    display:block; border-radius:50%;
                    border:2px solid #fff;
                    box-shadow:0 0 10px ${color};
                    position:relative; z-index:2;
                "></span>
            </div>`;

        const customIcon = L.divIcon({
            className: 'custom-pin',
            iconAnchor: [10, 10],
            html: iconHtml
        });

        const typeIcon = { Road: '🛣️', Water: '💧', Garbage: '🗑️', Electricity: '⚡', Other: '📌' };
        const desc = (c.description || '').substring(0, 120);

        const popupContent = `
            <div style="font-family:Outfit,sans-serif; min-width:220px; padding:4px;">
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
                    <span style="font-size:20px;">${typeIcon[c.type] || '📌'}</span>
                    <strong style="font-size:15px;">${c.type}</strong>
                    <span style="margin-left:auto;background:${color};color:#fff;padding:2px 8px;border-radius:10px;font-size:11px;text-transform:uppercase;">${c.resolved ? 'RESOLVED' : c.priority}</span>
                </div>
                <p style="margin:0 0 8px;font-size:13px;color:#444;line-height:1.4;">${desc}${desc.length >= 120 ? '…' : ''}</p>
                <div style="display:flex;gap:8px;font-size:11px;color:#666;flex-wrap:wrap;">
                    <span>📍 ${c.location}</span>
                    <span>🕐 ${getTimeAgo(new Date(c.created_at))}</span>
                </div>
                ${c.department ? `<div style="margin-top:6px;font-size:11px;color:#888;">🏢 ${c.department} &bull; ⏱ ${c.estimated_time || 'TBD'}</div>` : ''}
            </div>`;

        const marker = L.marker([c.lat, c.lng], { icon: customIcon })
            .bindPopup(popupContent, { maxWidth: 280 })
            .addTo(map);

        markers.push(marker);
    });
}

// Locate me on map
function locateMeOnMap() {
    const btn = document.getElementById('btn-map-locate');
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Locating…';

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
            map.setView([pos.coords.latitude, pos.coords.longitude], 15);
            L.circleMarker([pos.coords.latitude, pos.coords.longitude], {
                radius: 10, color: '#58a6ff', fillColor: '#58a6ff', fillOpacity: 0.5, weight: 2
            }).addTo(map).bindPopup('📍 You are here').openPopup();
            btn.innerHTML = '<i class="fa-solid fa-crosshairs"></i> My Location';
        }, () => {
            alert('Could not get location.');
            btn.innerHTML = '<i class="fa-solid fa-crosshairs"></i> My Location';
        });
    } else {
        alert('Geolocation not supported.');
        btn.innerHTML = '<i class="fa-solid fa-crosshairs"></i> My Location';
    }
}

// Handle Form Submission
async function handleFormSubmit(e) {
    e.preventDefault();

    const description = document.getElementById('description').value;
    const location = document.getElementById('location').value;
    const name = document.getElementById('name').value;
    const lat = document.getElementById('lat').value || map.getCenter().lat;
    const lng = document.getElementById('lng').value || map.getCenter().lng;

    const overlay = document.getElementById('ai-analyzing');
    overlay.classList.remove('hidden');

    try {
        const response = await fetch(`${API_URL}/complaints`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ description, location, name, lat: parseFloat(lat), lng: parseFloat(lng) })
        });

        const data = await response.json();

        if (data.success) {
            overlay.classList.add('hidden');
            document.getElementById('report-form').reset();
            showInsightModal(data.ai, data.complaint);
            fetchComplaints();
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        overlay.classList.add('hidden');
        alert('Failed to submit report. Please try again.');
    }
}

function showInsightModal(ai, complaint) {
    const content = document.getElementById('insight-content');
    let stepsHtml = '';
    if (ai.solution_steps && ai.solution_steps.length > 0) {
        stepsHtml = ai.solution_steps.map(s => `<li>${s}</li>`).join('');
    } else {
        stepsHtml = `<li>Standard procedures for ${ai.category} will be followed.</li>`;
    }

    content.innerHTML = `
        <div class="insight-block">
            <h4><i class="fa-solid fa-layer-group"></i> Category Classified</h4>
            <div class="insight-value">${ai.category}</div>
        </div>
        <div class="insight-block">
            <h4><i class="fa-solid fa-gauge-high"></i> Priority Evaluated</h4>
            <div class="insight-value">
                <span class="badge badge-${ai.priority}">${ai.priority}</span>
                <span style="font-size: 0.9em; margin-left: 10px; color: var(--text-muted);">${ai.priority_reason}</span>
            </div>
        </div>
        <div class="insight-block">
            <h4><i class="fa-solid fa-building-user"></i> Department Assigned</h4>
            <div class="insight-value">${ai.department}</div>
            <div style="font-size: 0.85em; color: var(--text-muted); margin-top: 5px;">Estimated time: ${ai.estimated_time}</div>
        </div>
        <div class="insight-block">
            <h4><i class="fa-solid fa-list-check"></i> Suggested Action Plan</h4>
            <ol class="steps-list">${stepsHtml}</ol>
        </div>
        <button class="btn-primary" style="margin-top: 20px;" onclick="document.getElementById('insight-modal').classList.add('hidden'); document.querySelector('[data-target=\\'dashboard-view\\']').click();">
            View on Dashboard
        </button>
    `;
    document.getElementById('insight-modal').classList.remove('hidden');
}

// Upvote Handler
async function upvote(id) {
    try {
        const response = await fetch(`${API_URL}/complaints/${id}/upvote`, { method: 'POST' });
        const data = await response.json();
        if (data.success) {
            const el = document.getElementById(`votes-${id}`);
            if (el) {
                el.textContent = parseInt(el.textContent) + 1;
                el.parentElement.style.transform = 'scale(1.2)';
                el.parentElement.style.color = 'var(--primary)';
                setTimeout(() => { el.parentElement.style.transform = 'scale(1)'; }, 200);
            }
        }
    } catch (e) {
        console.error('Error upvoting:', e);
    }
}

// Form Geolocation
function getUserLocation() {
    const btn = document.getElementById('btn-get-location');
    const icon = btn.querySelector('i');
    const locInput = document.getElementById('location');

    icon.className = 'fa-solid fa-spinner fa-spin';

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                document.getElementById('lat').value = position.coords.latitude;
                document.getElementById('lng').value = position.coords.longitude;
                locInput.value = `Location captured: ${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`;
                icon.className = 'fa-solid fa-check';
                btn.style.color = 'var(--success)';
                btn.style.borderColor = 'var(--success)';
                setTimeout(() => { icon.className = 'fa-solid fa-crosshairs'; btn.style = ''; }, 3000);
            },
            () => {
                alert('Could not get your location. Please type it manually.');
                icon.className = 'fa-solid fa-crosshairs';
            }
        );
    } else {
        alert('Geolocation is not supported by this browser.');
        icon.className = 'fa-solid fa-crosshairs';
    }
}

// Helper
function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + ' years ago';
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + ' months ago';
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + ' days ago';
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + ' hours ago';
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + ' mins ago';
    return Math.floor(seconds) + ' secs ago';
}
