import React, {Component} from 'react';
import { Grid, Typography, Card, IconButton, LinearProgress } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SkipNextIcon from "@mui/icons-material/SkipNext";

export default class MusicPlayer extends Component {
    constructor(props) {
        super(props);
    }

    skipSong(){
      const requestOptions = {
        method: "POST",
        headers: {'Content-Type': 'application/json'}
      };
      fetch('/spotify/skip', requestOptions);
    }

    pauseSong() {
        const requestOptions = {
            method: 'PUT',
            headers: {'Content-Type': "application/json"},
        };
        fetch("/spotify/pause", requestOptions);
    }

    playSong(){
        const requestOptions = {
            method: 'PUT',
            headers: {'Content-Type': "application/json"},
        };
        fetch("/spotify/play", requestOptions);
    }

    render() {
       const songProgress = (this.props.time / this.props.duration) *100;
    
        return (
          <div align="center">
            <Card style={{
              width: "1100px", // Adjust the width as needed
              height: "400px", // Adjust the height as needed
            }}>
            <Grid container alignItems="center">
              <Grid item align="center" xs={4}>
                <img src={this.props.image_url} height="100%" width="100%" />
              </Grid>
              <Grid item align="center" xs={8}>
                <Typography component="h5" variant="h3" fontWeight="bold">
                  {this.props.title}
                </Typography>
                <Typography color="textSecondary" variant="subtitle2" style={{ fontSize: "18px" }}>
                  {this.props.artist}
                </Typography>
                <div>
                  <IconButton style={{ marginRight: '20px' }} size='large'
                    onClick={() => {
                        this.props.is_playing ? this.pauseSong() : this.playSong();
                }}>
                    {this.props.is_playing ? <PauseIcon /> : <PlayArrowIcon />}
                  </IconButton>
                  <IconButton onClick = {() => this.skipSong()} size='large'>
                    <SkipNextIcon /> 
                  </IconButton>
                </div>
                <Grid item align="center" xs={4}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    Votes To Skip: {this.props.votes} / {"     "} {this.props.votes_required}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <LinearProgress variant="determinate" value={songProgress} />
          </Card>
          </div>
        );
      }
}