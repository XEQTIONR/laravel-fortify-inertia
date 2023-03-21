import './bootstrap';

import "../css/app.css";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import getLodash from "lodash/get";
import eachRightLodash from "lodash/eachRight";
import replaceLodash from "lodash/replace";

import React from "react";
import { render } from "react-dom";
import { createInertiaApp } from "@inertiajs/inertia-react";
import { InertiaProgress } from "@inertiajs/progress";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";

window.trans = function(string, args){
    let value = getLodash(window.i18n, string);

    eachRightLodash(args, (paramVal, paramKey) => {
        value = replaceLodash(value, `:${paramKey}`, paramVal);
    });
    return value;
}

const appName =
    window.document.getElementsByTagName("title")[0]?.innerText || "Laravel";

const CustomFontTheme = createTheme({
    typography: {
        fontFamily: [  "'Noto Sans Bengali'" ,"'Hind Siliguri'",  "'Noto Serif Bengali'"].join(","),
        fontSize: 13,
    },
    palette: {
        mode: 'light',
        text: {
            primary: '#484747',
        },
        primary: {
            main: '#0eb8f5',
            contrastText: '#fff'
        },
        secondary: {
          main: '#fce500',
          dark: '#faef83'
        },
        white: {
          main: '#fff',
        },
        error: {
            main: '#e01f1f',
        },
        background: {
            paper: '#f6fafc',
            default: '#ffffff',
        },
    },
    components: {
        // Name of the component
        MuiTreeItem: {
            styleOverrides: {
                // Name of the slot
                content: {
                    // Some CSS
                    fontSize: '1rem',
                },
            },
        },
    },
});

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob("./Pages/**/*.jsx")
        ),
    setup({ el, App, props }) {
        return render(
            (
                <ThemeProvider theme={CustomFontTheme}>
                    <App {...props} />
                </ThemeProvider>

            ), el);
    },
});

// you can specify any color of choice
InertiaProgress.init({ color: "#4B5563" });
