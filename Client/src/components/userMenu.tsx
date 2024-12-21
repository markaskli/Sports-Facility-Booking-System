import { useState } from "react";
import { useUser } from "../contexts/userContext";
import { Button, Menu, MenuItem, Typography, Divider } from "@mui/material";
import { Link } from "@tanstack/react-router";

const UserMenu = () => {
  const { user, logout } = useUser();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      {!!user ? (
        <>
          <Button color="inherit" onClick={handleMenuOpen}>
            {user.userName}
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem disabled>
              <Typography variant="body2" color="text.secondary">
                {user.role ?? "Member"}
              </Typography>
            </MenuItem>

            <Divider />

            <MenuItem
              onClick={() => {
                logout();
                handleMenuClose();
              }}
            >
              Logout
            </MenuItem>
          </Menu>
        </>
      ) : (
        <Button color="inherit" component={Link} to="/login">
          Login
        </Button>
      )}
    </>
  );
};

export default UserMenu;
