import { chatHistoryList, chatroomList, favoriteAdd } from '@/services/chat';
import { useLocation } from '@umijs/max';
import { Button, Popover, message } from 'antd';
import { AxiosError } from 'axios';
import { useEffect, useRef, useState } from 'react';
import { Socket, io } from 'socket.io-client';
import './index.less';
// import { UserInfo } from "../UpdateInfo";
import TextArea from 'antd/es/input/TextArea';
// import { useLocation } from "react-router-dom";
import data from '@emoji-mart/data';
import EmojiPicker from '@emoji-mart/react';
import { UploadImageModal } from './UploadImageModal';

interface UserInfo {
  headPic: string;
  username: string;
  email: string;
  captcha: string;
}

interface JoinRoomPayload {
  chatroomId?: number;
  userId: number;
}

interface SendMessagePayload {
  sendUserId: number;
  chatroomId: number;
  message: Message;
}

type MessageType = 'image' | 'text' | 'file';

interface Message {
  type: MessageType;
  content: string;
}

type Reply =
  | {
      type: 'sendMessage';
      userId: number;
      message: ChatHistory;
    }
  | {
      type: 'joinRoom';
      userId: number;
    };
export interface Chatroom {
  id: number;
  name: string;
  createTime: Date;
}

export interface ChatHistory {
  id: number;
  content: string;
  type: number;
  chatroomId: number;
  senderId: number;
  createTime: Date;
  sender: UserInfo;
}

interface User {
  id: number;
  email: string;
  headPic: string;
  nickName: string;
  username: string;
  createTime: Date;
}

export function getUserInfo(): User {
  return JSON.parse(localStorage.getItem('userInfo')!);
}

