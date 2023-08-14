import React, { Component } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import { Link } from "react-router-dom";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Collapse } from "@mui/material";
import Alert from "@mui/lab/Alert";

export default class CreateRoomPage extends Component {
  static defaultProps = {
    votesToSkip: 2,
    guestCanPause: true,
    update: false,
    roomCode: null,
    updateCallback: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      guestCanPause: this.props.guestCanPause,
      votesToSkip: this.props.votesToSkip,
      errorMsg: "",
      successMsg: "",
    };

    this.handleRoomButtonPressed = this.handleRoomButtonPressed.bind(this);
    this.handleVotesChange = this.handleVotesChange.bind(this);
    this.handleGuestCanPauseChange = this.handleGuestCanPauseChange.bind(this);
    this.handleUpdateButtonPressed = this.handleUpdateButtonPressed.bind(this);
  }

  handleVotesChange(e) {
    this.setState({
      votesToSkip: e.target.value,
    });
  }

  handleGuestCanPauseChange(e) {
    this.setState({
      guestCanPause: e.target.value === "true" ? true : false,
    });
  }

  handleRoomButtonPressed() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        votes_to_skip: this.state.votesToSkip,
        guest_can_pause: this.state.guestCanPause,
      }),
    };
    fetch("/api/create-room", requestOptions)
      .then((response) => response.json())
      .then((data) => this.props.history.push("/room/" + data.code));
  }

  handleUpdateButtonPressed() {
    const requestOptions = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        votes_to_skip: this.state.votesToSkip,
        guest_can_pause: this.state.guestCanPause,
        code: this.props.roomCode,
      }),
    };
    fetch("/api/update-room", requestOptions).then((response) => {
      if (response.ok) {
        this.setState({
          successMsg: "Room updated successfully!", align: "center"
        });
      } else {
        this.setState({
          successMsg: "Room updated successfully!", align: "center"
        });
      }
      this.props.updateCallback();
    });
  }

  renderCreateButtons() {
    const customColor = {
      background: 'orange', 
      color: 'black'
    };
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Button
            style={customColor}
            variant="contained"
            onClick={this.handleRoomButtonPressed}
            size="large"
          >
            Create A Room
          </Button>
        </Grid>
        <Grid item xs={12} align="center">
          <Button color="inherit" variant="contained" to="/" component={Link}>
            Back
          </Button>
        </Grid>
      </Grid>
    );
  }

  renderUpdateButtons() {
    const customColor = {
      background: 'orange', 
      color: 'black'
    };
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Button
            style={customColor}
            variant="contained"
            onClick={this.handleUpdateButtonPressed}
            size="large"
          >
            Update Room
          </Button>
      </Grid>
        <Grid item xs={12} align="center">
            <Button color="inherit" variant="contained" to="/" component={Link}>
              Back
            </Button>
        </Grid>
      </Grid>
    );
  }

  render() {
    const title = this.props.update ? "Update Room" : "Create a Room";


    const gradientStyle = {
      background: 'linear-gradient(to bottom, #F58025, #F5E050)',
      minHeight: '100vh',
      width: "200vh",
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '0'
    };


    const customColor = {
      color: 'black',
    };  
    return (
      <div style={gradientStyle}>
        <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Collapse
            in={this.state.errorMsg != "" || this.state.successMsg != ""}
          >
            {this.state.successMsg != "" ? (
              <Alert
                severity="success"
                onClose={() => {
                  this.setState({ successMsg: "" });
                }}
              >
                {this.state.successMsg}
              </Alert>
            ) : (
              <Alert
                severity="error"
                onClose={() => {
                  this.setState({ errorMsg: "" });
                }}
              >
                {this.state.errorMsg}
              </Alert>
            )}
          </Collapse>
        </Grid>
        <Grid item xs={12} align="center">
          <Typography component="h4" variant="h1" fontWeight="bold" >
            {title}
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
      <FormControl component="fieldset">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ marginRight: '90px' }}>
            <Typography component="h4" variant="h6" color="black">
              Set Guest Controls
            </Typography>
          </div>
          <div>
            <Typography component="h4" variant="h6" color="black">
              Votes Required To Skip
            </Typography>
          </div>
        </div>
      </FormControl>
    </Grid>
        <Grid item xs={12} align="center">
          <FormControl component="fieldset">
            <RadioGroup
              row
              defaultValue={this.props.guestCanPause.toString()}
              onChange={this.handleGuestCanPauseChange}
            >
              <FormControlLabel
                value="true"
                control={<Radio style={customColor} />}
                label="Play/Pause"
                labelPlacement="bottom"
              />
              <FormControlLabel
                value="false"
                control={<Radio style={customColor} />}
                label="No Control"
                labelPlacement="bottom"
                style={{ marginRight: '80px', fontWeight: "bold" }}
              />
              <TextField
                required={true}
                type="number"
                onChange={this.handleVotesChange}
                defaultValue={this.state.votesToSkip}
                inputProps={{
                  min: 1,
                }}
            />
           
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item xs={12} align="center" style={{ marginBottom: '20px' }}>
         
        </Grid>
        {this.props.update
          ? this.renderUpdateButtons()
          : this.renderCreateButtons()}
      </Grid>
      </div>
    );
  }

}