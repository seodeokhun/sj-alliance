"use client";

import { useEffect, useRef, useState } from "react";
import { type CareCenter, BRANCH_META } from "@/data/care-centers";

declare global {
  interface Window {
    kakao: any;
  }
}

const GEOCODE_CACHE_KEY = "sj-care-geocode-cache-v1";

type GeocodeCache = Record<string, { lat: number; lng: number }>;

function loadCache(): GeocodeCache {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(GEOCODE_CACHE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
function saveCache(cache: GeocodeCache) {
  try {
    localStorage.setItem(GEOCODE_CACHE_KEY, JSON.stringify(cache));
  } catch {}
}

interface CareKakaoMapProps {
  centers: CareCenter[];
  className?: string;
  onMarkerClick?: (centerId: number) => void;
}

export default function CareKakaoMap({
  centers,
  className = "",
  onMarkerClick,
}: CareKakaoMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const openInfoRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState({ done: 0, total: 0 });

  /* ---------- SDK 로드 ---------- */
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.kakao && window.kakao.maps) {
      setMapLoaded(true);
      return;
    }
    const KEY = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;
    if (!KEY) {
      setError("카카오 JavaScript 키가 설정되지 않았습니다.");
      return;
    }
    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KEY}&autoload=false&libraries=services`;
    script.async = true;
    script.onload = () => {
      if (!window.kakao?.maps) {
        setError("카카오맵 SDK 초기화 실패");
        return;
      }
      window.kakao.maps.load(() => setMapLoaded(true));
    };
    script.onerror = () => setError("카카오맵 SDK 다운로드 실패");
    document.head.appendChild(script);
  }, []);

  /* ---------- 지도 초기화 ---------- */
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || mapInstance.current) return;
    const center = new window.kakao.maps.LatLng(37.5, 127.5); // 한반도 중앙쯤
    mapInstance.current = new window.kakao.maps.Map(mapRef.current, {
      center,
      level: 12, // 한반도 전체 보일 정도
    });
    // 줌 컨트롤 추가
    const zoomCtrl = new window.kakao.maps.ZoomControl();
    mapInstance.current.addControl(zoomCtrl, window.kakao.maps.ControlPosition.RIGHT);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapLoaded]);

  /* ---------- 마커 생성 ---------- */
  useEffect(() => {
    if (!mapLoaded || !mapInstance.current) return;
    const map = mapInstance.current;

    // 기존 마커 제거
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];
    if (openInfoRef.current) openInfoRef.current.close();

    if (centers.length === 0) return;

    const cache = loadCache();
    const geocoder = new window.kakao.maps.services.Geocoder();
    const bounds = new window.kakao.maps.LatLngBounds();
    let processed = 0;
    let added = 0;

    setProgress({ done: 0, total: centers.length });

    const addMarker = (c: CareCenter, lat: number, lng: number) => {
      const meta = BRANCH_META[c.branch];
      const position = new window.kakao.maps.LatLng(lat, lng);
      const marker = new window.kakao.maps.Marker({
        map,
        position,
        title: c.name,
      });

      const phoneHtml = c.officePhone
        ? `<div style="font-size:11px; color:#555; margin-top:2px;">☎ ${c.officePhone}</div>`
        : "";
      const addrHtml = c.address
        ? `<div style="font-size:11px; color:#777; margin-top:4px; line-height:1.4;">📍 ${c.address}</div>`
        : "";

      const infoWindow = new window.kakao.maps.InfoWindow({
        content: `
          <div style="padding:10px 12px; min-width:220px; max-width:280px; font-family:system-ui, sans-serif;">
            <div style="display:inline-block; font-size:10px; padding:1px 6px; border-radius:3px; font-weight:600; color:${meta.color}; background:${meta.bg}; margin-bottom:4px;">
              ${meta.label}
            </div>
            <div style="font-size:13px; font-weight:700; color:#11306E; margin-bottom:2px;">
              ${c.name}
            </div>
            ${phoneHtml}
            ${addrHtml}
            <a href="/care/${c.id}" style="display:block; margin-top:6px; padding:5px 8px; background:#0E7490; color:white; font-size:11px; text-align:center; border-radius:4px; text-decoration:none;">
              상세 보기 →
            </a>
          </div>
        `,
        removable: true,
      });

      window.kakao.maps.event.addListener(marker, "click", () => {
        if (openInfoRef.current) openInfoRef.current.close();
        infoWindow.open(map, marker);
        openInfoRef.current = infoWindow;
        onMarkerClick?.(c.id);
      });

      bounds.extend(position);
      markersRef.current.push(marker);
      added++;
    };

    const done = () => {
      processed++;
      setProgress({ done: processed, total: centers.length });
      if (processed === centers.length) {
        // 모든 변환 완료 후 캐시 저장 + 지도 영역 조정
        saveCache(cache);
        if (added > 0 && !bounds.isEmpty()) {
          map.setBounds(bounds);
        }
      }
    };

    centers.forEach((c) => {
      if (!c.address) {
        done();
        return;
      }
      const key = c.address.trim();
      if (cache[key]) {
        addMarker(c, cache[key].lat, cache[key].lng);
        done();
        return;
      }
      // 카카오 지오코딩 호출
      geocoder.addressSearch(key, (result: any[], status: any) => {
        if (status === window.kakao.maps.services.Status.OK && result[0]) {
          const lat = parseFloat(result[0].y);
          const lng = parseFloat(result[0].x);
          cache[key] = { lat, lng };
          addMarker(c, lat, lng);
        }
        done();
      });
    });

    return () => {
      markersRef.current.forEach((m) => m.setMap(null));
      markersRef.current = [];
      if (openInfoRef.current) openInfoRef.current.close();
    };
  }, [mapLoaded, centers, onMarkerClick]);

  return (
    <div className={`relative ${className}`}>
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-sm text-red-600 z-10">
          {error}
        </div>
      )}
      {!error && progress.total > 0 && progress.done < progress.total && (
        <div className="absolute top-2 left-2 z-10 px-3 py-1.5 rounded-md bg-white/95 shadow text-[11px] font-semibold text-gray-700 border border-gray-200">
          📍 위치 변환 중... {progress.done}/{progress.total}
        </div>
      )}
      <div
        ref={mapRef}
        className="w-full h-full bg-gray-100"
        style={{ minHeight: "400px" }}
      />
    </div>
  );
}
