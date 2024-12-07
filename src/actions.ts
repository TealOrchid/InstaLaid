'use server';

import {auth} from "@/auth";
import {prisma} from "@/db";
import {uniq} from "lodash";
import * as leoProfanity from "leo-profanity";
import frenchBadWords from "french-badwords-list";
import { v4 as uuidv4 } from "uuid";
import { redirect } from "next/navigation";

leoProfanity.loadDictionary("fr");
leoProfanity.add(frenchBadWords.array);

const maskProfanity = (text: string): string => {
  const profaneWords = leoProfanity.list();
  let maskedText = text;
  profaneWords.forEach((word) => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    maskedText = maskedText.replace(regex, '*'.repeat(word.length));
  });
  return maskedText;
};

interface FormData {
  get(name: string): string | FormDataEntryValue | null;
}

export async function getSessionEmail(): Promise<string|null|undefined> {
  const session = await auth();
  return session?.user?.email;
}

export async function getSessionEmailOrThrow(): Promise<string> {
  const userEmail = await getSessionEmail();
  if (!userEmail) {
    throw 'not logged in';
  }
  return userEmail;
}

export async function getSessionRole(): Promise<string> {
  const userEmail = await getSessionEmail();
  if (userEmail) {
    const profile = await prisma.profile.findFirst({
      where: {
        email: userEmail,
      },
    });
    return profile?.role || 'user';
  }
  return 'user';
}

export async function updateProfile(data: FormData, role: string) {
  const userEmail = await getSessionEmailOrThrow();
  let usernameText = data.get('username') as string;
  let isTaken = true;
  if (leoProfanity.check(usernameText)) {
    usernameText = 'user' + uuidv4().split('-')[0];
    while (isTaken) {
      const doesUserExist = await prisma.profile.findFirst({
        where: { username: usernameText },
      });
      if (doesUserExist) {
        usernameText = 'user' + uuidv4().split('-')[0];
      } else {
        isTaken = false;
      }
    }
  }
  let nameText = data.get('name') as string;
  if (leoProfanity.check(nameText)) {
    nameText = usernameText;
  }
  if (nameText === "undefined") {
    nameText = usernameText;
  }
  let subtitleText = data.get('subtitle') as string;
  if (leoProfanity.check(subtitleText)) {
    subtitleText = maskProfanity(subtitleText);
  }
  let bioText = data.get('bio') as string;
  if (leoProfanity.check(bioText)) {
    bioText = maskProfanity(bioText);
  }
  const newUserInfo = {
    username: usernameText,
    name: nameText,
    subtitle: subtitleText,
    bio: bioText,
    avatar: data.get('avatar') as string,
    role: role,
  };
  if (newUserInfo.avatar === '') {
    newUserInfo.avatar = "https://harlequin-keen-chickadee-753.mypinata.cloud/files/bafkreifznv3isngocvxcddhmtercz7qbs5vvu5adrdgvqjucl36ipfyh3m";
  }
  await prisma.profile.upsert({
    where: {
      email: userEmail,
    },
    update: newUserInfo,
    create: {
      email: userEmail,
      ...newUserInfo,
    },
  });
}

export async function postEntry(data: FormData) {
  const sessionEmail = await getSessionEmailOrThrow();
  let descriptionText = data.get('description') as string || '';
  if (leoProfanity.check(descriptionText)) {
    descriptionText = maskProfanity(descriptionText);
  }
  const moderators = await prisma.profile.findMany({
    where: {
      role: 'mod',
    },
  });
  const randomModerator = moderators[Math.floor(Math.random() * moderators.length)];
  const postDoc = await prisma.postForApproval.create({
    data: {
      author: sessionEmail,
      image: data.get('image') as string,
      description: descriptionText,
      moderator: randomModerator.email,
    },
  });
  return postDoc.id;
}

export async function approvePost(postId: string) {
  const post = await prisma.postForApproval.findFirstOrThrow({
    where: { id: postId },
  });
  const postDoc = await prisma.post.create({
    data: {
      author: post.author,
      image: post.image,
      description: post.description,
      createdAt: post.createdAt,
    },
  });
  await deletePost(postId);
  return postDoc.id;
}

