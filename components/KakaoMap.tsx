"use client";

import { useEffect, useRef, useState } from "react";
import { CATEGORY_INFO, type Store } from "@/data/stores";

declare global {
  interface Window {
    kakao: any;
  }
}

interface KakaoMapProps {
  stores: Store[];
  selectedStoreId?: number | null;
  onMarkerClick?: (id: number) => void;
  className?: string;
}

export default function KakaoMap({
  stores,
  selectedStoreId,
  onMarkerClick,
  className = "",
}: KakaoMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersRef = useRef<{ id: number; marker: any; infoWindow: any }[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // SDK 로드 (services 라이브러리 없이 — 도메인 검증 회피 시도)
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.kakao && window.kakao.maps) {
      setMapLoaded(true);
      return;
    }

    const KEY = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;
    if (!KEY) {
      setError("카카오 JavaScript 키가 설정되지 않았습니다");
      return;
    }

    const script = document.createElement("script");
    // https 명시 + libraries 제거 (좌표 직접 사용)
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KEY}&autoload=false&libraries=services`;
    script.async = true;
    script.onload = () => {
      if (!window.kakao || !window.kakao.maps) {
        setError("카카오맵 SDK 초기화 실패");
        return;
      }
      window.kakao.maps.load(() => setMapLoaded(true));
    };
    script.onerror = () => setError("카카오맵 SDK 다운로드 실패");
    document.head.appendChild(script);
  }, []);

  // 지도 초기화
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || mapInstance.current) return;

    const center = new window.kakao.maps.LatLng(37.7807, 127.0444);
    const map = new window.kakao.maps.Map(mapRef.current, {
      center,
      level: 7,
    });
    mapInstance.current = map;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapLoaded]);

  // 마커 갱신 (stores 변경 시)
  useEffect(() => {
    if (!mapLoaded || !mapInstance.current) return;
    const map = mapInstance.current;

    // 기존 마커 제거
    markersRef.current.forEach(({ marker, infoWindow }) => {
      marker.setMap(null);
      infoWindow.close();
    });
    markersRef.current = [];

    if (stores.length === 0) return;

    const bounds = new window.kakao.maps.LatLngBounds();
    let openInfoWindow: any = null;
    const geocoder = new window.kakao.maps.services.Geocoder();
    let processed = 0;

    const addMarker = (store: Store, lat: number, lng: number) => {
      const position = new window.kakao.maps.LatLng(lat, lng);
      const marker = new window.kakao.maps.Marker({
        map,
        position,
        title: store.name.ko,
      });

      const info = CATEGORY_INFO[store.category];
      const infoWindow = new window.kakao.maps.InfoWindow({
        content: `
          <div style="padding:10px 14px; min-width:200px; font-family:Pretendard,system-ui,sans-serif;">
            <div style="font-size:13px; font-weight:600; color:#11306E; margin-bottom:4px;">
              ${store.name.ko}
            </div>
            <div style="font-size:11px; color:#888; margin-bottom:6px;">
              ${info.emoji} ${info.ko} · ${store.industry}
            </div>
            <div style="font-size:11px; color:#E6007E; font-weight:500;">
              ${store.benefit.ko.length > 40 ? store.benefit.ko.substring(0, 40) + "..." : store.benefit.ko}
            </div>
          </div>
        `,
        removable: true,
      });

      markersRef.current.push({ id: store.id, marker, infoWindow });
      bounds.extend(position);

      window.kakao.maps.event.addListener(marker, "click", () => {
        if (openInfoWindow) openInfoWindow.close();
        infoWindow.open(map, marker);
        openInfoWindow = infoWindow;
        onMarkerClick?.(store.id);
      });
    };

    stores.forEach((store) => {
      // 카카오 Geocoder로 정확한 좌표 검색 (실패 시 추정 좌표 사용)
      geocoder.addressSearch(store.address.ko, (result: any[], status: string) => {
        let lat = store.lat;
        let lng = store.lng;
        if (status === window.kakao.maps.services.Status.OK && result[0]) {
          lat = parseFloat(result[0].y);
          lng = parseFloat(result[0].x);
        }
        addMarker(store, lat, lng);
        processed++;
        if (processed === stores.length && stores.length > 0) {
          map.setBounds(bounds);
        }
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapLoaded, stores]);

  // 선택된 마커로 이동 + 인포윈도우 열기
  useEffect(() => {
    if (!selectedStoreId || !mapInstance.current) return;
    const target = markersRef.current.find((m) => m.id === selectedStoreId);
    if (target) {
      const position = target.marker.getPosition();
      mapInstance.current.setCenter(position);
      mapInstance.current.setLevel(3);
      target.infoWindow.open(mapInstance.current, target.marker);
    }
  }, [selectedStoreId]);

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`} style={{ minHeight: "300px" }}>
        <div className="text-center p-6">
          <div className="text-3xl mb-2">⚠️</div>
          <p className="text-sm text-gray-700 mb-2">{error}</p>
          <p className="text-xs text-gray-500">카카오 개발자 사이트의 도메인 등록을 확인하세요</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div ref={mapRef} className="w-full h-full rounded-lg overflow-hidden" />
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-500">지도 로딩 중...</div>
        </div>
      )}
    </div>
  );
}
