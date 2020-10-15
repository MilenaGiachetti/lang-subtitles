import React from 'react';
import './App.scss';
//import youtube from '../../apis/youtube';
import Captions from '../../routes/Captions/Captions';

//http://video.google.com/timedtext?type=list&v={video_id} // get list caption
function App() {
	return (
		<div className="App">
			<header className="App-header"></header>
			<main>
				<Captions/>
			</main>
		</div>
	);
}

export default App;

