import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";


export interface TerminalWithAddons {
  terminal: Terminal;
  fitAddon: FitAddon;
}

export function createTerminal(container: HTMLElement): TerminalWithAddons {
  const terminal = new Terminal({
    cursorBlink: true,
    fontSize: 14,
    scrollback: 1000,
    theme: {
      background: "#000000",
      foreground: "#ffffff",
    },
  });

  const fitAddon = new FitAddon();
  terminal.loadAddon(fitAddon);
  terminal.open(container);
  fitAddon.fit();

  terminal.writeln("Terminal Initialized");

  setupInput(terminal);

  return { terminal, fitAddon };
}

async function getPath() {
    // Simulate an API call
  return "/home/Hakim";
}

async function showPrompt(terminal: Terminal) {
  const path = await getPath();
  terminal.write(`\r\n${path} $ `);
}

async function executeCommand(terminal: Terminal, command: string) {

    if(command == 'clear') {
        terminal.clear();
        return "";
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
    return "Command executed successfully";
    

}

function setupInput(terminal: Terminal) {
  let command = "";

  showPrompt(terminal);

  terminal.onData(async (data) => {
    const char = data;

    switch (char) {
      case "\r": // ENTER
        terminal.write("\r\n");


        const result = await executeCommand(terminal, command);
        terminal.write(result);


        command = "";
        await showPrompt(terminal);
        break;

      case "\u007F": // Retour en arrière
        if (command.length > 0) {
          command = command.slice(0, -1);
          terminal.write("\b \b");
        }
        break;

      default: // Caractère normal
        if (char >= String.fromCharCode(0x20)) {
          command += char;
          terminal.write(char);
        }
    }
  });

}
