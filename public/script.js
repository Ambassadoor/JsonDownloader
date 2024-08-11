document.addEventListener("DOMContentLoaded", function () {
  let jsonData = [];

  document
    .getElementById("fileInput")
    .addEventListener("change", function (event) {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = function (e) {
        jsonData = JSON.parse(e.target.result);
        console.log("Loaded JSON Data:", jsonData);
        generateTable(jsonData);
      };

      reader.readAsText(file);
    });

  document
    .getElementById("searchInput")
    .addEventListener("input", function (event) {
      const searchTerm = event.target.value.toLowerCase();
      const filteredData = jsonData.filter((item) => {
        return Object.values(item).some((value) =>
          value.toString().toLowerCase().includes(searchTerm),
        );
      });
      generateTable(filteredData);
    });

  document
    .getElementById("subscribeButton")
    .addEventListener("click", function () {
      const subscribedCourses = jsonData.filter((item) => item.subscribed);
      uploadJSON(subscribedCourses);
    });

  function uploadJSON(data) {
    fetch("http://localhost:3000/download", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result.message);
        alert("Courses have been saved to the downloads directory");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  function generateTable(data) {
    const tableHeader = document.getElementById("tableHeader");
    const tableBody = document.getElementById("tableBody");

    // Clear existing content
    tableHeader.innerHTML = "";
    tableBody.innerHTML = "";

    if (data.length > 0) {
      // Create table header
      const headers = Object.keys(data[0]);
      headers.unshift(""); // Add an empty header for the checkbox column
      headers.forEach((header) => {
        const th = document.createElement("th");
        th.textContent = header;
        tableHeader.appendChild(th);
      });

      // Create table rows
      data.forEach((row, rowIndex) => {
        const tr = document.createElement("tr");
        // Add checkbox cell
        const checkboxTd = document.createElement("td");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = row.subscribed || false;
        checkbox.addEventListener("change", function () {
          row.subscribed = checkbox.checked;
          updateSubscribedTable(row);
        });
        checkboxTd.appendChild(checkbox);
        tr.appendChild(checkboxTd);
        // Add data cells
        headers.slice(1).forEach((header) => {
          // Skip the first empty header
          const td = document.createElement("td");
          td.textContent = row[header];
          tr.appendChild(td);
        });
        tableBody.appendChild(tr);
      });
    }
  }

  function updateSubscribedTable(course) {
    const subscribedBody = document.getElementById("subscribedBody");

    if (course.subscribed) {
      // Add the course to the subscribed table
      const tr = document.createElement("tr");
      ["Course Code", "Section Code", "Course Name"].forEach((header) => {
        const td = document.createElement("td");
        td.textContent = course[header];
        tr.appendChild(td);
      });
      tr.dataset.courseCode = course["Course Code"]; // Add a data attribute for identification
      subscribedBody.appendChild(tr);
    } else {
      // Remove the course from the subscribed table
      const rows = subscribedBody.getElementsByTagName("tr");
      for (let row of rows) {
        if (row.dataset.courseCode === course["Course Code"]) {
          row.remove();
          break;
        }
      }
    }
  }

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
      Sun: "SUN",
      Mon: "MON",
      Tues: "TUE",
      Wed: "WED",
      Thurs: "THU",
      Fri: "FRI",
      Sat: "SAT",
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

  function createCalendarEvent(course, timeZone) {
    const startDate = new Date(course["Start Date"]);
    const endDate = new Date(course["End Date"]);
    const meetingDays = parseMeetingDays(course["Meeting Days"]);
    console.log(startDate, endDate, meetingDays);

    const event = {
      summary: `${course["Course Code"]} ${course["Section Code"]} - ${course["Course Name"]}`,
      description: `Course: ${course["Course Name"]}, Instructor: ${course.Instructor}`,
      start: {
        dateTime: new Date(
          startDate.toDateString() + " " + course["Start Time"],
        ).toISOString(),
        timeZone: timeZone,
      },
      end: {
        dateTime: new Date(
          startDate.toDateString() + " " + course["End Time"],
        ).toISOString(),
        timeZone: timeZone,
      },
      recurrence: [
        `RRULE:FREQ=WEEKLY;BYDAY=${meetingDays.join(",")};UNTIL=${endDate.toISOString().split("T")[0]}`,
      ],
    };

    return event;
  }

  // Example course data
  const course = {
    "Course Code": "CS101",
    "Section Code": "01",
    "Course Name": "Introduction to Computer Science",
    Instructor: "Dr. Smith",
    "Start Date": "2024-09-01",
    "End Date": "2024-12-15",
    "Start Time": "09:00:00",
    "End Time": "10:30:00",
    "Meeting Days": "MonWedFri",
  };

  // Example usage
  const timeZone = "America/New_York";
  const events = createCalendarEvent(course, timeZone);
  console.log(events);
});
