import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'


/*to render the app component that we have created in the app.jsx*/
/*this will show the content in the app.jsx where we return*/
ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
)