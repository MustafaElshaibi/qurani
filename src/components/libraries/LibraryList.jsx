import { useDispatch, useSelector } from "react-redux";
import { deleteLibrary, renameLibrary, reorderLibraries, selectActiveLibrary, selectAllLibraries, setActiveLibrary } from "../../rtk/Reducers/LibraryReducer";
import { useNavigate } from "react-router-dom";
import { TbEdit } from "react-icons/tb";
import { FaDeleteLeft } from "react-icons/fa6";

const LibraryList = ({setContextMenu, setEditingLibraryId, editingLibraryId, editLibraryName, setEditLibraryName, setShowOnMobile}) => {
  const libraries = useSelector(selectAllLibraries);
  const activeLibraryId = useSelector(selectActiveLibrary);
  const dispatch = useDispatch();
  const navigate = useNavigate();


    const handleRenameLibrary = (libraryId) => {
      if (editLibraryName.trim()) {
        dispatch(renameLibrary({ libraryId, newName: editLibraryName.trim() }));
        setEditingLibraryId(null);
        setEditLibraryName("");
      }
    };
  
    const handleDragEnd = (event) => {
      const { active, over } = event;
      if (active.id !== over.id) {
        const oldIndex = libraries.findIndex((l) => l.id === active.id);
        const newIndex = libraries.findIndex((l) => l.id === over.id);
        dispatch(reorderLibraries({ startIndex: oldIndex, endIndex: newIndex }));
      }
    };
  
  

  const handleLibraryClick = (libraryId) => {
    dispatch(setActiveLibrary(libraryId));
    navigate(`/library/${libraryId}`);
    setShowOnMobile(false);
  };

  return (
    <div className="libraries-list max-h-[calc(100vh-650px)]  overflow-y-auto ">
              {libraries.map((library) => (
                <div
                  key={library.id}
                  className={`group flex items-center cursor-pointer justify-between transition-colors p-2 hover:bg-hover-black rounded ${
                    library.id === activeLibraryId.id
                      ? "bg-btns/20 border-l-4 border-btns "
                      : ""
                  }`}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    if (library.type === "user") {
                      setContextMenu({
                        x: e.clientX,
                        y: e.clientY,
                        library,
                      });
                    }
                  }}
                  onClick={() => handleLibraryClick(library.id)}
                >
                  {editingLibraryId === library.id ? (
                    <input
                      type="text"
                      value={editLibraryName}
                      onChange={(e) => setEditLibraryName(e.target.value)}
                      onBlur={() => handleRenameLibrary(library.id)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleRenameLibrary(library.id)
                      }
                      className="bg-transparent text-white flex-1"
                      autoFocus
                    />
                  ) : (
                    <span className="text-white truncate">{library.name}</span>
                  )}

                  {library.type === "user" && (
                    <div className="hidden group-hover:flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingLibraryId(library.id);
                          setEditLibraryName(library.name);
                        }}
                        className="text-gray-400 hover:text-white"
                      >
                        <TbEdit className="text-white size-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(deleteLibrary(library.id));
                        }}
                        className="text-red-500 hover:text-red-400"
                      >
                        <FaDeleteLeft className="text-white size-4" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
  );
};

export default LibraryList;