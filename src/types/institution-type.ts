/**
 * Operational statistics returned alongside the institution profile
 */
export interface InstitutionStats {
  totalStudents: number;
  totalTeachers: number;
  totalBatches: number;
}

/**
 * Institution profile and branding record
 */
export interface InstitutionProfile {
  id?: string;
  institutionName: string;
  institutionAddress: string;
  institutionPhone: string;
  institutionEmail: string;
  adminName?: string | null;
  adminPhone?: string | null;
  tagline?: string | null;
  logoUrl?: string | null;
  stats?: InstitutionStats;
  totalStudents?: number;
  totalTeachers?: number;
  totalBatches?: number;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Payload to update institution branding and contact profile (Admin only)
 */
export interface UpdateInstitutionDto {
  institutionName?: string;
  institutionAddress?: string;
  institutionPhone?: string;
  institutionEmail?: string;
  adminName?: string;
  adminPhone?: string;
  tagline?: string;
  logoUrl?: string;
}
