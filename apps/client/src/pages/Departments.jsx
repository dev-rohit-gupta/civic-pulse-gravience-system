import { useState, useEffect } from "react";
import { getAllDepartments, createDepartment, updateDepartment, deleteDepartment } from "../services/departmentService";
import { getAllCategories } from "../services/categoryService";

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // create | edit
  const [currentDept, setCurrentDept] = useState(null);
  
  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState({ show: false, message: "", type: "success" });

  useEffect(() => {
    fetchDepartments();
    fetchCategories();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await getAllDepartments();
      console.log('Fetched Departments:', response);
      setDepartments(response || []);
    } catch (error) {
      showNotification(error.message || "Failed to load departments", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getAllCategories();
      const cats = response.data || [];
      setCategories(cats);
      if (cats.length > 0 && !category) {
        setCategory(cats[0].name);
      }
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  };

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "success" }), 3000);
  };

  const openCreateModal = () => {
    setModalMode("create");
    setTitle("");
    setDescription("");
    setCategory(categories[0]?.name || "");
    setCurrentDept(null);
    setErrors({});
    setShowModal(true);
  };

  const openEditModal = (dept) => {
    setModalMode("edit");
    setTitle(dept.title);
    setDescription(dept.description || "");
    setCategory(dept.category?.name || dept.category);
    setCurrentDept(dept);
    setErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setTitle("");
    setDescription("");
    setErrors({});
    setCurrentDept(null);
  };

  const validate = () => {
    const e = {};
    if (!title.trim()) e.title = "Title is required";
    else if (title.trim().length < 3) e.title = "Title must be at least 3 characters";
    if (!description.trim()) e.description = "Description is required";
    else if (description.trim().length < 10) e.description = "Description must be at least 10 characters";
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
      const deptData = {
        title: title.trim(),
        description: description.trim(),
        category,
      };

      if (modalMode === "create") {
        await createDepartment(deptData);
        showNotification("Department created successfully!");
      } else {
        await updateDepartment(currentDept.id, deptData);
        showNotification("Department updated successfully!");
      }

      fetchDepartments();
      closeModal();
    } catch (error) {
      setErrors({ submit: error.message || "Operation failed" });
    }
  };

  const handleDelete = async (dept) => {
    if (!window.confirm(`Are you sure you want to delete "${dept.title}"?`)) return;

    try {
      await deleteDepartment(dept.id);
      showNotification("Department deleted successfully!");
      fetchDepartments();
    } catch (error) {
      showNotification(error.message || "Failed to delete department", "error");
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
            Departments
          </h1>
          <p style={{ color: "#718096", fontSize: "14px" }}>
            Manage all departments and their categories
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
          Create Department
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

      {/* Departments Grid */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#718096" }}>
          Loading departments...
        </div>
      ) : departments.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: "60px 20px",
          background: "#f9fafb",
          borderRadius: "12px",
          border: "2px dashed #d1d5db"
        }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🏢</div>
          <h3 style={{ fontSize: "18px", color: "#1a202c", marginBottom: "8px" }}>
            No Departments Yet
          </h3>
          <p style={{ color: "#718096", fontSize: "14px", marginBottom: "20px" }}>
            Create your first department to get started
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
            Create Department
          </button>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "20px"
        }}>
          {departments.map((dept) => (
            <div
              key={dept.id}
              style={{
                background: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
                padding: "20px",
                transition: "all 0.2s",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "12px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#1a202c", flex: 1 }}>
                  {dept.title}
                </h3>
                <span style={{
                  background: "#e0e7ff",
                  color: "#4338ca",
                  padding: "4px 12px",
                  borderRadius: "12px",
                  fontSize: "12px",
                  fontWeight: "500"
                }}>
                  {dept.category?.icon && `${dept.category.icon} `}{dept.category?.name || dept.category}
                </span>
              </div>
              
              <p style={{
                color: "#6b7280",
                fontSize: "14px",
                lineHeight: "1.5",
                marginBottom: "16px",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden"
              }}>
                {dept.description}
              </p>

              <div style={{
                display: "flex",
                gap: "8px",
                paddingTop: "16px",
                borderTop: "1px solid #f3f4f6"
              }}>
                <button
                  onClick={() => openEditModal(dept)}
                  style={{
                    flex: 1,
                    background: "#f3f4f6",
                    color: "#374151",
                    border: "none",
                    padding: "8px 16px",
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
                  onClick={() => handleDelete(dept)}
                  style={{
                    flex: 1,
                    background: "#fef2f2",
                    color: "#dc2626",
                    border: "none",
                    padding: "8px 16px",
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
            </div>
          ))}
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
              {modalMode === "create" ? "Create New Department" : "Edit Department"}
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
                }}>Department Name</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Water Supply Department"
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: errors.title ? "2px solid #ef4444" : "1px solid #d1d5db",
                    borderRadius: "6px",
                    fontSize: "14px",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                />
                {errors.title && (
                  <div style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>
                    {errors.title}
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
                }}>Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    fontSize: "14px",
                    outline: "none",
                    background: "#fff",
                    cursor: "pointer",
                    boxSizing: "border-box"
                  }}
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: "20px" }}>
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
                  placeholder="Describe the department's responsibilities..."
                  rows="4"
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
