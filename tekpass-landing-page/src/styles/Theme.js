import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
    config: {
      initialColorMode: "light",
      useSystemColorMode: false,
    },
    colors: {
      navbar: {
        light: {
          backgroundColor: "#ffffff",
          color: "#171E26",
        },
        dark: {
          backgroundColor: "#171E26",
          color: "#ffffff",
        },
      },
      hoverLink: {
        light: {
          backgroundColor: "#171E26",
          color: "#ffffff",
        },
        dark: {
          backgroundColor: "#ffffff",
          color: "#171E26",
        },
      },
      footer: {
        light: {
          backgroundColor: "#ffffff",
          color: "#171E26",
        },
        dark: {
          backgroundColor: "#171E26",
          color: "#ffffff",
        },
      },
      youtubeIcon: {
        light: {
          backgroundColor: "#121212"
        },
        dark: {
          backgroundColor: "#ffffff"
        }
      }
    }
  });
  