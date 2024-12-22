import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Button,
  useMediaQuery,
  useTheme,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "@tanstack/react-router";
import UserMenu from "./userMenu";
import { useState } from "react";

export default function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const menuItems = [{ label: "Facilities", to: "/facilities" }];

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            <Typography variant="h6" component="div">
              Facilities Reservations
            </Typography>
          </Link>
          {isMobile ? (
            <>
              <IconButton
                edge="end"
                color="inherit"
                onClick={toggleDrawer(true)}
              >
                <MenuIcon />
              </IconButton>
              <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
              >
                <List
                  sx={{
                    width: 250,
                  }}
                >
                  {menuItems.map((item) => (
                    <ListItem
                      key={item.label}
                      component={Link}
                      to={item.to}
                      onClick={toggleDrawer(false)}
                    >
                      <ListItemText primary={item.label} />
                    </ListItem>
                  ))}
                </List>
              </Drawer>
            </>
          ) : (
            <Box sx={{ display: "flex", gap: 2 }}>
              {menuItems.map((item) => (
                <Button
                  key={item.label}
                  color="inherit"
                  component={Link}
                  to={item.to}
                >
                  {item.label}
                </Button>
              ))}
              <UserMenu />
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
