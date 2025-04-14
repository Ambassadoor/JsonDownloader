function buildCalendarBatchPatch(changes, calendarId = 'primary') {
    const boundary = 'batch_' + Math.random().toString(36).substring(2, 15);
    let body = '';
    let partIndex = 1;
  
    for (const key in changes) {
      const change = changes[key];
  
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
  
      body += `--${boundary}\r\n`;
      body += `Content-Type: application/http\r\n`;
      body += `Content-ID: ${partIndex++}\r\n\r\n`;
      body += `PATCH /calendar/v3/calendars/${calendarId}/events/${key}?supportsAttachments=true\r\n`;
      body += `Content-Type: application/json\r\n\r\n`;
      body += `${JSON.stringify(patchBody)}\r\n\r\n`;
    }
  
    body += `--${boundary}--`;
  
    return { body, boundary };
  }
  

  export default buildCalendarBatchPatch;