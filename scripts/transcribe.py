import whisper
import yt_dlp
import json
import os
import sys

def download_audio(video_url, output_path):
    print(f"Downloading {video_url}...")
    ydl_opts = {
        'format': 'bestaudio/best',
        'postprocessors': [{'key': 'FFmpegExtractAudio', 'preferredcodec': 'mp3'}],
        'outtmpl': output_path,
        'quiet': False
    }
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([video_url])
    print("Download complete.")

def transcribe_lesson(audio_path, output_path):
    print(f"Loading Whisper small on GPU...")
    model = whisper.load_model("small", device="cuda")
    
    print(f"Transcribing {audio_path}...")
    result = model.transcribe(
        audio_path,
        language="it",
        task="transcribe",
        verbose=True,
        word_timestamps=True,
        fp16=False, # Fix for GTX 1650 NaN logits
    )
    
    # Save raw text
    text_path = output_path + ".txt"
    with open(text_path, "w", encoding="utf-8") as f:
        f.write(result["text"])
    
    # Save json with timestamps
    json_path = output_path + ".json"
    with open(json_path, "w", encoding="utf-8") as f:
        segments = [{"start": s["start"], "end": s["end"], "text": s["text"]} 
                    for s in result["segments"]]
        json.dump(segments, f, indent=2, ensure_ascii=False)
        
    print(f"Transcription saved to {text_path} and {json_path}")
    return result["text"]

if __name__ == "__main__":
    url = "https://www.youtube.com/watch?v=HjXBXBgfKyk"
    video_id = "lesson-01"
    
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    target_mp3 = os.path.join(base_dir, "transcriptions", "raw", f"{video_id}.mp3")
    target_base = os.path.join(base_dir, "transcriptions", "raw", video_id)
    
    # Check if download is needed
    if not os.path.exists(target_mp3):
        download_audio(url, target_base) # yt-dlp adds .mp3
    
    if os.path.exists(target_mp3):
        transcribe_lesson(target_mp3, target_base)
    else:
        print("Error: MP3 file not found after download attempt.")
        sys.exit(1)
