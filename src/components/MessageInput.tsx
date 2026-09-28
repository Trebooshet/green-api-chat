 import { useState, type FormEvent, type KeyboardEvent } from 'react';
import styled from 'styled-components';

interface MessageInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

const Container = styled.form`
  display: flex;
  gap: 8px;
  padding: 12px;
  border-top: 1px solid rgba(2, 191, 31, 0.6);
  background-color: rgba(10, 9, 9, 0.6);
  backdrop-filter: blur(5px);
`;

const TextArea = styled.textarea`
  flex: 1;
  resize: none;
  padding: 8px 12px;
  border: 1px solid rgba(2, 191, 31, 0.6);
  border-radius: 12px;
  font-size: 14px;
  font-family: inherit;
  line-height: 1.4;
  max-height: 130px;
  overflow-y: auto;

  &:focus {
    outline: none;
    border-color: #999;
  }
`;

const SendButton = styled.button`
  align-self: flex-end;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  background-color: rgba(2, 191, 31, 0.6);
  color: white;
  cursor: pointer;

  &:disabled {
    background-color: #ccc;
    color: black;
    cursor: not-allowed;
  }
`;

export function MessageInput({ onSend, disabled }: MessageInputProps) {
  const [text, setText] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text.trim());
    setText('');
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  return (
    <Container onSubmit={handleSubmit}>
      <TextArea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Введите сообщение"
        disabled={disabled}
      />
      <SendButton type="submit" disabled={disabled}>
        Отправить
      </SendButton>
    </Container>
  );
}