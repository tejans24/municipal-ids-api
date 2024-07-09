import { MunicipalIDService } from "./services/municipalIDService";
import { PROOF_OF_ID_TYPE, RESIDENCY_VERIFICATION_STATUS, User, UserSubscribedService } from "./services/types";
import { UserService } from "./services/userService";

const userService = new UserService();
const municipalIDService = new MunicipalIDService();

export type RegisterUserResponse = {
  message: string;
  id: string;
  cityResidencyStatus?: RESIDENCY_VERIFICATION_STATUS;
  services: UserSubscribedService[];
};

export const registerUser = async (requestUser: User): Promise<RegisterUserResponse | { error: string }> => {
  try {
    const municipalIdResponse = municipalIDService.issueMunicipalId(requestUser);
    console.log(municipalIdResponse);

    const resJson: RegisterUserResponse = {
      message: "User registered and city residency verified.",
      id: requestUser.id,
      cityResidencyStatus: requestUser.residencyVerificationStatus,
      services: requestUser.services,
    };

    return resJson;
  } catch (error) {
    return { error: (error as Error).message };
  }
};