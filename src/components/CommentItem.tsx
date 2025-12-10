type Comment = {
  id: number;
  content: string;
  createAt?: string | Date;
  updateAt?: string | Date;
  author?: {
    id?: number;
    username?: string;
    nickname?: string;
  } | null;
  // optional fields that backend might send
  likesCount?: number;
  isLiked?: boolean;
};

interface CommentItemProps {
  comment: Comment;
  onReload?: () => void; // 부모에서 댓글 재로딩을 원할 때 호출
}

export default function CommentItem({ comment, onReload }: CommentItemProps) {
  // 작성자 표기: nickname 우선, 없으면 username, 없으면 '익명'
  const authorName =
    comment.author?.nickname ?? comment.author?.username ?? "익명";

  // 날짜 포맷팅 (createAt이 string 또는 Date일 수 있음)
  const createdAt = comment.createAt
    ? new Date(comment.createAt).toLocaleString()
    : "";

  return (
    <div className="p-3 rounded bg-[#1b1c22] border border-gray-700">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-400">{authorName}</p>
          <p className="text-gray-200 mt-1">{comment.content}</p>
          <p className="text-xs text-gray-500 mt-2">{createdAt}</p>
        </div>

        {/* 향후 좋아요/액션을 넣기 좋은 자리: minimal placeholder */}
        <div className="flex flex-col items-end gap-2">
          {/* 좋아요 수가 내려오는 경우 표시 */}
          {"likesCount" in comment && (
            <div className="text-sm text-gray-300">
              {comment.isLiked ? "❤️" : "🤍"} {comment.likesCount ?? 0}
            </div>
          )}

          {/* 부모가 재로딩을 원할 때 호출 가능한 버튼 (디버그용) */}
          {onReload && (
            <button
              onClick={() => onReload()}
              className="text-xs text-gray-400 hover:underline"
            >
              새로고침
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
