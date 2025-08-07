import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Search,
  Send,
  Plus,
  Phone,
  Video,
  MoreVertical,
  Users,
  Bell,
  Archive
} from 'lucide-react';
import { Message, User } from '@/types';

const Messages = () => {
  const { user } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock users for conversations
  const mockUsers: User[] = [
    {
      id: '2',
      name: 'Sarah Wilson',
      email: 'sarah@university.edu',
      role: 'alumni',
      avatar: '',
      verified: true
    },
    {
      id: '3',
      name: 'Dr. Michael Brown',
      email: 'admin@university.edu',
      role: 'admin',
      avatar: '',
      verified: true
    },
    {
      id: '4',
      name: 'Alex Johnson',
      email: 'alex@university.edu',
      role: 'student',
      avatar: '',
      verified: true
    }
  ];

  // Mock conversations
  const mockConversations = [
    {
      id: '1',
      participants: ['1', '2'],
      lastMessage: 'Thanks for the career advice!',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      unread: 2,
      type: 'direct'
    },
    {
      id: '2',
      participants: ['1', '3'],
      lastMessage: 'Your event proposal has been approved.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      unread: 0,
      type: 'direct'
    },
    {
      id: '3',
      participants: ['1', '4'],
      lastMessage: 'Are you joining the study group tonight?',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      unread: 1,
      type: 'direct'
    }
  ];

  // Mock messages
  const mockMessages: { [key: string]: Message[] } = {
    '1': [
      {
        id: 'm1',
        senderId: '2',
        receiverId: '1',
        content: 'Hi John! I saw your profile and noticed we both studied Computer Science.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        type: 'direct',
        likes: [],
        status: 'read'
      },
      {
        id: 'm2',
        senderId: '1',
        receiverId: '2',
        content: 'Hi Sarah! Yes, I\'m actually graduating next semester. Any advice for someone entering the tech industry?',
        timestamp: new Date(Date.now() - 90 * 60 * 1000),
        type: 'direct',
        likes: [],
        status: 'read'
      },
      {
        id: 'm3',
        senderId: '2',
        receiverId: '1',
        content: 'Absolutely! Focus on building a strong portfolio and networking. I\'d be happy to review your resume if you\'d like.',
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        type: 'direct',
        likes: [],
        status: 'read'
      },
      {
        id: 'm4',
        senderId: '1',
        receiverId: '2',
        content: 'That would be amazing! Thank you so much for offering.',
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        type: 'direct',
        likes: [],
        status: 'read'
      },
      {
        id: 'm5',
        senderId: '2',
        receiverId: '1',
        content: 'Thanks for the career advice!',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        type: 'direct',
        likes: [],
        status: 'delivered'
      }
    ],
    '2': [
      {
        id: 'm6',
        senderId: '3',
        receiverId: '1',
        content: 'Your event proposal has been approved.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        type: 'direct',
        likes: [],
        status: 'read'
      }
    ],
    '3': [
      {
        id: 'm7',
        senderId: '4',
        receiverId: '1',
        content: 'Are you joining the study group tonight?',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        type: 'direct',
        likes: [],
        status: 'sent'
      }
    ]
  };

  const [conversations] = useState(mockConversations);
  const [messages, setMessages] = useState(mockMessages);

  const getOtherParticipant = (conversation: any) => {
    const otherUserId = conversation.participants.find((id: string) => id !== user?.id);
    return mockUsers.find(u => u.id === otherUserId);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      senderId: user?.id || '',
      receiverId: getOtherParticipant(conversations.find(c => c.id === selectedConversation))?.id,
      content: newMessage,
      timestamp: new Date(),
      type: 'direct',
      likes: [],
      status: 'sent'
    };

    setMessages(prev => ({
      ...prev,
      [selectedConversation]: [...(prev[selectedConversation] || []), newMsg]
    }));

    setNewMessage('');
  };

  const selectedConversationData = conversations.find(c => c.id === selectedConversation);
  const selectedMessages = selectedConversation ? messages[selectedConversation] || [] : [];
  const otherUser = selectedConversationData ? getOtherParticipant(selectedConversationData) : null;

  return (
    <div className="h-[calc(100vh-12rem)] flex gap-4">
      {/* Conversations List */}
      <Card className="w-1/3 flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Messages</CardTitle>
            <Button size="sm" variant="ghost">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <ScrollArea className="flex-1">
          <div className="space-y-1 p-4 pt-0">
            {conversations.map((conversation) => {
              const otherParticipant = getOtherParticipant(conversation);
              if (!otherParticipant) return null;

              return (
                <div
                  key={conversation.id}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-muted transition-colors ${
                    selectedConversation === conversation.id ? 'bg-muted' : ''
                  }`}
                  onClick={() => setSelectedConversation(conversation.id)}
                >
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={otherParticipant.avatar} />
                      <AvatarFallback>{otherParticipant.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium truncate">{otherParticipant.name}</h4>
                      <span className="text-xs text-muted-foreground">
                        {conversation.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                      {conversation.unread > 0 && (
                        <Badge variant="destructive" className="w-5 h-5 rounded-full p-0 flex items-center justify-center text-xs">
                          {conversation.unread}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </Card>

      {/* Chat Area */}
      <Card className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={otherUser?.avatar} />
                    <AvatarFallback>{otherUser?.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{otherUser?.name}</h3>
                    <p className="text-sm text-muted-foreground capitalize">{otherUser?.role}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Video className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <Separator />

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {selectedMessages.map((message, index) => {
                  const isOwn = message.senderId === user?.id;
                  const sender = isOwn ? user : otherUser;

                  return (
                    <div
                      key={message.id}
                      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex gap-2 max-w-[70%] ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={sender?.avatar} />
                          <AvatarFallback>{sender?.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className={`rounded-lg p-3 ${
                          isOwn 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted'
                        }`}>
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            isOwn 
                              ? 'text-primary-foreground/70' 
                              : 'text-muted-foreground'
                          }`}>
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <CardContent className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Select a conversation</h3>
              <p className="text-muted-foreground">Choose a conversation to start messaging</p>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Side Panel */}
      <Card className="w-80 hidden lg:block">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full justify-start gap-2">
            <Users className="w-4 h-4" />
            Create Group Chat
          </Button>
          <Button variant="outline" className="w-full justify-start gap-2">
            <Bell className="w-4 h-4" />
            Announcements
          </Button>
          <Button variant="outline" className="w-full justify-start gap-2">
            <Archive className="w-4 h-4" />
            Archived Chats
          </Button>
          
          <Separator />
          
          <div>
            <h4 className="font-medium mb-3">Online Now</h4>
            <div className="space-y-2">
              {mockUsers.slice(0, 3).map((u) => (
                <div key={u.id} className="flex items-center gap-2">
                  <div className="relative">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={u.avatar} />
                      <AvatarFallback>{u.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                  </div>
                  <span className="text-sm">{u.name}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Messages;