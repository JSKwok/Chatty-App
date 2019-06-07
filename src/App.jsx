import React, {Component} from 'react';
import MessageList from './MessageList.jsx'
import ChatBar from './ChatBar.jsx'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: {name: "Anonymous"},
      messages: [],
      count: 0,
    }
    this.colour = ''
    this.handleKeyPress = this.handleKeyPress.bind(this)
    this.handleSocketOpen = this.handleSocketOpen.bind(this)
  }

  handleSocketOpen(messages) {
    this.setState({messages: messages});
  }

  componentDidMount() {
    const socket= new WebSocket("ws://localhost:3001");
    // Storing the socket
    this.socket = socket;

    // Handler to ensure socket is open
    socket.onopen = () => {
      console.log('Connected to server.')

      // Handler for browser side to receive messages from server
      socket.onmessage = (event) => {
        const parsedData = JSON.parse(event.data);

        switch (parsedData.type) {

          // Handle new user connection message
          case 'connect':
            this.setState({
              count: parsedData.count,
            });
            break;

          // Handle name change message
          case 'colour':
            this.colour = parsedData.colour;
            break;

          // Handle new user-sent message
          default:
            const messages = this.state.messages.concat(parsedData);
            this.handleSocketOpen(messages);
            break;
        }
      };
    }
  }

  // Chat bar functionality, create object and send to server
  handleKeyPress = (event) => {

    // Situation for user to enter a new message
    if (event.target.className === "chatbar-message") {
      if (event.key === 'Enter') {
        this.socket.send(JSON.stringify({
          id: '',
          type: "postMessage",
          username: this.state.currentUser.name,
          content: event.target.value,
          colour: this.colour
        }));

      event.target.value = "";

      }

    // Situation for user to change their name
    if (event.target.className === "chatbar-username") {
      if (event.key === 'Enter') {
        const newName = { name: event.target.value };
        this.socket.send(JSON.stringify({
          id: '',
          type: 'postNotification',
          content: `${this.state.currentUser.name} has changed their name to ${event.target.value}`
        }));
      this.setState( {currentUser : newName } );
      }
    }

  }

 // Central rendering for all pages and navigation bar
  render() {
    return (
      <div>
        <nav className="navbar">
          <a href="/" className="navbar-brand">Chatty</a>
          <div className="user-count">{this.state.count} Users Online</div>
        </nav>
        <MessageList messages={this.state.messages} />
        <ChatBar currentUser={this.state.currentUser} handleKeyPress={this.handleKeyPress} />
      </div>
    );
  }
}

export default App;


