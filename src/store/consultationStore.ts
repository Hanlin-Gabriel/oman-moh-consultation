import { create } from 'zustand';
import type {
  Appointment,
  ConsultationRecord,
  DocumentationMode,
  Diagnosis,
  Order,
  Prescription,
  Referral,
  ReviewOfSystems,
  PhysicalExam,
  FollowUp,
} from '../types';

interface ConsultationState {
  // Current appointment
  currentAppointment: Appointment | null;

  // Consultation record
  consultation: ConsultationRecord | null;

  // Workflow
  documentationMode: DocumentationMode;
  currentStep: number;
  showDomains: boolean;
  showAISummary: boolean;

  // Actions
  setCurrentAppointment: (apt: Appointment | null) => void;
  engageAppointment: (apt: Appointment) => void;
  setDocumentationMode: (mode: DocumentationMode) => void;
  setCurrentStep: (step: number) => void;
  setShowDomains: (show: boolean) => void;
  setShowAISummary: (show: boolean) => void;

  // Subjective
  updateChiefComplaint: (text: string) => void;
  updateHPI: (text: string) => void;
  updateROS: (ros: Partial<ReviewOfSystems>) => void;

  // Objective
  updatePhysicalExam: (pe: Partial<PhysicalExam>) => void;

  // Assessment
  addDiagnosis: (dx: Diagnosis) => void;
  removeDiagnosis: (id: string) => void;
  updateClinicalImpression: (text: string) => void;

  // Plan
  addOrder: (order: Order) => void;
  removeOrder: (id: string) => void;
  addPrescription: (rx: Prescription) => void;
  removePrescription: (id: string) => void;
  addReferral: (ref: Referral) => void;
  removeReferral: (id: string) => void;
  updatePatientEducation: (text: string) => void;
  updateTreatmentGoals: (text: string) => void;
  updateFollowUp: (fu: FollowUp) => void;

  // Evaluation
  updateEvaluationNotes: (text: string) => void;
  updateProgressNotes: (text: string) => void;
  updatePlanAdjustment: (text: string) => void;

  // Visit
  signConsultation: () => void;
  closeVisit: () => void;
  resetConsultation: () => void;
}

const createEmptyConsultation = (apt: Appointment): ConsultationRecord => ({
  id: `CONS-${Date.now()}`,
  appointmentId: apt.id,
  patientId: apt.patientId,
  doctorId: 'DR-001',
  visitType: apt.visitType,
  documentationMode: 'SOAPE',
  status: 'In Progress',
  startTime: new Date().toISOString(),
  chiefComplaint: '',
  historyOfPresentIllness: '',
  reviewOfSystems: {},
  physicalExam: {},
  diagnoses: [],
  clinicalImpression: '',
  orders: [],
  prescriptions: [],
  referrals: [],
  patientEducation: '',
  treatmentGoals: '',
  followUp: { recommended: false },
});

