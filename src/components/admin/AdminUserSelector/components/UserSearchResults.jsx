const UserSearchResults = ({ results, onSelect }) => {
  if (results.length === 0) return null;

  return (
    <div className="mt-3 bg-white dark:bg-gray-900 shadow rounded-md">
      {results.map((user) => (
        <div
          key={user._id}
          onClick={() => onSelect(user)}
          className="p-3 border-b cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800"
        >
          <h3 className="font-semibold">{user.fullname}</h3>
          <p className="text-sm text-gray-600">{user.username}</p>
          <p className="text-sm">{user.mobile}</p>
          <p className="text-sm">{user.gmail}</p>
        </div>
      ))}
    </div>
  );
};

export default UserSearchResults;
