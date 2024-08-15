import React from "react";

const EventInstanceList = ({ eventInstances, onSelectInstance }) => {
  return (
    <div>
      <h2>Event Instances</h2>
      <ul>
        {eventInstances.map((instance) => (
          <li key={instance.id}>
            {instance.summary} ({instance.start.dateTime})
            <button onClick={() => onSelectInstance(instance.id)}>
              Attach Files
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventInstanceList;
