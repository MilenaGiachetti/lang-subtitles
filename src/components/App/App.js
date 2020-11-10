import React, {useState} from 'react';
import './App.scss';
import Captions from '../../routes/Captions/Captions';
import Home from '../../routes/Home/Home';
import youtube from '../../apis/youtube';

//http://video.google.com/timedtext?type=list&v={video_id} // get list caption

function App() {
	const [video, setVideo] = useState(false);
	const [availableLangs, setAvailableLangs] = useState([]);
	const [videoProps, setVideoProps] = useState({ target: "", native: "", videoId: "" });

	const updateProps = (e) => {
		let input = e.target.name;
		let newValue = e.target.value;
		setVideoProps(prevState =>({ 
			...prevState,
			[input]: newValue
		}))
	}
	const handleSubmit = (e) => {
		// list of available captions  http://video.google.com/timedtext?type=list&v=zzfCVBSsvqA request.
		youtube.get('/captions', {
			params: {
				videoId: videoProps.videoId,
				part: "snippet"
			}
		}).then(response => {
			console.log(response.data.items);
			let newAvailableLangs = []
			response.data.items.forEach(item => { newAvailableLangs.push(item.snippet.language)});
			setAvailableLangs(newAvailableLangs);
			console.log(newAvailableLangs);
		})

		e.preventDefault();
		// setVideo(true);
	}
	return (
		<div className="App">
			<header className="App-header"></header>
			<main className="main">
				<div className="container">
					<Home/>
					{!video ? 
						<div className="video-constructor">
							<form className="video-select" method="get" >
								{/* -give video id
								-search for available language Captions
								-add captions as options of 2 selects
								-one select optional
								-add not available captions if none found
								-make sure it differentiates autogenerated captions  */}

								<label htmlFor="videoId">Video Id</label>
								<input type="text" id="videoId" name="videoId" value={videoProps.videoId} onChange={(e) => updateProps (e)} required />
								{/* <label htmlFor="target">Target Language</label>
								<input type="text" id="target" name="target" value={videoProps.target} onChange={(e) => updateProps (e)} required />
								<label htmlFor="native" >Native Language</label>
								<input type="text" id="native" name="native" value={videoProps.native} onChange={(e) => updateProps (e)} required /> */}
								<input type="submit" onClick={(e)=>handleSubmit(e)} />
							</form>
							<p>Ex. videoId: "Ux8s1YmUI2g" - target: "ko" - native: "en"</p>
						</div>
					: null}
					{video ? <Captions target={videoProps.target} native={videoProps.native} videoId={videoProps.videoId} /> : null}
					{availableLangs.length > 0 ?
						<select>
							{availableLangs.map((lang, i) => {
								return (
									<option key={`${lang}-${i}`} value={lang}>{lang}</option>
								)
							})}
						</select>
					: null}
				</div>
			</main>
		</div>
	);
}

export default App;

