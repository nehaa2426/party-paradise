import React, { Component } from "react";
import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";
import { Button, Grid, Typography, ButtonGroup } from "@mui/material";
import Room from "./Room";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";


export default class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roomCode: null,
    };
    this.clearRoomCode = this.clearRoomCode.bind(this);
  }

  async componentDidMount() {
    fetch("/api/user-in-room")
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          roomCode: data.code,
        });
      });
  }


  renderHomePage() {
    const gradientStyle = {
      background: 'linear-gradient(to bottom, #000080, #4169E1)', // Replace with your desired gradient colors
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
        <Grid container spacing={0}>
        <Grid item xs={12} align="center" style={{ marginBottom: '20px' }}>
          <Typography variant="h1" color={"white"} fontWeight="bold">
            Party Paradise
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <ButtonGroup disableElevation variant="contained">
            <Button color="inherit" to="/join" component={Link} size="large" >
              Join a Room
            </Button>
            <Button 
              color="primary" 
              to="/create" 
              component={Link} 
              style={{ marginLeft: '20px' }}
              size="large" 
              >
              Create a Room
            </Button>
          </ButtonGroup>
        </Grid>
      </Grid>
      </div>
    );
  }

  clearRoomCode() {
    this.setState({
      roomCode: null,
    });
  }

  render() {
    return (
      <Router>
        <Switch>
          <Route
            exact
            path="/"
            render={() => {
              return this.state.roomCode ? (
                <Redirect to={`/room/${this.state.roomCode}`} />
              ) : (
                this.renderHomePage()
              );
            }}
          />
          <Route path="/join" component={RoomJoinPage} />
          <Route path="/create" component={CreateRoomPage} />
          <Route
            path="/room/:roomCode"
            render={(props) => {
              return <Room {...props} leaveRoomCallback={this.clearRoomCode} />;
            }}
          />
        </Switch>
      </Router>
    );
  }
}