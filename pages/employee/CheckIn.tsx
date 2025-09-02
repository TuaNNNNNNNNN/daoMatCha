
import React, { useState, useEffect } from 'react';
import { useData } from '../../hooks/useData';
import { useGeolocation } from '../../hooks/useGeolocation';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { calculateDistance } from '../../utils/geo';
import { Attendance } from '../../types';
import { getTodayDateString, isLateCheckIn } from '../../utils/date';
import { SHIFT_DEFINITIONS } from '../../constants';

const CheckIn: React.FC = () => {
    const { auth, schedules, attendance, addOrUpdateAttendance, geoSettings } = useData();
    const { data: locationData, loading, error, fetchLocation } = useGeolocation();
    const [status, setStatus] = useState('');

    const todayString = getTodayDateString();
    const employeeId = auth.user?.id || '';
    const shiftCode = schedules[employeeId]?.[todayString];
    const shift = shiftCode ? SHIFT_DEFINITIONS[shiftCode] : null;

    const todayAttendance = attendance.find(a => a.employeeId === employeeId && a.date === todayString);

    useEffect(() => {
        // Automatically fetch location when component mounts to prepare for check-in
        fetchLocation();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleCheckIn = () => {
        setStatus('Đang kiểm tra vị trí...');
        if (loading) return;
        if (error || !locationData) {
            setStatus(`Lỗi vị trí: ${error?.message}. Vui lòng cho phép truy cập vị trí và thử lại.`);
            return;
        }

        const distance = calculateDistance(
            locationData.latitude,
            locationData.longitude,
            geoSettings.latitude,
            geoSettings.longitude
        );

        if (distance > geoSettings.radius) {
            setStatus(`Bạn đang ở quá xa vị trí chấm công (${Math.round(distance)}m > ${geoSettings.radius}m).`);
            return;
        }
        
        if (shift) {
            const checkInTime = new Date();
            const newAttendance: Attendance = {
                id: `att-${employeeId}-${todayString}`,
                employeeId,
                shiftCode,
                date: todayString,
                checkIn: checkInTime.toISOString(),
                checkOut: null,
                checkInLocation: { latitude: locationData.latitude, longitude: locationData.longitude, accuracy: locationData.accuracy, altitude: locationData.altitude, altitudeAccuracy: locationData.altitudeAccuracy, heading: locationData.heading, speed: locationData.speed },
                checkOutLocation: null,
                approvedOTHours: 0,
                isLate: isLateCheckIn(checkInTime, shift)
            };
            addOrUpdateAttendance(newAttendance);
            setStatus('Check-in thành công!');
        }
    };
    
    const handleCheckOut = () => {
        setStatus('Đang kiểm tra vị trí...');
        if (loading) return;
        if (error || !locationData) {
            setStatus(`Lỗi vị trí: ${error?.message}. Vui lòng cho phép truy cập vị trí và thử lại.`);
            return;
        }
        
        if (todayAttendance) {
            const updatedAttendance: Attendance = {
                ...todayAttendance,
                checkOut: new Date().toISOString(),
                checkOutLocation: { latitude: locationData.latitude, longitude: locationData.longitude, accuracy: locationData.accuracy, altitude: locationData.altitude, altitudeAccuracy: locationData.altitudeAccuracy, heading: locationData.heading, speed: locationData.speed },
            };
            addOrUpdateAttendance(updatedAttendance);
            setStatus('Check-out thành công!');
        }
    };

    const renderStatus = () => {
        if (!shift) {
            return <p className="text-yellow-600">Bạn không có ca làm việc hôm nay.</p>;
        }
        if (todayAttendance?.checkIn && todayAttendance?.checkOut) {
            return <p className="text-green-600">Bạn đã hoàn thành ca làm việc hôm nay.</p>;
        }
        if (todayAttendance?.checkIn) {
            return <p className="text-blue-600">Bạn đã check-in lúc {new Date(todayAttendance.checkIn).toLocaleTimeString('vi-VN')}.</p>;
        }
        return <p className="text-gray-600">Bạn chưa check-in cho ca làm việc hôm nay.</p>;
    }

    return (
        <Card title="Chấm công hôm nay">
            <div className="text-center space-y-4">
                {shift ? (
                    <div>
                        <p className="text-lg">Ca làm việc: <strong>{shift.name}</strong></p>
                        <p className="text-md text-gray-500">Thời gian: {shift.start} - {shift.end}</p>
                    </div>
                ) : (
                    <p className="text-lg text-gray-500">Không có lịch làm hôm nay</p>
                )}

                <div className="p-4 bg-gray-100 rounded-md">
                   {renderStatus()}
                </div>

                {status && <p className="text-sm font-semibold">{status}</p>}

                <div className="flex justify-center gap-4">
                    <Button 
                        onClick={handleCheckIn}
                        disabled={!shift || !!todayAttendance?.checkIn || loading}
                        variant="success"
                        className="w-32"
                    >
                        {loading ? 'Đang tải...' : 'Check-in'}
                    </Button>
                    <Button 
                        onClick={handleCheckOut}
                        disabled={!todayAttendance?.checkIn || !!todayAttendance?.checkOut || loading}
                        variant="danger"
                        className="w-32"
                    >
                       {loading ? 'Đang tải...' : 'Check-out'}
                    </Button>
                </div>
                 {error && <p className="text-red-500 text-xs mt-2">Lỗi: {error.message}. Vui lòng bật định vị.</p>}
            </div>
        </Card>
    );
};

export default CheckIn;
