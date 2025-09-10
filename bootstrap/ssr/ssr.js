import { jsx } from "react/jsx-runtime";
import { createInertiaApp } from "@inertiajs/react";
import createServer from "@inertiajs/react/server";
import ReactDOMServer from "react-dom/server";
import { route } from "ziggy-js";
async function resolvePageComponent(path, pages) {
  for (const p of Array.isArray(path) ? path : [path]) {
    const page = pages[p];
    if (typeof page === "undefined") {
      continue;
    }
    return typeof page === "function" ? page() : page;
  }
  throw new Error(`Page not found: ${path}`);
}
const appName = "Laravel";
createServer(
  (page) => createInertiaApp({
    page,
    render: ReactDOMServer.renderToString,
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, /* @__PURE__ */ Object.assign({ "./pages/errors/errorData.tsx": () => import("./assets/errorData-DbwWaEVk.js"), "./pages/errors/errorPage.tsx": () => import("./assets/errorPage-BuwiUOEO.js"), "./pages/welcome.tsx": () => import("./assets/welcome-BGgUJFdI.js") })),
    setup: ({ App, props }) => {
      global.route = (name, params, absolute) => route(name, params, absolute, {
        // @ts-expect-error
        ...page.props.ziggy,
        // @ts-expect-error
        location: new URL(page.props.ziggy.location)
      });
      return /* @__PURE__ */ jsx(App, { ...props });
    }
  })
);
