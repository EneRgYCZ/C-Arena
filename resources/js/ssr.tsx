import ReactDOMServer from "react-dom/server";
import { createInertiaApp } from "@inertiajs/react";
import createServer from "@inertiajs/react/server";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { route } from "../../vendor/tightenco/ziggy";
import { RouteName } from "ziggy-js";
import React from "react";

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

createServer(page =>
    createInertiaApp({
        page,
        render: ReactDOMServer.renderToString,
        title: title => `${title} - ${appName}`,
        resolve: name => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob("./pages/**/*.tsx")),
        setup: ({ App, props }) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            global.route<RouteName> = (name, params, absolute) =>
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                route(name, params as any, absolute, {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    ...page.props.ziggy,
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    location: new URL(page.props.ziggy.location)
                });

            return <App {...props} />;
        }
    })
);
