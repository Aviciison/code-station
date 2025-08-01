import { Favorite } from '@/pages/chat/Collection';
import { GroupSearchResult } from '@/pages/chat/Group';
import { User } from '@/pages/chat/Group/MembersModal';
import { FriendRequest } from '@/pages/chat/Notification';
import { ChatHistory } from '@/pages/chat/chat';
import { AddFriend } from '@/pages/chat/friendShip/AddFriendModal';
import { friendShipListType } from '@/services/chat/chatType';
import instance from '@/utils/chatRequest';

interface RequestList {
  fromMe: Array<FriendRequest>;
  toMe: Array<FriendRequest>;
}

// 好友列表接口
export const friendshipList = async (
  name: string,
): Promise<Array<friendShipListType>> => {
  return await instance.get('/friendship/list', {
    params: {
      name,
    },
  });
};

export const friendAdd = async (data: AddFriend) => {
  return await instance.post('/friendship/add', data);
};

export const agreeFriendRequest = async (id: number) => {
  return await instance.get(`/friendship/agree/${id}`);
};

export const friendRequestList = async (): Promise<RequestList> => {
  return await instance.get('/friendship/request_list');
};

export const rejectFriendRequest = async (id: number) => {
  return await instance.get(`/friendship/reject/${id}`);
};

export const chatroomList = async (
  name?: string,
): Promise<Array<GroupSearchResult>> => {
  return await instance.get('/chatroom/list', {
    params: {
      name,
    },
  });
};

export const createGroup = async (name: string) => {
  return await instance.get('/chatroom/create-group', {
    params: {
      name,
    },
  });
};

export async function groupMembers(chatroomId: number): Promise<Array<User>> {
  return await instance.get(`/chatroom/members`, {
    params: {
      chatroomId,
    },
  });
}

export async function addMember(chatroomId: number, joinUsername: string) {
  return await instance.get(`/chatroom/join/${chatroomId}`, {
    params: {
      joinUsername,
    },
  });
}

export const chatHistoryList = async (
  id?: number,
): Promise<Array<ChatHistory>> => {
  return await instance.get('/chat-history/list', {
    params: {
      chatroomId: id,
    },
  });
};

export const favoriteAdd = async (chatHistoryId: number) => {
  return await instance.get('/favorite/add', {
    params: {
      chatHistoryId,
    },
  });
};

export const favoriteDel = async (id: number) => {
  return await instance.get('/favorite/del', {
    params: {
      id,
    },
  });
};

export const queryFavoriteList = async (): Promise<Array<Favorite>> => {
  return await instance.get('/favorite/list');
};

export async function findChatroom(userId1: number, userId2: number) {
  return instance.get(`/chatroom/findChatroom`, {
    params: {
      userId1,
      userId2,
    },
  });
}

export async function createOneToOne(friendId?: number) {
  return instance.get(`/chatroom/create-one-to-one`, {
    params: {
      friendId,
    },
  });
}
