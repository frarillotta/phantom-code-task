import { v4 as uuidv4 } from 'uuid';
import { create } from "zustand";
import { persist } from "zustand/middleware";

const LOCAL_STORAGE_KEY = "ph_bookmarks";

export type LocalStorageEntry = {
    id: string;
    name: string;
    url: string;
    lastEdited: number;
}
type BookmarkStoreState = {
    bookmarks: LocalStorageEntry[] | never[],
    addBookmark: (newData: { name: string, url: string }) => void,
    editBookmark: (newData: { name: string, url: string, id: string }) => void,
    removeBookmark: (id: string) => void
}
export const useBookmarksStore = create<BookmarkStoreState>()(
    persist(
        (set) => ({
            bookmarks: [],
            addBookmark: ({ name, url }) => set((state) => {
                // only return if a bookmark is not already defined with the same name and url
                if (!state.bookmarks.some(
                    (bookmark) =>
                        bookmark.name === name && bookmark.url === url)
                ) {
                    return {
                        bookmarks: [
                            {
                                id: uuidv4(),
                                lastEdited: Date.now(),
                                name,
                                url,
                            },
                            ...state.bookmarks
                        ],
                    }
                }
                return state;
            }),
            editBookmark: ({ id, name, url }) => {
                set((state) => {
                    const matchingBookmarkIndex = state.bookmarks.findIndex(
                        (bookmark) => bookmark.id === id
                    );
                    // only edit if the entry already exists in our store and the new values are not like any existing ones
                    if (matchingBookmarkIndex > -1 && !state.bookmarks.some(
                        (bookmark) =>
                            bookmark.name === name && bookmark.url === url)
                    ) {
                        return {
                            bookmarks: state.bookmarks?.toSpliced(matchingBookmarkIndex, 1, {
                                id,
                                lastEdited: Date.now(),
                                name,
                                url
                            })
                        };
                    } else {
                        return state
                    };
                })
            },
            removeBookmark: (id) => {
                set((state) => {
                    const matchingBookmarkIndex = state.bookmarks.findIndex(
                        (bookmark) => bookmark.id === id
                    );
                    if (matchingBookmarkIndex > -1) {
                        return {
                            bookmarks: state.bookmarks?.toSpliced(matchingBookmarkIndex, 1)
                        };
                    } else {
                        return state
                    };
                })
            }
        }),
        {
            name: LOCAL_STORAGE_KEY,
        }
    )
)
