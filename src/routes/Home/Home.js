import React, { Fragment } from 'react';
import classes from './Home.module.scss';

function Home(props) {

	return (
        <Fragment>
            <h2>Plataform for learning language with youtube videos and captions</h2>
            <p>Put the id of the video you want to see the captions</p>
            {/* Image a partir de screenshot de donde sacar el id */}
            <p>Choose your target and native language</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla viverra varius lorem ac pharetra. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nam tincidunt lacus varius ultricies tincidunt. </p>

        </Fragment>
	);
}

export default Home;
