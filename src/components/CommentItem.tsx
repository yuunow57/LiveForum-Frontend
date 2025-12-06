export default function CommentItem({ c }: any) {
  return (
    <div className="p-3 rounded bg-[#1b1c22] border border-gray-700">
      <p className="text-sm text-gray-400">{c.user?.nickname}</p>
      <p>{c.content}</p>
    </div>
  );
}
