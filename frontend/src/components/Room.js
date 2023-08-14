import React, { Component } from "react";
import { Grid, Button, Typography, IconButton } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import CreateRoomPage from "./CreateRoomPage";
import MusicPlayer from "./MusicPlayer";



export default class Room extends Component {
  constructor(props) {
    super(props);
    this.state = {
      votesToSkip: 2,
      guestCanPause: false,
      isHost: false,
      showSettings: false,
      spotifyAuthenticated: false,
      song: {},
    };
    this.roomCode = this.props.match.params.roomCode;
    this.getRoomDetails = this.getRoomDetails.bind(this);
    this.leaveButtonPressed = this.leaveButtonPressed.bind(this);
    this.updateShowSettings = this.updateShowSettings.bind(this);
    this.renderSettingsButton = this.renderSettingsButton.bind(this);
    this.renderSettings = this.renderSettings.bind(this);
    this.authenticateSpotify = this.authenticateSpotify.bind(this),
    this.getCurrentSong = this.getCurrentSong.bind(this);
    this.getRoomDetails(); 
  }

  componentDidMount() {
    this.interval = setInterval(this.getCurrentSong, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getRoomDetails(){
    fetch('/api/get-room' + '?code=' + this.roomCode)
        .then((response) =>{
          if(!response.ok){
            this.props.leaveRoomCallback();
            this.props.history.push("/");
          }
          return response.json();
        } )
        .then((data) => {
            this.setState({
                votesToSkip: data.votes_to_skip,
                guestCanPause: data.guest_can_pause,
                isHost: data.is_host,
            });
            if (this.state.isHost){
              this.authenticateSpotify();
            }
        });
  }

  
  authenticateSpotify() {
    fetch("/spotify/is-authenticated")
      .then((response) => response.json())
      .then((data) => {
        this.setState({ spotifyAuthenticated: data.status });
        console.log(data.status);
        if (!data.status) {
          fetch("/spotify/get-auth-url")
            .then((response) => response.json())
            .then((data) => {
              window.location.replace(data.url);
            });
        }
      });
  }

  getCurrentSong() {
    fetch("/spotify/current-song")
      .then((response) => {
        if (!response.ok) {
          return {};
        } else {
          return response.json();
        }
      })
      .then((data) => {
        this.setState({ song: data });
        console.log(data);
      });
  }


  leaveButtonPressed(){
    const requestOptions = {
      method: "POST",
      headers: {'Content-Type': 'application/json'},
    };
    fetch('/api/leave-room', requestOptions).then((_response) => {
      this.props.leaveRoomCallback();
      this.props.history.push("/");
    });
  }

  updateShowSettings(value){
    this.setState({
      showSettings: value,
    })
  }

  renderSettings(){
    return (<Grid container spacing={1}>
      <Grid item cs={12} align="center">
        <CreateRoomPage 
          update={true} 
          votesToSkip={ this.state.votesToSkip} 
          guestCanPause={this.state.guestCanPause} 
          roomcode={this.roomCode} 
          updateCallback={this.getRoomDetails} 
          />      
        </Grid>
      <Grid item cs={12} align="center">
        <Button 
          variant="contained" 
          color="secondary" 
          onClick={() => this.updateShowSettings(false)}
          >
          Close
        </Button>
      </Grid>
    </Grid>
    )
  }

  renderSettingsButton(){
    const customColor = {
      color: 'white', 
    };

    return (
      <Grid item xs={12} align="center">
        <IconButton 
          variant="contained" 
          style={customColor} 
          onClick={() => this.updateShowSettings(true)}>
          <SettingsIcon />
        </IconButton>
      </Grid>

    );
  }

  render() {
    if(this.state.showSettings){
      return this.renderSettings();
    }

    const gradientStyle = {
      background: 'linear-gradient(to bottom, #138AB4, #8CD9CC)', 
      minHeight: '100vh',
      width: "200vh", 
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '0'
    };

    const customColor = {
      color: 'white', 
    };
    return (
      <div style={gradientStyle}>
        <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Typography variant="h4" component="h4" fontWeight="bold" color="white">
            Code: {this.roomCode}
          </Typography>
        </Grid>
        <Grid item xs={18} align="center">
          <MusicPlayer {...this.state.song} />
        </Grid>
        <Grid item xs={12} container justifyContent="center" alignItems="center">
          <Grid item xs={2} align="center">
            <Button variant="contained" color="primary" size="large" onClick={this.leaveButtonPressed}>
              Leave my room
            </Button>
          </Grid>
          <Grid item xs={0} align="center">
            <IconButton 
              variant="contained" 
              style={customColor}
              onClick={() => this.updateShowSettings(true)}>
              <SettingsIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Grid>
      </div>
    );
  }
}

