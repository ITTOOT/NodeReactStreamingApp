import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

// Home
export default class Home extends Component {
    constructor() {
        super();
        // Initialize state to an empty array
        this.state = {
            videos: []
        };
    }

    // Component Did Mount
    async componentDidMount() {
        try {
            // Fetch from endpoint
            const response = await fetch('http://localhost:4000/videos');
            // Response to JSON objects
            const data = await response.json();
            // Store video metadata
            this.setState({ videos: [...data] });
        } catch (error) {
            console.log(error);
        }
    }

    // Render List of videos
    render() {
        // Wrap video card with a link to the player view
        return (
            <div className="App App-header">
                <Header/>
                <div className="container">
                    <div className="row">
                        {this.state.videos.map(video =>
                        <div className="col-md-4" key={video.id}>
                            <Link to={`/player/${video.id}`}>
                                <div className="card border-0">
                                {/* Endpoint request to return thumbnail */}
                                    <img src={`http://localhost:4000${video.poster}`} alt={video.name} />
                                    <div className="card-body">
                                        <p>{video.name}</p>
                                        <p>{video.duration}</p>
                                    </div>
                                </div>
                            </Link>
                        </div>
                        )}
                    </div>
                </div>
                <Footer/>
            </div>
        )
    }
}