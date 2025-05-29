// Define the structure of a chat message
export interface Message {
  sender: 'user' | 'bot';
  text: string;
  isError?: boolean; // Optional property for error messages
}

// Define the expected structure of the response from your Node.js /chats API
export interface ChatAPIResponse {
  userQuery: string;
  generatedQuery: string;
  rawData: any; // Use 'any' if the structure of rawData can vary significantly
  naturalLanguageResponse: string;
}

// Define props for the ChatWindow component
export interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
}