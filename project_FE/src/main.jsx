import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import GlobalStyles from './component/GlobalStyles'
import { ToastProvider } from './component/Toast/index.jsx';
import { Bounce, ToastContainer } from 'react-toastify';

createRoot(document.getElementById('root')).render(
    <GlobalStyles>
        <ToastProvider>
            <App />
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                    transition={Bounce}
                />
        </ToastProvider>
    </GlobalStyles>
);