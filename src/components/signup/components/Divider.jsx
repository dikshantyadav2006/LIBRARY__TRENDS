export default function Divider() {
  return (
    <div className="flex items-center my-4">
      <div className="flex-1 border-t" />
      <span className="px-3 text-gray-500 text-sm">OR</span>
      <div className="flex-1 border-t" />
    </div>
  );
}