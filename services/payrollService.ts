
import { Attendance, Employee, EmployeeType, PayrollData, Shift, ShiftCode } from "../types";
import { LATE_PENALTY_AMOUNT, OT_LIMITS, SHIFT_DEFINITIONS } from "../constants";
import { calculateHours, getWeekRange } from "../utils/date";

export const calculatePayroll = (
    employees: Employee[],
    allAttendance: Attendance[],
    startDate: Date,
    endDate: Date
): PayrollData[] => {

    const payrollResults: PayrollData[] = [];

    for (const employee of employees) {
        const employeeAttendance = allAttendance.filter(a =>
            a.employeeId === employee.id &&
            new Date(a.date) >= startDate &&
            new Date(a.date) <= endDate
        );

        let totalHours = 0;
        let totalOT = 0;
        let lateCount = 0;

        for (const record of employeeAttendance) {
            const workedHours = calculateHours(record.checkIn, record.checkOut);
            const shift = SHIFT_DEFINITIONS[record.shiftCode];

            if (workedHours > shift.hours) {
                totalHours += shift.hours;
                
                // Calculate potential OT
                const potentialOT = workedHours - shift.hours;
                
                // Check weekly OT limit
                const weekRange = getWeekRange(new Date(record.date));
                const weeklyAttendance = allAttendance.filter(att => 
                    att.employeeId === employee.id &&
                    new Date(att.date) >= weekRange.start &&
                    new Date(att.date) <= weekRange.end
                );
                const currentWeekOT = weeklyAttendance.reduce((sum, att) => sum + (att.approvedOTHours || 0), 0);

                const otLimit = OT_LIMITS[employee.type];
                const approvedOT = Math.min(potentialOT, Math.max(0, otLimit - currentWeekOT));
                record.approvedOTHours = approvedOT; // This should be done via an admin action, but for calculation we assume it here
                totalOT += record.approvedOTHours;
            } else {
                totalHours += workedHours;
            }
            if (record.isLate) lateCount++;
        }
        
        // Calculate weekly late penalties
        const weeks: { [key: string]: number } = {};
        employeeAttendance.forEach(record => {
             if (record.isLate) {
                const weekStart = getWeekRange(new Date(record.date)).start.toISOString().split('T')[0];
                weeks[weekStart] = (weeks[weekStart] || 0) + 1;
             }
        });
        
        let penalty = 0;
        Object.values(weeks).forEach(weeklyLateCount => {
            if (weeklyLateCount > 1) {
                penalty += LATE_PENALTY_AMOUNT;
            }
        });

        const basePay = totalHours * employee.baseSalary;
        const otPay = totalOT * employee.baseSalary;
        const totalPay = basePay + otPay - penalty;

        payrollResults.push({
            employeeId: employee.id,
            employeeName: employee.name,
            employeeType: employee.type,
            totalHours: parseFloat(totalHours.toFixed(2)),
            totalOT: parseFloat(totalOT.toFixed(2)),
            lateCount,
            penalty,
            basePay: Math.round(basePay),
            otPay: Math.round(otPay),
            totalPay: Math.round(totalPay),
        });
    }

    return payrollResults;
}
