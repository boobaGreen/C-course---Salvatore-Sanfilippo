interface VideoEmbedProps {
    videoId: string;
    title?: string;
}

export default function VideoEmbed({ videoId, title = "YouTube Video" }: VideoEmbedProps) {
    return (
        <div className="my-8 rounded-lg overflow-hidden border border-border-color shadow-sm bg-black aspect-video relative">
            <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={`https://www.youtube-nocookie.com/embed/${videoId}`}
                title={title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            />
        </div>
    );
}
