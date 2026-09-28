import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import type { Message } from '../types';

interface MessageListProps {
  messages: Message[];
}

const Container = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;

  &::before {
    content: '';
    margin-top: auto;
  }
`;

const Bubble = styled.div<{ $direction: 'incoming' | 'outgoing' }>`
  position: relative;
  max-width: 90%;
  padding: 8px 12px;
  border-radius: 8px;
  line-height: 1.4;
  text-align: left;
  color: #000;
  font-size: 14.2px;
  box-shadow: 0 1px 0.5px rgba(11, 20, 26, 0.13);
  align-self: ${({ $direction }) =>
    $direction === 'outgoing' ? 'flex-end' : 'flex-start'};
  background-color: ${({ $direction }) =>
    $direction === 'outgoing' ? '#d9fdd3' : '#ffffff'};
`;

const SenderName = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #128c7e;
  margin-bottom: 2px;
`;

const MessageText = styled.div`
  white-space: pre-wrap;
  overflow-wrap: anywhere;
`;

const TimeSpacer = styled.span`
  display: inline-block;
  width: 40px;
`;

const MessageTime = styled.span`
  position: absolute;
  right: 12px;
  bottom: 6px;
  font-size: 11px;
  line-height: 1;
  color: #999;
`;

function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function MessageList({ messages }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <Container>
      {messages.map((msg) => (
        <Bubble key={msg.id} $direction={msg.direction}>
          {msg.direction === 'incoming' && msg.senderName && (
            <SenderName>{msg.senderName}</SenderName>
          )}
         <MessageText>
  {msg.text}
  <TimeSpacer />
</MessageText>
          <MessageTime>{formatTime(msg.timestamp)}</MessageTime>
        </Bubble>
      ))}
      <div ref={bottomRef} />
    </Container>
  );
}