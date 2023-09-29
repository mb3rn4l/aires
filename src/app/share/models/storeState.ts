import { DataUserForms } from "./dataUserForm";
import { Minute } from "./minuteData";

export interface State {
	user?: DataUserForms;
	minutes?: Minute[];
	[key: string]: any;
}