import { Card, Typography, Button, CardActionArea } from "@mui/material";
import { Link } from "@tanstack/react-router";
import { ReservationDto } from "../../models/reservation";

interface TimeSlotCardProps {
  reservation: ReservationDto;
}

const ReservationCard = ({ reservation }: TimeSlotCardProps) => {
  return (
    <Card variant="outlined" sx={{ p: 2 }}>
      <Typography variant="body1" fontWeight="bold">
        {reservation.userName}
      </Typography>
      <Typography variant="body2" color="textSecondary">
        {reservation.userEmail}
      </Typography>
      <Typography variant="body2">
        Status: {reservation.reservationStatus}
      </Typography>
      <Typography variant="body2">
        Date: {new Date(reservation.reservationDate).toLocaleDateString()}
      </Typography>
      <Typography variant="body2">
        Participants: {reservation.numberOfParticipants}
      </Typography>
      <CardActionArea>
        <Button
          variant="text"
          component={Link}
          to={`reservations/${reservation.id}`}
          sx={{ mt: 1 }}
        >
          View Details
        </Button>
      </CardActionArea>
    </Card>
  );
};

export default ReservationCard;
