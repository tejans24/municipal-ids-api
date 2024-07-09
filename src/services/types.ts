export enum SUPPORTED_CITY_SERVICES {
  LIBRARY = "library",
  WATER = "water",
  TRANSIT = "transit",
}

export type UserSubscribedService = {
  type: SUPPORTED_CITY_SERVICES;
  associatedId: string;
};

export type Address = {
  street: string;
  city: string;
  state: string;
  zip: string;
};

export class User {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  address: Address;
  services: UserSubscribedService[] = [];
  proofsOfId: ProofOfId[];
  residencyVerificationStatus?: RESIDENCY_VERIFICATION_STATUS;
  residencyVerificationRejectionReason?: string;

  constructor({
    firstName,
    lastName,
    phone,
    address,
    proofsOfId,
    email,
  }: {
    firstName: string;
    lastName: string;
    phone: string;
    address: Address;
    proofsOfId: ProofOfId[];
    email?: string;
  }) {
    this.id = this.generateLibraryCardID();
    this.services = [];
    this.firstName = firstName;
    this.lastName = lastName;
    this.phone = phone;
    this.address = address;
    this.proofsOfId = proofsOfId || [];
    this.email = email;
    this.residencyVerificationStatus =
      RESIDENCY_VERIFICATION_STATUS.NOT_VERIFIED;
  }

  private generateLibraryCardID(): string {
    let result = "";
    for (let i = 0; i < 12; i++) {
      result += Math.floor(Math.random() * 10).toString();
    }
    return result;
  }

  fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  updateResidencyVerificationStatus(
    status: RESIDENCY_VERIFICATION_STATUS,
    rejectionReason?: string,
  ): void {
    this.residencyVerificationStatus = status;
    this.residencyVerificationRejectionReason = rejectionReason;
  }

  isVerifiedCityResident(): boolean {
    return (
      this.residencyVerificationStatus ===
      RESIDENCY_VERIFICATION_STATUS.CITY_RESIDENCY_VERIFIED
    );
  }

  isVerifiedStateResident(): boolean {
    return (
      this.residencyVerificationStatus ===
      RESIDENCY_VERIFICATION_STATUS.STATE_RESIDENCY_VERIFIED
    );
  }
}

export type UpdateUser = {
  firstName?: string;
  lastName?: string;
  libraryCardID?: string;
  email?: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
  services?: UserSubscribedService[];
  proofsOfId?: ProofOfId[];
  residencyVerificationStatus?: RESIDENCY_VERIFICATION_STATUS;
  residencyVerificationRejectionReason?: string;
};

export type ProofOfId = {
  type: PROOF_OF_ID_TYPE;
  url: string;
};

export type VerifyUserResponse = {
  id: string;
  fullName: string;
  residencyVerificationStatus: RESIDENCY_VERIFICATION_STATUS;
  services: UserSubscribedService[];
};

export enum PROOF_OF_ID_TYPE {
  PASSPORT = "PASSPORT",
  DRIVERS_LICENSE = "DRIVERS_LICENSE",
  STATE_ID = "STATE_ID",
  OTHER = "OTHER",
}

export enum RESIDENCY_VERIFICATION_STATUS {
  NOT_VERIFIED = "NOT_VERIFIED",
  CITY_RESIDENCY_VERIFIED = "CITY_RESIDENCY_VERIFIED",
  STATE_RESIDENCY_VERIFIED = "STATE_RESIDENCY_VERIFIED",
  REJECTED = "REJECTED",
}

export const BALTIMORE_CITY = "Baltimore City";
