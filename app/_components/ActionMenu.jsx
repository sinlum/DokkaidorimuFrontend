import React, { useState, useCallback } from "react";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";

const ActionMenu = React.memo(({ onUpdate, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleUpdate = useCallback(() => {
    onUpdate();
    setIsOpen(false);
  }, [onUpdate]);

  const handleDelete = useCallback(() => {
    onDelete();
    setIsOpen(false);
  }, [onDelete]);

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className="inline-flex w-full justify-center rounded-md bg-gradient-to-br from-amber-50 to-orange-100 px-2 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-orange-500"
          onClick={toggleMenu}
        >
          <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-gradient-to-br from-amber-50 to-orange-100 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <button
              onClick={handleUpdate}
              className="block w-full px-4 py-2 text-left text-sm text-gray-700 font-semibold hover:bg-gray-100 hover:text-gray-900"
            >
              Update
            </button>
            <button
              onClick={handleDelete}
              className="block w-full px-4 py-2 text-left text-sm text-gray-700 font-semibold hover:bg-gray-100 hover:text-gray-900"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

ActionMenu.displayName = "ActionMenu";

export default ActionMenu;
