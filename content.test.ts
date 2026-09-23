import { describe,it,expect } from 'vitest';
import { deriveDay, initialCheckin } from './content';
describe('client-only wellness demo',()=>{
 it('starts at the requested illustrative score of 82',()=>expect(deriveDay(initialCheckin).score).toBe(82));
 it('prioritizes recovery after low sleep even with high energy',()=>expect(deriveDay({...initialCheckin,hours:4,energy:5}).recovery).toBe(true));
 it('switches a low-energy day to a gentler movement plan',()=>expect(deriveDay({...initialCheckin,energy:1}).workout).toContain('mobility'));
 it('uses hydration logs to update the reminder',()=>expect(deriveDay({...initialCheckin,water:0}).hydration).not.toBe(deriveDay({...initialCheckin,water:2}).hydration));
 it('keeps extreme demo scores within the displayed scale',()=>{expect(deriveDay({hours:0,quality:1,energy:1,mood:1,stress:5,water:0,soreness:5}).score).toBeGreaterThanOrEqual(0);expect(deriveDay({hours:12,quality:5,energy:5,mood:5,stress:1,water:4,soreness:1}).score).toBeLessThanOrEqual(100);});
});
