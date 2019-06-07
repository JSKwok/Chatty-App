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

  generateId(length) {
     let result = '';
     let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
     let charactersLength = characters.length;
     for ( let i = 0; i < length; i++ ) {
        result += characters[(Math.floor(Math.random() * charactersLength))];
     }
     return result;
  }

  handleSocketOpen(messages) {
    this.setState({messages: messages});
  }



  componentDidMount() {
    const socket= new WebSocket("ws://localhost:3001");
    // Storing the socket
    this.socket = socket;

    socket.onopen = () => {
      console.log('Connected to server.')

      socket.onmessage = (event) => {
        const parsedData = JSON.parse(event.data);

        switch (parsedData.type) {
          case 'connect':
            this.setState({
              count: parsedData.count,
            });
            break;

          case 'colour':
            this.colour = parsedData.colour;
            break;

          default:
            const messages = this.state.messages.concat(parsedData);
            this.handleSocketOpen(messages);
            break;
        }
      };
    }
  }

  handleKeyPress = (event) => {

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
    }

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


