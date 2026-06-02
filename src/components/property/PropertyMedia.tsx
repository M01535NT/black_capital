import { VideoEmbed } from "@/components/public/video-embed";
import { TourEmbed } from "@/components/public/tour-embed";

/**
 * Conditionally renders the video + virtual tour embeds. Renders nothing if both are empty.
 */
export function PropertyMedia({
    videoUrls,
    tourEmbeds,
}: {
    videoUrls: string[] | null;
    tourEmbeds: string[] | null;
}) {
    if (!videoUrls?.length && !tourEmbeds?.length) return null;

    return (
        <div className="space-y-8 md:space-y-10">
            <VideoEmbed urls={videoUrls || []} />
            <TourEmbed urls={tourEmbeds || []} />
        </div>
    );
}
