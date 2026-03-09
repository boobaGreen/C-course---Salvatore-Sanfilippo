const fs = require('fs');
const path = require('path');

const contentDir = path.join(__dirname, '../src/content/it');
const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.mdx'));

const mockOutputs = {
    "opt-trap": "        call    puts@PLT",
    "elf-check": "a.out: ELF 64-bit LSB pie executable, x86-64, version 1 (SYSV), dynamically linked, interpreter /lib64/ld-linux-x86-64.so.2, BuildID[sha1]=..., for GNU/Linux 3.2.0, not stripped",
    "strip-symbols": "",
    "xxd-dump": "00000000: 7f45 4c46 0201 0100 0000 0000 0000 0000  .ELF............\\n00000010: 0300 3e00 0100 0000 4010 0000 0000 0000  ..>.....@.......",
    "nm-symbols": "0000000000001130 T main\\n                 U puts@GLIBC_2.2.5\\n0000000000001000 t _init",
    "objdump-header": "a.out:     file format elf64-x86-64\\narchitecture: i386:x86-64, flags 0x00000150:\\nHAS_SYMS, DYNAMIC, D_PAGED\\nstart address 0x0000000000001040",
    "unsigned-suffix": "",
    "m32-flag": "",
    "size-command": "   text\\t   data\\t    bss\\t    dec\\t    hex\\tfilename\\n   1405\\t    600\\t      8\\t   2013\\t    7dd\\ta.out",
    "limits-header": "/usr/include/limits.h",
    "stdint-header": "/usr/include/stdint.h",
    "lscpu-endian": "Byte Order:            Little Endian",
    "man-printf": "PRINTF(1)                        User Commands                       PRINTF(1)\\n\\nNAME\\n       printf - format and print data",
    "tr-upper": "CIAO",
    "od-dump": "0000000 63 69 61 6f 0a\\n0000005",
    "gcc-wall": "",
    "gcc-define": "",
    "diff-command": "1c1\\n< int main() { return 0; }\\n---\\n> int main(void) { return 0; }",
    "grep-while": "main.c:    while (1) {",
    "time-perf": "real\\t0m0.002s\\nuser\\t0m0.001s\\nsys\\t0m0.001s",
    "ls-recursive": ".:\\ndocs  src  test\\n\\n./docs:\\nreadme.txt",
    "wc-lines": "142 life.c",
    "grep-define": "#define ROWS 20\\n#define COLS 40\\n#define ALIVE 'O'\\n#define DEAD '.'",
    "nano-editor": "",
    "gdb-debugger-it": "GNU gdb (Ubuntu 12.1-0ubuntu1~22.04) 12.1\\nReading symbols from ./a.out...\\n(gdb) ",
    "proc-maps-it": "00400000-00401000 r-xp 00000000 08:01 12345 /tmp/a.out\\n00600000-00601000 r--p 00001000 08:01 12345 /tmp/a.out\\n00601000-00602000 rw-p 00002000 08:01 12345 /tmp/a.out",
    "pointer-size-it": "8",
    "hexdump-bin-it": "00000000  7f 45 4c 46 02 01 01 00  00 00 00 00 00 00 00 00  |.ELF............|",
    "ulimit-core-it": "",
    "strace-sys-it": "execve(\"./a.out\", [\"./a.out\"], 0x7ffd5a98e3b0 /* 53 vars */) = 0\\nbrk(NULL)                               = 0x55f1a5a8a000\\nwrite(1, \"Hello\\n\", 6)                  = 6",
    "endian-check": "Byte Order:            Little Endian",
    "python-hex-check": "97",
    "hexdump-custom": "00000000  41 42 43 44                                       |ABCD|",
    "valgrind-basic": "==12345== Memcheck, a memory error detector\\n==12345== Copyright (C) 2002-2022, and GNU GPL'd, by Julian Seward et al.\\n==12345== Using Valgrind-3.18.1 and LibVEX; rerun with -h for copyright info\\n==12345== Command: ./test\\n==12345== \\n==12345== HEAP SUMMARY:\\n==12345==     in use at exit: 0 bytes in 0 blocks\\n==12345==   total heap usage: 1 allocs, 1 frees, 1,024 bytes allocated\\n==12345== \\n==12345== All heap blocks were freed -- no leaks are possible",
    "check-heap-limits": "",
    "mem-free-status": "               total        used        free      shared  buff/cache   available\\nMem:           16Gi       4.2Gi       8.1Gi       125Mi       3.9Gi        11Gi\\nSwap:          16Gi          0B        16Gi",
    "hexdump-string": "00000000  03 00 00 00 41 42 43 00                           |....ABC.|",
    "valgrind-check": "==12345== Conditional jump or move depends on uninitialised value(s)\\n==12345==    at 0x10915E: main (test.c:5)\\n==12345==  Uninitialised value was created by a heap allocation\\n==12345==    at 0x484DA83: calloc (in /usr/lib/valgrind/vgpreload_memcheck-amd64-linux.so)\\n==12345==    by 0x109139: main (test.c:4)",
    "grep-header": "/usr/include/stdint.h",
    "struct-offset": "/* offset      |  size */  type = struct Frazione {\\n/*      0      |     4 */    int num;\\n/*      4      |     4 */    int den;\\n\\n                           /* total size (bytes):    8 */\\n                         }",
    "packed-verify": "12\\n9",
    "tac-usage": "root:x:0:0:root:/root:/bin/bash\\ndaemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin\\nbin:x:2:2:bin:/bin:/usr/sbin/nologin",
    "check-leaks-tac": "==12345== HEAP SUMMARY:\\n==12345==     in use at exit: 0 bytes in 0 blocks\\n==12345==   total heap usage: 4 allocs, 4 frees, 4,096 bytes allocated\\n==12345== \\n==12345== All heap blocks were freed -- no leaks are possible",
    "file-descriptors-limit": "1024",
    "magic-search": "ef be ad de",
    "gcc-flexible": "",
    "mem-limit-check": "  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND\\n12345 user      20   0 1024.5M 950.2M   1234 R  99.9  11.5   0:01.23 a.out",
    "xdump-test": "00000000  ef be ad de 00 00 00 00  00 00 00 00 00 00 00 00  |................|",
    "ternary-bash": "FALSO",
    "memset-zero-file": "1+0 records in\\n1+0 records out\\n1024 bytes copied, 0.000123 s, 8.3 MB/s",
    "file-inspect": "00000000  01 00 00 00 00 00 bf 42                           |.......B|",
    "count-chars-wc": "8 save.dat",
    "lsof-pro": "COMMAND   PID USER   FD   TYPE DEVICE SIZE/OFF   NODE NAME\\na.out   12345 user  cwd    DIR    8,1     4096 123456 /tmp\\na.out   12345 user  rtd    DIR    8,1     4096      2 /\\na.out   12345 user    3r   REG    8,1        8 345678 /tmp/save.dat",
    "man-syscall": "READ(2)                    Linux Programmer's Manual                   READ(2)\\n\\nNAME\\n       read - read from a file descriptor",
    "errno-list": "/usr/include/asm-generic/errno-base.h:#define\\tENOENT\\t\\t 2\\t/* No such file or directory */",
    "pmap-inspect": "12345:   ./a.out\\n0000555555554000      4K r--p  /tmp/a.out\\n0000555555555000      4K r-xp  /tmp/a.out",
    "time-compare": "1000+0 records in\\n1000+0 records out\\n1024000 bytes (1.0 MB, 977 KiB) copied, 0.002888 s, 355 MB/s\\n\\nreal    0m0.007s\\nuser    0m0.000s\\nsys     0m0.007s",
    "ldd-check": "\\tlinux-vdso.so.1 (0x00007ffcc1154000)\\n\\tlibc.so.6 => /lib/x86_64-linux-gnu/libc.so.6 (0x00007f3bb6a00000)\\n\\t/lib64/ld-linux-x86-64.so.2 (0x00007f3bb6e32000)",
    "make-touch": "",
    "git-commit": "[main 4a8b23c] Initial commit of toyfort\\n 1 file changed, 10 insertions(+)\\n create mode 100644 toyfort.c"
};

