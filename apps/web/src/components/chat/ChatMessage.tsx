export function ChatMessage({ message }: any) {
  return (
    <div>
      {message.sender}

      {message.content}
    </div>
  );
}
