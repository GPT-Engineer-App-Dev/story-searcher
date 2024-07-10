import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const fetchTopStories = async () => {
  const response = await fetch(
    "https://hacker-news.firebaseio.com/v0/topstories.json"
  );
  const storyIds = await response.json();
  const top100Ids = storyIds.slice(0, 100);
  const storyPromises = top100Ids.map(async (id) => {
    const storyResponse = await fetch(
      `https://hacker-news.firebaseio.com/v0/item/${id}.json`
    );
    return storyResponse.json();
  });
  return Promise.all(storyPromises);
};

const Index = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["topStories"],
    queryFn: fetchTopStories,
  });
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStories = data?.filter((story) =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <Input
        placeholder="Search stories..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      {isLoading && (
        <div className="grid gap-4">
          {Array.from({ length: 10 }).map((_, index) => (
            <Skeleton key={index} className="h-24 w-full" />
          ))}
        </div>
      )}
      {error && <div className="text-red-500">Failed to load stories.</div>}
      <div className="grid gap-4">
        {filteredStories?.map((story) => (
          <Card key={story.id}>
            <CardHeader>
              <CardTitle>{story.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{story.score} upvotes</p>
              <a
                href={story.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Read more
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Index;