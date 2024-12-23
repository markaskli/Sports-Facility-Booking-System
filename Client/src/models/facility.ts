import { TimeSlotDto } from "./timeSlot";

type BaseFacilityDto = {
  name: string;
  address: string;
  description: string | null;
  pictureUrl: string | null;
  phoneNumber: string;
  emailAddress: string;
  maxNumberOfParticipants?: number | null | undefined;
  facilityTypeId: number;
};

export type FacilityDto = {
  id: number;
  facilityType: string;
  createdById: string;
  name: string;
  address: string;
  description: string | null;
  pictureUrl: string | null;
  phoneNumber: string;
  emailAddress: string;
  maxNumberOfParticipants: number | null;
  timeSlots: TimeSlotDto[];
};

export type CreateFacilityDto = BaseFacilityDto & {};
export type UpdateFacilityDto = BaseFacilityDto & {
  id: number;
};
