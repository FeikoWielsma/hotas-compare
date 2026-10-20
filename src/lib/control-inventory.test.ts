import { describe, expect, it } from 'vitest';
import { ComponentSchema, ControlItemSchema } from './schema';
import { controlFacts, inventoryCount, inventoryDetail } from './control-inventory';
import type { ControlSection } from './control-inventory';
import { deriveControlsSummary } from './derive';

const section = (overrides: Partial<ControlSection> = {}): ControlSection => ({ name: 'Test', category: 'grip', controls: [], ...overrides });

describe('physical control evidence', () => {
  it('does not assume standalone USB support when a product omits connectivity evidence', () => {
    const component = ComponentSchema.parse({ brand: 'test', name: 'Unknown USB', category: 'grip' });
    expect(component.connectivity.standalone_usb).toBeNull();
  });
  it('keeps lever travel contacts out of the standalone physical button count', () => {
    const lever = ControlItemSchema.parse({ type: 'lever', kind: 'other', analog: true, count: 2, button_contacts: 2 });
    expect(deriveControlsSummary([lever])).toMatchObject({ physicalButtons: 0, totalLogicalButtons: 4, estimatedAxesCount: 2 });
    expect(controlFacts(lever)).toContainEqual({ label: 'Travel contacts per lever', value: '2' });
    expect(inventoryCount([section({ controls: [lever], controls_evidence: { coverage: 'complete', source: 'https://example.com/manual', checked: '2026-10-20' } })], 'button')).toBe('0');
  });
  it('describes documented analog movement as continuous rather than missing discrete positions', () => {
    for (const control of [ControlItemSchema.parse({ type: 'rotary', mode: 'analog' }), ControlItemSchema.parse({ type: 'slider', analog: true })]) {
      expect(controlFacts(control)).toContainEqual({ label: 'Positions', value: 'Continuous' });
    }
    expect(controlFacts(ControlItemSchema.parse({ type: 'rotary', mode: 'selector' }))).toContainEqual({ label: 'Positions', value: 'Unknown' });
  });
  it('retains generic switch and pedal counts without inventing switch contacts or extra levers', () => {
    const switches = ControlItemSchema.parse({ type: 'switch', count: 13 });
    const brakes = ControlItemSchema.parse({ type: 'axis', kind: 'toe_brake', count: 2 });
    const rudder = ControlItemSchema.parse({ type: 'axis', kind: 'rudder' });
    expect(inventoryCount([section({ controls: [switches] })], 'switch')).toBe('13 recorded');
    expect(controlFacts(switches)).toContainEqual({ label: 'Mechanism', value: 'Unknown' });
    expect(deriveControlsSummary([switches, brakes, rudder])).toMatchObject({ physicalButtons: 0, totalLogicalButtons: 0, estimatedAxesCount: 3, hasBrakeAxis: true });
    const toggle = ControlItemSchema.parse({ type: 'toggle', count: 2, push: true });
    expect(controlFacts(toggle)).toContainEqual({ label: 'Pressable', value: 'Yes' });
    expect(deriveControlsSummary([toggle]).totalLogicalButtons).toBe(2);
  });

  it('does not invent directions or axis signals for undocumented mechanics', () => {
    const controls = ['hat', 'toggle', 'lever', 'slider', 'rocker', 'rotary'].map(type => ControlItemSchema.parse({ type }));
    expect(controlFacts(controls[0])).toContainEqual({ label: 'Directions', value: 'Unknown' });
    expect(controlFacts(controls[1])).toContainEqual({ label: 'Positions', value: 'Unknown' });
    for (const control of controls.slice(2)) expect(controlFacts(control)).toContainEqual({ label: 'Input', value: 'Unknown' });
    expect(deriveControlsSummary(controls)).toMatchObject({ totalLogicalButtons: 0, estimatedAxesCount: 0 });
  });

  it('preserves unknown pressability instead of defaulting to yes or no', () => {
    for (const type of ['hat', 'analog_ministick', 'encoder', 'scroll_wheel'] as const) {
      const control = ControlItemSchema.parse({ type });
      expect(controlFacts(control)).toContainEqual({ label: 'Pressable', value: 'Unknown' });
      expect(controlFacts(ControlItemSchema.parse({ type, push: false }))).toContainEqual({ label: 'Pressable', value: 'No' });
      expect(controlFacts(ControlItemSchema.parse({ type, push: true }))).toContainEqual({ label: 'Pressable', value: 'Yes' });
    }
  });

  it('distinguishes absent controls from missing research, including mixed bundles', () => {
    const complete = section({ controls_evidence: { coverage: 'complete', source: 'https://example.com/spec', checked: '2026-10-19' } });
    expect(inventoryCount([section()], 'slider')).toBe('Not documented');
    expect(inventoryCount([complete], 'slider')).toBe('0');
    expect(inventoryCount([complete, section()], 'slider')).toBe('Not documented');
    expect(inventoryCount([], 'slider')).toBe('Not documented');
  });

  it('keeps grip and base controls separate and does not guess locations on integrated devices', () => {
    const controls = [ControlItemSchema.parse({ type: 'button', count: 3 })];
    const grip = section({ controls });
    const base = section({ name: 'Base', category: 'base', controls });
    expect(inventoryCount([grip, base], 'button', 'grip')).toBe('3 recorded');
    expect(inventoryCount([grip, base], 'button', 'base')).toBe('3 recorded');
    expect(inventoryCount([section({ category: 'stick_fixed', controls })], 'button', 'base')).toBe('Unknown');
    expect(inventoryDetail([grip], 'button')).toContain('3 × Push buttons · grip');
  });

  it('counts dual-push scroll wheels, brake buttons and repeated triggers without inventing selector axes', () => {
    const controls = [
      ControlItemSchema.parse({ type: 'scroll_wheel', push: true, push_stages: 2 }),
      ControlItemSchema.parse({ type: 'lever', kind: 'brake', analog: true, push: true }),
      ControlItemSchema.parse({ type: 'trigger', stages: 2, count: 2 }),
      ControlItemSchema.parse({ type: 'rotary', mode: 'selector', positions: 4 }),
      ControlItemSchema.parse({ type: 'rocker', analog: true }),
      ControlItemSchema.parse({ type: 'slider', analog: false, positions: 2 }),
    ];
    const summary = deriveControlsSummary(controls);
    expect(summary.totalLogicalButtons).toBe(15);
    expect(summary.estimatedAxesCount).toBe(2);
    expect(summary.encoderCount).toBe(0);
    expect(controlFacts(controls[0])).toContainEqual({ label: 'Push stages', value: '2' });
  });
});
