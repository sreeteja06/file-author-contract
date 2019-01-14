import  React  from "react";
import { Button, Input } from "semantic-ui-react";

const FileUpload = props => {
  return (
    <div>
      <Input
        type="file"
        onChange = {(e)=>props.change(e)}
        placeholder="Upload file"
      />
      <Button primary onClick={props.click}>
        Upload
      </Button>
    </div>
  );
};

export default FileUpload;
