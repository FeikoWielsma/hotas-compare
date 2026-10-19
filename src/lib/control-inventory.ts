import type { Component, ControlItem } from './schema';

export type ControlSection = Pick<Component, 'name' | 'category' | 'controls' | 'controls_evidence'>;
export const controlTypes: { type: ControlItem['type']; label: string; icon: string }[] = [
  { type: 'hat', label: 'Hat switches', icon: '✥' },
  { type: 'analog_ministick', label: 'Analog ministicks', icon: '⊕' },
  { type: 'button', label: 'Push buttons', icon: '●' },
  { type: 'trigger', label: 'Triggers', icon: '⌁' },
  { type: 'lever', label: 'Levers', icon: '╱' },
  { type: 'slider', label: 'Sliders', icon: '↔' },
  { type: 'encoder', label: 'Rotary encoders', icon: '⟳' },
  { type: 'scroll_wheel', label: 'Scroll wheels', icon: '↕' },
  { type: 'rotary', label: 'Rotaries / selectors', icon: '◉' },
  { type: 'toggle', label: 'Toggle switches', icon: '⌥' },
  { type: 'rocker', label: 'Rocker switches', icon: '⇄' },
  { type: 'detent', label: 'Detents', icon: '⋮' },
  { type: 'switch', label: 'Other switches', icon: '◇' },
  { type: 'axis', label: 'Pedal & other axes', icon: '↗' },
];
export const yesNo = (value: boolean | undefined) => value === undefined ? 'Unknown' : value ? 'Yes' : 'No';
export const controlCount = (control: ControlItem) => control.count ?? 1;

/** Only infer location for a physically separate grip or base. Integrated devices need explicit evidence. */
export function controlLocation(control: ControlItem, section: ControlSection): string {
  return control.location ?? (section.category === 'grip' ? 'grip' : section.category === 'base' ? 'base' : 'unknown');
}

export function controlFacts(control: ControlItem): { label: string; value: string }[] {
  switch (control.type) {
    case 'hat': return [{ label: 'Directions', value: control.ways ? `${control.ways}-way` : 'Unknown' }, { label: 'Pressable', value: yesNo(control.push) }];
    case 'analog_ministick': return [{ label: 'Input', value: '2 analog axes' }, { label: 'Pressable', value: yesNo(control.push) }];
    case 'encoder': case 'scroll_wheel': return [{ label: 'Input', value: 'Digital · bidirectional' }, { label: 'Pressable', value: yesNo(control.push) }, ...(control.push_stages ? [{ label: 'Push stages', value: String(control.push_stages) }] : [])];
    case 'button': return [{ label: 'Input', value: 'Momentary push' }, { label: 'Backlit', value: yesNo(control.backlit) }];
    case 'trigger': return [{ label: control.action === 'bidirectional' || control.action === 'flip' ? 'Inputs per trigger' : 'Stages per trigger', value: control.stages ? String(control.stages) : 'Unknown' }, { label: 'Action', value: control.action ?? (control.flip ? 'flip' : 'Unknown') }];
    case 'lever': return [{ label: 'Function', value: control.kind.replaceAll('_', ' ') }, { label: 'Input', value: control.analog === true ? 'Analog axis' : control.analog === false ? 'Digital' : 'Unknown' }, { label: 'Extra button', value: yesNo(control.push) }, ...(control.positions ? [{ label: 'Positions', value: String(control.positions) }] : []), ...(control.momentary !== undefined ? [{ label: 'Momentary', value: yesNo(control.momentary) }] : [])];
    case 'slider': return [{ label: 'Input', value: control.analog === false ? 'Digital switch' : control.analog === true ? 'Analog axis' : 'Unknown' }, { label: 'Positions', value: control.positions ? String(control.positions) : 'Unknown' }, { label: 'Center detent', value: yesNo(control.center_detent) }];
    case 'rotary': return [{ label: 'Input', value: control.mode === 'analog' ? 'Analog axis' : control.mode === 'selector' ? 'Discrete selector' : 'Unknown' }, { label: 'Positions', value: control.positions ? String(control.positions) : 'Unknown' }, { label: 'Pressable', value: yesNo(control.push) }];
    case 'toggle': return [{ label: 'Positions', value: control.ways ? String(control.ways) : 'Unknown' }, { label: 'Momentary', value: yesNo(control.momentary) }, { label: 'Pressable', value: yesNo(control.push) }];
    case 'rocker': return [{ label: 'Input', value: control.analog === true ? 'Analog axis' : control.analog === false ? '2 digital directions' : 'Unknown' }, { label: 'Pressable', value: yesNo(control.push) }];
    case 'detent': return [{ label: 'Customizable', value: yesNo(control.customizable) }];
    case 'switch': return [{ label: 'Mechanism', value: 'Unknown' }, { label: 'Positions', value: control.positions ? String(control.positions) : 'Unknown' }, { label: 'Pressable', value: yesNo(control.push) }, { label: 'Momentary', value: yesNo(control.momentary) }];
    case 'axis': return [{ label: 'Function', value: control.kind.replaceAll('_', ' ') }, { label: 'Input', value: 'Analog axis' }];
  }
}

export function inventoryComplete(sections: ControlSection[]) {
  return sections.length > 0 && sections.every(s => s.controls_evidence?.coverage === 'complete');
}

export function inventoryCount(sections: ControlSection[], type: ControlItem['type'], location?: string) {
  const count = sections.reduce((sum, s) => sum + s.controls.filter(c => c.type === type && (!location || controlLocation(c, s) === location)).reduce((n, c) => n + controlCount(c), 0), 0);
  if (location && sections.some(s => s.controls.some(c => c.type === type && controlLocation(c, s) === 'unknown'))) return count ? `${count} recorded · others unlocated` : 'Unknown';
  return count ? `${count}${inventoryComplete(sections) ? '' : ' recorded'}` : inventoryComplete(sections) ? '0' : 'Not documented';
}

export function inventoryDetail(sections: ControlSection[], type: ControlItem['type']) {
  const lines = sections.flatMap(s => s.controls.filter(c => c.type === type).map(c => `${controlCount(c)} × ${c.label ?? controlTypes.find(t => t.type === type)!.label} · ${controlLocation(c, s)} · ${controlFacts(c).map(f => `${f.label}: ${f.value}`).join(' · ')}`));
  return lines.join('\n') || (inventoryComplete(sections) ? 'None' : 'Not documented');
}
