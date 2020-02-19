
import {format} from 'date-fns';


export const mergeDateAndTime = (dateISO: string, timeISO: string) => {
    const date = new Date(dateISO), time = new Date(timeISO);

    date.setTime(time.getTime());
    date.setSeconds(0);
    date.setMilliseconds(0);

    return date;
}


export const toReadableTime = (date: Date) => typeof date == 'object' ? format(date, 'h:mma') : date;

type DateFormats = 'name-short' | 'name-full' | 'digits-slash' | 'digits-dot';

export const toReadableDate = (date: Date, into: DateFormats, extras = { includeTime: false }) => {
    if (typeof date !== 'object') return date;
    ``
    const formatString = `${
        into == 'name-full' ? "EEEE, do MMM yyyy" :
            into == 'name-short' ? "E, do MMM yy" :
                into == 'digits-slash' ? "dd/MM/yy" :
                    into == 'digits-dot' ? "dd.MM.yy" :
                        "EEEE, do MMM yyyy"
        }${extras.includeTime ? "' at 'h:mma" : ""}`;

    return format(date, formatString);
}