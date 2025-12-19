const SelectedUserCard = ({ user, onConfirm }) => {
  if (!user) return null;

  return (
    <div className="mt-4 p-4 border rounded-md bg-blue-50 dark:bg-gray-800">
      <h2 className="text-xl font-bold mb-2">Selected User</h2>

      <p><strong>Name:</strong> {user.fullname}</p>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Mobile:</strong> {user.mobile}</p>
      <p><strong>Email:</strong> {user.gmail}</p>
      <p><strong>Address:</strong> {user.address}</p>
    </div>
  );
};

export default SelectedUserCard;
