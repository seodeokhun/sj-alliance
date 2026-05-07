"use client";

import { useEffect, useRef, useState } from "react";
import { CATEGORY_INFO, type Store } from "@/data/stores";

declare global {
  interface Window {
    L: any;
  }
}

interface LeafletMapProps {
  stores: Store[];
  selectedStoreId?: number | null;
  onMarkerClick?: (id: number) => void;
  className?: string;
}

export default function LeafletMap({
  stores,
  selectedStoreId,
  onMarkerClick,
  className = "",
}: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersRef = useRef<{ id: number; marker: any }[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Leaflet CSS + JS 로드 (CDN)
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.L) {
      setMapLoaded(true);
      return;
    }

    // CSS
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css";
    link.crossOrigin = "";
    document.head.appendChild(link);

    // JS
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js";
    script.crossOrigin = "";
    script.async = true;
    script.onload = () => setMapLoaded(true);
    script.onerror = () => setError("지도 라이브러리 로드 실패");
    document.head.appendChild(script);
  }, []);

  // 지도 초기화 + 마커 생성 (한 번만)
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || mapInstance.current) return;

    const L = window.L;
    const map = L.map(mapRef.current, {
      center: [37.7807, 127.0444],
      zoom: 13,
      scrollWheelZoom: true,
    });
    mapInstance.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    // 카테고리 색상
    const CAT_COLOR: Record<string, string> = {
      korean: "#EA580C", meat: "#DC2626", soup: "#D97706", chicken: "#F59E0B",
      jokbal: "#92400E", pub: "#7C3AED", bakery: "#A16207",
      western: "#0891B2", "etc-food": "#6B7280", goods: "#10B981",
      auto: "#1F2937", fitness: "#EC4899", "real-estate": "#3B82F6", lodging: "#059669",
    };

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapLoaded]);

  // 마커 갱신 (stores 변경 시)
  useEffect(() => {
    if (!mapLoaded || !mapInstance.current) return;
    const L = window.L;
    const map = mapInstance.current;

    // 기존 마커 제거
    markersRef.current.forEach(({ marker }) => map.removeLayer(marker));
    markersRef.current = [];

    if (stores.length === 0) return;

    const CAT_COLOR: Record<string, string> = {
      korean: "#EA580C", meat: "#DC2626", soup: "#D97706", chicken: "#F59E0B",
      jokbal: "#92400E", pub: "#7C3AED", bakery: "#A16207",
      western: "#0891B2", "etc-food": "#6B7280", goods: "#10B981",
      auto: "#1F2937", fitness: "#EC4899", "real-estate": "#3B82F6", lodging: "#059669",
    };

    const bounds = L.latLngBounds([]);

    stores.forEach((store) => {
      const info = CATEGORY_INFO[store.category];
      const color = CAT_COLOR[store.category] || "#11306E";

      // 커스텀 핀
      const icon = L.divIcon({
        className: "custom-pin",
        html: `
          <div style="
            background: ${color};
            width: 32px; height: 32px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid white;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          ">
            <span style="transform: rotate(45deg); font-size: 14px;">${info.emoji}</span>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      });

      const marker = L.marker([store.lat, store.lng], { icon }).addTo(map);

      const popupContent = `
        <div style="font-family: Pretendard, system-ui, sans-serif; min-width: 200px;">
          <div style="font-size: 14px; font-weight: 600; color: #11306E; margin-bottom: 4px;">
            ${store.name.ko}
          </div>
          <div style="font-size: 11px; color: #888; margin-bottom: 6px;">
            ${info.emoji} ${info.ko} · ${store.industry}
          </div>
          <div style="font-size: 12px; color: #E6007E; font-weight: 500; margin-bottom: 6px;">
            ${store.benefit.ko.length > 50 ? store.benefit.ko.substring(0, 50) + "..." : store.benefit.ko}
          </div>
          <div style="font-size: 11px; color: #888;">
            📍 ${store.address.ko}
          </div>
        </div>
      `;
      marker.bindPopup(popupContent);

      marker.on("click", () => {
        onMarkerClick?.(store.id);
      });

      markersRef.current.push({ id: store.id, marker });
      bounds.extend([store.lat, store.lng]);
    });

    // 모든 마커가 보이게
    if (stores.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapLoaded, stores]);

  // 선택된 마커로 이동
  useEffect(() => {
    if (!selectedStoreId || !mapInstance.current) return;
    const target = markersRef.current.find((m) => m.id === selectedStoreId);
    if (target) {
      const latlng = target.marker.getLatLng();
      mapInstance.current.setView([latlng.lat, latlng.lng], 16, { animate: true });
      target.marker.openPopup();
    }
  }, [selectedStoreId]);

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`} style={{ minHeight: "300px" }}>
        <div className="text-center p-6">
          <div className="text-3xl mb-2">⚠️</div>
          <p className="text-sm text-gray-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div ref={mapRef} className="w-full h-full rounded-lg overflow-hidden" style={{ background: "#f0f0f0" }} />
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-500">지도 로딩 중...</div>
        </div>
      )}
    </div>
  );
}
