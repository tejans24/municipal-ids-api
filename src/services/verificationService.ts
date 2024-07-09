import { RESIDENCY_VERIFICATION_STATUS, User } from "./types";

export type verifyProofsOfIdResponse = {
  status: RESIDENCY_VERIFICATION_STATUS,
  rejectionReason?: string
}

export class VerificationService {
  public verifyProofsOfId(user: User): verifyProofsOfIdResponse {
    // dummy verification check here
    if(user.proofsOfId.length >= 2)
      return {
        status: RESIDENCY_VERIFICATION_STATUS.CITY_RESIDENCY_VERIFIED
      }
    else
      return {
        status: RESIDENCY_VERIFICATION_STATUS.REJECTED,
        rejectionReason: "Name provided didn't match the documents."
      }
  }
}
