import React, { useEffect, useCallback, useState } from 'react';
import './App.scss';
import youtube from '../../apis/youtube';
import Axios from 'axios';

function App() {
  	const [captions, setCaptions] = useState([]);

 	const getCaptions = useCallback((lang, id) => {
		Axios.get(`http://video.google.com/timedtext?lang=${lang}&v=${id}`)
		.then(response => {			
			console.log(response.data);
			let parser = new DOMParser();
			let xmlDoc = parser.parseFromString(response.data,"text/xml");
			
			let captionsArray = xmlDoc.getElementsByTagName("text");
			console.log(captionsArray);
			let captionsArrayState = [];
			for (var caption of captionsArray) {
				// time -> converted to min (todo: improve transformation to ex. 2:32 instead)
				let time = (caption.getAttribute("start") / 60).toFixed(2) + " min";
				// inner text
				let text = caption.childNodes[0];        
				captionsArrayState.push({id: (time + lang), time: time, text: text});
			}
			setCaptions(captionsArrayState);
		})
	}, [])

	useEffect(() => {
		youtube.get('/captions', {
			params: {
				videoId: "1gYdJbCzrnY"
			}
		}).then(response => {
			console.log(response.data.items);
			getCaptions("en", "1gYdJbCzrnY");
			//response.data.items.forEach(item => getCaptions(item.id));
		})
		//getCaptions("en", "1gYdJbCzrnY");
		//getCaptions("it", "1gYdJbCzrnY");

	}, [getCaptions])

	return (
		<div className="App">
		<header className="App-header"></header>
		<main>
			{/* todo: improve iframe title */}
			<iframe id="ytplayer" type="text/html" title="youtube video" width="640" height="360" src="http://www.youtube.com/embed/1gYdJbCzrnY?autoplay=1&origin=http://example.com" frameBorder="0"/>
			<div className="captions">
			{captions.length !== 0 ? 
				captions.map(caption => {
					return <p key={caption.id}>{caption.time} {caption.text.textContent}</p>
				})
			: null}
			</div>
		</main>
		</div>
	);
}

export default App;
