/**
 * NEXTSITE AI - Leaflet Map Integration for Udon Thani (จ.อุดรธานี)
 * แสดงหมุดสีและตัวเลข Opportunity Score ตามเกณฑ์จริง:
 * - สีแดง (92 คะแนน / 7+ โครงการ)
 * - สีเขียว (80 คะแนน / 5-6 โครงการ)
 * - สีส้ม (70 คะแนน / 3-4 โครงการ)
 * - สีเหลือง (35 คะแนน / 1-2 โครงการ)
 * - สีเทา (15 คะแนน / 0 โครงการ)
 */

let mapInstance = null;
let markersLayer = null;
let markerMap = {};

function getExactMapCompanyScore(company) {
  if (company && typeof company.opportunityScore === 'number' && !isNaN(company.opportunityScore) && company.opportunityScore > 0) {
    return company.opportunityScore;
  }
  const projCount = (company.projects && Array.isArray(company.projects)) ? company.projects.length : (Number(company.totalProjects) || 0);
  if (projCount <= 0) return 15;
  if (projCount <= 2) return 35;
  if (projCount <= 4) return 70;
  if (projCount <= 6) return 80;
  return 92;
}

function getMapScoreStyle(score) {
  if (score >= 90) { // 7 โครงการขึ้นไป = 92
    return {
      bg: '#DC2626',
      label: 'โอกาสสูงสุด (92)',
      tierText: '🔴 เข้าพบด่วน',
      shadow: '0 3px 10px rgba(220, 38, 38, 0.55)',
      isTop: true
    };
  } else if (score >= 80) { // 5-6 โครงการ = 80
    return {
      bg: '#16A34A',
      label: 'โอกาสสูงมาก (80)',
      tierText: '🟢 เจรจาปิดดีล',
      shadow: '0 3px 8px rgba(22, 163, 74, 0.45)',
      isTop: false
    };
  } else if (score >= 70) { // 3-4 โครงการ = 70
    return {
      bg: '#EA580C',
      label: 'โอกาสสูง (70)',
      tierText: '🟠 เสนอแพ็กเกจ SCG',
      shadow: '0 3px 8px rgba(234, 88, 12, 0.45)',
      isTop: false
    };
  } else if (score >= 35) { // 1-2 โครงการ = 35
    return {
      bg: '#CA8A04',
      label: 'โอกาสเริ่มต้น (35)',
      tierText: '🟡 เฝ้าระวังหน้างาน',
      shadow: '0 3px 8px rgba(202, 138, 4, 0.45)',
      isTop: false
    };
  } else { // 0 โครงการ = 15
    return {
      bg: '#64748B',
      label: 'รอไซต์ใหม่ (15)',
      tierText: '⚪ รอตรวจจับ FB',
      shadow: '0 2px 6px rgba(100, 116, 139, 0.35)',
      isTop: false
    };
  }
}

function initUdonMap(companies, onMarkerClick) {
  const mapContainer = document.getElementById('udonMap');
  if (!mapContainer || mapInstance) {
    return;
  }

  // พิกัดใจกลาง จ.อุดรธานี
  const udonCenter = [17.4157, 102.7872];

  try {
    mapInstance = L.map('udonMap', {
      scrollWheelZoom: true
    }).setView(udonCenter, 12);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO | NEXTSITE AI (จ.อุดรธานี)',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(mapInstance);

    markersLayer = L.layerGroup().addTo(mapInstance);
    renderMapMarkers(companies, onMarkerClick);
  } catch (err) {
    console.warn('Map initialization skipped (container not active):', err);
  }
}

