
import { UserProfile } from "@/types/user";
import UnifiedCalendar from "./UnifiedCalendar";

interface CalendarModuleProps {
  userProfile: UserProfile;
}

const CalendarModule = ({ userProfile }: CalendarModuleProps) => {
  return <UnifiedCalendar userProfile={userProfile} />;
};

export default CalendarModule;
