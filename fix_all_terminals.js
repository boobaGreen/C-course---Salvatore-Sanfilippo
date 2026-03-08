import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const contentDir = path.join(__dirname, 'src', 'content', 'it');

const replacements = [
    // lesson-01
    {
        file: 'lesson-01.mdx',
        old: "Hai compilato un programma che stampa 'Hello World' con `printf`. Se guardi l'assembly generato con `-O2`, quale funzione più semplice trovi al posto di printf?",
        new: "Hai compilato un programma che stampa 'Hello World' con `printf`. Se guardi l'assembly generato con `-O2`, noterai che il compilatore ha sostituito la chiamata originale con una funzione più veloce per gestire stringhe costanti. Qual è il nome di questa funzione?"
    },
    // lesson-04
    {
        file: 'lesson-04.mdx',
        old: "Qual è il nome del file header standard che definisce i limiti minimi e massimi dei tipi interi nel tuo sistema?",
        new: "Se hai bisogno di conoscere il valore massimo che un `int` può contenere sulla tua architettura (es. `INT_MAX`), quale file header standard devi includere?"
    },
    {
        file: 'lesson-04.mdx',
        old: "Per usare tipi con dimensione garantita (es. int32_t), quale file header devi includere?",
        new: "Se vuoi essere assolutamente certo che una tua variabile occupi esattamente 32 bit su qualsiasi piattaforma, usi tipi come `int32_t`. Quale libreria standard fornisce queste definizioni?"
    },
    // lesson-05
    {
        file: 'lesson-05.mdx',
        old: "Qual è il comando fondamentale per leggere la documentazione ufficiale di una funzione come `printf`?",
        new: "Se ti trovi su un server Linux senza accesso a internet e hai scordato l'ordine dei parametri di `printf`, quale comando da terminale ti salverà mostrandoti le istruzioni ufficiali?"
    },
    // lesson-06
    {
        file: 'lesson-06.mdx',
        old: "Come puoi 'accendere' una macro (es. DEBUG) direttamente dal comando di compilazione senza modificare il codice?",
        new: "Il tuo codice contiene blocchi `#ifdef DEBUG`. Quale argomento devi passare a `gcc` per compilare includendo quelle sezioni, definendo la macro direttamente da riga di comando?"
    },
    {
        file: 'lesson-06.mdx',
        old: "Quale comando Linux useresti per confrontare due file sorgente e vedere esattamente cosa è cambiato nella logica?",
        new: "Hai due versioni dello stesso sorgente C e vuoi stampare a video solo le righe che sono state modificate tra l'uno e l'altro. Quale classico programma UNIX usi?"
    },
    // lesson-08
    {
        file: 'lesson-08.mdx',
        old: "Vuoi modificare i parametri senza uscire dal terminale. Quale editor useresti (quello che inizia per 'n')?",
        new: "Sei connesso in SSH e devi fare una piccola modifica veloce a un parametro nel sorgente `life.c` senza usare interfacce grafiche. Quale editor di testo semplice e amichevole puoi lanciare dal terminale?"
    },
    // lesson-09
    {
        file: 'lesson-09.mdx',
        old: "Quale file virtuale nel filesystem `/proc` mostra come sono mappate le sezioni di memoria di un processo?",
        new: "Vuoi ispezionare gli indirizzi in cui sono stati caricati l'heap, lo stack e le librerie del tuo programma in esecuzione. Quale file all'interno di `/proc/self/` contiene questa tabella?"
    },
    // lesson-10
    {
        file: 'lesson-10.mdx',
        old: "Quale comando permette di abilitare la creazione dei file di 'core dump' (usando ulimit -c)?",
        new: "Il tuo programma va in Segmentation Fault ma scompare nel nulla. Per poter analizzare il crash post-mortem con GDB, devi rimuovere il limite alla dimensione dei file di dump. Qual è la parolina magica da passare a `ulimit -c`?"
    },
    // lesson-11
    {
        file: 'lesson-11.mdx',
        old: "Usa il comando `lscpu` e filtra l'output per vedere l'ordine dei byte del tuo processore.",
        new: "Esegui il comando utile per stampare le caratteristiche del processore e accoda un pipe per isolare solo la riga che parla di 'Byte Order'."
    },
    // lesson-12
    {
        file: 'lesson-12.mdx',
        old: "A volte vuoi testare cosa succede se `malloc` fallisce (restituendo NULL). Usa il comando bash che gestisce i limiti fisici per limitare la memoria virtuale del tuo processo a circa 10 Megabyte (10000 kb).",
        new: "Vuoi mettere sotto stress il tuo software e testare come gestisce l'esaurimento della RAM. Usa il builder della shell (`ulimit`) con il parametro per la memoria virtuale (`-v`) per restringere il limite a `10000` kb."
    },
    // lesson-13
    {
        file: 'lesson-13.mdx',
        old: "Quale opzione di `valgrind` useresti per vedere esattamente DOVE è stata allocata una memoria che stai cercando di liberare in modo errato?",
        new: "Un memory leak è difficile da tracciare se non sai chi ha originariamente richiesto quella memoria. Quale flag specifico di `valgrind` (da settare a `=yes`) forza il tracciamento dettagliato di chi ha chiamato la `malloc` iniziale?"
    },
    // lesson-15
    {
        file: 'lesson-15.mdx',
        old: "Prova ad usare il comando reale di Linux. Visualizza il contenuto di `/etc/passwd` al contrario.",
        new: "Nel corso abbiamo replicato artigianalmente un famoso programmino UNIX che legge i file e li stampa partendo dall'ultima riga. Invoca la versione originale del sistema operativo sul file `/etc/passwd`."
    },
    {
        file: 'lesson-15.mdx',
        old: "Compila il programma TAC e usa `valgrind` per verificare se hai liberato tutti i nodi della lista prima di uscire.",
        new: "Devi assicurarti che la tua implementazione di Liste Concatenate non abbia memory leaks. Quale profiler di memoria lanci davanti all'eseguibile `./tac file.txt` per analizzare il comportamento dell'heap?"
    },
    // lesson-16
    {
        file: 'lesson-16.mdx',
        old: "Usa `hexdump` sul tuo eseguibile (o un dump di memoria) per cercare la costante `0xDEADBEEF`. Quale comando useresti?",
        new: "Hai stampato il binario a video in formato hex usando `hexdump -C`. Ora vuoi filtrare l'output per trovare la riga esatta che contiene la parola magica `ef be ad de`. Quale utility UNIX usi in pipe per la ricerca?"
    },
    // lesson-18
    {
        file: 'lesson-18.mdx',
        old: "Senza scrivere codice C, usa il comando `wc` per contare quanti BYTE (non caratteri) ci sono nel file `save.dat`.",
        new: "Sappiamo quanti dati dovrebbe pesare un salvataggio della struct `Player`. Per confermarlo dalla shell usando `wc`, quale parametro passi per fargli contare la dimensione esatta in Bytes?"
    },
    {
        file: 'lesson-18.mdx',
        old: "Mentre il tuo programma C è in pausa dopo una `fopen`, quale comando Linux ti mostra l'elenco di tutti i file aperti dal processo?",
        new: "Sei un detective dei sistemi UNIX. Un processo sospetto sta leggendo dei dati: devi scoprire l'elenco esatto dei File Descriptors che sta tenendo attivi. Quale comando (List Open Files) lanci passandogli il flag `-p` e il PID?"
    },
    // lesson-19
    {
        file: 'lesson-19.mdx',
        old: "Usa il comando `man` per leggere la documentazione della syscall `read`. Specifica la sezione corretta.",
        new: "Stai cercando informazioni sulla primitiva del Kernel per leggere da un file descriptor. Se digiti solo il nome della funzione nel manuale, ti mostrerà il comando Bash omonimo. Come specifichi che vuoi leggere la 'Sezione 2' (quella delle chiamate di sistema)?"
    },
    {
        file: 'lesson-19.mdx',
        old: "Usa il comando `errno -l` (se installato) o cerca nel file header di sistema dove sono definiti i nomi degli errori.",
        new: "I nomi degli errori scaturiti dalle syscall (come 'Permission Denied') corrispondono a numeri gestiti dalla variabile `errno`. Quale comando puoi usare nella directory `/usr/include` flaggando la ricerca ricorsiva, per cercare il simbolo `EACCES`?"
    },
    // lesson-20
    {
        file: 'lesson-20.mdx',
        old: "Usa `strace` su un comando semplice come `cat` e osserva quante volte appare la chiamata `mmap`. Perché lo fa?",
        new: "Se ispezioni le chiamate di sistema eseguite all'avvio di un qualsiasi programma (es. `cat`), noterai che il caricatore del sistema operativo invoca molte volte una determinata syscall per allocare e mappare in memoria i file delle librerie condivise (`.so`). Di quale funzione parliamo?"
    },
    // lesson-21
    {
        file: 'lesson-21.mdx',
        old: "Qual è la macro di Redis famosa per usare i bitfield per gestire il Reference Counting e il tipo dell'oggetto?",
        new: "Se esamini il sorgente del noto database in-memory creato da Salvatore, troverai una struttura fondamentale altamente ottimizzata che utilizza i bitfield per ospitare il tipo, la codifica e il reference count nello spazio minimo possibile. Come si chiama il tipo di questo oggetto?"
    },
    {
        file: 'lesson-21.mdx',
        old: "Quale macro di Redis è famosa per usare i bitfield per gestire il Reference Counting e il tipo dell'oggetto?",
        new: "Se esamini il sorgente del noto database in-memory creato da Salvatore, troverai una struttura fondamentale altamente ottimizzata che utilizza i bitfield per ospitare il tipo, la codifica e il reference count nello spazio minimo possibile. Come si chiama il tipo di questo oggetto?"
    },
    // lesson-22
    {
        file: 'lesson-22.mdx',
        old: "Usa `objdump -d` per vedere il codice assembly di una funzione. Dove punta tecnicamente il puntatore a funzione?",
        new: "Quando disassembli un eseguibile, ogni funzione è contrassegnata da un'etichetta (es. `<main>:`). Quando passi in C l'indirizzo di una funzione come 'callback', verso quale elemento esatto della memoria della macchina statale punta tecnicamente quel valore?"
    },
    // lesson-23
    {
        file: 'lesson-23.mdx',
        old: "Dato il programma `10 20 SWAP -`, quale valore rimane nello stack alla fine? (SWAP scambia i due elementi in cima)",
        new: "Test mentale di logica RPN (Reverse Polish Notation): carichiamo i valori `10` e poi `20`. Invertiamo l'ordine dei primi due numeri in cima allo stack. Infine eseguiamo una sottrazione (il secondo meno il primo). Qual è il risultato netto?"
    },
    // lesson-24
    {
        file: 'lesson-24.mdx',
        old: "Analizza il programma `5 [ 10 + ] exec`. Quale valore finisce nello stack? (exec esegue la lista in cima)",
        new: "Esercizio mentale di valuzione funzionale: spingiamo `5` sulla pila, poi una 'lista' contenente i token `10` e `+`. Il comando `exec` estrae la lista in cima e la valuta nel contesto attuale. Quale sarà il valore finale rimasto sulla pila?"
    },
    // lesson-27
    {
        file: 'lesson-27.mdx',
        old: "Sostituisci i puntini: 'void (____ f)(int)' per dichiarare un puntatore a funzione.",
        new: "La sintassi in C per dichiarare una funzione che riceve a sua volta una funzione come parametro è leggendaria per la sua illeggibilità. Quale singolo carattere speciale devi inserire tra le parentesi tonde prima del nome dell'argomento `f` per indicare che non è un banale intero ma un *indirizzo* di funzione?"
    },
    // lesson-28
    {
        file: 'lesson-28.mdx',
        old: "Dichiara una variabile per gestire gli argomenti variabili: '_______ ap;'",
        new: "Nelle funzioni variadiche, il primo passo è preparare un puntatore speciale che terrà traccia dell'argomento corrente che si sta estraendo dalla pila (lo stack). Qual è il tipo di dato astratto da utilizzare per dichiarare questa variabile di navigazione?"
    },
    {
        file: 'lesson-28.mdx',
        old: "Quale funzione usi per stampare una va_list su stringa? 'vsn______'",
        new: "Vuoi scrivere il tuo personale wrapper per iniettare log e timestamp automaticamente, ma devi comunque supportare i classici parametri multipli (`%d`, `%s`, ecc.). A quale rinomata e sicura funzione della libreria standard passerai la tua `va_list` appena srotolata assieme al formato base?"
    },
    // lesson-29
    {
        file: 'lesson-29.mdx',
        old: "Il binario è aggiornato, ma vuoi forzare la ricompilazione. Quale comando cambia la data del file sorgente senza editarlo?",
        new: "Sei nello sviluppo iterativo: `make` rifiuta di ricompilare perché reputa che il file oggetto sia più recente del sorgente `toyfort.c`. Per ingannarlo aggiornando articialmente il timestamp di modifica del sorgente a 'ora' (senza aprirlo in nessun editor), quale iconico comando UNIX usi?"
    },
    // lesson-31
    {
        file: 'lesson-31.mdx',
        old: "Se la funzione prima iterava su W*H pixel, e ora su 8*8 pixel. Come si indica la nuova complessità temporale asintotica (Big-O) rispetto alla grandezza dell'immagine?",
        new: "Nel video è stata esposta la teoria dell'ottimizzazione del ricalcolo della mappa colore: l'algoritmo non deve più leggere l'intero schermo ad ogni ciclo, ma si confina in un raggio d'azione di entità fissa (la singola cella 8x8 alterata). In base all'analisi asintotica della complessità (Big-O), le prestazioni si dicono ora costanti, ovvero?"
    },
    {
        file: 'lesson-31.mdx',
        old: "Qual è il tool da riga di comando per macOS usato da Salvatore per fare profiling campionando lo stack?",
        new: "Durante la lezione, Salvatore ha mostrato come trovare il collo di bottiglia del programma eseguendo un campionamento statistico dello stack trace in tempo reale di un processo Mac OS attivo. Qual è il binario a riga di comando utilizzato per questa ispezione al volo?"
    },

    // special-bst
    {
        file: 'special-bst.mdx',
        old: "Albero con root=10. Inserisci 5 e 15. Dove finisce il 15?",
        new: "Prova mentale sull'algoritmo di Tree Traversal: partendo da una root vuota inserisci in ordine i numeri `10`, `5` e `15`. Rispetto al nodo principale `10`, qual è il ramo in cui è finito adagiato l'elemento `15` secondo la convenzione degli alberi binari di ricerca?"
    },
    
    // special-random-vars
    {
        file: 'special-random-vars.mdx',
        old: "Scrivi l'espressione per ottenere un numero casuale tra 0 e 99 (incluso).",
        new: "La funzione `rand()` ritorna un intero colossale. Quale operazione matematica scrivi in un'espressione C su una riga per 'schiacciare' costantemente l'uscita gigantesca di `rand()` restituendo solo valori compresi nel range da zero a novantanove limite massimo?"
    },

    // special-ref-counting
    {
        file: 'special-ref-counting.mdx',
        old: "Oggetto A creato (RC=1). Viene messo in una lista (RC=?). Poi la lista viene liberata. Qual è l'RC finale?",
        new: "Un oggetto viene allocato e restituito al chiamante (il suo 'reference count' o RC è 1 alla nascita). Esso viene inserito come elemento in un Array/Lista (l'Array ne acquisisce la possedienza e chiama la macro corretta). In un ciclo successivo, la Lista intera viene considerata inutile e svuotata o distrutta. A quanto ammonta l'RC esatto dell'oggetto figlio dopo queste traversie?"
    },
    {
        file: 'special-ref-counting.mdx',
        old: "In molti progetti C, 'retain' è una macro che chiama una funzione. Quale macro si usa spesso per incrementare?",
        new: "In moltissimi motori object-oriented costruiti in linguaggio puramente procedurale (come ad esempio in Python Core o altri interpreti citati), per dichiarare possesso di una stringa o risorsa se ne fa aumentare esplicitamente il contatore. Spesso questo si traduce in una chiamata a una specifica e diffusissima funzione o macro."
    }
];

function doReplacements() {
    let changedFiles = new Set();
    
    for (const r of replacements) {
        const filePath = path.join(contentDir, r.file);
        if (fs.existsSync(filePath)) {
            let content = fs.readFileSync(filePath, 'utf-8');
            if (content.includes(r.old)) {
                content = content.replace(r.old, r.new);
                fs.writeFileSync(filePath, content, 'utf-8');
                changedFiles.add(r.file);
                console.log(`Matched and replaced in ${r.file}`);
            } else {
                console.warn(`Could not find old string in ${r.file}: "${r.old.substring(0, 30)}..."`);
            }
        } else {
            console.error(`File not found: ${filePath}`);
        }
    }
    
    console.log(`\nModified ${changedFiles.size} files in total.`);
}

doReplacements();