export async function postComment(data: FormData) {
  const authorEmail = await getSessionEmailOrThrow();
  let commentText = data.get("text") as string;
  if (leoProfanity.check(commentText)) {
    commentText = maskProfanity(commentText);
  }
  return prisma.comment.create({
    data: {
      author: authorEmail,
      postId: data.get("postId") as string,
      text: commentText,
    },
  });
}

async function updatePostLikesCount(postId: string) {
  await prisma.post.update({
    where:{id:postId},
    data:{
      likesCount: await prisma.like.count({where:{postId}}),
    },
  });
}

export async function likePost(data: FormData) {
  const postId = data.get('postId') as string;
  await prisma.like.create({
    data: {
      author: await getSessionEmailOrThrow(),
      postId,
    },
  });
  await updatePostLikesCount(postId);
}

export async function removeLikeFromPost(data: FormData) {
  const postId = data.get('postId') as string;
  await prisma.like.deleteMany({
    where: {
      postId,
      author: await getSessionEmailOrThrow(),
    },
  });
  await updatePostLikesCount(postId);
}

async function updatePostDislikesCount(postId: string) {
  await prisma.post.update({
    where: { id: postId },
    data: {
      dislikesCount: await prisma.dislike.count({ where: { postId } }),
    },
  });
}

export async function dislikePost(data: FormData) {
  const postId = data.get('postId') as string;
  await prisma.dislike.create({
    data: {
      author: await getSessionEmailOrThrow(),
      postId,
    },
  });
  await updatePostDislikesCount(postId);
}

export async function removeDislikeFromPost(data: FormData) {
  const postId = data.get('postId') as string;
  await prisma.dislike.deleteMany({
    where: {
      postId,
      author: await getSessionEmailOrThrow(),
    },
  });
  await updatePostDislikesCount(postId);
}

async function updatePostVtffsCount(postId: string) {
  await prisma.post.update({
    where: { id: postId },
    data: {
      vtffsCount: await prisma.vtff.count({ where: { postId } }),
    },
  });
}

export async function vtffPost(data: FormData) {
  const postId = data.get('postId') as string;
  await prisma.vtff.create({
    data: {
      author: await getSessionEmailOrThrow(),
      postId,
    },
  });
  await updatePostVtffsCount(postId);
}

export async function removeVtffFromPost(data: FormData) {
  const postId = data.get('postId') as string;
  await prisma.vtff.deleteMany({
    where: {
      postId,
      author: await getSessionEmailOrThrow(),
    },
  });
  await updatePostVtffsCount(postId);
}

export async function getSingleApprovedPostData(postId:string) {
  const post = await prisma.post.findFirstOrThrow({where:{id:postId}});
  const authorProfile = await prisma.profile.findFirstOrThrow({where:{email:post.author}});
  const comments = await prisma.comment.findMany({where:{postId:post.id}});
  const commentsAuthors = await prisma.profile.findMany({
    where: {
      email: {in: uniq(comments.map(c => c.author))},
    },
  });
  const sessionEmail = await getSessionEmailOrThrow();
  const myLike = await prisma.like.findFirst({
    where: {
      author: sessionEmail,
      postId: post.id,
    }
  });
  const myDislike = await prisma.dislike.findFirst({
    where: {
      author: sessionEmail,
      postId: post.id,
    }
  });
  const myVtff = await prisma.vtff.findFirst({
    where: {
      author: sessionEmail,
      postId: post.id,
    }
  });
  const myBookmark = await prisma.bookmark.findFirst({
    where: {
      author: sessionEmail,
      postId: post.id,
    }
  });
  return {
    post, authorProfile, comments,
    commentsAuthors, myLike, myDislike, 
    myVtff, myBookmark,
  };
}

export async function getSinglePostData(postId:string) {
  const post = await prisma.postForApproval.findFirstOrThrow({where:{id:postId}});
  const authorProfile = await prisma.profile.findFirstOrThrow({where:{email:post.author}});
  const comments = await prisma.comment.findMany({where:{postId:post.id}});
  const commentsAuthors = await prisma.profile.findMany({
    where: {
      email: {in: uniq(comments.map(c => c.author))},
    },
  });
  const sessionEmail = await getSessionEmailOrThrow();
  const myLike = await prisma.like.findFirst({
    where: {
      author: sessionEmail,
      postId: post.id,
    }
  });
  const myDislike = await prisma.dislike.findFirst({
    where: {
      author: sessionEmail,
      postId: post.id,
    }
  });
  const myVtff = await prisma.vtff.findFirst({
    where: {
      author: sessionEmail,
      postId: post.id,
    }
  });
  const myBookmark = await prisma.bookmark.findFirst({
    where: {
      author: sessionEmail,
      postId: post.id,
    }
  });
  return {
    post, authorProfile, comments,
    commentsAuthors, myLike, myDislike, 
    myVtff, myBookmark,
  };
}


