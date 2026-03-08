#!/bin/bash
cd /home/clod/Desktop/c/transcriptions

# Remove potentially truncated json/txt for 23 and 24 to force re-transcription
rm -f raw/lesson-23.txt raw/lesson-23.json
rm -f raw/lesson-24.txt raw/lesson-24.json

# Run Python script
source .venv/bin/activate
python transcriber.py
