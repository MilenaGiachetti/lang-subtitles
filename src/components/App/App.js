import React, {useState} from 'react';
import './App.scss';
//import youtube from '../../apis/youtube';
import Captions from '../../routes/Captions/Captions';

let captions;
//http://video.google.com/timedtext?type=list&v={video_id} // get list caption
function App() {
	const [video, setVideo] = useState(false);
	const [videoProps, setVideoProps] = useState({ target: "", native: "", videoId: "" });

	const updateProps = (e) => {
		let input = e.target.name;
		let newValue = e.target.value;
		setVideoProps(prevState =>({ 
			...prevState,
			[input]: newValue
		}))
	}

	return (
		<div className="App">
			<header className="App-header"></header>
			<main>
				<div className="video-select">
					<label htmlFor="videoId">Video Id</label>
					<input type="text" id="videoId" name="videoId" value={videoProps.videoId} onChange={(e) => updateProps (e)} />
					<label htmlFor="target">Target Language</label>
					<input type="text" id="target" name="target" value={videoProps.target} onChange={(e) => updateProps (e)} />
					<label htmlFor="native" >Native Language</label>
					<input type="text" id="native" name="native" value={videoProps.native} onChange={(e) => updateProps (e)} />
					<input type="submit" onClick={()=>setVideo(true)} />
				</div>
				<p>target: "ko", native: "en", videoId: "Ux8s1YmUI2g"</p>
				{video ? <Captions target={videoProps.target} native={videoProps.native} videoId={videoProps.videoId} /> : null}
			</main>
		</div>
	);
}

export default App;

