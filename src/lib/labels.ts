/** Display labels for stored enum-like values. Free-text values pass through unchanged. */
const known: Record<string, string> = {
  contactless_magnetic: 'Contactless magnetic', contactless: 'Contactless', hall: 'Hall effect', hall_effect: 'Hall effect',
  potentiometer: 'Potentiometer', magnetic_encoder: 'Magnetic encoder', optical_encoder: 'Optical encoder',
  force_feedback: 'Force feedback', built_in_xy: 'Built-in X/Y', cam: 'Cam', ball_joint: 'Ball joint',
  cam_and_spring: 'Cam and spring', pendular: 'Pendular', gimbal_ring: 'Gimbal ring', dual_cam: 'Dual cam',
  pincer: 'Pincer', cord_drive: 'Cord drive', modular_cam_gimbal: 'Modular cam gimbal', dual_spring: 'Dual spring',
  friction: 'Friction', dry_clutch: 'Dry clutch', active_motor: 'Active motor', optional_damper: 'Optional damper',
  integrated_clutches: 'Integrated clutches', adjustable_dry_clutch: 'Adjustable dry clutch', friction_pad: 'Friction pad',
  c: 'USB-C', a_cable: 'USB-A cable', b: 'USB-B',
  abs: 'ABS', pc: 'Polycarbonate', glass_fiber_pa: 'Glass-fibre polyamide', steel_plate: 'Steel plate',
  modern_jet: 'Modern jet', space_hosas: 'Space HOSAS', space_hotas: 'Space HOTAS', heli: 'Helicopter',
  ga: 'General aviation', airliner: 'Airliner', ww2: 'WWII',
  throttle_single: 'Single throttle', throttle_dual: 'Dual throttle', toe_brake: 'Toe brake',
  base: 'Base', grip: 'Grip', handle: 'Handle', panel: 'Panel', other: 'Other',
};

export function humanize(value: string | null | undefined): string {
  if (value == null || value === '') return '';
  const mapped = known[value] ?? known[value.toLowerCase()];
  if (mapped) return mapped;
  if (!/^[A-Za-z0-9_]+$/.test(value) || (!value.includes('_') && /[A-Z]/.test(value))) return value;
  const text = value.replaceAll('_', ' ');
  return text[0].toUpperCase() + text.slice(1);
}

export const statusLabels = { current: 'Available', discontinued: 'Discontinued', announced: 'Announced' } as const;
export const placementLabels = { desk: 'Desk only', mount_only: 'Mount required', both: 'Desk or mount' } as const;

export function yesNoUnknown(value: boolean | null | undefined) {
  return value == null ? null : value ? 'Yes' : 'No';
}
