import React, { useState, useEffect } from 'react';
import { useGeolocation } from '../../hooks/useGeolocation';

const RealTimeClock: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const { data: locationData, loading, error, fetchLocation } = useGeolocation();

  useEffect(() => {
    const timerId = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  useEffect(() => {
    fetchLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  const formatLocation = () => {
    if (loading) return 'Đang tải vị trí...';
    if (error) return 'Không thể lấy vị trí';
    if (locationData) {
      return `Lat: ${locationData.latitude.toFixed(4)}, Lon: ${locationData.longitude.toFixed(4)}`;
    }
    return 'Vị trí không có sẵn';
  };

  return (
    <div className="text-sm text-right text-gray-600">
      <div>{time.toLocaleTimeString('vi-VN')} - {time.toLocaleDateString('vi-VN')}</div>
      <div className="text-xs">{formatLocation()}</div>
    </div>
  );
};

export default RealTimeClock;
