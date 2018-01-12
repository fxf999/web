import React from 'react';
import PostList from 'features/Post/PostList';

export default function HuntedList(props) {
  return (
    <PostList daysAgo={2} />
  );
}
