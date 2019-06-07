import React, { Component } from 'react';

// Render chatbar inputs

class ChatBar extends Component {
  render() {
    return (
      <footer className="chatbar">
        <input name="chatbar-username" className="chatbar-username" defaultValue={this.props.currentUser.name} onKeyPress={this.props.handleKeyPress} placeholder="Your Name (Optional)" />
        <input name="chatbar-message"className="chatbar-message" onKeyPress={this.props.handleKeyPress} placeholder="Type a message and hit ENTER" />
      </footer>
    )
  }
}

export default ChatBar;