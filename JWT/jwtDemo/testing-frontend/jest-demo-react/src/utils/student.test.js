
import { isEligible } from './student.js';

describe("Attendance Eligibility Testing", () => {

    test('Check whether attendance is invalid', () => {
        expect(() => isEligible(-10))
            .toThrow("Invalid attendence value");
    });

    test('Less than 75', () => {
        expect(isEligible(10)).toBe(false);
    });

    test('Eligible since greater than 75', () => {
        expect(isEligible(80)).toBe(true);
    });

});
