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
  if (!meetingDays || typeof meetingDays !== "string") {
    console.warn("Invalid meetingDays value:", meetingDays);
    return [];
  }

  const replacePattern = /[\s\/]+/g;
  const splitPattern = /(?=[A-Z])/;

  const trimmed = meetingDays.trim();
  const cleaned = trimmed.replace(replacePattern, "");
  const split = cleaned.split(splitPattern);
  const allCaps = split.map((day) => day.toUpperCase());
  const days = [...new Set(allCaps)];
  const abbreviated = days.map((day) => day.slice(0, 2).toUpperCase());

  return abbreviated;
};