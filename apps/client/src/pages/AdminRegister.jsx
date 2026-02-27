import { useState } from "react";
import { useNavigate } from "react-router";
import { registerUser } from "../services/authService";

export default function AdminRegister() {
  const navigate = useNavigate();
  
  // Admin details only
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | loading | success | error

  const validate = () => {
    const e = {};
    
    // Admin validation only
    if (!fullname.trim()) e.fullname = "Full name is required";
    else if (fullname.trim().length < 2) e.fullname = "Full name must be at least 2 characters";
    
    if (!email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email address";
    
    if (!phone.trim()) e.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(phone)) e.phone = "Enter a valid 10-digit phone number";
    
    if (!aadhaar.trim()) e.aadhaar = "Aadhaar number is required";
    else if (!/^\d{12}$/.test(aadhaar)) e.aadhaar = "Aadhaar must be exactly 12 digits";
    
    if (!password) e.password = "Password is required";
    else if (password.length < 8) e.password = "Password must be at least 8 characters";
    
    if (!confirmPassword) e.confirmPassword = "Please confirm your password";
    else if (password !== confirmPassword) e.confirmPassword = "Passwords do not match";
    
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    
    setErrors({});
    setStatus("loading");
    
    try {
      const registrationData = {
        fullname: fullname.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        aadhaar: aadhaar.trim(),
        password,
        role: "admin",
      };
      
      await registerUser(registrationData);
      setStatus("success");
      
      // Show success message and redirect to login
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 1500);
      
    } catch (error) {
      console.error('Admin registration error:', error);
      setStatus("error");
      setErrors({ 
        auth: error.message || "Registration failed. Please try again." 
      });
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    }}>
      <div style={{
        background: "#fff",
        borderRadius: "16px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        width: "100%",
        maxWidth: "600px",
        padding: "40px",
      }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{
            fontSize: "48px",
            marginBottom: "12px"
          }}>🛡️</div>
          <h1 style={{
            fontSize: "28px",
            fontWeight: "700",
            color: "#1a202c",
            marginBottom: "8px"
          }}>Admin Registration</h1>
          <p style={{
            color: "#718096",
            fontSize: "15px"
          }}>Create your admin account</p>
        </div>

        {/* Success Message */}
        {status === "success" && (
          <div style={{
            background: "#f0fdf4",
            border: "1px solid #86efac",
            borderRadius: "8px",
            padding: "12px 16px",
            marginBottom: "20px",
            color: "#166534",
            fontSize: "14px",
            textAlign: "center"
          }}>
            ✅ Admin account created successfully! Redirecting to login...
          </div>
        )}

        {/* Error Message */}
        {errors.auth && (
          <div style={{
            background: "#fef2f2",
            border: "1px solid #fca5a5",
            borderRadius: "8px",
            padding: "12px 16px",
            marginBottom: "20px",
            color: "#991b1b",
            fontSize: "14px"
          }}>
            ❌ {errors.auth}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Admin Details */}
          <div style={{ marginBottom: "24px" }}>

            {/* Full Name */}
            <div style={{ marginBottom: "16px" }}>
              <label style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "500",
                color: "#374151",
                marginBottom: "6px"
              }}>Full Name</label>
              <input
                type="text"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                placeholder="e.g., Rajesh Kumar"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: errors.fullname ? "2px solid #ef4444" : "1px solid #d1d5db",
                  borderRadius: "8px",
                  fontSize: "15px",
                  outline: "none",
                  transition: "all 0.2s",
                  boxSizing: "border-box"
                }}
                onFocus={(e) => e.target.style.borderColor = "#667eea"}
                onBlur={(e) => e.target.style.borderColor = errors.fullname ? "#ef4444" : "#d1d5db"}
              />
              {errors.fullname && (
                <div style={{ color: "#ef4444", fontSize: "13px", marginTop: "4px" }}>
                  {errors.fullname}
                </div>
              )}
            </div>

            {/* Email */}
            <div style={{ marginBottom: "16px" }}>
              <label style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "500",
                color: "#374151",
                marginBottom: "6px"
              }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@department.gov"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: errors.email ? "2px solid #ef4444" : "1px solid #d1d5db",
                  borderRadius: "8px",
                  fontSize: "15px",
                  outline: "none",
                  transition: "all 0.2s",
                  boxSizing: "border-box"
                }}
                onFocus={(e) => e.target.style.borderColor = "#667eea"}
                onBlur={(e) => e.target.style.borderColor = errors.email ? "#ef4444" : "#d1d5db"}
              />
              {errors.email && (
                <div style={{ color: "#ef4444", fontSize: "13px", marginTop: "4px" }}>
                  {errors.email}
                </div>
              )}
            </div>

            {/* Phone & Aadhaar in Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
              <div>
                <label style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#374151",
                  marginBottom: "6px"
                }}>Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="9876543210"
                  maxLength="10"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: errors.phone ? "2px solid #ef4444" : "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "15px",
                    outline: "none",
                    transition: "all 0.2s",
                    boxSizing: "border-box"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#667eea"}
                  onBlur={(e) => e.target.style.borderColor = errors.phone ? "#ef4444" : "#d1d5db"}
                />
                {errors.phone && (
                  <div style={{ color: "#ef4444", fontSize: "13px", marginTop: "4px" }}>
                    {errors.phone}
                  </div>
                )}
              </div>

              <div>
                <label style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#374151",
                  marginBottom: "6px"
                }}>Aadhaar</label>
                <input
                  type="text"
                  value={aadhaar}
                  onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, '').slice(0, 12))}
                  placeholder="123456789012"
                  maxLength="12"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: errors.aadhaar ? "2px solid #ef4444" : "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "15px",
                    outline: "none",
                    transition: "all 0.2s",
                    boxSizing: "border-box"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#667eea"}
                  onBlur={(e) => e.target.style.borderColor = errors.aadhaar ? "#ef4444" : "#d1d5db"}
                />
                {errors.aadhaar && (
                  <div style={{ color: "#ef4444", fontSize: "13px", marginTop: "4px" }}>
                    {errors.aadhaar}
                  </div>
                )}
              </div>
            </div>

            {/* Password & Confirm Password */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#374151",
                  marginBottom: "6px"
                }}>Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 8 characters"
                    style={{
                      width: "100%",
                      padding: "12px 40px 12px 16px",
                      border: errors.password ? "2px solid #ef4444" : "1px solid #d1d5db",
                      borderRadius: "8px",
                      fontSize: "15px",
                      outline: "none",
                      transition: "all 0.2s",
                      boxSizing: "border-box"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#667eea"}
                    onBlur={(e) => e.target.style.borderColor = errors.password ? "#ef4444" : "#d1d5db"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#6b7280",
                      padding: "4px"
                    }}
                  >
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
                {errors.password && (
                  <div style={{ color: "#ef4444", fontSize: "13px", marginTop: "4px" }}>
                    {errors.password}
                  </div>
                )}
              </div>

              <div>
                <label style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#374151",
                  marginBottom: "6px"
                }}>Confirm Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-type password"
                    style={{
                      width: "100%",
                      padding: "12px 40px 12px 16px",
                      border: errors.confirmPassword ? "2px solid #ef4444" : "1px solid #d1d5db",
                      borderRadius: "8px",
                      fontSize: "15px",
                      outline: "none",
                      transition: "all 0.2s",
                      boxSizing: "border-box"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#667eea"}
                    onBlur={(e) => e.target.style.borderColor = errors.confirmPassword ? "#ef4444" : "#d1d5db"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#6b7280",
                      padding: "4px"
                    }}
                  >
                    {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <div style={{ color: "#ef4444", fontSize: "13px", marginTop: "4px" }}>
                    {errors.confirmPassword}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={status === "loading" || status === "success"}
            style={{
              width: "100%",
              padding: "14px",
              background: status === "loading" ? "#9ca3af" : status === "success" ? "#10b981" : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: status === "loading" ? "not-allowed" : "pointer",
              transition: "all 0.3s",
              opacity: status === "loading" ? 0.7 : 1
            }}
          >
            {status === "loading" ? "Creating Admin..." : status === "success" ? "✅ Admin Created!" : "Register as Admin"}
          </button>

          {/* Back to Login */}
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <button
              type="button"
              onClick={() => navigate('/login')}
              style={{
                background: "none",
                border: "none",
                color: "#667eea",
                fontSize: "14px",
                cursor: "pointer",
                textDecoration: "underline"
              }}
            >
              ← Back to Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
