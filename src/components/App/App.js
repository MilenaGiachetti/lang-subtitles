import React, {useState} from 'react';
import './App.scss';
//import youtube from '../../apis/youtube';
import Captions from '../../routes/Captions/Captions';

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
	const handleSubmit = (e) => {
		e.preventDefault();
		setVideo(true);
	}
	return (
		<div className="App">
			<header className="App-header"></header>
			<main className="main">
				<div className="container">
					{!video ? 
						<div className="video-constructor">
							<form className="video-select" method="get" >
								<label htmlFor="videoId">Video Id</label>
								<input type="text" id="videoId" name="videoId" value={videoProps.videoId} onChange={(e) => updateProps (e)} required />
								<label htmlFor="target">Target Language</label>
								<input type="text" id="target" name="target" value={videoProps.target} onChange={(e) => updateProps (e)} required />
								<label htmlFor="native" >Native Language</label>
								<input type="text" id="native" name="native" value={videoProps.native} onChange={(e) => updateProps (e)} required />
								<input type="submit" onClick={(e)=>handleSubmit(e)} />
							</form>
							<p>Ex. videoId: "Ux8s1YmUI2g" - target: "ko" - native: "en"</p>
						</div>
					: null}
					{video ? <Captions target={videoProps.target} native={videoProps.native} videoId={videoProps.videoId} /> : null}
				</div>
			</main>
		</div>
	);
}

export default App;

