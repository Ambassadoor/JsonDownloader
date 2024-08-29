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

  // Get user's local timezone
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

  const startDate = new Date(
    `${course["Start Date"] || today}T${course["Start Time"] || "09:00"}`,
  ).toISOString();
  const endTime = new Date(
    `${course["Start Date"] || today}T${course["End Time"] || "10:00"}`,
  ).toISOString();
  const endDate = new Date(
    `${course["End Date"] || today}T${course["End Time"] || "10:00"}`,
  ).toISOString();
  const meetingDays = parseMeetingDays(course["Meeting Days"] || "");

  return {
    summary: course["Course Name"] || "Untitled Course",
    location: course["Location"] || "Online", // Default to "Online" if no location is provided
    description: `Instructor: ${course["Instructor"] || "TBA"}\nStudents: ${
      course["Seats Filled"] || "0"
    }${course["Course Notes"] ? `\nNotes: ${course["Course Notes"]}` : ""}`,
    start: {
      dateTime: startDate, // Should be a properly formatted date-time string
      timeZone: userTimeZone, // Use the user's local timezone
    },
    end: {
      dateTime: endTime, // Should be a properly formatted date-time string
      timeZone: userTimeZone, // Use the user's local timezone
    },
    recurrence: meetingDays.length
      ? [
          `DTSTART:${startDate.replace(/[-:]/g, "").split(".")[0]}Z`,
          `RRULE:FREQ=WEEKLY;BYDAY=${meetingDays.join(",")};UNTIL=${
            endDate.replace(/[-:]/g, "").split(".")[0]
          }Z`,
        ]
      : [], // No recurrence if meetingDays is empty
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