export async function followProfile(profileIdToFollow:string) {
  const sessionProfile = await prisma.profile.findFirstOrThrow({
    where:{email: await getSessionEmailOrThrow()},
  });
  await prisma.follower.create({
    data: {
      followingProfileEmail: sessionProfile.email,
      followingProfileId: sessionProfile.id,
      followedProfileId: profileIdToFollow,
    },
  });
}

export async function unfollowProfile(profileIdToUnfollow:string) {
  const sessionProfile = await prisma.profile.findFirstOrThrow({
    where:{email: await getSessionEmailOrThrow()},
  });
  await prisma.follower.deleteMany({
    where: {
      followingProfileEmail: sessionProfile.email,
      followingProfileId: sessionProfile.id,
      followedProfileId: profileIdToUnfollow,
    },
  });
}

export async function bookmarkPost(postId:string) {
  const sessionEmail = await getSessionEmailOrThrow();
  await prisma.bookmark.create({
    data:{
      author: sessionEmail,
      postId,
    },
  });
}

export async function unbookmarkPost(postId:string) {
  const sessionEmail = await getSessionEmailOrThrow();
  await prisma.bookmark.deleteMany({
    where:{
      author: sessionEmail,
      postId,
    },
  });
}

export async function deleteComment(commentId: string, authorEmail: string) {
  await prisma.comment.delete({
    where: { 
      author: authorEmail,
      id: commentId 
    },
  });
}

export async function deletePost(postId: string) {
  await prisma.like.deleteMany({
    where: { postId: postId },
  });
  await prisma.dislike.deleteMany({
    where: { postId: postId },
  });
  await prisma.vtff.deleteMany({
    where: { postId: postId },
  });
  await prisma.bookmark.deleteMany({
    where: { postId: postId },
  });
  await prisma.comment.deleteMany({
    where: { postId: postId },
  });
  await prisma.postForApproval.delete({
    where: { id: postId },
  });
  redirect("/");
}

export async function deleteApprovedPost(postId: string) {
  await prisma.like.deleteMany({
    where: { postId: postId },
  });
  await prisma.dislike.deleteMany({
    where: { postId: postId },
  });
  await prisma.vtff.deleteMany({
    where: { postId: postId },
  });
  await prisma.bookmark.deleteMany({
    where: { postId: postId },
  });
  await prisma.comment.deleteMany({
    where: { postId: postId },
  });
  await prisma.post.delete({
    where: { id: postId },
  });
  redirect("/");
}

export async function deleteProfile(sessionEmail: string) {
  const userPosts = await prisma.post.findMany({
    where: { author: sessionEmail },
  });
  const postsForApproval = await prisma.postForApproval.findMany({
    where: { author: sessionEmail },
  });
  const deleteApprovalPromises = postsForApproval.map(post => deletePost(post.id));
  await Promise.all(deleteApprovalPromises);
  const deletePromises = userPosts.map(post => deleteApprovedPost(post.id));
  await Promise.all(deletePromises); 
  await prisma.like.deleteMany({
    where: { author: sessionEmail },
  });
  await prisma.dislike.deleteMany({
    where: { author: sessionEmail },
  });
  await prisma.vtff.deleteMany({
    where: { author: sessionEmail },
  });
  await prisma.bookmark.deleteMany({
    where: { author: sessionEmail },
  });
  await prisma.comment.deleteMany({
    where: { author: sessionEmail },
  });
  await prisma.follower.deleteMany({
    where: { followingProfileEmail: sessionEmail},
  });
  await prisma.profile.delete({
    where: { email: sessionEmail },
  });
}

export async function updateRole(sessionEmail: string, newRole: 'user' | 'mod' | 'admin') {
  await prisma.profile.update({
    where: { email: sessionEmail },
    data: { role: newRole },
  });
}
