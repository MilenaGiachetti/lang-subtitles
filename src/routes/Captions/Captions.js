import React, { useEffect, useCallback, useState, Fragment } from 'react';
import classes from './Captions.module.scss';
//import youtube from '../../apis/youtube';
import Axios from 'axios';

const entities = {
	'&#039;': "'",
	'&quot;': '"',
	'&#39;': "'",
	// add the ones in htmlEntities if needed if needed
};

//http://video.google.com/timedtext?type=list&v={video_id} // get list caption
function Captions(props) {
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

				targetCaptionsArray.push({time: time, targetText: targetText, timeInSecs: timeInSecs});
			}
			for (let i = 0; i < nativeCaptionsParsed.length; i++){
				// time -> converted to min (todo: improve transformation to ex. 2:32 instead)
				let timeInSecs = Math.floor(nativeCaptionsParsed[i].getAttribute("start"));
				let time = `${Math.floor((timeInSecs/60))}:${(timeInSecs%60) > 9 ? (timeInSecs%60) : "0" + (timeInSecs%60)}`;
				// inner text
				let nativeText =  nativeCaptionsParsed[i] ? nativeCaptionsParsed[i].childNodes[0].textContent.replace(/&#?\w+;/g, match => entities[match]) : null;       

				nativeCaptionsArray.push({time: time, nativeText: nativeText});
			}

			const map = new Map();
			targetCaptionsArray.forEach(item => map.set(item.time, item));
			nativeCaptionsArray.forEach(item => map.set(item.time, {...map.get(item.time), ...item}));
			const mergedArr = Array.from(map.values());

			const exceptions = (firstArray, secondArray) => {
				return firstArray.filter(firstArrayItem =>
				  !secondArray.some(
					secondArrayItem => firstArrayItem.time === secondArrayItem.time
				  )
				);
			  };
			  console.log(exceptions(nativeCaptionsArray, targetCaptionsArray))
			setCaptions(mergedArr);
			console.log(mergedArr);
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
		getCaptions(props.target, props.native, props.videoId);
	}, [getCaptions, props.target, props.native, props.videoId])

	const toggleBlur = (event) => {
		console.log(event.target.value);
		if (event.target.value === "blur-native") {
			setNativeBlur(prevState => !prevState);
		} else {
			setTargetBlur(prevState => !prevState);
		}
	}

	return (
        <Fragment>
			{/* todo: improve iframe title */}
			{/* <div id="player" ref={video}></div> */}
			<iframe id="ytplayer" type="text/html" title="youtube video" width="640" height="360" src="http://www.youtube.com/embed/Ux8s1YmUI2g?autoplay=1&origin=http://example.com" frameBorder="0"/>
			<div>
				<input type="checkbox" value="blur-native" id="blur-native" onChange={toggleBlur}/>
				<label htmlFor="blur-native">Hide text in native language</label>
				<input type="checkbox" value="blur-target" id="blur-target" onChange={toggleBlur}/>
				<label htmlFor="blur-target">Hide text in target language</label>
			</div>
			<div className={classes.captions}>
			{captions.length !== 0 ? 
				captions.map(caption => {
					return (
						<div className={classes.caption} key={caption.time}>
							<p className={classes.captionTime}>{caption.time}</p>
							<p className={targetBlur ? `${classes.captionTarget} ${classes.captionBlur}` : classes.captionTarget}>{caption.targetText}</p>
							<p className={nativeBlur ? `${classes.captionNative} ${classes.captionBlur}` : classes.captionNative}>{caption.nativeText}</p>
						</div>
					)
				})
			: null}
			</div>
        </Fragment>
	);
}

export default Captions;