let modifiedFiles = 0;

files.forEach(file => {
    const filePath = path.join(contentDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;

    // Use a regex with a replacer function to safely inject simulatedSuccessOutput right after the id
    // We only replace if simulatedSuccessOutput doesn't already exist for this id
    const regex = /id:\s*(['"])([^'"]+)\1,/g;
    
    // Check if the file has any ProTerminal component at all
    if (!content.includes('<ProTerminal')) return;

    let newContent = content.replace(regex, (match, quote, id) => {
        if (mockOutputs.hasOwnProperty(id)) {
            const mockOutput = mockOutputs[id];
            
            // Just basic string, we escape backticks internally
            return `${match}\n        simulatedSuccessOutput: \`${mockOutput.replace(/`/g, '\\\\`')}\`,`;
        }
        return match;
    });

    if (newContent !== content) {
        // Quick clean up if we run it twice accidentally
        newContent = newContent.replace(/simulatedSuccessOutput: `[^`]*`,\n\s*simulatedSuccessOutput/g, 'simulatedSuccessOutput');
        
        fs.writeFileSync(filePath, newContent, 'utf8');
        hasChanges = true;
        modifiedFiles++;
    }
});

console.log(`Successfully updated ${modifiedFiles} files with simulatedSuccessOutput.`);
