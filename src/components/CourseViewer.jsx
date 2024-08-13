import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { rrulestr } from "rrule";

import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const createRecurringEvents = (event) => {
  const { recurrence, start, end, ...rest } = event;

  if (recurrence && recurrence.length > 1) {
    // Extract the dtstart value from recurrence[0]
    const dtstartString = recurrence[0].split(":")[1];
    const dtstart = moment(dtstartString, "YYYYMMDDTHHmmss").toDate();

    // Include dtstart in the RRULE string
    const ruleString = `${recurrence[1]};DTSTART=${dtstartString}`;
    const rule = rrulestr(ruleString);

    const duration = moment(end.dateTime).diff(
      moment(start.dateTime),
      "minutes",
    ); // Event duration in minutes

    return rule.all().map((date) => {
      return {
        ...rest,
        start: new Date(date),
        end: new Date(moment(date).add(duration, "minutes").toISOString()),
      };
    });
  } else {
    return [
      {
        ...event,
        start: new Date(start.dateTime),
        end: new Date(end.dateTime),
      },
    ];
  }
};

const CourseViewer = ({ eventObjects }) => {
  const [events, setEvents] = React.useState([]);

  React.useEffect(() => {
    const allEvents = eventObjects.flatMap(createRecurringEvents);
    setEvents(allEvents);
    console.log(allEvents);
  }, [eventObjects]);

  return (
    <div style={{ height: "500px" }}>
      <h2>Course Calendar</h2>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
      />
    </div>
  );
};

export default CourseViewer;
