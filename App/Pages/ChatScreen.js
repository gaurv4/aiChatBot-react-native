import { View, Text, Image, Alert } from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import {
  Bubble,
  GiftedChat,
  InputToolbar,
  Send,
} from "react-native-gifted-chat";
import GlobalApi from "../Services/GlobalApi";
import { FontAwesome } from "@expo/vector-icons";
import ChatFaceData from "../Services/ChatFaceData";
import AsyncStorage from "@react-native-async-storage/async-storage";

let CHAT_BOT_FACE =
  "https://res.cloudinary.com/dknvsbuyy/image/upload/v1685678135/chat_1_c7eda483e3.png";

export default function ChatScreen() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [botMessage, setBotMessage] = useState("");
  const [chatFaceColor, setChatFaceColor] = useState();

  useEffect(() => {
    checkFaceId();
  }, []);

  const checkFaceId = async () => {
    const id = await AsyncStorage.getItem("chatFaceId");
    CHAT_BOT_FACE = id ? ChatFaceData[id].image : ChatFaceData[0].image;
    setChatFaceColor(ChatFaceData[id]?.primary || ChatFaceData[0].primary);
    setMessages([
      {
        _id: 1,
        text: "Hello, How Can I help you?",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "React Native",
          avatar: CHAT_BOT_FACE,
        },
      },
    ]);
  };

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
    if (messages[0].text) {
      getGeminiResp(messages[0].text);
    }
  }, []);

  const typeText = (text) => {
    setBotMessage("");
    setLoading(true);

    let i = 0;
    const interval = setInterval(() => {
      setBotMessage((prev) => prev + text.charAt(i));
      i++;

      if (i >= text.length) {
        clearInterval(interval);
        setLoading(false);

        const chatAIResp = {
          _id: Math.random() * (9999999 - 1),
          text: text,
          createdAt: new Date(),
          user: {
            _id: 2,
            name: "React Native",
            avatar: CHAT_BOT_FACE,
          },
        };

        setMessages((prevMessages) =>
          GiftedChat.append(prevMessages, chatAIResp)
        );
        setBotMessage("");
      }
    }, 10);
  };

  const getGeminiResp = (msg) => {
    setLoading(true);
    GlobalApi.getGeminiApi(msg).then(
      (resp) => {
        if (resp) {
          typeText(resp);
        } else {
          setLoading(false);
          const chatAIResp = {
            _id: Math.random() * (9999999 - 1),
            text: "Sorry, I can not help with it",
            createdAt: new Date(),
            user: {
              _id: 2,
              name: "React Native",
              avatar: CHAT_BOT_FACE,
            },
          };
          setMessages((previousMessages) =>
            GiftedChat.append(previousMessages, chatAIResp)
          );
        }
      },
      (error) => {
        Alert.alert("Error", error.message || "Something went wrong");
        setLoading(false);
      }
    );
  };

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#671ddf",
            marginBottom: 5,
          },
          left: {
            marginBottom: 10,
            padding: 5,
          },
        }}
        textStyle={{
          right: {
            fontSize: 17,
            padding: 4,
          },
          left: {
            color: "#671ddf",
            fontSize: 18,
            padding: 2,
          },
        }}
      />
    );
  };

  const renderInputToolbar = (props) => (
    <InputToolbar
      {...props}
      containerStyle={{
        padding: 5,
        backgroundColor: "#671ddf",
        color: "#fff",
        minHeight: 50,
        maxHeight: 100,
      }}
      textInputStyle={{
        color: "#fff",
        fontSize: 16,
      }}
    />
  );

  const renderSend = (props) => {
    return (
      <Send {...props}>
        <View style={{ marginRight: 10, marginBottom: 5 }}>
          <FontAwesome
            name="send"
            size={25}
            color="white"
            resizeMode={"center"}
          />
        </View>
      </Send>
    );
  };

  const renderAvatar = (props) => {
    return (
      <View
        style={{
          paddingLeft: 7,
          marginBottom: 15,
        }}
      >
        <Image
          source={{ uri: props.currentMessage.user.avatar }}
          style={{
            height: 40,
            width: 40,
            borderRadius: 20,
          }}
        />
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <GiftedChat
        messages={messages}
        isTyping={loading}
        multiline={true}
        onSend={(messages) => onSend(messages)}
        user={{ _id: 1 }}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        renderSend={renderSend}
        renderAvatar={renderAvatar}
      />
    </View>
  );
}
