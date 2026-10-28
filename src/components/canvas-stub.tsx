import React from 'react';

export const NullComponent: React.FC = () => null;
export default NullComponent;

export const auth = {
  currentUser: {
    uid: 'canvas-guest',
    email: 'guest@ruangkonten.app',
    displayName: 'Pengguna Sandbox',
  },
};
export const db = {};
export const googleProvider = {};
export const initializeApp = () => ({});
export const getAuth = () => auth;
export const getFirestore = () => ({});
export const doc = () => ({});
export const getDoc = async () => ({ exists: () => false, data: () => ({}) });
export const setDoc = async () => ({});
export const serverTimestamp = () => new Date();
export const onAuthStateChanged = (_auth: any, callback: any) => {
  callback(auth.currentUser);
  return () => {};
};
export const signInWithPopup = async () => ({ user: auth.currentUser });
export const signOut = async () => {};
export const isAllowedEmail = () => true;
export const loginWithGoogle = async () => auth.currentUser;
export const logoutUser = async () => {};
export const ALLOWED_EMAIL = 'guest@ruangkonten.app';
export const loadWorkspaceFromFirestore = async () => null;
export const saveWorkspaceToFirestore = async () => true;

