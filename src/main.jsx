import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import {store} from './rtk/store.js'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'



createRoot(document.getElementById('root')).render(
   <HelmetProvider>
   <BrowserRouter>
    <Provider store={store}>
    <App />
    </Provider>
   </BrowserRouter>
   </HelmetProvider>
)
