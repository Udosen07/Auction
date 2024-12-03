import { renderPost } from "../../ui/post/singlePost";

const postId: string | null = new URLSearchParams(window.location.search).get(
  "id"
);

if (postId) {
  renderPost(postId);
} else {
  const postDetail = document.getElementById("blogMainPost");
  if (postDetail) {
    postDetail.innerText = "Invalid post ID.";
  }
}
