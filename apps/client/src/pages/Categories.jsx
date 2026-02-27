import { useState, useEffect } from "react";
import { getAllCategories, createCategory, updateCategory, deleteCategory } from "../services/categoryService";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // create | edit
  const [currentCat, setCurrentCat] = useState(null);
  
  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("📁");
  const [isActive, setIsActive] = useState(true);
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState({ show: false, message: "", type: "success" });

  const iconOptions = ["🚧", "💧", "⚡", "🗑️", "🏗️", "🚦", "🌳", "🏥", "🏫", "🚌", "📁", "🔧", "📋"];

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await getAllCategories();
      setCategories(response.data || []);
    } catch (error) {
      showNotification(error.message || "Failed to load categories", "error");
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "success" }), 3000);
  };

  const openCreateModal = () => {
    setModalMode("create");
    setName("");
    setDescription("");
    setIcon("📁");
    setIsActive(true);
    setCurrentCat(null);
    setErrors({});
    setShowModal(true);
  };

  const openEditModal = (cat) => {
    setModalMode("edit");
    setName(cat.name);
    setDescription(cat.description || "");
    setIcon(cat.icon || "📁");
    setIsActive(cat.isActive !== false);
    setCurrentCat(cat);
    setErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setName("");
    setDescription("");
    setIcon("📁");
    setIsActive(true);
    setErrors({});
    setCurrentCat(null);
  };

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = "Category name is required";
    else if (name.trim().length < 2) e.name = "Name must be at least 2 characters";
    if (!description.trim()) e.description = "Description is required";
    else if (description.trim().length < 5) e.description = "Description must be at least 5 characters";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    try {
      const catData = {
        name: name.trim(),
        description: description.trim(),
        icon,
        isActive,
      };

      if (modalMode === "create") {
        await createCategory(catData);
        showNotification("Category created successfully!");
      } else {
        await updateCategory(currentCat.id, catData);
        showNotification("Category updated successfully!");
      }

      fetchCategories();
      closeModal();
    } catch (error) {
      setErrors({ submit: error.message || "Operation failed" });
    }
  };

  const handleDelete = async (cat) => {
    if (!window.confirm(`Are you sure you want to delete "${cat.name}" category?`)) return;

    try {
      await deleteCategory(cat.id);
      showNotification("Category deleted successfully!");
      fetchCategories();
    } catch (error) {
      showNotification(error.message || "Failed to delete category", "error");
    }
  };

  const toggleActive = async (cat) => {
    try {
      await updateCategory(cat.id, { isActive: !cat.isActive });
      showNotification(`Category ${cat.isActive ? "deactivated" : "activated"} successfully!`);
      fetchCategories();
    } catch (error) {
      showNotification(error.message || "Failed to update category", "error");
    }
  };

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "24px"
      }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#1a202c", marginBottom: "4px" }}>
            Categories
          </h1>
          <p style={{ color: "#718096", fontSize: "14px" }}>
            Manage complaint categories and their status
          </p>
        </div>
        <button
          onClick={openCreateModal}
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "#fff",
            border: "none",
            padding: "12px 24px",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          <span style={{ fontSize: "18px" }}>+</span>
          Create Category
        </button>
      </div>

      {/* Notification */}
      {notification.show && (
        <div style={{
          background: notification.type === "success" ? "#f0fdf4" : "#fef2f2",
          border: `1px solid ${notification.type === "success" ? "#86efac" : "#fca5a5"}`,
          borderRadius: "8px",
          padding: "12px 16px",
          marginBottom: "20px",
          color: notification.type === "success" ? "#166534" : "#991b1b",
          fontSize: "14px"
        }}>
          {notification.type === "success" ? "✅" : "❌"} {notification.message}
        </div>
      )}

      {/* Categories Table */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#718096" }}>
          Loading categories...
        </div>
      ) : categories.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: "60px 20px",
          background: "#f9fafb",
          borderRadius: "12px",
          border: "2px dashed #d1d5db"
        }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>📂</div>
          <h3 style={{ fontSize: "18px", color: "#1a202c", marginBottom: "8px" }}>
            No Categories Yet
          </h3>
          <p style={{ color: "#718096", fontSize: "14px", marginBottom: "20px" }}>
            Create your first category to organize complaints
          </p>
          <button
            onClick={openCreateModal}
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "#fff",
              border: "none",
              padding: "10px 20px",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            Create Category
          </button>
        </div>
      ) : (
        <div style={{
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
        }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ background: "#f9fafb" }}>
              <tr>
                <th style={{
                  padding: "16px",
                  textAlign: "left",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#6b7280",
                  borderBottom: "1px solid #e5e7eb"
                }}>ICON</th>
                <th style={{
                  padding: "16px",
                  textAlign: "left",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#6b7280",
                  borderBottom: "1px solid #e5e7eb"
                }}>NAME</th>
                <th style={{
                  padding: "16px",
                  textAlign: "left",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#6b7280",
                  borderBottom: "1px solid #e5e7eb"
                }}>DESCRIPTION</th>
                <th style={{
                  padding: "16px",
                  textAlign: "center",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#6b7280",
                  borderBottom: "1px solid #e5e7eb"
                }}>STATUS</th>
                <th style={{
                  padding: "16px",
                  textAlign: "center",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#6b7280",
                  borderBottom: "1px solid #e5e7eb"
                }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                  <td style={{ padding: "16px", fontSize: "24px" }}>
                    {cat.icon || "📁"}
                  </td>
                  <td style={{ padding: "16px" }}>
                    <div style={{ fontSize: "14px", fontWeight: "600", color: "#1a202c" }}>
                      {cat.name}
                    </div>
                  </td>
                  <td style={{ padding: "16px" }}>
                    <div style={{ fontSize: "14px", color: "#6b7280", maxWidth: "400px" }}>
                      {cat.description}
                    </div>
                  </td>
                  <td style={{ padding: "16px", textAlign: "center" }}>
                    <button
                      onClick={() => toggleActive(cat)}
                      style={{
                        background: cat.isActive ? "#d1fae5" : "#fee2e2",
                        color: cat.isActive ? "#065f46" : "#991b1b",
                        border: "none",
                        padding: "6px 12px",
                        borderRadius: "12px",
                        fontSize: "12px",
                        fontWeight: "500",
                        cursor: "pointer",
                        transition: "all 0.2s"
                      }}
                    >
                      {cat.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td style={{ padding: "16px" }}>
                    <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                      <button
                        onClick={() => openEditModal(cat)}
                        style={{
                          background: "#f3f4f6",
                          color: "#374151",
                          border: "none",
                          padding: "6px 12px",
                          borderRadius: "6px",
                          fontSize: "13px",
                          fontWeight: "500",
                          cursor: "pointer",
                          transition: "background 0.2s"
                        }}
                        onMouseEnter={(e) => e.target.style.background = "#e5e7eb"}
                        onMouseLeave={(e) => e.target.style.background = "#f3f4f6"}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(cat)}
                        style={{
                          background: "#fef2f2",
                          color: "#dc2626",
                          border: "none",
                          padding: "6px 12px",
                          borderRadius: "6px",
                          fontSize: "13px",
                          fontWeight: "500",
                          cursor: "pointer",
                          transition: "background 0.2s"
                        }}
                        onMouseEnter={(e) => e.target.style.background = "#fee2e2"}
                        onMouseLeave={(e) => e.target.style.background = "#fef2f2"}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "20px"
        }} onClick={closeModal}>
          <div 
            style={{
              background: "#fff",
              borderRadius: "12px",
              width: "100%",
              maxWidth: "500px",
              padding: "24px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#1a202c", marginBottom: "20px" }}>
              {modalMode === "create" ? "Create New Category" : "Edit Category"}
            </h2>

            {errors.submit && (
              <div style={{
                background: "#fef2f2",
                border: "1px solid #fca5a5",
                borderRadius: "6px",
                padding: "10px 12px",
                marginBottom: "16px",
                color: "#991b1b",
                fontSize: "13px"
              }}>
                {errors.submit}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "16px" }}>
                <label style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#374151",
                  marginBottom: "6px"
                }}>Category Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Water Supply"
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: errors.name ? "2px solid #ef4444" : "1px solid #d1d5db",
                    borderRadius: "6px",
                    fontSize: "14px",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                />
                {errors.name && (
                  <div style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>
                    {errors.name}
                  </div>
                )}
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#374151",
                  marginBottom: "6px"
                }}>Icon</label>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(7, 1fr)",
                  gap: "8px"
                }}>
                  {iconOptions.map((ico) => (
                    <button
                      key={ico}
                      type="button"
                      onClick={() => setIcon(ico)}
                      style={{
                        padding: "12px",
                        border: icon === ico ? "2px solid #667eea" : "1px solid #d1d5db",
                        borderRadius: "6px",
                        background: icon === ico ? "#eef2ff" : "#fff",
                        fontSize: "24px",
                        cursor: "pointer",
                        transition: "all 0.2s"
                      }}
                    >
                      {ico}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#374151",
                  marginBottom: "6px"
                }}>Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe this category..."
                  rows="3"
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: errors.description ? "2px solid #ef4444" : "1px solid #d1d5db",
                    borderRadius: "6px",
                    fontSize: "14px",
                    outline: "none",
                    resize: "vertical",
                    fontFamily: "inherit",
                    boxSizing: "border-box"
                  }}
                />
                {errors.description && (
                  <div style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>
                    {errors.description}
                  </div>
                )}
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#374151"
                }}>
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    style={{ width: "16px", height: "16px", cursor: "pointer" }}
                  />
                  Active Category
                </label>
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  type="button"
                  onClick={closeModal}
                  style={{
                    flex: 1,
                    background: "#f3f4f6",
                    color: "#374151",
                    border: "none",
                    padding: "10px",
                    borderRadius: "6px",
                    fontSize: "14px",
                    fontWeight: "500",
                    cursor: "pointer"
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "#fff",
                    border: "none",
                    padding: "10px",
                    borderRadius: "6px",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer"
                  }}
                >
                  {modalMode === "create" ? "Create" : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
