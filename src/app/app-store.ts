import { Observable, BehaviorSubject } from 'rxjs';

import { pluck, distinctUntilChanged } from 'rxjs/operators';

import { State } from './share/models/storeState';

const state: State = {
  user: undefined,
  minutes: [],
};

export class ReactiveStore {
  private subject = new BehaviorSubject<State>(state);
  private store = this.subject.asObservable().pipe(distinctUntilChanged());

  get value() {
    return this.subject.value;
  }

  select<T>(name: string): Observable<T> {
    return this.store.pipe(pluck(name));
  }

  set(name: string, state: any) {
    this.subject.next({ ...this.value, [name]: state });
  }
}
