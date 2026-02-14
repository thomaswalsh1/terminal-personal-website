import React, { useRef, useEffect, useState } from "react";
import { useXTerm } from "react-xtermjs";
import { processCommand } from "./commands";
import  { printAscii } from "./AsciiAssets"

import "./MyTerminal.css";

const art = `
 _________         
\\__   __/|\\     /|
   ) (   | )   ( |
   | |   | | _ | |
   | |   | |( )| |
   | |   | || || |
   | |   | () () |
   )_(   (_______)
`;

const terminalSettings = {
  cursorStyle: "block",
  cursorBlink: true,
  fontSize: 20,
  cols: 100,
  theme: {
    background: "#1e1e1e",
    foreground: "#ffffff",
  },
};

const MyTerminal = () => {
  const { instance, ref } = useXTerm({ options: terminalSettings });
  const [cwd, setCwd] = useState<string[]>(["", "home", "thomas"]);
  const inputRef = useRef("");
  const initializedRef = useRef(false);

  // In MyTerminal.tsx
  useEffect(() => {
    if (instance) {
      // Only show welcome message on first mount
      if (!initializedRef.current) {
        printAscii(instance, art);
        instance.writeln("Welcome to Thomas' terminal.");
        instance.writeln('Enter "help" for a list of commands');
        const cwdString = cwd.length === 1 ? "/" : cwd.slice(1).join("/");
        instance.write(cwdString + " $ ");
        initializedRef.current = true;
      }

      // Listen for key events
      const disposable = instance.onKey(({ key, domEvent }) => {
        if (domEvent.key === "Enter") {
          instance.writeln("");
          const result = processCommand(inputRef.current, cwd, setCwd);
          result.execute(instance);
          
          // Use the new cwd if it changed, otherwise use current
          const displayCwd = result.newCwd || cwd;
          const cwdString =
            displayCwd.length === 1 ? "/" : displayCwd.slice(1).join("/");
          instance.write(cwdString + " $ ");

          inputRef.current = "";
        } else if (domEvent.key === "Backspace") {
          if (inputRef.current.length > 0) {
            inputRef.current = inputRef.current.slice(0, -1);
            instance.write("\b \b");
          }
        } else if (domEvent.key.length === 1) {
          inputRef.current += domEvent.key;
          instance.write(domEvent.key);
        }
      });

      return () => {
        disposable.dispose();
      };
    }
  }, [instance, cwd]);

  return <div className="terminal" ref={ref} />;
};
export default MyTerminal;
