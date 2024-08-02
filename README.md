# Overview

This is an example implementation for sercive workers using Nuxt3.
Here, a service worker is used for sending logs to the backend.
In this example we work with click events, which we buffer and send in bulk.
Also, a time limit is set to send any buffered events regardless of the current buffer size.
This is a suitable usecase for a service worker considering the following:

- The service worker runs in a seperate thread so it doesn't impact the main thread's performance
- The service worker can outlive the main thread, thus it can clean up and send any buffered logs after a tab / window has been closed

# Showcase

![Kapture 2024-08-02 at 11 58 07](https://github.com/user-attachments/assets/227de909-f3fd-47a9-ba1e-41b160801d05)


# How to use

Execute the following in this repository's directory.

```bash
# install packages and start dev server
yarn install && yarn dev
```

Then open http://localhost:3000 in the browser to access the dev server.
