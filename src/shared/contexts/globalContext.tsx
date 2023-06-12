import React from "react";
import {
  ChakraProvider,
  ColorModeProvider,
  CSSReset,
  ThemeProvider,
} from "@chakra-ui/react";

import customTheme from "~/styles/theme";
import { ChildrenInterface } from "~/shared/interfaces/general/childrenNode";

const GlobalContext: React.FC<ChildrenInterface> = ({ children }) => {
  return (
    <ChakraProvider>
      <ThemeProvider theme={customTheme}>
        <ColorModeProvider>
          <CSSReset />
          {children}
        </ColorModeProvider>
      </ThemeProvider>
    </ChakraProvider>
  );
};

export default GlobalContext;
