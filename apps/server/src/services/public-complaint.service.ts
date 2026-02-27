import { ComplaintModel } from "../model/complaint.model.js";
import { ApiError } from "@civic-pulse/utils";

/**
 * Register a public complaint without authentication
 * Creates a complaint with 'citizen' role and generates a unique reference ID
 */
export async function registerPublicComplaintService(complaintData: any, file?: any) {
  // Generate unique complaint ID
  const count = await ComplaintModel.countDocuments();
  const complaintId = `CMP-${new Date().getFullYear()}-${String(10001 + count).padStart(5, '0')}`;

  // Prepare complaint data
  const newComplaint = new ComplaintModel({
    complaintId,
    citizenName: complaintData.name,
    citizenAadhaar: complaintData.aadhaar?.replace(/\s/g, ''),
    citizenPhone: complaintData.mobile,
    citizenEmail: complaintData.email || null,
    title: complaintData.subject,
    description: complaintData.description,
    category: complaintData.category,
    priority: 'medium', // Default priority, will be updated by AI/admin
    status: 'pending',
    location: complaintData.gps || null,
    address: complaintData.address,
    city: complaintData.city,
    ward: complaintData.ward,
    image: file ? file.path : null,
    isPublicSubmission: true, // Flag to indicate public submission
    submittedBy: null, // No user ID for public submissions
  });

  await newComplaint.save();

  return {
    complaintId,
    referenceId: complaintId, // Same as complaint ID for easy tracking
    message: "Complaint registered successfully",
    trackingUrl: `/civic-pulse-portal?track=${complaintId}`,
    estimatedResolutionDays: 7 // Default estimate
  };
}

/**
 * Track complaint by reference ID
 * Returns public-safe complaint details with timeline
 */
export async function trackPublicComplaintService(complaintId: string) {
  const complaint: any = await ComplaintModel.findOne({ 
    complaintId: complaintId 
  }).select('-citizenAadhaar -__v');

  if (!complaint) {
    throw new ApiError(404, "Complaint not found. Please check your reference ID.", false);
  }

  // Build simple timeline based on status
  const timeline = [
    {
      action: 'Complaint Submitted',
      message: 'Your complaint has been registered successfully',
      timestamp: complaint.createdAt
    }
  ];

  if (complaint.status !== 'pending') {
    timeline.push({
      action: 'Complaint Reviewed',
      message: 'Your complaint is being processed',
      timestamp: complaint.updatedAt || complaint.createdAt
    });
  }

  if (complaint.status === 'resolved') {
    timeline.push({
      action: 'Complaint Resolved',
      message: 'Your complaint has been successfully resolved',
      timestamp: complaint.updatedAt || complaint.createdAt
    });
  } else if (complaint.status === 'rejected') {
    timeline.push({
      action: 'Complaint Rejected',
      message: 'Your complaint could not be processed',
      timestamp: complaint.updatedAt || complaint.createdAt
    });
  }

  // Mask sensitive information for public view
  const publicComplaint = {
    id: complaint.complaintId,
    complaintId: complaint.complaintId,
    referenceId: complaint.complaintId,
    status: complaint.status,
    category: complaint.category,
    priority: complaint.priority || 'medium',
    title: complaint.title,
    description: complaint.description,
    city: complaint.city || 'N/A',
    ward: complaint.ward || 'N/A',
    address: complaint.address || 'N/A',
    submittedDate: complaint.createdAt,
    lastUpdatedDate: complaint.updatedAt,
    
    // Masked sensitive data
    citizenName: complaint.citizenName || 'N/A',
    citizenPhone: complaint.citizenPhone ? maskPhoneNumber(complaint.citizenPhone) : 'N/A',
    mobile: complaint.citizenPhone ? maskPhoneNumber(complaint.citizenPhone) : 'N/A',
    
    // Timeline of actions
    timeline: timeline,
    
    // Estimated resolution
    estimatedResolution: calculateEstimatedResolution(complaint.createdAt, complaint.priority || 'medium')
  };

  return { data: publicComplaint };
}

/**
 * Search public complaints with filters
 * Returns limited information for privacy
 */
export async function searchPublicComplaintsService(filters: any) {
  const query: any = { isPublicSubmission: true }; // Only show public complaints
  
  // Build search query
  if (filters.query) {
    query.$or = [
      { complaintId: { $regex: filters.query, $options: 'i' } },
      { title: { $regex: filters.query, $options: 'i' } },
      { city: { $regex: filters.query, $options: 'i' } },
      { ward: { $regex: filters.query, $options: 'i' } }
    ];
  }

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.category) {
    query.category = filters.category;
  }

  if (filters.city) {
    query.city = { $regex: filters.city, $options: 'i' };
  }

  const complaints = await ComplaintModel.find(query)
    .select('complaintId title category status priority city ward createdAt citizenName citizenPhone')
    .sort({ createdAt: -1 })
    .limit(filters.limit || 50);

  // Mask sensitive data
  return {
    data: complaints.map((complaint: any) => ({
      id: complaint.complaintId || complaint._id.toString(),
      complaintId: complaint.complaintId || complaint._id.toString(),
      title: complaint.title,
      category: complaint.category,
      status: complaint.status,
      priority: complaint.priority || 'medium',
      city: complaint.city || 'N/A',
      ward: complaint.ward || 'N/A',
      date: complaint.createdAt,
      createdAt: complaint.createdAt,
      citizenName: complaint.citizenName || 'Anonymous',
      citizenPhone: complaint.citizenPhone ? maskPhoneNumber(complaint.citizenPhone) : 'N/A',
      mobile: complaint.citizenPhone ? maskPhoneNumber(complaint.citizenPhone) : 'N/A'
    }))
  };
}

/**
 * Helper: Mask phone number for privacy
 * Example: 9876543210 -> 98******10
 */
function maskPhoneNumber(phone: string): string {
  if (!phone || phone.length < 10) return phone;
  return phone.substring(0, 2) + '******' + phone.substring(8);
}

/**
 * Helper: Calculate estimated resolution date based on priority
 */
function calculateEstimatedResolution(submittedDate: Date, priority: string): Date {
  const days = priority === 'high' ? 3 : priority === 'medium' ? 7 : 14;
  const estimatedDate = new Date(submittedDate);
  estimatedDate.setDate(estimatedDate.getDate() + days);
  return estimatedDate;
}
