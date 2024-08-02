<template>
  <div class="container mx-auto max-w-[650px]">
    <h1 class="text-2xl mt-5">
      Nuxt3 Service Worker Example - Background Logger
    </h1>
    <p class="text-sm text-slate-700">
      Send buffered click events notifications to the backend using a service
      worker!
    </p>
    <div class="flex flex-col items-center justify-center gap-3 my-5">
      <button
        @click="dispatchClickEvent"
        class="bg-blue-500 text-white text-lg font-bold py-2 px-6 rounded-lg hover:bg-blue-600 focus:outline-none active:bg-blue-800"
      >
        Click me!
      </button>
    </div>

    <div class="bg-blue-100 rounded p-2">
      <p class="mb-3 text-lg bg-blue-200 rounded inline-block px-2">
        Service Worker Logs
      </p>
      <div class="flex flex-col h-72 overflow-y-auto" ref="logContainer">
        <p v-for="(item, index) in SWlogs" :key="index">{{ item }}</p>
        <!-- <div>hey -> {{ SWlogs }}</div> -->
      </div>
    </div>

    <div class="text-slate-800 bg-slate-300 rounded p-2 my-3">
      <p class="mb-3">ℹ️ Clicking the button triggers the following:</p>
      <ol class="list-decimal pl-6">
        <li>
          A `message` event with type `CLICK_EVENT` is sent to the service
          worker.
        </li>
        <li>
          The service worker buffers these events and sends them in bulk to the
          `/api/click` endpoint when either of the following conditions is met:
        </li>
        <ul class="list-disc pl-6 mt-1">
          <li>buffer reaches full capacity (default: 5)</li>
          <li>
            Time passed since last event was inserted into the buffer reaches
            limit (default: 5s)
          </li>
        </ul>
      </ol>
    </div>

    <div class="bg-slate-300 rounded p-2 my-3">
      <p>
        💡 The service worker runs in a seperate thread, so the buffer remains
        even when reloading the page!
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, watch, onMounted, onUnmounted } from "vue";

// ------------------- Send messages to the service worker -------------------
// Send message to service worker
function messageServiceWorker(messageType, messageParams) {
  // If SW is supported by browser and active SW is controlling the page
  if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: messageType,
      params: messageParams,
    });
  }
}
const dispatchClickEvent = () => {
  const params = {
    date: new Date().toISOString().slice(0, 10), // UTC date in format yyyy-mm-dd
  };
  messageServiceWorker("CLICK_EVENT", params);
};

// ------------------- Receive messages from the service worker -------------------
// Recieve log messages from service worker
const SWlogs = ref([]);
const handleLogFromSW = (event) => {
  if (event.data && event.data.type === "LOG") {
    SWlogs.value.push(event.data.message);
  }
};
onMounted(() => {
  navigator.serviceWorker.addEventListener("message", handleLogFromSW);
});

// ------------------- Utility: Make the scrollable SW logs panel scroll the end -------------------

// Reference to the scrollable container
const logContainer = ref(null);

// Watch for changes in SWlogs and scroll to the bottom
watch(
  () => SWlogs.value.length,
  async () => {
    await nextTick();
    if (logContainer.value) {
      logContainer.value.scrollTop = logContainer.value.scrollHeight;
    } else {
    }
  },
);
</script>
