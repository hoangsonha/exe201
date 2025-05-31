import { createContext, useState, useContext } from 'react';
import { toast } from 'react-toastify';
import classNames from 'classnames/bind';
import styles from './Toast.module.scss';

const cx = classNames.bind(styles);

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    // const [toasts, setToasts] = useState([]);

    // const change = () => {
    //    // setToasts(...)
    // }

    const addToast = (message, success, fail) => {
        const classNames = cx({
            success,
            fail,
        });

        toast(<div className={classNames}>{message}</div>);
    };

    return <ToastContext.Provider value={{ addToast }}>{children}</ToastContext.Provider>;
};

export const useToast = () => useContext(ToastContext);