export const useConsultationStore = create<ConsultationState>((set) => ({
  currentAppointment: null,
  consultation: null,
  documentationMode: 'SOAPE',
  currentStep: 0,
  showDomains: false,
  showAISummary: false,

  setCurrentAppointment: (apt) => set({ currentAppointment: apt }),

  engageAppointment: (apt) =>
    set({
      currentAppointment: { ...apt, status: 'In Visit' },
      consultation: createEmptyConsultation(apt),
      currentStep: 0,
      showDomains: false,
      showAISummary: false,
    }),

  setDocumentationMode: (mode) =>
    set((state) => ({
      documentationMode: mode,
      consultation: state.consultation
        ? { ...state.consultation, documentationMode: mode }
        : null,
    })),

  setCurrentStep: (step) => set({ currentStep: step }),
  setShowDomains: (show) => set({ showDomains: show }),
  setShowAISummary: (show) => set({ showAISummary: show }),

  // Subjective
  updateChiefComplaint: (text) =>
    set((state) => ({
      consultation: state.consultation
        ? { ...state.consultation, chiefComplaint: text }
        : null,
    })),

  updateHPI: (text) =>
    set((state) => ({
      consultation: state.consultation
        ? { ...state.consultation, historyOfPresentIllness: text }
        : null,
    })),

  updateROS: (ros) =>
    set((state) => ({
      consultation: state.consultation
        ? {
            ...state.consultation,
            reviewOfSystems: { ...state.consultation.reviewOfSystems, ...ros },
          }
        : null,
    })),

  // Objective
  updatePhysicalExam: (pe) =>
    set((state) => ({
      consultation: state.consultation
        ? {
            ...state.consultation,
            physicalExam: { ...state.consultation.physicalExam, ...pe },
          }
        : null,
    })),

  // Assessment
  addDiagnosis: (dx) =>
    set((state) => ({
      consultation: state.consultation
        ? {
            ...state.consultation,
            diagnoses: [...state.consultation.diagnoses, dx],
          }
        : null,
    })),

  removeDiagnosis: (id) =>
    set((state) => ({
      consultation: state.consultation
        ? {
            ...state.consultation,
            diagnoses: state.consultation.diagnoses.filter((d) => d.id !== id),
          }
        : null,
    })),

  updateClinicalImpression: (text) =>
    set((state) => ({
      consultation: state.consultation
        ? { ...state.consultation, clinicalImpression: text }
        : null,
    })),

  // Plan
  addOrder: (order) =>
    set((state) => ({
      consultation: state.consultation
        ? { ...state.consultation, orders: [...state.consultation.orders, order] }
        : null,
    })),

  removeOrder: (id) =>
    set((state) => ({
      consultation: state.consultation
        ? {
            ...state.consultation,
            orders: state.consultation.orders.filter((o) => o.id !== id),
          }
        : null,
    })),

  addPrescription: (rx) =>
    set((state) => ({
      consultation: state.consultation
        ? {
            ...state.consultation,
            prescriptions: [...state.consultation.prescriptions, rx],
          }
        : null,
    })),

  removePrescription: (id) =>
    set((state) => ({
      consultation: state.consultation
        ? {
            ...state.consultation,
            prescriptions: state.consultation.prescriptions.filter((p) => p.id !== id),
          }
        : null,
    })),

  addReferral: (ref) =>
    set((state) => ({
      consultation: state.consultation
        ? {
            ...state.consultation,
            referrals: [...state.consultation.referrals, ref],
          }
        : null,
    })),

  removeReferral: (id) =>
    set((state) => ({
      consultation: state.consultation
        ? {
            ...state.consultation,
            referrals: state.consultation.referrals.filter((r) => r.id !== id),
          }
        : null,
    })),

  updatePatientEducation: (text) =>
    set((state) => ({
      consultation: state.consultation
        ? { ...state.consultation, patientEducation: text }
        : null,
    })),

  updateTreatmentGoals: (text) =>
    set((state) => ({
      consultation: state.consultation
        ? { ...state.consultation, treatmentGoals: text }
        : null,
    })),

  updateFollowUp: (fu) =>
    set((state) => ({
      consultation: state.consultation
        ? { ...state.consultation, followUp: fu }
        : null,
    })),

  // Evaluation
  updateEvaluationNotes: (text) =>
    set((state) => ({
      consultation: state.consultation
        ? { ...state.consultation, evaluationNotes: text }
        : null,
    })),

  updateProgressNotes: (text) =>
    set((state) => ({
      consultation: state.consultation
        ? { ...state.consultation, progressNotes: text }
        : null,
    })),

  updatePlanAdjustment: (text) =>
    set((state) => ({
      consultation: state.consultation
        ? { ...state.consultation, planAdjustment: text }
        : null,
    })),

  // Visit
  signConsultation: () =>
    set((state) => ({
      consultation: state.consultation
        ? {
            ...state.consultation,
            status: 'Signed',
            doctorSignature: 'Dr. Ahmed Al-Balushi',
            signedAt: new Date().toISOString(),
          }
        : null,
    })),

  closeVisit: () =>
    set((state) => ({
      currentAppointment: state.currentAppointment
        ? { ...state.currentAppointment, status: 'Completed' }
        : null,
      consultation: state.consultation
        ? {
            ...state.consultation,
            status: 'Completed',
            endTime: new Date().toISOString(),
          }
        : null,
    })),

  resetConsultation: () =>
    set({
      currentAppointment: null,
      consultation: null,
      documentationMode: 'SOAPE',
      currentStep: 0,
      showDomains: false,
      showAISummary: false,
    }),
}));