const Chat = () => {
  // const params: { state: { id: number } } = useLocation();
  // if (params.state) {
  //   console.log(params.state.id, 'const params');
  // }

  const [roomList, setRoomList] = useState<Array<Chatroom>>();
  const [roomId, setChatroomId] = useState<number>();
  const [ChatHistory, setChatHistory] = useState<Array<ChatHistory>>();

  const socketRef = useRef<Socket>();
  const [inputText, setInputText] = useState('');
  const userInfo = getUserInfo();

  const [isUploadImageModalOpen, setUploadImageModalOpen] = useState(false);

  const location = useLocation();

  useEffect(() => {
    if (location.state?.id) {
      setChatroomId(location.state?.id);

      queryChatHistoryList(location.state?.id);
    }
  }, [location.state?.id]);

  useEffect(() => {
    setTimeout(() => {
      document.getElementById('bottom-bar')?.scrollIntoView({ block: 'end' });
    }, 300);
  }, [roomId]);

  useEffect(() => {
    if (!roomId) {
      return;
    }
    const socket = (socketRef.current = io('http://116.198.235.238', {
      path: '/api/chat/socket.io',
    }));
    console.log(socket, 'socket');

    socket.on('connect', function () {
      console.log('socket, 链接成功');

      const payload: JoinRoomPayload = {
        chatroomId: roomId,
        userId: getUserInfo().id,
      };

      socket.emit('joinRoom', payload);

      socket.on('message', (reply: Reply) => {
        if (reply.type === 'sendMessage') {
          setChatHistory((chatHistory) => {
            return chatHistory
              ? [...chatHistory, reply.message]
              : [reply.message];
          });
          setTimeout(() => {
            document
              .getElementById('bottom-bar')
              ?.scrollIntoView({ block: 'end' });
          }, 300);
        }
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId]);

  function sendMessage(value: string, type: MessageType = 'text') {
    if (!value) {
      return;
    }
    if (!roomId) {
      return;
    }
    const payload: SendMessagePayload = {
      sendUserId: getUserInfo().id,
      chatroomId: roomId,
      message: {
        type,
        content: value,
      },
    };
    socketRef.current?.emit('sendMessage', payload);
  }

  async function queryChatroomList() {
    try {
      const res = await chatroomList();
      setRoomList(
        res.map((item: Chatroom) => {
          return {
            ...item,
            key: item.id,
          };
        }),
      );
    } catch (e) {
      message.error(
        (e as AxiosError<{ message: string }>).response?.data?.message ||
          '系统忙，请稍后重试',
      );
    }
  }

  useEffect(() => {
    queryChatroomList();
  }, []);

  async function queryChatHistoryList(chatroomId?: number) {
    try {
      const res = await chatHistoryList(chatroomId);

      setChatHistory(
        res.map((item: ChatHistory) => {
          return {
            ...item,
            key: item.id,
          };
        }),
      );
    } catch (e) {
      message.error(
        (e as AxiosError<{ message: string }>).response?.data?.message ||
          '系统忙，请稍后重试',
      );
    }
  }

  const [uploadType, setUploadType] = useState<'image' | 'file'>('image');

  const addToFavorite = async (chatHistoryId: number) => {
    try {
      const res = await favoriteAdd(chatHistoryId);
      message.success('收藏成功');
    } catch (e) {
      message.error(
        (e as AxiosError<{ message: string }>).response?.data.message ||
          '系统忙，请稍后重试',
      );
    }
  };

  return (
    <div id="chat-container">
      <div className="chat-room-list">
        {roomList?.map((item) => {
          return (
            <div
              className={`chat-room-item ${
                item.id === roomId ? 'selected' : ''
              }`}
              data-id={item.id}
              key={item.id}
              onClick={() => {
                queryChatHistoryList(item.id);
                setChatroomId(item.id);
              }}
            >
              {item.name}
            </div>
          );
        })}
      </div>
      <div className="message-list">
        {ChatHistory?.map((item) => {
          return item.senderId === userInfo.id ? (
            <div
              className="message-item-form-me"
              data-id={item.id}
              onDoubleClick={() => addToFavorite(item.id)}
            >
              <div className="message-content">
                {item.type === 0 ? (
                  item.content
                ) : item.type === 1 ? (
                  <img src={item.content} style={{ maxWidth: 200 }}></img>
                ) : (
                  item.content
                )}
              </div>
              <div className="message-sender">
                <img
                  className="message-sender-head-pic"
                  src={item.sender.headPic}
                />
                {item.senderId === userInfo.id ? (
                  ''
                ) : (
                  <span className="sender-nickname">
                    {item.sender.username}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div
              data-id={item.id}
              className="message-item-form-other"
              onDoubleClick={() => addToFavorite(item.id)}
            >
              <div className="message-sender">
                <img
                  className="message-sender-head-pic"
                  src={item.sender.headPic}
                />
              </div>

              <div className="message">
                <span className="sender-nickname">{item.sender.username}</span>
                <div className="message-content">
                  {item.type === 0 ? (
                    item.content
                  ) : item.type === 1 ? (
                    <img src={item.content} style={{ maxWidth: 200 }}></img>
                  ) : (
                    item.content
                  )}
                </div>
              </div>
            </div>
          );

          // <div className='message-item' data-id={item.id}>

          // </div>

          // <div
          //   className={`message-item ${
          //     item.senderId === userInfo.id ? 'from-me' : ''
          //   }`}
          //   data-id={item.id}
          //   onDoubleClick={() => {
          //     addToFavorite(item.id);
          //   }}
          // >
          //   <div className="message-content">
          //     {item.type === 0 ? (
          //       item.content
          //     ) : item.type === 1 ? (
          //       <img src={item.content} style={{ maxWidth: 200 }}></img>
          //     ) : (
          //       item.content
          //     )}
          //   </div>
          //   <div className="message-sender">
          //     <img
          //       className="message-sender-head-pic"
          //       src={item.sender.headPic}
          //     />
          //     {item.senderId === userInfo.id ? (
          //       ''
          //     ) : (
          //       <span className="sender-nickname">
          //         {item.sender.username}
          //       </span>
          //     )}
          //   </div>
          // </div>
        })}
        <div id="bottom-bar" key="bottom-bar"></div>
      </div>
      <div className="message-input">
        <div className="message-type">
          <div className="message-type-item" key={1}>
            <Popover
              content={
                <EmojiPicker
                  data={data}
                  onEmojiSelect={(emoji: any) => {
                    setInputText((inputText) => inputText + emoji.native);
                  }}
                  title="Title"
                  trigger="click"
                ></EmojiPicker>
              }
            >
              表情
            </Popover>
          </div>
          <div
            className="message-type-item"
            key={2}
            onClick={() => {
              setUploadType('image');
              setUploadImageModalOpen(true);
            }}
          >
            图片
          </div>
          {/* <div
            className="message-type-item"
            key={3}
            onClick={() => {
              setUploadType("file");
              setUploadImageModalOpen(true);
            }}
          >
            文件
          </div> */}
        </div>
        <div className="message-input-area">
          <TextArea
            className="message-input-box"
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
            }}
          ></TextArea>
          <Button
            className="message-send-btn"
            type="primary"
            onClick={() => {
              sendMessage(inputText);
              setInputText('');
            }}
          >
            发送
          </Button>
        </div>
      </div>
      <UploadImageModal
        isOpen={isUploadImageModalOpen}
        handleClose={(imgSrc) => {
          setUploadImageModalOpen(false);
          console.log(imgSrc);
          if (imgSrc) {
            sendMessage(imgSrc, uploadType);
          }
        }}
        type={uploadType}
      ></UploadImageModal>
    </div>
  );
};

export default Chat;
