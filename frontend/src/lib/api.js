import { axiosInstance } from "./axios";


// =====================================================
// AUTH
// =====================================================

export const signup = async (signupData) => {
  const response = await axiosInstance.post(
    "/auth/signup",
    signupData
  );

  return response.data;
};


export const login = async (loginData) => {
  const response = await axiosInstance.post(
    "/auth/login",
    loginData
  );

  return response.data;
};


export const logout = async () => {
  const response = await axiosInstance.post(
    "/auth/logout"
  );

  return response.data;
};


// =====================================================
// ONBOARDING
// =====================================================

export const completeOnboarding = async (
  userData,
  getToken
) => {
  const token = await getToken();

  const response = await axiosInstance.post(
    "/auth/onboarding",
    userData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};


// =====================================================
// USERS
// =====================================================

export async function getUserFriends(getToken) {
  const token = await getToken();

  const response = await axiosInstance.get(
    "/users/friends",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}


export async function getRecommendedUser(getToken) {
  const token = await getToken();

  const response = await axiosInstance.get(
    "/users",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}


export async function getOutgoingFriendReqs(getToken) {
  const token = await getToken();

  const response = await axiosInstance.get(
    "/users/outgoing-friend-requests",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}


export async function sendFriendRequest(
  userId,
  getToken
) {
  const token = await getToken();

  const response = await axiosInstance.post(
    `/users/friend-request/${userId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}


export async function getFriendRequest(getToken) {
  const token = await getToken();

  const response = await axiosInstance.get(
    "/users/friend-requests",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}


export async function acceptFriendRequest(
  requestId,
  getToken
) {
  const token = await getToken();

  const response = await axiosInstance.post(
    `/users/friend-request/${requestId}/accept`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}


// =====================================================
// STREAM
// =====================================================

export async function getStreamToken(getToken) {
  const token = await getToken();

  const response = await axiosInstance.get(
    "/chat/token",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}