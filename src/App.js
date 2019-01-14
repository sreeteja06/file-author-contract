import React, { Component } from "react";
import "./App.css";
import { Button, Input } from "semantic-ui-react";
import sha256 from "sha256";

class App extends Component {
  fileUploaded = file => {
    if (file !== undefined) {
      let hash = '';
      if (window.File && window.FileReader && window.FileList && window.Blob) {
        let reader = new FileReader();
        reader.onload = (event) => {
          hash = sha256(event.target.result);
          console.log("hash : " + hash);
        };
        reader.readAsText(file);
      } else {
        alert("The File APIs are not fully supported in this browser.");
      }
    }
  };
  render() {
    return (
      <div className="App">
        <h1>Hello World from FILE-AUTHOR</h1>
        <Input
          type="file"
          onChange={e => {
            this.fileUploaded(e.target.files[0]);
          }}
          placeholder="Upload file"
        />
        <Button primary onClick={this.fileUploaded}>
          Upload
        </Button>
      </div>
    );
  }
}

export default App;
