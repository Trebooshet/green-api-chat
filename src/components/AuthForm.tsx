import { useState, type FormEvent} from 'react';
import styled from 'styled-components';
import { checkCredentials } from '../api/greenApi';
import { saveCredentials } from '../api/credentials';
import type { AuthCredentials } from '../types';

interface AuthFormProps {
  onSuccess: (credentials: AuthCredentials) => void;
}

const Container = styled.form`
  display: flex;
  gap: 8px;
  padding: 12px;
  border-bottom: 1px solid rgba(2, 191, 31, 0.6);
  background-color: rgba(10, 9, 9, 0.6);
  backdrop-filter: blur(5px);

  @media (max-width: 500px) {
    flex-direction: column;
  }
`;

const Input = styled.input`
 flex: 1 1 0;
  min-width: 0;
  padding: 8px 12px;
  border: 1px solid rgba(2, 191, 31, 0.6);
  border-radius: 8px;
  font-size: 14px;
`;

const SubmitButton = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  background-color:rgba(2, 191, 31, 0.6);
  color: white;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const ErrorText = styled.div`
  color: #d32f2f;
  font-size: 13px;
  padding: 8px 12px 0;
`;

export function AuthForm({ onSuccess }: AuthFormProps) {
  const [idInstance, setIdInstance] = useState('');
  const [apiTokenInstance, setApiTokenInstance] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!idInstance.trim() || !apiTokenInstance.trim()) return;

    setLoading(true);
    setError(null);

    const isValid = await checkCredentials(
      idInstance.trim(),
      apiTokenInstance.trim()
    );

    if (!isValid) {
      setError('Неверные учетные данные или инстанс не авторизован в WhatsApp');
      setLoading(false);
      return;
    }

    const credentials: AuthCredentials = {
      idInstance: idInstance.trim(),
      apiTokenInstance: apiTokenInstance.trim(),
    };
    saveCredentials(credentials);
    onSuccess(credentials);
    setLoading(false);
  }

  return (
      <Container onSubmit={handleSubmit}>
        <Input
          value={idInstance}
          onChange={(e) => setIdInstance(e.target.value)}
          placeholder="idInstance"
          disabled={loading}
        />
        <Input
          value={apiTokenInstance}
          onChange={(e) => setApiTokenInstance(e.target.value)}
          placeholder="apiTokenInstance"
          type="password"
          disabled={loading}
        />
        <SubmitButton type="submit" disabled={loading}>
          {loading ? 'Проверка...' : 'Авторизоваться'}
        </SubmitButton>
        {error && <ErrorText>{error}</ErrorText>}
      </Container>
  );
}