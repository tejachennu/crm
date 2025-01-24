import { InstagramPost } from "@/types/fb";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Calendar, Clock, Link, Heart, MessageCircle, Bookmark, Eye, Play } from 'lucide-react';
import { InstagramPostDetailsTable } from "./InstagramPostDetailsTable";

interface InstagramPostContentProps {
  post: InstagramPost;
}

export function InstagramPostContent({ post }: InstagramPostContentProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="flex flex-col">
        <Card>
          <CardContent className="p-6">
            <div className="mb-4">
              <Image
                src={post.imageUrl || "/placeholder.svg"}
                alt="Instagram post"
                width={1024}
                height={1024}
                className="object-cover w-full rounded-lg"
                unoptimized
              />
            </div>
            <div className="space-y-2">
              <p className="flex items-center text-sm text-gray-500">
                <Calendar className="w-4 h-4 mr-2" />
                Published on{" "}
                {new Date(post.publishedAt.dateTime).toLocaleDateString()}
              </p>
              <p className="flex items-center text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-2" />
                {post.publishedAt.timezone}
              </p>
              <p className="flex items-center text-sm text-gray-500">
                <Link className="w-4 h-4 mr-2" />
                <a href={post.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  View on Instagram
                </a>
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="text-xs">
                  {post.type}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {post.engagement.toFixed(2)}% Engagement Rate
                </Badge>
              </div>
            </div>
            <p className="mt-4 text-gray-700">{post.content}</p>
          </CardContent>
        </Card>
      </div>
      <InstagramPostDetailsTable post={post} />
    </div>
  );
}

