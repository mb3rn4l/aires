import { FirestoreUser } from './firestoreUser';
import { Minute } from './minuteData';

export interface State {
  user?: FirestoreUser;
  minutes: Minute[];
  [key: string]: any;
}
