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
    print(f"Loading Whisper tiny on CPU...")
    model = whisper.load_model("tiny", device="cpu")
    
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
    lessons = [
        {"url": "https://www.youtube.com/watch?v=HjXBXBgfKyk", "id": "lesson-01"},
        {"url": "https://www.youtube.com/watch?v=Z84vlG1RRtg", "id": "lesson-02"},
        {"url": "https://www.youtube.com/watch?v=r6mU_IHXEps", "id": "lesson-02-appendix"},
        {"url": "https://www.youtube.com/watch?v=mw4gUqsGPZw", "id": "lesson-03"},
        {"url": "https://www.youtube.com/watch?v=YNsXyasn4R4", "id": "lesson-04"},
        {"url": "https://www.youtube.com/watch?v=SWWHqgSwQFw", "id": "lesson-05"},
        {"url": "https://www.youtube.com/watch?v=lc7aYXNl1T8", "id": "lesson-06"},
        {"url": "https://www.youtube.com/watch?v=HCRthhjbfAg", "id": "lesson-07"},
        {"url": "https://www.youtube.com/watch?v=c5atNuYdKK8", "id": "lesson-08"},
        {"url": "https://www.youtube.com/watch?v=BBgZs-jd_QY", "id": "lesson-09"},
        {"url": "https://www.youtube.com/watch?v=lc7hL9Wt-ho", "id": "lesson-10"},
        {"url": "https://www.youtube.com/watch?v=msGzuneFpDU", "id": "lesson-11"},
        {"url": "https://www.youtube.com/watch?v=ZkaKwWXJXs8", "id": "lesson-12"},
        {"url": "https://www.youtube.com/watch?v=9AhaOdEBmPc", "id": "lesson-13"},
        {"url": "https://www.youtube.com/watch?v=p4IMHau2lq8", "id": "lesson-14"},
        {"url": "https://www.youtube.com/watch?v=aTT2W5NACEY", "id": "lesson-15"},
        {"url": "https://www.youtube.com/watch?v=VPs_QtlLNcs", "id": "lesson-16"},
        {"url": "https://www.youtube.com/watch?v=grkIJjw6o18", "id": "lesson-17"},
        {"url": "https://www.youtube.com/watch?v=soiBgJjAmP8", "id": "lesson-special-algorithm"},
        {"url": "https://www.youtube.com/watch?v=HzBqda0Jg3E", "id": "lesson-random-vars"},
        {"url": "https://www.youtube.com/watch?v=3w73xjUSUEU", "id": "lesson-18"},
        {"url": "https://www.youtube.com/watch?v=QWLJ7CBAu_I", "id": "lesson-19"},
        {"url": "https://www.youtube.com/watch?v=yKavhObop5I", "id": "lesson-20"},
        {"url": "https://www.youtube.com/watch?v=TM4jgODgdFY", "id": "lesson-21"},
        {"url": "https://www.youtube.com/watch?v=OIseV5lcx8w", "id": "lesson-22"},
        {"url": "https://www.youtube.com/watch?v=vYODKK8TQGE", "id": "lesson-23"},
        {"url": "https://www.youtube.com/watch?v=-QxrmHo-V7Y", "id": "lesson-24"},
        {"url": "https://www.youtube.com/watch?v=-1ZhCgaIPOk", "id": "lesson-25"},
        {"url": "https://www.youtube.com/watch?v=oMj3N6jYIUU", "id": "lesson-26"},
        {"url": "https://www.youtube.com/watch?v=C4AHEK3fSjg", "id": "lesson-27"},
        {"url": "https://www.youtube.com/watch?v=QdZc1JV_oCw", "id": "lesson-ref-counting"},
        {"url": "https://www.youtube.com/watch?v=cvWbCx0lLjs", "id": "lesson-28"},
        {"url": "https://www.youtube.com/watch?v=nHzlRqPnlrE", "id": "lesson-29"},
        {"url": "https://www.youtube.com/watch?v=D1U3uCe-kok", "id": "lesson-30"},
        {"url": "https://www.youtube.com/watch?v=fZmdsh0gQig", "id": "lesson-31"}
    ]
    
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    output_dir = os.path.join(base_dir, "transcriptions", "raw")
    os.makedirs(output_dir, exist_ok=True)
    
    for lesson in lessons:
        url = lesson["url"]
        video_id = lesson["id"]
        
        target_mp3 = os.path.join(output_dir, f"{video_id}.mp3")
        target_base = os.path.join(output_dir, video_id)
        
        # Check if transcription already exists
        if os.path.exists(target_base + ".txt"):
            print(f"Skipping {video_id}, transcription already exists.")
            continue
            
        # Check if download is needed
        if not os.path.exists(target_mp3):
            download_audio(url, target_base) # yt-dlp adds .mp3
        
        if os.path.exists(target_mp3):
            transcribe_lesson(target_mp3, target_base)
        else:
            print(f"Error: MP3 file for {video_id} not found after download attempt.")
