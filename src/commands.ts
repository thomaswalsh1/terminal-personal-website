import { fileSystem } from "./fileSystem";

// Helper to resolve a path (absolute or relative) to a node in the fileSystem
function resolvePath(path: string, cwd: string[]): { node: any, pathArr: string[] } {
    let parts: string[];
    if (path === "~") {
        parts = ["", "home", "thomas"];
    } else if (path.startsWith("~")) {
        parts = ["", "home", "thomas", ...path.slice(2).split("/").filter(Boolean)];
    } else if (path.startsWith("/")) {
        parts = ["", ...path.slice(1).split("/").filter(Boolean)];
    } else {
        parts = [...cwd, ...path.split("/").filter(Boolean)];
    }

    // Normalize path (handle . and ..)
    let normalized: string[] = [""];
    for (let i = 0; i < parts.length; i++) {
        if (parts[i] === "" && i === 0) {
            continue; // Skip the initial empty string
        } else if (parts[i] === "..") {
            if (normalized.length > 1) normalized.pop();
        } else if (parts[i] === ".") {
            continue;
        } else if (parts[i] !== "") {
            normalized.push(parts[i]);
        }
    }

    // Traverse fileSystem
    let node: any = fileSystem[""];
    for (let i = 1; i < normalized.length; i++) {
        if (node && typeof node === "object" && normalized[i] in node) {
            node = node[normalized[i]];
        } else {
            return { node: undefined, pathArr: normalized };
        }
    }

    return { node, pathArr: normalized };
}

// Helper function to print the file
function printFile(instance: any, file: string) {
    instance.reset();
    fetch(`/texts/${file}`)
        .then(res => {
            if (!res.ok) throw new Error("File not found");
            return res.text();
        })
        .then(text => {
            text.split('\n').forEach(line => instance.writeln(line));
        })
        .catch(() => {
            instance.writeln(`open: ${file}: No such file`);
        });
}

// In Commands.ts - change return type
export const processCommand = (
    input: string,
    cwd: string[],
    setCwd: (cwd: string[]) => void
): { execute: (instance: any) => void; newCwd?: string[] } => {
    const [command, ...args] = input.trim().split(/\s+/);

    switch (command) {
        case "help":
            return {
                execute: (instance: any) => {
                    instance.writeln("Available commands:");
                    instance.writeln("");
                    instance.writeln("help         - View this page again");
                    instance.writeln("cd DIR       - Change directory");
                    instance.writeln("ls [DIR]     - View files in directory");
                    instance.writeln("info FILE    - View file info");
                    instance.writeln("open FILE    - Open the file");
                    instance.writeln("clear        - Clear the terminal");
                    instance.writeln("");
                }
            };
        case "ls":
            return {
                execute: (instance: any) => {
                    const target = args[0] || ".";
                    const { node } = resolvePath(target, cwd);
                    if (node === undefined) {
                        instance.writeln(`ls: cannot access '${target}': No such file or directory`);
                        return;
                    }
                    if (typeof node === "string") {
                        instance.writeln(target);
                    } else if (typeof node === "object") {
                        const keys = Object.keys(node);
                        if (keys.length === 0) {
                            instance.writeln("");
                        } else {
                            instance.writeln(keys.join("  "));
                        }
                    }
                }
            };
        case "info":
            return {
                execute: (instance: any) => {
                    if (args.length === 0) {
                        instance.writeln("info: missing file operand");
                        return;
                    }
                    const { node } = resolvePath(args[0], cwd);
                    if (node === undefined) {
                        instance.writeln(`info: ${args[0]}: No such file or directory`);
                    } else if (typeof node === "string") {
                        instance.writeln(node);
                    } else if (typeof node === "object") {
                        instance.writeln(`info: ${args[0]}: Is a directory`);
                    }
                }
            };
        case "open":
            return {
                execute: (instance: any) => {
                    if (args.length === 0) {
                        instance.writeln("open: missing file operand");
                        return;
                    }
                    const { node } = resolvePath(args[0], cwd);
                    if (node === undefined) {
                        instance.writeln(`open: ${args[0]}: No such file or directory`);
                    } else if (typeof node === "string") {
                        // print the file
                        printFile(instance, args[0]);
                    } else if (typeof node === "object") {
                        instance.writeln(`open: ${args[0]}: Is a directory`);
                    }
                }
            };
        case "clear":
            return {
                execute: (instance: any) => {
                    return instance.reset();
                }
            };
        case "cd":
            const { node, pathArr } = resolvePath(args[0] || "~", cwd);

            return {
                execute: (instance: any) => {
                    if (node === undefined) {
                        instance.writeln(`cd: ${args[0]}: No such file or directory`);
                    } else if (typeof node === "object") {
                        setCwd(pathArr);
                    } else {
                        instance.writeln(`cd: ${args[0]}: Not a directory`);
                    }
                },
                newCwd: (node !== undefined && typeof node === "object") ? pathArr : undefined
            };
        default:
            return {
                execute: (instance: any) => {
                    if (command === "") return;
                    instance.writeln("Command not found: " + command);
                }
            };
    }
};
