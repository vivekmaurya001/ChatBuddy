import React from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useParams } from "react-router-dom";
import { ChatState } from "../../Context/ChatProvider";

const VideoCall = () => {
  const { RoomId } = useParams();
  console.log(RoomId);
  let myMeeting = async (element) => {
    // generate Kit Token
    const appID = 889389258;
    const serverSecret = "d7ead14ed27c5f17d13843596db68d8d";
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      RoomId,
      Date.now().toString(),
      "Enter Name"
    );

    // Create instance object from Kit Token.
    const zp = ZegoUIKitPrebuilt.create(kitToken);
    // start the call
    zp.joinRoom({
      container: element,
      //   sharedLinks: [
      //     {
      //       name: "Copy link",
      //       url: `http://localhost:3000`,
      //     },
      //   ],
      scenario: {
        mode: ZegoUIKitPrebuilt.OneONoneCall, // To implement 1-on-1 calls, modify the parameter here to [ZegoUIKitPrebuilt.OneONoneCall].
      },
    });
  };

  return (
    <div
      className="App"
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      ref={myMeeting}
    ></div>
  );
};
export default VideoCall;
