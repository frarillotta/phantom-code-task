import { CheckCircle, Circle, Edit, Trash, XCircle } from "react-feather"
import { LocalStorageEntry, useBookmarksStore } from "~/hooks/useBookmarksStore"
import styles from './Bookmark.module.css';
import dayjs from "dayjs";
import { MetadataLocalStorageEntry, MetadataStatus, useBookmarksMetadataStore } from "~/hooks/useBookmarkMetadata";
import { useEffect, useMemo, useState } from "react";
import { fetchOpengraph } from "~/utils/fetchOpengraph";
import { BookmarkForm } from "../BookmarkForm/BookmarkForm";
import { motion } from "framer-motion";

const bookmarkVariants = {
    hidden: { opacity: 0, x: 50 },
    show: { 
        opacity: 1, 
        x: 0, 
        transition: {
            bounce: 0
        } 
    },
    exit: { opacity: 0 }
}

const DAYS_LIMIT = 7;
const useBookmarkMetadata = (id: string, url: string, lastEdited: number): MetadataLocalStorageEntry | undefined => {

    const { addBookmarksMetadata, bookmarksMetadata, editBookmarkMetadata } = useBookmarksMetadataStore();
    useEffect(() => {
        const updateData = () => {
            // set the status to be pending
            editBookmarkMetadata({ id, url, status: MetadataStatus.PENDING })
            // fetch data, then update
            fetchOpengraph(url).then((openGraphData) => {
                editBookmarkMetadata({ ...openGraphData, id, url })
            });
        }
        const matchingMetadataStoreValue = bookmarksMetadata.find((meta) => meta.id === id)
        // if it doesn't have a matching metadata store id, then we add it to the metadata store
        if (!matchingMetadataStoreValue) {
            fetchOpengraph(url).then((openGraphData) => {
                addBookmarksMetadata({ ...openGraphData, id, url })
            });
        }
        // renew every 7 days
        if (lastEdited && dayjs().diff(dayjs(lastEdited), 'days') > DAYS_LIMIT) {
            updateData()
        }
        // if the URL has been modified and doesn't match the one we have in both stores, we invalidate the metadata entry
        if (matchingMetadataStoreValue && matchingMetadataStoreValue.url !== url) {
            updateData()
        }
    }, [addBookmarksMetadata, bookmarksMetadata, editBookmarkMetadata, id, lastEdited, url]);

    return useMemo(() =>
        bookmarksMetadata.find((meta) =>
            meta.id === id)
        , [bookmarksMetadata, id]);
}

type StatusCheckProps = {
    status: MetadataStatus | undefined;
    className?: string;
}
const StatusCheck: React.FC<StatusCheckProps> = ({ status, className }) => {
    switch (status) {
        case MetadataStatus.ERROR:
            return <XCircle className={`${styles.crossCircle} ${className}`} />
        case MetadataStatus.SUCCESS:
            return <CheckCircle className={`${styles.checkCirle} ${className}`} />
        default:
            return <Circle className={`${styles.pendingCircle} ${className}`}></Circle>
    }
}

export type BookmarkProps = LocalStorageEntry
export const Bookmark: React.FC<BookmarkProps> = ({ id, lastEdited, name, url }) => {
    const [isInEditMode, setEditMode] = useState(false);

    const metadata = useBookmarkMetadata(id, url, lastEdited);
    const { removeBookmark, editBookmark } = useBookmarksStore();
    const { removeBookmarksMetadata } = useBookmarksMetadataStore();
    return <motion.li
        variants={bookmarkVariants}
        className={styles.bookmarkWrapper}
    >
        <div className={styles.metadataFaviconWrapper}>
            {metadata?.favicon && <img
                src={metadata?.favicon}
                alt={'metadata favicon'}
                className={styles.metadataFavicon}
            />}
        </div>
        {isInEditMode ?
            <BookmarkForm onSubmit={({ name, url }) => {
                editBookmark({
                    name, url, id
                })
                setEditMode(false)
            }}>
                <BookmarkForm.NameInput className={styles.name} withLabel={false} name={name} />
                <BookmarkForm.URLInput className={styles.url} withLabel={false} url={url} />
                <BookmarkForm.SubmitButton className={styles.submitButton}>
                    <span><span>Edit</span></span>
                </BookmarkForm.SubmitButton>
            </BookmarkForm> :
            <>
                <h3 className={styles.name}>{name}</h3>
                <a target="_blank" className={styles.url}>{url}</a>
                <div className={styles.statusCheck} ><StatusCheck status={metadata?.status} /></div>
            </>
        }
        <h5 className={styles.metadataTitle}>{metadata?.title}</h5>
        <div className={styles.actionButtonsWrapper}>
            <Edit className={styles.actionButton} onClick={(() => {
                setEditMode(!isInEditMode)
            })} />
            <Trash className={styles.actionButton} onClick={() => {
                removeBookmark(id);
                removeBookmarksMetadata(id)
            }} />
        </div>
    </motion.li>
}
