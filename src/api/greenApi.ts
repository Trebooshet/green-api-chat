import axios from 'axios';
import { getCredentials } from './credentials';
import type {
  SendMessageResponse,
  IncomingMessageNotification,
} from '../types';

function getBaseUrl(): string {
  const credentials = getCredentials();
  if (!credentials) throw new Error('Не заданы учетные данные GREEN-API');
  return `https://api.green-api.com/waInstance${credentials.idInstance}`;
}

function getToken(): string {
  const credentials = getCredentials();
  if (!credentials) throw new Error('Не заданы учетные данные GREEN-API');
  return credentials.apiTokenInstance;
}

export function phoneToChatId(phone: string): string {
  return `${phone}@c.us`;
}

export function isValidPhone(value: string): boolean {
  return /^\d{10,15}$/.test(value.trim());
}

export async function sendMessage(
  chatId: string,
  message: string
): Promise<SendMessageResponse> {
  const url = `${getBaseUrl()}/sendMessage/${getToken()}`;
  const response = await axios.post<SendMessageResponse>(url, {
    chatId,
    message,
  });
  return response.data;
}

export async function receiveNotification(): Promise<IncomingMessageNotification | null> {
  const url = `${getBaseUrl()}/receiveNotification/${getToken()}`;
  const response = await axios.get(url);
  return response.data;
}

export async function deleteNotification(receiptId: number): Promise<void> {
  const url = `${getBaseUrl()}/deleteNotification/${getToken()}/${receiptId}`;
  await axios.delete(url);
}

export async function checkCredentials(
  idInstance: string,
  apiTokenInstance: string
): Promise<boolean> {
  try {
    const url = `https://api.green-api.com/waInstance${idInstance}/getStateInstance/${apiTokenInstance}`;
    const response = await axios.get(url);
    return response.data?.stateInstance === 'authorized';
  } catch {
    return false;
  }
}