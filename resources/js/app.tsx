import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { capitalize } from "lodash";

import React from "react";
import { createRoot } from "react-dom/client";

import { CssBaseline, CssVarsProvider, extendTheme } from "@mui/joy";

import "../css/app.css";
import "./bootstrap";

const appName = window.document.getElementsByTagName("title")[0]?.innerText || "Laravel";

const retrievePages = () => {
    const appPages = import.meta.glob("./pages/**/*.tsx");
    const modulePages = import.meta.glob("../../modules/**/frontend/pages/**/*.tsx");

    return {
        ...appPages,
        ...modulePages
    };
};

createInertiaApp({
    title: title => `${title} - ${appName}`,
    resolve: name => {
        const pages = retrievePages();

        let key = `./pages/${name}.tsx`;

        if (name.includes("::")) {
            const [moduleName, pageName] = name.split("::");
            key = `../../modules/${capitalize(moduleName)}/frontend/pages/${pageName}.tsx`;
        }

        return resolvePageComponent(key, pages);
    },
    progress: {
        delay: 250,
        color: "#67ad63",
        includeCSS: true,
        showSpinner: true
    },
    setup({ el, App, props }) {
        const root = createRoot(el);

        const theme = extendTheme({
            colorSchemes: {
                light: {
                    palette: {
                        primary: {
                            50: "#f5f9f4",
                            100: "#e6f3e5",
                            200: "#cee6cc",
                            300: "#a6d2a3",
                            400: "#67ad63",
                            500: "#53984f",
                            600: "#407c3d",
                            700: "#356332",
                            800: "#2e4f2c",
                            900: "#254225"
                        }
                    }
                },
                dark: {
                    palette: {
                        primary: {
                            50: "#f5f9f4",
                            100: "#e6f3e5",
                            200: "#cee6cc",
                            300: "#a6d2a3",
                            400: "#67ad63",
                            500: "#53984f",
                            600: "#407c3d",
                            700: "#356332",
                            800: "#2e4f2c",
                            900: "#254225"
                        }
                    }
                }
            },
            components: {
                JoyButton: {
                    defaultProps: {
                        size: "sm"
                    }
                }
            }
        });

        root.render(
            <React.StrictMode>
                <CssVarsProvider theme={theme}>
                    <CssBaseline />
                    <App {...props} />
                </CssVarsProvider>
            </React.StrictMode>
        );
    }
});
