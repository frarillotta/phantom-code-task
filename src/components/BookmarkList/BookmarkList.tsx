import { useBookmarksStore } from "~/hooks/useBookmarksStore";
import { Bookmark } from "../Bookmark/Bookmark";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import styles from './BookmarkList.module.css'
import { ChevronLeft, ChevronRight } from "react-feather";
import { Variants, motion } from "framer-motion";

const bookmarkListVariants: Variants = {
    show: {
        transition: {
            staggerChildren: 0.25,
            bounce: 0
        }
    }
}

const BOOKMARKS_LIST_LENGTH = 10;
export const BookmarkList = () => {
    const { bookmarks } = useBookmarksStore();
    const [activePage, setActivePage] = useState(1);

    // Waiting for nextJS hydration to be completed
    const [isHydrated, setIsHydrated] = useState(false);
    // Very much not a big fan of this but unfortunately zustand persist doesn't work very well
    // with react hydration https://github.com/pmndrs/zustand/issues/1145
    useEffect(() => {
        setIsHydrated(true);
    }, []);
    const numberOfPages = Math.ceil(bookmarks.length / BOOKMARKS_LIST_LENGTH);

    return <article className={styles.boomkarkListWrapper}>{isHydrated &&
        <>
            {<motion.ul
                initial="hidden"
                animate="show"
                exit="exit"
                variants={bookmarkListVariants}
                className={styles.bookmarkList}
            >
                {
                    bookmarks.slice((activePage - 1) * BOOKMARKS_LIST_LENGTH, activePage * BOOKMARKS_LIST_LENGTH).map(({ id, lastEdited, name, url }) =>
                        <Bookmark
                            key={id}
                            lastEdited={lastEdited}
                            id={id}
                            name={name}
                            url={url}
                        />
                    )
                }
            </motion.ul>}
            <div className={styles.paginationWrapper}>
                <ChevronLeft onClick={() => {
                    setActivePage(Math.max(activePage - 1, 1))
                }} />
                {new Array(numberOfPages).fill(null).map(
                    (_, pageNumber) =>
                        <PageNumber
                            setActivePage={setActivePage}
                            pageNumber={pageNumber + 1}
                            key={`page${pageNumber}`}
                            isActive={(pageNumber + 1) === activePage}
                        />
                )}
                <ChevronRight onClick={() => {
                    setActivePage(Math.min(activePage + 1, numberOfPages))
                }} />
            </div>
        </>}
    </article>
};

const PageNumber: React.FC<{
    pageNumber: number,
    setActivePage: Dispatch<SetStateAction<number>>,
    className?: string,
    isActive: boolean,
}> = ({ pageNumber, setActivePage, className, isActive }) =>
        <div
            className={`${className} ${styles.paginationNumber}`}
            onClick={() => setActivePage(pageNumber)}
        >
            {pageNumber}
            {isActive && <motion.span
                layoutId={'activePageNumbers'}
                className={styles.paginationNumberCircle}
            />}
        </div>

