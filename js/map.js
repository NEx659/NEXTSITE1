/**
 * NEXTSITE AI - Leaflet Map Integration for Udon Thani (จ.อุดรธานี)
 */

let mapInstance = null;
let markersLayer = null;

function initUdonMap(companies, onMarkerClick) {
  if (mapInstance) {
    return;
  }

  // พิกัดใจกลาง จ.อุดรธานี
  const udonCenter = [17.4157, 102.7872];

  mapInstance = L.map('udonMap', {
    scrollWheelZoom: true
  }).setView(udonCenter, 11);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors | NEXTSITE AI (จ.อุดรธานี)',
    maxZoom: 18
  }).addTo(mapInstance);

  markersLayer = L.layerGroup().addTo(mapInstance);
  renderMapMarkers(companies, onMarkerClick);
}

let markerMap = {};

function renderMapMarkers(companies, onMarkerClick) {
  if (!mapInstance || !markersLayer) return;

  markersLayer.clearLayers();
  markerMap = {};

  companies.forEach(company => {
    if (!company.coordinates) return;

    let markerColor = '#CA8A04'; // yellow
    if (company.opportunityScore >= 90) {
      markerColor = '#D9251D'; // red
    } else if (company.opportunityScore >= 70) {
      markerColor = '#EA580C'; // orange
    }

    const customIcon = L.divIcon({
      className: 'custom-map-pin',
      html: `
        <div style="
          background-color: ${markerColor};
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 11px;
          border: 2px solid white;
          box-shadow: 0 3px 8px rgba(0,0,0,0.3);
          cursor: pointer;
        ">
          ${company.opportunityScore}
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    const marker = L.marker(company.coordinates, { icon: customIcon });
    markerMap[company.id] = marker;

    const popupContent = `
      <div style="font-family: 'Prompt', sans-serif; min-width: 240px; padding: 4px;">
        <div style="font-size: 11px; color: #64748B; font-weight: 600;">อันดับที่ #${company.rank} • ${company.district} จ.สกลนคร</div>
        <div style="font-size: 13px; font-weight: 800; color: #0F172A; margin: 2px 0 4px 0;">${company.name}</div>
        <div style="font-size: 11px; color: #57534E; margin-bottom: 6px;">
          📍 <strong>พิกัด GPS:</strong> ${company.coordinates[0].toFixed(4)}, ${company.coordinates[1].toFixed(4)}
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px;">
          <span>คะแนน AI Score:</span>
          <strong style="color: ${markerColor};">${company.opportunityScore}/100</strong>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 6px;">
          <span>โครงการในมือ:</span>
          <strong>${company.totalProjects} โครงการ</strong>
        </div>
        <div style="font-size: 11px; background: #FAF7F0; padding: 6px; border-radius: 4px; border-left: 3px solid ${markerColor}; margin-bottom: 8px; color: #334155;">
          ${company.aiShortRec || company.aiRecommendation.substring(0, 65) + '...'}
        </div>
        <div style="display: flex; gap: 4px;">
          <a href="https://www.google.com/maps/place/${encodeURIComponent(company.name)}" target="_blank" rel="noopener noreferrer" style="
            flex: 1;
            background: #F1ECE0;
            color: #1C1917;
            text-decoration: none;
            border: 1px solid #D4CCA8;
            padding: 6px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 700;
            text-align: center;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 2px;
          ">
            🧭 Google Maps ↗
          </a>
          <button id="map-popup-btn-${company.id}" style="
            flex: 1.2;
            background: #D9251D;
            color: white;
            border: none;
            padding: 6px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 700;
            cursor: pointer;
          ">
            ดูข้อมูลบริษัท
          </button>
        </div>
      </div>
    `;

    marker.bindPopup(popupContent);

    marker.on('popupopen', () => {
      const btn = document.getElementById(`map-popup-btn-${company.id}`);
      if (btn && onMarkerClick) {
        btn.onclick = () => {
          onMarkerClick(company);
        };
      }
    });

    markersLayer.addLayer(marker);
  });
}

function focusMapOnCompany(company) {
  if (!mapInstance || !company.coordinates) return;
  mapInstance.setView(company.coordinates, 13, {
    animate: true
  });
  if (markerMap[company.id]) {
    markerMap[company.id].openPopup();
  }
}
