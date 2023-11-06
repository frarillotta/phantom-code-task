'use client';

import { BookmarkList } from '~/components/BookmarkList/BookmarkList';
import styles from './page.module.css'
import { BookmarkForm, BookmarkFormProps } from '~/components/BookmarkForm/BookmarkForm';
import { useBookmarksStore } from '~/hooks/useBookmarksStore';

export default function Home() {
  const { addBookmark } = useBookmarksStore();
  const onSubmit: BookmarkFormProps['onSubmit'] = ({ name, url }) => {
    if (url) {
      addBookmark({ name, url })
    }
  }

  return (
    <main className={styles.main}>
      <div className={styles.submitContainer}>
        <BookmarkForm onSubmit={onSubmit}>
          <BookmarkForm.NameInput />
          <BookmarkForm.URLInput />
          <BookmarkForm.SubmitButton className={styles.submitButton}><span>Add bookmark</span></BookmarkForm.SubmitButton>
        </BookmarkForm>
      </div>
      <BookmarkList />
    </main>
  )
}
