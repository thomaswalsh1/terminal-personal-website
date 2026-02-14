export const printAscii = (instance: any, art: String) => {
    if (!instance || !art) return;
    art.split("\n").forEach(line => {
        instance.writeln(line);
    });
}