function renderMapMarkers(companies, onMarkerClick) {
  if (!mapInstance || !markersLayer) return;

  markersLayer.clearLayers();
  markerMap = {};

  const sourceList = Array.isArray(companies) ? companies : [];

  sourceList.forEach(company => {
    if (!company.coordinates || !Array.isArray(company.coordinates) || company.coordinates.length < 2) return;

    const oppScore = getExactMapCompanyScore(company);
    const scoreStyle = getMapScoreStyle(oppScore);
    const totalProj = (company.projects && Array.isArray(company.projects)) ? company.projects.length : (Number(company.totalProjects) || 0);
    const cleanName = (typeof cleanThaiText === 'function') ? cleanThaiText(company.name) : company.name;
    const cleanDist = (typeof cleanThaiText === 'function') ? cleanThaiText(company.district) : (company.district || 'เมืองอุดรธานี');

    const customIcon = L.divIcon({
      className: 'custom-map-pin',
      html: `
        <div style="
          background-color: ${scoreStyle.bg};
          color: #FFFFFF;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: 12px;
          font-family: 'Prompt', 'Inter', sans-serif;
          border: 2.5px solid #FFFFFF;
          box-shadow: ${scoreStyle.shadow};
          cursor: pointer;
          transition: transform 0.2s ease;
          ${scoreStyle.isTop ? 'transform: scale(1.12); ring: 2px solid #DC2626;' : ''}
        " title="${cleanName} (${oppScore} คะแนน)">
          ${oppScore}
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 17]
    });

    const marker = L.marker(company.coordinates, { icon: customIcon });
    markerMap[company.id] = marker;

    const popupContent = `
      <div style="font-family: 'Prompt', sans-serif; min-width: 250px; padding: 4px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px;">
          <span style="font-size: 11px; color: #64748B; font-weight: 700;">อ.${cleanDist} จ.อุดรธานี</span>
          <span style="font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 4px; background: ${scoreStyle.bg}; color: #FFFFFF;">
            ${scoreStyle.tierText}
          </span>
        </div>
        <div style="font-size: 13px; font-weight: 800; color: #0F172A; margin: 3px 0 6px 0; line-height: 1.3;">${cleanName}</div>
        
        <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; padding: 6px 8px; margin-bottom: 8px;">
          <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 3px;">
            <span style="color: #475569;">Opportunity Score:</span>
            <strong style="color: ${scoreStyle.bg}; font-size: 13px; font-weight: 900;">${oppScore} คะแนน</strong>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 12px;">
            <span style="color: #475569;">โครงการจริงในอุดรธานี:</span>
            <strong style="color: #0F172A;">${totalProj} โครงการ</strong>
          </div>
        </div>

        <div style="display: flex; gap: 6px;">
          <a href="${company.googleMapsUrl || company.gmaps || ('https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(cleanName + ' ' + (cleanDist || '') + ' อุดรธานี'))}" target="_blank" rel="noopener noreferrer" style="
            flex: 1;
            background: #F1F5F9;
            color: #334155;
            text-decoration: none;
            border: 1px solid #CBD5E1;
            padding: 6px 8px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 700;
            text-align: center;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 3px;
          ">
            🧭 Maps ↗
          </a>
          <button id="map-popup-btn-${company.id}" style="
            flex: 1.3;
            background: ${scoreStyle.bg};
            color: #FFFFFF;
            border: none;
            padding: 6px 10px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 800;
            cursor: pointer;
            box-shadow: 0 1px 4px rgba(0,0,0,0.15);
          ">
            ดูรายละเอียด
          </button>
        </div>
      </div>
    `;

    marker.bindPopup(popupContent);

    marker.on('popupopen', () => {
      const btn = document.getElementById(`map-popup-btn-${company.id}`);
      if (btn) {
        btn.onclick = () => {
          if (typeof onMarkerClick === 'function') {
            onMarkerClick(company);
          } else if (typeof openCompanyProjectsModal === 'function') {
            openCompanyProjectsModal(company);
          }
        };
      }
    });

    markersLayer.addLayer(marker);
  });
}

function focusMapOnCompany(company) {
  if (!mapInstance || !company || !company.coordinates) return;
  mapInstance.setView(company.coordinates, 14, {
    animate: true
  });
  if (markerMap[company.id]) {
    markerMap[company.id].openPopup();
  }
}

function initMap() {
  const comps = (typeof allCompanies !== 'undefined' && allCompanies.length > 0) 
    ? allCompanies 
    : ((typeof UDON_COMPANIES !== 'undefined') ? UDON_COMPANIES : []);
    
  initUdonMap(comps, (comp) => {
    if (typeof openCompanyProjectsModal === 'function') {
      openCompanyProjectsModal(comp);
    }
  });
}

if (typeof window !== 'undefined') {
  window.initMap = initMap;
  window.initUdonMap = initUdonMap;
  window.renderMapMarkers = renderMapMarkers;
  window.focusMapOnCompany = focusMapOnCompany;
  window.mapModule = {
    get map() { return mapInstance; },
    renderCompanyMarkers: (comps) => renderMapMarkers(comps, (c) => {
      if (typeof openCompanyProjectsModal === 'function') {
        openCompanyProjectsModal(c);
      }
    }),
    focusMapOnCompany: focusMapOnCompany
  };
}
