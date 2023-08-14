import React, { Component } from "react";
import { TextField, Button, Grid, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default class RoomJoinPage extends Component {
    constructor(props){
        super(props);

        this.state = {
            roomCode: "",
            error: "",
        };
        this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
        this.roomButtonPressed = this.roomButtonPressed.bind(this);
    }

    render(){
        const gradientStyle = {
            background: 'linear-gradient(to bottom, #552586, #B589D6)', // Replace with your desired gradient colors
            minHeight: '100vh',
            width: "200vh", 
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '0'
          };
        return (
            <div style={gradientStyle}>
                <Grid container spacing={1}>
                <Grid item xs={12} align="center" style={{ marginBottom: '20px' }}>
                    <Typography variant="h1" color={"white"} fontWeight="bold">
                        Join a Room
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center" style={{ marginBottom: '20px' }}>
                    <TextField
                        error = {this.state.error}
                        label = "Code"
                        placeholder="Enter A Room Code"
                        value={this.state.roomCode}
                        helperText={this.state.error}
                        variant="outlined"
                        onChange={this.handleTextFieldChange}
                        InputProps={{
                            style: { color: 'white' },
                          }}
                          InputLabelProps={{
                            style: { color: 'white'},
                          }}
                          style={{ width: '25%', marginTop: '20px' }}
                        />
                </Grid>
                <Grid item xs={12} align="center" style={{ marginBottom: '10px' }}>
                    <Button 
                        variant="contained" 
                        color="inherit" 
                        to="/" 
                        onClick={this.roomButtonPressed} 
                        size="large"
                        >
                        Enter Room
                    </Button>
                </Grid>
                <Grid item xs={12} align="center">
                    <Button variant="contained" color="secondary" to="/" component={Link} >
                        Back
                    </Button>
                </Grid>
            </Grid>
            </div>
        );
    }

    handleTextFieldChange(e) {
        this.setState({
            roomCode: e.target.value,
        })
    }

    roomButtonPressed() {
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code: this.state.roomCode,
          }),
        };
        fetch("/api/join-room", requestOptions)
          .then((response) => {
            if (response.ok) {
              this.props.history.push(`/room/${this.state.roomCode}`);
            } else {
              this.setState({ error: "Room not found." });
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
}