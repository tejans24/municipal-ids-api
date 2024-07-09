/**
 * This file contains the implementation of the MunicipalIDService class,
 * which is responsible for issuing municipal IDs to users based on residency verification.
 */

import {
  RESIDENCY_VERIFICATION_STATUS,
  User,
  VerifyUserResponse,
} from "./types";
import { VerificationService } from "./verificationService";
import { UserService } from "./userService";
import { MunicipalIDIntegrationService } from "./municipalIDIntegrationService";
import _ from "lodash";

export class MunicipalIDService {
  private verificationService: VerificationService;
  private userService: UserService;
  private municipalIDIntegrationService: MunicipalIDIntegrationService;

  constructor() {
    this.verificationService = new VerificationService();
    this.userService = new UserService();
    this.municipalIDIntegrationService = new MunicipalIDIntegrationService();
  }

  public issueMunicipalId(user: User): string | undefined {
    const response = this.verificationService.verifyProofsOfId(user);

    if (response.status === RESIDENCY_VERIFICATION_STATUS.NOT_VERIFIED) {
      return `User ${user.fullName()} is not a verified resident of Baltimore City.`;
    } else {
      user.residencyVerificationStatus = response.status;
      this.userService.addUser(user);

      switch (response.status) {
        case RESIDENCY_VERIFICATION_STATUS.CITY_RESIDENCY_VERIFIED:
          this.municipalIDIntegrationService.connectCityResidentDefaultServices(
            user.id,
          );
          return `Municipal Id issued to ${user.fullName()}.`;

        case RESIDENCY_VERIFICATION_STATUS.STATE_RESIDENCY_VERIFIED:
          this.municipalIDIntegrationService.connectOnlyLibraryService(user.id);
          return `Municipal Id issued just for library services to ${user.fullName()}.`;

        case RESIDENCY_VERIFICATION_STATUS.REJECTED:
          user.residencyVerificationRejectionReason = response.rejectionReason;
          return "User does not meet the criteria for a Municipal Id nor library services.";

        default:
          throw new Error("Invalid verification status");
      }
    }
  }

  public getUser(userId: string): User | undefined {
    return this.userService.getUserById(userId);
  }

  public verifyUser(userId: string): VerifyUserResponse | undefined {
    const user = this.userService.getUserById(userId);
    if (user) {
      return {
        ..._.pick(user, [
          "id",
          "fullName",
          "services",
          "residencyVerificationStatus",
          "residencyVerificationRejectionReason",
        ]),
        fullName: user.fullName(),
      } as VerifyUserResponse;
    }
    return undefined;
  }
}
