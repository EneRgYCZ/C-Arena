import { useColorScheme } from "@mui/joy/styles";

export const useGraphTheme = () => {
    const { mode } = useColorScheme();

    const colorsLight = {
        ok: "#1F7A1F",
        nok: "#C41C1C",
        remaining: "#EA9A3E"
    };

    const colorsDark = {
        ok: "#5d9554",
        nok: "#ff1a1a",
        remaining: "#EA9A3E"
    };

    const lightTheme = {
        axis: {
            ticks: {
                text: {
                    fill: "#333"
                }
            },
            legend: {
                text: {
                    fill: "#333"
                }
            }
        },
        legends: {
            text: {
                fill: "#333"
            }
        },
        labels: {
            text: {
                fill: "#000"
            }
        },
        tooltip: {
            container: {
                background: "white",
                color: "#333",
                borderColor: "#ddd"
            }
        }
    };

    const darkTheme = {
        axis: {
            ticks: {
                text: {
                    fill: "#aaa"
                }
            },
            legend: {
                text: {
                    fill: "#aaa"
                }
            }
        },
        legends: {
            text: {
                fill: "#aaa"
            }
        },
        labels: {
            text: {
                fill: "#fff"
            }
        },
        tooltip: {
            container: {
                background: "#333",
                color: "#aaa",
                borderColor: "#555"
            }
        }
    };

    return {
        markerTextColor: mode === "dark" ? "#fff" : "#000",
        colors: mode === "dark" ? colorsDark : colorsLight,
        theme: mode === "dark" ? darkTheme : lightTheme,
        mode: mode
    };
};
