import React, { createContext, useCallback, useContext, useState } from "react";
import styles from './BookmarkForm.module.css';

enum VALIDATION_ERRORS {
    InvalidUrl = "Please submit a valid URL",
    Empty = "Please fill in"
}

const FormContext = createContext<{ urlError: VALIDATION_ERRORS | null }>({ urlError: null })

export type BookmarkFormProps = {
    onSubmit?: (formData: { name: string, url: string }) => void;
    name?: string;
    url?: string;
    children: React.ReactNode;
}
interface BookmarkComponent extends React.FC<BookmarkFormProps> {
    NameInput: React.FC<NameInputProps>;
    URLInput: React.FC<URLInputProps>;
    SubmitButton: React.FC<SubmitButtonProps>
}
export const BookmarkForm: BookmarkComponent = ({ onSubmit, children }) => {

    const [formStatus, setFormStatus] = useState<{
        urlError: VALIDATION_ERRORS | null
    }>({
        urlError: null
    });

    const validateUrl = useCallback((url: FormDataEntryValue | null): url is string => {
        let urlError = null;
        const validateLength = (nameOrURL: string) => nameOrURL.length > 0;

        if (typeof url === 'string') {
            if (!validateLength(url)) {
                urlError = VALIDATION_ERRORS['Empty'];
            } else {
                try {
                    const parsedURL = new URL(url);
                    if (!parsedURL.hostname) {
                        urlError = VALIDATION_ERRORS['InvalidUrl'];
                    }
                } catch (e) {
                    urlError = VALIDATION_ERRORS['InvalidUrl'];
                }
            }
        }
        setFormStatus({ urlError });
        return !Boolean(urlError)
    }, []);

    const formAction = useCallback((event: FormData) => {
        const url = event.get('url');
        const name = event.get('name') as string || ''
        if (validateUrl(url)) {
            onSubmit?.({
                name,
                url
            })
        }
    }, [onSubmit, validateUrl]);

    return <FormContext.Provider value={formStatus}>
        <form className={styles.form} action={formAction}>
            {children}
        </form>
    </FormContext.Provider>
}

type NameInputProps = {
    className?: string;
    name?: string;
    withLabel?: boolean;
}
const NameInput: BookmarkComponent['NameInput'] = ({ name, withLabel = true, className }) => {
    return <div className={`${styles.inputWrapper} ${className}`}>
        {withLabel && <label htmlFor="nameInput">Enter a name:</label>}
        <input className={styles.input} id="nameInput" name="name" type="text" defaultValue={name} />
    </div>
}
type URLInputProps = {
    className?: string;
    url?: string;
    withLabel?: boolean;
}
const URLInput: BookmarkComponent['URLInput'] = ({ url, withLabel = true, className }) => {
    const { urlError } = useContext(FormContext);

    return <div className={`${styles.inputWrapper} ${className}`}>
        {withLabel && <label htmlFor="urlInput">Enter a URL:</label>}
        <input className={urlError ? styles.errorInput : styles.input} id="urlInput" name="url" type="text" defaultValue={url} />
        {urlError && <div className={styles.error}>
            {urlError}
        </div>}
    </div>
}
type SubmitButtonProps = {
    children?: React.ReactNode;
    className?: string;
}
const SubmitButton: BookmarkComponent['SubmitButton'] = ({ children = "Submit", className }) => {
    return <button className={className} type="submit" >{children}</button>
}

BookmarkForm.NameInput = NameInput;
BookmarkForm.URLInput = URLInput;
BookmarkForm.SubmitButton = SubmitButton;
