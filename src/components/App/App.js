import React, { useEffect, useCallback, useState } from 'react';
import './App.scss';
//import youtube from '../../apis/youtube';
import Axios from 'axios';

const entities = {
	'&#039;': "'",
	'&quot;': '"',
	'&#39;': "'",
	// add the ones in htmlEntities if needed if needed
};
function App() {
	const [captions, setCaptions] = useState([]);
	  

 	const getCaptions = useCallback((target, native, id) => {
		const targetCaptionsRequest = Axios.get(`http://video.google.com/timedtext?lang=${target}&v=${id}`);
		const nativeCaptionsRequest = Axios.get(`http://video.google.com/timedtext?lang=${native}&v=${id}`);

		Axios.all([targetCaptionsRequest, nativeCaptionsRequest]).then(Axios.spread((...responses) => {
			const [targetCaptionsRequest, nativeCaptionsRequest] = responses;

			let parser = new DOMParser();
			let targetCaptionsParsed = parser.parseFromString(targetCaptionsRequest.data,"text/xml");
			let nativeCaptionsParsed = parser.parseFromString(nativeCaptionsRequest.data,"text/xml");
			
			let targetCaptionsArray = targetCaptionsParsed.getElementsByTagName("text");
			let nativeCaptionsArray = nativeCaptionsParsed.getElementsByTagName("text");


			let captionsArrayState = [];
			for (let i = 0; i < targetCaptionsArray.length; i++){
				// time -> converted to min (todo: improve transformation to ex. 2:32 instead)
				let timeInSecs = Math.floor(targetCaptionsArray[i].getAttribute("start"));
				let time = `${Math.floor((timeInSecs/60))}:${(timeInSecs%60) > 9 ? (timeInSecs%60) : "0" + (timeInSecs%60)}`;
				// inner text
				let targetText =  targetCaptionsArray[i] ? targetCaptionsArray[i].childNodes[0].textContent.replace(/&#?\w+;/g, match => entities[match]) : null;       
				let nativeText = nativeCaptionsArray[i] ? nativeCaptionsArray[i].childNodes[0].textContent.replace(/&#?\w+;/g, match => entities[match]) : "";  
				//console.log(targetText); 
				console.log(timeInSecs);

				captionsArrayState.push({id: (time), time: time, targetText: targetText, nativeText: nativeText});
			}
			// for (let caption of targetCaptionsArray) {
			// 	// time -> converted to min (todo: improve transformation to ex. 2:32 instead)
			// 	let time = (caption.getAttribute("start") / 60).toFixed(2) + " min";
			// 	// inner text
			// 	let text = caption.childNodes[0];        
			// 	captionsArrayState.push({id: (time), time: time, targetText: text});
			// }

			setCaptions(captionsArrayState);
		  })).catch(error => {
			console.log(error);
		  })
	}, [])

	useEffect(() => {
		// youtube.get('/captions', {
		// 	params: {
		// 		videoId: "TiSM8AEkuJA"
		// 	}
		// }).then(response => {
		// 	console.log(response.data.items);
		// 	getCaptions("en", "TiSM8AEkuJA");
		// 	//response.data.items.forEach(item => getCaptions(item.id));
		// })
		// getCaptions("en", "TiSM8AEkuJA", true);
		getCaptions("ko", "en", "Ux8s1YmUI2g");
	}, [getCaptions])

	return (
		<div className="App">
		<header className="App-header"></header>
		<main>
			{/* todo: improve iframe title */}
			<iframe id="ytplayer" type="text/html" title="youtube video" width="640" height="360" src="http://www.youtube.com/embed/Ux8s1YmUI2g?autoplay=1&origin=http://example.com" frameBorder="0"/>
			<div className="captions">
			{captions.length !== 0 ? 
				captions.map(caption => {
					return <p key={caption.id}>{caption.time} {caption.targetText} <br/> {caption.nativeText}</p>
				})
			: null}
			</div>
		</main>
		</div>
	);
}

export default App;
