import axios from 'axios';
import { useEffect, useRef, useState, type ChangeEvent, type KeyboardEvent  } from 'react';
import styled from 'styled-components';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import {
  sendMessage,
  receiveNotification,
  deleteNotification,
  phoneToChatId,
  isValidPhone,
} from '../api/greenApi';
import type { AuthCredentials, Message } from '../types';
import chatBg from '../assets/chat-bg.webp';
import { AuthForm } from './AuthForm';
import { getCredentials } from '../api/credentials';

const Container = styled.div`
 position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 600px;
  height: 100vh;
  height: 100dvh;
  margin: 0 auto;
  border: 1px solid rgba(2, 191, 31, 0.6);
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: 
      linear-gradient(rgba(2, 191, 31, 0.6), rgba(1, 46, 14, 0.65)),
      url(${chatBg});
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    z-index: -1;
  }
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  border-bottom: 1px solid rgba(2, 191, 31, 0.6);
  background-color: rgba(10, 9, 9, 0.6);
  backdrop-filter: blur(5px);
`;

const HeaderRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const PhoneInput = styled.input`
  flex: 1;
  padding: 8px 12px;
  border: 1px solid rgba(2, 191, 31, 0.6);
  border-radius: 8px;
  font-size: 14px;
`;

const CreateChatButton = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  background-color: rgba(2, 191, 31, 0.6);
  color: white;
  cursor: pointer;
`;

const ErrorText = styled.div`
  color: #ff6b6b;
  font-size: 13px;
  padding: 4px 12px 0;
`;

export function ChatWindow() {
  const [phone, setPhone] = useState('');
  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [credentials, setCredentials] = useState<AuthCredentials | null>(
    getCredentials()
  );

  function handlePhoneChange(e: ChangeEvent<HTMLInputElement>) {
    setPhone(e.target.value);
    setPhoneError(null);
  }

  function handleCreateChat() {
    const trimmed = phone.trim();
    if (!isValidPhone(trimmed)) {
      setPhoneError('Введите корректный номер телефона (Пример: 79991234567)');
      return;
    }
    setPhoneError(null);
    setChatId(phoneToChatId(trimmed));
    setMessages([]);
  }

  async function handleSend(text: string) {
    if (!chatId) return;
    try {
      const { idMessage } = await sendMessage(chatId, text);
      setMessages((prev) => [
        ...prev,
        {
          id: idMessage,
          text,
          direction: 'outgoing',
          timestamp: Date.now(),
          chatId,
        },
      ]);
    } catch (err) {
      console.error('Ошибка отправки сообщения', err);
    } 
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleCreateChat();
  }

  const chatIdRef = useRef<string | null>(null);

  useEffect(() => {
    chatIdRef.current = chatId;
  }, [chatId]);

  useEffect(() => {
    if (!credentials) return;
  
    let active = true;
  
    async function poll() {
      while (active) {
        if (!getCredentials()) {
          setCredentials(null);
          setChatId(null);
          setMessages([]);
          return;
        }
        try {
          const notification = await receiveNotification();
          if (notification) {
            const { body, receiptId } = notification;
            const incomingText =
              body.messageData?.textMessageData?.textMessage ??
              body.messageData?.extendedTextMessageData?.text;
  
            if (
              body.typeWebhook === 'incomingMessageReceived' &&
              incomingText &&
              body.senderData.chatId === chatIdRef.current
            ) {
              setMessages((prev) => [
                ...prev,
                {
                  id: body.idMessage,
                  text: incomingText,
                  direction: 'incoming',
                  timestamp: body.timestamp * 1000,
                  chatId: body.senderData.chatId,
                  senderName: body.senderData.senderName,
                },
              ]);
            }
  
            await deleteNotification(receiptId);
          }
        } catch (err) {
          const isPollingTimeout = axios.isAxiosError(err) && err.response?.status === 408;
          if (!isPollingTimeout) {
            console.error('Ошибка получения уведомления', err);
            await new Promise((resolve) => setTimeout(resolve, 3000));
          }
        }
      }
    }
  
    poll();
  
    return () => {
      active = false;
    };
  }, [credentials]);
 
  return (
    <Container>
      
      {!credentials ? 
        <AuthForm onSuccess={setCredentials} /> : 
        <Header>
          <HeaderRow>
            <PhoneInput
              value={phone}
              onChange={handlePhoneChange}
              onKeyDown={handleKeyDown}
              placeholder="Номер получателя (Пример: 79991234567)"
            />
            <CreateChatButton onClick={handleCreateChat}>
              Создать чат
            </CreateChatButton>
          </HeaderRow>
          {phoneError && <ErrorText>{phoneError}</ErrorText>}
        </Header>
      }
   
      <MessageList messages={messages} />
      <MessageInput onSend={handleSend} disabled={!credentials || !chatId} />
    </Container>
  );
}