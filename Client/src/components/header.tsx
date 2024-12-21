import { AppBar, Toolbar, Box, Typography, Button } from "@mui/material";
import { Link } from "@tanstack/react-router";
import UserMenu from "./userMenu";

export default function Header() {
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Box
          sx={{ flexGrow: 1, display: "flex", justifyContent: "space-between" }}
        >
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            <Typography variant="h6" component="div">
              Facilities Reservations
            </Typography>
          </Link>
          <Box>
            <Button color="inherit" component={Link} to="/facilities">
              Facilities
            </Button>
          </Box>

          <UserMenu />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
