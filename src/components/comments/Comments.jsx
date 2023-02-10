import { useContext, useState } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../../axios";
import ReactTimeAgo from "react-time-ago";
import { SocketContext } from "../../context/socketContext";

const Comments = ({ post }) => {
  const [desc, setDesc] = useState("");
  const { currentUser, token } = useContext(AuthContext);
  const socket = useContext(SocketContext)
  const queryClient = useQueryClient();
  const handleNotification = (type) => {
    socket?.emit("sendNotification", {
      senderId: currentUser._id,
      type,
      userId:post.userId
    });
  };
  const sortedComments = post.comments.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  const config = {
    headers: {
      token: `Bearer ${token}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };
  const mutation = useMutation(
    (newComment) => {
      return axios.put(`/posts/${post._id}/comment`, newComment);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        handleNotification("commented on your post")
        queryClient.invalidateQueries(["posts"]);
      },
    }
  );
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleClick(event);
    }
  };
  const handleClick = async (e) => {
    e.preventDefault();
    const newComment = {
      comment: desc,
      profilePic: currentUser.profilePicture,
      name: currentUser.username,
    };
    mutation.mutate(newComment);
    setDesc("");
  };

  return (
    <div className="comments">
      <div className="write">
        <img src={currentUser.profilePicture} alt="" />
        <input
          type="text"
          placeholder="write a comment"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleClick}>Send</button>
      </div>
      {sortedComments.map((comment) => (
        <div className="comment" key={comment._id}>
          <img src={comment.profilePic} alt="" />
          <div className="c_container">
            <div className="arrow">
              <div className="outer"></div>
              <div className="inner"></div>
            </div>
            <div className="info">
              <span>{comment.name}</span>
              <p>{comment.comment}</p>
            </div>
          </div>

          <span className="date">
            <ReactTimeAgo date={comment.createdAt} locale="en-US" />
          </span>
        </div>
      ))}
    </div>
  );
};

export default Comments;
