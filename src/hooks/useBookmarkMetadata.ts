import { create } from "zustand";
import { persist } from "zustand/middleware";

const LOCAL_STORAGE_KEY = "ph_metadata_bookmarks";

export enum MetadataStatus {
    PENDING = 'pending',
    ERROR = 'error',
    SUCCESS = 'success'
}

export type MetadataLocalStorageEntry = {
    id: string;
    title?: string,
    description?: string,
    type?: string,
    image?: string,
    favicon?: string,
    url?: string,
    lastEdited?: number,
    status: MetadataStatus
}

export type BookmarkMetadataStoreState = {
    bookmarksMetadata: MetadataLocalStorageEntry[],
    addBookmarksMetadata: (newData: MetadataLocalStorageEntry) => void,
    removeBookmarksMetadata: (id: string) => void,
    editBookmarkMetadata: (newData: MetadataLocalStorageEntry) => void,
}
export const useBookmarksMetadataStore = create<BookmarkMetadataStoreState>()(
    persist(
        (set) => ({
            bookmarksMetadata: [],
            addBookmarksMetadata: ({ description, id, image, title, type, url, status, favicon }) => set((state) => {
                if (!state.bookmarksMetadata.some(
                    (bookmark) => bookmark.id === id)
                ) {
                    return {
                        bookmarksMetadata: [
                            ...state.bookmarksMetadata,
                            {
                                description,
                                id,
                                image,
                                title,
                                type,
                                url,
                                favicon,
                                lastEdited: Date.now(),
                                status: status
                            }
                        ],
                    }
                }
                return state;
            }),
            removeBookmarksMetadata: (id) => set((state) => {
                const matchingBookmarkIndex = state.bookmarksMetadata.findIndex((bookmark) => bookmark.id === id);
                if (matchingBookmarkIndex > -1) {
                    return {
                        bookmarksMetadata: state.bookmarksMetadata?.toSpliced(matchingBookmarkIndex, 1)
                    };
                } else {
                    return state
                };
            }),
            editBookmarkMetadata: ({ description, id, image, title, type, url, status, favicon }) => {
                set((state) => {
                    const matchingBookmarkIndex = state.bookmarksMetadata.findIndex((bookmark) => bookmark.id === id);
                    if (matchingBookmarkIndex > -1) {
                        return {
                            bookmarksMetadata: state.bookmarksMetadata?.toSpliced(matchingBookmarkIndex, 1, {
                                description,
                                id,
                                image,
                                title,
                                type,
                                url,
                                favicon,
                                lastEdited: Date.now(),
                                status: status
                            })
                        };
                    } else {
                        return state
                    };
                })
            },
        }),
        {
            name: LOCAL_STORAGE_KEY,
        }
    )
)
