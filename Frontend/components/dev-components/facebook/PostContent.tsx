import { FacebookPost } from "@/types/fb";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import {
  Calendar,
  Clock,
  LayoutDashboard,
  ReceiptPoundSterling,
} from "lucide-react";
import { PostDetailsTable } from "./PostDetailsTable";

interface PostContentProps {
  post: FacebookPost;
}

export function PostContent({ post }: PostContentProps) {
  return (
    <div className="grid gap-2 md:grid-cols-2 grid-col-1">
      <div className="flex flex-col">

        <Card className="">
          <CardContent className="p-6">
            <div className="mb-4">
              <Image
                src={post.picture || "/placeholder.svg"}
                alt="Facebook post"
                width={1024}
                height={1024}
                className="object-cover w-full rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <p className="flex items-center text-sm text-gray-500">
                <Calendar className="w-4 h-4 mr-2" />
                Published on{" "}
                {new Date(post.created.dateTime).toLocaleDateString()}
              </p>
              <p className="flex items-center text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-2" />
                {post.created.timezone}
              </p>
              <Badge variant="secondary" className="text-xs">
                {post.type}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {post.engagement.toFixed(2)}% Engagement Rate
              </Badge>
            </div>
            <p className="mt-4 text-gray-700">{post.text}</p>
          </CardContent>
        </Card>
      </div>
      <PostDetailsTable post={post} />
    </div>
  );
}
