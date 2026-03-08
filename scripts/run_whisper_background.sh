#!/bin/bash
cd "$(dirname "$0")/.."

echo "Avvio della trascrizione in background..."
echo "Lo script salterà in automatico le lezioni già trascritte (fino alla 22)."
echo "Inizierà dalla Lezione 23 in poi."

nohup venv/bin/python3 scripts/transcribe.py > transcriptions/background_whisper.log 2>&1 &

echo ""
echo "Whisper è stato lanciato in background!"
echo "Puoi seguire il progresso con questo comando:"
echo "tail -f transcriptions/background_whisper.log"
