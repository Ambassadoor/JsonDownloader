// Google's Calendar batch endpoint rejects batches with more than 50 sub-requests
const MAX_BATCH_SIZE = 50;

function buildBatchBody(entries, calendarId) {
  const boundary = 'batch_' + Math.random().toString(36).substring(2, 15);
  let body = '';

  for (const [key, change] of entries) {
    const patchBody = {};

    for (const field in change) {
      const value = change[field];

      if (field === 'attachments') {
        patchBody.attachments = value.map(file => ({
          fileUrl: `https://drive.google.com/open?id=${file.id}`,
          title: file.name,
          mimeType: file.mimeType,
          iconLink: `https://drive-thirdparty.googleusercontent.com/16/type/${file.mimeType}`
        }));
      } else if (field === 'start' || field === 'end') {
        patchBody[field] = {
          dateTime: value.toISOString()
        };
      } else {
        patchBody[field] = value;
      }
    }

    // Content-ID is set to the instance key (not a sequential index) so the batch
    // response can be matched back to the specific event instance that failed.
    body += `--${boundary}\r\n`;
    body += `Content-Type: application/http\r\n`;
    body += `Content-ID: <${key}>\r\n\r\n`;
    body += `PATCH /calendar/v3/calendars/${calendarId}/events/${key}?supportsAttachments=true\r\n`;
    body += `Content-Type: application/json\r\n\r\n`;
    body += `${JSON.stringify(patchBody)}\r\n\r\n`;
  }

  body += `--${boundary}--`;

  return { body, boundary };
}

// Splits changes into one or more batch requests, each within Google's 50-sub-request limit
function buildCalendarBatchPatch(changes, calendarId = 'primary') {
  const entries = Object.entries(changes);
  const batches = [];

  for (let i = 0; i < entries.length; i += MAX_BATCH_SIZE) {
    batches.push(buildBatchBody(entries.slice(i, i + MAX_BATCH_SIZE), calendarId));
  }

  return batches;
}

export default buildCalendarBatchPatch;
