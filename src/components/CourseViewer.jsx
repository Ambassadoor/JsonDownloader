import React from "react";
import moment from "moment";
import { rrulestr } from "rrule";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const createRecurringEvents = (event) => {
  const { recurrence, start, end, ...rest } = event;

  if (recurrence && recurrence.length > 1) {
    // Extract the dtstart value from recurrence[0]
    const dtstartString = recurrence[0].split(":")[1];

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
  const [highlightedDates, setHighlightedDates ] = React.useState([]);

  /*React.useEffect(() => {
    const allEvents = eventObjects.flatMap(createRecurringEvents);
    setEvents(allEvents);
  }, [eventObjects]); */

  React.useEffect(() => {
    const dates = eventObjects.flatMap((event) => {
      if (event.recurrence && event.recurrence.length > 1) {
        const rule = rrulestr(event.recurrence[1]);
        return rule.all().map((date) => date.toISOString().split("T")[0]);
      } else {
        return new Date(event.start.dateTime).toISOString().split("T")[0];
      }
    }
  )
  setHighlightedDates(dates);
}, [eventObjects]);

const tileClassName = ({ date, view }) => {
  if (view === "month") {
    const dateStr = date.toISOString().split("T")[0];
    if (highlightedDates.includes(dateStr)) {
      console.log("hi")
      return "highlight";
 
    }
  }
  return null;
}

  return (
    <div style={{ height: "500px" }}>
      <h2>Course Calendar</h2>
      <Calendar tileClassName={tileClassName}
      />
    </div>
  );
};

export default CourseViewer;
