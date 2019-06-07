import React, { Component } from 'react';

// Render individual messages based on input from front-end..

class Message extends Component {
  render() {
    // Situation for displaying incoming message from user
    if(this.props.message.type === "incomingMessage") {
      const imageCheck = /\S+\.(?:png|PNG|jpg|JPG|jpeg|JPEG|gif|GIF)/;
      const content = this.props.message.content;
      const style = { maxWidth : "100px" }

      // Create DOM elements to display name and message
      return (
        <div className="message">
          <span className="message-username" style={{ color : this.props.message.colour }}>{this.props.message.username}</span>
          <span className="message-content">
            { content }
            <p>
              {imageCheck.test(content) &&
              <img style={style} src={`${content.match(imageCheck)}`}/>}
            </p>
          </span>

        </div>
      )
      // Situation for displaying name change message.
    } else {
      return (
        <div className="message system">
          {this.props.message.content}
        </div>
      )
    }
  }
}

export default Message;


