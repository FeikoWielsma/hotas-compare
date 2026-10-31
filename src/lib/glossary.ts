import type { GimbalType } from './schema';

/** Short, opinionated explainers for terms newcomers hit first. Keep each under ~40 words. */
export const glossary = {
  gimbal: { term: 'Gimbal', text: 'The mechanism the stick pivots on. It decides how smooth, precise and durable a stick feels, and it is usually the first part to wear out. Gimbal quality matters more than button count.' },
  ball_and_cup: { term: 'Ball-and-cup gimbal', text: 'A plastic ball in a socket with one central spring. Cheap, with a noticeable centre bump, stiff centering and friction; the norm on budget sticks.' },
  pincer: { term: 'Pincer gimbal', text: 'Each axis has its own spring, so resistance builds evenly. Smoother, more durable and easier to tune than ball-and-cup; the sweet spot for value.' },
  cam_and_spring: { term: 'Cam-and-spring gimbal', text: 'Springs press on swappable cams, usually in a metal base with bearings. Very smooth and precise, with tunable feel; what most high-end bases use.' },
  force_feedback: { term: 'Force feedback', text: 'Motors push back on the stick to simulate trim, stalls and turbulence. Expensive, and game support and smoothness vary between bases.' },
  other_gimbal: { term: 'Other gimbal', text: 'A hybrid or unusual design that does not fit the main families; see the product notes.' },
  hall: { term: 'Contactless (Hall / magnetic) sensors', text: 'Read the stick position with magnets instead of a wiper on a track, so no contact track wears out. Potentiometers are cheaper but develop jitter over time.' },
  hosas: { term: 'HOSAS', text: 'Hands On Stick And Stick: two joysticks instead of stick and throttle. Popular for space sims, where you need six degrees of freedom.' },
  omni: { term: 'Omni-throttle', text: 'A joystick mounted on an angled adapter and used as a throttle, often with one axis locked. Flexible for space sims, but without detents or twin engines.' },
  detent: { term: 'Detent', text: 'A physical notch in the throttle travel, for example idle cut-off or afterburner, so you can feel where you are without looking.' },
  twist: { term: 'Twist axis', text: 'Rotating the grip to steer the rudder. Handy without pedals, but often the first axis to break on cheap sticks. Sticks without twist need rudder pedals.' },
  pedals: { term: 'Rudder pedals', text: 'Foot control for rudder and toe brakes. Essential for helicopters and WWII planes, and the only rudder option for sticks without a twist axis.' },
  mount_only: { term: 'Mount required', text: 'Designed to bolt to a desk mount, cockpit rig or compatible base rather than sit loose on a desktop.' },
} as const;

export type GlossaryKey = keyof typeof glossary;

export const gimbalLabels: Record<GimbalType, string> = {
  ball_and_cup: 'Ball-and-cup', pincer: 'Pincer', cam_and_spring: 'Cam & spring', force_feedback: 'Force feedback', other: 'Other gimbal',
};

export const gimbalGlossaryKey: Record<GimbalType, GlossaryKey> = {
  ball_and_cup: 'ball_and_cup', pincer: 'pincer', cam_and_spring: 'cam_and_spring', force_feedback: 'force_feedback', other: 'other_gimbal',
};

/** Budget-to-premium order, used for filter pills. */
export const gimbalOrder: GimbalType[] = ['ball_and_cup', 'pincer', 'cam_and_spring', 'force_feedback', 'other'];
