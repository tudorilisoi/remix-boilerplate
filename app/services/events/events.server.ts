import type { Event, User } from '@prisma/client'
import { getEnhancedPrisma } from '../db.server'

export function getEvents({ userId }: { userId: User['id'] }) {
  return getEnhancedPrisma(userId).event.findMany({
    orderBy: { updatedAt: 'desc' },
  })
}

export function createEvent({
  body,
  title,
  userId,
}: Pick<Event, 'body' | 'title'> & {
  userId: User['id']
}) {
  return getEnhancedPrisma(userId).event.create({
    data: {
      title,
      body,
      authorId: userId,
      //   user: {
      //     connect: {
      //       id: userId,
      //     },
      //   },
    },
  })
}

export function updateEvent({
  id,
  body,
  title,
  userId,
}: Pick<Event, 'body' | 'title' | 'id'> & {
  userId: User['id']
}) {
  return getEnhancedPrisma(userId).event.update({
    where: { id },    
    data: {
      title,
      body,
      // authorId: userId,
      //   user: {
      //     connect: {
      //       id: userId,
      //     },
      //   },
    },
  })
}

export function getEvent({
  id,
  userId,
}: Pick<Event, 'id'> & {
  userId: User['id']
}) {
  return getEnhancedPrisma(userId).event.findUnique({
    where: { id },
  })
}

export function deleteEvent({
  id,
  userId,
}: Pick<Event, 'id'> & { userId: User['id'] }) {
  return getEnhancedPrisma(userId).event.delete({
    where: { id },
  })
}

export function publishEvent({
  id,
  userId,
}: Pick<Event, 'id'> & { userId: User['id'] }) {
  return getEnhancedPrisma(userId).event.update({
    where: { id },
    data: { published: true },
  })
}

export function unpublishEvent({
  id,
  userId,
}: Pick<Event, 'id'> & { userId: User['id'] }) {
  return getEnhancedPrisma(userId).event.update({
    where: { id },
    data: { published: false },
  })
}
