
'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { DocumentData } from 'firebase/firestore';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import Image from 'next/image';

interface Post extends DocumentData {
  id: string;
  title: string;
  content: string;
  association: 'cjm' | 'ajp' | 'amicale';
  authorName: string;
  authorPhotoURL?: string;
  imageURL?: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
}

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const postDate = post.createdAt ? new Date(post.createdAt.seconds * 1000) : new Date();
  const timeAgo = formatDistanceToNow(postDate, { addSuffix: true, locale: fr });

  return (
    <Card className="overflow-hidden">
      {post.imageURL && (
        <div className="relative aspect-video w-full">
          <Image src={post.imageURL} alt={post.title} fill className="object-cover" />
        </div>
      )}
      <CardHeader>
        <div className="flex items-start gap-4">
          <Avatar>
            <AvatarImage src={post.authorPhotoURL} alt={post.authorName} />
            <AvatarFallback>{post.authorName?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle>{post.title}</CardTitle>
            <CardDescription>
              Par {post.authorName} • {timeAgo}
            </CardDescription>
          </div>
          <Badge variant={post.association === 'amicale' ? 'default' : 'secondary'} className="ml-auto shrink-0">
            {post.association.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{post.content}</p>
      </CardContent>
    </Card>
  );
}
