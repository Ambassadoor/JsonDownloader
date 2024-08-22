const createEventFromCourse = (course) => {
  function parseMeetingDays(meetingDays) {
    if (!meetingDays) {
      console.warn("Meeting Days is undefined");
      return [];
    }

    // Trim and convert to uppercase
    meetingDays = meetingDays.trim();

    // Remove spaces and slashes
    meetingDays = meetingDays.replace(/[\s\/]+/g, "");

    // Define a mapping of full day names to their abbreviations
    const dayMap = {
      Sun: "SU",
      Mon: "MO",
      Tues: "TU",
      Wed: "WE",
      Thurs: "TH",
      Fri: "FR",
      Sat: "SA",
    };

    // Initialize an empty array to store the parsed days
    let days = [];

    // Split the string using uppercase letters as delimiters
    const splitPattern = /(?=[A-Z])/;

    const dayPatterns = meetingDays.split(splitPattern);
    // Check each pattern against the dayMap keys
    for (const pattern of dayPatterns) {
      for (const [fullDay, abbreviation] of Object.entries(dayMap)) {
        if (pattern.toUpperCase().includes(fullDay.toUpperCase())) {
          days.push(abbreviation);
          break; // Move to the next pattern once a match is found
        }
      }
    }

    // Remove duplicates by converting the array to a Set and then back to an array
    return [...new Set(days)];
  }
  const startDate = new Date(
    `${course["Start Date"]}T${course["Start Time"]}`,
  ).toISOString();
  const endTime = new Date(
    `${course["Start Date"]}T${course["End Time"]}`,
  ).toISOString();
  const endDate = new Date(
    `${course["End Date"]}T${course["End Time"]}`,
  ).toISOString();
  const meetingDays = parseMeetingDays(course["Meeting Days"]);

  return {
    summary: course["Course Name"],
    location: course["Location"] || "Online", // Default to "Online" if no location is provided
    description: `Course Code: ${course["Course Code"]} ${course["Section Code"]}\nInstructor: ${course["Instructor"]}`,
    start: {
      dateTime: startDate, // Should be a properly formatted date-time string
      timeZone: "America/Chicago", // Adjust the timezone as needed
    },
    end: {
      dateTime: endTime, // Should be a properly formatted date-time string
      timeZone: "America/Chicago",
    },
    recurrence: [
      `DTSTART:${startDate.replace(/[-:]/g, "").split(".")[0]}Z`,
      `RRULE:FREQ=WEEKLY;BYDAY=${meetingDays.join(",")};UNTIL=${endDate.replace(/[-:]/g, "").split(".")[0]}Z`,
    ], // Adjust for recurrence
    reminders: {
      useDefault: false,
      overrides: [
        { method: "email", minutes: 24 * 60 }, // 24 hours before
        { method: "popup", minutes: 10 },
      ],
    },
  };
};

export default createEventFromCourse;
// Example usage:
