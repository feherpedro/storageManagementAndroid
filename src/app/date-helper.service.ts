import { DatePipe } from "@angular/common";
import { Injectable } from "@angular/core";

@Injectable()
export class DateHelperService {

    private pattern = "yyyy-MM-dd";

    private datePipe: DatePipe;

    constructor() {
        this.datePipe = new DatePipe("hu");
    }

    convertDateTimeFromServer(date: any) {
        if (date) {

            return new Date(date);
        } else {

            return null;
        }
    }

    convertLocalDateFromServer(date: any) {
        if (date) {
            const dateString = date.split("-");

            return new Date(dateString[0], dateString[1] - 1, dateString[2]);
        }

        return null;
    }

    convertLocalDateToServer(date: any, pattern = this.pattern) {
        if (date) {
            const newDate = new Date(date.year, date.month - 1, date.day);

            return this.datePipe.transform(newDate, pattern);
        } else {

            return null;
        }
    }

    dateformat() {

        return this.pattern;
    }
}
