// This function controls which JavaScript file is loaded on which page
// In order to add additional pages, you will need to implement them below
// You may change the behaviour or approach of this file if you choose
export default async function router(pathname = window.location.pathname) {
  switch (pathname) {
    case "/":
      await import("./views/home");
      break;
    case "/auction":
      await import("./views/auction");
      break;
    case "/auth/login/":
      await import("./views/login");
      break;

    case "/auth/register/":
      await import("./views/register");
      break;
    case "/post/":
      await import("./views/singlePost");
      break;
    case "/post/create/":
      await import("./views/create");
      break;
    case "/profile/":
      await import("./views/profile");
      break;
    default:
      console.error(`No route matched for path: ${pathname}`);
  }
}
