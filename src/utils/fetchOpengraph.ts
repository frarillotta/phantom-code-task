import { MetadataLocalStorageEntry, MetadataStatus } from "~/hooks/useBookmarkMetadata";
import { OpenGraphAPIKey } from "./constants";

const getUrl = (url: string) => `https://opengraph.io/api/1.1/site/${encodeURIComponent(url)}?app_id=${OpenGraphAPIKey}`;

export const fetchOpengraph = async (url: string) => {
    try {
        const response = await fetch(getUrl(url));
        const data = await response.json();
        if (data?.htmlInferred?.error || data?.error) {
            return {
                status: MetadataStatus.ERROR
            }
        }
        return {...(data?.htmlInferred || data?.hybridGraph), status: MetadataStatus.SUCCESS} as MetadataLocalStorageEntry;
    } catch (error) {
        return {
            status: MetadataStatus.ERROR
        }
    }
}
