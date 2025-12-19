const UserSearchInput = ({ value, onChange }) => {
  return (
    <input
      type="text"
      placeholder="Search by username, mobile, email..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-3 border rounded-md bg-gray-100 dark:bg-gray-800"
    />
  );
};

export default UserSearchInput;
