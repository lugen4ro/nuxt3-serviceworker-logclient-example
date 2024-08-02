self.addEventListener("install", (event) => {
  console.log("Service Worker: Installed");
  self.skipWaiting(); // Activate immediately
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activated");
  event.waitUntil(self.clients.claim()); // Take control of all clients
});

// Function to send buffered events to the backend
async function sendData(endpointURL, eventBuffer) {
  try {
    const response = await fetch(endpointURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json, text/plain, */*",
      },
      body: JSON.stringify({ data: eventBuffer }),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const responseData = await response.json();
    console.log(`ServiceWorker: Response from backend -> ${responseData}`);
    return true;
  } catch (error) {
    console.error("ServiceWorker: There was a problem in sendData:", error);
    return false;
  }
}

const bufferSize = 5;
const timeLimitMs = 5000; // ms

// Used to send buffered events when a set amount of time has passed
// since the last event has been received.
let timeoutId = undefined;
// Buffer events and send them in bulk to the backend
let clickEventBuffer = [];

async function handleClickEvent(params) {
  console.log("ServiceWorker: Processing click event");

  clickEventBuffer.push({ params });
  logToClient(`Add event to buffer (len = ${clickEventBuffer.length})`);

  if (clickEventBuffer.length >= bufferSize) {
    // Send when buffer is full
    console.log("ServiceWorker: Buffer full, sending logs! ");
    clearTimeout(timeoutId);

    // Send data and clear buffer
    const ok = await sendData(
      "http://localhost:3000/api/click",
      clickEventBuffer,
    );
    if (ok) {
      clickEventBuffer = [];
      logToClient(
        `Buffered events were sent to backend (Buffer reached limit -> ${bufferSize})`,
      );
    }
  } else {
    // Send when timeLimitMs passed since last message (update timer when new message comes in)

    // Clear current timeout if one exists
    timeoutId && clearTimeout(timeoutId);

    // Set new timeout for duration of "timeLimit"
    timeoutId = setTimeout(async () => {
      const ok = await sendData(
        "http://localhost:3000/api/click",
        clickEventBuffer,
      );
      if (ok) {
        clickEventBuffer = [];
        logToClient(
          `Buffered events were sent to backend (Time limit surpassed -> ${timeLimitMs}ms)`,
        );
      }
    }, timeLimitMs);
  }
}

// Receive and process messages from main thread
self.addEventListener("message", async (event) => {
  // Must have at least a mesageType
  if (!event.data || !event.data.type) {
    console.debug("ServiceWorker: message event.data is falsy");
    return;
  }

  const messageType = event.data.type;
  const messageParams = event.data.params;

  if (messageType === "CLICK_EVENT") {
    handleClickEvent(messageParams);
  } else if (messageType === "LOG") {
    self.clients.matchAll().then((clients) => {
      clients.forEach((client) => {
        client.postMessage({
          type: "LOG",
          message: event.data.message,
        });
      });
    });
  } else {
    console.error(`Event type not supported --> ${messageType}`);
  }
});

// Function for sending log messages to client
function logToClient(message) {
  self.clients.matchAll().then((clients) => {
    clients.forEach((client) => {
      client.postMessage({
        type: "LOG",
        message: message,
      });
    });
  });
}
