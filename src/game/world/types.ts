import type { Interactable } from '../systems/interaction/InteractionSystem';

export interface Rect { x: number; y: number; width: number; height: number; }
export interface RoadDefinition { id: string; bounds: Rect; direction: 'horizontal' | 'vertical'; lanes: number; }
export interface BuildingDefinition { id: string; x: number; y: number; width: number; height: number; label?: string; }
export interface PropDefinition { id: string; kind: 'tree' | 'bench' | 'bin' | 'lamp' | 'parked-car' | 'sign'; x: number; y: number; }
export interface DistrictDefinition { id: string; name: string; width: number; height: number; spawn: { x: number; y: number }; roads: RoadDefinition[]; buildings: BuildingDefinition[]; props: PropDefinition[]; interactables: Interactable[]; }
