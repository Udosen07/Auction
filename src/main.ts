import router from "./ts/router/";

// Ensure router completes
await router(window.location.pathname);
