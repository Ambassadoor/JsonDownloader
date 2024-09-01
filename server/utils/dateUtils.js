import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import moment from "moment-timezone";

dayjs.extend(utc);

export const formatUntilDate = (untilDate) => {
  return dayjs(untilDate, "YYYYMMDDTHHmmssZ").format("YYYY-MM-DDTHH:mm:ss[Z]");
};

export const getTimezones = () => {
  return moment.tz.names();
};
