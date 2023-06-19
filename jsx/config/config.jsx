/**
 * APP 設定
 */

// Page meta data
export const CONTEXT_PATH = document.querySelector('meta[name="ctx"]')?.content;
export const PATH = document.querySelector('meta[name="path"]')?.content;
export const LOGIN_USER = document.querySelector('meta[name="user"]')?.content;
export const REFERER = document.querySelector('meta[name="referer"]')?.content;
export const TENANT_ID = document.querySelector('meta[name="ytenantId"]')?.content;
export const LOGOUT_URL = `${CONTEXT_PATH}${PATH}/logout`;

// Spring CSRF meta data
export const CSRF_TOKEN = document.querySelector('meta[name="_csrf"]')?.content;
export const CSRF_HEADER = document.querySelector('meta[name="_csrf_header"]')?.content;
