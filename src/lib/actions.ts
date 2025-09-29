// This file re-exports all actions from the specific action files
// to maintain backward compatibility while organizing the code better

export {
  createOrganization,
  getOrganizations,
  getOrganization,
  updateOrganization,
  approveOrganization,
  rejectOrganization,
} from './actions/organization-actions'

export {
  createProject,
  getProjects,
  getProject,
  updateProject,
  approveProject,
  verifyProject,
  rejectProject,
  getProjectProofs,
  createProjectProof,
  uploadProof,
  closeProject,
} from './actions/project-actions'

export {
  signUpUser,
  signInUser,
  signOutUser,
  resetPassword,
} from './actions/user-actions'