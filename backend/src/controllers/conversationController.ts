import { Request, Response } from 'express';
import prisma from '../db/prisma.js';

// Get current student's conversations list
export const getMyConversations = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const conversations = await prisma.conversation.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: 'desc' },
      include: {
        _count: {
          select: { messages: true }
        },
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
          select: { content: true, role: true, createdAt: true }
        }
      }
    });

    res.json({ conversations });
  } catch (error) {
    console.error('Error fetching student conversations:', error);
    res.status(500).json({ error: 'Failed to fetch your conversations' });
  }
};

// Get single conversation with messages (Strictly verifies ownership)
export const getMyConversationById = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const id = req.params.id as string;

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    // Backend authorization rule: Student A must NEVER see Student B's conversations
    // (Admins can view through the admin route, not student route)
    if (conversation.userId !== user.id && user.role !== 'SUPER_ADMIN') {
      return res.status(403).json({ error: 'Access denied. You do not own this conversation.' });
    }

    res.json({ conversation });
  } catch (error) {
    console.error('Error fetching conversation details:', error);
    res.status(500).json({ error: 'Failed to fetch conversation' });
  }
};

// Create a new conversation session
export const createConversation = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { title } = req.body;

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const conversation = await prisma.conversation.create({
      data: {
        userId: user.id,
        title: title || 'College Advisory Chat'
      }
    });

    res.status(201).json({ conversation });
  } catch (error) {
    console.error('Error creating conversation:', error);
    res.status(500).json({ error: 'Failed to start new conversation' });
  }
};

// Delete a conversation
export const deleteMyConversation = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const id = req.params.id as string;

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id }
    });

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    if (conversation.userId !== user.id && user.role !== 'SUPER_ADMIN') {
      return res.status(403).json({ error: 'Access denied' });
    }

    await prisma.conversation.delete({
      where: { id }
    });

    res.json({ success: true, message: 'Conversation deleted' });
  } catch (error) {
    console.error('Error deleting conversation:', error);
    res.status(500).json({ error: 'Failed to delete conversation' });
  }
};
