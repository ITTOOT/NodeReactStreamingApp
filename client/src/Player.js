import React, { Component } from 'react'
import Header from './Header';
import Footer from './Footer';

// Player
export default class Player extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // Get the ID for the video
            videoId: this.props.match.params.id,
            videoData: {}
        };
    }

    // Component Did Mount
    async componentDidMount() {
        try {
            // Fetch metadata from endpoint and convert to JSON 
            const res = await fetch(`http://localhost:4000/video/${this.state.videoId}/data`);
            const data = await res.json();
            this.setState({ videoData: data });
        } catch (error) {
            console.log(error);
        }
    }
    render() {
        return (
            <div className="App">
                <Header/>
                <header className="App-header">
                    {/* CORS allows request of captions */}
                    <video controls muted autoPlay crossOrigin='anonymous'>
                        {/* Fetch video from endpoint */}
                        <source src={`http://localhost:4000/video/${this.state.videoId}`} type="video/mp4"></source>
                        {/* Supports timed track texts such as captions/subtitles (.vtt) */}
                        <track label='English' kind='captions' srcLang='en' src={`http://localhost:4000/video/${this.state.videoId}/caption`} default></track>
                    </video>
                    <h1>{ this.state.videoData.name }</h1>
                </header>
                <Footer/>
            </div>
        )
    }
}