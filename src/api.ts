import { MunicipalIDService } from "./services/municipalIDService";
import {
  RESIDENCY_VERIFICATION_STATUS,
  User,
  UserSubscribedService,
  VerifyUserResponse,
} from "./services/types";

export type RegisterUserResponse = {
  message: string;
  id: string;
  cityResidencyStatus?: RESIDENCY_VERIFICATION_STATUS;
  services: UserSubscribedService[];
};

const municipalIDService = new MunicipalIDService();

/**
 * Registers a new user based on user details.
 *
 * @param requestUser - User details for registration
 * @returns RegisterUserResponse | { error: string }
 */
export const registerUser = async (
  requestUser: User,
): Promise<RegisterUserResponse | { error: string }> => {
  try {
    // Issue a municipal ID to the user and connect default services if applicable
    const municipalIdResponse =
      municipalIDService.issueMunicipalId(requestUser);
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

/**
 * Retrieves a user based on their ID.
 *
 * @param userId - ID of the user to be retrieved
 * @returns User | { error: string }
 */
export const getUser = async (
  userId: string,
): Promise<User | { error: string }> => {
  try {
    const user = municipalIDService.getUser(userId);
    if (!user) throw new Error("User not found");

    return user;
  } catch (error) {
    return { error: (error as Error).message };
  }
};

/**
 * Provides basic user verification details.
 *
 * @param userId - ID of the user to be verified
 * @returns VerifyUserResponse | { error: string }
 */
export const verifyUser = async (
  userId: string,
): Promise<{ error: string } | VerifyUserResponse> => {
  try {
    const user = municipalIDService.verifyUser(userId);
    if (!user) throw new Error("User not found");

    return user;
  } catch (error) {
    return { error: (error as Error).message };
  }
};
