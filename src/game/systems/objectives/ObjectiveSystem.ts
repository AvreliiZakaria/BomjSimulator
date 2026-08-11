export type ObjectiveId = 'find-food' | 'find-shelter' | 'complete';
export interface ObjectiveState { current: ObjectiveId; completed: ObjectiveId[]; }
export class ObjectiveSystem {
  private state: ObjectiveState;
  public constructor(state: ObjectiveState = { current: 'find-food', completed: [] }) { this.state = { current: state.current, completed: [...state.completed] }; }
  public get(): ObjectiveState { return { current: this.state.current, completed: [...this.state.completed] }; }
  public complete(id: ObjectiveId): ObjectiveState { if (this.state.current !== id || this.state.completed.includes(id)) return this.get(); this.state.completed.push(id); this.state.current = id === 'find-food' ? 'find-shelter' : 'complete'; return this.get(); }
}
