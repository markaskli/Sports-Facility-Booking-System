import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { TimeSlotDto } from "../../models/timeSlot";
import { formatTime, formatToDateOnly } from "../utils/dateUtils";
import { Link, useNavigate } from "@tanstack/react-router";

interface TimeSlotCardProps {
  timeSlot: TimeSlotDto;
}

const TimeSlotCard = ({ timeSlot }: TimeSlotCardProps) => {
  const formattedStartTime = formatTime(timeSlot.startTime);
  const formattedEndTime = formatTime(timeSlot.endTime);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">
          {formattedStartTime} - {formattedEndTime}
        </Typography>
        {timeSlot.reservations.length > 0 ? (
          <>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Reservations (Preview):
            </Typography>
            <ul>
              {timeSlot.reservations.slice(0, 3).map((reservation) => (
                <li key={reservation.id}>
                  {reservation.userName} -{" "}
                  {formatToDateOnly(reservation.reservationDate)}
                </li>
              ))}
            </ul>
            {timeSlot.reservations.length > 4 && (
              <Typography variant="body2" color="textSecondary">
                ...and {timeSlot.reservations.length - 4} more
              </Typography>
            )}
          </>
        ) : (
          <Typography variant="body2" color="textSecondary">
            No reservations yet.
          </Typography>
        )}
        <Button component={Link} to={`timeSlots/${timeSlot.id}`}>
          View Time Slot
        </Button>
      </CardContent>
    </Card>
  );
};

export default TimeSlotCard;
