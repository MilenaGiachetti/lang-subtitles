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

//http://video.google.com/timedtext?type=list&v={video_id} // get list caption
function App() {
	const [captions, setCaptions] = useState([]);
	const [nativeBlur, setNativeBlur] = useState(false);
	const [targetBlur, setTargetBlur] = useState(false);
	  
 	const getCaptions = useCallback((target, native, id) => {
		const targetCaptionsRequest = Axios.get(`http://video.google.com/timedtext?lang=${target}&v=${id}`);
		const nativeCaptionsRequest = Axios.get(`http://video.google.com/timedtext?lang=${native}&v=${id}`);

		Axios.all([targetCaptionsRequest, nativeCaptionsRequest]).then(Axios.spread((...responses) => {
			const [targetCaptionsRequest, nativeCaptionsRequest] = responses;

			let parser = new DOMParser();
			let targetCaptionsParsed = parser.parseFromString(targetCaptionsRequest.data,"text/xml").getElementsByTagName("text");
			let nativeCaptionsParsed = parser.parseFromString(nativeCaptionsRequest.data,"text/xml").getElementsByTagName("text");
			
			let targetCaptionsArray = [];
			let nativeCaptionsArray = [];
			
			for (let i = 0; i < targetCaptionsParsed.length; i++){
				// time -> converted to min (todo: improve transformation to ex. 2:32 instead)
				let timeInSecs = Math.floor(targetCaptionsParsed[i].getAttribute("start"));
				let time = `${Math.floor((timeInSecs/60))}:${(timeInSecs%60) > 9 ? (timeInSecs%60) : "0" + (timeInSecs%60)}`;
				// inner text
				let targetText =  targetCaptionsParsed[i] ? targetCaptionsParsed[i].childNodes[0].textContent.replace(/&#?\w+;/g, match => entities[match]) : null;       

				targetCaptionsArray.push({id: (time), time: time, targetText: targetText});
			}
			for (let i = 0; i < nativeCaptionsParsed.length; i++){
				// time -> converted to min (todo: improve transformation to ex. 2:32 instead)
				let timeInSecs = Math.floor(nativeCaptionsParsed[i].getAttribute("start"));
				let time = `${Math.floor((timeInSecs/60))}:${(timeInSecs%60) > 9 ? (timeInSecs%60) : "0" + (timeInSecs%60)}`;
				// inner text
				let nativeText =  nativeCaptionsParsed[i] ? nativeCaptionsParsed[i].childNodes[0].textContent.replace(/&#?\w+;/g, match => entities[match]) : null;       

				nativeCaptionsArray.push({id: (time), time: time, nativeText: nativeText});
			}

			const map = new Map();
			targetCaptionsArray.forEach(item => map.set(item.id, item));
			nativeCaptionsArray.forEach(item => map.set(item.id, {...map.get(item.id), ...item}));
			const mergedArr = Array.from(map.values());

			const exceptions = (firstArray, secondArray) => {
				return firstArray.filter(firstArrayItem =>
				  !secondArray.some(
					secondArrayItem => firstArrayItem.id === secondArrayItem.id
				  )
				);
			  };
			  console.log(exceptions(nativeCaptionsArray, targetCaptionsArray))
			setCaptions(mergedArr);
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

	const toggleBlur = (event) => {
		console.log(event.target.value);
		if (event.target.value === "blur-native") {
			setNativeBlur(prevState => !prevState);
		} else {
			setTargetBlur(prevState => !prevState);
		}
	}

	return (
		<div className="App">
		<header className="App-header"></header>
		<main>
			{/* todo: improve iframe title */}
			<iframe id="ytplayer" type="text/html" title="youtube video" width="640" height="360" src="http://www.youtube.com/embed/Ux8s1YmUI2g?autoplay=1&origin=http://example.com" frameBorder="0"/>
			<div >
				<input type="checkbox" value="blur-native" id="blur-native" onChange={toggleBlur}/>
				<label htmlFor="blur-native">Hide text in native language</label>
				<input type="checkbox" value="blur-target" id="blur-target" onChange={toggleBlur}/>
				<label htmlFor="blur-target">Hide text in target language</label>
			</div>
			<div className="captions">
			{captions.length !== 0 ? 
				captions.map(caption => {
					return (
						<div className="caption" key={caption.id}>
							<p className="caption-time">{caption.time}</p>
							<p className={targetBlur ? "caption-target caption-blur" : "caption-target"}>{caption.targetText}</p>
							<p className={nativeBlur ? "caption-native caption-blur" : "caption-native"}>{caption.nativeText}</p>
						</div>
					)
				})
			: null}
			</div>
		</main>
		</div>
	);
}

export default App;

