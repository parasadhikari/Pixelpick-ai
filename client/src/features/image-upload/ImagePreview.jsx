import Workspace from "../workspace/Workspace";

const ImagePreview = ({ preview, removeImage }) => {
  return (
    <Workspace
      imageUrl={preview}
      removeImage={removeImage}
    />
  );
};

export default ImagePreview;