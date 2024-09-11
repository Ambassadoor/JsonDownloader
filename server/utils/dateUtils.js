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

export const extractMeetingDays = (meetingDays) => {
  const replacePattern = /[\s\/]+/g;
  const splitPattern = /(?=[A-Z])/;

  const trimmed = meetingDays.trim();
  const cleaned = trimmed.replace(replacePattern, "");
  const split = cleaned.split(splitPattern);
  const allCaps = split.map((day) => day.toUpperCase());
  const days = [...new Set(allCaps)];

  return days;
};
