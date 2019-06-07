import React, { Component } from 'react';


class Message extends Component {
  render() {
    if(this.props.message.type === "incomingMessage") {
      const imageCheck = /\S+\.(?:png|PNG|jpg|JPG|jpeg|JPEG|gif|GIF)/;
      const content = this.props.message.content;
      const style = { maxWidth : "100px" }
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


